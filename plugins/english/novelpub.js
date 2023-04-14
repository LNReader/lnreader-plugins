const cheerio = require('cheerio');
const fetchApi = require('@libs/fetchApi');
const fetchFile = require('@libs/fetchFile');
const languages = require('@libs/languages');

const baseUrl = 'https://www.novelpub.com/';

const sourceName = 'NovelPub';
const pluginId = 'novelpub.com';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
};

async function popularNovels (page) {
  let url = baseUrl + 'browse/all/popular/all/' + page;

  const result = await fetchApi(url, { method: 'GET', headers });
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('.novel-item.ads').remove();

  loadedCheerio('.novel-item').each(function () {
    const novelName = loadedCheerio(this).find('.novel-title').text().trim();
    const novelCover = loadedCheerio(this).find('img').attr('data-src');
    const novelUrl =
      baseUrl +
      loadedCheerio(this).find('.novel-title > a').attr('href').substring(1);

    const novel = { name: novelName, cover: novelCover, url: novelUrl };

    novels.push(novel);
  });

  return novels;
};

async function parseNovelAndChapters (novelUrl) {
  const url = novelUrl;

  const result = await fetchApi(url, { method: 'GET', headers });
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  let novel = { url, genres: '' };

  novel.name = loadedCheerio('h1.novel-title').text().trim();

  novel.cover = loadedCheerio('figure.cover > img').attr('data-src');

  loadedCheerio('div.categories > ul > li').each(function () {
    novel.genres +=
      loadedCheerio(this)
        .text()
        .replace(/[\t\n]/g, '') + ',';
  });

  loadedCheerio('div.header-stats > span').each(function () {
    if (loadedCheerio(this).find('small').text() === 'Status') {
      novel.status = loadedCheerio(this).find('strong').text();
    }
  });

  novel.genres = novel.genres.slice(0, -1);

  novel.author = loadedCheerio('.author > a > span').text();

  novel.summary = loadedCheerio('.summary > .content').text().trim();

  const delay = ms => new Promise(res => setTimeout(res, ms));

  let lastPage = 1;

  lastPage = loadedCheerio(
    '#novel > header > div.header-body.container > div.novel-info > div.header-stats > span:nth-child(1) > strong',
  )
    .text()
    ?.trim();

  lastPage = Math.ceil(lastPage / 100);

  const getChapters = async () => {
    let novelChapters = [];

    for (let i = 1; i <= lastPage; i++) {
      const chaptersUrl = `${novelUrl}/chapters/page-${i}`;

      const chaptersRequest = await fetchApi(chaptersUrl, { headers });
      const chaptersHtml = await chaptersRequest.text();

      loadedCheerio = cheerio.load(chaptersHtml);

      loadedCheerio('.chapter-list li').each(function () {
        const chapterName = loadedCheerio(this)
          .find('.chapter-title')
          .text()
          .trim();

        const releaseDate = loadedCheerio(this)
          .find('.chapter-update')
          .text()
          .trim();

        const chapterUrl =
          baseUrl + loadedCheerio(this).find('a').attr('href').substring(1);

        novelChapters.push({ name: chapterName, releaseTime: releaseDate, url: chapterUrl });
      });

      await delay(1000);
    }

    return novelChapters;
  };

  novel.chapters = await getChapters();

  return novel;
};

async function parseChapter (chapterUrl) {
  const url = chapterUrl;

  const result = await fetchApi(url, { method: 'GET', headers });

  const body = await result.text();
  const loadedCheerio = cheerio.load(body);

  const chapterText = loadedCheerio('#chapter-container').html();
  return chapterText;
};

// They have API to search, pls update it, im quite lazy xD
async function searchNovels (searchTerm) {
  const url = `${baseUrl}lnwsearchlive?inputContent=${searchTerm}`;

  const result = await fetchApi(url, { method: 'GET', headers });
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  let novels = [];
  
//   let results = JSON.parse(loadedCheerio('body').text());

//   loadedCheerio = cheerio.load(results.resultview);

//   loadedCheerio('.novel-item').each(function () {
//     const novelName = loadedCheerio(this).find('.novel-title').text().trim();
//     const novelCover = loadedCheerio(this).find('img').attr('src');
//     const novelUrl =
//       baseUrl + loadedCheerio(this).find('a').attr('href').substring(1);

//     const novel = { name: novelName, cover: novelCover, url: novelUrl };

//     novels.push(novel);
//   });

  return novels;
};

module.exports = {
    id: pluginId,
    name: sourceName,
    site: baseUrl,
    version: '1.0.0',
    lang: languages.English,
    icon: 'src/en/novelpub/icon.png',
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};