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
    };
    const chapters: Plugin.ChapterItem[] = [];
    let novelId: string | null = null;

    let state: ParsingState = ParsingState.Idle;
    let currentText = '';
    let currentDetailName = '';
    let summaryParts: string[] = [];
    let hasPTagsInSummary = false;
    let tempChapter: Partial<Plugin.ChapterItem> = {};
    let chapterIndex = 0; // For direct chapter parsing

    const parser = new Parser({
      onopentag: (name, attribs) => {
        // Novel Name
        if (name === 'h3' && attribs.class === 'title') {
          state = ParsingState.NovelName;
        }

        // Cover
        if (name === 'div' && attribs.class === 'book') {
          state = ParsingState.Cover;
        }
        if (state === ParsingState.Cover && name === 'img') {
          const coverUrl =
            attribs.src ?? attribs['data-cfsrc'] ?? attribs['data-src'];
          if (coverUrl) {
            novel.cover = new URL(coverUrl, baseUrl).href;
          }
          // Maybe check noscript tag later if needed
        }
        if (name === 'meta' && attribs.name === 'image' && !novel.cover) {
          if (attribs.content) {
            novel.cover = new URL(attribs.content, baseUrl).href;
          }
        }

        // Info Section (Author, Genre, Status)
        if (name === 'ul' && attribs.class?.includes('info-meta')) {
          state = ParsingState.Info;
        }
        if (state === ParsingState.Info && name === 'li') {
          currentText = ''; // Reset text for each list item
        }
        if (name === 'div' && attribs.class === 'info') {
          // Handle alternative info structure
          state = ParsingState.Info;
        }
        if (state === ParsingState.Info && name === 'div' && !attribs.class) {
          // Inside the alternative info div
          currentText = '';
        }

        // Summary
        if (name === 'div' && attribs.class === 'desc-text') {
          state = ParsingState.Summary;
          summaryParts = []; // Reset summary parts
          hasPTagsInSummary = false;
        }
        if (state === ParsingState.Summary && name === 'p') {
          state = ParsingState.SummaryP;
          hasPTagsInSummary = true;
          currentText = '';
        }

        // Chapters - Check for novelId first
        if (name === 'div' && attribs.id === 'rating') {
          state = ParsingState.ChaptersAjaxCheck;
          novelId = attribs['data-novel-id'] || null;
        }

        // Chapters - Direct parsing if noAjax option is true
        if (this.options.noAjax && name === 'ul' && attribs.id === 'idData') {
          state = ParsingState.ChapterListDirect;
        }
        if (state === ParsingState.ChapterListDirect && name === 'li') {
          tempChapter = {}; // Reset for new chapter
        }
        if (state === ParsingState.ChapterListDirect && name === 'a') {
          state = ParsingState.Chapter;
          tempChapter.name = attribs.title || `Chapter ${chapterIndex + 1}`;
          const chapterPathRaw = attribs.href;
          tempChapter.path = chapterPathRaw?.startsWith('/')
            ? chapterPathRaw.slice(1)
            : novelPath.replace('.html', `/chapter-${chapterIndex}.html`); // Fallback path construction
          tempChapter.releaseTime = null;
          tempChapter.chapterNumber = chapterIndex + 1;
          chapterIndex++;
        }
      },
      ontext: text => {
        const trimmedText = text.trim();
        if (!trimmedText) return; // Ignore whitespace-only text nodes

        switch (state) {
          case ParsingState.NovelName:
            novel.name = trimmedText;
            // Once name is found, we can likely go back to Idle,
            // but keep it open in case of multi-line titles? Let's reset on tag close.
            break;
          case ParsingState.Info:
            // Accumulate text within <li> or <div> before splitting
            currentText += text;
            break;
          case ParsingState.Summary:
            // Only collect if no <p> tags are found inside
            if (!hasPTagsInSummary) {
              summaryParts.push(trimmedText);
            }
            break;
          case ParsingState.SummaryP:
            currentText += text; // Accumulate text within <p>
            break;
          case ParsingState.Author:
          case ParsingState.Genre:
          case ParsingState.Status:
            // Text directly follows the detail name span/tag
            const detail = text
              .split(',')
              .map(g => g.trim())
              .join(', ');
            if (state === ParsingState.Author) novel.author = detail;
            if (state === ParsingState.Genre) novel.genres = detail;
            if (state === ParsingState.Status) {
              const map: Record<string, string> = {
                completed: NovelStatus.Completed,
                ongoing: NovelStatus.Ongoing,
                hiatus: NovelStatus.OnHiatus,
              };
              novel.status = map[detail.toLowerCase()] ?? NovelStatus.Unknown;
            }
            state = ParsingState.Info; // Go back to info state after getting value
            break;
        }
      },
      onclosetag: name => {
        switch (name) {
          case 'h3':
            if (state === ParsingState.NovelName) state = ParsingState.Idle;
            break;
          case 'div':
            // Use state to determine context, not attribs
            if (state === ParsingState.Cover) state = ParsingState.Idle; // Assuming cover div closes
            if (state === ParsingState.Summary) state = ParsingState.Idle; // Assuming summary div closes
            if (state === ParsingState.Info) {
              // Check if we were in the general info state
              // Handle splitting for alternative structure (assuming it closes the .info div)
              const parts = currentText.split(':');
              if (parts.length > 1) {
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
                    novel.status =
                      map[detail.toLowerCase()] ?? NovelStatus.Unknown;
                    break;
                }
              }
              currentText = ''; // Reset text
              state = ParsingState.Idle; // Exit info state
            }
            break;
          case 'ul':
            // Use state to determine context
            if (state === ParsingState.Info) state = ParsingState.Idle; // Assuming info ul closes
            if (state === ParsingState.ChapterListDirect)
              state = ParsingState.Idle; // Assuming chapter ul closes
            break;
          case 'li':
            if (state === ParsingState.Info) {
              // Process accumulated text for standard <li> structure
              const parts = currentText.split(':');
              if (parts.length > 1) {
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
                    novel.status =
                      map[detail.toLowerCase()] ?? NovelStatus.Unknown;
                    break;
                }
              }
              currentText = ''; // Reset for next li
            }
            if (state === ParsingState.Chapter) {
              // Closing <li> after <a>
              if (tempChapter.name && tempChapter.path) {
                chapters.push({ ...tempChapter } as Plugin.ChapterItem);
              }
              tempChapter = {};
              state = ParsingState.ChapterListDirect; // Go back to list state
            }
            break;
          case 'p':
            if (state === ParsingState.SummaryP) {
              summaryParts.push(currentText.trim());
              currentText = '';
              state = ParsingState.Summary; // Go back to summary state
            }
            break;
          case 'a':
            if (state === ParsingState.Chapter) {
              // Chapter data is pushed on <li> close tag for direct parsing
              // state = ParsingState.ChapterListDirect; // Handled in li closetag
            }
            break;
        }
      },
      onend: () => {
        // Finalize summary
        novel.summary = summaryParts
          .join(hasPTagsInSummary ? '\n\n' : ' ')
          .trim();

        // If novelId wasn't found in #rating, try extracting from path
        if (!novelId) {
          const idMatch = novelPath.match(/\d+/);
          novelId = idMatch ? idMatch[0] : null;
        }
      },
    });

    parser.write(body);
    parser.end();

    // AJAX Chapter Loading (kept using Cheerio for simplicity for now)
    // Ensure novelId is not null before proceeding
    if (!this.options.noAjax && novelId !== null && chapters.length === 0) {
      const chapterListing =
        this.options.chapterListing || 'ajax/chapter-archive';
      const ajaxParam = this.options.chapterParam || 'novelId';
      // novelId is confirmed not null here
      const params = new URLSearchParams({
        [ajaxParam]: novelId,
      });
      const chaptersUrl = `${this.site}${chapterListing}?${params.toString()}`;

      try {
        // Use getCheerio specifically for the AJAX request
        const $ = await this.getCheerio(chaptersUrl, false);
        const listing = $('.panel-body li a, select option');

        listing.each((_, el) => {
          const $el = $(el);
          const chapterName = $el.attr('title') || $el.text() || '';
          const chapterHref = $el.attr('href') || $el.attr('value') || '';

          if (chapterHref) {
            const chapterUrlObject = new URL(chapterHref, this.site);
            const chapterUrl = chapterUrlObject.pathname.slice(1);
            chapters.push({
              name: chapterName.trim(),
              path: chapterUrl,
              releaseTime: null,
            });
          }
        });
      } catch (ajaxError) {
        console.error('Failed to fetch or parse AJAX chapters:', ajaxError);
        // Decide how to handle AJAX errors, maybe throw or return novel without chapters
      }
    }

    novel.chapters = chapters;
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
  Author,
  Genre,
  Status,
  Summary,
  SummaryP,
  ChaptersAjaxCheck, // State to check for novelId for potential AJAX call
  ChapterListDirect, // State for parsing chapters directly from #idData
  ChapterListAjax, // State for parsing chapters from AJAX response
  Chapter,
}
