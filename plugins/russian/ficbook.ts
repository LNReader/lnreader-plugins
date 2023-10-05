import { Chapter, Novel, Plugin } from "@typings/plugin";
import { FilterInputs } from "@libs/filterInputs";
import { fetchFile } from "@libs/fetch";
import { NovelStatus } from "@libs/novelStatus";
import { load as parseHTML } from "cheerio";
import { defaultCover } from "@libs/defaultCover";

export const id = "ficbook";
export const name = "ficbook";
export const site = "https://ficbook.net";
export const version = "1.0.0";
export const icon = "src/ru/ficbook/icon.png";

export const popularNovels: Plugin.popularNovels = async function (
  page,
  { showLatestNovels, filters },
) {
  let url = site;

  if (filters?.directions) {
    url += "/popular/" + filters.directions;
  } else {
    url += "/" + (filters?.sort || "fanfiction") + "?p=" + page;
  }

  const result = await fetch(url);
  const body = await result.text();
  const loadedCheerio = parseHTML(body);

  const novels: Novel.Item[] = [];

  loadedCheerio("article.fanfic-inline").each(function () {
    const name = loadedCheerio(this).find("h3 > a").text().trim();
    let cover = loadedCheerio(this).find("picture > img").attr("src");
    const url = loadedCheerio(this).find("h3 > a").attr("href");

    cover = cover
      ? cover.replace(/covers\/m_|covers\/d_/g, "covers/")
      : defaultCover;
    if (!name || !url) return;

    novels.push({ name, cover, url: site + url.replace(/\?.*/g, "") });
  });

  return novels;
};

export const parseNovelAndChapters: Plugin.parseNovelAndChapters =
  async function (novelUrl) {
    const result = await fetch(novelUrl);
    const body = await result.text();

    const loadedCheerio = parseHTML(body);

    const novel: Novel.instance = {
      url: novelUrl,
    };

    novel.name = (
      loadedCheerio('h1[itemprop="headline"]').text() ||
      loadedCheerio('h1[itemprop="name"]').text()
    ).trim();

    novel.cover = loadedCheerio('meta[property="og:image"]').attr("content");
    novel.summary = loadedCheerio('div[itemprop="description"]').text().trim();
    novel.author = loadedCheerio('a[itemprop="author"]').text();

    novel.status =
      loadedCheerio(
        "div.fanfic-main-info > section:nth-child(3) > div:nth-child(3) > span:nth-child(2)",
      ).text() === "В процессе"
        ? NovelStatus.Ongoing
        : NovelStatus.Completed;

    const tags = loadedCheerio('div[class="tags"] > a')
      .map((index, element) => loadedCheerio(element).text())
      .get();
    if (tags) {
      novel.genres = tags.join(",");
    }

    if (!novel.cover || novel.cover?.includes("/design/")) {
      novel.cover = defaultCover;
    } else {
      novel.cover = novel.cover.replace(/covers\/m_|covers\/d_/g, "covers/");
    }

    const chapters: Chapter.Item[] = [];

    if (loadedCheerio("#content").length == 1) {
      const name = loadedCheerio(".title-area > h2").text();
      const releaseTime = loadedCheerio(".part-date > span").attr("title");

      if (name) chapters.push({ name, releaseTime, url: novelUrl });
    } else {
      loadedCheerio("li.part").each(function () {
        const name = loadedCheerio(this).find("h3").text();
        const releaseTime = loadedCheerio(this)
          .find("div > span")
          .attr("title");
        const url = loadedCheerio(this).find("a:nth-child(1)").attr("href");
        if (!name || !url) return;

        chapters.push({ name, releaseTime, url: site + url });
      });
    }

    novel.chapters = chapters;
    return novel;
  };

export const parseChapter: Plugin.parseChapter = async function (chapterUrl) {
  const result = await fetch(chapterUrl);
  const body = await result.text();

  const loadedCheerio = parseHTML(body);
  let chapterText = "";

  loadedCheerio("#content").text()
    ?.split("\n")?.forEach((line) => {
      if (line.trim()) {
        chapterText += "<p>" + line + "</p>";
      } else {
        chapterText += "<br>";
      }
    });

  return chapterText;
};

export const searchNovels: Plugin.searchNovels = async function (searchTerm) {
  const formData = new FormData();
  formData.append("term", searchTerm);
  formData.append("page", "1");

  const result = await fetch(site + "/search/fanfic", {
    method: "POST",
    body: formData,
  });
  const json = (await result.json()) as { data: Data };
  const novels: Novel.Item[] = [];

  json.data?.data?.forEach((novel) => {
    const name = novel.title.trim();
    const url = site + "/readfic/" + novel.slug;
    const cover = novel.cover
      ? "https://images.ficbook.net/fanfic-covers/" + novel.cover
      : defaultCover;

    novels.push({ name, cover, url });
  });

  return novels;
};

export const filters = [
  {
    key: "sort",
    label: "Сортировка",
    values: [
      { label: "Горячие работы", value: "fanfiction" },
      { label: "Популярные ", value: "popular" },
    ],
    inputType: FilterInputs.Picker,
  },
  {
    key: "directions",
    label: "Направление",
    values: [
      { label: "Гет", value: "het" },
      { label: "Джен", value: "gen" },
      { label: "Другие виды отношений", value: "other" },
      { label: "Слэш", value: "slash-fanfics" },
      { label: "Смешанная", value: "mixed" },
      { label: "Статья", value: "article" },
      { label: "Фемслэш", value: "femslash-fanfics" },
    ],
    inputType: FilterInputs.Picker,
  },
];

export const fetchImage: Plugin.fetchImage = fetchFile;

interface Data {
  data?: DataEntity[] | null;
  more: boolean;
}
interface DataEntity {
  id: string;
  slug: string;
  author_id: number;
  user_slug: string;
  author_username: string;
  real_author_id: string | null;
  direction: number;
  part_cnt: number;
  title: string;
  description: string;
  enable_marks: boolean;
  marks_plus: number;
  is_premium: boolean;
  status: number;
  last_updated: string;
  readedDate?: string | null;
  reward_cnt: number;
  cover?: string | null;
}
