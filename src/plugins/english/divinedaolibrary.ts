import { defaultCover } from '@libs/defaultCover';
import { fetchApi } from '@libs/fetch';
import { Filters, FilterTypes } from '@libs/filterInputs';
import { Plugin } from '@typings/plugin';
import { load as parseHTML } from 'cheerio';

class DDLPlugin implements Plugin.PluginBase {
  id = 'DDL.com';
  name = 'Divine Dao Library';
  site = 'https://www.divinedaolibrary.com/';
  version = '1.1.0';
  icon = 'src/en/divinedaolibrary/icon.png';

  filters = {
    category: {
      type: FilterTypes.CheckboxGroup,
      label: 'State',
      value: ['Completed', 'Translating', 'Lost in Voting Poll', 'Dropped'],
      options: [
        { label: 'Completed', value: 'Completed' },
        { label: 'Translating', value: 'Translating' },
        { label: 'Lost in Voting Poll', value: 'Lost in Voting Poll' },
        { label: 'Dropped', value: 'Dropped' },
        { label: 'Personally Written', value: 'Personally Written' },
      ],
    },
  } satisfies Filters;

  /**
   * Safely extract the pathname from any URL on {@link site}. Check the root
   * site as there are novels linking off-site (to Patreon).
   *
   * @private
   */
  getPath(url: string): string | undefined {
    if (!url.startsWith(this.site)) {
      return undefined;
    }
    const trimmed = url.substring(this.site.length).replace(/(^\/+|\/+$)/g, '');
    if (trimmed.length === 0) {
      return undefined;
    }
    return trimmed;
  }

  /**
   * Map an array with an asynchronous function and only return the array items
   * that successfully were fulfilled.
   *
   * @private
   */
  async asyncMap<T, U>(
    collection: T[],
    callbackfn: (value: T, index: number, array: T[]) => Promise<U>,
  ): Promise<U[]> {
    return (await Promise.allSettled(collection.map(callbackfn)))
      .filter(
        <U>(p: PromiseSettledResult<U>): p is PromiseFulfilledResult<U> =>
          p.status === 'fulfilled',
      )
      .map(({ value }) => value);
  }

  /**
   * DDL links to future (unpublished) chapters from its novel pages. To be
   * able to report updates correctly, try to figure out which chapter was the
   * actual latest one to be published.
   *
   * @private
   * @returns the path value of the latest published chapter (or undefined)
   */
  async findLatestChapter(novelPath: string): Promise<string | undefined> {
    const link = `${this.site}wp-json/wp/v2/categories?slug=${novelPath}`;
    const guessCategory = await fetchApi(link).then(res => res.json());
    if (guessCategory.length !== 1) {
      return undefined;
    }
    const categoryId = guessCategory[0].id;
    const chapterLink = `${this.site}wp-json/wp/v2/posts?categories=${categoryId}&per_page=1`;
    const lastChapter = await fetchApi(chapterLink).then(res => res.json());
    if (lastChapter.length !== 1) {
      return undefined;
    }
    return lastChapter[0].slug;
  }

  /**
   * Based on some basic information, grab all the available information about
   * a novel. Mainly used with {@link asyncMap} to expand on novel links that
   * were extracted from other places.
   *
   * @private
   */
  async grabNovel(baseNovel: {
    name: string;
    path: string;
    getChapters?: boolean;
  }): Promise<Plugin.SourceNovel> {
    const link = `${this.site}wp-json/wp/v2/pages?slug=${baseNovel.path}`;
    const data = await fetchApi(link).then(res => res.json());
    if (data.length !== 1) {
      return {
        name: baseNovel.name,
        path: baseNovel.path,
      };
    }
    const content = parseHTML(data[0].content.rendered);
    const excerpt = parseHTML(data[0].excerpt.rendered);
    const image = content('img').first();
    let chapters: Plugin.ChapterItem[] = [];
    if (baseNovel.getChapters) {
      const linkedChapters = content('li > span > a')
        .map((_, anchorEl) => {
          const path = this.getPath(anchorEl.attribs['href']);
          if (!path) return;
          return {
            name: content(anchorEl).text(),
            path,
          } satisfies Plugin.ChapterItem;
        })
        .toArray();
      const lastChapterPath = await this.findLatestChapter(baseNovel.path);
      if (lastChapterPath) {
        chapters = linkedChapters.slice(
          0,
          1 +
            linkedChapters.findIndex(
              chapter => chapter.path === lastChapterPath,
            ),
        );
      } else {
        chapters = linkedChapters;
      }
    }
    return {
      name: data[0].title.rendered,
      path: baseNovel.path,
      cover: image.attr('data-lazy-src') ?? image.attr('src') ?? defaultCover,
      author: content('h3')
        .first()
        .text()
        .replace(/^Author:\s*/g, ''),
      summary: excerpt('p')
        .first()
        .text()
        .replace(/^.+Description\s*/g, ''),
      chapters,
    };
  }

  /**
   * Parse list of names and paths of recently updated novels from the homepage.
   *
   * @private
   */
  async latestNovels() {
    const body = await fetchApi(this.site).then(res => res.text());
    const loadedCheerio = parseHTML(body);
    const novels = loadedCheerio('#main')
      .find('a[rel="category tag"]')
      .map((_, anchorEl) => {
        const path = this.getPath(anchorEl.attribs['href']);
        if (!path) return;
        return {
          name: loadedCheerio(anchorEl).text(),
          path,
        };
      })
      .toArray()
      .filter(
        (novel, index, all) =>
          all.findIndex(({ path }) => path === novel.path) === index,
      );
    return novels;
  }

  /**
   * Parse list of names, paths, and categories from the novels list.
   *
   * @private
   */
  async allNovels() {
    const body = await fetchApi(this.site + 'novels').then(res => res.text());
    const loadedCheerio = parseHTML(body);
    const novels = loadedCheerio('.entry-content ul')
      .map((_, listEl) => {
        const list = loadedCheerio(listEl);
        const category = list.prev().text();
        return list
          .find('a')
          .map((_, anchorEl) => {
            const path = this.getPath(anchorEl.attribs['href']);
            if (!path) return;
            return {
              name: loadedCheerio(anchorEl).text(),
              path,
              category,
            };
          })
          .toArray();
      })
      .toArray();
    return novels;
  }

  async popularNovels(
    pageNo: number,
    options: Plugin.PopularNovelsOptions<Filters>,
  ): Promise<Plugin.NovelItem[]> {
    if (pageNo !== 1) {
      return [];
    }
    if (options.showLatestNovels) {
      return await this.asyncMap(
        await this.latestNovels(),
        this.grabNovel.bind(this),
      );
    }
    const novels = (await this.allNovels()).filter(novel => {
      const selectedCategories = options.filters.category.value;
      if (Array.isArray(selectedCategories)) {
        return selectedCategories.includes(novel.category);
      }
      return false;
    });
    return await this.asyncMap(novels, this.grabNovel.bind(this));
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    return this.grabNovel({ name: '', path: novelPath, getChapters: true });
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const chapterLink = `${this.site}wp-json/wp/v2/posts?slug=${chapterPath}`;
    const chapter = await fetchApi(chapterLink).then(res => res.json());
    if (chapter.length !== 1) {
      return '';
    }
    const title = `<h1>${chapter[0].title.rendered}</h1>`;
    const content = chapter[0].content.rendered;
    return `${title}${content}`;
  }

  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    if (pageNo !== 1) {
      return [];
    }
    const novels = (await this.allNovels()).filter(novel => {
      return novel.name
        .toLocaleLowerCase()
        .includes(searchTerm.toLocaleLowerCase());
    });
    return await this.asyncMap(novels, this.grabNovel.bind(this));
  }
}

export default new DDLPlugin();
