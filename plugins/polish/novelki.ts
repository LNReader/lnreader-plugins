import { fetchApi, fetchFile } from "@libs/fetch";
import { Plugin } from "@typings/plugin";
import { Filters } from "@libs/filterInputs";
import { load as parseHTML } from "cheerio";
import { NovelStatus } from "@libs/novelStatus";

class NovelkiPL implements Plugin.PluginBase {
    id = "novelki.pl";
    name = "Novelki";
    icon = "src/pl/novelki/icon.png";
    site = "https://novelki.pl";
    version = "1.0.2";
    filters: Filters | undefined = undefined;

    async popularNovels(
        page: number,
        { showLatestNovels }: Plugin.PopularNovelsOptions,
    ): Promise<Plugin.NovelItem[]> {
        const body = await fetchApi(`${this.site}/projekty?page=${page}`).then((res) => res.text());
        const loadedCheerio = parseHTML(body);

        const load = loadedCheerio("#projects > div")
        if(load.length == 0) throw new Error("Failed to load page (open in web view and login)");

        const novels: Plugin.NovelItem[] = load
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
            if(text.includes("Status projektu:")) {
                switch (`${text.split(':')[1].trim()}`.toLowerCase()) {
                    case "wstrzymany":
                        novel.status = NovelStatus.OnHiatus;
                        break;
                    case "zakończony":
                        novel.status = NovelStatus.Completed;
                        break;
                    case "aktywny":
                        novel.status = NovelStatus.Ongoing;
                        break;
                    case "porzucony":
                        novel.status = NovelStatus.Cancelled;
                        break;
                    case "zlicencjonowany":
                        novel.status = NovelStatus.Licensed;
                        break;
                    default:
                        novel.status = NovelStatus.Unknown;
                        break;
                }
            }
            
        })
        novel.name = loadedCheerio("div").find("h3").text().trim();
        novel.cover = this.site+loadedCheerio(".row").find("img").attr("src");

        novel.genres = loadedCheerio("span.badge").map((i, e) => loadedCheerio(e).text()).get().join(", ")
        
        novel.summary = loadedCheerio('.h5:contains("Opis:")').next("p").next("p").text().trim()

        let chapters: Plugin.ChapterItem[] = [];

        loadedCheerio(".chapters > .col-md-3 > div").get().reverse().forEach((e, i) => {
            var pattern = /\/projekty\/([^\/]+)\/([^\/]+)/;
            let urlChapters = loadedCheerio(e).find("a").attr("href") || "";
            let codeChapter = pattern.exec(urlChapters) || "";
           
            const chapter: Plugin.ChapterItem = {
                name: loadedCheerio(e).find("a")?.text().trim(),
                path: codeChapter[2],
                releaseTime: loadedCheerio(e).find(".card-footer > span").text().trim().split('-').reverse().join('-'), 
                chapterNumber: i+1,
            };
            chapters.push(chapter);
        })

        novel.chapters = chapters;
        return novel;
    }
    async parseChapter(chapterPath: string): Promise<string> {
        const body = await fetchApi(`${this.site}/api/reader/chapters/${chapterPath}`).then((res) => res.json());

        const chapterText = body.data.content
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
