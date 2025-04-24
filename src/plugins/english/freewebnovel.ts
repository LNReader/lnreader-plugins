import { Plugin } from '@typings/plugin';
import { fetchApi } from '@libs/fetch';
import { Parser } from 'htmlparser2';
import { CheerioAPI, load as parseHTML } from 'cheerio';
import { Filters, FilterTypes } from '@libs/filterInputs';

class FreeWebNovel implements Plugin.PluginBase {
  id = 'FWN.com';
  name = 'Free Web Novel';
  site = 'https://freewebnovel.com/';
  version = '1.2.0';
  icon = 'src/en/freewebnovel/icon.png';

  lastSearch: number | null = null;
  searchInterval = 3400;

  async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getHtml(url: string): Promise<string> {
    const r = await fetchApi(url);
    if (!r.ok)
      throw new Error(
        `Could not reach site (${r.status}: ${r.statusText}) try to open in webview.`,
      );
    return await r.text();
  }

  parseNovels(html: string) {
    const baseUrl = this.site;
    const novels: Plugin.NovelItem[] = [];
    let tempNovel: Partial<Plugin.NovelItem> = {};
    let state: ParsingState = ParsingState.Idle;
    const parser = new Parser({
      onopentag(name, attribs) {
        if (attribs.class === 'li-row') {
          state = ParsingState.Novel;
        }
        if (state !== ParsingState.Novel) return;

        switch (name) {
          case 'a':
            tempNovel.path = attribs.href?.split('/').slice(1, 3).join('/');
            break;
          case 'img':
            const coverSrc = attribs.src || '';
            tempNovel.cover = coverSrc.startsWith('http')
              ? coverSrc
              : baseUrl + coverSrc;
            break;
        }
      },

      onclosetag(name) {
        if (name === 'div') {
          if (tempNovel.name && tempNovel.path) {
            novels.push(tempNovel as Plugin.NovelItem);
            tempNovel = {};
            state = ParsingState.Idle;
          }
        }
      },
    });

    parser.write(html);
    parser.end();

    return novels;
  }

  async popularNovels(
    page: number,
    {
      showLatestNovels,
      filters,
    }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    let path: string;

    if (showLatestNovels) {
      path = 'sort/latest-novels/';
    } else if (filters?.genres?.value) {
      path = filters.genres.value;
    } else {
      if (page !== 1) return [];
      path = 'most-popular/';
      page = 0;
    }

    const url = `${this.site}${path}${page}`;
    const body = await this.getHtml(url);
    return this.parseNovels(body);
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const baseUrl = this.site;
    const body = await this.getHtml(this.site + novelPath);
    const novel: Partial<Plugin.SourceNovel> = {
      path: novelPath,
    };

    let state: ParsingState = ParsingState.Idle;
    let tempChapter: Partial<Plugin.ChapterItem> = {};
    const chapter: Plugin.ChapterItem[] = [];
    const summaryParts: string[] = [];
    const genreArray: string[] = [];

    const parser = new Parser({
      onopentag(name, attribs) {
        if (attribs.class === 'm-imgtxt') {
          state = ParsingState.NovelInfo;
        }
        if (state === ParsingState.NovelInfo) {
          switch (name) {
            case 'img':
              novel.name = attribs.title;
              novel.cover = baseUrl + attribs.src;
              break;
            case 'span':
              if (attribs.title) {
                const map: Record<string, ParsingState> = {
                  'Genre': ParsingState.Genre,
                  'Author': ParsingState.Author,
                  'Status': ParsingState.Status,
                };
                state = map[attribs.title] ?? state;
              }
              break;
          }
        }
        if (attribs.class === 'inner') {
          state = ParsingState.Summary;
        }
      },

      ontext(text) {
        switch (state) {
          case ParsingState.Summary:
            summaryParts.push(text.trim());
            break;
          case ParsingState.Genre:
            genreArray.push(text);
            break;
          case ParsingState.Status:
            const statusText = text;
            break;
          case ParsingState.Author:
            novel.author = (novel.author || '') + text;
            break;
        }
      },
    });

    return novel as Plugin.SourceNovel;
  }
  // async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
  //   const loadedCheerio = await this.getHtml(this.site + novelPath);

  //   const novel: Partial<Plugin.SourceNovel> = {
  //     path: novelPath,
  //   };

  //   const img = loadedCheerio('.m-imgtxt img');
  //   novel.name = img.attr('title');
  //   novel.cover = this.site + img.attr('src');

  //   loadedCheerio('.m-imgtxt .item').each((i, el) => {
  //     const item = loadedCheerio(el);
  //     const title = item.find('span').attr('title');

  //     switch (title) {
  //       case 'Author':
  //         novel.author = item.find('.right a').text();
  //         break;
  //       case 'Status':
  //         novel.status = item.find('.right span').text();
  //         break;
  //       case 'Genre':
  //         novel.genres = item
  //           .find('.right a')
  //           .map((_, el) => loadedCheerio(el).text())
  //           .toArray()
  //           .join(', ');
  //         break;
  //     }
  //   });

  //   novel.summary = loadedCheerio('.inner p')
  //     .toArray()
  //     .map(p => loadedCheerio(p).text().trim())
  //     .join('\n');

  //   const chapters: Plugin.ChapterItem[] = loadedCheerio('#idData > li > a')
  //     .toArray()
  //     .map((el, i) => {
  //       const a = loadedCheerio(el);
  //       const name = a.attr('title') || `Chapter ${i + 1}`;
  //       const href = a.attr('href');
  //       const path =
  //         href?.slice(1) ||
  //         novelPath.replace('.html', `/chapter-${i + 1}.html`);

  //       return {
  //         name,
  //         path,
  //         releaseTime: null,
  //         chapterNumber: i + 1,
  //       };
  //     });

  //   novel.chapters = chapters;
  //   return novel as Plugin.SourceNovel;
  // }

  // async parseChapter(chapterPath: string): Promise<string> {
  //   const loadedCheerio = await this.getHtml(this.site + chapterPath);
  //   const script = loadedCheerio('.footer')
  //     .prev()
  //     .text()
  //     .match(/e\("([^]+?)"/)?.[1];

  //   const chapterText = loadedCheerio('div.txt').html() || '';
  //   return chapterText.replace(script!, '');
  // }

  async searchNovels(searchTerm: string): Promise<Plugin.NovelItem[]> {
    const now = Date.now();
    if (this.lastSearch && now - this.lastSearch <= this.searchInterval) {
      await this.sleep(this.searchInterval);
    }

    const r = await fetchApi(this.site + 'search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ searchkey: searchTerm }).toString(),
    });

    this.lastSearch = Date.now();

    if (!r.ok) {
      throw new Error(
        `Could not reach site ('${r.status}') try to open in webview.`,
      );
    }

    const loadedCheerio = await r.text();
    const alertText =
      loadedCheerio('script')
        .text()
        .match(/alert\((.*?)\)/)?.[1] || '';
    if (alertText) throw new Error(alertText);

    return this.parseNovels(loadedCheerio);
  }

  filters = {
    genres: {
      type: FilterTypes.Picker,
      label: 'Genre',
      value: '',
      options: [
        { label: 'Action', value: 'genre/Action/' },
        { label: 'Adult', value: 'genre/Adult/' },
        { label: 'Adventure', value: 'genre/Adventure/' },
        { label: 'Comedy', value: 'genre/Comedy/' },
        { label: 'Drama', value: 'genre/Drama/' },
        { label: 'Eastern', value: 'genre/Eastern' },
        { label: 'Ecchi', value: 'genre/Ecchi/' },
        { label: 'Fantasy', value: 'genre/Fantasy/' },
        { label: 'Gender Bender', value: 'genre/Gender+Bender/' },
        { label: 'Harem', value: 'genre/Harem/' },
        { label: 'Historical', value: 'genre/Historical/' },
        { label: 'Horror', value: 'genre/Horror/' },
        { label: 'Josei', value: 'genre/Josei/' },
        { label: 'Game', value: 'genre/Game/' },
        { label: 'Martial Arts', value: 'genre/Martial+Arts/' },
        { label: 'Mature', value: 'genre/Mature/' },
        { label: 'Mecha', value: 'genre/Mecha/' },
        { label: 'Mystery', value: 'genre/Mystery/' },
        { label: 'Psychological', value: 'genre/Psychological/' },
        { label: 'Reincarnation', value: 'genre/Reincarnation' },
        { label: 'Romance', value: 'genre/Romance/' },
        { label: 'School Life', value: 'genre/School+Life/' },
        { label: 'Sci-fi', value: 'genre/Sci-fi/' },
        { label: 'Seinen', value: 'genre/Seinen/' },
        { label: 'Shoujo', value: 'genre/Shoujo/' },
        { label: 'Shounen Ai', value: 'genre/Shounen+Ai/' },
        { label: 'Shounen', value: 'genre/Shounen/' },
        { label: 'Slice of Life', value: 'genre/Slice+of+Life/' },
        { label: 'Smut', value: 'genre/Smut/' },
        { label: 'Sports', value: 'genre/Sports/' },
        { label: 'Supernatural', value: 'genre/Supernatural/' },
        { label: 'Tragedy', value: 'genre/Tragedy/' },
        { label: 'Wuxia', value: 'genre/Wuxia/' },
        { label: 'Xianxia', value: 'genre/Xianxia/' },
        { label: 'Xuanhuan', value: 'genre/Xuanhuan/' },
        { label: 'Yaoi', value: 'genre/Yaoi/' },
      ],
    },
  } satisfies Filters;
}

export default new FreeWebNovel();

enum ParsingState {
  Idle,
  Novel,
  Genre,
  Author,
  Status,
  Summary,
  NovelInfo,
}
