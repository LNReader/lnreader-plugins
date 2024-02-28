import { fetchApi, fetchFile } from "@libs/fetch";
import { Plugin } from "@typings/plugin";
import { Filters } from "@libs/filterInputs";
import puppeteer from "puppeteer"
import { load as loadCheerio } from "cheerio";
import { load as parseHTML } from "cheerio";
// import { isUrlAbsolute } from "@libs/isAbsoluteUrl";
// import { parseMadaraDate } from "@libs/parseMadaraDate";

class NovelkiPL implements Plugin.PluginBase {
    id = "novelki.pl";
    name = "Novelki";
    icon = "src/pl/novelki/icon.png";
    site = "https://novelki.pl";
    version = "1.0.0";
    filters: Filters | undefined = undefined;

    async popularNovels(
        page: number,
        { showLatestNovels }: Plugin.PopularNovelsOptions,
    ): Promise<Plugin.NovelItem[]> {
        const body = await fetchApi(`${this.site}/projekty?page=${page}`).then((res) => res.text());
        const loadedCheerio = parseHTML(body);

        const novels: Plugin.NovelItem[] = loadedCheerio("#projects > div")
        .map((index, element) => ({
            name: loadedCheerio(element).find(".card-title").attr('title') as string,
            cover: this.site+loadedCheerio(element).find(".card-img-top").attr("src"),
            path: loadedCheerio(element).find("a").attr("href") || "",
          }))
          .get()
          .filter((novel) => novel.name && novel.path);
        return novels;
    }
    
    async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
        const body = await fetchApi(this.site + novelPath).then((r) => r.text());
        const loadedCheerio = parseHTML(body);

        const novel: Plugin.SourceNovel = {
            path: novelPath,
            name: ''
        };
       
        loadedCheerio("p.h5").each((i, e) => {
            const text = loadedCheerio(e).text().trim()
            if(text.includes('Autor:')) novel.author = text.split(':')[1].trim()
            if(text.includes("Status projektu:")) novel.status = text.split(':')[1].trim()
            
        })
        novel.name = loadedCheerio("div").find("h3").text().trim();
        novel.cover = this.site+loadedCheerio(".row").find("img").attr("src");

        novel.genres = loadedCheerio("span.badge").map((i, e) => loadedCheerio(e).text()).get().join(", ")
        
        novel.summary = loadedCheerio("p > em").text().trim()

        let chapters: Plugin.ChapterItem[] = [];

        loadedCheerio(".chapters > .col-md-3 > div").get().reverse().forEach((e, i) => {
            const chapter: Plugin.ChapterItem = {
                name: loadedCheerio(e).find("a")?.text().trim(),
                path: loadedCheerio(e).find("a").attr("href") || "", 
                releaseTime: loadedCheerio(e).find(".card-footer > span").text().trim(),
                chapterNumber: i+1,
            };
            chapters.push(chapter);
        })

        novel.chapters = chapters;
        return novel;
    }
    async parseChapter(chapterPath: string): Promise<string> {

        // const browser = await puppeteer.launch();
        // const page = await browser.newPage();

        // await page.setCookie({ name: "novelki_session", value: "eyJpdiI6ImgzZ2Fxd0FVNWRcLzBLU1BEZkQxVVhRPT0iLCJ2YWx1ZSI6IjBSN3VhM3Z5d3Q5RFwvaG1kTlNFOFpLOXpmY1BmTHJsKzU2SnFCcnpzblZmT0EyVDBQR3VFM0pCd2R6SkRHYnpVIiwibWFjIjoiMmYyNDUyZWNmMTM1OTZkZTg3N2E3NDhmMGY1ZDIyMTZjNzc0ZmVlZDgwNWQ1ODI4NzA3MGFlN2I3MzJhZGUyOCJ9", domain: "novelki.pl"})

        // await page.goto(this.site + chapterPath)
        // await page.waitForSelector('div.reader-content');
        
        // const chapterText = await page.$eval('div.reader-content', element => element.innerHTML)
        const chapterText = "null"
        return chapterText;
    }
    async searchNovels(
        searchTerm: string,
        page: number
    ): Promise<Plugin.NovelItem[]> {
        const body = await fetchApi(`${this.site}/projekty?filter=t&title=${searchTerm}+&page=${page}`).then((res) => res.text());
        const loadedCheerio = parseHTML(body);


        let novels: Plugin.NovelItem[] = loadedCheerio("#projects > div")
        .map((index, element) => ({
            name: loadedCheerio(element).find(".card-title").attr('title') as string,
            cover: this.site+loadedCheerio(element).find(".card-img-top").attr("src"),
            path: loadedCheerio(element).find("a").attr("href") || "",
          }))
          .get()
          .filter((novel) => novel.name && novel.path)

        return novels;
    }
    async fetchImage(url: string): Promise<string | undefined> {
        // if your plugin has images and they won't load
        // this is the function to fiddle with
        return fetchFile(url);
    }
}

export default new NovelkiPL();
