import { load as loadCheerio } from "cheerio";
import { fetchFile } from "@libs/fetch";
import { Plugin } from "@typings/plugin";
import { defaultCover } from "@libs/defaultCover";
import { Filters } from "@libs/filterInputs";
// const novelStatus = require('@libs/novelStatus');
// const isUrlAbsolute = require('@libs/isAbsoluteUrl');
// const parseDate = require('@libs/parseDate');

class Syosetu implements Plugin.PluginBase {
    id = "yomou.syosetu";
    name = "Syosetu";
    icon = "src/jp/syosetu/icon.png";
    site = "https://yomou.syosetu.com/";
    filters?: Filters | undefined;
    version = "1.0.0";
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    searchUrl = (pagenum?: number, order?: string) => {
        return `https://yomou.syosetu.com/search.php?order=${order || "hyoka"}${
            pagenum !== undefined
                ? `&p=${pagenum <= 1 || pagenum > 100 ? "1" : pagenum}` // check if pagenum is between 1 and 100
                : "" // if isn't don't set ?p
        }`;
    };
    async popularNovels(pageNo: number, options: Plugin.PopularNovelsOptions<Filters>): Promise<Plugin.NovelItem[]> {
        const getNovelsFromPage = async (pagenumber: number) => {
            // load page

            const result = await fetch(this.searchUrl(pagenumber), {headers: this.headers});
            const body = await result.text();
            // Cheerio it!
            const cheerioQuery = loadCheerio(body, { decodeEntities: false });
            let pageNovels: Plugin.NovelItem[] = [];
            // find class=searchkekka_box
            cheerioQuery(".searchkekka_box").each(function (i, e) {
                // get div with link and name
                const novelDIV = cheerioQuery(this).find(".novel_h");
                // get link element
                const novelA = novelDIV.children()[0];
                // add new novel to array
                pageNovels.push({
                    name: novelDIV.text(), // get the name
                    url: novelA.attribs.href, // get last part of the link
                    cover: defaultCover,
                });
            });
            // return all novels from this page
            return pageNovels;
        }
        const novels = await getNovelsFromPage(pageNo);
        return novels;
    }
    async parseNovelAndChapters(novelUrl: string): Promise<Plugin.SourceNovel> {
        let chapters: Plugin.ChapterItem[] = [];
        const result = await fetch(novelUrl, {headers: this.headers});
        const body = await result.text();
        const loadedCheerio = loadCheerio(body, { decodeEntities: false });

        // create novel object
        let novel: Plugin.SourceNovel = {
            url: novelUrl,
            name: loadedCheerio(".novel_title").text(),
            author: loadedCheerio(".novel_writername")
                .text()
                .replace("作者：", ""),
            cover: defaultCover,
        };

        // Get all the chapters
        const cqGetChapters = loadedCheerio(".novel_sublist2");
        if (cqGetChapters.length !== 0) {
            // has more than 1 chapter
            novel.summary = loadedCheerio("#novel_ex")
                .text()
                .replace(/<\s*br.*?>/g, "\n");
            cqGetChapters.each(function (i, e) {
                const chapterA = loadedCheerio(this).find("a");
                const [chapterName, releaseDate, chapterUrl] = [
                    // set the variables
                    chapterA.text(),
                    loadedCheerio(this)
                        .find("dt") // get title
                        .text() // get text
                        .replace(/（.）/g, "") // remove "(edited)" mark
                        .trim(), // trim spaces
                    "https://ncode.syosetu.com" + chapterA.attr("href"),
                ];
                chapters.push({
                    name: chapterName,
                    releaseTime: releaseDate,
                    url: chapterUrl,
                });
            });
        } else {
            /**
             * Because there are oneshots on the site, they have to be treated with special care
             * that's what pisses me off in Shosetsu app. They have this extension,
             * but every oneshot is set as "there are no chapters" and all contents are thrown into the description!!
             */
            // get summary for oneshot chapter

            const nameResult = await fetch(
                this.searchUrl() + `&word=${novel.name}`,
                {headers: this.headers}
            );
            const nameBody = await nameResult.text();
            const summaryQuery = loadCheerio(nameBody, {
                decodeEntities: false,
            });
            const foundText = summaryQuery(".searchkekka_box")
                .first()
                .find(".ex")
                .text()
                .replace(/\s{2,}/g, "\n");
            novel.summary = foundText;

            // add single chapter
            chapters.push({
                name: "Oneshot",
                releaseTime: loadedCheerio("head")
                    .find("meta[name='WWWC']")
                    .attr("content"), // get date from metadata
                url: novelUrl, // set chapterUrl to oneshot so that chapterScraper knows it's a one-shot,
            });
        }
        novel.chapters = chapters;
        return novel;
    }
    async parseChapter(chapterUrl: string): Promise<string> {
        const result = await fetch(chapterUrl, {headers: this.headers});
        const body = await result.text();

        // create cheerioQuery
        const cheerioQuery = loadCheerio(body, {
            decodeEntities: false,
        });

        let chapterText = cheerioQuery("#novel_honbun") // get chapter text
            .html() || '';
        return chapterText;
    }
    async searchNovels(searchTerm: string, pageNo: number): Promise<Plugin.NovelItem[]> {
        let novels = [];

        // returns list of novels from given page
        const getNovelsFromPage = async (pagenumber: number) => {
            // load page
            const result = await fetch(
                this.searchUrl(pagenumber) + `&word=${searchTerm}`,
                {headers: this.headers}
            );
            const body = await result.text();
            // Cheerio it!
            const cheerioQuery = loadCheerio(body, { decodeEntities: false });

            let pageNovels: Plugin.NovelItem[] = [];
            // find class=searchkekka_box
            cheerioQuery(".searchkekka_box").each(function (i, e) {
                // get div with link and name
                const novelDIV = cheerioQuery(this).find(".novel_h");
                // get link element
                const novelA = novelDIV.children()[0];
                // add new novel to array
                pageNovels.push({
                    name: novelDIV.text(), // get the name
                    url: novelA.attribs.href, // get last part of the link
                    cover: defaultCover,
                });
            });
            // return all novels from this page
            return pageNovels;
        }

        // counter of loaded pages
        // let pagesLoaded = 0;
        // do {
        //     // always load first one
        //     novels.push(...(await getNovelsFromPage(pagesLoaded + 1)));
        //     pagesLoaded++;
        // } while (pagesLoaded < maxPageLoad && isNext); // check if we should load more

        novels = await getNovelsFromPage(1);

        /** Use
         * novels.push(...(await getNovelsFromPage(pageNumber)))
         * if you want to load more
         */

        // respond with novels!
        return novels;
    }
    async fetchImage(url: string): Promise<string | undefined> {
        return fetchFile(url);
    }
}

export default new Syosetu();
