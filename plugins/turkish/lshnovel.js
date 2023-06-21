const cheerio = require('cheerio');
const fetchApi = require('@libs/fetchApi');
const fetchFile = require('@libs/fetchFile');
const FilterInputs = require('@libs/filterInputs');

const pluginId = 'lshnovel';
const baseUrl = 'https://lshnovel.com/';

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

  loadedCheerio('article.bs').each(function () {
    const novelName = loadedCheerio(this).find('.ntitle').text().trim();
    let image = loadedCheerio(this).find('img');
    const novelCover = image.attr('data-src') || image.attr('src');

    const novelUrl = loadedCheerio(this).find('a').attr('href');

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

  novel.name = loadedCheerio('.entry-title').text();

  novel.cover =
    loadedCheerio('img.wp-post-image').attr('data-src') ||
    loadedCheerio('img.wp-post-image').attr('src');

  loadedCheerio('div.spe > span').each(function () {
    const detailName = loadedCheerio(this).find('b').text().trim();
    const detail = loadedCheerio(this).find('b').remove().end().text().trim();

    switch (detailName) {
      case 'المؤلف:':
      case 'Yazar:':
      case 'Autor:':
      case 'Author:':
        novel.author = detail;
        break;
      case 'Status:':
      case 'Seviye:':
        novel.status = detail;
        break;
    }
  });

  novel.genres = loadedCheerio('.genxed').text().trim().replace(/\s/g, ',');

  loadedCheerio('div[itemprop="description"]  h3,p.a,strong').remove();
  novel.summary = loadedCheerio('div[itemprop="description"]')
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

  let chapterText = loadedCheerio('div.epcontent').html();

  return chapterText;
}

async function searchNovels(searchTerm) {
  const url = `${baseUrl}?s=${searchTerm}`;

  const result = await fetchApi(url, {}, pluginId);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  const novels = [];

  loadedCheerio('article.bs').each(function () {
    const novelName = loadedCheerio(this).find('.ntitle').text().trim();
    const novelCover = loadedCheerio(this).find('img').attr('src');
    const novelUrl = loadedCheerio(this).find('a').attr('href');

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
    label: 'Önerilen',
    values: [
      { label: 'Varsayılan', value: '' },

      { label: 'A-Z', value: 'title' },

      { label: 'Z-A', value: 'titlereverse' },

      { label: 'Son Yüklemeler', value: 'update' },

      { label: 'Son Eklenenler', value: 'latest' },

      { label: 'Bestimiz', value: 'popular' },
    ],
    inputType: FilterInputs.Picker,
  },
  {
    key: 'status',
    label: 'Statü',
    values: [
      { label: 'Tümü', value: '' },

      { label: 'Ongoing', value: 'ongoing' },

      { label: 'Hiatus', value: 'hiatus' },

      { label: 'Completed', value: 'completed' },
    ],
    inputType: FilterInputs.Picker,
  },
  {
    key: 'type',
    label: 'Tür',
    values: [
      { label: 'Çeviri Novel', value: 'ceviri-novel' },

      { label: 'Liz-Chan', value: 'liz-chan' },

      { label: 'Manhwa', value: 'manhwa' },

      { label: 'Orijinal Novel', value: 'orijinal-novel' },

      { label: 'Web Novel', value: 'web-novel' },
    ],
    inputType: FilterInputs.Checkbox,
  },
  {
    key: 'genres',
    label: 'Kategori',
    values: [
      { label: '+18', value: '18' },

      { label: 'Action', value: 'action' },

      { label: 'Adult', value: 'adult' },

      { label: 'Aksiyon', value: 'aksiyon' },

      { label: 'BL', value: 'bl' },

      { label: 'Comedy', value: 'comedy' },

      { label: 'Doğaüstü', value: 'dogaustu' },

      { label: 'Dram', value: 'dram' },

      { label: 'Drama', value: 'drama' },

      { label: 'Ecchi', value: 'ecchi' },

      { label: 'Fantastik', value: 'fantastik' },

      { label: 'Fantasy', value: 'fantasy' },

      { label: 'Gizem', value: 'gizem' },

      { label: 'Harem', value: 'harem' },

      { label: 'Historical', value: 'historical' },

      { label: 'Josei', value: 'josei' },

      { label: 'Macera', value: 'macera' },

      { label: 'Manhwa', value: 'manhwa' },

      { label: 'Martial Arts', value: 'martial-arts' },

      { label: 'Mature', value: 'mature' },

      { label: 'Novel', value: 'novel' },

      { label: 'Okul', value: 'okul' },

      { label: 'Psikolojik', value: 'psikolojik' },

      { label: 'Psychological', value: 'psychological' },

      { label: 'Reverse Harem', value: 'reverse-harem' },

      { label: 'Romance', value: 'romance' },

      { label: 'Romantik', value: 'romantik' },

      { label: 'Shoujo', value: 'shoujo' },

      { label: 'Slice Of Life', value: 'slice-of-life' },

      { label: 'Smut', value: 'smut' },

      { label: 'Supernatural', value: 'supernatural' },

      { label: 'Tarihi', value: 'tarihi' },

      { label: 'Tragedy', value: 'tragedy' },

      { label: 'Yaoi', value: 'yaoi' },
    ],
    inputType: FilterInputs.Checkbox,
  },
];

module.exports = {
  id: pluginId,
  name: 'Liebe Schnee Hiver Novel',
  version: '1.0.0',
  icon: 'multisrc/wpmangastream/icons/lshnovel.png',
  site: baseUrl,
  protected: false,
  fetchImage,
  popularNovels,
  parseNovelAndChapters,
  parseChapter,
  searchNovels,
  filters,
};
