const cheerio = require('cheerio');
const fetchApi = require('@libs/fetchApi');
const languagess = require('@libs/languages');
const fetchFile = require('@libs/fetchFile');

const pluginId = 'NF.me';
const sourceName = 'NovelFull.me';

const baseUrl = 'https://novelfull.me/';

async function popularNovels (page) {
  const url = `${baseUrl}popular?page=${page}`;

  const result = await fetchApi(url);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('.book-item').each(function () {
    const novelName = loadedCheerio(this).find('.title').text();
    const novelCover =
      'https:' + loadedCheerio(this).find('img').attr('data-src');
    const novelUrl =
      baseUrl + loadedCheerio(this).find('.title a').attr('href').substring(1);

    const novel = { name: novelName, cover: novelCover, url: novelUrl };

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
    status: '',
    genres: '',
    summary: '',
    chapters: [],
  };

  novel.name = loadedCheerio('.name h1').text().trim();

  novel.cover =
    'https:' + loadedCheerio('.img-cover img').attr('data-src');

  novel.summary = loadedCheerio(
    'body > div.layout > div.main-container.book-details > div > div.row.no-gutters > div.col-lg-8 > div.mt-1 > div.section.box.mt-1.summary > div.section-body > p.content',
  )
    .text()
    .trim();

  novel.author = 'Unknown';

  novel.status = loadedCheerio(
    'body > div.layout > div.main-container.book-details > div > div.row.no-gutters > div.col-lg-8 > div.book-info > div.detail > div.meta.box.mt-1.p-10 > p:nth-child(1) > a > span',
  )
    .text()
    ?.trim();

  novel.genres = loadedCheerio(
    'body > div.layout > div.main-container.book-details > div > div.row.no-gutters > div.col-lg-8 > div.book-info > div.detail > div.meta.box.mt-1.p-10 > p:nth-child(2)',
  )
    .text()
    ?.replace('Genres :', '')
    .replace(/[\s\n]+/g, ' ')
    .trim();

  let chapters = [];

  const chaptersUrl =
    novelUrl.replace(baseUrl, 'https://novelfull.me/api/novels/') +
    '/chapters?source=detail';

  const chaptersRequest = await fetchApi(chaptersUrl);
  const chaptersHtml = await chaptersRequest.text();

  loadedCheerio = cheerio.load(chaptersHtml);

  loadedCheerio('li').each(function () {
    const chapterName = loadedCheerio(this)
      .find('.chapter-title')
      .text()
      .trim();

    const releaseDate = loadedCheerio(this)
      .find('.chapter-update')
      .text()
      .trim();

    const chapterUrl = loadedCheerio(this).find('a').attr('href');

    chapters.push({ name: chapterName, releaseTime: releaseDate, url: chapterUrl });
  });

  novel.chapters = chapters.reverse();

  return novel;
};

async function parseChapter (chapterUrl) {
  const url = chapterUrl;

  const result = await fetchApi(url);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  loadedCheerio('#listen-chapter').remove();
  loadedCheerio('#google_translate_element').remove();

  const chapterText = loadedCheerio('.chapter__content').html();

  return chapterText;
};

async function searchNovels (searchTerm) {
  const url = `${baseUrl}search?status=all&sort=views&q=${searchTerm}`;

  const result = await fetchApi(url);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('.book-item').each(function () {
    const novelName = loadedCheerio(this).find('.title').text();
    const novelCover =
      'https:' + loadedCheerio(this).find('img').attr('data-src');
    const novelUrl =
      baseUrl + loadedCheerio(this).find('.title a').attr('href').substring(1);

    const novel = {name: novelName, cover: novelCover, url: novelUrl };

    novels.push(novel);
  });

  return novels;
};

module.exports = {
    id: pluginId,
    name: sourceName,
    site: baseUrl,
    lang: languagess.English,
    version: '1.0.0',
    icon: 'src/en/novelfullme/icon.png',
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};