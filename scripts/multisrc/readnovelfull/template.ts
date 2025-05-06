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
        `Could not reach site (${r.status}: ${r.statusText}) try to open in webview.`,
      );
    return load(await r.text());
  }

  parseNovels(html: string): Plugin.NovelItem[] {
    const baseUrl = this.site;
    const novels: Plugin.NovelItem[] = [];
    let tempNovel: Partial<Plugin.NovelItem> = {};

    const stateStack: ParsingState[] = [ParsingState.Idle];
    const currentState = () => stateStack[stateStack.length - 1];
    const pushState = (state: ParsingState) => stateStack.push(state);
    const popState = () =>
      stateStack.length > 1 ? stateStack.pop() : currentState();

    const parser = new Parser({
      onopentag: (name, attribs) => {
        const state = currentState();
        if (attribs.class === 'archive' || attribs.class === 'li-row')
          pushState(ParsingState.NovelItem);

        if (
          state !== ParsingState.NovelItem &&
          state !== ParsingState.NovelTitle
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
              popState();
              pushState(ParsingState.NovelTitle);
            }
            break;
          case 'a':
            if (state === ParsingState.NovelTitle) {
              const href = attribs.href;
              if (href) {
                tempNovel.href = new URL(href, baseUrl).pathname.substring(1);
                tempNovel.name = attribs.title;
              }
            }
            break;
          default:
            return;
        }
      },

      onclosetag: name => {
        if (name === 'a' && currentState() === ParsingState.NovelTitle) {
          if (tempNovel.name && tempNovel.path) {
            novels.push({ ...tempNovel } as Plugin.NovelItem);
          }
          tempNovel = {};
          popState();
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
                // Check if already in Info state to avoid nested pushes if structure allows
                if (state !== ParsingState.Info) {
                  pushState(ParsingState.Info);
                }
                break;
              case 'desc-text':
                pushState(ParsingState.Summary);
                break;
            }
            if (attribs.id === 'rating') {
              // Ensure we pop back to a sensible state before processing rating
              if (state === ParsingState.Info || state === ParsingState.Cover) {
                popState();
              }
              novelId = attribs['data-novel-id'] || null;
            }
            break;
          case 'img':
            if (state === ParsingState.Cover) {
              const coverUrl =
                attribs.src ?? attribs['data-cfsrc'] ?? attribs['data-src'];
              if (coverUrl) {
                try {
                  novel.cover = new URL(coverUrl, baseUrl).href;
                } catch (e) {
                  console.error(`Invalid cover URL: ${coverUrl}`, e);
                }
              }
            }
            break;
          case 'meta':
            if (attribs.name === 'image' && !novel.cover) {
              if (attribs.content) {
                try {
                  novel.cover = new URL(attribs.content, baseUrl).href;
                } catch (e) {
                  console.error(
                    `Invalid meta image URL: ${attribs.content}`,
                    e,
                  );
                }
              }
            }
            break;
          case 'ul':
            if (attribs.class?.includes('info-meta')) {
              // Check if already in Info state to avoid nested pushes
              if (state !== ParsingState.Info) {
                pushState(ParsingState.Info);
              }
            } else if (this.options.noAjax && attribs.id === 'idData') {
              pushState(ParsingState.ChapterList);
            }
            break;
          case 'br':
            if (state === ParsingState.Summary) {
              summaryParts.push('\n');
            }
            break;
          case 'a':
            if (state === ParsingState.ChapterList) {
              pushState(ParsingState.Chapter);
              i++;
              tempChapter.name = attribs.title || `Chapter ${i}`;
              const chapterPathRaw = attribs.href;
              if (chapterPathRaw) {
                try {
                  const chapterUrl = new URL(chapterPathRaw, baseUrl);
                  tempChapter.path = chapterUrl.pathname.slice(1);
                } catch (e) {
                  console.error(`Invalid chapter URL: ${chapterPathRaw}`, e);
                  // Fallback or default path if URL is invalid
                  tempChapter.path = novelPath.replace(
                    '.html',
                    `/chapter-${i}.html`,
                  );
                }
              } else {
                // Fallback if href is missing
                tempChapter.path = novelPath.replace(
                  '.html',
                  `/chapter-${i}.html`,
                );
              }
              tempChapter.releaseTime = null; // Assuming release time isn't available here
              tempChapter.chapterNumber = i;
            }
            break;
        }
      },
      ontext: text => {
        const cleanText = text.trim();
        if (!cleanText) return; // Ignore whitespace-only text nodes

        switch (currentState()) {
          case ParsingState.NovelName:
            novel.name = (novel.name || '') + cleanText;
            break;
          case ParsingState.Info:
            // Append with space to separate text nodes within the same info block
            infoParts.push(cleanText + ' ');
            break;
          case ParsingState.Summary:
            summaryParts.push(cleanText);
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
            // Pop state only if it matches the opening tag's purpose
            if (
              state === ParsingState.Cover ||
              state === ParsingState.Summary ||
              state === ParsingState.Info // Pop Info state when its div closes
            ) {
              popState();
            }
            break;
          case 'li':
            // Add newline after each list item in Info for better splitting later
            if (state === ParsingState.Info) {
              infoParts.push('\n');
            }
            break;
          case 'ul':
            if (
              state === ParsingState.Info ||
              state === ParsingState.ChapterList
            ) {
              popState();
            }
            break;
          case 'p':
            // Add paragraph breaks in summary
            if (state === ParsingState.Summary) {
              summaryParts.push('\n\n');
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
        novel.name = novel.name?.trim();
        // Join summary parts, trim, and replace multiple newlines with single ones if needed
        novel.summary = summaryParts
          .join('')
          .replace(/\n{3,}/g, '\n\n')
          .trim();

        // Process info parts: join, split by newline, filter, and parse
        infoParts
          .join('') // Join parts (already includes spaces/newlines)
          .split('\n') // Split into potential lines
          .map(line => line.trim()) // Trim each line
          .filter(line => line.includes(':')) // Keep lines with a colon separator
          .forEach(line => {
            const parts = line.split(':');
            const detailName = parts[0].trim().toLowerCase();
            // Join remaining parts in case value contains ':' and trim
            const detail = parts.slice(1).join(':').trim();

            switch (detailName) {
              case 'author':
              case 'author(s)': // Handle variations
                novel.author = detail;
                break;
              case 'genre':
              case 'genre(s)': // Handle variations
                novel.genres = detail
                  .split(',')
                  .map(g => g.trim())
                  .filter(Boolean)
                  .join(', ');
                break;
              case 'status':
                const statusText = detail.toLowerCase();
                if (statusText.includes('completed')) {
                  novel.status = NovelStatus.Completed;
                } else if (statusText.includes('ongoing')) {
                  novel.status = NovelStatus.Ongoing;
                } else if (statusText.includes('hiatus')) {
                  novel.status = NovelStatus.OnHiatus;
                } else {
                  novel.status = NovelStatus.Unknown;
                }
                break;
              // Add cases for other details like 'artist', 'alternative names', etc. if needed
              default:
                // Optionally log unrecognized details
                // console.log(`Unrecognized detail: ${detailName}`);
                break;
            }
          });

        // Fallback for novelId if not found via data attribute
        if (!novelId) {
          const idMatch = novelPath.match(/\d+/);
          novelId = idMatch ? idMatch[0] : null;
          // Alternative: try extracting from URL if path format is consistent
          // Example: if path is always like /novel-name-123.html
          // const pathParts = novelPath.split('-');
          // novelId = pathParts[pathParts.length - 1]?.split('.')[0];
        }
      },
    });

    parser.write(body);
    parser.end();

    // Assign chapters parsed directly if available (noAjax case)
    if (this.options.noAjax && chapters.length > 0) {
      novel.chapters = chapters;
    }

    // Fetch chapters via AJAX if needed and not already parsed
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
    if (!result.ok) {
      console.warn(`Search request failed (${result.status}): ${url}`);
      return [];
    }
    const html = await result.text();
    return this.parseNovels(html);
  }
}

enum ParsingState {
  Idle,
  NovelName,
  Cover,
  Info,
  Summary,
  ChapterList,
  Chapter,
  NovelItem, // Added for novel list item
  NovelTitle, // Added for novel title within item
  NovelLink, // Added for novel link within item
  NovelCover, // Added for novel cover within item
}
