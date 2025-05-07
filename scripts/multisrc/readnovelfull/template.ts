import { CheerioAPI, load } from 'cheerio';
import { Parser } from 'htmlparser2';
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
  noPages?: string[];
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

  lastSearch: number | null = null;
  searchInterval = 3400;

  async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getCheerio(
    url: string,
    search = false,
    options?: RequestInit,
  ): Promise<CheerioAPI> {
    const r = await fetchApi(url, options);
    if (!r.ok && !search)
      throw new Error(
        `Could not reach site (${r.status}: ${r.statusText}) try to open in webview.`,
      );
    return load(await r.text());
  }

  parseNovels(html: string) {
    const baseUrl = this.site;
    const novels: Plugin.NovelItem[] = [];
    let tempNovel: Partial<Plugin.NovelItem> = {};
    let depth: number;

    const stateStack: ParsingState[] = [ParsingState.Idle];
    const currentState = () => stateStack[stateStack.length - 1];
    const pushState = (state: ParsingState) => stateStack.push(state);
    const popState = () =>
      stateStack.length > 1 ? stateStack.pop() : currentState();

    const parser = new Parser({
      onopentag: (name, attribs) => {
        const state = currentState();
        if (
          attribs.class?.includes('archive') ||
          attribs.class === 'col-content'
        ) {
          pushState(ParsingState.NovelItem);
          depth = -1;
        }

        if (
          state !== ParsingState.NovelItem &&
          state !== ParsingState.NovelName
        )
          return;
        switch (name) {
          case 'img':
            const cover = attribs.src;
            if (cover) {
              tempNovel.cover = new URL(cover, baseUrl).href;
            }
            break;
          case 'h3':
            if (state === ParsingState.NovelItem) {
              pushState(ParsingState.NovelName);
            }
            break;
          case 'a':
            if (state === ParsingState.NovelName) {
              const href = attribs.href;
              if (href) {
                tempNovel.path = new URL(href, baseUrl).pathname.substring(1);
                tempNovel.name = attribs.title;
              }
            }
            break;
          case 'div':
            depth++;
            break;
          default:
            return;
        }
      },

      onclosetag: name => {
        const state = currentState();
        if (name === 'a' && state === ParsingState.NovelName) {
          if (tempNovel.path) {
            novels.push({ ...tempNovel } as Plugin.NovelItem);
          }
          tempNovel = {};
          popState();
        }
        if (name === 'div' && state === ParsingState.NovelItem) {
          depth--;
          if (depth < 0) popState();
        }
      },
    });

    parser.write(html);
    parser.end();

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
      noPages = [],
    } = this.options;

    // Skip Pagination for FWN & LR
    if (
      pageNo !== 1 &&
      !showLatestNovels &&
      !filters.genres.value.length &&
      noPages.length > 0 &&
      noPages.includes(filters.type.value)
    ) {
      return [];
    }

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

    const result = await fetchApi(url);
    if (!result.ok) {
      throw new Error(
        `Could not reach site (${result.status}: ${result.statusText}) try to open in webview.`,
      );
    }
    const html = await result.text();
    return this.parseNovels(html);
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
    const statusParts: string[] = [];
    const authorParts: string[] = [];
    const genreArray: string[] = [];
    const infoParts: string[] = [];
    const chapters: Plugin.ChapterItem[] = [];
    let novelId: string | null = null;
    let tempChapter: Partial<Plugin.ChapterItem> = {};
    let i = 0;
    let depth: number;

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
              case 'm-imgtxt':
                pushState(ParsingState.Cover);
                return;
              case 'inner':
              case 'desc-text':
                if (state === ParsingState.Cover) popState();
                pushState(ParsingState.Summary);
                break;
              case 'info':
                pushState(ParsingState.Info);
                depth = 0;
                break;
            }
            if (!this.options.noAjax && attribs.id === 'rating') {
              novelId = attribs['data-novel-id'];
            }
            if (state === ParsingState.Info) depth++;
            break;
          case 'img':
            if (state === ParsingState.Cover) {
              const cover =
                attribs.src ?? attribs['data-cfsrc'] ?? attribs['data-src'];
              const name = attribs.title;
              if (cover) {
                novel.cover = new URL(cover, baseUrl).href;
              }
              if (name) {
                novel.name = name;
              } else {
                popState();
              }
            }
            break;
          case 'h3':
            if (state === ParsingState.Cover) {
              pushState(ParsingState.NovelName);
            }
            break;
          case 'span':
            if (state === ParsingState.Cover && attribs.title) {
              const newState = {
                'Genre': ParsingState.Genres,
                'Author': ParsingState.Author,
                'Status': ParsingState.Status,
              }[attribs.title];

              if (newState) pushState(newState);
            }
            break;
          case 'br':
            if (state === ParsingState.Summary) {
              summaryParts.push('\n');
            }
            break;
          case 'ul':
            if (this.options.noAjax && attribs.id === 'idData') {
              pushState(ParsingState.ChapterList);
            }
            break;
          case 'a':
            if (state === ParsingState.ChapterList) {
              i++;
              const href = attribs.href;
              pushState(ParsingState.Chapter);

              tempChapter.name = attribs.title || `Chapter ${i}`;
              tempChapter.releaseTime = null;
              tempChapter.chapterNumber = i;
              tempChapter.path =
                href?.slice(1) ||
                novelPath.replace('.html', `/chapter-${i}.html`);
            }
            break;
        }
      },

      ontext: data => {
        const text = data.trim();
        if (!text) return;

        switch (currentState()) {
          case ParsingState.NovelName:
            novel.name = (novel.name || '') + text;
            break;
          case ParsingState.Summary:
            summaryParts.push(data);
            break;
          case ParsingState.Info:
            infoParts.push(text);
            break;
          case ParsingState.Genres:
            genreArray.push(data);
            break;
          case ParsingState.Author:
            authorParts.push(data);
            break;
          case ParsingState.Status:
            statusParts.push(text);
            break;
        }
      },

      onclosetag: name => {
        const state = currentState();
        switch (name) {
          case 'div':
            switch (state) {
              case ParsingState.Info:
                depth--;
                infoParts.push('\n');
                if (depth < 0) {
                  popState();
                }
                break;
              case ParsingState.Genres:
              case ParsingState.Author:
              case ParsingState.Status:
              case ParsingState.Summary:
                popState();
                break;
            }
            break;
          case 'h3':
            if (state === ParsingState.NovelName) {
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
          case 'ul':
            if (state === ParsingState.ChapterList) {
              popState();
            }
            break;
          default:
            return;
        }
      },

      onend: () => {
        if (infoParts.length) {
          infoParts
            .join('')
            .split('\n')
            .map(line => line.trim())
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
                    ongoing: NovelStatus.Ongoing,
                    hiatus: NovelStatus.OnHiatus,
                    dropped: NovelStatus.Cancelled,
                    cancelled: NovelStatus.Cancelled,
                    completed: NovelStatus.Completed,
                  };
                  novel.status =
                    map[detail.toLowerCase()] ?? NovelStatus.Unknown;
                  break;
                default:
                  return;
              }
            });

          if (!novelId) {
            const idMatch = novelPath.match(/\d+/);
            novelId = idMatch ? idMatch[0] : null;
          }
        } else {
          novel.genres = genreArray.join('').trim();
          novel.author = authorParts.join('').trim();
          novel.status = statusParts
            .join('')
            .toLowerCase()
            .replace(/\b\w/g, char => char.toUpperCase());
        }
        novel.summary = summaryParts.join('\n\n').trim();
      },
    });

    parser.write(body);
    parser.end();

    if (this.options.noAjax && chapters.length > 0) {
      novel.chapters = chapters;
    }

    if (!this.options.noAjax && novelId !== null && chapters.length === 0) {
      const chapterListing =
        this.options.chapterListing || 'ajax/chapter-archive';
      const ajaxParam = this.options.chapterParam || 'novelId';
      const params = new URLSearchParams({ [ajaxParam]: novelId });
      const chaptersUrl = `${this.site}${chapterListing}?${params.toString()}`;

      try {
        const ajaxResult = await fetchApi(chaptersUrl);
        if (!ajaxResult.ok) {
          console.error(`Failed to fetch chapters: ${ajaxResult.status}`);
          // Assign empty chapters array or handle error as appropriate
          novel.chapters = [];
        } else {
          const ajaxBody = await ajaxResult.text();
          const ajaxChapters: Plugin.ChapterItem[] = [];
          let tempAjaxChapter: Partial<Plugin.ChapterItem> = {};
          let isInsideChapterLink = false; // Track if inside <a> or <option>

          const ajaxChapterParser = new Parser({
            onopentag: (name, attribs) => {
              let chapterHref: string | undefined;
              let initialName: string | undefined;

              if (name === 'a' && attribs.href) {
                chapterHref = attribs.href;
                initialName = attribs.title || ''; // Use title if available
                isInsideChapterLink = true;
                pushState(ParsingState.Chapter);
              } else if (name === 'option' && attribs.value) {
                // Handle chapters listed in <select><option> tags
                chapterHref = attribs.value;
                initialName = ''; // Text content will be the name
                isInsideChapterLink = true;
                pushState(ParsingState.Chapter);
              }

              if (chapterHref !== undefined) {
                try {
                  const chapterUrlObject = new URL(chapterHref, this.site);
                  tempAjaxChapter.path = chapterUrlObject.pathname.slice(1);
                  tempAjaxChapter.name = initialName?.trim(); // Trim initial name
                } catch (e) {
                  console.error(`Invalid AJAX chapter URL: ${chapterHref}`, e);
                  tempAjaxChapter = {}; // Reset on error
                  isInsideChapterLink = false;
                  popState(); // Pop state if URL is invalid
                }
              }
            },
            ontext: text => {
              const cleanText = text.trim();
              // Capture text only if inside a chapter link and name wasn't set by title/attribute
              if (
                currentState() === ParsingState.Chapter &&
                isInsideChapterLink &&
                !tempAjaxChapter.name && // Only if name is not already set
                cleanText
              ) {
                // Append text content for option tags or links without titles
                tempAjaxChapter.name = (tempAjaxChapter.name || '') + cleanText;
              }
            },
            onclosetag: name => {
              if (
                (name === 'a' || name === 'option') &&
                currentState() === ParsingState.Chapter &&
                isInsideChapterLink
              ) {
                if (tempAjaxChapter.name && tempAjaxChapter.path) {
                  // Trim final name before pushing
                  tempAjaxChapter.name = tempAjaxChapter.name.trim();
                  tempAjaxChapter.releaseTime = null;
                  ajaxChapters.push({
                    ...tempAjaxChapter,
                  } as Plugin.ChapterItem);
                }
                tempAjaxChapter = {}; // Reset for next chapter
                isInsideChapterLink = false;
                popState();
              }
            },
          });

          ajaxChapterParser.write(ajaxBody);
          ajaxChapterParser.end();
          novel.chapters = ajaxChapters; // Assign parsed AJAX chapters
        }
      } catch (error) {
        console.error('Error fetching or parsing AJAX chapters:', error);
        novel.chapters = []; // Assign empty on error
      }
    } else if (chapters.length > 0) {
      // Assign chapters parsed from initial HTML if noAjax or AJAX failed/not needed
      novel.chapters = chapters;
    } else {
      // Ensure chapters is always an array
      novel.chapters = [];
    }

    // Basic validation before returning
    if (!novel.name) {
      console.warn(`Novel name missing for path: ${novelPath}`);
      // Consider throwing an error or returning a specific indicator if name is critical
    }

    return novel as Plugin.SourceNovel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    // This function still uses Cheerio, so getCheerio is needed
    const $ = await this.getCheerio(this.site + chapterPath, false);
    $('div.ads, div.unlock-buttons').remove(); // Example: remove ads/buttons
    // Prioritize more specific selectors if available
    const content = $('#chr-content').html() || $('#chapter-content').html();
    return content || ''; // Return empty string if no content found
  }

  async searchNovels(
    searchTerm: string,
    page: number,
  ): Promise<Plugin.NovelItem[]> {
    const now = Date.now();
    if (this.lastSearch && now - this.lastSearch <= this.searchInterval) {
      await this.sleep(this.searchInterval);
    }

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
      ...(langParam && urlLangCode && { [langParam]: urlLangCode }),
      ...(!postSearch && { [pageParam]: page.toString() }),
    });

    const url = `${this.site}${searchPage}${!postSearch ? `?${params.toString()}` : ''}`;

    const fetchOptions: RequestInit | undefined = postSearch
      ? {
          method: 'POST',
          body: params.toString(),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      : undefined;

    const result = await fetchApi(url, fetchOptions);
    this.lastSearch = Date.now();

    if (!result.ok) {
      throw new Error(
        `Could not reach site ('${result.status}') try to open in webview.`,
      );
    }

    const html = await result.text();

    // Check for alert error messages
    const alertText = html.match(/alert\((.*?)\)/)?.[1] || '';
    if (alertText) throw new Error(alertText);

    return this.parseNovels(html);
  }
}

enum ParsingState {
  Idle,
  Info,
  Cover,
  Author,
  Genres,
  Status,
  Summary,
  Chapter,
  ChapterList,
  NovelName,
  NovelItem,
}
