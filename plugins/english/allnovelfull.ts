import { CheerioAPI, load as parseHTML } from "cheerio";
import { fetchApi, fetchFile } from "@libs/fetch";
import { FilterTypes, Filters } from "@libs/filterInputs";
import { Plugin } from "@typings/plugin";
import { isUrlAbsolute } from "@libs/isAbsoluteUrl";

class AllNovelFullPlugin implements Plugin.PluginBase {
    id = "anf.net";
    name = "AllNovelFull";
    icon = "src/en/allnovelfull/icon.png";
    site = "https://allnovelfull.net";
    version = "1.0.0";
    userAgent = "";
    parseNovels(loadedCheerio: CheerioAPI) {
        const novels: Plugin.NovelItem[] = [];

        loadedCheerio(".col-truyen-main .list-truyen .row").each((i,el) => {
            const novelName = loadedCheerio(el)
                .find("h3.truyen-title > a")
                .text();
            let novelCover = loadedCheerio(el).find("img.cover").attr("src");
            let novelUrl = loadedCheerio(el).find("h3.truyen-title > a").attr("href");

            if (!novelUrl) return;

            if (novelUrl && !isUrlAbsolute(novelUrl)) {
                novelUrl = this.site + novelUrl;
            }
            if (novelCover && !isUrlAbsolute(novelCover)){
                novelCover = this.site + novelCover;
            }

            const novel = {
                url: novelUrl,
                name: novelName,
                cover: novelCover,
            };
            novels.push(novel);
        });
        return novels;
    };

    async popularNovels(
        pageNo: number,
        { filters }: Plugin.PopularNovelsOptions<typeof this.filters>
    ): Promise<Plugin.NovelItem[]> {
        let link = this.site;

        if (filters.genres.value.length)
            link += filters.genres.value;
        else
            link += filters.order.value;

        link += `?page=${pageNo}`;

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

        novel.name = loadedCheerio(".book > img").attr("alt");

        novel.cover = this.site + loadedCheerio(".book > img").attr("src");

        novel.summary = loadedCheerio(".desc-text").text().trim();

        loadedCheerio(".info > div").each((i,el) => {
        	const detailName = loadedCheerio(el).find("h3").text();
          	const detail = loadedCheerio(el)
							.find('a')
							.map((a,ex) => loadedCheerio(ex).text())
                            .toArray()
          					.join(', ');

            switch (detailName) {
              case 'Author:':
                novel.author = detail;
                break;
              case 'Status:':
                novel.status = detail;
                break;
              case 'Genre:':
				novel.genres = detail;
                break;
            }});

        const novelId = loadedCheerio("#rating").attr("data-novel-id");

        const getChapters = async (id: string) => {
            const chaptersUrl = this.site + "/ajax/chapter-option?novelId=" + id;

            const data = await fetchApi(chaptersUrl, { headers });
            const chapters = await data.text();

            loadedCheerio = parseHTML(chapters);

            const chapter: Plugin.ChapterItem[] = [];

            loadedCheerio("select > option").each((i,el) => {
                const chapterName = loadedCheerio(el).text();
                const releaseDate = null;
                const cUrl = loadedCheerio(el).attr("value");
                const chapterUrl = this.site + cUrl

                if (!cUrl) return;

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
    };

    async parseChapter(chapterUrl: string): Promise<string> {
        const headers = new Headers();
        const result = await fetchApi(chapterUrl, { headers });
        const body = await result.text();

        const loadedCheerio = parseHTML(body);

        const chapterText = loadedCheerio("#chapter-content").html() || "";

        return chapterText;
    };

    async searchNovels(
        searchTerm: string,
        pageNo: number
    ): Promise<Plugin.NovelItem[]> {
        const url = `${this.site}/search?keyword=${searchTerm}&page=${pageNo}`;
        const headers = new Headers();
        const result = await fetchApi(url, { headers });
        const body = await result.text();

        const loadedCheerio = parseHTML(body);
        return this.parseNovels(loadedCheerio);
    };

    async fetchImage(url: string): Promise<string | undefined> {
        return await fetchFile(url);
    }

    filters = {
        order: {
            value: "/most-popular",
            label: "Order by",
            options: [
                { label: "Latest Release", value: "/latest-release-novel" },
                { label: "Hot Novel", value: "/hot-novel" },
                { label: "Completed Novel", value: "/completed-novel" },
                { label: "Most Popular", value: "/most-popular" },
            ],
            type: FilterTypes.Picker,
        },
        genres: {
            value: "",
            label: "Genre",
            options: [
                { label: "None", value: "" },
                { label: "Shounen", value: "/genre/Shounen" },
                { label: "Harem", value: "/genre/Harem" },
                { label: "Comedy", value: "/genre/Comedy" },
                { label: "Martial Arts", value: "/genre/Martial+Arts" },
                { label: "School Life", value: "/genre/School+Life" },
                { label: "Mystery", value: "/genre/Mystery" },
                { label: "Shoujo", value: "/genre/Shoujo" },
                { label: "Romance", value: "/genre/Romance" },
                { label: "Sci-fi", value: "/genre/Sci-fi" },
                { label: "Gender Bender", value: "/genre/Gender+Bender" },
                { label: "Mature", value: "/genre/Mature" },
                { label: "Fantasy", value: "/genre/Fantasy" },
                { label: "Horror", value: "/genre/Horror" },
                { label: "Drama", value: "/genre/Drama" },
                { label: "Tragedy", value: "/genre/Tragedy" },
                { label: "Supernatural", value: "/genre/Supernatural" },
                { label: "Ecchi", value: "/genre/Ecchi" },
                { label: "Xuanhuan", value: "/genre/Xuanhuan" },
                { label: "Adventure", value: "/genre/Adventure" },
                { label: "Action", value: "/genre/Action" },
                { label: "Psychological", value: "/genre/Psychological" },
                { label: "Xianxia", value: "/genre/Xianxia" },
                { label: "Wuxia", value: "/genre/Wuxia" },
                { label: "Historical", value: "/genre/Historical" },
                { label: "Slice of Life", value: "/genre/Slice+of+Life" },
                { label: "Seinen", value: "/genre/Seinen" },
                { label: "Lolicon", value: "/genre/Lolicon" },
                { label: "Adult", value: "/genre/Adult" },
                { label: "Josei", value: "/genre/Josei" },
                { label: "Sports", value: "/genre/Sports" },
                { label: "Smut", value: "/genre/Smut" },
                { label: "Mecha", value: "/genre/Mecha" },
                { label: "Yaoi", value: "/genre/Yaoi" },
                { label: "Shounen Ai", value: "/genre/Shounen+Ai" },
                { label: "Magical Realism", value: "/genre/Magical+Realism" },
                { label: "Video Games", value: "/genre/Video+Games" },
            ],
            type: FilterTypes.Picker,
        },
    } satisfies Filters;
}

export default new AllNovelFullPlugin();
