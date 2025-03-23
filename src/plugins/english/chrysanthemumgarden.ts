import { fetchApi, fetchProto, fetchText } from '@libs/fetch';
import { Plugin } from '@typings/plugin';
import { Filters } from '@libs/filterInputs';
import { load as loadCheerio } from 'cheerio';
import { defaultCover } from '@libs/defaultCover';

class Chrysanthemumgarden implements Plugin.PluginBase {
  id = 'chrysanthemumgarden';
  name = 'Chrysanthemum Garden';
  icon = 'src/en/chrysanthemumgarden/icon.png';
  site = 'https://chrysanthemumgarden.com';
  version = '1.0.0';
  filters: Filters | undefined = undefined;
  imageRequestInit?: Plugin.ImageRequestInit | undefined = undefined;

  //flag indicates whether access to LocalStorage, SesesionStorage is required.
  webStorageUtilized?: boolean;

  async popularNovels(
    pageNo: number,
    {
      showLatestNovels,
      filters,
    }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    const req = await fetchApi(
      this.site + (pageNo === 1 ? '/books' : '/books/page/' + pageNo) + '/',
    );
    const body = await req.text();
    const loadedCheerio = loadCheerio(body);
    return loadedCheerio('article')
      .map((i, el) => {
        if (
          loadedCheerio(el)
            .find('div.series-genres > a')
            .text()
            .includes('Manhua')
        )
          return;
        return {
          name: loadedCheerio(el).find('h2.novel-title > a').text(),
          path: loadedCheerio(el)
            .find('h2.novel-title > a')
            .attr('href')
            ?.replace(this.site, '')
            .replace(/^\//, '')
            .replace(/\/$/, ''),
          cover: loadedCheerio(el)
            .find('div.novel-cover > img')
            .attr('data-breeze'),
        };
      })
      .toArray()
      .filter(Boolean);
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const req = await fetchApi(this.site + '/' + novelPath + '/');
    const body = await req.text();
    const loadedCheerio = loadCheerio(body);
    loadedCheerio('h1.novel-title > span.novel-raw-title').remove();
    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: loadedCheerio('h1.novel-title').text(),
      cover: loadedCheerio('div.novel-cover > img').attr('data-breeze'),
      summary: loadedCheerio('div.entry-content').text(),
    };

    novel.author = loadedCheerio('div.novel-info')
      .html()
      .match(/Author:\s*([^<]*)<br>/)?.[1]
      .trim();
    novel.genres = [
      ...loadedCheerio('div.series-genres > a')
        .map((i, el) => loadedCheerio(el).text())
        .toArray(),
      ...loadedCheerio('a.series-tag')
        .map((i, el) => loadedCheerio(el).text().split('(')[0].trim())
        .toArray(),
    ].join(', ');

    novel.chapters = loadedCheerio('div.chapter-item > a').map((i, el) => {
      return {
        name: loadedCheerio(el).text().trim(),
        path: loadedCheerio(el)
          .attr('href')
          ?.replace(this.site, '')
          .replace(/^\//, '')
          .replace(/\/$/, ''),
      };
    });
    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const req = await fetchApi(this.site + '/' + chapterPath + '/');
    const body = await req.text();
    const loadedCheerio = loadCheerio(body);

    return loadedCheerio('div#novel-content').html() || '';
  }

  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    return this.paginate(
      (await this.getAllNovels()).filter(novel =>
        novel.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
      pageNo,
    );
  }

  paginate<T>(data: T[], page: number): T[] {
    const startIndex = (page - 1) * 20;
    const endIndex = startIndex + 20;
    return data.slice(startIndex, endIndex);
  }

  allNovelsCache: { name: string; path: string; cover: string }[] | undefined;

  async getAllNovels() {
    if (this.allNovelsCache) return this.allNovelsCache;
    const req = await fetchApi(this.site + '/wp-json/melimeli/novels');
    const body = await req.json();
    this.allNovelsCache = body.map(novel => ({
      name: novel.name,
      path: novel.link
        .replace(this.site, '')
        .replace(/\/$/, '')
        .replace(/^\//, ''),
      cover: defaultCover,
    }));
    return this.allNovelsCache;
  }

  resolveUrl = (path: string, isNovel?: boolean) =>
    this.site + (isNovel ? '/book/' : '/chapter/') + path;
}

export default new Chrysanthemumgarden();
