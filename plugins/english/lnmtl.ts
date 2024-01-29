import { load as parseHTML } from "cheerio";
import { fetchApi, fetchFile } from "@libs/fetch";
import { FilterTypes, Filters } from "@libs/filterInputs";
import { Plugin } from "@typings/plugin";

class LnMTLPlugin implements Plugin.PluginBase {
    id = "lnmtl";
    name = "LnMTL";
    icon = "src/en/lnmtl/icon.png";
    site = "https://lnmtl.com/";
    version = "1.0.0";

    async popularNovels(
        page: number,
        { filters }: Plugin.PopularNovelsOptions<typeof this.filters>
    ): Promise<Plugin.NovelItem[]> {    
        let link = this.site + "novel?";

        link += `orderBy=${filters.order.value}`;
        link += `&order=${filters.sort.value}`;
        link += `&filter=${filters.storyStatus.value}`;
        link += `&page=${page}`;                         

        const body = await fetchApi(link).then((result) =>
            result.text()
        );

        const loadedCheerio = parseHTML(body);
        const novels: Plugin.NovelItem[] = [];

        loadedCheerio(".media").each(function () {
            const novelName = loadedCheerio(this).find("h4").text();
            const novelCover = loadedCheerio(this).find("img").attr("src");
            const novelUrl = loadedCheerio(this).find("h4 > a").attr("href");

            if (!novelUrl) return;

            const novel = {
                name: novelName,
                cover: novelCover,
                url: novelUrl,
            };

            novels.push(novel);
        });

        return novels;
    };

    async parseNovelAndChapters(novelUrl: string): Promise<Plugin.SourceNovel> {
        const url = novelUrl;
        const result = await fetchApi(url);
        const body = await result.text();

        const loadedCheerio = parseHTML(body);

        const novel: Plugin.SourceNovel = {
            url,
            chapters: [],
        };

        novel.name = loadedCheerio(".novel-name").text();

        novel.cover = loadedCheerio("div.novel").find("img").attr("src");

        novel.summary = loadedCheerio("div.description").text().trim();

        loadedCheerio(".panel-body > dl").each(function () {
            const detailName = loadedCheerio(this).find("dt").text().trim();
            const detail = loadedCheerio(this).find("dd").text().trim();

            switch (detailName) {
                case "Authors":
                    novel.author = detail;
                    break;
                case "Current status":
                    novel.status = detail;
                    break;
            }
        });

        novel.genres = loadedCheerio('.panel-heading:contains(" Genres ")')
            .next()
            .find('a')
            .map((i,el) => loadedCheerio(el).text())
            .toArray()
            .join(",");

        const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
        let volumes = JSON.parse(
            loadedCheerio("main")
                .next()
                .html()
                ?.match(/lnmtl.volumes = \[(.*?)\]/)![0]
                ?.replace("lnmtl.volumes = ", "") || ""
        );

        const chapter: Plugin.ChapterItem[] = [];

        volumes = volumes.map((volume: { id: number; }) => volume.id);

        for (const volume of volumes) {
            const volumeData = await fetchApi(
                `${this.site}chapter?page=1&volumeId=${volume}`
            );
            const volumePage = await volumeData.json();

            // volumeData = volumeData.data.map((volume) => volume.slug);

            for (let i = 1; i <= volumePage.last_page; i++) {
                const chapterData = await fetchApi(
                    `${this.site}chapter?page=${i}&volumeId=${volume}`
                );
                const chapterInfo = await chapterData.json();

                const chapterDetails = chapterInfo.data.map(
                (chapter: { number: number; title: string; slug: string; created_at: string; }) => ({
                    name: `#${chapter.number} ${chapter.title}`,
                    url: `${this.site}chapter/${chapter.slug}`,
                    releaseTime: new Date (chapter.created_at).toISOString(), //converts time obtained to UTC +0, TODO: Make it not convert
                }));

                chapter.push(...chapterDetails);
            }
            await delay(1000);
        }

        novel.chapters = chapter;

        return novel;
    };

    async parseChapter(chapterUrl: string): Promise<string> {
        const result = await fetchApi(chapterUrl);
        const body = await result.text();

        const loadedCheerio = parseHTML(body);

        loadedCheerio('.original, script').remove();
        loadedCheerio('sentence.translated').wrap('<p></p>');

        let chapterText = loadedCheerio('.chapter-body').html()?.replace(/„/g, '“');

        if (!chapterText) {
            chapterText = loadedCheerio(".alert.alert-warning").text();
        }

        return chapterText;
    };

    async searchNovels(
        searchTerm: string,
        pageNo: number
    ): Promise<Plugin.NovelItem[]> {
        const body = await fetchApi(this.site).then((r) => r.text());
        const loadedCheerio = parseHTML(body);

        const list = loadedCheerio('footer')
            .next()
            .next()
            .html()
            ?.match(/prefetch: '\/(.*json)/)![1];

        const search = await fetch(`${this.site}${list}`);
        const data = await search.json();

        const nov = data.filter((res: { name: string; }) =>
            res.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );

        const novels: Plugin.NovelItem[] = [];
        nov.map((res: { name: string; slug: string; image: string; }) => {
            const novelName = res.name;
            const novelUrl = `${this.site}novel/${res.slug}`;
            const novelCover = res.image;

            const novel = {
                url: novelUrl,
                name: novelName,
                cover: novelCover,
            };
            novels.push(novel);
        });
        return novels;
    };

    async fetchImage(url: string): Promise<string | undefined> {
        return await fetchFile(url);
    }

    filters = {
        order: {
            value: "favourites",
            label: "Order by",
            options: [
                { label: "Favourites", value: "favourites" },
                { label: "Name", value: "name" },
                { label: "Addition Date", value: "date" },
            ],
            type: FilterTypes.Picker,
        },
        sort: {
            value: "desc",
            label: "Sort by",
            options: [
                { label: "Descending", value: "desc" },
                { label: "Ascending", value: "asc" },
            ],
            type: FilterTypes.Picker,
        },
        storyStatus: {
            value: "all",
            label: "Status",
            options: [
                { label: "All", value: "all" },
                { label: "Ongoing", value: "ongoing" },
                { label: "Finished", value: "finished" },
            ],
            type: FilterTypes.Picker,
        },
    } satisfies Filters;
}

export default new LnMTLPlugin();