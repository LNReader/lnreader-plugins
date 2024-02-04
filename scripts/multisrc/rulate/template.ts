import { fetchFile, fetchApi } from "@libs/fetch";
import { Filters, FilterTypes } from "@libs/filterInputs";
import { Plugin } from "@typings/plugin";
import { NovelStatus } from "@libs/novelStatus";
import { load as parseHTML } from "cheerio";
// import { defaultCover } from "@libs/defaultCover";

export interface RulateMetadata {
  id: string;
  sourceSite: string;
  sourceName: string;
  filters?: Filters;
}

class RulatePlugin implements Plugin.PluginBase {
  id: string;
  name: string;
  icon: string;
  site: string;
  version: string;
  filters?: Filters | undefined;

  constructor(metadata: RulateMetadata) {
    this.id = metadata.id;
    this.name = metadata.sourceName;
    this.icon = `multisrc/rulate/icons/${metadata.id}.png`;
    this.site = metadata.sourceSite;
    this.version = "1.0.0";
    this.filters = metadata.filters;
  }

  async popularNovels(
    pageNo: number,
    { filters, showLatestNovels }: Plugin.PopularNovelsOptions,
  ): Promise<Plugin.NovelItem[]> {
    const novels: Plugin.NovelItem[] = [];
    let url = this.site + "/search?t=";
    url += "&cat=" + (filters?.cat?.value || "0");
    url += "&s_lang=" + (filters?.s_lang?.value || "0");
    url += "&t_lang=" + (filters?.t_lang?.value || "0");
    url += "&type=" + (filters?.type?.value || "0");
    url += "&sort=" + (showLatestNovels ? "4" : filters?.sort?.value || "6");
    url += "&atmosphere=" + (filters?.atmosphere?.value || "0");
    url += "&adult=" + (filters?.adult?.value || "0");

    Object.entries(filters || {}).forEach(([type, { value }]) => {
      if (value instanceof Array && value.length) {
        url += "&" + value
            .map((val) => (type == "extra" ? val + "=1" : type + "[]=" + val))
            .join("&");
      }
    });

    url += "&Book_page=" + pageNo;

    const body = await fetchApi(url).then((res) => res.text());
    const loadedCheerio = parseHTML(body);

    loadedCheerio(
      'ul[class="search-results"] > li:not([class="ad_type_catalog"])',
    ).each((index, element) => {
      loadedCheerio(element).find("p > a").text();
      const name = loadedCheerio(element).find("p > a").text();
      const cover = loadedCheerio(element).find("img").attr("src");
      const url = loadedCheerio(element).find("p > a").attr("href");
      if (!name || !url) return;

      novels.push({ name, cover: this.site + cover, url: this.site + url });
    });

    return novels;
  }

  async parseNovelAndChapters(novelUrl: string): Promise<Plugin.SourceNovel> {
    const novel: Plugin.SourceNovel = {
      url: novelUrl,
    };
    let result = await fetchApi(novelUrl);
    if (result.url.includes("mature?path=")) {
      const formData = new FormData();
      formData.append("path", novelUrl);
      formData.append("ok", "Да");

      await fetchApi(result.url, {
        method: "POST",
        body: formData,
      });

      result = await fetchApi(novelUrl);
    }
    const body = await result.text();
    const loadedCheerio = parseHTML(body);

    novel.name = loadedCheerio(
      'div[class="container"] > div > div > h1, div.span8:nth-child(1) > h1:nth-child(2)',
    )
      .text()
      .trim();
    if (novel.name?.includes?.("[")) {
      novel.name = novel.name.split("[")[0].trim();
    }
    novel.cover =
      this.site + loadedCheerio('div[class="images"] > div img').attr("src");
    novel.summary = 
      loadedCheerio("#Info > div:nth-child(3), .book-description").text().trim();
    novel.author = loadedCheerio(
      ".book-stats-icons_author > span:nth-child(2) > a:nth-child(1)",
    ).text();
    const genres: string[] = [];

    loadedCheerio("div.span5 > p, .span5 > div:nth-child(2) > p").each(
      function () {
        switch (loadedCheerio(this).find("strong").text()) {
          case "Автор:":
            novel.author = loadedCheerio(this).find("em > a").text().trim();
            break;
          case "Выпуск:":
            novel.status =
              loadedCheerio(this).find("em").text().trim() === "продолжается"
                ? NovelStatus.Ongoing
                : NovelStatus.Completed;
            break;
          case "Тэги:":
            loadedCheerio(this)
              .find("em > a")
              .each(function () {
                genres.push(loadedCheerio(this).text());
              });
            break;
          case "Жанры:":
            loadedCheerio(this)
              .find("em > a")
              .each(function () {
                genres.push(loadedCheerio(this).text());
              });
            break;
        }
      },
    );

    if (genres.length) {
      novel.genres = genres.reverse().join(",");
    }

    const chapters: Plugin.ChapterItem[] = [];
    loadedCheerio("table > tbody > tr.chapter_row").each((chapterIndex, element) => {
      const chapterName = loadedCheerio(element).find('td[class="t"] > a').text().trim();
      const releaseDate = loadedCheerio(element).find("td > span").attr("title")?.trim();
      const chapterUrl = loadedCheerio(element).find('td[class="t"] > a').attr("href");

      if (!loadedCheerio(element).find('td > span[class="disabled"]').length && releaseDate) {
        chapters.push({
          name: chapterName,
          url: this.site + chapterUrl,
          releaseTime: releaseDate,
          chapterNumber: chapterIndex + 1,
        });
      }
    });

    novel.chapters = chapters;
    return novel;
  }

  async parseChapter(chapterUrl: string): Promise<string> {
    let result = await fetchApi(chapterUrl);
    if (result.url.includes("mature?path=")) {
      const formData = new FormData();
      formData.append("ok", "Да");

      await fetchApi(result.url, {
        method: "POST",
        body: formData,
      });

      result = await fetchApi(chapterUrl);
    }
    const body = await result.text();
    const loadedCheerio = parseHTML(body);

    loadedCheerio(".content-text img").each((index, element) => {
      if (!loadedCheerio(element).attr("src")?.startsWith("http")) {
        const src = loadedCheerio(element).attr("src");
        loadedCheerio(element).attr("src", this.site + src);
      }
    });

    const chapterText = loadedCheerio(".content-text").html();
    return chapterText || "";
  }

  async searchNovels(searchTerm: string): Promise<Plugin.NovelItem[]> {
    const novels: Plugin.NovelItem[] = [];
    const result = await fetchApi(
      this.site + "/search/autocomplete?query=" + searchTerm,
    );
    const json = (await result.json()) as response[];

    json.forEach((novel) => {
      const name = novel.title_one + " / " + novel.title_two;
      if (!novel.url) return;

      novels.push({
        name,
        cover: this.site + novel.img,
        url: this.site + novel.url,
      });
    });

    return novels;
  }

  fetchImage = fetchFile;
}

interface response {
  id: number;
  title_one: string;
  title_two: string;
  url: string;
  img: string;
}
