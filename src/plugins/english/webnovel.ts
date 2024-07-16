/* eslint-disable no-case-declarations */
import { CheerioAPI, load as parseHTML } from 'cheerio';
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

  async parseNovels(
    loadedCheerio: CheerioAPI,
    category_bool: boolean,
    search_bool: boolean,
  ): Promise<Plugin.NovelItem[]> {
    const selector = category_bool
      ? '.j_category_wrapper'
      : search_bool
        ? '.j_list_container'
        : '';
    const attribute = category_bool
      ? 'data-original'
      : search_bool
        ? 'src'
        : '';

    return loadedCheerio(`${selector} li`)
      .map((index, ele) => {
        const novelName =
          loadedCheerio(ele).find('.g_thumb').attr('title') || 'No Title Found';
        const novelCover = loadedCheerio(ele)
          .find('.g_thumb > img')
          .attr(attribute);
        const novelPath = loadedCheerio(ele).find('.g_thumb').attr('href');

        if (!novelPath) return null;

        return {
          name: novelName,
          cover: 'https:' + novelCover,
          path: novelPath,
        };
      })
      .get()
      .filter(novel => novel !== null);
  }

  async popularNovels(
    pageNo: number,
    {
      showLatestNovels,
      filters,
    }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    let url = this.site + '/stories/';
    const params = new URLSearchParams();

    if (showLatestNovels) {
      url += `novel?orderBy=5&pageIndex=${pageNo}`;
    } else if (filters) {
      if (filters.genres_gender.value === '1') {
        if (filters.genres_male.value !== '1') {
          url += filters.genres_male.value;
        } else {
          url += 'novel';
          params.append('gender', '1');
        }
      } else if (filters.genres_gender.value === '2') {
        if (filters.genres_female.value !== '2') {
          url += filters.genres_female.value;
        } else {
          url += 'novel';
          params.append('gender', '2');
        }
      }

      if (filters.type.value !== '3') {
        params.append('sourceType', filters.type.value);
      } else {
        params.append('translateMode', '3');
        params.append('sourceType', '1');
      }

      params.append('bookStatus', filters.status.value);
      params.append('orderBy', filters.sort.value);
      params.append('pageIndex', pageNo.toString());

      url += '?' + params.toString();
    } else {
      url += `novel?orderBy=1&pageIndex=${pageNo}`;
    }

    const result = await fetchApi(url);
    const body = await result.text();
    const loadedCheerio = parseHTML(body);

    return this.parseNovels(loadedCheerio, true, false);
  }

  async parseChapters(novelPath: string): Promise<Plugin.ChapterItem[]> {
    const url = this.site + novelPath + '/catalog';
    const result = await fetchApi(url);
    const body = await result.text();

    const loadedCheerio = parseHTML(body);

    const chapters: Plugin.ChapterItem[] = [];

    loadedCheerio('.volume-item').each((index_v, ele_v) => {
      let originalVolumeName = loadedCheerio(ele_v).first().text().trim();
      let volumeNameMatch = originalVolumeName.match(/Volume\s(\d+)/);
      let volumeName = volumeNameMatch
        ? `Volume ${volumeNameMatch[1]}`
        : 'Unknown Volume';

      loadedCheerio(ele_v)
        .find('li')
        .each((index_c, ele_c) => {
          const chapterName =
            `${volumeName}: ` +
            (loadedCheerio(ele_c).find('a').attr('title') || 'No Title Found');
          const chapterPath = loadedCheerio(ele_c).find('a').attr('href');

          if (chapterPath) {
            chapters.push({
              name: chapterName,
              path: chapterPath,
            });
          }
        });
    });

    return chapters;
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const url = this.site + novelPath;
    const result = await fetchApi(url);
    const body = await result.text();

    const loadedCheerio = parseHTML(body);

    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: loadedCheerio('.g_thumb > img').attr('alt') || 'No Title Found',
      cover: 'https:' + loadedCheerio('.g_thumb > img').attr('src'),
      genres: loadedCheerio('.det-hd-detail > .det-hd-tag').attr('title') || '',
      summary: loadedCheerio('.j_synopsis > p').text() || 'No Summary Found',
      author:
        loadedCheerio('.det-info .c_primary').attr('title') ||
        'No Author Found',
      chapters: await this.parseChapters(novelPath),
    };

    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const url = this.site + chapterPath;
    const result = await fetchApi(url);
    const body = await result.text();

    const loadedCheerio = parseHTML(body);

    const bloatElements = ['.cha-info'];
    bloatElements.map(tag => loadedCheerio(tag).remove());

    return loadedCheerio('.chapter_content').html()!;
  }

  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    searchTerm = searchTerm.replace(/\s+/g, '+');

    const url = `${this.site}/search?keywords=${searchTerm}&pageIndex=${pageNo}`;
    const result = await fetchApi(url);
    const body = await result.text();

    const loadedCheerio = parseHTML(body);

    return this.parseNovels(loadedCheerio, false, true);
  }

  filters = {
    sort: {
      label: 'Sort Results By',
      value: '1',
      options: [
        { label: 'Popular', value: '1' },
        { label: 'Recommended', value: '2' },
        { label: 'Most Collections', value: '3' },
        { label: 'Rating', value: '4' },
        { label: 'Time Updated', value: '5' },
      ],
      type: FilterTypes.Picker,
    },
    status: {
      label: 'Content Status',
      value: '0',
      options: [
        { label: 'All', value: '0' },
        { label: 'Completed', value: '2' },
        { label: 'Ongoing', value: '1' },
      ],
      type: FilterTypes.Picker,
    },
    genres_gender: {
      label: 'Genres (Male/Female)',
      value: '1',
      options: [
        { label: 'Male', value: '1' },
        { label: 'Female', value: '2' },
      ],
      type: FilterTypes.Picker,
    },
    genres_male: {
      label: 'Male Genres',
      value: '1',
      options: [
        { label: 'All', value: '1' },
        { label: 'Action', value: 'novel-action-male' },
        { label: 'Animation, Comics, Games', value: 'novel-acg-male' },
        { label: 'Eastern', value: 'novel-eastern-male' },
        { label: 'Fantasy', value: 'novel-fantasy-male' },
        { label: 'Games', value: 'novel-games-male' },
        { label: 'History', value: 'novel-history-male' },
        { label: 'Horror', value: 'novel-horror-male' },
        { label: 'Realistic', value: 'novel-realistic-male' },
        { label: 'Sci-fi', value: 'novel-scifi-male' },
        { label: 'Sports', value: 'novel-sports-male' },
        { label: 'Urban', value: 'novel-urban-male' },
        { label: 'War', value: 'novel-war-male' },
      ],
      type: FilterTypes.Picker,
    },
    genres_female: {
      label: 'Female Genres',
      value: '2',
      options: [
        { label: 'All', value: '2' },
        { label: 'Fantasy', value: 'novel-fantasy-female' },
        { label: 'General', value: 'novel-general-female' },
        { label: 'History', value: 'novel-history-female' },
        { label: 'LGBT+', value: 'novel-lgbt-female' },
        { label: 'Sci-fi', value: 'novel-scifi-female' },
        { label: 'Teen', value: 'novel-teen-female' },
        { label: 'Urban', value: 'novel-urban-female' },
      ],
      type: FilterTypes.Picker,
    },
    type: {
      label: 'Content Type',
      value: '0',
      options: [
        { label: 'All', value: '0' },
        { label: 'Translate', value: '1' },
        { label: 'Original', value: '2' },
        { label: 'MTL (Machine Translation)', value: '3' },
      ],
      type: FilterTypes.Picker,
    },
  } satisfies Filters;
}

export default new Webnovel();
