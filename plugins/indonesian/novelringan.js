const cheerio = require('cheerio')
const fetchApi = require('@libs/fetchApi');
const fetchFile = require('@libs/fetchFile');
const Status = require('@libs/novelStatus');

const pluginId = "novelringan.com";

const sourceName = 'NovelRingan';

const baseUrl = 'https://novelringan.com/';
const coverUriPrefix = 'https://i0.wp.com/novelringan.com/wp-content/uploads/';

async function popularNovels (page) {
  const url = `${baseUrl}/top-novel/page/${page}`;

  const result = await fetchApi(url);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  const novels = [];

  loadedCheerio('article.post').each(function () {
    const novelName = loadedCheerio(this).find('.entry-title').text()?.trim();
    const novelCover =
      coverUriPrefix + loadedCheerio(this).find('img').attr('data-sxrx');
    const novelUrl = loadedCheerio(this).find('h2 > a').attr('href');

    const novel = {
      name: novelName,
      cover: novelCover,
      url: novelUrl,
    };

    novels.push(novel);
  });

  return novels ;
};

async function parseNovelAndChapters  (novelUrl) {
  const url = novelUrl;

  const result = await fetchApi(url);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  let novel = {
    url,
    name: '',
    cover: '',
    genres: '',
    author: '',
    status: Status.Unknown,
    artist: '',
    summary: '',
    chapters: [],
  };

  novel.name = loadedCheerio('.entry-title').text()?.trim();
  novel.cover =
    coverUriPrefix + loadedCheerio('img.ts-post-image').attr('data-sxrx');
  novel.summary = loadedCheerio(
    'body > div.site-container > div > main > article > div > div.maininfo > span > p',
  ).text();

  let genreSelector = loadedCheerio(
    'body > div.site-container > div > main > article > div > div.maininfo > span > ul > li:nth-child(4)',
  ).text();

  novel.genres = genreSelector.includes('Genre')
    ? genreSelector.replace('Genre:', '').trim()
    : '';

  let statusSelector = loadedCheerio(
    'body > div.site-container > div > main > article > div > div.maininfo > span > ul > li:nth-child(3)',
  ).text();

  novel.status = statusSelector.includes('Status')
    ? statusSelector.replace('Status:', '').trim()
    : Status.Unknown;

  let chapters = [];

  loadedCheerio('.bxcl > ul > li').each(function () {
    const chapterName = loadedCheerio(this).find('a').text();
    const releaseDate = null;
    const chapterUrl = loadedCheerio(this).find('a').attr('href');

    const chapter = {
      name: chapterName,
      releaseTime: releaseDate,
      url: chapterUrl,
    };

    chapters.push(chapter);
  });

  novel.chapters = chapters.reverse();

  return novel;
};

async function parseChapter ( chapterUrl)  {
  const url = chapterUrl;

  const result = await fetchApi(url);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  loadedCheerio('.entry-content div[style="display:none"]').remove();

  const chapterText = loadedCheerio('.entry-content').html();

  return chapterText;
};

async function searchNovels (searchTerm) {
  const url = baseUrl + '?s=' + searchTerm;

  const result = await fetchApi(url);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('article.post').each(function () {
    const novelName = loadedCheerio(this).find('.entry-title').text();
    const novelCover =
      coverUriPrefix + loadedCheerio(this).find('img').attr('data-sxrx');

    const novelUrl = loadedCheerio(this).find('h2 > a').attr('href');

    const novel = {
      name: novelName,
      cover: novelCover,
      url: novelUrl,
    };

    novels.push(novel);
  });
  return novels;
};


module.exports = {
    id: pluginId,
    name: sourceName,
    site: baseUrl,
    icon: 'src/id/novelringan/icon.png',
    version: '1.0.0',
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};