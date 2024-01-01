import { CheerioAPI, load } from "cheerio";
import { fetchApi, fetchFile } from "@libs/fetch";
import { Plugin } from "@typings/plugin";
import { NovelStatus } from "@libs/novelStatus";

interface WPmangaStreamOptions {
  reverseChapters?: boolean;
  lang?: string;
}

export interface WPmangaStreamMetadata {
  id: string;
  sourceSite: string;
  sourceName: string;
  options?: WPmangaStreamOptions;
}

class WPmangaStreamPlugin implements Plugin.PluginBase {
  id: string;
  name: string;
  icon: string;
  site: string;
  version: string;
  userAgent: string;
  cookieString: string;
  options?: WPmangaStreamOptions;

  constructor(metadata: WPmangaStreamMetadata) {
    this.id = metadata.id;
    this.name = metadata.sourceName + "[wpmangastream]";
    this.icon = `multisrc/wpmangastream/icons/${metadata.id}.png`;
    this.site = metadata.sourceSite;
    this.version = "1.0.0";
    this.userAgent = "";
    this.cookieString = "";
    this.options = metadata.options;
  }

  async popularNovels(page: number): Promise<Plugin.NovelItem[]> {
    const url = this.site + "series/?page=" + page + "&status=&order=popular";
    const body = await fetchApi(url).then((res) => res.text());
    const loadedCheerio = load(body);
    const novels: Plugin.NovelItem[] = [];

    loadedCheerio("article.maindet").each(function () {
      const name = loadedCheerio(this).find("h2").text();
      const image = loadedCheerio(this).find("img");
      const url = loadedCheerio(this).find("h2 a").attr("href");

      if (!url) return;
      novels.push({
        name,
        cover: image.attr("data-src") || image.attr("src"),
        url,
      });
    });

    return novels;
  }

  async parseNovelAndChapters(url: string): Promise<Plugin.SourceNovel> {
    const body = await fetchApi(url).then((res) => res.text());
    const loadedCheerio = load(body);

    const novel: Plugin.SourceNovel = { url };

    // novel.url = url;
    novel.name = loadedCheerio("h1.entry-title").text();
    novel.cover =
      loadedCheerio("img.wp-post-image").attr("data-src") ||
      loadedCheerio("img.wp-post-image").attr("src");
    novel.status = loadedCheerio("div.sertostat > span").attr("class");

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
      novel.summary += loadedCheerio(p).text().trim() + "\\n\\n";
    }

    const novelChapters: Plugin.ChapterItem[] = [];

    loadedCheerio(".eplister")
      .find("li")
      .each(function () {
        const name =
          loadedCheerio(this).find(".epl-num").text() +
          " - " +
          loadedCheerio(this).find(".epl-title").text();

        const releaseTime = loadedCheerio(this).find(".epl-date").text().trim();
        const url = loadedCheerio(this).find("a").attr("href");

        if (!url) return;
        novelChapters.push({ name, url, releaseTime });
      });

    novel.chapters = novelChapters;
    if (this.options?.reverseChapters && novel.chapters.length)
      novel.chapters.reverse();

    return novel;
  }

  async parseChapter(chapterUrl: string): Promise<string> {
    const body = await fetchApi(chapterUrl).then((res) => res.text());
    const loadedCheerio = load(body);

    const chapterText = loadedCheerio(".epcontent").html() || "";
    return chapterText;
  }

  async searchNovels(searchTerm: string): Promise<Plugin.NovelItem[]> {
    const url = this.site + "?s=" + searchTerm;
    const body = await fetchApi(url).then((res) => res.text());
    const loadedCheerio = load(body);

    const novels: Plugin.NovelItem[] = [];

    loadedCheerio("article.maindet").each(function () {
      const name = loadedCheerio(this).find("h2").text();
      const image = loadedCheerio(this).find("img");
      const url = loadedCheerio(this).find("h2 a").attr("href");

      if (!url) return;
      novels.push({
        name,
        cover: image.attr("data-src") || image.attr("src"),
        url,
      });
    });

    return novels;
  }

  fetchImage = fetchFile;
}

const plugin = new WPmangaStreamPlugin({"id":"lightnovelfr","sourceSite":"https://lightnovelfr.com/","sourceName":"Ligh Novel FR","options":{"lang":"French","reverseChapters":true}});
export default plugin;