import { fetchApi } from '@libs/fetch';
import { Plugin } from '@typings/plugin';
import { Filters } from '@libs/filterInputs';
import { load as loadCheerio } from 'cheerio';

class DaoistQuestPlugin implements Plugin.PluginBase {
  id = 'daoistquest';
  name = 'Daoist Quest';
  icon = 'src/en/daoistquest/icon.png';
  site = 'https://daoist.quest';
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
    if (pageNo !== 1) return [];
    const req = await fetchApi(this.site + '/collection/novels/');
    const body = await req.text();
    const loadedCheerio = loadCheerio(body);

    return loadedCheerio('#featured-list > li > div > div')
      .map((i, el) => {
        const novelName = loadedCheerio(el).find('h3 > a').text();
        const novelCover = loadedCheerio(el)
          .find('a.cell-img:has(img)')
          .attr('href');
        const novelUrl = loadedCheerio(el).find('h3 > a').attr('href');

        return {
          name: novelName,
          cover: novelCover,
          path: novelUrl!.replace(this.site + '/', '').replace(/\/$/, ''),
        };
      })
      .toArray();
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const req = await fetchApi(this.site + '/' + novelPath + '/');
    const body = await req.text();
    const loadedCheerio = loadCheerio(body);

    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: loadedCheerio('h1.story__identity-title').text(),
    };

    // novel.artist = '';
    novel.author = loadedCheerio('div.story__identity-meta')
      .text()
      .split('|')[0]
      .replace('Author: ', '')
      .trim();
    novel.cover = loadedCheerio('figure.story__thumbnail > a').attr('href');
    novel.genres = loadedCheerio('div.tag-group > a')
      .map((i, el) => loadedCheerio(el).text())
      .toArray()
      .join(',');
    novel.summary = loadedCheerio('section.story__summary').text();

    novel.chapters = loadedCheerio('li.chapter-group__list-item._publish')
      .filter((i, el) => !el.attribs['class'].includes('_password'))
      .map((i, el) => {
        const chapterName = loadedCheerio(el).find('a').text();
        const chapterUrl = loadedCheerio(el)
          .find('a')
          .attr('href')
          ?.replace(this.site + '/', '')
          .replace(/\/$/, '');

        return {
          name: chapterName,
          path: chapterUrl!,
        };
      })
      .toArray();

    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const req = await fetchApi(this.site + '/' + chapterPath + '/');
    const body = await req.text();

    const loadedCheerio = loadCheerio(body);
    return loadedCheerio('section#chapter-content > div').html() || '';
  }

  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    if (pageNo !== 1) return [];
    const req = await fetchApi(
      this.site + `?s=${encodeURIComponent(searchTerm)}&post_type=fcn_story`,
    );
    const body = await req.text();
    const loadedCheerio = loadCheerio(body);

    return loadedCheerio('#search-result-list > li > div > div')
      .map((i, el) => {
        const novelName = loadedCheerio(el).find('h3 > a').text();
        const novelCover = loadedCheerio(el)
          .find('a.cell-img:has(img)')
          .attr('href');
        const novelUrl = loadedCheerio(el).find('h3 > a').attr('href');

        return {
          name: novelName,
          cover: novelCover,
          path: novelUrl!.replace(this.site + '/', '').replace(/\/$/, ''),
        };
      })
      .toArray();
  }

  resolveUrl = (path: string, isNovel?: boolean) =>
    this.site + '/' + path + '/';
}

export default new DaoistQuestPlugin();
