import { CheerioAPI, load as parseHTML } from 'cheerio';
import { fetchApi } from '@libs/fetch';
import { Plugin } from '@typings/plugin';
import { Filters, FilterTypes } from '@libs/filterInputs';
import { defaultCover } from '@libs/defaultCover';

import crypto from 'crypto';

// Decrypt function
function decrypt(responseData: string): string {
  const enc = responseData.split('|');

  // Helper function to compute SHA-256 hash
  const sha256 = (input: string): string => {
      return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
  };

  // Convert hex string to byte array
  const hexStringToByteArray = (hexString: string): Uint8Array => {
      const length = hexString.length;
      const byteArray = new Uint8Array(length / 2);
      for (let i = 0; i < length; i += 2) {
          byteArray[i / 2] = parseInt(hexString.substr(i, 2), 16);
      }
      return byteArray;
  };

  // AES decryption
  const aesDecrypt = (encryptedText: string, secretKey: Uint8Array, ivString: string): string => {
      const decipher = crypto.createDecipheriv(
          'aes-256-cbc',
          secretKey,
          Buffer.from(ivString, 'base64')
      );
      let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
  };

  // Generate the secret key
  const secretKey = hexStringToByteArray(sha256(enc[3]));

  // Decrypt the message
  return aesDecrypt(enc[0], secretKey, enc[2]);
}

class Sunovels implements Plugin.PluginBase {
  id = 'dilartube';
  name = 'dilar tube';
  version = '1.0.0';
  icon = 'src/ar/sunovels/icon.png';
  site = 'https://dilar.tube/';

  parseNovels(data: ApiResponse): Plugin.NovelItem[] {
    const novels: Plugin.NovelItem[] = [];
    data.releases
    .filter((release) => release.manga.is_novel)  // Filter for novels only
    .map((release) => {
      const manga = release.manga;

      novels.push({
        name: manga.title,  // Extract the novel's title
        path: `api/mangas/${manga.id}`,  // Construct the path, using id or slug if available
        cover: `uploads/manga/cover/3543/${manga.cover}`,  // Construct the full cover URL
      });
    });
    return novels;
  }

  async popularNovels(
    page: number,
    { showLatestNovels, filters }: Plugin.PopularNovelsOptions<Filters>,
  ): Promise<Plugin.NovelItem[]> {
    let link = `${this.site}releases`;
    if (showLatestNovels){
      link = `${this.site}releases`;
    }
    // if (filters) {
    //   if (
    //     Array.isArray(filters.categories.value) &&
    //     filters.categories.value.length > 0
    //   ) {
    //     filters.categories.value.forEach((genre: string) => {
    //       link += `&category=${genre}`;
    //     });
    //   }
    //   if (filters.status.value !== '') {
    //     link += `&status=${filters.status.value}`;
    //   }
    // }
    // link += `&page=${pageCorrected}`;
    // const body = await fetchApi(link).then(r => r.text());
    const response = await fetchApi(link).then(r => r.json());
    console.log(response)
    return this.parseNovels(response);
  }

  async parseNovel(novelUrl: string): Promise<Plugin.SourceNovel> {
    const chapterItems: Plugin.ChapterItem[] = [];
    let fullUrl = this.site + novelUrl;
    let chapterUrl = this.site + novelUrl + '/releases'
    const manga = await fetchApi(fullUrl).then(r => r.json());
    const chapters = await fetchApi(chapterUrl).then(r => r.json());
    const mangaData = manga.mangaData;
    const chapterData = chapters.releases
  
    const novel: Plugin.SourceNovel & { totalPages: number } = {
      path: novelUrl,
      name: mangaData.arabic_title || 'Untitled',
      author: (mangaData.authors.length > 0 ? mangaData.authors[0].name : '') || 'Unknown',
      summary: mangaData.summary || '',
      cover: `${this.site}uploads/manga/cover/${mangaData.id}/${mangaData.cover}`,
      totalPages: 1,
      chapters: [],
    };
  
    // Status and genres
    const translationStatusId:string = mangaData.status.toString();
    const translationText = {
      '1': 'مستمره',
      '0': 'منتهية',
      '2': 'متوقفة',
      '3': 'غير مترجمه',
    }[translationStatusId] || 'غير معروف';
    const statusWords = new Set(['مكتمل', 'جديد', 'مستمر']);
    const mainGenres = mangaData.categories.map(category => category.name).join(',');
    novel.genres = `${translationText},${mainGenres}`;
    
    const statusId:string = mangaData.status.toString();
    const statusText = {
      '2': 'Ongoing',
      '3': 'Completed',
    }[statusId] || 'Unknown';
    novel.status = statusText
    chapters.map((item: ChapterRelease) => {
      chapters.push({
        name: item.title,
        releaseTime: new Date(item.created_at).toISOString(),
        path: `${novelUrl}/${mangaData.title.replace(' ','-')}/${item.chapter}`,
        chapterNumber: item.chapter,
      });
    });
    novel.chapters = chapterItems;
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
    return chapter;
  }
  async parsePage(novelPath: string, page: string): Promise<Plugin.SourcePage> {
    const numPage = parseInt(page, 10);
    const pageCorrected = numPage - 1;
    const pagePath = novelPath;
    const firstUrl = this.site + pagePath;
    const pageUrl = firstUrl + '?activeTab=chapters&page=' + pageCorrected;
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
      chapterNumber: string | number;
    }[] = [];
    loadedCheerio('ul.chaptersList a').each((i, el) => {
      const chapterName: string = loadedCheerio(el).attr('title') ?? '';
      const chapterUrl = loadedCheerio(el)
        .attr('href')
        ?.trim()
        .replace(/^\/*/, '');
      const dateAttr = loadedCheerio(el)
        .find('time.chapter-update')
        .attr('datetime');
      const date = new Date(dateAttr);
      const releaseTime = date.toISOString();
      const chapternumber = loadedCheerio(el)
        .find('strong.chapter-title')
        .text()
        .replace(/[^\d٠-٩]/g, '');
      const chapterNumber = parseInt(chapternumber, 10);
      chaptersinfo.push({
        chapterName: chapterName,
        chapterUrl: chapterUrl || '',
        releaseTime: releaseTime || '',
        chapterNumber: chapterNumber || '',
      });
    });
    const pagecount = loadedCheerio('ul.pagination a.active').text();
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
    loadedCheerio('div.chapter-content').each((idx, ele) => {
      loadedCheerio(ele)
        .find('p')
        .not('.d-none')
        .each((idx, textEle) => {
          chapterText +=
            loadedCheerio(textEle)
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
    page: number
  ): Promise<Plugin.NovelItem[]> {
    const searchUrl = `${this.site}api/mangas/search`;
  
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      'Sec-Fetch-Mode': 'no-cors',
      body: JSON.stringify({
        title: `"${searchTerm}"`,
        manga_types: {
          include: ["1", "2", "3", "4", "5", "6", "7", "8"],
          exclude: [],
        },
        oneshot: false,
        novel: false,
        story_status: {
          include: [],
          exclude: [],
        },
        translation_status: {
          include: [],
          exclude: ["3"],
        },
        categories: {
          include: [null],
          exclude: [],
        },
        chapters: {
          min: "",
          max: "",
        },
        dates: {
          start: null,
          end: null,
        },
        page: page,
      }),
    };
    
    const result = await fetchApi(searchUrl, options).then(response => response.json());
    const body = await result.json();
    const decryptedData = decrypt(body.data);
    const jsonData = JSON.parse(decryptedData);
    const loadedCheerio = parseHTML(jsonData);
    return this.parseNovels(loadedCheerio);
  }

  filters = {
    categories: {
      value: [],
      label: 'التصنيفات',
      options: [
        { label: 'Wuxia', value: 'Wuxia' },
        { label: 'Xianxia', value: 'Xianxia' },
        { label: 'XUANHUAN', value: 'XUANHUAN' },
        { label: 'أصلية', value: 'أصلية' }, // Original
        { label: 'أكشن', value: 'أكشن' }, // Action
        { label: 'إثارة', value: 'إثارة' }, // Thriller
        { label: 'إنتقال الى عالم أخر', value: 'إنتقال+الى+عالم+أخر' }, // Isekai
        { label: 'إيتشي', value: 'إيتشي' }, // Ecchi
        { label: 'الخيال العلمي', value: 'الخيال+العلمي' }, // Science Fiction
        { label: 'بوليسي', value: 'بوليسي' }, // Detective
        { label: 'تاريخي', value: 'تاريخي' }, // Historical
        { label: 'تقمص شخصيات', value: 'تقمص+شخصيات' }, // Roleplaying
        { label: 'جريمة', value: 'جريمة' }, // Crime
        { label: 'جوسى', value: 'جوسى' }, // Josei
        { label: 'حريم', value: 'حريم' }, // Harem
        { label: 'حياة مدرسية', value: 'حياة+مدرسية' }, // School Life
        { label: 'خارقة للطبيعة', value: 'خارقة+للطبيعة' }, // Supernatural
        { label: 'خيالي', value: 'خيالي' }, // Fantasy
        { label: 'دراما', value: 'دراما' }, // Drama
        { label: 'رعب', value: 'رعب' }, // Horror
        { label: 'رومانسي', value: 'رومانسي' }, // Romance
        { label: 'سحر', value: 'سحر' }, // Magic
        { label: 'سينن', value: 'سينن' }, // Seinen
        { label: 'شريحة من الحياة', value: 'شريحة+من+الحياة' }, // Slice of Life
        { label: 'شونين', value: 'شونين' }, // Shounen
        { label: 'غموض', value: 'غموض' }, // Mystery
        { label: 'فنون القتال', value: 'فنون+القتال' }, // Martial Arts
        { label: 'قوى خارقة', value: 'قوى+خارقة' }, // Super Powers
        { label: 'كوميدى', value: 'كوميدى' }, // Comedy
        { label: 'مأساوي', value: 'مأساوي' }, // Tragedy
        { label: 'ما بعد الكارثة', value: 'ما+بعد+الكارثة' }, // Post-Apocalypse
        { label: 'مغامرة', value: 'مغامرة' }, // Adventure
        { label: 'ميكا', value: 'ميكا' }, // Mecha
        { label: 'ناضج', value: 'ناضج' }, // Mature
        { label: 'نفسي', value: 'نفسي' }, // Psychological
        { label: 'فانتازيا', value: 'فانتازيا' }, // Fantasy
        { label: 'رياضة', value: 'رياضة' }, // Sports
        { label: 'ابراج', value: 'ابراج' }, // Astrology
        { label: 'الالهة', value: 'الالهة' }, // Deities
        { label: 'شياطين', value: 'شياطين' }, // Demons
        { label: 'السفر عبر الزمن', value: 'السفر+عبر+الزمن' }, // Time Travel
        { label: 'رواية صينية', value: 'رواية+صينية' }, // Chinese Novel
        { label: 'رواية ويب', value: 'رواية+ويب' }, // Web Novel
        { label: 'لايت نوفل', value: 'لايت+نوفل' }, // Light Novel
        { label: 'كوري', value: 'كوري' }, // Korean
        { label: '+18', value: '%2B18' }, // +18
        { label: 'إيسكاي', value: 'إيسكاي' }, // Isekai
        { label: 'ياباني', value: 'ياباني' }, // Japanese
        { label: 'مؤلفة', value: 'مؤلفة' }, // Authored
      ],
      type: FilterTypes.CheckboxGroup,
    },
    status: {
      value: '',
      label: 'الحالة',
      options: [
        { label: 'جميع الروايات', value: '' },
        { label: 'مكتمل', value: 'Completed' },
        { label: 'جديد', value: 'New' },
        { label: 'مستمر', value: 'Ongoing' },
      ],
      type: FilterTypes.Picker,
    },
  } satisfies Filters;
}

export default new Sunovels();

interface ChapterEntry {
  chapterName: string;
  chapterUrl: string;
  releaseTime: string;
  chapterNumber: string | number;
}
interface Uploader {
  id: number;
  nick: string;
  rev_links: any[];
  admob_rewarded_tag_ios: string | null;
  admob_rewarded_tag_android: string | null;
}

interface Team {
  id: number;
  name: string;
  rating: number;
  settings: Record<string, unknown>;
  paypal: string | null;
}

interface CoverBlurhash {
  hash: string;
  width: number;
  height: number;
}

interface BannerBlurhash {
  hash: string;
  width: number;
  height: number;
}

interface Category {
  id: number;
  name: string;
  icon: string | null;
  manga_id: number;
}

interface Type {
  id: number;
  name: string;
  reading_direction: string;
  title: string;
}

interface Manga {
  id: number;
  title: string;
  summary: string;
  is_novel: boolean;
  is_oneshot: boolean;
  genre_id: number;
  cover: string;
  cover_pos: number;
  rectangle_cover_pos: number;
  cover_blurhash: CoverBlurhash;
  banner: string;
  banner_blurhash: BannerBlurhash;
  manga_type_id: number;
  reading_direction: string;
  story_status: number;
  translation_status: number;
  vols: number;
  chaps: number;
  reviewed: boolean;
  banned: boolean;
  rating: string;
  rates_count: number;
  commentable: boolean;
  show_comments: boolean;
  deleted_at: string | null;
  delete_reason: string;
  time_stamp: number;
  latest_chapterization_id: number;
  uniq_visitors_count: number;
  publisher_id: number | null;
  publisher_name: string | null;
  discord_url: string | null;
  mobile_exclusive: boolean;
  authors: any[];
  artists: any[];
  categories: Category[];
  type: Type;
}

interface Release {
  id: number;
  manga_id: number;
  created_at: string;
  time_stamp: number;
  views: number;
  encoded: boolean;
  showable: boolean;
  link_control: number;
  support_link: string;
  creator_id: number;
  chapterization_id: number;
  chapter: number;
  volume: number;
  title: string;
  team_id: number;
  team_name: string;
  team_rating: string;
  team_settings: string;
  team_paypal: string | null;
  uploader: Uploader;
  has_rev_link: boolean;
  teams: Team[];
  manga: Manga;
}

interface ApiResponse {
  releases: Release[];
}

type MangaLibrary = {
  reading: number;
  completed: number;
  on_hold: number;
  dropped: number;
  planning: number;
  plan_to_read: number;
  favorite: number;
  suggestion: number;
};

type MangaCategory = {
  id: number;
  name: string;
  icon: string | null;
  manga_id: number;
};

type MangaBlurhash = {
  hash: string;
  width: number;
  height: number;
};

type AuthorArtist = {
  id: number;
  name: string;
  manga_id: number;
  role: string;
};

type MangaType = {
  id: number;
  name: string;
  reading_direction: string;
  title: string;
};

type MangaData = {
  id: number;
  title: string;
  summary: string;
  is_novel: boolean;
  is_oneshot: boolean;
  genre_id: number;
  cover: string;
  cover_pos: number;
  rectangle_cover_pos: number;
  cover_blurhash: MangaBlurhash;
  banner: string;
  banner_blurhash: MangaBlurhash;
  manga_type_id: number;
  reading_direction: string;
  story_status: number;
  translation_status: number;
  vols: number;
  chaps: number;
  reviewed: boolean;
  banned: boolean;
  rating: string;
  rates_count: number;
  commentable: boolean;
  show_comments: boolean;
  deleted_at: string | null;
  delete_reason: string | null;
  time_stamp: number;
  latest_chapterization_id: number;
  uniq_visitors_count: number;
  publisher_id: number | null;
  publisher_name: string | null;
  arabic_title: string;
  english: string;
  synonyms: string;
  japanese: string;
  over17: boolean;
  s_date: string;
  e_date: string | null;
  mal: string;
  mangaupdates: string;
  mangadex: string | null;
  anilist: string;
  official_site: string | null;
  manga_fox: string | null;
  wikia: string | null;
  mangarock_oid: string | null;
  comicvine_id: string | null;
  external_source: string | null;
  discord_url: string | null;
  discord_id: string | null;
  anime_start_end: string | null;
  creator_id: number;
  creator_nick: string;
  editor_id: number;
  editor_nick: string;
  mobile_exclusive: boolean;
  authors: AuthorArtist[];
  artists: AuthorArtist[];
  categories: MangaCategory[];
  type: MangaType;
  memberRating: number;
};

type MangaResponse = {
  mangaLibrary: MangaLibrary;
  membersMentioning: any[];
  memberRates: any | null;
  mangaLogs: Record<string, any>;
  mangaData: MangaData;
};
type ChapterRelease = {
  id: number;
  manga_id: number;
  created_at: string; // ISO 8601 date string
  time_stamp: number;
  views: number;
  link_control: number;
  support_link: string;
  init_team: number;
  creator_id: number;
  chapterization_id: number;
  chapterization_time_stamp: number;
  chapter: number;
  volume: number;
  title: string;
  team_id: number;
  team_name: string;
  uploader: Uploader;
  has_rev_link: boolean;
  teams: Team[];
};

type ChapterResponse = {
  releases: ChapterRelease[];
};