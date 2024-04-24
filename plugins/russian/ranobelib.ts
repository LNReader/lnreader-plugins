import { Plugin } from '@typings/plugin';
import { FilterTypes, Filters } from '@libs/filterInputs';
import { fetchApi, fetchFile } from '@libs/fetch';
import { NovelStatus } from '@libs/novelStatus';
import { load as parseHTML } from 'cheerio';

class RLIB implements Plugin.PluginBase {
  id = 'RLIB';
  name = 'RanobeLib (OLD)';
  site = 'https://old.ranobelib.me/old/';
  version = '1.1.0';
  icon = 'src/ru/ranobelib/icon.png';
  ui: string | undefined = undefined;

  async popularNovels(
    pageNo: number,
    {
      showLatestNovels,
      filters,
    }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    let url = this.site + 'manga-list?page=' + pageNo;
    url +=
      '&sort_by=' +
      (showLatestNovels
        ? 'last_chapter_at'
        : filters?.sort_by?.value || 'rating_score');
    url += '&sort_type=' + (filters?.sort_type?.value || 'desc');

    if (filters?.require_chapters?.value) {
      url += '&chapters[min]=1';
    }
    if (filters?.types?.value?.length) {
      url += '&types[]=' + filters.types.value.join('&types[]=');
    }
    if (filters?.scanlateStatus?.value?.length) {
      url +=
        '&scanlateStatus[]=' +
        filters.scanlateStatus.value.join('&scanlateStatus[]=');
    }
    if (filters?.manga_status?.value?.length) {
      url +=
        '&manga_status[]=' +
        filters.manga_status.value.join('&manga_status[]=');
    }

    if (filters?.genres) {
      if (filters.genres.value?.include?.length) {
        url += '&genres[]=' + filters.genres.value.include.join('&genres[]=');
      }
      if (filters.genres.value?.exclude?.length) {
        url +=
          '&genres_exclude[]=' +
          filters.genres.value.exclude.join('&genres_exclude[]=');
      }
    }
    if (filters?.tags) {
      if (filters.tags.value?.include?.length) {
        url += '&tags[]=' + filters.tags.value.include.join('&tags[]=');
      }
      if (filters.tags.value?.exclude?.length) {
        url +=
          '&tags_exclude[]=' +
          filters.tags.value.exclude.join('&tags_exclude[]=');
      }
    }

    const result = await fetchApi(url).then(res => res.text());
    const loadedCheerio = parseHTML(result);
    const novels: Plugin.NovelItem[] = [];

    this.ui = loadedCheerio('a.header-right-menu__item')
      .attr('href')
      ?.replace?.(/[^0-9]/g, '');

    const novelsRaw = result.match(/window\.__CATALOG_ITEMS__ = (\[.*?\]);/);
    if (novelsRaw instanceof Array && novelsRaw.length >= 2) {
      const novelsJson: resNovels[] = JSON.parse(novelsRaw[1]);
      novelsJson.forEach(novel => {
        novels.push({
          name: novel.rus_name,
          cover: novel.cover.default,
          path: novel.slug_url,
        });
      });
    }

    return novels;
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const body = await fetchApi(this.resolveUrl(novelPath, true)).then(res =>
      res.text(),
    );
    const loadedCheerio = parseHTML(body);

    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: loadedCheerio('.media-name__main').text()?.trim?.() || '',
    };
    novel.cover = loadedCheerio('.container_responsive img').attr('src');

    novel.summary = loadedCheerio('.media-description__text').text().trim();

    novel.genres = loadedCheerio('div[class="media-tags"]')
      .text()
      .trim()
      .replace(/[\n\r]+/g, ', ')
      .replace(/  /g, '');

    loadedCheerio(
      'div.media-info-list > div[class="media-info-list__item"]',
    ).each(function () {
      let name = loadedCheerio(this)
        .find('div[class="media-info-list__title"]')
        .text();

      if (name === 'Автор') {
        novel.author = loadedCheerio(this)
          .find('div[class="media-info-list__value"]')
          .text()
          .trim();
      } else if (name === 'Художник') {
        novel.artist = loadedCheerio(this)
          .find('div[class="media-info-list__value"]')
          .text()
          .trim();
      }
    });

    this.ui = loadedCheerio('a.header-right-menu__item')
      .attr('href')
      ?.replace?.(/[^0-9]/g, '');

    const chaptersRaw = body.match(/window\.__CHAPTERS__ = (\[.*?\]);/);
    if (chaptersRaw instanceof Array && chaptersRaw.length >= 2) {
      const chaptersJson: resChapters[] = JSON.parse(chaptersRaw[1]);

      if (!chaptersJson?.length) return novel;

      const chapters: Plugin.ChapterItem[] = [];
      chaptersJson.forEach(chapter =>
        chapters.push({
          name:
            'Том ' +
            chapter.volume +
            ' Глава ' +
            chapter.number +
            (chapter.name ? ' ' + chapter.name.trim() : ''),
          path: novelPath + '/v' + chapter.volume + '/c' + chapter.number,
          chapterNumber: chapter.index + 1,
        }),
      );
      novel.chapters = chapters;
    }
    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const result = await fetchApi(this.resolveUrl(chapterPath)).then(res =>
      res.text(),
    );

    const loadedCheerio = parseHTML(result);
    loadedCheerio('.reader-container img').each((index, element) => {
      const src =
        loadedCheerio(element).attr('data-src') ||
        loadedCheerio(element).attr('src');
      if (!src?.startsWith('http')) {
        loadedCheerio(element).attr('src', this.site + src);
      } else {
        loadedCheerio(element).attr('src', src);
      }
      loadedCheerio(element).removeAttr('data-src');
    });

    const chapterText = loadedCheerio('.reader-container').html();
    return chapterText || '';
  }

  async searchNovels(searchTerm: string): Promise<Plugin.NovelItem[]> {
    const result = await fetchApi(this.site + 'api/manga?q=' + searchTerm);
    const { data }: { data: resNovels[] } = await result.json();
    const novels: Plugin.NovelItem[] = [];

    data.forEach(novel =>
      novels.push({
        name: novel.rus_name || novel.name,
        cover: novel?.cover?.default || '',
        path: novel.slug_url,
      }),
    );

    return novels;
  }

  fetchImage = fetchFile;
  resolveUrl = (path: string, isNovel?: boolean) =>
    this.site + path + (this.ui ? '?ui=' + this.ui : '');

  filters = {
    sort_by: {
      label: 'Сортировка',
      value: 'rating_score',
      options: [
        { label: 'По рейтингу', value: 'rate_avg' },
        { label: 'По популярности', value: 'rating_score' },
        { label: 'По просмотрам', value: 'views' },
        { label: 'Количеству глав', value: 'chap_count' },
        { label: 'Дате обновления', value: 'last_chapter_at' },
        { label: 'Дате добавления', value: 'created_at' },
        { label: 'По названию (A-Z)', value: 'name' },
        { label: 'По названию (А-Я)', value: 'rus_name' },
      ],
      type: FilterTypes.Picker,
    },
    sort_type: {
      label: 'Порядок',
      value: 'desc',
      options: [
        { label: 'По убыванию', value: 'desc' },
        { label: 'По возрастанию', value: 'asc' },
      ],
      type: FilterTypes.Picker,
    },
    types: {
      label: 'Тип',
      value: [],
      options: [
        { label: 'Япония', value: '10' },
        { label: 'Корея', value: '11' },
        { label: 'Китай', value: '12' },
        { label: 'Английский', value: '13' },
        { label: 'Авторский', value: '14' },
        { label: 'Фанфик', value: '15' },
      ],
      type: FilterTypes.CheckboxGroup,
    },
    scanlateStatus: {
      label: 'Статус перевода',
      value: [],
      options: [
        { label: 'Продолжается', value: '1' },
        { label: 'Завершен', value: '2' },
        { label: 'Заморожен', value: '3' },
        { label: 'Заброшен', value: '4' },
      ],
      type: FilterTypes.CheckboxGroup,
    },
    manga_status: {
      label: 'Статус тайтла',
      value: [],
      options: [
        { label: 'Онгоинг', value: '1' },
        { label: 'Завершён', value: '2' },
        { label: 'Анонс', value: '3' },
        { label: 'Приостановлен', value: '4' },
        { label: 'Выпуск прекращён', value: '5' },
      ],
      type: FilterTypes.CheckboxGroup,
    },
    genres: {
      label: 'Жанры',
      value: { include: [], exclude: [] },
      options: [
        { label: 'Арт', value: '32' },
        { label: 'Безумие', value: '91' },
        { label: 'Боевик', value: '34' },
        { label: 'Боевые искусства', value: '35' },
        { label: 'Вампиры', value: '36' },
        { label: 'Военное', value: '89' },
        { label: 'Гарем', value: '37' },
        { label: 'Гендерная интрига', value: '38' },
        { label: 'Героическое фэнтези', value: '39' },
        { label: 'Демоны', value: '81' },
        { label: 'Детектив', value: '40' },
        { label: 'Детское', value: '88' },
        { label: 'Дзёсэй', value: '41' },
        { label: 'Драма', value: '43' },
        { label: 'Игра', value: '44' },
        { label: 'Исекай', value: '79' },
        { label: 'История', value: '45' },
        { label: 'Киберпанк', value: '46' },
        { label: 'Кодомо', value: '76' },
        { label: 'Комедия', value: '47' },
        { label: 'Космос', value: '83' },
        { label: 'Магия', value: '85' },
        { label: 'Махо-сёдзё', value: '48' },
        { label: 'Машины', value: '90' },
        { label: 'Меха', value: '49' },
        { label: 'Мистика', value: '50' },
        { label: 'Музыка', value: '80' },
        { label: 'Научная фантастика', value: '51' },
        { label: 'Омегаверс', value: '77' },
        { label: 'Пародия', value: '86' },
        { label: 'Повседневность', value: '52' },
        { label: 'Полиция', value: '82' },
        { label: 'Постапокалиптика', value: '53' },
        { label: 'Приключения', value: '54' },
        { label: 'Психология', value: '55' },
        { label: 'Романтика', value: '56' },
        { label: 'Самурайский боевик', value: '57' },
        { label: 'Сверхъестественное', value: '58' },
        { label: 'Сёдзё', value: '59' },
        { label: 'Сёдзё-ай', value: '60' },
        { label: 'Сёнэн', value: '61' },
        { label: 'Сёнэн-ай', value: '62' },
        { label: 'Спорт', value: '63' },
        { label: 'Супер сила', value: '87' },
        { label: 'Сэйнэн', value: '64' },
        { label: 'Трагедия', value: '65' },
        { label: 'Триллер', value: '66' },
        { label: 'Ужасы', value: '67' },
        { label: 'Фантастика', value: '68' },
        { label: 'Фэнтези', value: '69' },
        { label: 'Хентай', value: '84' },
        { label: 'Школа', value: '70' },
        { label: 'Эротика', value: '71' },
        { label: 'Этти', value: '72' },
        { label: 'Юри', value: '73' },
        { label: 'Яой', value: '74' },
      ],
      type: FilterTypes.ExcludableCheckboxGroup,
    },
    tags: {
      label: 'Теги',
      value: { include: [], exclude: [] },
      options: [
        { label: 'Авантюристы', value: '328' },
        { label: 'Антигерой', value: '175' },
        { label: 'Бессмертные', value: '333' },
        { label: 'Боги', value: '218' },
        { label: 'Борьба за власть', value: '309' },
        { label: 'Брат и сестра', value: '360' },
        { label: 'Ведьма', value: '339' },
        { label: 'Видеоигры', value: '204' },
        { label: 'Виртуальная реальность', value: '214' },
        { label: 'Владыка демонов', value: '349' },
        { label: 'Военные', value: '198' },
        { label: 'Воспоминания из другого мира', value: '310' },
        { label: 'Выживание', value: '212' },
        { label: 'ГГ женщина', value: '294' },
        { label: 'ГГ имба', value: '292' },
        { label: 'ГГ мужчина', value: '295' },
        { label: 'ГГ не ояш', value: '325' },
        { label: 'ГГ не человек', value: '331' },
        { label: 'ГГ ояш', value: '326' },
        { label: 'Главный герой бог', value: '324' },
        { label: 'Глупый ГГ', value: '298' },
        { label: 'Горничные', value: '171' },
        { label: 'Гуро', value: '306' },
        { label: 'Гяру', value: '197' },
        { label: 'Демоны', value: '157' },
        { label: 'Драконы', value: '313' },
        { label: 'Древний мир', value: '317' },
        { label: 'Зверолюди', value: '163' },
        { label: 'Зомби', value: '155' },
        { label: 'Исторические фигуры', value: '323' },
        { label: 'Кулинария', value: '158' },
        { label: 'Культивация', value: '161' },
        { label: 'ЛГБТ', value: '344' },
        { label: 'ЛитРПГ', value: '319' },
        { label: 'Лоли', value: '206' },
        { label: 'Магия', value: '170' },
        { label: 'Машинный перевод', value: '345' },
        { label: 'Медицина', value: '159' },
        { label: 'Межгалактическая война', value: '330' },
        { label: 'Монстр Девушки', value: '207' },
        { label: 'Монстры', value: '208' },
        { label: 'Мрачный мир', value: '316' },
        { label: 'Музыка', value: '358' },
        { label: 'Музыка', value: '209' },
        { label: 'Ниндзя', value: '199' },
        { label: 'Обратный Гарем', value: '210' },
        { label: 'Офисные Работники', value: '200' },
        { label: 'Пираты', value: '341' },
        { label: 'Подземелья', value: '314' },
        { label: 'Политика', value: '311' },
        { label: 'Полиция', value: '201' },
        { label: 'Преступники / Криминал', value: '205' },
        { label: 'Призраки / Духи', value: '196' },
        { label: 'Призыватели', value: '329' },
        { label: 'Прыжки между мирами', value: '321' },
        { label: 'Путешествие в другой мир', value: '318' },
        { label: 'Путешествие во времени', value: '213' },
        { label: 'Рабы', value: '355' },
        { label: 'Ранги силы', value: '312' },
        { label: 'Реинкарнация', value: '154' },
        { label: 'Самураи', value: '202' },
        { label: 'Скрытие личности', value: '315' },
        { label: 'Средневековье', value: '174' },
        { label: 'Традиционные игры', value: '203' },
        { label: 'Умный ГГ', value: '303' },
        { label: 'Характерный рост', value: '332' },
        { label: 'Хикикомори', value: '167' },
        { label: 'Эволюция', value: '322' },
        { label: 'Элементы РПГ', value: '327' },
        { label: 'Эльфы', value: '217' },
        { label: 'Якудза', value: '165' },
      ],
      type: FilterTypes.ExcludableCheckboxGroup,
    },
    require_chapters: {
      label: 'Только проекты с главами',
      value: true,
      type: FilterTypes.Switch,
    },
  } satisfies Filters;
}

export default new RLIB();

interface resNovels {
  id: number;
  name: string;
  rus_name: string;
  eng_name: string;
  slug: string;
  slug_url: string;
  cover: Cover;
  ageRestriction: AgeRestrictionOrTypeOrStatus;
  site: number;
  type: AgeRestrictionOrTypeOrStatus;
  rating: Rating;
  is_licensed: boolean;
  model: string;
  status: AgeRestrictionOrTypeOrStatus;
  releaseDateString: string;
}
interface Cover {
  filename: string;
  thumbnail: string;
  default: string;
}
interface AgeRestrictionOrTypeOrStatus {
  id: number;
  label: string;
}
interface Rating {
  average: string;
  averageFormated: string;
  votes: number;
  votesFormated: string;
  user: number;
}

interface resChapters {
  id: number;
  index: number;
  item_number: number;
  volume: string;
  number: string;
  number_secondary: string;
  name: string;
}
