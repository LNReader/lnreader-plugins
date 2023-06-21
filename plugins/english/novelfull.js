const cheerio = require('cheerio');
const fetchApi = require('@libs/fetchApi');
const fetchFile = require('@libs/fetchFile');

const pluginId = 'novelfull';
const baseUrl = 'https://novelfull.com/';

async function popularNovels(page) {
  const url = `${baseUrl}most-popular?page=${page}`;

  const result = await fetchApi(url);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('.col-truyen-main .list-truyen .row').each(
    function () {
      const novelName = loadedCheerio(this).find('h3.truyen-title > a').text();

      const novelCover =
        baseUrl + loadedCheerio(this).find('img').attr('src').slice(1);

      const novelUrl =
        baseUrl +
        loadedCheerio(this).find('h3.truyen-title > a').attr('href').slice(1);

      const novel = {
        name: novelName,
        cover: novelCover,
        url: novelUrl,
      };

      novels.push(novel);
    },
  );

  return novels;
}

async function parseNovelAndChapters(novelUrl) {
  const url = novelUrl;

  const result = await fetchApi(url);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  const novel = {
    url,
    chapters: [],
  };

  novel.name = loadedCheerio('div.book > img').attr('alt');

  novel.cover = baseUrl + loadedCheerio('div.book > img').attr('src');

  novel.summary = loadedCheerio('div.desc-text').text().trim();

  novel.author = loadedCheerio('h3:contains("Author")')
    .parent()
    .contents()
    .text()
    .replace('Author:', '');

  novel.genre = loadedCheerio('h3:contains("Genre")')
    .siblings()
    .map((i, el) => loadedCheerio(el).text())
    .toArray()
    .join(',');

  novel.artist = null;

  novel.status = loadedCheerio('h3:contains("Status")').next().text();

  const novelId = loadedCheerio('#rating').attr('data-novel-id');

  async function getChapters(id) {
    const chapterListUrl = baseUrl + 'ajax/chapter-option?novelId=' + id;

    const data = await fetchApi(chapterListUrl);
    const chapterlist = await data.text();

    loadedCheerio = cheerio.load(chapterlist);

    let chapter = [];

    loadedCheerio('select > option').each(function () {
      const chapterName = loadedCheerio(this).text();
      const releaseDate = null;
      const chapterUrl = baseUrl + loadedCheerio(this).attr('value').slice(1);

      chapter.push({
        name: chapterName,
        releaseTime: releaseDate,
        url: chapterUrl,
      });
    });
    return chapter;
  }

  novel.chapters = await getChapters(novelId);

  return novel;
}

async function parseChapter(chapterUrl) {
  const result = await fetchApi(chapterUrl);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  loadedCheerio('#chapter-content div.ads').remove();
  let chapterText = loadedCheerio('#chapter-content').html();

  return chapterText;
}

async function searchNovels(searchTerm) {
  const searchUrl = `${baseUrl}search?keyword=${searchTerm}`;

  const result = await fetchApi(searchUrl);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('.col-truyen-main .list-truyen .row').each(
    function () {
      const novelName = loadedCheerio(this).find('h3.truyen-title > a').text();

      const novelCover =
        baseUrl + loadedCheerio(this).find('img').attr('src').slice(1);

      const novelUrl =
        baseUrl +
        loadedCheerio(this).find('h3.truyen-title > a').attr('href').slice(1);

      const novel = {
        name: novelName,
        cover: novelCover,
        url: novelUrl,
      };

      novels.push(novel);
    },
  );

  return novels;
}

async function fetchImage(url) {
  const headers = {
    Referer: baseUrl,
  };
  return await fetchFile(url, { headers: headers });
}

module.exports = {
  id: pluginId,
  name: 'NovelFull',
  version: '1.0.0',
  icon: 'src/en/novelfull/icon.png',
  site: baseUrl,
  protected: false,
  fetchImage,
  popularNovels,
  parseNovelAndChapters,
  parseChapter,
  searchNovels,
};
