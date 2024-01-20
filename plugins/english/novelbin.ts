import { load as parseHTML } from "cheerio";
import { fetchApi, fetchFile } from "@libs/fetch";
import { Plugin } from "@typings/plugin";
import { Filters } from "@libs/filterInputs";

class NovelBin implements Plugin.PluginBase {
    id = "novelbin";
    name = "Novel Bin";
    icon = "src/en/novelbin/icon.png";
    site = "https://novelmax.net/";
    filters?: Filters | undefined;
    version = "1.0.0";
    baseUrl = this.site;
    async popularNovels(pageNo: number, options: Plugin.PopularNovelsOptions<Filters>): Promise<Plugin.NovelItem[]> {
        const url = `${this.baseUrl}sort/p/?page=${pageNo}`;

        const body = await fetchApi(url).then((r) => r.text());        

        const loadedCheerio = parseHTML(body);

        let novels: Plugin.NovelItem[] = [];

        loadedCheerio(".col-novel-main .list-novel .row").each(function () {
            const novelName = loadedCheerio(this).find("h3.novel-title > a").text();
            const novelCover = loadedCheerio(this).find("img.cover").attr("src");
            const novelUrl = loadedCheerio(this)
                .find("h3.novel-title > a")
                .attr("href");

            if (!novelUrl) return;

            const novel = {
                name: novelName,
                cover: novelCover,
                url: novelUrl,
            };

            novels.push(novel);
        });

        return novels;
    }
    async parseNovelAndChapters(novelUrl: string): Promise<Plugin.SourceNovel> {
        const url = novelUrl;
        const body = await fetchApi(url).then((r) => r.text());

        let loadedCheerio = parseHTML(body);

        const novel: Plugin.SourceNovel = {
            url,
            chapters: [],
        };

        novel.name = loadedCheerio("div.book > img").attr("alt");

        novel.cover = loadedCheerio("div.book > img").attr("src");

        novel.summary = loadedCheerio("div.desc-text").text().trim();

        loadedCheerio("ul.info > li > h3").each(function () {
            let detailName = loadedCheerio(this).text();
            let detail = loadedCheerio(this)
                .siblings()
                .map((i, el) => loadedCheerio(el).text())
                .toArray()
                .join(",");

            switch (detailName) {
                case "Author:":
                    novel.author = detail;
                    break;
                case "Status:":
                    novel.status = detail;
                    break;
                case "Genre:":
                    novel.genres = detail;
                    break;
            }
        });

        const novelId = loadedCheerio("#rating").attr("data-novel-id");

        const getChapters = async (id: string) => {
            const chapterListUrl =
                this.baseUrl + "ajax/chapter-archive?novelId=" + id;

            const data = await fetchApi(chapterListUrl);
            const chapterdata = await data.text();

            loadedCheerio = parseHTML(chapterdata);

            let chapter: Plugin.ChapterItem[] = [];

            loadedCheerio("ul.list-chapter > li").each(function () {
                const chapterName = loadedCheerio(this).find("a").attr("title");
                const releaseDate = null;
                const chapterUrl = loadedCheerio(this).find("a").attr("href");

                if (!chapterName || !chapterUrl) return;

                chapter.push({
                    name: chapterName,
                    releaseTime: releaseDate,
                    url: chapterUrl,
                });
            });
            return chapter;
        }

        if (novelId) {
            novel.chapters = await getChapters(novelId);
        }

        return novel;
    }
    async parseChapter(chapterUrl: string): Promise<string> {
        const body = await fetchApi(chapterUrl).then((r) => r.text());

        const loadedCheerio = parseHTML(body);

        loadedCheerio('#chr-content > div,h6,p[style="display: none;"]').remove();
        let chapterText = loadedCheerio("#chr-content").html() || '';

        return chapterText;
    }
    async searchNovels(searchTerm: string, pageNo: number): Promise<Plugin.NovelItem[]> {
        const url = `${this.baseUrl}search/?keyword=${searchTerm}`;
        const body = await fetchApi(url).then((r) => r.text());

        const loadedCheerio = parseHTML(body);

        let novels: Plugin.NovelItem[] = [];

        loadedCheerio("div.col-novel-main > div.list-novel > .row").each(
            function () {
                const novelUrl = loadedCheerio(this)
                    .find("h3.novel-title > a")
                    .attr("href");

                const novelName = loadedCheerio(this)
                    .find("h3.novel-title > a")
                    .text();
                const novelCover = loadedCheerio(this).find("img").attr("src");

                if (novelUrl) {
                    novels.push({
                        url: novelUrl,
                        name: novelName,
                        cover: novelCover,
                    });
                }
            }
        );

        return novels;
    }
    async fetchImage(url: string): Promise<string | undefined> {
        return fetchFile(url);
    }

}
export default new NovelBin();
