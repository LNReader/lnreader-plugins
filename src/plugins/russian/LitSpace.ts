import { Plugin } from '@typings/plugin';
import { FilterTypes, Filters } from '@libs/filterInputs';
import { defaultCover } from '@libs/defaultCover';
import { fetchApi } from '@libs/fetch';
import dayjs from 'dayjs';

const headers: any = {
  'Content-Type': 'application/json',
  'X-Inertia': true,
  'X-Inertia-Version': '6666cd76f96956469e7be39d750cc7d9',
};

class freedlit implements Plugin.PluginBase {
  id = 'freedlit.space';
  name = 'LitSpace';
  site = 'https://freedlit.space';
  version = '1.1.0';
  icon = 'src/ru/freedlit/icon.png';

  async popularNovels(
    page: number,
    {
      showLatestNovels,
      filters,
    }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    let url = this.site + '/get-books/?sort=';
    url += showLatestNovels ? 'recent' : filters?.sort?.value || 'popular';
    url += '&access=' + (filters?.access?.value || 'all');
    url += '&hideAdult=' + (filters?.hideAdult?.value || false);
    url += '&page=' + page;

    const { books }: { books: Books } = await fetchApi(url).then(res =>
      res.json(),
    );

    const novels: Plugin.NovelItem[] = [];

    books.data.forEach(novel =>
      novels.push({
        name: novel.title,
        cover: novel.cover
          ? this.site + '/storage/' + novel.cover
          : defaultCover,
        path: novel.item_id.toString(),
      }),
    );

    return novels;
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const {
      props: { book },
    }: { props: { book: DataEntity } } = await fetchApi(
      this.resolveUrl(novelPath, true),
      {
        method: 'post',
        headers,
        Referer: this.site,
      },
    ).then(res => res.json());

    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: book.title,
      cover: book.cover ? this.site + '/storage/' + book.cover : defaultCover,
      summary: book.annotation,
      author: book.authors_names?.[0]?.name || '',
      genres: book.tags?.map?.(tags => tags.name)?.join?.(', ') || '',
    };

    const { succes }: { succes: { items: chaptersData[] } } = await fetchApi(
      this.site + '/api/bookpage/get-chapters',
      {
        method: 'post',
        headers,
        Referer: this.resolveUrl(novelPath),
        body: JSON.stringify({ book_id: novelPath }),
      },
    ).then(res => res.json());
    const chapters: Plugin.ChapterItem[] = [];

    if (succes?.items?.length) {
      succes.items.forEach((chapter, chapterIndex) =>
        chapters.push({
          name: chapter.header,
          path: novelPath + '/' + chapter.id,
          releaseTime: dayjs(chapter.first_published_formated).format('LL'),
          chapterNumber: chapterIndex + 1,
        }),
      );
    }

    novel.chapters = chapters;
    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const [book_id, chapter_id] = chapterPath.split('/');
    const { succes }: { succes: chapterContent } = await fetchApi(
      this.site + '/api/bookpage/get-chapters',
      {
        method: 'post',
        headers,
        Referer: this.resolveUrl(chapterPath),
        body: JSON.stringify({ book_id, chapter_id }),
      },
    ).then(res => res.json());

    const chapterText = succes.content;
    return chapterText;
  }

  async searchNovels(searchTerm: string): Promise<Plugin.NovelItem[]> {
    return [];
  }

  resolveUrl = (path: string, isNovel?: boolean) =>
    this.site + (isNovel ? '/book/' : '/reader/') + path;

  filters = {
    sort: {
      label: 'Сортировка:',
      value: 'popular',
      options: [
        { label: 'По популярности', value: 'popular' },
        { label: 'последние обновления', value: 'updated' },
        { label: 'По новизне', value: 'recent' },
        { label: 'По просмотрам', value: 'views' },
        { label: 'По количеству лайков', value: 'likes' },
      ],
      type: FilterTypes.Picker,
    },
    access: {
      label: 'Доступ:',
      value: 'all',
      options: [
        { label: 'Любой доступ', value: 'all' },
        { label: 'Бесплатные', value: 'free' },
        { label: 'Платные', value: 'paid' },
      ],
      type: FilterTypes.Picker,
    },
    hideAdult: {
      label: 'Скрыть 18+',
      value: true,
      type: FilterTypes.Switch,
    },
  } satisfies Filters;
}

export default new freedlit();

interface Books {
  current_page: number;
  data: DataEntity[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url?: null;
  to: number;
  total: number;
}
interface DataEntity {
  id: number;
  item_id: number;
  type: string;
  form_id: number;
  title: string;
  authors: string;
  cover: string;
  access: string;
  language: string;
  rating: number;
  intermediate_rating?: number;
  first_published: string;
  chapter_updated_at: string;
  adults: number;
  exclusive: number;
  status: number;
  total_views: number;
  total_likes: number;
  show_main_widget: number;
  is_audio: boolean;
  authors_names?: AuthorsNamesEntity[];
  client_price?: number | null;
  client_discount?: null;
  seriesBook: boolean;
  series_title: string;
  main_author_link: string;
  publisher_link?: null;
  published_chapters_total: number;
  total_characters: string;
  total_author_sheet: number;
  total_critics: number;
  total_recommendations: number;
  form_name: string;
  genres?: GenresEntity[] | null;
  tags?: TagsEntity[];
  series_book_num: number;
  series_book_id?: number | null;
  annotation: string;
  total_comments: number;
  total_libraries: number;
}
interface AuthorsNamesEntity {
  id: number;
  url: string;
  name: string;
  type: string;
}
interface GenresEntity {
  id: number;
}
interface TagsEntity {
  id: number;
  name: string;
}

interface chaptersData {
  id: number;
  header: string;
  first_published_formated: string;
  intro_snippet_end: number;
}

interface chapterContent {
  id: number;
  book_id: number;
  header: string;
  content: string;
  number: number;
  user_files?: null;
  intro_snippet_end: number;
  status: number;
  first_published: number;
  auto_publication?: null;
  first_published_at?: null;
  is_chapter_avalaible: boolean;
  total_characters: number;
  total_characters_clear: string;
}
