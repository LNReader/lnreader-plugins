import { Plugin } from "@typings/plugin";
import { fetchApi, fetchFile } from "@libs/fetch";
import { NovelStatus } from "@libs/novelStatus";
import { load as parseHTML } from "cheerio";

class Wuxiaworld implements Plugin.PluginBase {
  id = "wuxiaworld";
  name = "Wuxia World (WIP)";
  version = "1.0.0";
  icon = "src/en/wuxiaworld/icon.png";
  site = "https://www.wuxiaworld.com";

  async popularNovels(): Promise<Plugin.NovelItem[]> {
    const result = (
        await fetchApi(this.site + "/api/novels").then((res) => res.json())
    ) as { items: novelList[] };

    const novels: Plugin.NovelItem[] = result.items.map((novel) => ({
      name: novel.name,
      cover: novel.coverUrl,
      url: this.site + "/novel/" + novel.slug,
    }));
    return novels;
  }

  async parseNovelAndChapters(url: string): Promise<Plugin.SourceNovel> {
    const result = await fetchApi(url).then((res) => res.text());
    const loadedCheerio = parseHTML(result);

    const novel: Plugin.SourceNovel = { url };

    novel.name = loadedCheerio("h1.line-clamp-2").text();
    novel.cover = loadedCheerio("img.absolute").attr("src");
    novel.summary = loadedCheerio("div.flex-col:nth-child(4) > div > div > span > span")
      .text()
      .trim();

    novel.author = loadedCheerio("div.MuiGrid-container > div > div > div")
      .filter(function () {
        return loadedCheerio(this).text().trim() === "Author:";
      })
      .next()
      .text();

    const genres = loadedCheerio("a.MuiLink-underlineNone")
      .map((index, element) =>
        loadedCheerio(element).find("div > div").text()?.trim(),
      )
      .get()

    if (genres?.length) {
      novel.genres = genres.join(",");
    }

    novel.status = loadedCheerio("div.font-set-b10").text().includes("Complete")
      ? NovelStatus.Completed
      : NovelStatus.Ongoing;

    const chapters: Plugin.ChapterItem[] = loadedCheerio("div.border-b")
      .map((index, element) => ({
        name: loadedCheerio(element).find("a > div > div > div > span").text(),
        releaseTime: loadedCheerio(element).find("a > div > div > div > div > span").text(),
        url: this.site + loadedCheerio(element).find("a").attr("href"),
      }))
      .get();

    novel.chapters = chapters;
    return novel;
  }

  async parseChapter(chapterUrl: string): Promise<string> {
    const body = await fetchApi(chapterUrl).then((res) => res.text());
    const loadedCheerio = parseHTML(body);

    loadedCheerio(".chapter-nav").remove();
    loadedCheerio("#chapter-content > script").remove();

    const chapterText = loadedCheerio("#chapter-content").html() || "";
    return chapterText;
  }

  async searchNovels(searchTerm: string): Promise<Plugin.NovelItem[]> {
    const url = this.site + "/api/novels/search?query=" + searchTerm;
    const result = (await fetchApi(url).then((res) => res.json())) as { items: novelList[]; };

    const novels: Plugin.NovelItem[] = result.items.map((novel) => ({
      name: novel.name,
      cover: novel.coverUrl,
      url: this.site + "/novel/" + novel.slug,
    }));

    return novels;
  }

  fetchImage = fetchFile;
}

export default new Wuxiaworld();

interface novelList {
  id: number;
  name: string;
  active: boolean;
  abbreviation: string;
  slug: string;
  language: string;
  languageAbbreviation: string;
  visible: boolean;
  description: string;
  synopsis: string;
  coverUrl: string;
  translatorId: string;
  translatorName: null | string;
  translatorUserName: string;
  authorName: string;
  siteCreditsEnabled: boolean;
  teaserMessage: null | string;
  isFree: boolean;
  karmaActive: boolean;
  novelHasSponsorPlans: boolean;
  userHasEbook: boolean;
  userHasNovelUnlocked: boolean;
  reviewScore: number;
  reviewCount: number;
  excludedFromVipSelection: boolean;
  chapterGroups: any[];
  tags: any[];
  genres: any[];
  sponsorPlans: null;
  latestAnnouncement: null;
  ebooks: any[];
}

export interface SearchList {
  id: number;
  name: string;
  slug: string;
  coverUrl: string;
  abbreviation: string;
  synopsis: string;
  language: string;
  timeCreated: number;
  sneakPeek: boolean;
  status: number;
  chapterCount: number;
  reviewScore: number;
  tags: string[];
  genres: string[];
}
