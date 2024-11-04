import { CheerioAPI, load as parseHTML } from 'cheerio';
import { fetchApi } from '@libs/fetch';
import { Plugin } from '@typings/plugin';

class MVLEMPYRPlugin implements Plugin.PluginBase {
  id = 'mvlempyr.com';
  name = 'MVLEMPYR';
  icon = 'src/en/mvlempyr/icon.png';
  site = 'https://www.mvlempyr.com/';
  version = '1.0.0';

  headers = {
    'origin': 'https://www.mvlempyr.com/',
  };

  _pageCache = new Map<string, string>();
  _chapSite = 'https://chp.mvlempyr.com/';
  _assetsSite = 'https://assets.mvlempyr.com/';
  _allNovels: WPData[] | undefined;

  checkCaptcha(loadedCheerio: CheerioAPI) {
    const title = loadedCheerio('title').text();
    if (
      title === 'Attention Required! | Cloudflare' ||
      title === 'Just a moment...'
    )
      throw new Error('Captcha error, please open in webview');
  }

  parseNovels(
    loadedCheerio: CheerioAPI,
    nextPageConsumer: (nextPage: string) => void,
  ) {
    this.checkCaptcha(loadedCheerio);

    const nextPage = loadedCheerio('a.w-pagination-next.next').attr('href');
    if (nextPage) nextPageConsumer(nextPage);

    return loadedCheerio('.novelcolumn')
      .map((i, el) => {
        return {
          name: parseHTML(el)('h2[fs-cmsfilter-field="name"]').text(),
          path: parseHTML(el)('a').attr('href')!.replace(/^\//, ''),
          cover: parseHTML(el)('img').attr('src'),
        };
      })
      .toArray();
  }

  async popularNovels(pageNo: number): Promise<Plugin.NovelItem[]> {
    let pageQuery = '';
    if (pageNo > 1) {
      const query = this._pageCache.get('popularnovels-' + pageNo);
      if (query) {
        pageQuery += query;
      } else {
        return [];
      }
    }

    return await this.parseNovelListPage(
      `${this.site}novels${pageQuery}`,
      nextPage =>
        this._pageCache.set('popularnovels-' + (pageNo + 1), nextPage),
    );
  }

  async parseNovelListPage(
    url: string,
    nextPageConsumer: (nextPage: string) => void,
  ): Promise<Plugin.NovelItem[]> {
    const result = await fetchApi(url);
    const body = await result.text();

    const loadedCheerio = parseHTML(body);
    return this.parseNovels(loadedCheerio, nextPageConsumer);
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const url = this.site + novelPath;
    const result = await fetchApi(url);
    const body = await result.text();

    const loadedCheerio = parseHTML(body);

    this.checkCaptcha(loadedCheerio);

    const code = loadedCheerio('#novel-code').text();
    const tags = (
      await fetchApi(this._chapSite + 'wp-json/wp/v2/tags?slug=' + code, {
        headers: {
          origin2: this.site.replace(/\/$/, ''),
          origin: this.site.replace(/\/$/, ''),
        },
      }).then(res => res.json())
    )[0];

    const posts = (
      await Promise.all(
        new Array(Math.ceil(tags.count / 500))
          .fill(0)
          .map((_, i) => i + 1)
          .map(page =>
            fetchApi(
              this._chapSite +
                'wp-json/wp/v2/posts?tags=' +
                tags.id +
                '&per_page=500&page=' +
                page,
              {
                headers: {
                  // origin2: this.site.replace(/\/$/, ''),
                  origin: this.site.replace(/\/$/, ''),
                },
              },
            ).then(res => res.json()),
          ),
      )
    )
      .flat()
      .sort((a, b) => a.acf.chapter_number - b.acf.chapter_number);

    return {
      path: novelPath,
      name:
        loadedCheerio('div.image-container.w-embed > img').attr('alt') ||
        'Untitled',
      cover: loadedCheerio('div.image-container.w-embed > img').attr('src'),
      summary: loadedCheerio('div.synopsis.w-richtext').text().trim(),
      chapters: posts.map(chap => ({
        name: chap.acf.ch_name,
        path: 'chapter/' + chap.acf.novel_code + '-' + chap.acf.chapter_number,
        date: chap.date,
        chapterNumber: chap.acf.chapter_number,
      })),
      status: loadedCheerio('div.novelstatustextmedium').text(),
      author: loadedCheerio('div.mobileauthorname').text(),
      genres: loadedCheerio('div.novelgenre.mobile > div > div > a > div')
        .map((i, el) => loadedCheerio(el).text())
        .toArray()
        .join(','),
    };
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const result = await fetchApi(this.site + chapterPath);
    const body = await result.text();

    const loadedCheerio = parseHTML(body);
    this.checkCaptcha(loadedCheerio);

    return loadedCheerio('#chapter').html() || '';
  }

  async searchNovels(
    searchTerm: string,
    page: number,
  ): Promise<Plugin.NovelItem[]> {
    if (page > 1) return [];

    const allNovels = await this.getAllNovels();
    const searchResults = allNovels.filter(novel =>
      novel.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return searchResults.map(novel => ({
      name: novel.description,
      path: 'novel/' + novel.description.replace(/\s/g, '-').toLowerCase(),
      cover: this._assetsSite + 'images/600/' + novel.name + '.webp',
    }));
  }

  async getAllNovels() {
    if (this._allNovels) {
      return this._allNovels;
    }
    this._allNovels = await this.loadAll();
    return this._allNovels;
  }

  async loadAll() {
    const ret: WPData[] = [];
    let page = 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const pages = await this.loadNPages(page, 5);
      page += 5;

      pages.forEach(page => {
        ret.push(...page);
      });

      if (pages[pages.length - 1].length < 100) {
        break;
      }
    }
    return ret;
  }

  async loadPage(page: number): Promise<WPData[]> {
    const data = await fetch(
      `https://chp.mvlempyr.com/wp-json/wp/v2/tags?per_page=100&page=${page}`,
      {
        'headers': {
          'origin': 'https://www.mvlempyr.com/',
        },
      },
    );

    //filter out unneeded parts of the object to reduce memory usage
    return (await data.json()).map(
      ({
        id,
        description,
        name,
      }: {
        id: number;
        description: string;
        name: string;
      }) => ({
        id,
        description,
        name,
      }),
    );
  }

  async loadNPages(startingPage: number, pageCount: number) {
    return await Promise.all(
      Array.from({ length: pageCount }, (_, i) =>
        this.loadPage(startingPage + i),
      ),
    );
  }
}

type WPData = {
  id: number;
  name: string;
  description: string;
};

export default new MVLEMPYRPlugin();
