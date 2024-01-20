import { load as parseHTML } from "cheerio";
import { fetchApi, fetchFile } from "@libs/fetch";
import { Plugin } from "@typings/plugin";
import { Filters } from "@libs/filterInputs";

export const id = "agit.xyz";
export const name = "Agitoon";
export const site = "https://agit501.xyz/";
export const version = "1.0.0";
export const icon = "src/kr/agitoon/agit.png";

const baseUrl = site;

class Agitoon implements Plugin.PluginBase {
    id = "agit.xyz";
    name = "Agitoon";
    icon = "src/kr/agitoon/agit.png";
    site = "https://agit501.xyz/";
    filters?: Filters | undefined;
    version = "1.0.0";
    async popularNovels(pageNo: number, options: Plugin.PopularNovelsOptions<Filters>): Promise<Plugin.NovelItem[]> {
        const list_limit = 20 * (pageNo - 1);
        const day = new Date().getDay();

        const res = await fetchApi(baseUrl + "novel/index.update.php", {
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            body: `mode=get_data_novel_list_p&novel_menu=3&np_day=${day}&np_rank=1&np_distributor=0&np_genre=00&np_order=1&np_genre_ex_1=00&np_genre_ex_2=00&list_limit=${list_limit}&is_query_first=true`,
            method: "POST",
        });
        const resJson = await res.json() as response;

        const novels: Plugin.NovelItem[] = []

        resJson?.list?.forEach((novel) => {
            novels.push({
                url: baseUrl + "novel/list/" + novel.wr_id,
                name: novel.wr_subject,
                cover: baseUrl + novel.np_dir + "/thumbnail/" + novel.np_thumbnail,
            });
        });

        return novels;
    }
    async parseNovelAndChapters(novelUrl: string): Promise<Plugin.SourceNovel> {
        const novelId = novelUrl.split("/").reverse()[0];

        // cheerio
        const result = await fetchApi(novelUrl);
        const body = await result.text();

        const loadedCheerio = parseHTML(body, { decodeEntities: false });
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
        let chapters: Plugin.ChapterItem[] = [];

        const res = await fetchApi(baseUrl + "novel/list.update.php", {
            headers: {
                "content-type":
                    "application/x-www-form-urlencoded; charset=UTF-8",
            },
            body: `mode=get_data_novel_list_c&wr_id_p=${novelId}&page_no=1&cnt_list=10000&order_type=Asc`,
            method: "POST",
        });

        const resJson = await res.json() as responseBook

        resJson?.list?.forEach((chapter) => {
            chapters.push({
                name: chapter.wr_subject,
                url: baseUrl + `novel/view/${chapter.wr_id}/2`,
                releaseTime: chapter.wr_datetime,
            });
        });

        const novel: Plugin.SourceNovel = {
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
    }
    async parseChapter(chapterUrl: string): Promise<string> {
        const result = await fetchApi(chapterUrl);
        const body = await result.text();

        const loadedCheerio = parseHTML(body);

        let content = loadedCheerio("#id_wr_content").html() || '';

        // gets rid of the popup thingy
        content = content.replace(
            "팝업메뉴는 빈공간을 더치하거나 스크룰시 사라집니다",
            ""
        );

        return content;
    }
    async searchNovels(searchTerm: string, pageNo: number): Promise<Plugin.NovelItem[]> {
        const rawResults = await fetchApi("https://agit501.xyz/novel/search.php", {
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            body: `mode=get_data_novel_list_p_sch&search_novel=${searchTerm}&list_limit=0`,
            method: "POST",
        });
        const resJson = await rawResults.json() as response;

        const novels: Plugin.NovelItem[] = []

        resJson?.list?.forEach((novel) => {
            novels.push({
                url: baseUrl + "novel/list/" + novel.wr_id,
                name: novel.wr_subject,
                cover: baseUrl + novel.np_dir + "/thumbnail/" + novel.np_thumbnail,
            });
        });

        return novels;
    }
    async fetchImage(url: string): Promise<string | undefined> {
        return fetchFile(url);
    }

}

export default new Agitoon();

interface response {
  list_limit: number;
  list?: (ListEntity)[] | null;
  list_count: number;
}
interface ListEntity {
  wr_id: string;
  wr_subject: string;
  np_dir: string;
  np_type_02: string;
  np_thumbnail: string;
  np_author: string;
  wr_subject2: string;
  wr_datetime: string;
  np_distributor: string;
  np_genre: string;
  np_country: string;
  np_age: string;
  is_scrap: number;
}

interface responseBook {
  list?: (ListEntity2)[] | null;
  download_time: string;
}
interface ListEntity2 {
  wr_id: string;
  wr_subject: string;
  wr_datetime: string;
  url_view1: string;
  novel_c_style1: string;
  novel_c_str1: string;
  data_novel_c_view: string;
}
