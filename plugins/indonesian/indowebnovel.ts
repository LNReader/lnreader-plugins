import { CheerioAPI, load, load as parseHTML } from "cheerio";
import { fetchApi, fetchFile } from "@libs/fetch";
import { Plugin } from "@typings/plugin";
import { defaultCover } from "@libs/defaultCover";
import { Filters } from "@libs/filterInputs";

class IndoWebNovel implements Plugin.PluginBase {
    id = "IDWN.id";
    name = "IndoWebNovel";
    icon = "src/id/indowebnovel/icon.png";
    site = "https://indowebnovel.id/id/";
    filters?: Filters | undefined;
    version = "1.0.0";
    parseNovels(loadedCheerio:CheerioAPI, searchTerm?: string) {
       let novels: Plugin.NovelItem[] = [];

        loadedCheerio(".novellist-blc li").each((i,el) => {
            const novelName = loadedCheerio(el).find("a").text();
            const novelCover = defaultCover;
            const novelUrl = loadedCheerio(el).find("a").attr("href");

            if (!novelUrl || !novelName) return;

            const novel = {
                name: novelName,
                cover: novelCover,
                path: novelUrl.replace(this.site, ''),
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

    async popularNovels(pageNo: number, options: Plugin.PopularNovelsOptions<Filters>): Promise<Plugin.NovelItem[]> {
        const url = `${this.site}daftar-novel/`;

        const result = await fetchApi(url);
        const body = await result.text();

        const loadedCheerio = parseHTML(body);
        return this.parseNovels(loadedCheerio)
    }

    async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
        const result = await fetchApi(this.site + novelPath);
        const body = await result.text();

        const loadedCheerio = parseHTML(body);
        loadedCheerio(".series-synops div").remove();

        const novel: Plugin.SourceNovel = {
            path: novelPath,
            name: loadedCheerio(".series-title").text().trim() || "Untitled",
            cover: loadedCheerio(".series-thumb img").attr("src"),
            author: loadedCheerio("ul.series-infolist b:contains('Author') +").text().trim(),
            status: loadedCheerio(".status").text().trim(),
            summary: loadedCheerio(".series-synops").text().trim(),
            chapters: [],
        };

        novel.genres = loadedCheerio(".series-genres a")
            .map((i,el) => loadedCheerio(el).text().trim())
            .toArray()
            .join(',');

        const chapters: Plugin.ChapterItem[] = [];

        loadedCheerio(".series-chapterlist li").each((i,el) => {
            const chapterName = loadedCheerio(el).find("a").text().trim();
            const chapterUrl = loadedCheerio(el).find("a").attr("href");

            if (!chapterUrl) return;

            chapters.push({
                name: chapterName,
                path: chapterUrl.replace(this.site, ''),
            });
        });

        novel.chapters = chapters.reverse();

        return novel;
    }

    async parseChapter(chapterPath: string): Promise<string> {
        const result = await fetchApi(this.site + chapterPath);
        const body = await result.text();

        const loadedCheerio = parseHTML(body);

        const chapterText = loadedCheerio(".readerss").html() || '';

        return chapterText;
    }

    async searchNovels(searchTerm: string, pageNo: number): Promise<Plugin.NovelItem[]> {
        const url = `${this.site}daftar-novel/`;

        const result = await fetchApi(url);
        const body = await result.text();

        const loadedCheerio = parseHTML(body);
        return this.parseNovels(loadedCheerio, searchTerm)
    }

    async fetchImage(url: string): Promise<string | undefined> {
        return fetchFile(url);
    }

}

export default new IndoWebNovel();
