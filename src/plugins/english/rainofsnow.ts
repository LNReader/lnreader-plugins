import { fetchApi } from '@libs/fetch';
import { Plugin } from '@typings/plugin';
import { Filters } from '@libs/filterInputs';
import { CheerioAPI, load as parseHTML } from 'cheerio';
import { NovelStatus } from '@libs/novelStatus';

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
      const path = loadedCheerio(element)
        .find('h3 > a')
        .attr('href')
        ?.replace(this.site, '')
        .replace(/\/+$/, '');

      if (!path) {
        return;
      }

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

  async parseNovel(
    novelPath: string,
  ): Promise<Plugin.SourceNovel & { totalPages: number }> {
    const novel: Plugin.SourceNovel & { totalPages: number } = {
      path: novelPath,
      name: '',
      totalPages: 0,
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

    let x = 1;
    loadedCheerio('.page-numbers')
      .find('li')
      .each(function (i, el) {
        const num = loadedCheerio(el).find('a').text().trim().match(/(\d+)/);

        let n = Number(num?.[1] || '0');
        if (n > x) {
          x = n;
        }
      });

    novel.totalPages = x;

    novel.status = status ? NovelStatus.Completed : NovelStatus.Ongoing;
    novel.chapters = this.parseChapters(loadedCheerio);
    return novel;
  }

  // parse paged chapters
  async parsePage(novelPath: string, page: string): Promise<Plugin.SourcePage> {
    const url = this.site + novelPath + '/page/' + page + '/#chapter';
    const body = await fetchApi(url).then(res => res.text());
    const loadedCheerio = parseHTML(body);
    const chapters = this.parseChapters(loadedCheerio);
    return { chapters };
  }

  // helper to parse a novel
  parseChapters(loadedCheerio: CheerioAPI) {
    const chapter: Plugin.ChapterItem[] = [];

    loadedCheerio('#chapter')
      .find('li')
      .each((i, el) => {
        const name = loadedCheerio(el).find('.chapter').first().text().trim();
        const releaseTime = loadedCheerio(el).find('small').text();
        const path = loadedCheerio(el)
          .find('a')
          .attr('href')
          ?.slice(this.site.length);

        if (path && name) {
          chapter.push({ name, path, releaseTime });
        }
      });

    return chapter;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    // parse chapter text here
    const result = await fetch(this.site + chapterPath);
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
    // no page number, infinite scroll

    const newSearch = searchTerm.replace(/\s+/g, '+');
    let url = this.site + '?s=' + newSearch;

    console.log('SERCH URL: ', url);

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

    return novels;
  }
}

export default new Rainofsnow();
