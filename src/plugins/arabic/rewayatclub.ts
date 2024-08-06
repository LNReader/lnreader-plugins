import { CheerioAPI, load as parseHTML } from 'cheerio';
import { fetchApi } from '@libs/fetch';
import { Plugin } from '@typings/plugin';
import { Filters, FilterTypes } from '@libs/filterInputs';
import { defaultCover } from '@libs/defaultCover';
import { Cheerio } from 'node_modules/cheerio/lib';

class RewayatClub implements Plugin.PluginBase {
  id = 'rewayatclub';
  name = 'Rewayat Club';
  version = '1.0.0';
  icon = 'src/ar/rewayatclub/icon.png';
  site = 'https://rewayat.club/';

  parseNovels(loadedCheerio: CheerioAPI): Plugin.NovelItem[] {
    const novels: Plugin.NovelItem[] = [];
    interface novels {
      novelName:string,
      novelUrl:string,
      novelCover:string
    }
    console.log(loadedCheerio)
    loadedCheerio('.row--dense').each((idx, ele) => {
        loadedCheerio(ele).find('.v-sheet--outlined').each((idx, ele) => {
            const novelName = loadedCheerio(ele)
                .find('.v-list-item__title')
                .text()
                .trim();
            const novelUrl = loadedCheerio(ele)
                .find('a')
                .attr('href')
                ?.trim()
                .replace(/^\/*/, '');
            // const imageRaw = loadedCheerio(ele).find('div.v-image div.v-image__image').attr('style');
            // console.log(`this is the code ${imageRaw}`)
            // const imageUrlRegex = /background-image:\s*url\(["']([^"']+)["']|&quot;([^&]+)&quot;\)/;
            // const imageUrl = imageRaw?.match(imageUrlRegex)?.[1]
            
            // const novelCover = imageUrl || defaultCover;
            const matchName = novelName.replace(' ','-')
            const imageRaw = loadedCheerio('script').text();
            const imageUrlRegex = /poster_url:"(\\u002F[^"]+)"/;
            const imageUrlmatch = imageRaw?.match(imageUrlRegex);
            const ImageUrlShort = imageUrlmatch ? imageUrlmatch[1].replace(/\\u002F/g, '/').replace(/^\/*/, '') : defaultCover;
            const imageUrl = `https://api.rewayat.club/${ImageUrlShort}`
            const novelCover = imageUrl

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
    link += `&page=${page}`
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
      name: loadedCheerio('h1.primary--text span').text().trim() || 'Untitled',
      author: loadedCheerio('.novel-author').text().trim(),
      summary: loadedCheerio('div.text-pre-line span').text().trim(),
      chapters: [],
    };
    const statusWords = new Set(['مكتملة','متوقفة','مستمرة']);
    const mainGenres = Array.from(loadedCheerio('.v-slide-group__content a')).map(el => loadedCheerio(el).text().trim()).join(',');
    const statusGenre= Array.from(loadedCheerio('div.v-slide-group__content span.v-chip__content')).map(el => loadedCheerio(el).text().trim())
    .filter(text => statusWords.has(text));
    novel.genres=`${statusGenre},${mainGenres}`;
    const statusText = Array.from(loadedCheerio('div.v-slide-group__content span.v-chip__content')).map(el => loadedCheerio(el).text().trim())
    .filter(text => statusWords.has(text)).join();
    novel.status = {
    'متوقفة': 'On Hiatus',
    'مكتملة': 'Completed',
    'مستمرة': 'Ongoing'
    }[statusText] || 'Unknown';
    const imageRaw = loadedCheerio('script').text();
    const imageUrlRegex = /poster_url:"(\\u002F[^"]+)"/;
    const imageUrlmatch = imageRaw?.match(imageUrlRegex);
    const ImageUrlShort = imageUrlmatch ? imageUrlmatch[1].replace(/\\u002F/g, '/').replace(/^\/*/, '') : defaultCover;
    const imageUrl = `https://api.rewayat.club/${ImageUrlShort}`
    novel.cover = imageUrl
    const chapterItems: Plugin.ChapterItem[] = [];
    loadedCheerio('div[role="list"] a').each((i, el) => {
      const chapterName = loadedCheerio(el).find('div.v-list-item__title').text().trim();
      const chapterUrl = loadedCheerio(el).attr('href')?.trim().replace(/^\/*/, '');
      const releaseTime = loadedCheerio(el).find('div.v-list-item__subtitle span').first().text().trim().replace(/\//g, '-');
      if (chapterUrl) {
        chapterItems.push({
          name: chapterName,
          path: chapterUrl,
          releaseTime: releaseTime,
        });
      }
    });
    novel.chapters = chapterItems;
  
    return novel;
  }
  async parseChapter(chapterUrl: string): Promise<string> {
    const result = await fetchApi(new URL(chapterUrl, this.site).toString());
    const body = await result.text();
    const loadedCheerio = parseHTML(body);
    let chapterText = '';
    loadedCheerio('div.v-card--flat').each((idx, ele) => {
        loadedCheerio(ele).find('div.v-card__text').each((idx, textEle) => {
            chapterText += loadedCheerio(textEle).find('p').map((_, pEle) => loadedCheerio(pEle).text().trim()).get().join(' ') + ' ';
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
    console.log(`this is the code ${loadedCheerio(body)}`)
    return this.parseNovels(loadedCheerio);
  }

  filters = {
    genre: {
      value: [],
      label: 'Genres',
      options: [
        { label: 'كوميديا', value: '1' },            // Comedy
        { label: 'أكشن', value: '2' },                // Action
        { label: 'دراما', value: '3' },               // Drama
        { label: 'فانتازيا', value: '4' },            // Fantasy
        { label: 'مهارات القتال', value: '5' },       // Combat Skills
        { label: 'مغامرة', value: '6' },              // Adventure
        { label: 'رومانسي', value: '7' },             // Romance
        { label: 'خيال علمي', value: '8' },            // Science Fiction
        { label: 'الحياة المدرسية', value: '9' },      // School Life
        { label: 'قوى خارقة', value: '10' },           // Super Powers
        { label: 'سحر', value: '11' },                 // Magic
        { label: 'رياضة', value: '12' },               // Sports
        { label: 'رعب', value: '13' },                 // Horror
        { label: 'حريم', value: '14' }                 // Harem
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
