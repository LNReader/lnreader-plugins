import { CheerioAPI, load } from 'cheerio';
import { Parser } from 'htmlparser2'; // Added Parser import
import { fetchApi } from '@libs/fetch';
import { Plugin } from '@typings/plugin';
import { NovelStatus } from '@libs/novelStatus';
import { Filters } from '@libs/filterInputs';

type ReadNovelFullOptions = {
  lang?: string;
  versionIncrements?: number;
  latestPage: string;
  searchPage: string;
  chapterListing?: string;
  chapterParam?: string;
  pageParam?: string;
  novelListing?: string;
  typeParam?: string;
  genreParam?: string;
  genreKey?: string;
  langParam?: string;
  urlLangCode?: string;
  searchKey?: string;
  postSearch?: boolean;
  noAjax?: boolean;
};

export type ReadNovelFullMetadata = {
  id: string;
  sourceSite: string;
  sourceName: string;
  options: ReadNovelFullOptions;
  filters?: any;
};

class ReadNovelFullPlugin implements Plugin.PluginBase {
  id: string;
  name: string;
  icon: string;
  site: string;
  version: string;
  options: ReadNovelFullOptions;
  filters?: Filters | undefined;

  constructor(metadata: ReadNovelFullMetadata) {
    this.id = metadata.id;
    this.name = metadata.sourceName;
    this.icon = `multisrc/readnovelfull/${metadata.id.toLowerCase()}/icon.png`;
    this.site = metadata.sourceSite;
    const versionIncrements = metadata.options?.versionIncrements || 0;
    this.version = `2.0.${2 + versionIncrements}`;
    this.options = metadata.options;
    this.filters = metadata.filters;
  }

  async getCheerio(
    url: string,
    search = false,
    options?: RequestInit,
  ): Promise<CheerioAPI> {
    const r = await fetchApi(url, options);
    if (!r.ok && !search)
      throw new Error(
        `Could not reach site (${r.status}) try to open in webview.`,
      );
    return load(await r.text());
  }

  parseNovels($: CheerioAPI): Plugin.NovelItem[] {
    const baseUrl = this.site;

    const novels = $('.archive .row, .li-row')
      .toArray()
      .map(el => {
        const $el = $(el);

        const novelName = $el.find('h3 a').text()?.trim();
        const rawHref = $el.find('a').attr('href');
        const rawCover =
          $el.find('img').attr('src') ??
          $el.find('img').attr('data-cfsrc') ??
          $el.find('img').attr('data-src');

        if (!novelName || !rawHref) {
          return null;
        }

        const novelUrlObject = new URL(rawHref, baseUrl);
        const novelPath = novelUrlObject.pathname.slice(1);

        let novelCover: string | undefined;
        if (rawCover) {
          novelCover = new URL(rawCover, baseUrl).href;
        }

        return {
          name: novelName,
          path: novelPath,
          cover: novelCover,
        };
      })
      .filter(Boolean);

    return novels;
  }

  async popularNovels(
    pageNo: number,
    { filters, showLatestNovels }: Plugin.PopularNovelsOptions,
  ): Promise<Plugin.NovelItem[]> {
    const {
      pageParam = 'page',
      novelListing,
      typeParam = 'type',
      latestPage,
      genreParam = 'category_novel',
      genreKey = 'id',
      langParam,
      urlLangCode,
    } = this.options;

    let url = '';

    if (novelListing) {
      // URL structure with parameters
      const params = new URLSearchParams();

      if (showLatestNovels) {
        params.append(typeParam, latestPage);
      } else if (filters.genres.value.length) {
        params.append(typeParam, genreParam);
        params.append(genreKey, filters.genres.value);
      } else {
        params.append(typeParam, filters.type.value);
      }

      // Add language parameter if specified
      if (langParam && urlLangCode) {
        params.append(langParam, urlLangCode);
      }

      params.append(pageParam, pageNo.toString());
      url = `${this.site}${novelListing}?${params.toString()}`;
    } else {
      // URL structure with path segments
      const basePage = showLatestNovels
        ? latestPage
        : filters.genres.value.length
          ? filters.genres.value
          : filters.type.value;

      url = `${this.site}${basePage}?${pageParam}=${pageNo}`;
    }

    const $ = await this.getCheerio(url);
    return this.parseNovels($);
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const url = this.site + novelPath;
    const result = await fetchApi(url);
    const body = await result.text();
    const baseUrl = this.site;

    const novel: Partial<Plugin.SourceNovel> = {
      path: novelPath,
      chapters: [],
    };
    const summaryParts: string[] = [];
    const infoParts: string[] = [];
    const chapters: Plugin.ChapterItem[] = [];
    let novelId: string | null = null;
    let tempChapter: Partial<Plugin.ChapterItem> = {};
    let i = 0;

    const stateStack: ParsingState[] = [ParsingState.Idle];
    const currentState = () => stateStack[stateStack.length - 1];
    const pushState = (state: ParsingState) => stateStack.push(state);
    const popState = () =>
      stateStack.length > 1 ? stateStack.pop() : currentState();

    const parser = new Parser({
      onopentag: (name, attribs) => {
        const state = currentState();
        switch (name) {
          case 'div':
            switch (attribs.class) {
              case 'books':
                pushState(ParsingState.NovelName);
                break;
              case 'book':
                pushState(ParsingState.Cover);
                break;
              case 'info':
                pushState(ParsingState.Info);
                break;
              case 'desc-text':
                pushState(ParsingState.Summary);
                break;
            }
            if (attribs.id === 'rating') {
              popState();
              novelId = attribs['data-novel-id'] || null;
            }
            break;
          case 'img':
            if (state === ParsingState.Cover) {
              const coverUrl =
                attribs.src ?? attribs['data-cfsrc'] ?? attribs['data-src'];
              if (coverUrl) {
                novel.cover = new URL(coverUrl, baseUrl).href;
              }
            }
            break;
          case 'meta':
            if (attribs.name === 'image' && !novel.cover) {
              if (attribs.content) {
                novel.cover = new URL(attribs.content, baseUrl).href;
              }
            }
            break;
          case 'ul':
            if (attribs.class?.includes('info-meta')) {
              pushState(ParsingState.Info);
            } else if (this.options.noAjax && attribs.id === 'idData') {
              pushState(ParsingState.ChapterListDirect);
            }
            break;
          case 'br':
            if (state === ParsingState.Summary) {
              summaryParts.push('\n');
            }
            break;
          case 'a':
            if (state === ParsingState.ChapterListDirect) {
              pushState(ParsingState.Chapter);
              i++;
              tempChapter.name = attribs.title || `Chapter ${i}`;
              const chapterPathRaw = attribs.href;
              tempChapter.path = chapterPathRaw?.startsWith('/')
                ? chapterPathRaw.substring(1)
                : novelPath.replace('.html', `/chapter-${i}.html`);
              tempChapter.releaseTime = null;
              tempChapter.chapterNumber = i;
            }
            break;
        }
      },
      ontext: text => {
        switch (currentState()) {
          case ParsingState.NovelName:
            novel.name = (novel.name || '') + text;
            break;
          case ParsingState.Info:
            infoParts.push(text);
            break;
          case ParsingState.Summary:
            summaryParts.push(text);
            break;
        }
      },
      onclosetag: name => {
        const state = currentState();
        switch (name) {
          case 'h3':
            if (state === ParsingState.NovelName) popState();
            break;
          case 'div':
            if (state === ParsingState.Info) {
              infoParts.push('\n');
            } else if (
              state === ParsingState.Cover ||
              state === ParsingState.Summary
            ) {
              popState();
            }
            break;
          case 'li':
            if (state === ParsingState.Info) {
              infoParts.push('\n');
            }
            break;
          case 'ul':
            if (
              state === ParsingState.Info ||
              state === ParsingState.ChapterListDirect
            ) {
              popState();
            }
            break;
          case 'p':
            if (state === ParsingState.SummaryP) {
              summaryParts.push('\n\n');
              popState();
            }
            break;
          case 'a':
            if (state === ParsingState.Chapter) {
              if (tempChapter.name && tempChapter.path) {
                chapters.push({ ...tempChapter } as Plugin.ChapterItem);
              }
              tempChapter = {};
              popState();
            }
            break;
        }
      },
      onend: () => {
        novel.name = novel.name.trim();
        novel.summary = summaryParts.join('').trim();

        infoParts
          .join('')
          .split('\n')
          .filter(line => line.includes(':'))
          .forEach(line => {
            const parts = line.split(':');
            const detailName = parts[0].trim().toLowerCase();
            const detail = parts[1]
              .split(',')
              .map(g => g.trim())
              .join(', ');

            switch (detailName) {
              case 'author':
                novel.author = detail;
                break;
              case 'genre':
                novel.genres = detail;
                break;
              case 'status':
                const map: Record<string, string> = {
                  completed: NovelStatus.Completed,
                  ongoing: NovelStatus.Ongoing,
                  hiatus: NovelStatus.OnHiatus,
                };
                novel.status = map[detail.toLowerCase()] ?? NovelStatus.Unknown;
                break;
              default:
                return;
            }
          });

        if (!novelId) {
          const idMatch = novelPath.match(/\d+/);
          novelId = idMatch ? idMatch[0] : null;
        }
      },
    });

    parser.write(body);
    parser.end();

    if (!this.options.noAjax && novelId !== null && chapters.length === 0) {
      const chapterListing =
        this.options.chapterListing || 'ajax/chapter-archive';
      const ajaxParam = this.options.chapterParam || 'novelId';
      const params = new URLSearchParams({ [ajaxParam]: novelId });
      const chaptersUrl = `${this.site}${chapterListing}?${params.toString()}`;

      const ajaxResult = await fetchApi(chaptersUrl);
      const ajaxBody = await ajaxResult.text();
      let tempAjaxChapter: Partial<Plugin.ChapterItem> = {};

      const ajaxChapterParser = new Parser({
        onopentag: (name, attribs) => {
          let chapterHref: string | undefined;
          let initialName: string | undefined;

          if (name === 'a' && attribs.href) {
            chapterHref = attribs.href;
            initialName = attribs.title || '';
          } else if (name === 'option' && attribs.value) {
            chapterHref = attribs.value;
            initialName = '';
          }

          if (chapterHref !== undefined) {
            pushState(ParsingState.Chapter);
            const chapterUrlObject = new URL(chapterHref, this.site);
            tempAjaxChapter.path = chapterUrlObject.pathname.slice(1);
            tempAjaxChapter.name = initialName;
          }
        },
        ontext: text => {
          if (
            currentState() === ParsingState.Chapter &&
            !tempAjaxChapter.name
          ) {
            tempAjaxChapter.name += text.trim();
          }
        },
        onclosetag: name => {
          if (
            (name === 'a' || name === 'option') &&
            currentState() === ParsingState.Chapter
          ) {
            if (tempAjaxChapter.name && tempAjaxChapter.path) {
              chapters.push({ ...tempAjaxChapter }) as Plugin.ChapterItem;
            }
            tempAjaxChapter = {};
            popState();
          }
        },
      });

      ajaxChapterParser.write(ajaxBody);
      ajaxChapterParser.end();
      novel.chapters = chapters;
    }

    return novel as Plugin.SourceNovel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const $ = await this.getCheerio(this.site + chapterPath, false);
    $('div.ads, div.unlock-buttons').remove();
    return $('#chr-content, #chapter-content').html()! || '';
  }

  async searchNovels(
    searchTerm: string,
    page: number,
  ): Promise<Plugin.NovelItem[]> {
    const {
      pageParam = 'page',
      searchKey = 'keyword',
      postSearch,
      langParam,
      urlLangCode,
      searchPage,
    } = this.options;

    const params = new URLSearchParams({
      [searchKey]: searchTerm,
      ...(langParam && { [langParam]: urlLangCode! }),
      ...(!postSearch && { [pageParam]: page.toString() }),
    });

    const url = `${this.site}${searchPage}${!postSearch ? `?${params.toString()}` : ''}`;

    const fetchOptions = postSearch
      ? {
          method: 'POST',
          body: params,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      : undefined;

    const $ = await this.getCheerio(url, true, fetchOptions);
    return this.parseNovels($);
  }
}

// Define ParsingState enum similar to the reference
enum ParsingState {
  Idle,
  NovelName,
  Cover,
  Info,
  // Author, // Removed - handled within Info
  // Genre, // Removed - handled within Info
  // Status, // Removed - handled within Info
  Summary,
  SummaryP, // State for being inside a <p> tag within the Summary div
  ChaptersAjaxCheck, // State to check for novelId for potential AJAX call (though maybe not needed as a state)
  ChapterListDirect, // State for parsing chapters directly from #idData
  // ChapterListAjax, // Not needed as a state, handled after parsing body
  Chapter, // Represents being inside a chapter link/tag within ChapterListDirect
}
