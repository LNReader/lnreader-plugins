const cheerio = require('cheerio');
const fetchApi = require('@libs/fetchApi');
const fetchFile = require('@libs/fetchFile');
const FilterInputs = require('@libs/filterInputs');

const pluginId = 'PandaMTL';
const baseUrl = 'https://www.pandamtl.com/';

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

  novel.genre = loadedCheerio('.sertogenre')
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
    label: 'Sort By',
    values: [
      { label: 'Default', value: '' },

      { label: 'A-Z', value: 'title' },

      { label: 'Z-A', value: 'titlereverse' },

      { label: 'Latest Update', value: 'update' },

      { label: 'Latest Added', value: 'latest' },

      { label: 'Popular', value: 'popular' },
    ],
    inputType: FilterInputs.Picker,
  },
  {
    key: 'status',
    label: 'Status',
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
    label: 'Type',
    values: [
      { label: 'Light Novel (KR)', value: 'light-novel-kr' },

      { label: 'Web Novel', value: 'web-novel' },
    ],
    inputType: FilterInputs.Checkbox,
  },
  {
    key: 'genres',
    label: 'Genres',
    values: [
      { label: 'Action', value: 'action' },

      { label: 'Adult', value: 'adult' },

      { label: 'Adventure', value: 'adventure' },

      { label: 'Comedy', value: 'comedy' },

      { label: 'Ecchi', value: 'ecchi' },

      { label: 'Fantasy', value: 'fantasy' },

      { label: 'Harem', value: 'harem' },

      { label: 'Josei', value: 'josei' },

      { label: 'Martial Arts', value: 'martial-arts' },

      { label: 'Mature', value: 'mature' },

      { label: 'Romance', value: 'romance' },

      { label: 'School Life', value: 'school-life' },

      { label: 'Sci-fi', value: 'sci-fi' },

      { label: 'Seinen', value: 'seinen' },

      { label: 'Slice of Life', value: 'slice-of-life' },

      { label: 'Smut', value: 'smut' },

      { label: 'Sports', value: 'sports' },

      { label: 'Supernatural', value: 'supernatural' },

      { label: 'Tragedy', value: 'tragedy' },
    ],
    inputType: FilterInputs.Checkbox,
  },
];

module.exports = {
  id: pluginId,
  name: 'PandaMTL',
  version: '1.0.0',
  icon: 'src/en/wordpress/icon.png',
  site: baseUrl,
  protected: false,
  fetchImage,
  popularNovels,
  parseNovelAndChapters,
  parseChapter,
  searchNovels,
  filters,
};
