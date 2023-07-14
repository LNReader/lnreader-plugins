import cheerio from "cheerio";
import { fetchApi, fetchFile } from "@libs/fetch";
import { Chapter, Novel, Plugin } from "@typings/plugin";

export const id = "agit.xyz";
export const name = "Agitoon";
export const site = "https://agit501.xyz/";
export const version = "1.0.0";
export const icon = "src/kr/agitoon/agit.png";

const baseUrl = site;

export const popularNovels: Plugin.popularNovels = async function (page) {
    const list_limit = 20 * (page - 1);
    const day = new Date().getDay();

    const res = await fetchApi(baseUrl + "novel/index.update.php", {
        headers: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `mode=get_data_novel_list_p&novel_menu=3&np_day=${day}&np_rank=1&np_distributor=0&np_genre=00&np_order=1&np_genre_ex_1=00&np_genre_ex_2=00&list_limit=${list_limit}&is_query_first=true`,
        method: "POST",
    });

    const resJson = await res.json();

    const novels: Novel.Item[] = resJson.list.map((novel) => {
        return {
            url: baseUrl + "novel/list/" + novel.wr_id,
            name: novel.wr_subject,
            cover: baseUrl + novel.np_dir + "/thumbnail/" + novel.np_thumbnail,
        };
    });

    return novels;
};

export const parseNovelAndChapters: Plugin.parseNovelAndChapters =
    async function (novelUrl) {
        const novelId = novelUrl.split("/").reverse()[0];

        // cheerio
        const result = await fetchApi(novelUrl);
        const body = await result.text();

        const loadedCheerio = cheerio.load(body, { decodeEntities: false });
        const name = loadedCheerio("h5.pt-2").text();
        const summary = loadedCheerio(".pt-1.mt-1.pb-1.mb-1").text();
        const author = loadedCheerio(".post-item-list-cate-v")
            .first()
            .text()
            .split(" : ")
            .reverse()[0];
        const cover =
            baseUrl.slice(0, baseUrl.length - 1) +
            loadedCheerio("div.col-5.pr-0.pl-0 img").attr("src");
        const genresTag = loadedCheerio(".col-7 > .post-item-list-cate > span");
        let genres = "";

        genresTag.each((_, element) => {
            genres += loadedCheerio(element).text();
            genres += ", ";
        });
        genres = genres.slice(0, genres.length - 2);

        // normal REST HTTP requests
        let chapters: Chapter.Item[] = [];

        const res = await fetchApi(baseUrl + "novel/list.update.php", {
            headers: {
                "content-type":
                    "application/x-www-form-urlencoded; charset=UTF-8",
            },
            body: `mode=get_data_novel_list_c&wr_id_p=${novelId}&page_no=1&cnt_list=10000&order_type=Asc`,
            method: "POST",
        });

        const resJson = await res.json();

        chapters = resJson.list.map((chapter) => {
            return {
                name: chapter.wr_subject,
                url: baseUrl + `novel/view/${chapter.wr_id}/2`,
                releaseTime: chapter.wr_datetime,
            };
        });

        const novel: Novel.instance = {
            url: novelUrl,
            name,
            cover,
            summary,
            author,
            status: "",
            genres: genres,
            chapters,
        };
        return novel;
    };

export const parseChapter: Plugin.parseChapter = async function (chapterUrl) {
    const result = await fetchApi(chapterUrl);
    const body = await result.text();

    const loadedCheerio = cheerio.load(body);

    const contentTag = loadedCheerio("#id_wr_content > p");

    let content = "";
    contentTag.each((_, element) => {
        content += loadedCheerio(element).text();
        content += "<br />";
    });

    // gets rid of the popup thingy
    content = content.replace(
        "팝업메뉴는 빈공간을 더치하거나 스크룰시 사라집니다",
        ""
    );

    return content;
};

export const searchNovels: Plugin.searchNovels = async function (searchTerm) {
    const rawResults = await fetchApi("https://agit501.xyz/novel/search.php", {
        headers: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `mode=get_data_novel_list_p_sch&search_novel=${searchTerm}&list_limit=0`,
        method: "POST",
    });

    const results = await rawResults.json();
    if (results.list_count === 0) {
        return [];
    }

    const novels: Novel.Item[] = results.list.map((result) => {
        return {
            url: baseUrl + "novel/list/" + result.wr_id,
            name: result.wr_subject,
            cover:
                baseUrl + result.np_dir + "/thumbnail/" + result.np_thumbnail,
        };
    });
    return novels;
};
