const cheerio = require('cheerio');
const fetchApi = require('@libs/fetchApi').default;
const fetchFile = require('@libs/fetchFile').default;

const sourceName = 'NovelDeGlace';
const pluginId = 'NDG.com';

const baseUrl = 'https://noveldeglace.com/';

async function popularNovels  (page) {
  let url = baseUrl + 'roman';

  const result = await fetchApi(url);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('article').each(function () {
    const novelName = loadedCheerio(this).find('h2').text().trim();
    const novelCover = loadedCheerio(this).find('img').attr('src');
    const novelUrl = loadedCheerio(this)
      .find('h2 > a')
      .attr('href')

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

  const result = await fetchApi(url, {}, pluginId);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  let novel = {url};

  novel.name = loadedCheerio(
    'div.entry-content > div > strong',
  )[0].nextSibling.nodeValue.trim();

  novel.cover = loadedCheerio('.su-row > div > div > img').attr('src');

  novel.summary = loadedCheerio('div[data-title=Synopsis]').text();

  const author = loadedCheerio(
    'div.romans > div.project-large > div.su-row > div.su-column.su-column-size-3-4 > div > div:nth-child(3) > strong',
  )[0];

  novel.author = author ? author.nextSibling.nodeValue.trim() : null;

  novel.genres = loadedCheerio('.genre')
    .text()
    .replace('Genre : ', '')
    .replace(/, /g, ',');

  let novelChapters = [];

  loadedCheerio('.chpt').each(function () {
    const chapterName = loadedCheerio(this).find('a').text().trim();
    const releaseDate = null;
    const chapterUrl = loadedCheerio(this).find('a').attr('href');

    const chapter = {
      name: chapterName,
      releaseTime: releaseDate,
      url: chapterUrl,
    };

    novelChapters.push(chapter);
  });

  novel.chapters = novelChapters;

  return novel;
};

async function parseChapter ( chapterUrl) {
  const url = chapterUrl;

  const result = await fetchApi(url, {}, pluginId);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  let chapterText = loadedCheerio('.chapter-content').html();
  return chapterText;
};

async function searchNovels  (searchTerm)  {
  let url = baseUrl + 'roman';

  const result = await fetchApi(url);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('article').each(function () {
    const novelName = loadedCheerio(this).find('h2').text().trim();
    const novelCover = loadedCheerio(this).find('img').attr('src');
    const novelUrl = loadedCheerio(this)
      .find('h2 > a')
      .attr('href')

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
    icon: 'src/fr/noveldeglace/icon.png',
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};