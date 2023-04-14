const cheerio = require('cheerio');
const fetchApi = require('@libs/fetchApi');
const fetchFile = require('@libs/fetchFile');
const languages = require('@libs/languages');
const dayjs = require('dayjs');

const pluginId = 'comrademao';

const sourceName = 'Comrade Mao';

const baseUrl = 'https://comrademao.com/';

async function popularNovels  (page) {
  let url = baseUrl + 'page/' + page + '/?post_type=novel';

  const result = await fetchApi(url);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('.listupd')
    .find('div.bs')
    .each(function () {
      const novelName = loadedCheerio(this).find('.tt').text().trim();
      const novelCover = loadedCheerio(this).find('img').attr('src');
      const novelUrl = loadedCheerio(this).find('a').attr('href');

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

  let novel = { url };

  novel.name = loadedCheerio('.entry-title').text().trim();

  novel.cover = loadedCheerio('div.thumbook > div > img').attr('src');

  novel.summary = loadedCheerio('div.infox > div:nth-child(6) > span > p')
    .text()
    .trim();

  novel.genres = loadedCheerio('div.infox > div:nth-child(4) > span')
    .text()
    .replace(/\s/g, '');

  novel.status = loadedCheerio('div.infox > div:nth-child(3) > span')
    .text()
    .trim();

  novel.author = loadedCheerio('div.infox > div:nth-child(2) > span')
    .text()
    .trim();

  let novelChapters = [];

  loadedCheerio('#chapterlist')
    .find('li')
    .each(function () {
      const releaseDate = dayjs(
        loadedCheerio(this).find('.chapterdate').text(),
      ).format('LL');
      const chapterName = loadedCheerio(this).find('.chapternum').text();
      const chapterUrl = loadedCheerio(this).find('a').attr('href');

      novelChapters.push({
        name: chapterName,
        url: chapterUrl,
        releaseTime: releaseDate,
      });
    });

  novel.chapters = novelChapters.reverse();

  return novel;
};

async function parseChapter  (chapterUrl) {
  const url = chapterUrl;

  const result = await fetchApi(url);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  let chapterText = loadedCheerio('#chaptercontent').html();

  return chapterText;
};

async function searchNovels  (searchTerm) {
  const url = baseUrl + '?s=' + searchTerm + '&post_type=novel';

  const result = await fetchApi(url);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('.listupd')
    .find('div.bs')
    .each(function () {
      const novelName = loadedCheerio(this).find('.tt').text().trim();
      const novelCover = loadedCheerio(this).find('img').attr('src');
      const novelUrl = loadedCheerio(this).find('a').attr('href');

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
    verison: '1.0.0',
    lang: languages.English,
    icon: 'src/en/comrademao/icon.png',
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};
