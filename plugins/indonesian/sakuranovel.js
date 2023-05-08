const cheerio = require('cheerio')
const fetchApi = require('@libs/fetchApi');
const fetchFile = require('@libs/fetchFile');
const languages = require('@libs/languages');

const pluginId = "sakura.id";
const sourceName = 'SakuraNovel';

const baseUrl = 'https://sakuranovel.id/';

async function popularNovels (page) {
  const url = `${baseUrl}advanced-search/page/${page}/?title&author&yearx&status&type&order=rating&country%5B0%5D=china&country%5B1%5D=jepang&country%5B2%5D=unknown`;

  const result = await fetchApi(url, {}, pluginId);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('.flexbox2-item').each(function () {
    const novelName = loadedCheerio(this)
      .find('.flexbox2-title span')
      .first()
      .text();
    const novelCover = loadedCheerio(this).find('img').attr('src');
    const novelUrl = loadedCheerio(this)
      .find('.flexbox2-content > a')
      .attr('href');

    const novel = {name: novelName, cover: novelCover, url: novelUrl };

    novels.push(novel);
  });

  return novels;
};

async function parseNovelAndChapters (novelUrl) {
  const result = await fetchApi(novelUrl, {}, pluginId);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  let novel = {
    name: sourceName,
    url: novelUrl,
  };

  novel.name = loadedCheerio('.series-title h2').text().trim();

  novel.cover = loadedCheerio('.series-thumb img').attr('src');

  loadedCheerio('.series-infolist > li').each(function () {
    const detailName = loadedCheerio(this).find('b').text().trim();
    const detail = loadedCheerio(this).find('b').next().text().trim();

    switch (detailName) {
      case 'Author':
        novel.author = detail;
        break;
    }
  });

  novel.status = loadedCheerio('.status').text().trim();

  novel.genres = loadedCheerio('.series-genres')
    .prop('innerHTML')
    .replace(/<.*?>(.*?)<.*?>/g, '$1,')
    .slice(0, -1);

  novel.summary = loadedCheerio('.series-synops').text().trim();

  let chapters = [];

  loadedCheerio('.series-chapterlist li').each(function () {
    const chapterName = loadedCheerio(this)
      .find('a span')
      .first()
      .text()
      .replace(`${novel.novelName} – `, '')
      .replace('Bahasa Indonesia', '')
      .replace(/\s+/g, ' ')
      .trim();

    const releaseDate = loadedCheerio(this)
      .find('a span')
      .first()
      .next()
      .text();
    const chapterUrl = loadedCheerio(this).find('a').attr('href');

    chapters.push({ name: chapterName, releaseTime: releaseDate, url: chapterUrl });
  });

  novel.chapters = chapters.reverse();

  return novel;
};

async function parseChapter (chapterUrl) {
  const result = await fetchApi( chapterUrl, {}, pluginId);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  const chapterText = loadedCheerio('.reader').html();

  return chapterText
};

async function searchNovels (searchTerm)  {
  const url = `${baseUrl}?s=${searchTerm}`;
  const result = await fetchApi(url, {}, pluginId);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('.flexbox2-item').each(function () {
    const novelName = loadedCheerio(this)
      .find('.flexbox2-title span')
      .first()
      .text();
    const novelCover = loadedCheerio(this).find('img').attr('src');
    const novelUrl = loadedCheerio(this)
      .find('.flexbox2-content > a')
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
    icon: 'src/id/sakuranovel/icon.png',
    version: '1.0.0',
    lang: languages.Indonesian,
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};