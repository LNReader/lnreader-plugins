import { Plugin } from "@typings/plugin";
import { fetchApi, fetchFile } from "@libs/fetch";
import { NovelStatus } from "@libs/novelStatus";
import { load as parseHTML } from "cheerio";

class FaqWikiUs implements Plugin.PluginBase {
  id = "FWK.US";
  name = "Faq Wiki";
  site = "https://faqwiki.us/";
  version = "1.0.0";
  icon = "src/en/faqwikius/icon.png";

  async popularNovels(
    page: number,
    { showLatestNovels }: Plugin.PopularNovelsOptions,
  ): Promise<Plugin.NovelItem[]> {
    const sort = showLatestNovels
      ? ""
      : "";

    const body = await fetchApi(this.site + sort).then((res) => res.text());
    const loadedCheerio = parseHTML(body);

    const novels: Plugin.NovelItem[] = loadedCheerio(".wp-block-table > table > tbody > tr")
        .map((index, element) => {
            const name = loadedCheerio(element).find("strong").first().text();
            let cover = loadedCheerio(element).find("img").attr("data-ezsrc"); 

            // Remove the appended query string 
            if (cover) {
                 cover = cover.replace(/\?ezimgfmt=.*$/, ''); // Regular expression magic!
            }

            const url = "" + loadedCheerio(element).find("a").attr("href");

            return { name, cover, url }; 
        })
        .get();

    return novels;
  }

  async parseNovelAndChapters(url: string): Promise<Plugin.SourceNovel> {
    const body = await fetchApi(url).then((res) => res.text());
    const loadedCheerio = parseHTML(body);

    const novel: Plugin.SourceNovel = { url };
    novel.name = loadedCheerio(".entry-title").text().replace("Novel – All Chapters", "").trim();

    let cover = loadedCheerio(".wp-block-image").find("img").attr("data-ezsrc");  

            // Remove the appended query string 
            if (cover) {
                 cover = cover.replace(/\?ezimgfmt=.*$/, ''); // Regular expression magic!
            }
    novel.cover = cover;

    novel.summary = loadedCheerio(".book-review-block__meta-item-value").text().trim();

    const chapters: Plugin.ChapterItem[] = loadedCheerio(".lcp_catlist > li > a")
      .map((chapterIndex, element) => ({
        name: loadedCheerio(element).text().replace(novel.name + "", "").replace("Novel" + "", "").trim(),
        url: ""+loadedCheerio(element).attr("href"),
        releaseTime: null,
        chapterNumber: chapterIndex + 1,
      }))
      .get(); 

    novel.chapters = chapters;
    return novel;
  }

  async parseChapter(chapterUrl: string): Promise<string> {
    const body = await fetchApi(chapterUrl).then((res) => res.text());
    const loadedCheerio = parseHTML(body);
    loadedCheerio("span").remove();
    // Target only <p> tags within .entry-content 
    const chapterParagraphs = loadedCheerio(".entry-content p");

   // Extract text from individual paragraphs and join 
    const chapterText = chapterParagraphs.map((index, element) => {
        return loadedCheerio(element).text().trim();
    }).get().join('\n\n'); // Add newlines between paragraphs

    return chapterText;
  }

  async searchNovels(
    searchTerm: string,
  ): Promise<Plugin.NovelItem[]> {
    const body = await fetchApi(this.site).then((res) => res.text());
    const loadedCheerio = parseHTML(body);

    const novels: Plugin.NovelItem[] = loadedCheerio(".wp-block-table > table > tbody > tr")
        .map((index, element) => {
            const name = loadedCheerio(element).find("strong").first().text();
            let cover = loadedCheerio(element).find("img").attr("data-ezsrc"); 

            // Remove the appended query string 
            if (cover) {
                 cover = cover.replace(/\?ezimgfmt=.*$/, ''); // Regular expression magic!
            }

            const url = "" + loadedCheerio(element).find("a").attr("href");

            return { name, cover, url }; 
        })
        .get();

      const normalizedQuery = searchTerm.toLowerCase(); 
      return novels.filter(novel => novel.name.toLowerCase().includes(normalizedQuery)
    );

    return novels;
  }

  fetchImage = fetchFile;
}

export default new FaqWikiUs();
