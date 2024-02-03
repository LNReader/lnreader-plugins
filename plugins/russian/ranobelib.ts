import { Plugin } from "@typings/plugin";
import { FilterTypes, Filters } from "@libs/filterInputs";
import { fetchApi, fetchFile } from "@libs/fetch";
import { NovelStatus } from "@libs/novelStatus";
import { load as parseHTML } from "cheerio";
import dayjs from "dayjs";

const statusKey = [
  NovelStatus.Ongoing,
  NovelStatus.Completed,
  NovelStatus.OnHiatus,
  NovelStatus.Cancelled,
];

class RLIB implements Plugin.PluginBase {
  id = "RLIB";
  name = "RanobeLib";
  site = "https://ranobelib.me";
  version = "1.0.0";
  icon = "src/ru/ranobelib/icon.png";
  ui: string | undefined = undefined;

  async popularNovels(
    pageNo: number,
    { showLatestNovels, filters }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    let url = this.site + "/manga-list?sort=";
    url += showLatestNovels ? "last_chapter_at" : filters?.sort?.value || "rate";
    url += "&dir=" + (filters?.order?.value || "desc");

    Object.entries(filters || {}).forEach(([type, { value }]: any) => {
      if (value instanceof Array && value.length) {
        url += "&" + type + "[]=" + value.join("&" + type + "[]=");
      }
      if (value?.include instanceof Array && value.include.length) {
        url += "&" + type + "[include][]=" + 
          value.include.join("&" + type + "[include][]=");
      } 
      if (value?.exclude instanceof Array && value.exclude.length) {
        url += "&" + type + "[exclude][]=" + 
          value.exclude.join("&" + type + "[exclude][]=");
      }
    });

    url += "&page=" + pageNo;

    const result = await fetchApi(url).then((res) => res.text());
    const loadedCheerio = parseHTML(result);
    this.ui = loadedCheerio("a.header-right-menu__item")
      .attr("href")
      ?.replace?.(/[^0-9]/g, "");

    const novels: Plugin.NovelItem[] = [];
    loadedCheerio(".media-card-wrap").each(function () {
      const name = loadedCheerio(this).find(".media-card__title").text();
      const cover = loadedCheerio(this).find("a.media-card").attr("data-src");
      const url = loadedCheerio(this).find("a.media-card").attr("href");
      if (!url) return;
      novels.push({ name, cover, url });
    });

    return novels;
  }

  async parseNovelAndChapters(novelUrl: string): Promise<Plugin.SourceNovel> {
    const body = await fetchApi(novelUrl).then((res) => res.text());
    const loadedCheerio = parseHTML(body);

    const novel: Plugin.SourceNovel = {
      url: novelUrl,
    };

    novel.name = loadedCheerio(".media-name__main").text().trim();

    novel.cover = loadedCheerio(".container_responsive img").attr("src");

    novel.summary = loadedCheerio(".media-description__text").text().trim();

    novel.genres = loadedCheerio('div[class="media-tags"]')
      .text()
      .trim()
      .replace(/[\n\r]+/g, ", ")
      .replace(/  /g, "");

    loadedCheerio(
      'div[class="media-info-list paper"] > [class="media-info-list__item"]',
    ).each(function () {
      let name = loadedCheerio(this)
        .find('div[class="media-info-list__title"]')
        .text();

      if (name === "Автор") {
        novel.author = loadedCheerio(this)
          .find('div[class="media-info-list__value"]')
          .text()
          .trim();
      } else if (name === "Художник") {
        novel.artist = loadedCheerio(this)
          .find('div[class="media-info-list__value"]')
          .text()
          .trim();
      }
    });

    const chapters: Plugin.ChapterItem[] = [];

    let chaptersRaw: any = body.match(
      /window.__DATA__ = [\s\S]*?window._SITE_COLOR_/gm,
    );

    chaptersRaw = chaptersRaw?.[0]
      ?.replace("window.__DATA__ = ", "")
      ?.replace("window._SITE_COLOR_", "")
      ?.trim()
      ?.slice(0, -1);

    const chaptersJson: responseBook = JSON.parse(chaptersRaw);
    const totalChapters = chaptersJson.chapters.list?.length || 0;
    novel.status = statusKey[chaptersJson.manga.status - 1] || NovelStatus.Unknown;
    this.ui = chaptersJson?.user?.id;

    chaptersJson.chapters?.list?.forEach((chapter, chapterIndex) =>
      chapters.push({
        name:
          "Том " + chapter.chapter_volume +
          " Глава " + chapter.chapter_number +
            (chapter.chapter_name ? " " + chapter.chapter_name.trim() : ""),
        url:
          this.site + "/" + chaptersJson.manga.slug +
          "/v" + chapter.chapter_volume + "/c" + chapter.chapter_number +
          "?bid=" + (chapter.branch_id || ""),
        releaseTime: dayjs(chapter.chapter_created_at).format("LLL"),
        chapterNumber: totalChapters - chapterIndex,
      }),
    );

    novel.chapters = chapters.reverse();
    return novel;
  }

  async parseChapter(chapterUrl: string): Promise<string> {
    const result = await fetchApi(
      chapterUrl + (this.ui ? "&ui=" + this.ui : ""),
    ).then((res) => res.text());

    const loadedCheerio = parseHTML(result);
    loadedCheerio(".reader-container img").each((index, element) => {
      const src =
        loadedCheerio(element).attr("data-src") ||
        loadedCheerio(element).attr("src");
      if (!src?.startsWith("http")) {
        loadedCheerio(element).attr("src", this.site + src);
      } else {
        loadedCheerio(element).attr("src", src);
      }
      loadedCheerio(element).removeAttr("data-src");
    });

    const chapterText = loadedCheerio(".reader-container").html();
    return chapterText || "";
  }

  async searchNovels(
    searchTerm: string,
    //pageNo: number | undefined = 1,
  ): Promise<Plugin.NovelItem[]> {
    const result = await fetchApi(
      `${this.site}/search?q=${searchTerm}&type=manga`,
    );
    const body = (await result.json()) as Manga[];
    const novels: Plugin.NovelItem[] = [];

    body.forEach((novel) =>
      novels.push({
        name: novel?.rus_name || novel.name,
        cover: novel?.coverImage,
        url: novel?.href || this.site + "/" + novel.slug,
      }),
    );

    return novels;
  }

  fetchImage = fetchFile;

  filters = {
    sort: {
      label: "Сортировка",
      value: "rate",
      options: [
        { label: "Рейтинг", value: "rate" },
        { label: "Имя", value: "name" },
        { label: "Просмотры", value: "views" },
        { label: "Дате добавления", value: "created_at" },
        { label: "Дате обновления", value: "last_chapter_at" },
        { label: "Количество глав", value: "chap_count" },
      ],
      type: FilterTypes.Picker,
    },
    order: {
      label: "Порядок",
      value: "desc",
      options: [
        { label: "По убыванию", value: "desc" },
        { label: "По возрастанию", value: "asc" },
      ],
      type: FilterTypes.Picker,
    },
    type: {
      label: "Тип",
      value: [],
      options: [
        { label: "Авторский", value: "14" },
        { label: "Английский", value: "13" },
        { label: "Китай", value: "12" },
        { label: "Корея", value: "11" },
        { label: "Фанфик", value: "15" },
        { label: "Япония", value: "10" },
      ],
      type: FilterTypes.CheckboxGroup,
    },
    format: {
      label: "Формат выпуска",
      value: { include: [], exclude: [] },
      options: [
        { label: "4-кома (Ёнкома)", value: "1" },
        { label: "В цвете", value: "4" },
        { label: "Веб", value: "6" },
        { label: "Вебтун", value: "7" },
        { label: "Додзинси", value: "3" },
        { label: "Сборник", value: "2" },
        { label: "Сингл", value: "5" },
      ],
      type: FilterTypes.ExcludableCheckboxGroup,
    },
    status: {
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
        { label: "Антигерой", value: "176" },
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
  } satisfies Filters;
}

export default new RLIB();

interface responseBook {
  hasStickyPermission: boolean;
  bookmark?: null;
  auth: boolean;
  comments_version: string;
  manga: Manga;
  chapters: Chapters;
  user?: User;
}
interface Manga {
  id: number;
  name: string;
  rusName?: string;
  rus_name?: string;
  engName?: string;
  slug: string;
  status: number;
  chapters_count: number;
  altNames?: string[] | null;
  coverImage?: string;
  href?: string;
}
interface Chapters {
  list?: ListEntity[] | null;
  teams?: TeamsEntity[] | null;
  branches?: BranchesEntity[] | null;
  is_paid?: null[] | null;
}
interface ListEntity {
  chapter_id: number;
  chapter_slug: string;
  chapter_name: string;
  chapter_number: string;
  chapter_volume: number;
  chapter_moderated: number;
  chapter_user_id: number;
  chapter_expired_at: string;
  chapter_scanlator_id: number;
  chapter_created_at: string;
  status?: null;
  price: number;
  branch_id?: number;
  username: string;
}
interface TeamsEntity {
  name: string;
  alt_name: string;
  cover: string;
  slug: string;
  id: number;
  branch_id: number;
  sale: number;
  href: string;
  pivot: Pivot;
}
interface Pivot {
  manga_id: number;
  team_id: number;
}
interface BranchesEntity {
  id: number;
  manga_id: number;
  name: string;
  teams?: TeamsEntity1[] | null;
  is_subscribed: boolean;
}
interface TeamsEntity1 {
  id: number;
  name: string;
  slug: string;
  cover: string;
  branch_id: number;
  is_active: number;
}
interface User {
  id: string;
  avatar: string;
  access: boolean;
  isAdmin: boolean;
  paid: boolean;
}
