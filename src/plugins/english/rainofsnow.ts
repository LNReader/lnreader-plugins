import { fetchApi } from '@libs/fetch';
import { Plugin } from '@typings/plugin';
import { Filters } from '@libs/filterInputs';
import { CheerioAPI, load as parseHTML } from 'cheerio';
import { NovelStatus } from '@libs/novelStatus';

const baseUrl = 'https://rainofsnow.com/';

class Rainofsnow implements Plugin.PagePlugin {
  id = 'rainofsnow';
  name = 'Rainofsnow';
  icon = 'src/en/rainofsnow/icon.png';
  site = 'https://rainofsnow.com/';
  version = '1.0.0';
  filters: Filters | undefined = undefined;
  imageRequestInit?: Plugin.ImageRequestInit | undefined = undefined;

  parseNovels(loadedCheerio: CheerioAPI, searchTerm?: string) {
    let novels: Plugin.NovelItem[] = [];

    loadedCheerio('.minbox').each((index, element) => {
      const name = loadedCheerio(element).find('h3').text();
      const cover = loadedCheerio(element).find('img').attr('data-src');
      const xpath = loadedCheerio(element)
        .find('h3 > a')
        .attr('href')
        ?.replace(this.site, '')
        .replace(/\/+$/, '');

      if (!xpath) {
        return;
      }

      const path = xpath;

      novels.push({ name, cover, path });
    });

    if (searchTerm) {
      novels = novels.filter(novel =>
        novel.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return novels;
  }

  async popularNovels(
    pageNo: number,
    {
      showLatestNovels,
      filters,
    }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    let url = this.site + 'novels/page/' + pageNo;
    const body = await fetchApi(url).then(res => res.text());
    const loadedCheerio = parseHTML(body);

    return this.parseNovels(loadedCheerio);
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: '',
    };

    const body = await fetchApi(this.site + novelPath).then(res => res.text());
    const loadedCheerio = parseHTML(body);

    novel.name = loadedCheerio('div.text > h2').text().trim();

    novel.cover = loadedCheerio('.imagboca1 > img').attr('data-src');

    novel.summary = loadedCheerio('#synop').text().trim();

    novel.genres = loadedCheerio(
      'body > div.queen > div > div > div.row > div.col-md-12.col-lg-7 > div > div.backcolor1 > ul > li:nth-child(5) > small',
    )
      .text()
      .trim();

    novel.author = loadedCheerio(
      'body > div.queen > div > div > div.row > div.col-md-12.col-lg-7 > div > div.backcolor1 > ul > li:nth-child(2) > small',
    ).text();

    novel.status = status ? NovelStatus.Completed : NovelStatus.Ongoing;

    const novelChapters: Plugin.ChapterItem[] = [];

    loadedCheerio('#chapter')
      .find('li')
      .each(function () {
        const name = loadedCheerio(this).find('.chapter').first().text().trim();
        const releaseTime = loadedCheerio(this).find('small').text();
        const path = loadedCheerio(this).find('a').attr('href');

        // the link looks like this:
        // https://rainofsnow.com/chapters/missing-fiance-ch1/?novelid=61402
        //
        // ok sooo wtf. npm says I cant have the full link here, so i slice it off with
        // ?.slice(novelPath.length);
        // and get 'chapters/missing-fiance-ch1/?novelid=61402'
        // which testing this with 'Parse Chapter' crashes the proxy with 'Invalid URL'
        // but if I use the full link, it works perfectly fine... but then the test site complains that it needs to be relative -_-

        if (path && name) {
          novelChapters.push({ name, path, releaseTime });
        }
      });

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    let page = 1;

    let nextPageExists = loadedCheerio('.next.page-numbers').length;

    while (nextPageExists) {
      const chaptersUrl = `${novelPath}page/${++page}/#chapter`;

      const chaptersRequest = await fetch(chaptersUrl);
      const chaptersHtml = await chaptersRequest.text();

      let newCheerio = parseHTML(chaptersHtml);

      nextPageExists = newCheerio('.next.page-numbers').length;

      newCheerio('#chapter')
        .find('li')
        .each(function () {
          const name = loadedCheerio(this)
            .find('.chapter')
            .first()
            .text()
            .trim();
          const releaseTime = newCheerio(this).find('small').text();
          const path = newCheerio(this).find('a').attr('href');
          // ?.slice(novelPath.length);

          if (path && name) {
            novelChapters.push({ name, releaseTime, path });
          }
        });

      delay(1000);
    }

    novel.chapters = novelChapters;

    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    // parse chapter text here
    const result = await fetch(chapterPath);
    const body = await result.text();

    const loadedCheerio = parseHTML(body);

    let chapterName = loadedCheerio('.content > h2').text();
    let chapterText = loadedCheerio('.content').html();
    if (!chapterText) return '';
    return chapterName + '\n' + chapterText;
  }

  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    const novels: Plugin.NovelItem[] = [];
    // get novels using the search term

    const newSearch = searchTerm.replace(/\s+/g, '+');
    let url = baseUrl + '?s=' + newSearch;
    const result = await fetch(url);
    const body = await result.text();
    const loadedCheerio = parseHTML(body);

    loadedCheerio('.minbox').each((index, element) => {
      const name = loadedCheerio(element).find('h3').text();
      const cover = loadedCheerio(element).find('img').attr('data-src');
      const path = loadedCheerio(element)
        .find('h3 > a')
        .attr('href')
        ?.slice(this.site.length)
        .replace(/\/+$/, '');

      if (!path) {
        return;
      }

      novels.push({ name, cover, path });
    });

    // return this.parseNovels(loadedCheerio, searchTerm);
    return novels;
  }

  // wtf does this do?
  // resolveUrl = (path: string, isNovel?: boolean) =>
  //   this.site + (isNovel ? '/book/' : '/chapter/') + path;
}

export default new Rainofsnow();
