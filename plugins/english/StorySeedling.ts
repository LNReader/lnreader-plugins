import { Plugin } from "@typings/plugin";
import puppeteer from 'puppeteer';
import { fetchApi, fetchFile } from "@libs/fetch";
import { load, load as parseHTML } from "cheerio";
import { defaultCover } from "@libs/defaultCover";
import { NovelStatus } from "@libs/novelStatus";
import { log } from "console";
// import { isUrlAbsolute } from "@libs/isAbsoluteUrl";
// import { parseMadaraDate } from "@libs/parseMadaraDate";

class StorySeedlingPlugin implements Plugin.PluginBase {
    id = "storyseedling";
    name = "StorySeedling";
    icon = "src/en/storyseedling/icon.png";
    site = "https://storyseedling.com/";
    version = "1.0.0";
    baseUrl = this.site;

    async popularNovels(pageNo: number): Promise<Plugin.NovelItem[]> {
      const url = `${this.baseUrl}browse/?curpage=${pageNo}`;

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'domcontentloaded' });

        // Wait for some time to let dynamic content load
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
        const body = await page.content();

        const loadedCheerio = parseHTML(body);

        let novels: Plugin.NovelItem[] = [];

        loadedCheerio(".bg-accent").each(function () {
            const novelName = loadedCheerio(this).find(".grid-in-title").text();
            const novelCover = loadedCheerio(this).find(".grid-in-art img").attr("src");
            const novelUrl = loadedCheerio(this).find(".grid-in-title").attr("href");

            if (!novelUrl) return;

            const novel = {
                name: novelName,
                cover: novelCover,
                url: novelUrl,
            };

            novels.push(novel);
        });

        await browser.close();

        return novels;
    }

    async parseNovelAndChapters(novelUrl: string): Promise<Plugin.SourceNovel> {
        const novel: Plugin.SourceNovel = {
            url: novelUrl,
        };

        const body = await fetchApi(novelUrl).then((r) => r.text());


        const loadedCheerio = parseHTML(body);
        
        novel.name = loadedCheerio("h1").text().trim();

        //novel.artist = "";
        //novel.author = "";
        novel.cover = loadedCheerio('img[x-ref="art"].w-full.rounded.shadow-md').attr("src");
        if (!novel.cover) {
            novel.cover = defaultCover;
        }
        let genres:string[] = [];
        loadedCheerio('section[x-data="{ tab: location.hash.substr(1) || \'chapters\' }"].relative > div > div > div.flex.flex-wrap > a').each(function(){
            genres.push(loadedCheerio(this).text().trim());
        });
        novel.genres = genres.join(", ");
        // novel.status = NovelStatus.Completed;
        novel.summary = loadedCheerio("div.mb-4.order-2:not(.lg\\:grid-in-buttons)").text().trim().replace(/(\r\n|\n|\r)/gm, "");

        let chapters: Plugin.ChapterItem[] = [];

        loadedCheerio("div.grid.w-full.grid-cols-1.gap-4.md\\:grid-cols-2 > a").each(function() {
            if(loadedCheerio(this).find("> div").length == 2){
                return;
            }
            let name = loadedCheerio(this).find(".truncate").text().trim();
            let url = loadedCheerio(this).attr("href") as string;
            let releaseTime = loadedCheerio(this).find("div > div > small").text().trim();
            let chapterNumber = name.split("-")[0].trim().split(" ")[1];
            const chapter: Plugin.ChapterItem = {
                name: name,
                url: url,
                releaseTime: releaseTime,
                chapterNumber: parseInt(chapterNumber),
            };
            chapters.push(chapter);
        });
        novel.chapters = chapters;
        return novel;
    }
    async parseChapter(chapterUrl: string): Promise<string> {
        const body = await fetchApi(chapterUrl).then((r) => r.text());

        const loadedCheerio = parseHTML(body);
        let t = loadedCheerio("div.justify-center > div.mb-4");
        log(t);
        let chapterText = t.html() || '';

        return chapterText;
    }
    
    async searchNovels(searchTerm: string, pageNo: number): Promise<Plugin.NovelItem[]> {
        let novels: Plugin.NovelItem[] = [];
        let url = "https://storyseedling.com/ajax";

        var data = new FormData();
        data.set("search", searchTerm);
        data.set("orderBy", "recent");
        data.set("curpage", pageNo.toString());
        data.set("post", "496e529f01");
        data.set("action", "fetch_browse");

        var response = await(await fetchApi(url, {body: data, method: "POST"})).json();

        response.data.posts.forEach((element: any) => {
            const novel = {
                name: element.title,
                cover: element.thumbnail,
                url: element.permalink,
            };
            novels.push(novel);
        });

        return novels;
    }
    async fetchImage(url: string): Promise<string | undefined> {
        return fetchFile(url);
    }
}

export default new StorySeedlingPlugin();
