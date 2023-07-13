const cheerio = require('cheerio');
const fetchApi = require('@libs/fetchApi');
const fetchFile = require('@libs/fetchFile');
const FilterInputs = require('@libs/filterInputs');

const pluginId = 'kolnovel';
const baseUrl = 'https://kolnovel.com/';

async function popularNovels(page, { filters }) {
  let link = `${baseUrl}series/?page=${page}`;

  if (filters?.genres?.length) {
    link += filters.genres.map(i => `&genre[]=${i}`).join('');
  }

  if (filters?.type?.length) {
    link += filters.type.map(i => `&lang[]=${i}`).join('');
  }

  link += '&status=' + (filters?.status ? filters?.status : '');

  link += '&order=' + (filters?.order ? filters?.order : 'popular');

  const body = await fetchApi(link, {}, pluginId).then(result => result.text());

  const loadedCheerio = cheerio.load(body);

  const novels = [];

  loadedCheerio('article.maindet').each(function () {
    const novelName = loadedCheerio(this).find('h2').text();
    let image = loadedCheerio(this).find('img');
    const novelCover = image.attr('data-src') || image.attr('src');
    const novelUrl = loadedCheerio(this).find('h2 a').attr('href');

    const novel = {
      name: novelName,
      cover: novelCover,
      url: novelUrl,
    };

    novels.push(novel);
  });

  return novels;
}

async function parseNovelAndChapters(novelUrl) {
  const url = novelUrl;

  const result = await fetchApi(url, {}, pluginId);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  const novel = {
    url,
    chapters: [],
  };

  novel.name = loadedCheerio('h1.entry-title').text();

  novel.cover =
    loadedCheerio('img.wp-post-image').attr('data-src') ||
    loadedCheerio('img.wp-post-image').attr('src');

  loadedCheerio('div.serl:nth-child(3) > span').each(function () {
    const detailName = loadedCheerio(this).text().trim();
    const detail = loadedCheerio(this).next().text().trim();

    switch (detailName) {
      case 'الكاتب':
      case 'Author':
        novel.author = detail;
        break;
    }
  });

  novel.status = loadedCheerio('div.sertostat > span').attr('class');

  novel.genres = loadedCheerio('.sertogenre')
    .children('a')
    .map((i, el) => loadedCheerio(el).text())
    .toArray()
    .join(',');

  novel.summary = loadedCheerio('.sersys')
    .find('br')
    .replaceWith('\n')
    .end()
    .text();

  let chapter = [];

  loadedCheerio('.eplister')
    .find('li')
    .each(function () {
      const chapterName =
        loadedCheerio(this).find('.epl-num').text() +
        ' - ' +
        loadedCheerio(this).find('.epl-title').text();

      const releaseDate = loadedCheerio(this).find('.epl-date').text().trim();

      const chapterUrl = loadedCheerio(this).find('a').attr('href');

      chapter.push({
        name: chapterName,
        releaseTime: releaseDate,
        url: chapterUrl,
      });
    });

  novel.chapters = chapter.reverse();

  return novel;
}

async function parseChapter(chapterUrl) {
  const result = await fetchApi(chapterUrl, {}, pluginId);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  let ignore = loadedCheerio('.epcontent > p').next().attr('class');
  loadedCheerio(`p.${ignore}`).remove();
  let chapterText = loadedCheerio('.epcontent').html();

  return chapterText;
}

async function searchNovels(searchTerm) {
  const url = `${baseUrl}?s=${searchTerm}`;

  const result = await fetchApi(url, {}, pluginId);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  const novels = [];

  loadedCheerio('article.maindet').each(function () {
    const novelName = loadedCheerio(this).find('h2').text();
    let image = loadedCheerio(this).find('img');
    const novelCover = image.attr('data-src') || image.attr('src');
    const novelUrl = loadedCheerio(this).find('h2 a').attr('href');

    novels.push({
      name: novelName,
      url: novelUrl,
      cover: novelCover,
    });
  });

  return novels;
}

async function fetchImage(url) {
  const headers = {
    Referer: baseUrl,
  };
  return await fetchFile(url, { headers: headers });
}

const filters = [
  {
    key: 'order',
    label: 'ترتيب حسب',
    values: [
      { label: 'الإعداد الأولي', value: '' },

      { label: 'A-Z', value: 'title' },

      { label: 'Z-A', value: 'titlereverse' },

      { label: 'أخر التحديثات', value: 'update' },

      { label: 'أخر ما تم إضافته', value: 'latest' },

      { label: 'الرائجة', value: 'popular' },
    ],
    inputType: FilterInputs.Picker,
  },
  {
    key: 'status',
    label: 'الحالة',
    values: [
      { label: 'All', value: '' },

      { label: 'Ongoing', value: 'ongoing' },

      { label: 'Hiatus', value: 'hiatus' },

      { label: 'Completed', value: 'completed' },
    ],
    inputType: FilterInputs.Picker,
  },
  {
    key: 'type',
    label: 'النوع',
    values: [
      { label: 'إنجليزية', value: 'english' },

      { label: 'روايةلايت', value: 'light-novel' },

      { label: 'روايةويب', value: 'web-novel' },

      { label: 'صينية', value: 'chinese' },

      { label: 'عربية', value: 'arabic' },

      { label: 'كورية', value: 'korean' },

      { label: 'يابانية', value: 'japanese' },
    ],
    inputType: FilterInputs.Checkbox,
  },
  {
    key: 'genres',
    label: 'تصنيف',
    values: [
      { label: 'Wuxia', value: 'wuxia' },

      { label: 'Xianxia', value: 'xianxia' },

      { label: 'XUANHUAN', value: 'xuanhuan' },

      { label: 'أكشن', value: 'action' },

      { label: 'إثارة', value: 'excitement' },

      { label: 'إنتقالالىعالمأخر', value: 'isekai' },

      { label: 'إيتشي', value: 'etchi' },

      { label: 'الخيالالعلمي', value: 'sci-fi' },

      { label: 'بوليسي', value: 'policy' },

      { label: 'تاريخي', value: 'historical' },

      { label: 'تحقيقات', value: '%d8%aa%d8%ad%d9%82%d9%8a%d9%82' },

      { label: 'تقمصشخصيات', value: 'rpg' },

      { label: 'جريمة', value: 'crime' },

      { label: 'جوسى', value: 'josei' },

      { label: 'حريم', value: 'harem' },

      { label: 'حياةمدرسية', value: 'school-life' },

      { label: 'خيالي(فانتازيا)', value: 'fantasy' },

      { label: 'دراما', value: 'drama' },

      { label: 'رعب', value: 'horror' },

      { label: 'رومانسي', value: 'romantic' },

      { label: 'سحر', value: 'magic' },

      { label: 'سينن', value: 'senen' },

      { label: 'شريحةمنالحياة', value: 'slice-of-life' },

      { label: 'شوجو', value: 'shojo' },

      { label: 'شونين', value: 'shonen' },

      { label: 'طبي', value: 'medical' },

      { label: 'ظواهرخارقةللطبيعة', value: 'supernatural' },

      { label: 'غموض', value: 'mysteries' },

      { label: 'فنونالقتال', value: 'martial-arts' },

      { label: 'قوىخارقة', value: 'superpower' },

      { label: 'كوميدي', value: 'comedy' },

      { label: 'مأساوي', value: 'tragedy' },

      { label: 'مابعدالكارثة', value: 'after-the-disaster' },

      { label: 'مغامرة', value: 'adventure' },

      { label: 'ميكا', value: 'mechanical' },

      { label: 'ناضج', value: 'mature' },

      { label: 'نفسي', value: 'psychological' },
    ],
    inputType: FilterInputs.Checkbox,
  },
];

module.exports = {
  id: pluginId,
  name: 'KolNovel',
  version: '1.0.0',
  icon: 'multisrc/wpmangastream/icons/kolnovel.png',
  site: baseUrl,
  protected: false,
  fetchImage,
  popularNovels,
  parseNovelAndChapters,
  parseChapter,
  searchNovels,
  filters,
};
