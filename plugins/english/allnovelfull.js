const cheerio = require('cheerio');
const fetchApi = require('@libs/fetchApi');
const fetchFile = require('@libs/fetchFile');
const languages = require('@libs/languages');

const pluginId = 'ANF.com';
const sourceName = 'AllNovelFull';
const baseUrl = 'https://allnovelfull.com';

async function popularNovels (page) {
  const url = `${baseUrl}/most-popular?page=${page}`;

  const result = await fetchApi(url);
  console.log(result.ok);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  const novels = [];
  loadedCheerio('.col-truyen-main .list-truyen .row').each(function () {
    const novelName = loadedCheerio(this).find('h3.truyen-title > a').text();
    const novelCover =
      baseUrl + loadedCheerio(this).find('img.cover').attr('src');
    const novelUrl =
      baseUrl + loadedCheerio(this).find('h3.truyen-title > a').attr('href');

    const novel = {
      url: novelUrl,
      name: novelName,
      cover: novelCover,
    };
    console.log(novel);
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
    url: novelUrl,
  };

  novel.name = loadedCheerio('div.book > img').attr('alt');

  novel.cover = baseUrl + loadedCheerio('div.book > img').attr('src');

  novel.summary = loadedCheerio('div.desc-text').text().trim();

  novel.author = loadedCheerio('div.info > div > h3')
    .filter(function () {
      return loadedCheerio(this).text().trim() === 'Author:';
    })
    .siblings()
    .text();

  novel.genres = loadedCheerio('div.info > div')
    .filter(function () {
      return loadedCheerio(this).find('h3').text().trim() === 'Genre:';
    })
    .text()
    .replace('Genre:', '');

  novel.status = loadedCheerio('div.info > div > h3')
    .filter(function () {
      return loadedCheerio(this).text().trim() === 'Status:';
    })
    .next()
    .text();

  const novelId = loadedCheerio('#rating').attr('data-novel-id');

  async function getChapters  (id) {
    const chapterListUrl = baseUrl + '/ajax/chapter-option?novelId=' + id;

    const data = await fetchApi(chapterListUrl);
    const chapters = await data.text();

    loadedCheerio = cheerio.load(chapters);

    let novelChapters = [];

    loadedCheerio('select > option').each(function () {
      let chapterName = loadedCheerio(this).text();
      let releaseDate = null;
      let chapterUrl = loadedCheerio(this)
        .attr('value')
        ?.replace(`/${novelUrl}`, '');

      if (chapterUrl) {
        novelChapters.push({
          name: chapterName,
          releaseTime: releaseDate,
          url: chapterUrl,
        });
      }
    });

    return novelChapters;
  };

  if (novelId) {
    novel.chapters = await getChapters(novelId);
  }

  return novel;
};

async function parseChapter (chapterUrl) {
  const url = baseUrl + chapterUrl;

  const result = await fetchApi(url);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  const chapterText = loadedCheerio('#chapter-content').html() || '';

  return chapterText;
};

async function searchNovels (searchTerm){
  const url = `${baseUrl}/search?keyword=${searchTerm}`;

  const result = await fetchApi(url);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('div.col-truyen-main > div.list-truyen > .row').each(
    function () {
      const novelUrl =
        baseUrl + loadedCheerio(this).find('h3.truyen-title > a').attr('href');

      const novelName = loadedCheerio(this).find('h3.truyen-title > a').text();
      const novelCover = baseUrl + loadedCheerio(this).find('img').attr('src');

      if (novelUrl) {
        novels.push({
          url: novelUrl,
          name: novelName,
          cover: novelCover,
        });
      }
    },
  );

  return novels;
};

module.exports = {
    id: pluginId,
    name: sourceName,
    site: baseUrl,
    version: '1.0.0',
    icon: 'src/en/allnovelfull/icon.png',
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};
