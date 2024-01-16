import { CheerioAPI, load as parseHTML } from "cheerio";
import { fetchApi, fetchFile } from "@libs/fetch";
import { FilterTypes, Filters } from "@libs/filterInputs";
import { Plugin } from "@typings/plugin";
import { defaultCover } from "@libs/defaultCover";

class DDLPlugin implements Plugin.PluginBase {
    id = "DDL.com";
    name = "Divine Dao Library";
    site = "https://www.divinedaolibrary.com/";
    version = "1.0.0";
    icon = "src/en/divinedaolibrary/icon.png";
    userAgent = "";
    parseNovels(loadedCheerio: CheerioAPI, searchTerm?: string){
        let novels: Plugin.NovelItem[] = [];

        loadedCheerio("#main")
            .find("li")
            .each(function () {
                const novelName = loadedCheerio(this).find("a").text();
                const novelCover = defaultCover;
                const novelUrl = loadedCheerio(this).find(" a").attr("href");
    
                if (!novelUrl) return;
    
                const novel = {
                    name: novelName,
                    cover: novelCover,
                    url: novelUrl,
                };
    
                novels.push(novel);
            });
    
        if (searchTerm) {
            novels = novels.filter((novel) =>
                novel.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return novels;
    };

    async popularNovels(
        pageNo: number,
        { filters }: Plugin.PopularNovelsOptions
    ): Promise<Plugin.NovelItem[]> {
        let link = this.site + "novels";

        const headers = new Headers();
        const body = await fetchApi(link, { headers }).then((result) =>
            result.text()
        );

        const loadedCheerio = parseHTML(body);
        return this.parseNovels(loadedCheerio);
    }

    async parseNovelAndChapters(novelUrl: string): Promise<Plugin.SourceNovel> {
        const url = novelUrl;
        const headers = new Headers();
        const result = await fetchApi(url, { headers });
        const body = await result.text();

        let loadedCheerio = parseHTML(body);

        const novel: Plugin.SourceNovel = {
            url,
            chapters: [],
        };

        novel.name = loadedCheerio("h1.entry-title").text().trim();

        novel.cover =
            loadedCheerio(".entry-content").find("img").attr("data-ezsrc") ||
            defaultCover;

        novel.summary = loadedCheerio("#main > article > div > p:nth-child(6)")
            .text()
            .trim();

        novel.author = loadedCheerio("#main > article > div > h3:nth-child(2)")
            .text()
            .replace(/Author:/g, "")
            .trim();

        const chapter: Plugin.ChapterItem[] = [];

        loadedCheerio("#main")
            .find("li > span > a")
            .each(function () {
                const chapterName = loadedCheerio(this).text().trim();
                const releaseDate = null;
                const chapterUrl = loadedCheerio(this).attr("href");

                if (!chapterUrl) return;

                chapter.push({
                    name: chapterName,
                    releaseTime: releaseDate,
                    url: chapterUrl,
                });
            });

        novel.chapters = chapter;

        return novel;
    };

    async parseChapter(chapterUrl: string): Promise<string> {
        const headers = new Headers();
        const result = await fetchApi(chapterUrl, { headers });
        const body = await result.text();

        const loadedCheerio = parseHTML(body);

        const chapterName = loadedCheerio(".entry-title").text().trim();

        let chapterText = loadedCheerio(".entry-content").html();

        if (!chapterText) {
            chapterText = loadedCheerio(".page-header").html();
        }

        chapterText = `<p><h1>${chapterName}</h1></p>` + chapterText;

        return chapterText;
    };

    async searchNovels(
        searchTerm: string,
        pageNo: number
    ): Promise<Plugin.NovelItem[]> {
        let url = this.site + "novels";
        
        const headers = new Headers();
        const result = await fetchApi(url, { headers });
        const body = await result.text();

        const loadedCheerio = parseHTML(body);
        return this.parseNovels(loadedCheerio, searchTerm);
    };


    async fetchImage(url: string): Promise<string | undefined> {
        return await fetchFile(url);
    }
}
export default new DDLPlugin();