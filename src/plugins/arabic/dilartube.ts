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

class dilartube implements Plugin.PluginBase {
  id = 'dilartube';
  name = 'dilar tube';
  version = '1.0.0';
  icon = 'src/ar/sunovels/icon.png';
  site = 'https://dilar.tube/';

  parseNovels(data: ApiResponse): Plugin.NovelItem[] {
    const novels: Plugin.NovelItem[] = [];
    const seenTitles = new Set<string>();
    data.releases
    .filter((release) => release.manga.is_novel)
    .map((release) => {
      const manga = release.manga;
      if (!seenTitles.has(manga.title)) {
        seenTitles.add(manga.title);
      novels.push({
        name: manga.title,  
        path: `mangas/${manga.id}`,  
        cover: `${this.site}uploads/manga/cover/${manga.id}/${manga.cover}`,  
      });
    }});
    return novels;
  }

  async popularNovels(
    page: number,
    { showLatestNovels, filters }: Plugin.PopularNovelsOptions<Filters>,
  ): Promise<Plugin.NovelItem[]> {
    let link = `${this.site}releases`;
    if (showLatestNovels){
      link = `${this.site}/api/releases`;
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
    link += `?page=${page}`;
    // const body = await fetchApi(link).then(r => r.text());
    const response = await fetchApi(link).then(r => r.json());
    console.log(response)
    return this.parseNovels(response);
  }

  async parseNovel(novelUrl: string): Promise<Plugin.SourceNovel> {
    const chapterItems: Plugin.ChapterItem[] = [];
    let fullUrl = this.site + 'api/' + novelUrl;
    let chapterUrl = this.site + 'api/' + novelUrl + '/releases'
    const manga = await fetchApi(fullUrl).then(r => r.json());
    const chapters = await fetchApi(chapterUrl).then(r => r.json());
    const mangaData = manga.mangaData;
    const chapterData = chapters.releases
  
    const novel: Plugin.SourceNovel = {
      path: novelUrl,
      name: mangaData.arabic_title || 'Untitled',
      author: (mangaData.authors.length > 0 ? mangaData.authors[0].name : '') || 'Unknown',
      summary: mangaData.summary || '',
      cover: `${this.site}uploads/manga/cover/${mangaData.id}/${mangaData.cover}`,
      chapters: [],
    };
  
    // Status and genres
    const translationStatusId:string = mangaData.translation_status;
    const translationText = {
      '1': 'مستمره',
      '0': 'منتهية',
      '2': 'متوقفة',
      '3': 'غير مترجمه',
    }[translationStatusId] || 'غير معروف';
    const statusWords = new Set(['مكتمل', 'جديد', 'مستمر']);
    const mainGenres = mangaData.categories.map(category => category.name).join(',');
    novel.genres = `${translationText},${mainGenres}`;
    
    const statusId:string = mangaData.story_status;
    const statusText = {
      '2': 'Ongoing',
      '3': 'Completed',
    }[statusId] || 'Unknown';
    novel.status = statusText
    chapterData.map((item: ChapterRelease) => {
      chapterItems.push({
        name: item.title,
        releaseTime: new Date(item.created_at).toISOString(),
        path: `${novelUrl}/${mangaData.title.replace(' ','-')}/${item.chapter}`,
        chapterNumber: item.chapter,
      });
    });
    novel.chapters = chapterItems.reverse();
    return novel;
  }
  async parseChapter(chapterUrl: string): Promise<string> {
    const result = await fetchApi(new URL(chapterUrl, this.site).toString());
    const body = await result.text();
    const loadedCheerio = parseHTML(body);
    const chapterText = loadedCheerio('div.reader-content').text().trim();
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
        Referer: `${this.site}/`
      },
      mode: 'cors',
      body: JSON.stringify({
        title: searchTerm,
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

    return this.parseNovels(jsonData);
  }

  filters = {
    types: {
    value: [],
    label: 'الأنواع',
    options: [
      { label: 'يابانية', value: '1' }, // Japanese
      { label: 'كورية', value: '2' }, // Korean
      { label: 'صينية', value: '3' }, // Chinese
      { label: 'عربية', value: '4' }, // Arabic
      { label: 'كوميك', value: '5' }, // Comic
      { label: 'هواة', value: '6' }, // Amateur
      { label: 'إندونيسية', value: '7' }, // Indonesian
      { label: 'روسية', value: '8' }, // Russian
    ],
    type: FilterTypes.CheckboxGroup,
  },

  status: {
    value: '',
    label: 'الحالة',
    options: [
      { label: 'مستمرة', value: '2' }, // Ongoing
      { label: 'منتهية', value: '3' }, // Completed
    ],
    type: FilterTypes.CheckboxGroup,
  },
  
  translation: {
    value: [],
    label: 'الترجمة',
    options: [
      { label: 'منتهية', value: '0' }, // Completed
      { label: 'مستمرة', value: '1' }, // Ongoing
      { label: 'متوقفة', value: '2' }, // Paused
      { label: 'غير مترجمة', value: '3' }, // Not Translated
    ],
    type: FilterTypes.CheckboxGroup,
  },
  } satisfies Filters;
}

export default new dilartube();


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
  banner: string;
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
  has_rev_link: boolean;
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
  has_rev_link: boolean;
};

type ChapterResponse = {
  releases: ChapterRelease[];
};
