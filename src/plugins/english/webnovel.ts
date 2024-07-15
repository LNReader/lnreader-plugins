/* eslint-disable no-case-declarations */
import { load as parseHTML } from 'cheerio';
import { fetchApi } from '@libs/fetch';
import { Filters, FilterTypes } from '@libs/filterInputs';
import { Plugin } from '@typings/plugin';

class Webnovel implements Plugin.PluginBase {
  id = 'webnovel';
  name = 'Webnovel';
  version = '1.0.0';
  icon = 'src/en/webnovel/icon.png';
  site = 'https://www.webnovel.com';
  imageRequestInit?: Plugin.ImageRequestInit | undefined = {
    headers: {
      'referrer': this.site,
    },
  };

  async parseNovels(json: any[]): Promise<Plugin.NovelItem[]> {
    return json.map((novel: any) => {
      return {
        name: novel.novel_title,
        path: `/novels/${novel.abbreviation}`,
        cover: novel.cover,
      };
    });
  }

  async popularNovels(
    pageNo: number,
    {
      showLatestNovels,
      filters,
    }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    let url = this.site + 'search-adv';
    if (showLatestNovels) {
      url += `?ctgcon=and&totalchapter=0&ratcon=min&rating=0&status=-1&sort=date&tagcon=and&page=${pageNo}`;
    } else if (filters) {
      const params = new URLSearchParams();
      for (const language of filters.language.value) {
        params.append('country_id[]', language);
      }
      params.append('ctgcon', filters.genre_operator.value);
      for (const genre of filters.genres.value) {
        params.append('categories[]', genre);
      }
      params.append('totalchapter', filters.chapters.value);
      params.append('ratcon', filters.rating_operator.value);
      params.append('rating', filters.rating.value);
      params.append('status', filters.status.value);
      params.append('sort', filters.sort.value);
      params.append('page', pageNo.toString());
      url += `?${params.toString()}`;
    } else {
      url += `?ctgcon=and&totalchapter=0&ratcon=min&rating=0&status=-1&sort=all-time-rank&page=${pageNo}`;
    }

    const result = await fetchApi(url);
    const body = await result.text();
    const loadedCheerio = parseHTML(body);

    return loadedCheerio('.novel-item')
      .map((index, ele) => {
        const novelName =
          loadedCheerio(ele).find('.novel-title > a').attr('title') ||
          'No Title Found';
        const novelCover = loadedCheerio(ele)
          .find('.novel-cover > img')
          .attr('data-src');
        const novelPath = loadedCheerio(ele)
          .find('.novel-title > a')
          .attr('href');

        if (!novelPath) return null;

        return {
          name: novelName,
          cover: novelCover,
          path: novelPath.replace(this.site, ''),
        };
      })
      .get()
      .filter(novel => novel !== null);
  }

  async parseChapters(
    novelPath: string,
    pages: number,
  ): Promise<Plugin.ChapterItem[]> {
    const pagesArray = Array.from({ length: pages }, (_, i) => i + 1);
    const allChapters: Plugin.ChapterItem[] = [];

    // Function to parse a single page
    const parsePage = async (page: number) => {
      const url = `${this.site}${novelPath}/chapters?page=${page}`;
      const result = await fetchApi(url);
      const body = await result.text();

      const loadedCheerio = parseHTML(body);

      const chapters = loadedCheerio('.chapter-list li')
        .map((index, ele) => {
          const chapterName =
            loadedCheerio(ele).find('a').attr('title') || 'No Title Found';
          const chapterPath = loadedCheerio(ele).find('a').attr('href');

          if (!chapterPath) return null;

          return {
            name: chapterName,
            path: chapterPath.replace(this.site, ''),
          };
        })
        .get()
        .filter(chapter => chapter !== null) as Plugin.ChapterItem[];

      return chapters;
    };

    // Parse all pages in parallel
    const chaptersArray = await Promise.all(pagesArray.map(parsePage));

    // Merge all chapters into a single array
    for (const chapters of chaptersArray) {
      allChapters.push(...chapters);
    }

    return allChapters.length === 0 ? [] : allChapters;
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const url = this.site + novelPath;
    const result = await fetchApi(url);
    const body = await result.text();

    const loadedCheerio = parseHTML(body);

    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: loadedCheerio('.novel-title').text() || 'No Title Found',
      cover: loadedCheerio('.cover > img').attr('data-src'),
      genres: loadedCheerio('.categories .property-item')
        .map((i, el) => loadedCheerio(el).text())
        .toArray()
        .join(','),
      summary:
        loadedCheerio('.summary .content .txt')
          .html()!
          .replace(/<\/p>/g, '\n\n')
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<[^>]+>/g, '')
          .trim() || 'No Summary Found',
      author:
        loadedCheerio('.author .property-item > span').text() ||
        'No Author Found',
      status:
        loadedCheerio('.header-stats .ongoing').text() ||
        loadedCheerio('.header-stats .completed').text() ||
        'No Status Found',
    };

    const totalChapters = loadedCheerio('.header-stats .icon-book-open')
      .parent()
      .text()
      .trim();
    const pages = Math.ceil(parseInt(totalChapters) / 100);
    novel.chapters = await this.parseChapters(novelPath, pages);

    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const url = this.site + chapterPath;
    const result = await fetchApi(url);
    const body = await result.text();

    const loadedCheerio = parseHTML(body);

    const bloatElements = [
      '.box-ads',
      '.box-notification',
      /^nf/, // Regular expression to match tags starting with 'nf'
    ];
    bloatElements.map(tag => {
      if (tag instanceof RegExp) {
        loadedCheerio('*')
          .filter((_, el) =>
            tag.test(loadedCheerio(el).prop('tagName')!.toLowerCase()),
          )
          .remove();
      } else {
        loadedCheerio(tag).remove();
      }
    });

    return loadedCheerio('#content').html()!;
  }

  async searchNovels(
    searchTerm: string,
    page: number,
  ): Promise<Plugin.NovelItem[]> {
    const url = `${this.site}search?keyword=${searchTerm}&page=${page}`;
    const result = await fetchApi(url);
    const body = await result.text();

    const loadedCheerio = parseHTML(body);

    return loadedCheerio('.novel-list.chapters .novel-item')
      .map((index, ele) => {
        const novelName =
          loadedCheerio(ele).find('a').attr('title') || 'No Title Found';
        const novelCover = loadedCheerio(ele)
          .find('.novel-cover > img')
          .attr('src');
        const novelPath = loadedCheerio(ele).find('a').attr('href');

        if (!novelPath) return null;

        return {
          name: novelName,
          cover: novelCover,
          path: novelPath.replace(this.site, ''),
        };
      })
      .get()
      .filter(novel => novel !== null);
  }

  filters = {
    test: {
      label: 'Test',
      type: FilterTypes.Picker,
      value: '0',
      options: [
        {
          label: 'Male',
          value: '0',
          subFilters: {
            male: {
              label: 'Male Options',
              type: FilterTypes.Picker,
              value: '0',
              options: [
                { label: 'All', value: '0' },
                { label: '1', value: '1' },
                { label: '2', value: '2' },
                { label: '3', value: '3' },
                { label: '4', value: '4' },
                { label: '5', value: '5' },
              ],
            },
          },
        },
        {
          label: 'Female',
          value: '0',
          subFilters: {
            male: {
              label: 'Female Options',
              type: FilterTypes.Picker,
              value: '0',
              options: [
                { label: 'All', value: '0' },
                { label: '1', value: '1' },
                { label: '2', value: '2' },
                { label: '3', value: '3' },
                { label: '4', value: '4' },
                { label: '5', value: '5' },
              ],
            },
          },
        },
      ],
    },
  } satisfies Filters;
}

export default new Webnovel();
