import { CheerioAPI, load as parseHTML } from 'cheerio';
import { fetchApi } from '@libs/fetch';
import { Plugin } from '@typings/plugin';
import { Filters, FilterTypes } from '@libs/filterInputs';
import { defaultCover } from '@libs/defaultCover';

class RewayatClub implements Plugin.PagePlugin {
  id = 'rewayatclub';
  name = 'Rewayat Club';
  version = '1.0.0';
  icon = 'src/ar/rewayatclub/icon.png';
  site = 'https://rewayat.club/';

  parseNovels(loadedCheerio: CheerioAPI): Plugin.NovelItem[] {
    const novels: Plugin.NovelItem[] = [];
    console.log(loadedCheerio);
    loadedCheerio('.row--dense').each((idx, ele) => {
      loadedCheerio(ele)
        .find('.v-sheet--outlined')
        .each((idx, ele) => {
          const novelName = loadedCheerio(ele)
            .find('.v-list-item__title')
            .text()
            .trim();
          const novelUrl =
            loadedCheerio(ele)
              .find('a')
              .attr('href')
              ?.trim()
              .replace(/^\/*/, '') || '';
          const novelUrlMatch = novelUrl.replace(/\d+$|-/g, ' ').replace(/%20|%21|%22|%23|%24|%25|%26|%27|%28|%29|%2A|%2B|%2C|%2D|%2E|%3A|%3B|%3C|%3D|%3E|%3F|%40|%5B|%5C|%5D|%5E|%5F|%60|%7B|%7C|%7D|%7E|[._~:?#[\]@!$&'()*+,;=]+/g,'').toLowerCase();
          const imageRaw = loadedCheerio(
            'body script:contains("__NUXT__")',
          ).text();
          const imageUrlRegex = /poster_url:"\\u002F([^"]+)"/g;
          const imageUrls: string[] = [];
          let match: RegExpExecArray | null;

          while ((match = imageUrlRegex.exec(imageRaw)) !== null) {
            imageUrls.push(
              match[1]
                .replace(/\\u002F/g, '/')
                .replace(/%20/g, ' ')
                .replace(/^\/*/, ''),
            );
          }

          let novelCover = defaultCover;

          for (const imageUrlShort of imageUrls) {
            const imageUrlShortLower = imageUrlShort.replace(/%20|%21|%22|%23|%24|%25|%26|%27|%28|%29|%2A|%2B|%2C|%2D|%2E|%3A|%3B|%3C|%3D|%3E|%3F|%40|%5B|%5C|%5D|%5E|%5F|%60|%7B|%7C|%7D|%7E|[._~:?#[\]@!$&'()*+,;=]+/g,'').replace(/-/g,' ').toLowerCase();
            console.log(`Image URLs: ${imageUrlShortLower}`);
            if (imageUrlShortLower.includes(novelUrlMatch)) {
              novelCover = `https://api.rewayat.club/${imageUrlShort}`;
              break;
            }
          }
          console.log(`Novel URL: ${novelUrlMatch}`);
          console.log(`Image URLs: ${imageUrls}`);
          console.log(`Novel Cover: ${novelCover}`);
          if (!novelUrl) return;

          const novel = {
            name: novelName,
            cover: novelCover,
            path: novelUrl,
          };

          novels.push(novel);
        });
    });

    return novels;
  }

  async popularNovels(
    page: number,
    { showLatestNovels, filters }: Plugin.PopularNovelsOptions<Filters>,
  ): Promise<Plugin.NovelItem[]> {
    let link = `${this.site}library`;

    if (filters) {
      if (filters.categories.value !== '') {
        link += `?type=${filters.categories.value}`;
      }
      if (filters.sortOptions.value !== '') {
        link += `&ordering=${filters.sortOptions.value}`;
      }
      if (filters.genre.value.length > 0) {
        filters.genre.value.forEach((genre: string) => {
          link += `&genre=${genre}`;
        });
      }
    }
    link += `&page=${page}`;
    const body = await fetchApi(link).then(r => r.text());
    const loadedCheerio = parseHTML(body);
    return this.parseNovels(loadedCheerio);
  }

  async parseNovel(
    novelUrl: string,
  ): Promise<Plugin.SourceNovel & { totalPages: number }> {
    const result = await fetchApi(new URL(novelUrl, this.site).toString());
    const body = await result.text();
    const loadedCheerio = parseHTML(body);

    const novel: Plugin.SourceNovel & { totalPages: number } = {
      path: novelUrl,
      name: loadedCheerio('h1.primary--text span').text().trim() || 'Untitled',
      author: loadedCheerio('.novel-author').text().trim(),
      summary: loadedCheerio('div.text-pre-line span').text().trim(),
      totalPages: 1,
      chapters: [],
    };
    const statusWords = new Set(['مكتملة', 'متوقفة', 'مستمرة']);
    const mainGenres = Array.from(loadedCheerio('.v-slide-group__content a'))
      .map(el => loadedCheerio(el).text().trim())
      .join(',');
    const statusGenre = Array.from(
      loadedCheerio('div.v-slide-group__content span.v-chip__content'),
    )
      .map(el => loadedCheerio(el).text().trim())
      .filter(text => statusWords.has(text));
    novel.genres = `${statusGenre},${mainGenres}`;
    const statusText = Array.from(
      loadedCheerio('div.v-slide-group__content span.v-chip__content'),
    )
      .map(el => loadedCheerio(el).text().trim())
      .filter(text => statusWords.has(text))
      .join();
    novel.status =
      {
        'متوقفة': 'On Hiatus',
        'مكتملة': 'Completed',
        'مستمرة': 'Ongoing',
      }[statusText] || 'Unknown';
    const imageRaw = loadedCheerio('body script:contains("__NUXT__")')
      .first()
      .text();
    const imageUrlRegex = /poster_url:"(\\u002F[^"]+)"/;
    const imageUrlMatch = imageRaw?.match(imageUrlRegex);
    const ImageUrlShort = imageUrlMatch
      ? imageUrlMatch[1].replace(/\\u002F/g, '/').replace(/^\/*/, '')
      : defaultCover;
    const imageUrl = `https://api.rewayat.club/${ImageUrlShort}`;
    novel.cover = imageUrl;
    const chapterNumberStr = loadedCheerio('div.v-tab--active span.mr-1')
      .text()
      .replace(/[^\d]/g, '');
    const chapterNumber = parseInt(chapterNumberStr, 10);
    const pageNumber = Math.ceil(chapterNumber / 24);
    novel.totalPages = pageNumber;

    return novel;
  }
  parseChapters(data: { chapters: ChapterEntry[] }) {
    const chapter: Plugin.ChapterItem[] = [];
    data.chapters.map((item: ChapterEntry) => {
      chapter.push({
        name: item.chapterName,
        releaseTime: new Date(item.releaseTime).toISOString(),
        path: item.chapterUrl,
        chapterNumber: item.chapterNumber,
      });
    });
    return chapter.reverse();
  }
  async parsePage(novelPath: string, page: string): Promise<Plugin.SourcePage> {
    const pagePath = novelPath;
    const firstUrl = this.site + pagePath;
    const pageUrl = firstUrl + '?page=' + page;
    const body = await fetchApi(pageUrl).then(r => r.text());
    const loadedCheerio = parseHTML(body);
    let dataJson: {
      pages_count: string;
      chapters: ChapterEntry[];
    } = { pages_count: '', chapters: [] };
    const chaptersinfo: {
      chapterName: string;
      chapterUrl: string;
      releaseTime: string;
      chapterNumber: number;
    }[] = [];
    loadedCheerio('div[role="list"] a').each((i, el) => {
      const chapterName = loadedCheerio(el)
        .find('div.v-list-item__title')
        .text()
        .trim();
      const chapterUrl = loadedCheerio(el)
        .attr('href')
        ?.trim()
        .replace(/^\/*/, '');
      const releaseTime = loadedCheerio(el)
        .find('div.v-list-item__subtitle span')
        .first()
        .text()
        .trim()
        .replace(/\//g, '-');
      const chapternumber = loadedCheerio(el)
        .find('div.v-avatar--tile span.v-chip__content span')
        .text();
      const chapterNumber = parseInt(chapternumber, 10);
      chaptersinfo.push({
        chapterName: chapterName,
        chapterUrl: chapterUrl || '',
        releaseTime: releaseTime || '',
        chapterNumber: chapterNumber || '',
      });
    });
    const pagecount = loadedCheerio(
      '.v-select__selections div.v-select__selection--comma',
    ).text();
    dataJson.pages_count = pagecount;

    dataJson.chapters = chaptersinfo;
    const chapters = this.parseChapters(dataJson);
    return {
      chapters,
    };
  }
  async parseChapter(chapterUrl: string): Promise<string> {
    const result = await fetchApi(new URL(chapterUrl, this.site).toString());
    const body = await result.text();
    const loadedCheerio = parseHTML(body);
    let chapterText = '';
    loadedCheerio('div.v-card--flat').each((idx, ele) => {
      loadedCheerio(ele)
        .find('div.v-card__text')
        .each((idx, textEle) => {
          chapterText +=
            loadedCheerio(textEle)
              .find('p')
              .map((_, pEle) => loadedCheerio(pEle).text().trim())
              .get()
              .join(' ') + ' ';
        });
    });
    chapterText = chapterText.trim();
    return chapterText;
  }

  async searchNovels(
    searchTerm: string,
    page: number,
  ): Promise<Plugin.NovelItem[]> {
    const searchUrl = `${this.site}library?type=0&ordering=-num_chapters&page=${page}&search=${searchTerm}`;

    const result = await fetchApi(searchUrl);
    const body = await result.text();
    const loadedCheerio = parseHTML(body);
    return this.parseNovels(loadedCheerio);
  }

  filters = {
    genre: {
      value: [],
      label: 'Genres',
      options: [
        { label: 'كوميديا', value: '1' }, // Comedy
        { label: 'أكشن', value: '2' }, // Action
        { label: 'دراما', value: '3' }, // Drama
        { label: 'فانتازيا', value: '4' }, // Fantasy
        { label: 'مهارات القتال', value: '5' }, // Combat Skills
        { label: 'مغامرة', value: '6' }, // Adventure
        { label: 'رومانسي', value: '7' }, // Romance
        { label: 'خيال علمي', value: '8' }, // Science Fiction
        { label: 'الحياة المدرسية', value: '9' }, // School Life
        { label: 'قوى خارقة', value: '10' }, // Super Powers
        { label: 'سحر', value: '11' }, // Magic
        { label: 'رياضة', value: '12' }, // Sports
        { label: 'رعب', value: '13' }, // Horror
        { label: 'حريم', value: '14' }, // Harem
      ],
      type: FilterTypes.CheckboxGroup,
    },
    categories: {
      value: '0',
      label: 'الفئات',
      options: [
        { label: 'جميع الروايات', value: '0' },
        { label: 'مترجمة', value: '1' },
        { label: 'مؤلفة', value: '2' },
        { label: 'مكتملة', value: '3' },
      ],
      type: FilterTypes.Picker,
    },
    sortOptions: {
      value: '-num_chapters',
      label: 'الترتيب',
      options: [
        { label: 'عدد الفصول - من أقل ﻷعلى', value: 'num_chapters' },
        { label: 'عدد الفصول - من أعلى ﻷقل', value: '-num_chapters' },
        { label: 'الاسم - من أقل ﻷعلى', value: 'english' },
        { label: 'الاسم - من أعلى ﻷقل', value: '-english' },
      ],
      type: FilterTypes.Picker,
    },
  } satisfies Filters;
}

export default new RewayatClub();

interface ChapterEntry {
  chapterName: string;
  chapterUrl: string;
  releaseTime: string;
  chapterNumber: number;
}
