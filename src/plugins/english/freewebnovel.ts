import { Plugin } from '@typings/plugin';
import { fetchApi } from '@libs/fetch';
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

  async getCheerio(url: string): Promise<CheerioAPI> {
    const r = await fetchApi(url);
    if (!r.ok)
      throw new Error(
        `Could not reach site (${r.status}: ${r.statusText}) try to open in webview.`,
      );
    return parseHTML(await r.text());
  }

  parseNovels(loadedCheerio: CheerioAPI) {
    return loadedCheerio('.li-row')
      .toArray()
      .map(el => {
        const row = loadedCheerio(el);
        const name = row.find('.tit').text().trim();
        const path = row.find('h3 > a').attr('href')?.slice(1);
        if (!name || !path) return null;

        const coverSrc = row.find('img').attr('src') || '';
        const cover = coverSrc.startsWith('http')
          ? coverSrc
          : this.site + coverSrc;

        return { name, cover, path };
      })
      .filter(Boolean) as Plugin.NovelItem[];
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
    }

    const url = `${this.site}${path}${page}`;
    const loadedCheerio = await this.getCheerio(url);
    return this.parseNovels(loadedCheerio);
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const loadedCheerio = await this.getCheerio(this.site + novelPath);

    const novel: Partial<Plugin.SourceNovel> = {
      path: novelPath,
    };

    const img = loadedCheerio('.m-imgtxt img');
    novel.name = img.attr('title');
    novel.cover = this.site + img.attr('src');

    loadedCheerio('.m-imgtxt .item').each((i, el) => {
      const item = loadedCheerio(el);
      const title = item.find('span').attr('title');

      switch (title) {
        case 'Author':
          novel.author = item.find('.right a').text();
          break;
        case 'Status':
          novel.status = item.find('.right span').text();
          break;
        case 'Genre':
          novel.genres = item
            .find('.right a')
            .map((_, el) => loadedCheerio(el).text())
            .toArray()
            .join(', ');
          break;
      }
    });

    novel.summary = loadedCheerio('.inner p')
      .toArray()
      .map(p => loadedCheerio(p).text().trim())
      .join('\n');

    const chapters: Plugin.ChapterItem[] = loadedCheerio('#idData > li > a')
      .toArray()
      .map((el, i) => {
        const a = loadedCheerio(el);
        const name = a.attr('title') || `Chapter ${i + 1}`;
        const href = a.attr('href');
        const path =
          href?.slice(1) ||
          novelPath.replace('.html', `/chapter-${i + 1}.html`);

        return {
          name,
          path,
          releaseTime: null,
          chapterNumber: i + 1,
        };
      });

    novel.chapters = chapters;
    return novel as Plugin.SourceNovel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const loadedCheerio = await this.getCheerio(this.site + chapterPath);
    const script = loadedCheerio('.footer')
      .prev()
      .text()
      .match(/e\("([^]+?)"/)?.[1];

    const chapterText = loadedCheerio('div.txt').html() || '';
    return chapterText
      .replace(script!, '')
      .replace(
        />([^<\.]+?\.)?[^\.<]*?[ƒfF][Rrɾг][Eēeё]+[Wwω𝑤]+[Eёēe][Bbɓ][Nnɳη][Oø૦ѳσo][Vѵνv][Eёeē][^<,!\?;:\"”“’‘\(\)\-\d]*/g,
        '>$1',
      );
  }

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

    const loadedCheerio = parseHTML(await r.text());
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
