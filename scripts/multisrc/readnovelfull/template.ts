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
    this.version = `2.0.${1 + versionIncrements}`;
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
    let url = '';
    const pageParam = this.options.pageParam || 'page';

    if (this.options.novelListing) {
      // URL structure with parameters
      const params = new URLSearchParams();
      const typeParam = this.options.typeParam || 'type'; // Default to 'type' if not specified

      if (showLatestNovels) {
        params.append(typeParam, this.options.latestPage);
      } else if (filters.genres.value.length) {
        params.append(typeParam, this.options.genreParam || 'category_novel'); // same below
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
      } else if (filters.genres.value.length) {
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

    const novel: Partial<Plugin.SourceNovel> = {
      path: novelPath,
    };

    novel.name = $('h3.title').first().text().trim();
    const coverUrl =
      $('.book img').attr('src') ??
      $('.book img').attr('data-cfsrc') ??
      $('.book img').attr('data-src') ??
      $('.book noscript img').attr('src') ??
      $('meta[name="image"]').attr('content');

    if (coverUrl) {
      novel.cover = new URL(coverUrl, baseUrl).href;
    }

    $('ul.info.info-meta li, .info div').each(function () {
      const detailText = $(this).text().split(':');
      const detailName = detailText[0].trim().toLowerCase();
      const detail = detailText[1]
        ?.split(',')
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

    const chapters: Plugin.ChapterItem[] = [];

    const dataNovelId = $('#rating').attr('data-novel-id');
    const idMatch = novelPath.match(/\d+/);
    const novelId = dataNovelId || (idMatch ? idMatch[0] : null);

    if (this.options.noAjax) {
      $('#idData li a').each((i, el) => {
        const name = $(el).attr('title') || `Chapter ${i + 1}`;
        const path =
          $(el).attr('href')?.slice(1) ||
          novelPath.replace('.html', `/chapter-${i}.html`);

        chapters.push({
          name: name,
          path: path,
          releaseTime: null,
          chapterNumber: i + 1,
        });
      });
    }

    if (novelId && chapters.length === 0) {
      const chapterListing =
        this.options.chapterListing || 'ajax/chapter-archive';

      const ajaxParam = this.options.chapterParam || 'novelId';
      const params = new URLSearchParams({
        [ajaxParam]: novelId.toString(),
      });

      const chaptersUrl = `${this.site}${chapterListing}?${params.toString()}`;

      $ = await this.getCheerio(chaptersUrl, false);

      const listing = $('.panel-body li a, select option');

      listing.each((_, el) => {
        const $el = $(el);
        const chapterName = $el.attr('title') || $el.text() || '';
        const chapterHref = $el.attr('href') || $el.attr('value') || '';

        const chapterUrlObject = new URL(chapterHref, this.site);
        const chapterUrl = chapterUrlObject.pathname.slice(1);

        chapters.push({
          name: chapterName,
          path: chapterUrl,
          releaseTime: null,
        });
      });
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
    const pageParam = this.options.pageParam || 'page';
    const searchKey = this.options.searchKey || 'keyword';

    const params = new URLSearchParams({
      [searchKey]: searchTerm,
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
