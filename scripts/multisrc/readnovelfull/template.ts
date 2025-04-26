import { CheerioAPI, load } from 'cheerio';
import { fetchApi } from '@libs/fetch';
import { Plugin } from '@typings/plugin';
import { NovelStatus } from '@libs/novelStatus';
import { Filters } from '@libs/filterInputs';

type ReadNovelFullOptions = {
  lang?: string;
  versionIncrements?: number;
  latestPage: string;
  searchPage: string;
  ajaxChapterList?: boolean;
  ajaxChapterParam?: string;
  novelListing?: string;
  chapterListing?: string;
  TypeParam?: string;
  genreParam?: string;
  genreKey?: string;
  pageParam?: string;
  langParam?: string;
  urlLangCode?: string;
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
    this.version = `2.0.${0 + versionIncrements}`;
    this.options = metadata.options;
    this.filters = metadata.filters;
  }

  async getCheerio(url: string, search: boolean): Promise<CheerioAPI> {
    const r = await fetchApi(url);
    if (!r.ok && search != true)
      throw new Error(
        'Could not reach site (' + r.status + ') try to open in webview.',
      );
    const $ = load(await r.text());

    return $;
  }

  parseNovels($: CheerioAPI): Plugin.NovelItem[] {
    const baseUrl = this.site;

    const novels = $('.list-novel .row, .list-truyen .row')
      .toArray()
      .map(el => {
        const $el = $(el);

        const novelName = $el.find('h3').text()?.trim();
        const rawHref = $el.find('a').attr('href');
        const rawCover =
          $el.find('img').attr('data-src') || $el.find('img').attr('src');

        if (!novelName || !rawHref) {
          return null;
        }

        let novelPath: string;
        let novelCover: string | undefined;

        const novelUrlObject = new URL(rawHref, baseUrl);
        novelPath = novelUrlObject.pathname.slice(1);

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
    let url = '';
    const pageParam = this.options.pageParam || 'page';

    if (this.options.novelListing) {
      // URL structure with parameters
      const params = new URLSearchParams();
      const typeParam = this.options.TypeParam || 'type'; // Default to 'type' if not specified

      if (showLatestNovels) {
        params.append(typeParam, this.options.latestPage);
      } else if (filters.genres.value.length) {
        params.append(typeParam, this.options.genreParam!);
        const genreKey = this.options.genreKey || 'id'; // Default to 'id' if not specified
        params.append(genreKey, filters.genres.value);
      } else {
        params.append(typeParam, filters.type.value);
      }

      // Add language parameter if specified
      if (this.options.langParam && this.options.urlLangCode) {
        params.append(this.options.langParam, this.options.urlLangCode);
      }

      params.append(pageParam, pageNo.toString());

      url = `${this.site}${this.options.novelListing}?${params.toString()}`;
    } else {
      // URL structure with path segments
      let basePage = '';
      const params = new URLSearchParams({
        [pageParam]: pageNo.toString(),
      });

      if (showLatestNovels) {
        basePage = this.options.latestPage;
      } else if (filters?.genres?.value?.length) {
        basePage = filters.genres.value;
      } else {
        basePage = filters.type.value;
      }

      url = `${this.site}${basePage}?${params.toString()}`;
    }

    const $ = await this.getCheerio(url, false);
    return this.parseNovels($);
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    let $ = await this.getCheerio(this.site + novelPath, false);
    const baseUrl = this.site;

    const novel: Plugin.SourceNovel & { totalPages?: number } = {
      path: novelPath.replace(this.site, ''),
      name: 'Untitled',
    };

    novel.name = $('h3.title').first().text().trim();
    const coverUrl = $('.book > img').attr('src');
    if (coverUrl) {
      novel.cover = new URL(coverUrl, baseUrl).href;
    }

    $('ul.info.info-meta > li, .info > div').each(function () {
      const detailName = $(this)
        .find('h3')
        .first()
        .text()
        .toLowerCase()
        .replace(':', '');

      const detail = $(this).text().split(':')[1].trim().toLowerCase();

      switch (detailName) {
        case 'author':
          novel.author = detail;
          break;
        case 'genre':
          novel.genres = detail;
          break;
        case 'status':
          switch (detail) {
            case 'completed':
              novel.status = NovelStatus.Completed;
              break;
            case 'ongoing':
              novel.status = NovelStatus.Ongoing;
              break;
            case 'hiatus':
              novel.status = NovelStatus.OnHiatus;
              break;
            default:
              novel.status = NovelStatus.Unknown;
              break;
          }
          break;
      }
    });

    const summaryDiv = $('.desc-text');
    const pTagSummary = summaryDiv.find('p');
    novel.summary =
      pTagSummary.length > 0
        ? pTagSummary
            .map((_, el) => $(el).text().trim())
            .get()
            .join('\n\n')
        : summaryDiv.text().trim(); // --- Else (no <p> tags, assume <br>) ---

    console.log(novel.summary);

    const chapters: Plugin.ChapterItem[] = [];

    const novelId = $('#rating').attr('data-novel-id');
    if (this.options?.ajaxChapterList) {
      const ajaxParam = this.options.ajaxChapterParam || 'novelId';
      const chapterListing = this.options.chapterListing || 'chapter-archive';
      const params = new URLSearchParams({
        [ajaxParam]: novelId!.toString(),
      });
      const chaptersUrl = `${this.site}ajax/${chapterListing}?${params.toString()}`;

      $ = await this.getCheerio(chaptersUrl, false);

      $('.panel-body')
        .find('li')
        .each(function () {
          const chapterName = $(this).find('a').attr('title') || '';
          const chapterHref = $(this).find('a').attr('href') || '';

          const chapterUrlObject = new URL(chapterHref, baseUrl);
          const chapterUrl = chapterUrlObject.pathname.slice(1);

          chapters.push({
            name: chapterName,
            path: chapterUrl,
          });
        });
    } else {
      chapters.push(...this.parsePageChapters($));
      novel.totalPages = parseInt(
        ($('ul.pagination > li.last > a').attr('data-page') ??
          $('ul.pagination > li.last > a')
            .attr('href')
            ?.match(/\?page_num=(\d+)/)?.[1])!,
      );
    }

    novel.chapters = chapters;

    return novel;
  }

  parsePageChapters($: CheerioAPI) {
    const baseUrl = this.site;
    const chapters: Plugin.ChapterItem[] = [];
    $('.list-chapter')
      .find('li')
      .each(function () {
        const chapterName = $(this).find('a').attr('title') || '';
        const chapterHref = $(this).find('a').attr('href') || '';

        const chapterUrlObject = new URL(chapterHref, baseUrl);
        const chapterUrl = chapterUrlObject.pathname.slice(1);

        chapters.push({
          name: chapterName,
          path: chapterUrl,
        });
      });
    return chapters;
  }

  async parsePage(novelPath: string, page: string): Promise<Plugin.SourcePage> {
    const $ = await this.getCheerio(
      this.site + novelPath + '?page=' + page,
      false,
    );
    const chapters = this.parsePageChapters($);
    return {
      chapters,
    };
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const $ = await this.getCheerio(this.site + chapterPath, false);

    return $('#chr-content, #chapter-content').html()!;
  }

  async searchNovels(
    searchTerm: string,
    page: number,
  ): Promise<Plugin.NovelItem[]> {
    const pageParam = this.options.pageParam || 'page';

    const params = new URLSearchParams({
      keyword: searchTerm,
      [pageParam]: page.toString(),
    });

    if (this.options.langParam) {
      params.append(this.options.langParam, this.options.urlLangCode!);
    }

    const url = `${this.site}${this.options.searchPage}?${params.toString()}`;
    const $ = await this.getCheerio(url, true);

    return this.parseNovels($);
  }
}
