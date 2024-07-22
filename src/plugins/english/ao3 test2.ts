import { CheerioAPI, load as parseHTML } from 'cheerio';
import { fetchApi } from '@libs/fetch';
import { Plugin } from '@typings/plugin';
import { Filters, FilterTypes } from '@libs/filterInputs';
import { defaultCover } from '@libs/defaultCover';

class ArchiveOfOurOwn implements Plugin.PluginBase {
  id = 'archiveofourowntest4';
  name = 'ArchiveOfOurOwntest4';
  version = '1.1.4';
  icon = 'src/en/archiveofourown/icon.png';
  site = 'https://archiveofourown.org/';

  parseNovels(loadedCheerio: CheerioAPI): Plugin.NovelItem[] {
    const novels: Plugin.NovelItem[] = [];

    loadedCheerio('li.work').each((idx, ele) => {
      const novelName = loadedCheerio(ele).find('h4.heading > a').text().trim();
      const novelUrl = loadedCheerio(ele).find('h4.heading > a').attr('href')?.trim();

      if (!novelUrl) return;

      const novel = {
        name: novelName,
        cover: defaultCover, // No cover image provided in the search results
        // path: new URL(novelUrl, this.site).toString(),
        path: (novelUrl).slice(1),
      };

      novels.push(novel);
    });

    return novels;
  }

  async popularNovels(
    page: number,
    { filters }: Plugin.PopularNovelsOptions<Filters>,
  ): Promise<Plugin.NovelItem[]> {
    let link = `${this.site}works/search?page=${page}&work_search%5Blanguage_id%5D=en&work_search%5Bsort_column%5D=${filters.sort.value}&work_search%5Bsort_direction%5D=desc`;
    if (filters.genre.value !== '') link += `&work_search%5Bfandom_names%5D=${filters.genre.value}`;

    const body = await fetchApi(link).then(r => r.text());
    const loadedCheerio = parseHTML(body);
    return this.parseNovels(loadedCheerio);
  }

  async parseNovel(novelUrl: string): Promise<Plugin.SourceNovel> {
    const result = await fetchApi(new URL(novelUrl, this.site).toString());
    const body = await result.text();

    const loadedCheerio = parseHTML(body);

    const novel: Plugin.SourceNovel = {
      path: novelUrl,
      name: loadedCheerio('h2.title').text().trim() || 'Untitled',
      cover: '', // No cover image available
      summary: loadedCheerio('blockquote.userstuff').text().trim(),
      status: '', // AO3 doesn't provide a clear status indicator
      chapters: [],
    };

    novel.author = loadedCheerio('a[rel="author"]').text().trim();
    novel.genres = Array.from(loadedCheerio('dd.freeform.tags li a.tag'))
      .map(el => loadedCheerio(el).text().trim())
      .join(',');

    const chapterItems: Plugin.ChapterItem[] = [];
    loadedCheerio('li.chapter').each((i, el) => {
      const chapterName = loadedCheerio(el).find('a').text().trim();
      const chapterUrl = loadedCheerio(el).find('a').attr('href')?.trim();
      if (chapterUrl) {
        chapterItems.push({ name: chapterName, path: new URL(chapterUrl, this.site).toString() });
      }
    });

    novel.chapters = chapterItems;

    return novel;
  }

  async parseChapter(chapterUrl: string): Promise<string> {
    const result = await fetchApi(new URL(chapterUrl, this.site).toString());
    const body = await result.text();

    const loadedCheerio = parseHTML(body);

    const chapterText = loadedCheerio('div#chapters > div').html() || '';

    return chapterText;
  }

  async searchNovels(
    searchTerm: string,
    page: number
  ): Promise<Plugin.NovelItem[]> {
    const searchUrl = `${this.site}works/search?page=${page}&work_search%5Blanguage_id%5D=en&work_search%5Bquery%5D=${searchTerm}`;

    const result = await fetchApi(searchUrl);
    const body = await result.text();

    const loadedCheerio = parseHTML(body);
    return this.parseNovels(loadedCheerio);
  }

  filters = {
    sort: {
      value: 'hits',
      label: 'Sort by',
      options: [
        { label: 'Hits', value: 'hits' },
        { label: 'Kudos', value: 'kudos' },
        { label: 'Comments', value: 'comments' },
        { label: 'Bookmarks', value: 'bookmarks' },
        { label: 'Word Count', value: 'word_count' },
        { label: 'Date Updated', value: 'revised_at' },
      ],
      type: FilterTypes.Picker,
    },
    genre: {
      value: '',
      label: 'Genres',
      options: [
        { label: 'None', value: '' },
        { label: 'Adventure', value: 'Adventure' },
        { label: 'Drama', value: 'Drama' },
        { label: 'Fantasy', value: 'Fantasy' },
        { label: 'Horror', value: 'Horror' },
        { label: 'Mystery', value: 'Mystery' },
        { label: 'Romance', value: 'Romance' },
        { label: 'Sci-fi', value: 'Sci-fi' },
      ],
      type: FilterTypes.Picker,
    },
  } satisfies Filters;
}

export default new ArchiveOfOurOwn();
