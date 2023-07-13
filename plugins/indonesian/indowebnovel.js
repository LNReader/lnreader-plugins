const cheerio = require('cheerio')
const fetchApi = require('@libs/fetchApi');
const fetchFile = require('@libs/fetchFile');

const pluginId = "IDWN.id";
const sourceName = 'IndoWebNovel';

const baseUrl = 'https://indowebnovel.id/id/';

async function popularNovels (page) {
  const url = `${baseUrl}daftar-novel/`;

  const result = await fetchApi(url);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('.novellist-blc li').each(function () {
    const novelName = loadedCheerio(this).find('a').text();
    const novelCover = null;
    const novelUrl = loadedCheerio(this).find('a').attr('href');

    const novel = {
      name: novelName,
      cover: novelCover,
      url: novelUrl,
    };

    novels.push(novel);
  });

  return  novels;
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
    status: '',
    genres: '',
    summary: '',
    chapters: [],
  };

  novel.name = loadedCheerio('.series-title').text().trim();

  novel.cover = loadedCheerio('.series-thumb > img').attr('src');

  novel.summary = loadedCheerio('.series-synops').text().trim();

  novel.status = loadedCheerio('.status').text().trim();

  novel.genres = [];

  loadedCheerio('.series-genres').each(function () {
    novel.genres.push(loadedCheerio(this).find('a').text().trim());
  });

  novel.genres = novel.genres.toString();

  let chapters = [];

  loadedCheerio('.series-chapterlist li').each(function () {
    const chapterName = loadedCheerio(this).find('a').text().trim();
    const releaseDate = null;
    const chapterUrl = loadedCheerio(this).find('a').attr('href');

    chapters.push({ name: chapterName, releaseTime: releaseDate, url: chapterUrl });
  });

  novel.chapters = chapters.reverse();

  return novel;
};

async function parseChapter  ( chapterUrl) {
  const url = chapterUrl;

  const result = await fetchApi(url);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  const chapterText = loadedCheerio('.reader').html();

  return chapterText;
};

async function searchNovels (searchTerm)  {
  const url = `${baseUrl}daftar-novel/`;

  const result = await fetchApi(url);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('.novellist-blc li').each(function () {
    const novelName = loadedCheerio(this).find('a').text();
    const novelCover = null;
    const novelUrl = loadedCheerio(this).find('a').attr('href');

    const novel = {
      name: novelName,
      cover: novelCover,
      url: novelUrl,
    };

    if (novelName.toLowerCase().includes(searchTerm.toLowerCase())) {
      novels.push(novel);
    }
  });

  return novels;
};

module.exports = {
    id: pluginId,
    name: sourceName,
    site: baseUrl,
    icon: 'src/id/indowebnovel/icon.png',
    version: '1.0.0',
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};