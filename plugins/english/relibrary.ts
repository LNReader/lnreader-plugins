import { fetchFile, fetchText } from '@libs/fetch';
import { Plugin } from '@typings/plugin';
import { Filters } from '@libs/filterInputs';
import { load as loadCheerio, CheerioAPI } from 'cheerio';
import { defaultCover } from '@libs/defaultCover';
import { NovelStatus } from '@libs/novelStatus';
import { NovelItem } from '../../test_web/static/js';
// import { isUrlAbsolute } from "@libs/isAbsoluteUrl";
// import { parseMadaraDate } from "@libs/parseMadaraDate";

class ReLibraryPlugin implements Plugin.PluginBase {
  id = 'ReLib';
  name = 'Re:Library';
  icon = 'src/en/relibrary/icon.png';
  site = 'https://re-library.com';
  version = '1.0.0';
  filters: Filters | undefined = undefined;

  async popularNovels(
    pageNo: number,
    {
      showLatestNovels,
      filters,
    }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    const novels: Plugin.NovelItem[] = [];

    /// This check is because there isn't any page system for their most popular section, so force to return an empty array for page != 0
    // same for the latest novels, it isn't implemented (or I haven't seen the page yet ...)
    if (pageNo == 1 && !showLatestNovels) {
      const result = await fetch(`${this.site}/translations/most-popular/`);
      const body = await result.text();

      const loadedCheerio = loadCheerio(body);
      loadedCheerio('.entry-content > ol > li').each((_i, el) => {
        let novel: NovelItem = { name: '', path: '' };
        novel.name = loadedCheerio(el).find('h3 > a').text();
        novel.path =
          loadedCheerio(el).find('table > tbody > tr > td > a').attr('href') ||
          '';
        novel.cover =
          loadedCheerio(el)
            .find('table > tbody > tr > td > a > img')
            .attr('src') || defaultCover;
        if (novel.path.startsWith(this.site)) {
          novel.path = novel.path.slice(this.site.length);
        }
        novels.push(novel);
      });
    }

    return novels;
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    let novel: Plugin.SourceNovel = {
      name: 'Broken Scraping',
      path: 'Broken Scraping',
    };
    // title:		.entry-content > header.entry-header > .entry-title
    // img:			.entry-content > table > tbody > tr > td > img
    // tags:		.entry-content > table > tbody > tr > td > p > span > a[]
    // synopis:		.entry-content > div.su-box > div.su-box-content
    // chapters:	.entry-content > div.su-accordion <then> li.page_item[]

    const result = await fetch(`${this.site}/${novelPath}`);
    const body = await result.text();

    const loadedCheerio = loadCheerio(body);

    // If it doesn't find the name I should just throw an error (or early return) since the scraping is broken
    novel.name =
      loadedCheerio('header.entry-header > .entry-title').text().trim() || '';

    // Find the cover
    novel.cover =
      loadedCheerio('.entry-content > table > tbody > tr > td > img').attr(
        'src',
      ) || defaultCover;

    // Genres in comma separated "list"
    novel.genres = (() => {
      let genres: string[] = [];
      loadedCheerio(
        '.entry-content > table > tbody > tr > td > p > span > a',
      ).each((_i, el) => {
        genres.push(loadedCheerio(el).text().trim());
      });
      return genres.join(',');
    })();

    // Handle the novel status
    // Sadly some novels just state the status inside the summary...
    // I don't even know if the snippet here works for *most* of the novels preset, or only for a few
    {
      loadedCheerio('.entry-content > table > tbody > tr > td > p').each(
        function (_i, el) {
          if (
            loadedCheerio(el)
              .find('strong')
              .text()
              .toLowerCase()
              .trim()
              .startsWith('status')
          ) {
            loadedCheerio(el).find('strong').remove();
            novel.status = loadedCheerio(el).text();
          }
        },
      );
    }

    novel.summary =
      loadedCheerio(
        '.entry-content > div.su-box > div.su-box-content',
      ).text() || '';

    let chapters: Plugin.ChapterItem[] = [];

    let chapter_idx = 0;
    loadedCheerio('.entry-content > div.su-accordion').each((_i1, el) => {
      loadedCheerio(el)
        .find('li.page_item > a')
        .each((_i2, chap_el) => {
          chapter_idx += 1;
          let chap_path = loadedCheerio(chap_el).attr('href')?.trim();
          if (chap_path?.startsWith(this.site)) {
            chap_path = chap_path.slice(this.site.length);
          }
          chapters.push({
            name: loadedCheerio(chap_el).text() || '',
            path: chap_path || '',
            chapterNumber: chapter_idx,
          });
        });
    });

    novel.chapters = chapters;
    return novel;
  }
  async parseChapter(chapterPath: string): Promise<string> {
    // parse chapter text here
    const result = await fetch(`${this.site}/${chapterPath}`);
    const body = await result.text();

    const loadedCheerio = loadCheerio(body);
    let text: string[] = [];
    loadedCheerio('.entry-content > p')
      .slice(1)
      .each((_i, el) => {
        loadedCheerio(el).find('span').remove();
        let t = loadedCheerio(el).html();
        text.push('<p>' + (t || '') + '</p>');
      });
    return text.join('');
  }

  // TODO: This search sucks and doesn't really works.
  // for example do search "Hero", you'll only find a single result, but Hero King isn't shown (at least at the time of writing this)
  // The issue is that I need to filter out junk from the search page, and it may happen that a page has zero element in it (as in nothing valuable)
  // thus the app thinks it has reached the end of the pages, while it hasn't...
  // it may be possible to hook into an direct wordpress api, but I haven't looked into it right now...
  // It also lacks the covers, because the search pages doesn't show them. But the website does host them
  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    let novels: Plugin.NovelItem[] = [];
    const req = await fetch(
      `${this.site}/category/translations/page/${pageNo}/?s=${encodeURIComponent(searchTerm)}&post_types=page`,
    );
    const body = await req.text();

    const loadedCheerio = loadCheerio(body);

    loadedCheerio('.site-content > .category-translations').each((_i, el) => {
      let url = loadedCheerio(el).find('.entry-title > a').attr('href');
      let name = loadedCheerio(el).find('.entry-title > a').text();
      if (url === undefined || name == undefined) return;
      let novel: any = {};
      novel.path = url;
      if (novel.path.startsWith(this.site)) {
        novel.path = novel.path.slice(this.site.length);
      }
      novel.name = name;
      novel.cover = defaultCover;
      novels.push(novel);
    });
    return novels;
  }

  async fetchImage(url: string): Promise<string | undefined> {
    // if your plugin has images and they won't load
    // this is the function to fiddle with
    return fetchFile(url, { headers: { referer: this.site } });
  }
}

export default new ReLibraryPlugin();
