import { CheerioAPI, load as parseHTML } from "cheerio";
import { fetchFile } from "@libs/fetch";
import { Plugin } from "@typings/plugin";
import { Filters } from "@libs/filterInputs";
import { NovelStatus } from "@libs/novelStatus";

class TruyenFull implements Plugin.PluginBase {
    id = "truyenfull";
    name = "Truyện Full";
    icon = "src/vi/truyenfull/icon.png";
    site = "https://truyenfull.vn";
    version = "1.0.0";

    parseNovels(loadedCheerio: CheerioAPI){
        const novels: Plugin.NovelItem[] = [];
        loadedCheerio(".list-truyen .row").each((idx, ele) => {
            const novelName = loadedCheerio(ele)
                .find("h3.truyen-title > a")
                .text();

            const novelCover = loadedCheerio(ele).find("div[data-classname='cover']").attr("data-image");

            const novelUrl = loadedCheerio(ele)
                    .find("h3.truyen-title > a")
                    .attr("href");
            if(novelUrl){
                novels.push({
                    name: novelName,
                    cover: novelCover,
                    url: novelUrl
                });
            }
        });
        return novels;
    }

    async popularNovels(pageNo: number, options: Plugin.PopularNovelsOptions<Filters>): Promise<Plugin.NovelItem[]> {
        const url = `${this.site}/danh-sach/truyen-hot/trang-${pageNo}/`;

        const result = await fetch(url);
        const body = await result.text();

        const loadedCheerio = parseHTML(body);

        return this.parseNovels(loadedCheerio);
    }
    async parseNovelAndChapters(novelUrl: string): Promise<Plugin.SourceNovel> {
        const url = novelUrl;
        
        const result = await fetch(url);
        const body = await result.text();

        let loadedCheerio = parseHTML(body);

        const novel: Plugin.SourceNovel = {
            url,
            chapters: [],
        };

        novel.name = loadedCheerio("div.book > img").attr("alt");

        novel.cover = loadedCheerio("div.book > img").attr("src");

        novel.summary = loadedCheerio("div.desc-text").text().trim();

        novel.author = loadedCheerio('h3:contains("Tác giả:")')
            .parent()
            .contents()
            .text()
            .replace("Tác giả:", "");

        novel.genres = loadedCheerio('h3:contains("Thể loại")')
            .siblings()
            .map((i, el) => loadedCheerio(el).text())
            .toArray()
            .join(",");

        novel.status = loadedCheerio('h3:contains("Trạng thái")').next().text();
        if(novel.status === "Full"){
            novel.status = NovelStatus.Completed;
        }else if(novel.status === 'Đang ra'){
            novel.status = NovelStatus.Ongoing;
        }else{
            novel.status = NovelStatus.Unknown;
        }

        let lastPage = 1;
        loadedCheerio('ul.pagination.pagination-sm > li').each(function() {
            const page = Number(loadedCheerio(this).text());
            if(page && page > lastPage) lastPage = page;      
        });

        const lastPageUrl = novelUrl + 'trang-' + lastPage + '/';
        const res = await fetch(lastPageUrl).then(res => res.text());
        loadedCheerio = parseHTML(res);
        const lastChapterUrl = loadedCheerio('ul.list-chapter > li:last-child > a').attr('href');
        const lastChapter = Number(lastChapterUrl?.match(/\/chuong-(\d+)\//)?.[1]) || 1;
        const chapters: Plugin.ChapterItem[] = [];
        for(let i = 1; i <= lastChapter; i++){
            chapters.push({
                name: 'Chương ' + i,
                url: novelUrl + 'chuong-'+ i + '/',
            })
        }
        novel.chapters = chapters;
        return novel;
    }
    async parseChapter(chapterUrl: string): Promise<string> {
        const result = await fetch(chapterUrl);
        const body = await result.text();

        const loadedCheerio = parseHTML(body);

        let chapterText = (loadedCheerio(".chapter-title").html() || '') + (loadedCheerio('#chapter-c').html() || '');

        return chapterText;
    }
    async searchNovels(searchTerm: string, pageNo: number): Promise<Plugin.NovelItem[]> {
        const searchUrl = `${this.site}/tim-kiem?tukhoa=${searchTerm}&page=${pageNo}`;

        const result = await fetch(searchUrl);
        const body = await result.text();

        const loadedCheerio = parseHTML(body);
        return this.parseNovels(loadedCheerio)
    }
    async fetchImage(url: string): Promise<string | undefined> {
        return fetchFile(url);
    }

}

export default new TruyenFull();
