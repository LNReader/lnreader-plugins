import { load } from "cheerio";
import { fetchApi, fetchFile } from "@libs/fetch";
import { Plugin } from "@typings/plugin";
import { NovelStatus } from "@libs/novelStatus";
import { defaultCover } from "@libs/defaultCover";
import { Filters } from "@libs/filterInputs";

interface WPmangaStreamOptions {
  reverseChapters?: boolean;
  lang?: string;
}

export interface WPmangaStreamMetadata {
  id: string;
  sourceSite: string;
  sourceName: string;
  options?: WPmangaStreamOptions;
  filters?: any;
}

class WPmangaStreamPlugin implements Plugin.PluginBase {
  id: string;
  name: string;
  icon: string;
  site: string;
  version: string;
  options?: WPmangaStreamOptions;
  filters?: Filters;

  constructor(metadata: WPmangaStreamMetadata) {
    this.id = metadata.id;
    this.name = metadata.sourceName;
    this.icon = `multisrc/wpmangastream/icons/${metadata.id}.png`;
    this.site = metadata.sourceSite;
    this.version = "1.0.1";
    this.options = metadata.options;
    this.filters = metadata.filters satisfies Filters;
  }

  async popularNovels(page: number, { filters, showLatestNovels }: Plugin.PopularNovelsOptions): Promise<Plugin.NovelItem[]> {
    let url = this.site + "series/?page=" + page;
    if (!filters) filters = {};
    if (showLatestNovels) url += "&order=latest";
    for (const key in filters) {
      if (typeof filters[key].value === "object")
        for (const value of filters[key].value as string[])
          url += `&${key}=${value}`;
      else if (filters[key].value) url += `&${key}=${filters[key].value}`;
    }
    const response = await fetchApi(url);
    if (!response.ok) throw new Error("You got banned ? (check in webview)");
    const body = await response.text();
    const loadedCheerio = load(body);
    if (loadedCheerio("title").text().trim() == "Bot Verification")
      throw new Error("Captcha error, please open in webview");

    const novels: Plugin.NovelItem[] = [];

    loadedCheerio("article.maindet").each(function () {
      const novelName = loadedCheerio(this).find("h2").text();
      const image = loadedCheerio(this).find("img");
      const novelUrl = loadedCheerio(this).find("h2 a").attr("href");

      if (novelUrl) {
        novels.push({
          name: novelName,
          cover: image.attr("data-src") || image.attr("src") || defaultCover,
          url: novelUrl,
        });
      }
    });

    return novels;
  }

  async parseNovelAndChapters(url: string): Promise<Plugin.SourceNovel> {
    const response = await fetchApi(url);
    if (!response.ok) throw new Error("You got banned ? (check in webview)");
    const body = await response.text();
    const loadedCheerio = load(body);
    if (loadedCheerio("title").text().trim() == "Bot Verification")
      throw new Error("Captcha error, please open in webview");

    const novel: Plugin.SourceNovel = { url };

    novel.name = loadedCheerio("h1.entry-title").text();
    novel.cover =
      loadedCheerio("img.wp-post-image").attr("data-src") ||
      loadedCheerio("img.wp-post-image").attr("src") || defaultCover;
    switch (loadedCheerio("div.sertostat > span").attr("class")?.toLowerCase() || "") {
      case "completed":
        novel.status = NovelStatus.Completed;
        break;
      case "ongoing":
        novel.status = NovelStatus.Ongoing;
        break;
      case "hiatus":
        novel.status = NovelStatus.OnHiatus;
        break;
      default:
        novel.status = NovelStatus.Unknown;
        break;
    }

    loadedCheerio("div.serl > span").each(function () {
      const detailName = loadedCheerio(this).text().trim();
      const detail = loadedCheerio(this).next().text().trim();

      switch (detailName) {
        case "الكاتب":
        case "Author":
        case "Auteur":
          novel.author = detail;
          break;
      }
    });

    novel.genres = loadedCheerio(".sertogenre")
      .children("a")
      .map((i, el) => loadedCheerio(el).text())
      .toArray()
      .join(",");

    let summary = loadedCheerio(".sersys > p").siblings().remove("div").end();
    novel.summary = "";
    for (let i = 0; i < summary.length; i++) {
      const p = summary[i];
      novel.summary += loadedCheerio(p).text().trim() + "\n\n";
    }

    const totalChapters = loadedCheerio(".eplister li").length;
    const chapters: Plugin.ChapterItem[] = loadedCheerio(".eplister li")
      .map((chapterIndex, element) => ({
        name:
          loadedCheerio(element).find(".epl-num").text() + " " + 
          loadedCheerio(element).find(".epl-title").text(),
        url: loadedCheerio(element).find("a").attr("href") || "",
        releaseTime: loadedCheerio(element).find(".epl-date").text().trim(),
        chapterNumber: this.options?.reverseChapters
          ? totalChapters - chapterIndex
          : chapterIndex + 1,
      }))
      .get()
      .filter((chapter) => chapter.name && chapter.url);

    if (this.options?.reverseChapters && chapters.length) chapters.reverse();

    novel.chapters = chapters;
    return novel;
  }

  async parseChapter(chapterUrl: string): Promise<string> {
    const response = await fetchApi(chapterUrl);
    if (!response.ok) throw new Error("You got banned ? (check in webview)");
    const body = await response.text();
    const loadedCheerio = load(body);
    if (loadedCheerio("title").text().trim() == "Bot Verification")
      throw new Error("Captcha error, please open in webview");

    const chapterText = loadedCheerio(".epcontent").html() || "";
    return chapterText;
  }

  async searchNovels(searchTerm: string, page: number): Promise<Plugin.NovelItem[]> {
    if (page != 1) return [];
    const url = this.site + "?s=" + searchTerm;
    const response = await fetchApi(url);
    if (!response.ok) throw new Error("You got banned ? (check in webview)");
    const body = await response.text();
    const loadedCheerio = load(body);
    if (loadedCheerio("title").text().trim() == "Bot Verification")
      throw new Error("Captcha error, please open in webview");

    const novels: Plugin.NovelItem[] = [];

    loadedCheerio("article.maindet").each(function () {
      const novelName = loadedCheerio(this).find("h2").text();
      const image = loadedCheerio(this).find("img");
      const novelUrl = loadedCheerio(this).find("h2 a").attr("href");

      if (novelUrl){
        novels.push({
          name: novelName,
          cover: image.attr("data-src") || image.attr("src") || defaultCover,
          url: novelUrl,
        });
      }
    });

    return novels;
  }

  fetchImage = fetchFile;
}
