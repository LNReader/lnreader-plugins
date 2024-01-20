import { CheerioAPI, load as parseHTML } from "cheerio";
import { fetchFile } from "@libs/fetch";
import { Plugin } from "@typings/plugin";
import { isUrlAbsolute } from "@libs/isAbsoluteUrl";
import { NovelStatus } from "@libs/novelStatus";
class HakoPlugin implements Plugin.PluginBase {
    id: string;
    name: string;
    icon: string;
    site: string;
    version: string;

    constructor() {
        this.id = "ln.hako";
        this.name = "Hako";
        this.icon = "src/vi/hakolightnovel/icon.png";
        this.site = "https://ln.hako.vn";
        this.version = "1.0.0";
    }
    parseNovels(loadedCheerio: CheerioAPI) {
        const novels: Plugin.NovelItem[] = [];
        loadedCheerio("#mainpart .row .thumb-item-flow").each((index, ele) => {
            let url = loadedCheerio(ele)
                .find("div.thumb_attr.series-title > a")
                .attr("href");

            if (url && !isUrlAbsolute(url)) {
                url = this.site + url;
            }

            if (url) {
                const name = loadedCheerio(ele)
                    .find(".series-title")
                    .text()
                    .trim();
                let cover = loadedCheerio(ele)
                    .find(".img-in-ratio")
                    .attr("data-bg");

                if (cover && !isUrlAbsolute(cover)) {
                    cover = this.site + cover;
                }

                const novel = { name, url, cover };

                novels.push(novel);
            }
        });
        return novels;
    }
    async popularNovels(
        pageNo: number,
        options: Plugin.PopularNovelsOptions
    ): Promise<Plugin.NovelItem[]> {
        const link =
            this.site +
            "/danh-sach?truyendich=1&sapxep=topthang&page=" +
            pageNo;
        const result = await fetch(link);
        const body = await result.text();
        const loadedCheerio = parseHTML(body);
        return this.parseNovels(loadedCheerio);
    }
    async parseNovelAndChapters(novelUrl: string): Promise<Plugin.SourceNovel> {
        const novel: Plugin.SourceNovel = {
            url: novelUrl,
        };
        const result = await fetch(novelUrl);
        const body = await result.text();

        let loadedCheerio = parseHTML(body);

        novel.name = loadedCheerio(".series-name").text().trim();

        const background =
            loadedCheerio(".series-cover > .a6-ratio > div").attr("style") ||
            "";
        const novelCover = background.substring(
            background.indexOf("http"),
            background.length - 2
        );

        novel.cover = novelCover
            ? isUrlAbsolute(novelCover)
                ? novelCover
                : this.site + novelCover
            : "";

        novel.summary = loadedCheerio(".summary-content").text().trim();

        novel.genres = loadedCheerio(".series-information > div:nth-child(1)")
            .text()
            .trim()
            .split(/\n[\s\n]*/).join(',');
        
        novel.author = loadedCheerio('.series-information > div:nth-child(2) > .info-value')
            .text()
            .trim();
        novel.artist = loadedCheerio('.series-information > div:nth-child(3) > .info-value')
            .text()
            .trim();

        novel.status = loadedCheerio('.series-information > div:nth-child(4) > .info-value')
            .text()
            .trim();
        
        switch (novel.status) {
            case 'Đang tiến hành':
                novel.status = NovelStatus.Ongoing;
                break;
            case 'Tạm ngưng':
                novel.status = NovelStatus.OnHiatus;
                break;
            case 'Completed':
                novel.status = NovelStatus.Completed;
                break;
            default:
                novel.status = NovelStatus.Unknown;
        }

        let num = 0, part = 1;
        const chapters: Plugin.ChapterItem[] = loadedCheerio('.list-chapters li').toArray().map((ele) => {
            let chapterUrl = this.site + loadedCheerio(ele).find("a").attr("href");
            const chapterName = loadedCheerio(ele)
                .find(".chapter-name")
                .text()
                .trim();
            let chapterNumber = Number(chapterName.match(/Chương\s*(\d+)/i)?.[1]);
            if(chapterNumber){
                num = chapterNumber;
                part = 1;
            }else{
                chapterNumber = num + part / 10;
                part ++;
            }
            const chapterTime = loadedCheerio(ele)
                .find(".chapter-time")
                .text()
                .split('/')
                .map(x => Number(x));
            return {
                url: chapterUrl || '',
                name: chapterName,
                releaseTime: new Date(chapterTime[2], chapterTime[1], chapterTime[0]).toISOString(),
                chapterNumber: chapterNumber,
            };
        }).filter(c => c.url);

        novel.chapters = chapters;
        return novel;
    }
    async parseChapter(chapterUrl: string): Promise<string> {
        const result = await fetch(chapterUrl);
        const body = await result.text();

        const loadedCheerio = parseHTML(body);

        const chapterText = loadedCheerio("#chapter-content").html() || "";

        return chapterText;
    }
    async searchNovels(
        searchTerm: string,
        pageNo: number
    ): Promise<Plugin.NovelItem[]> {
        const url = this.site + "/tim-kiem?keywords=" + searchTerm + '&page=' + pageNo;        
        const result = await fetch(url);
        const body = await result.text();        
        const loadedCheerio = parseHTML(body);
        return this.parseNovels(loadedCheerio);
    }
    async fetchImage(url: string): Promise<string | undefined> {
        const headers = {
            Referer: "https://ln.hako.vn",
        };
        return await fetchFile(url, { headers: headers });
    }
}

export default new HakoPlugin();
