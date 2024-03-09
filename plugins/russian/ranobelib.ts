import { Plugin } from "@typings/plugin";
import { FilterTypes, Filters } from "@libs/filterInputs";
import { defaultCover } from "@libs/defaultCover";
import { fetchApi, fetchFile } from "@libs/fetch";
import { NovelStatus } from "@libs/novelStatus";
import dayjs from "dayjs";

const statusKey: { [key: number]: string } = {
  1: NovelStatus.Ongoing,
  2: NovelStatus.Completed,
  3: NovelStatus.OnHiatus,
  4: NovelStatus.Cancelled,
};

class RLIB implements Plugin.PluginBase {
  id = "RLIB";
  name = "RanobeLib";
  site = "https://test-front.ranobelib.me";
  apiSite = "https://api.lib.social/api/manga/";
  version = "2.0.0";
  icon = "src/ru/ranobelib/icon.png";
  ui: string | undefined = undefined;

  async fetchNovels(
    page: number,
    {
      filters,
      showLatestNovels,
    }: Plugin.PopularNovelsOptions,
  ): Promise<Plugin.NovelItem[]> {
    console.log(filters);
    let url = this.apiSite + "?site_id[0]=3";

    if (showLatestNovels) {
      if (filters?.sort_by?.value) filters.sort_by.value = "last_chapter_at";
    }

    for (const key in filters) {
      if (filters[key].type === FilterTypes.Picker) {
        url += "&" + key + "=" + filters[key].value;
      } else if (filters[key].type === FilterTypes.Switch) {
        url += "&" + key + "=1";
      } else if (
        filters[key].type === FilterTypes.CheckboxGroup &&
        (filters[key].value as string[]).length
      ) {
        url += "&" + key + "[]=" +
          (filters[key].value as string[]).join("&" + key + "[]=");
      } else if (filters[key].type === FilterTypes.ExcludableCheckboxGroup) {
        if ((filters[key] as any).include.length) {
          url += "&" + key + "[]=" +
            (filters[key] as any).include.join("&" + key + "[]=");
        }
        if ((filters[key] as any).exclude.length) {
          url += "&" + key + "_exclude[]=" +
            (filters[key] as any).exclude.join("&" + key + "_exclude[]=");
        }
      }
    }

    const result: TopLevel = await fetchApi(url).then((res) => res.json());
    const novels: Plugin.NovelItem[] = [];
    if (result.data instanceof Array) {
      result.data.forEach((novel) =>
        novels.push({
          name: novel.rus_name || novel.eng_name || novel.name,
          cover: novel.cover?.default || defaultCover,
          path: novel.slug_url || novel.id + "--" + novel.slug,
        }),
      );
    }
    return novels;
  }

  popularNovels = this.fetchNovels;

  async searchNovels(
    searchTerm: string,
    page: number,
  ): Promise<Plugin.NovelItem[]> {
    const defaultOptions: any = {
      filters: {
        q: { value: searchTerm, type: FilterTypes.Picker },
      },
      showLatestNovels: false,
    };
    return this.fetchNovels(page, defaultOptions);
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const { data }: { data: DataClass } = await fetchApi(
      this.apiSite +
        novelPath +
        "?fields[]=summary&fields[]=genres&fields[]=tags&fields[]=teams&fields[]=authors&fields[]=status_id&fields[]=artists",
    ).then((res) => res.json());

    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: data.rus_name || data.name,
      cover: data.cover?.default || defaultCover,
      summary: data.summary,
    };

    if (data.status?.id) {
      novel.status = statusKey[data.status.id] || NovelStatus.Unknown;
    }

    if (data.authors?.length) {
      novel.author = data.authors[0].name;
    }
    if (data.artists?.length) {
      novel.artist = data.artists[0].name;
    }

    const genres = [data.genres || [], data.tags || []].flat();
    if (genres.length) {
      novel.genres = genres.map((genres) => genres.name).join(", ");
    }

    const branch_id: { [key: number]: string } = {};
    if (data.teams.length) {
      data.teams.forEach(
        ({ name, details }) => (branch_id[details?.branch_id || "0"] = name),
      );
    }

    const chaptersRaw = await fetchApi(this.apiSite + novelPath + "/chapters");
    const chaptersJSON = (await chaptersRaw.json()) as any;
    if (chaptersJSON.data.length) {
      const chapters: Plugin.ChapterItem[] = [];

      chaptersJSON.data.forEach((chapter: any) =>
        chapters.push({
          name:
            "Том " + chapter.volume +
            " Глава " + chapter.number +
            (chapter.name ? " " + chapter.name : ""),
          path:
            novelPath + "/" +
            chapter.volume + "/" +
            chapter.number + "/" +
            (chapter.branches[0]?.branch_id || ""),
          releaseTime: dayjs(chapter.branches[0].created_at).format("LLL"),
          chapterNumber: chapter.index,
          page: branch_id[chapter.branches[0].branch_id || "0"],
        }),
      );
      novel.chapters = chapters.reverse();
    }

    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const [slug, volume, number, branch_id] = chapterPath.split("/");
    let chapterText = "";

    if (slug && volume && number) {
      const result: { data: DataClass } = await fetchApi(
        this.apiSite + slug + "/chapter?" +
          (branch_id ? "branch_id=" + branch_id + "&" : "") +
          "volume=" + volume +
          "&number=" + number,
      ).then((res) => res.json());
      chapterText = result?.data?.content || "";
    }
    return chapterText;
  }

  fetchImage = fetchFile;
  resolveUrl = (path: string, isNovel?: boolean) => {
    if (isNovel) return this.site + "/ru/manga/" + path;
    const [slug, volume, number, branch_id] = path.split("/");

    const chapterPath = slug + "/read/v" + volume + "/c" + number +
      (branch_id ? "?bid=" + branch_id : "");

    return this.site + "/ru/" + chapterPath;
  };

  filters = {
    sort_by: {
      label: "Сортировка", 
      value: "rate",
      options: [
        { label: "По рейтингу", value: "rate_avg" },
        { label: "По популярности", value: "rating_score" },
        { label: "По просмотрам", value: "views" },
        { label: "Количеству глав", value: "chap_count" },
        { label: "Дате обновления", value: "last_chapter_at" },
        { label: "Дате добавления", value: "created_at" },
        { label: "По названию (A-Z)", value: "name" },
        { label: "По названию (А-Я)", value: "rus_name" },
      ],
      type: FilterTypes.Picker,
    },
    order: {
      label: "Порядок",
      value: "sort_type",
      options: [
        { label: "По убыванию", value: "desc" },
        { label: "По возрастанию", value: "asc" },
      ],
      type: FilterTypes.Picker,
    },
    types: {
      label: "Тип",
      value: [],
      options: [
        { label: "Неизвестный", value: "0" },
        { label: "Япония", value: "10" },
        { label: "Корея", value: "11" },
        { label: "Китай", value: "12" },
        { label: "Английский", value: "13" },
        { label: "Авторский", value: "14" },
        { label: "Фанфик", value: "15" },
      ],
      type: FilterTypes.CheckboxGroup,
    },
    scanlateStatus: {
      label: "Статус перевода",
      value: [],
      options: [
        { label: "Продолжается", value: "1" },
        { label: "Завершен", value: "2" },
        { label: "Заморожен", value: "3" },
        { label: "Заброшен", value: "4" },
      ],
      type: FilterTypes.CheckboxGroup,
    },
    manga_status: {
      label: "Статус тайтла",
      value: [],
      options: [
        { label: "Онгоинг", value: "1" },
        { label: "Завершён", value: "2" },
        { label: "Анонс", value: "3" },
        { label: "Приостановлен", value: "4" },
        { label: "Выпуск прекращён", value: "5" },
      ],
      type: FilterTypes.CheckboxGroup,
    },
    genres: {
      label: "Жанры",
      value: { include: [], exclude: [] },
      options: [
        { label: "Арт", value: "32" },
        { label: "Безумие", value: "91" },
        { label: "Боевик", value: "34" },
        { label: "Боевые искусства", value: "35" },
        { label: "Вампиры", value: "36" },
        { label: "Военное", value: "89" },
        { label: "Гарем", value: "37" },
        { label: "Гендерная интрига", value: "38" },
        { label: "Героическое фэнтези", value: "39" },
        { label: "Демоны", value: "81" },
        { label: "Детектив", value: "40" },
        { label: "Детское", value: "88" },
        { label: "Дзёсэй", value: "41" },
        { label: "Драма", value: "43" },
        { label: "Игра", value: "44" },
        { label: "Исекай", value: "79" },
        { label: "История", value: "45" },
        { label: "Киберпанк", value: "46" },
        { label: "Кодомо", value: "76" },
        { label: "Комедия", value: "47" },
        { label: "Космос", value: "83" },
        { label: "Магия", value: "85" },
        { label: "Махо-сёдзё", value: "48" },
        { label: "Машины", value: "90" },
        { label: "Меха", value: "49" },
        { label: "Мистика", value: "50" },
        { label: "Музыка", value: "80" },
        { label: "Научная фантастика", value: "51" },
        { label: "Омегаверс", value: "77" },
        { label: "Пародия", value: "86" },
        { label: "Повседневность", value: "52" },
        { label: "Полиция", value: "82" },
        { label: "Постапокалиптика", value: "53" },
        { label: "Приключения", value: "54" },
        { label: "Психология", value: "55" },
        { label: "Романтика", value: "56" },
        { label: "Самурайский боевик", value: "57" },
        { label: "Сверхъестественное", value: "58" },
        { label: "Сёдзё", value: "59" },
        { label: "Сёдзё-ай", value: "60" },
        { label: "Сёнэн", value: "61" },
        { label: "Сёнэн-ай", value: "62" },
        { label: "Спорт", value: "63" },
        { label: "Супер сила", value: "87" },
        { label: "Сэйнэн", value: "64" },
        { label: "Трагедия", value: "65" },
        { label: "Триллер", value: "66" },
        { label: "Ужасы", value: "67" },
        { label: "Фантастика", value: "68" },
        { label: "Фэнтези", value: "69" },
        { label: "Хентай", value: "84" },
        { label: "Школа", value: "70" },
        { label: "Эротика", value: "71" },
        { label: "Этти", value: "72" },
        { label: "Юри", value: "73" },
        { label: "Яой", value: "74" },
      ],
      type: FilterTypes.ExcludableCheckboxGroup,
    },
    tags: {
      label: "Теги",
      value: { include: [], exclude: [] },
      options: [
        { label: "Авантюристы", value: "328" },
        { label: "Антигерой", value: "175" },
        { label: "Бессмертные", value: "333" },
        { label: "Боги", value: "218" },
        { label: "Борьба за власть", value: "309" },
        { label: "Брат и сестра", value: "360" },
        { label: "Ведьма", value: "339" },
        { label: "Видеоигры", value: "204" },
        { label: "Виртуальная реальность", value: "214" },
        { label: "Владыка демонов", value: "349" },
        { label: "Военные", value: "198" },
        { label: "Воспоминания из другого мира", value: "310" },
        { label: "Выживание", value: "212" },
        { label: "ГГ женщина", value: "294" },
        { label: "ГГ имба", value: "292" },
        { label: "ГГ мужчина", value: "295" },
        { label: "ГГ не ояш", value: "325" },
        { label: "ГГ не человек", value: "331" },
        { label: "ГГ ояш", value: "326" },
        { label: "Главный герой бог", value: "324" },
        { label: "Глупый ГГ", value: "298" },
        { label: "Горничные", value: "171" },
        { label: "Гуро", value: "306" },
        { label: "Гяру", value: "197" },
        { label: "Демоны", value: "157" },
        { label: "Драконы", value: "313" },
        { label: "Древний мир", value: "317" },
        { label: "Зверолюди", value: "163" },
        { label: "Зомби", value: "155" },
        { label: "Исторические фигуры", value: "323" },
        { label: "Кулинария", value: "158" },
        { label: "Культивация", value: "161" },
        { label: "ЛГБТ", value: "344" },
        { label: "ЛитРПГ", value: "319" },
        { label: "Лоли", value: "206" },
        { label: "Магия", value: "170" },
        { label: "Машинный перевод", value: "345" },
        { label: "Медицина", value: "159" },
        { label: "Межгалактическая война", value: "330" },
        { label: "Монстр Девушки", value: "207" },
        { label: "Монстры", value: "208" },
        { label: "Мрачный мир", value: "316" },
        { label: "Музыка", value: "358" },
        { label: "Музыка", value: "209" },
        { label: "Ниндзя", value: "199" },
        { label: "Обратный Гарем", value: "210" },
        { label: "Офисные Работники", value: "200" },
        { label: "Пираты", value: "341" },
        { label: "Подземелья", value: "314" },
        { label: "Политика", value: "311" },
        { label: "Полиция", value: "201" },
        { label: "Преступники / Криминал", value: "205" },
        { label: "Призраки / Духи", value: "196" },
        { label: "Призыватели", value: "329" },
        { label: "Прыжки между мирами", value: "321" },
        { label: "Путешествие в другой мир", value: "318" },
        { label: "Путешествие во времени", value: "213" },
        { label: "Рабы", value: "355" },
        { label: "Ранги силы", value: "312" },
        { label: "Реинкарнация", value: "154" },
        { label: "Самураи", value: "202" },
        { label: "Скрытие личности", value: "315" },
        { label: "Средневековье", value: "174" },
        { label: "Традиционные игры", value: "203" },
        { label: "Умный ГГ", value: "303" },
        { label: "Характерный рост", value: "332" },
        { label: "Хикикомори", value: "167" },
        { label: "Эволюция", value: "322" },
        { label: "Элементы РПГ", value: "327" },
        { label: "Эльфы", value: "217" },
        { label: "Якудза", value: "165" },
      ],
      type: FilterTypes.ExcludableCheckboxGroup,
    },
    "chapters[min]": {
      label: "Только проекты с главами",
      value: true,
      type: FilterTypes.Switch,
    },
  } satisfies Filters;
}

export default new RLIB();

interface TopLevel {
  data: DataClass | DataClass[];
  links?: Links;
  meta?: Meta;
}

interface AgeRestriction {
  id: number;
  label: string;
}

interface Branch {
  id: number;
  branch_id: null;
  created_at: string;
  teams: BranchTeam[];
  user: User;
}

interface BranchTeam {
  id: number;
  slug: string;
  slug_url: string;
  model: string;
  name: string;
  cover: Cover;
}

interface Cover {
  filename: null | string;
  thumbnail: string;
  default: string;
}

interface User {
  username: string;
  id: number;
}

interface Rating {
  average: string;
  votes: number;
  votesFormated: string;
}

interface DataClass {
  id: number;
  name: string;
  rus_name?: string;
  eng_name?: string;
  slug: string;
  slug_url?: string;
  cover?: Cover;
  ageRestriction?: AgeRestriction;
  site?: number;
  type: AgeRestriction | string;
  summary?: string;
  is_licensed?: boolean;
  teams: DataTeam[];
  genres?: Genre[];
  tags?: Genre[];
  authors?: Artist[];
  model?: string;
  status?: AgeRestriction;
  scanlateStatus?: AgeRestriction;
  artists?: Artist[];
  releaseDateString?: string;
  volume?: string;
  number?: string;
  number_secondary?: string;
  branch_id?: null;
  manga_id?: number;
  created_at?: string;
  moderated?: AgeRestriction;
  likes_count?: number;
  content?: string;
  attachments?: Attachment[];
}

interface Artist {
  id: number;
  slug: string;
  slug_url: string;
  model: string;
  name: string;
  rus_name: null;
  alt_name: null;
  cover: Cover;
  subscription: Subscription;
  confirmed: null;
  user_id: number;
  titles_count_details: null;
}

interface Subscription {
  is_subscribed: boolean;
  source_type: string;
  source_id: number;
  relation: null;
}

interface Attachment {
  id: null;
  filename: string;
  name: string;
  extension: string;
  url: string;
  width: number;
  height: number;
}

interface Genre {
  id: number;
  name: string;
}

interface DataTeam {
  id: number;
  slug: string;
  slug_url: string;
  model: string;
  name: string;
  cover: Cover;
  details?: Details;
  vk?: string;
  discord?: null;
}

interface Details {
  branch_id: null;
  is_active: boolean;
  subscriptions_count: null;
}

interface Links {
  first: string;
  last: null;
  prev: null;
  next: string;
}

interface Meta {
  current_page?: number;
  from?: number;
  path?: string;
  per_page?: number;
  to?: number;
  page?: number;
  has_next_page?: boolean;
  seed?: string;
  country?: string;
}
