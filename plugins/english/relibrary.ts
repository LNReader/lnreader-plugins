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
  id = 'RLIB';
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

    const result = await fetch(this.site + '/translations/most-popular/');
    const body = await result.text();

    const loadedCheerio = loadCheerio(body);
    loadedCheerio('.entry-content > ol > li').each((_i, el) => {
      let novel: NovelItem = { name: '', path: '' };
      novel.name = loadedCheerio(el).find('h3 > a').text();
      novel.path =
        loadedCheerio(el).find('table > tbody > tr > td > a').attr('href') ||
        '';
      novel.cover = loadedCheerio(el)
        .find('table > tbody > tr > td > a > img')
        .attr('src');
      if (novel.name.startsWith(this.site)) {
        novel.name = novel.name.slice(this.site.length);
      }
      novels.push(novel);
    });

    return novels;
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: 'Untitled',
    };
    // title:		.entry-content > header.entry-header > .entry-title
    // img:			.entry-content > table > tbody > tr > td > img
    // tags:		.entry-content > table > tbody > tr > td > p > span > a[]
    // synopis:		.entry-content > div.su-box > div.su-box-content
    // chapters:	.entry-content > div.su-accordion <then> li.page_item[]
    //
    // TODO: get here data from the site and
    // un-comment and fill-in the relevant fields

    const result = await fetch(this.site + '/' + novelPath);
    const body = await result.text();

    const loadedCheerio = loadCheerio(body);

    novel.name =
      loadedCheerio('header.entry-header > .entry-title').text().trim() || '';
    // novel.artist = "";
    // novel.author = "";
    novel.cover =
      loadedCheerio('.entry-content > table > tbody > tr > td > img').attr(
        'src',
      ) || defaultCover;
    novel.genres = (() => {
      let genres: string[] = [];
      loadedCheerio(
        '.entry-content > table > tbody > tr > td > p > span > a',
      ).each((_i, el) => {
        genres.push(loadedCheerio(el).text().trim().replace(' ', '-'));
      });
      return genres.join(' ');
    })();
    novel.status =
      (() => {
        let status: any = NovelStatus.Unknown;
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
              status = loadedCheerio(el).text();
            }
          },
        );
        return status;
      })() || NovelStatus.Unknown;
    novel.summary =
      loadedCheerio(
        '.entry-content > div.su-box > div.su-box-content',
      ).text() || '';

    let chapters: Plugin.ChapterItem[] = [];

    // TODO: here parse the chapter list
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
    const result = await fetch(this.site + '/' + chapterPath);
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
  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    let novels: Plugin.NovelItem[] = [];

    // get novels using the search term

    return novels;
  }
  async fetchImage(url: string): Promise<string | undefined> {
    // if your plugin has images and they won't load
    // this is the function to fiddle with
    return fetchFile(url, { headers: { referer: this.site } });
  }
}

export default new ReLibraryPlugin();
