const cheerio = require('cheerio');
const fetchApi = require('@libs/fetchApi');
const fetchFile = require('@libs/fetchFile');
const languages = require('@libs/languages');

const defaultCoverUri =
    'https://github.com/LNReader/lnreader-sources/blob/main/icons/src/coverNotAvailable.jpg?raw=true';

const pluginId = 'DDL.com';

const sourceName = 'Divine Dao Library';

const baseUrl = 'https://www.divinedaolibrary.com/';

async function popularNovels  (page) {
  let url = baseUrl + 'novels';

  const result = await fetchApi(url);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('#main')
    .find('li')
    .each(function () {
      const novelName = loadedCheerio(this).find('a').text();
      const novelCover = defaultCoverUri;
      const novelUrl = loadedCheerio(this).find(' a').attr('href');

      const novel = {
        name: novelName,
        cover: novelCover,
        url: novelUrl,
      };

      novels.push(novel);
    });

  return novels;
};

async function parseNovelAndChapters  (novelUrl) {
  const url = novelUrl;

  const result = await fetchApi(url);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  let novel = {url };

  novel.name = loadedCheerio('h1.entry-title').text().trim();

  novel.cover =
    loadedCheerio('.entry-content').find('img').attr('data-ezsrc') || defaultCoverUri;

  novel.summary = loadedCheerio('#main > article > div > p:nth-child(6)')
    .text()
    .trim();

  novel.genres = null;

  novel.status = null;

  novel.author = loadedCheerio('#main > article > div > h3:nth-child(2)')
    .text()
    .replace(/Author:/g, '')
    .trim();

  let novelChapters = [];

  loadedCheerio('#main')
    .find('li > span > a')
    .each(function () {
      const chapterName = loadedCheerio(this).text().trim();
      const releaseDate = null;
      const chapterUrl = loadedCheerio(this).attr('href');

      novelChapters.push({ name: chapterName, releaseTime: releaseDate, url: chapterUrl });
    });

  novel.chapters = novelChapters;

  return novel;
};

async function parseChapter  (chapterUrl) {
  const url = chapterUrl;

  const result = await fetchApi(url);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  let chapterName = loadedCheerio('.entry-title').text().trim();

  let chapterText = loadedCheerio('.entry-content').html();

  if (!chapterText) {
    chapterText = loadedCheerio('.page-header').html();
  }

  chapterText = `<p><h1>${chapterName}</h1></p>` + chapterText;

  return chapterText;
};

async function searchNovels  (searchTerm)  {
  let url = baseUrl + 'novels';

  const result = await fetchApi(url);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('#main')
    .find('li')
    .each(function () {
      const novelName = loadedCheerio(this).find('a').text();
      const novelCover = defaultCoverUri;
      const novelUrl = loadedCheerio(this).find(' a').attr('href');

      const novel = {
        name: novelName,
        cover: novelCover,
        url: novelUrl,
      };

      novels.push(novel);
    });

  novels = novels.filter(novel =>
    novel.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return novels;
};

module.exports = {
    id: pluginId,
    name: sourceName,
    site: baseUrl,
    version: '1.0.0',
    lang: languages.English,
    icon: 'src/en/divinedaolibrary/icon.png',
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};
