import { fetchApi } from '@libs/fetch';
import { Plugin } from '@typings/plugin';
import { Filters } from '@libs/filterInputs';
import { CheerioAPI, load as loadCheerio } from 'cheerio';
import { defaultCover } from '@libs/defaultCover';

class ReadFromPlugin implements Plugin.PluginBase {
  id = 'readfrom';
  name = 'Read From Net';
  icon = 'src/en/readfrom/icon.png';
  site = 'https://readfrom.net';
  version = '1.0.1';
  filters: Filters | undefined = undefined;
  imageRequestInit?: Plugin.ImageRequestInit | undefined = undefined;

  //flag indicates whether access to LocalStorage, SesesionStorage is required.
  webStorageUtilized?: boolean;

  loadedNovelCache: (Plugin.NovelItem & {
    summary: string;
    genres: string;
    author: string;
  })[] = [];

  parseNovels(
    loadedCheerio: CheerioAPI,
    isSearch?: boolean,
  ): (Plugin.NovelItem & {
    summary: string;
    genres: string;
    author: string;
  })[] {
    let ret = loadedCheerio(
      (isSearch ? 'div.text' : '#dle-content') + ' > article.box',
    )
      .map((i, el) => {
        let summary = loadedCheerio(el).find(
          isSearch ? 'div.text5' : 'div.text3',
        )[0];
        loadedCheerio(summary).find('.coll-ellipsis').remove();
        loadedCheerio(summary).find('a').remove();
        return {
          name: loadedCheerio(el).find('h2.title').text().trim(),
          path: loadedCheerio(el)
            .find('h2.title > a')
            .attr('href')!
            .replace('https://readfrom.net/', '')
            .replace(/^\//, ''),
          cover: loadedCheerio(el).find('img').attr('src') || defaultCover,
          summary:
            loadedCheerio(summary).text().trim() +
            loadedCheerio(summary).find('span.coll-hidden').text(),
          genres: loadedCheerio(el)
            .find(isSearch ? 'h5.title > a' : 'h2 > a')
            .filter((i, el) => el.attribs['title']?.startsWith?.('Genre - '))
            .map((i, el) => loadedCheerio(el).text())
            .toArray()
            .join(', '),
          author: isSearch
            ? loadedCheerio(el)
                .find('h5.title > a')
                .filter((i, el) =>
                  el.attribs['title']?.startsWith?.('Book author - '),
                )
                .text()
            : loadedCheerio(el).find('h4 > a').text(),
        };
      })
      .toArray();

    this.loadedNovelCache.push(...ret);
    while (this.loadedNovelCache.length > 100) {
      this.loadedNovelCache.shift();
    }

    return ret;
  }

  async popularNovels(
    pageNo: number,
    {
      showLatestNovels,
      filters,
    }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ) {
    let type = showLatestNovels ? 'last_added_books' : 'allbooks';
    let res = await fetchApi(
      'https://readfrom.net/' + type + '/page/' + pageNo + '/',
    );
    let text = await res.text();
    return this.parseNovels(loadCheerio(text));
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    let data = await fetchApi('https://readfrom.net/' + novelPath);
    let text = await data.text();
    let loadedCheerio = loadCheerio(text);

    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: 'Untitled',
    };

    novel.name = loadedCheerio('center > h2.title')
      .text()
      .split(', \n\n')[0]
      .trim();
    novel.cover =
      loadedCheerio('article.box > div > center > div > a > img').attr('src') ||
      defaultCover;

    novel.chapters = loadedCheerio(loadedCheerio('div.pages').get()[0])
      .find('> a')
      .map((i, el) => {
        return {
          name: loadedCheerio(el).text().trim(),
          path: loadedCheerio(el)
            .attr('href')!
            .replace('https://readfrom.net/', '')
            .replace(/^\//, ''),
          // releaseTime: '',
          chapterNumber: i + 2,
        };
      })
      .toArray();
    novel.chapters.unshift({
      name: '1',
      path: novelPath,
      chapterNumber: 1,
    });

    let moreNovelInfo = this.loadedNovelCache.find(
      novel => novel.path === novelPath,
    );
    if (!moreNovelInfo)
      moreNovelInfo = (await this.searchNovels(novel.name, 1)).find(
        novel => novel.path === novelPath,
      );
    if (moreNovelInfo) {
      novel.summary = moreNovelInfo.summary;
      novel.genres = moreNovelInfo.genres;
      novel.author = moreNovelInfo.author;
    }

    let seriesElm = loadedCheerio('center > b:has(a)').filter((i, el) =>
      loadedCheerio(el).find('a').attr('href')!.startsWith('/series.html'),
    )[0];

    if (seriesElm) {
      let seriesText = loadedCheerio(seriesElm).text().trim();

      novel.summary = seriesText + '\n\n' + novel.summary;
    }

    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    let data = await fetchApi('https://readfrom.net/' + chapterPath);
    let text = await data.text();
    let loadedCheerio = loadCheerio(text);
    loadedCheerio('#textToRead > span:empty').remove();
    loadedCheerio('#textToRead > center').remove();
    return loadedCheerio('#textToRead').html() || '';
  }

  async searchNovels(searchTerm: string, pageNo: number) {
    if (pageNo !== 1) return [];
    let res = await fetchApi(
      'https://readfrom.net/build_in_search/?q=' +
        encodeURIComponent(searchTerm),
    );
    let text = await res.text();
    return this.parseNovels(loadCheerio(text), true);
  }

  resolveUrl = (path: string, isNovel?: boolean) => this.site + '/' + path;
}

export default new ReadFromPlugin();
