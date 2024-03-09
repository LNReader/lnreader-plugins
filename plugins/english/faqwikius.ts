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
    
    const body = await fetchApi(this.site).then((res) => res.text());
    const loadedCheerio = parseHTML(body);

    const novels: Plugin.NovelItem[] = loadedCheerio(".wp-block-table > table > tbody > tr")
      .map((index, element) => {
        const name = loadedCheerio(element).find('a').text().replace(/–\s+Chapter\s+List\s+–.*$/i,'');
        let cover = loadedCheerio(element).find("img").attr("data-ezsrc"); 

        // Remove the appended query string 
        if (cover) {
             cover = cover.replace(/\?ezimgfmt=.*$/, ''); // Regular expression magic!
        }

        const path = "" + loadedCheerio(element).find("a").attr("href")?.toString().replace(this.site, "").trim();


        return { name, cover, path }; 
    })
    .get()
      .filter((novel) => novel.name && novel.path);

    return novels;
  }

  async parseNovel(path: string): Promise<Plugin.SourceNovel> {
    const body = await fetchApi(this.site + path).then((res) => res.text());
    const loadedCheerio = parseHTML(body);

    const novel: Plugin.SourceNovel = {
      path,
      name: ""
    };
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
        path: ""+loadedCheerio(element).attr("href")?.toString().replace(this.site, "").trim(),
        releaseTime: null,
        chapterNumber: chapterIndex + 1,
      }))
      .get(); 

    novel.chapters = chapters;
    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const body = await fetchApi(this.site + chapterPath).then((res) => res.text());
    const loadedCheerio = parseHTML(body);
    loadedCheerio("span").remove();

    const chapterParagraphs = loadedCheerio(".entry-content p");

    let chapterContent; // Variable to store the result

    if (chapterParagraphs.length < 5) { //some chapter in this site store their whole text in 1-4 <p>,  
        chapterContent = chapterParagraphs.map((index, element) => {
          const text = loadedCheerio(element).html()
          return text; 
      }).get().join('\n\n'); 
    } 
	
	else {
         // Multiple paragraphs case
        chapterContent = chapterParagraphs.map((index, element) => {
            const text = loadedCheerio(element).text().trim();
            return `<p>${text}</p>`; 
        }).get().join('\n\n'); 
    }

    return chapterContent;
}


  async searchNovels(searchTerm: string): Promise<Plugin.NovelItem[]> {
    const body = await fetchApi(this.site).then((res) => res.text());
    const loadedCheerio = parseHTML(body);

    const novels: Plugin.NovelItem[] = loadedCheerio(".wp-block-table > table > tbody > tr")
      .map((index, element) => {
        const name = loadedCheerio(element).find('a').text().replace(/–\s+Chapter\s+List\s+–.*$/i,'');
        let cover = loadedCheerio(element).find("img").attr("data-ezsrc"); 

        // Remove the appended query string 
        if (cover) {
             cover = cover.replace(/\?ezimgfmt=.*$/, ''); // Regular expression magic!
        }

        const path = "" + loadedCheerio(element).find("a").attr("href")?.toString().replace(this.site, "").trim();

        return { name, cover, path }; 
    })
    .get().filter((novel) => novel.name && novel.path);
    const normalizedQuery = searchTerm.toLowerCase(); 
    return novels.filter(novel => novel.name.toLowerCase().includes(normalizedQuery));

    return novels;
  }

  fetchImage = fetchFile;
}

export default new FaqWikiUs();
