const cheerio = require('cheerio');
const fetchApi = require('@libs/fetchApi');
const fetchFile = require('@libs/fetchFile');
const languages = require('@libs/languages');

const pluginId = 'chireads.com';
const sourceName = 'Chireads';

const baseUrl = 'https://chireads.com/';

async function popularNovels (page) {
  const url = `${baseUrl}category/translatedtales/page/${page}/`;

  const result = await fetchApi(url);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('#content li').each(function () {
    const novelName = loadedCheerio(this).find('.news-list-tit h5').text();
    const novelCover = loadedCheerio(this).find('img').attr('src');
    const novelUrl = loadedCheerio(this)
      .find('.news-list-tit h5 a')
      .attr('href');

    const novel = { name: novelName, cover: novelCover, url :novelUrl };

    novels.push(novel);
  });

  return novels;
};

async function parseNovelAndChapters (novelUrl) {
  const url = novelUrl;

  const result = await fetchApi(url);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  let novel = {
    url,
    name: '',
    cover: '',
    author: '',
    artist: '',
    status: '',
    genres: '',
    summary: '',
    chapters: [],
  };

  novel.name = loadedCheerio('.inform-title').text().trim();

  novel.cover = loadedCheerio('.inform-product img').attr('src');

  novel.summary = loadedCheerio('.inform-inform-txt').text().trim();

  let chapters = [];

  loadedCheerio('.chapitre-table a').each(function () {
    const chapterName = loadedCheerio(this).text().trim();
    const releaseDate = null;
    const chapterUrl = loadedCheerio(this).attr('href');

    chapters.push({ name: chapterName, releaseTime: releaseDate, url: chapterUrl });
  });

  novel.chapters = chapters;

  return novel;
};

async function parseChapter (chapterUrl) {
  const url = chapterUrl;

  const result = await fetchApi(url);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  const chapterText = loadedCheerio('#content').html();

  return chapterText;
};

async function searchNovels (searchTerm) {
  const url = `${baseUrl}search?x=0&y=0&name=${searchTerm}`;

  const result = await fetchApi(url);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('#content li').each(function () {
    const novelName = loadedCheerio(this).find('.news-list-tit h5').text();
    const novelCover = loadedCheerio(this).find('img').attr('src');
    const novelUrl = loadedCheerio(this)
      .find('.news-list-tit h5 a')
      .attr('href');

    const novel = { name: novelName, cover: novelCover, url: novelUrl };

    novels.push(novel);
  });
  return novels;
};

module.exports = {
    id: pluginId,
    name: sourceName,
    site: baseUrl,
    version: '1.0.0',
    icon: 'src/fr/chireads/icon.png',
    lang: languages.French,
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};