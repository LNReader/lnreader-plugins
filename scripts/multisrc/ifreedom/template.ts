import { fetchFile, fetchApi } from "@libs/fetch";
import { Filters, FilterTypes } from "@libs/filterInputs";
import { Plugin } from "@typings/plugin";
import { NovelStatus } from "@libs/novelStatus";
import { load as parseHTML } from "cheerio";
// import { defaultCover } from "@libs/defaultCover";

export interface IfreedomMetadata {
  id: string;
  sourceSite: string;
  sourceName: string;
  filters?: Filters;
}

class IfreedomPlugin implements Plugin.PluginBase {
  id: string;
  name: string;
  icon: string;
  site: string;
  version: string;
  filters?: Filters;

  constructor(metadata: IfreedomMetadata) {
    this.id = metadata.id;
    this.name = metadata.sourceName;
    this.icon = `multisrc/ifreedom/icons/${metadata.id}.png`;
    this.site = metadata.sourceSite;
    this.version = "1.0.0";
    this.filters = metadata.filters;
  }

  async popularNovels(
    page: number,
    { filters, showLatestNovels }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    let url = this.site + "/vse-knigi/?sort=" +
      (showLatestNovels ? "По дате обновления" : filters?.sort?.value || "По рейтингу");

    Object.entries(filters || {}).forEach(([type, { value }]) => {
      if (value instanceof Array && value.length) {
        url += "&" + type + "[]=" + value.join("&" + type + "[]=");
      }
    });

    url += "&bpage=" + page;

    const body = await fetchApi(url).then((res) => res.text());
    const loadedCheerio = parseHTML(body);

    const novels: Plugin.NovelItem[] = loadedCheerio(
      "div.one-book-home > div.img-home a",
    )
      .map((index, element) => ({
        name: loadedCheerio(element).attr("title") || "",
        cover: loadedCheerio(element).find("img").attr("src"),
        url: loadedCheerio(element).attr("href") || "",
      }))
      .get()
      .filter((novel) => novel.name && novel.url);

    return novels;
  }

  async parseNovelAndChapters(novelUrl: string): Promise<Plugin.SourceNovel> {
    const body = await fetchApi(novelUrl).then((res) => res.text());
    const loadedCheerio = parseHTML(body);

    const novel: Plugin.SourceNovel = {
      url: novelUrl,
      name: loadedCheerio(".entry-title").text(),
      cover: loadedCheerio(".img-ranobe > img").attr("src"),
      summary: loadedCheerio('meta[name="description"]').attr("content"),
    };

    loadedCheerio("div.data-ranobe").each(function () {
      switch (loadedCheerio(this).find("b").text()) {
        case "Автор":
          novel.author = loadedCheerio(this)
            .find("div.data-value")
            .text()
            .trim();
          break;
        case "Жанры":
          novel.genres = loadedCheerio("div.data-value > a")
            .map((index, element) => loadedCheerio(element).text()?.trim())
            .get()
            .join(",");
          break;
        case "Статус книги":
          novel.status = loadedCheerio("div.data-value")
            .text()
            .includes("активен")
            ? NovelStatus.Ongoing
            : NovelStatus.Completed;
          break;
      }
    });

    if (novel.author == "Не указан") delete novel.author;

    const chapters: Plugin.ChapterItem[] = [];
    const totalChapters = loadedCheerio("div.li-ranobe").length;

    loadedCheerio("div.li-ranobe").each((chapterIndex, element) => {
      const name = loadedCheerio(element).find("a").text();
      const url = loadedCheerio(element).find("a").attr("href");
      if (!loadedCheerio(element).find("label.buy-ranobe").length && name && url) {
        const releaseTime = loadedCheerio(element).find("div.li-col2-ranobe").text().trim();
        chapters.push({ name, url, releaseTime, chapterNumber: totalChapters - chapterIndex });
      }
    });

    novel.chapters = chapters.reverse();
    return novel;
  }

  async parseChapter(chapterUrl: string): Promise<string> {
    const body = await fetchApi(chapterUrl).then((res) => res.text());
    const loadedCheerio = parseHTML(body);

    loadedCheerio(".entry-content img").each((index, element) => {
      const srcset = loadedCheerio(element).attr("srcset")?.split?.(" ");
      if (srcset?.length) {
        loadedCheerio(element).removeAttr("srcset");
        const bestlink: string[] = srcset.filter((url) => url.startsWith("http"));
        if (bestlink[bestlink.length - 1]) {
          loadedCheerio(element).attr("src", bestlink[bestlink.length - 1]);
        }
      }
    });

    const chapterText = loadedCheerio(".entry-content").html() || "";
    return chapterText;
  }

  async searchNovels(
    searchTerm: string,
    page: number | undefined = 1,
  ): Promise<Plugin.NovelItem[]> {
    const url =
      this.site + "/vse-knigi/?searchname=" + searchTerm + "&bpage=" + page;
    const result = await fetchApi(url).then((res) => res.text());
    const loadedCheerio = parseHTML(result);

    const novels: Plugin.NovelItem[] = loadedCheerio(
      "div.one-book-home > div.img-home a",
    )
      .map((index, element) => ({
        name: loadedCheerio(element).attr("title") || "",
        cover: loadedCheerio(element).find("img").attr("src"),
        url: loadedCheerio(element).attr("href") || "",
      }))
      .get()
      .filter((novel) => novel.name && novel.url);

    return novels;
  }

  fetchImage = fetchFile;
}
