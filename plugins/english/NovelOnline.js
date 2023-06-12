const cheerio = require('cheerio');
const fetchApi = require('@libs/fetchApi');
const fetchFile = require('@libs/fetchFile');
const languages = require('@libs/languages');

const pluginId = 'NO.net';
const sourceName = 'novelsOnline';

const baseUrl = 'https://novelsonline.net';

async function searchNovels (searchTerm) {
  const result = await fetchApi(
    'https://novelsonline.net/sResults.php',
    {
      headers: {
        'Accept': '*/*',
        'Accept-Language': 'pl,en-US;q=0.7,en;q=0.3',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      method: 'POST',
      body: 'q=' + encodeURIComponent(searchTerm),
    },
    pluginId
  ).then(res => res.text());
  let $ = cheerio.load(result);

  const headers = $('li');
  return headers
    .map((i, h) => {
      const novelName = $(h).text();
      const novelUrl = $(h).find('a').attr('href');
      const novelCover = $(h).find('img').attr('src');

      if (!novelUrl) {
        return null;
      }

      return {
        name: novelName,
        cover: novelCover,
        url: novelUrl,
      };
    })
    .get()
    .filter(sr => sr !== null);
};

async function parseNovelAndChapters (novelUrl){
  let novel = {
    url: novelUrl,
    chapters: [],
  };

  const result = await fetchApi(novelUrl).then(res => res.text());
  let $ = cheerio.load(result);

  novel.name = $('h1').text();
  novel.cover = $('.novel-cover').find('a > img').attr('src');
  novel.author = $(
    'div.novel-details > div:nth-child(5) > div.novel-detail-body',
  )
    .find('li')
    .map((_, el) => $(el).text())
    .get()
    .join(', ');

  novel.genres = $(
    'div.novel-details > div:nth-child(2) > div.novel-detail-body',
  )
    .find('li')
    .map((_, el) => $(el).text())
    .get()
    .join(',');

  novel.summary = $(
    'div.novel-right > div > div:nth-child(1) > div.novel-detail-body',
  ).text();

  novel.chapters = $('ul.chapter-chs > li > a')
    .map((_, el) => {
      const chapterUrl = $(el).attr('href');
      const chapterName = $(el).text();

      return {
        name: chapterName,
        releaseTime: '',
        url: chapterUrl,
      };
    })
    .get();

  return novel;
};

async function popularNovels (page) {
  return { novels: [] }; /** TO DO */
};

async function parseChapter (chapterUrl) {
  const result = await fetchApi(chapterUrl).then(res => res.text());
  let loadedCheerio = cheerio.load(result);

  const chapterText = loadedCheerio('#contentall').html() || '';

  return chapterText;
};

module.exports = {
    id: pluginId,
    name: sourceName,
    site: baseUrl,
    icon: 'src/coverNotAvailable.jpg',
    version: '1.0.0',
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};