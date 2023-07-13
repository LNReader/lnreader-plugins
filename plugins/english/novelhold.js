const cheerio = require('cheerio');
const fetchApi = require('@libs/fetchApi');
const fetchFile = require('@libs/fetchFile');

const pluginId = 'novelhold';
const baseUrl = 'https://novelhold.com/';

async function popularNovels(page) {
  const url = `${baseUrl}all-${page}.html`;

  const body = await fetchApi(url).then(r => r.text());

  const loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('#article_list_content > li').each(function () {
    const novelName = loadedCheerio(this)
      .find('h3')
      .text()
      .replace(/\t+/g, '')
      .replace(/\n/g, ' ');
    const novelCover = loadedCheerio(this).find('img').attr('data-src');
    const novelUrl =
      baseUrl + loadedCheerio(this).find('a').attr('href').slice(1);

    const novel = {
      name: novelName,
      cover: novelCover,
      url: novelUrl,
    };

    novels.push(novel);
  });

  return novels;
}

async function parseNovelAndChapters(novelUrl) {
  const url = novelUrl;

  const body = await fetchApi(url).then(r => r.text());

  let loadedCheerio = cheerio.load(body);

  const novel = {
    url,
    chapters: [],
  };

  novel.name = loadedCheerio('.booknav2 > h1').text();

  novel.cover = loadedCheerio('meta[property="og:image"]').attr('content');

  novel.summary = loadedCheerio('.navtxt').text().trim();

  novel.author = loadedCheerio('p:contains("Author")')
    .text()
    .replace('Author：', '')
    .trim();

  novel.status = loadedCheerio('p:contains("Status")')
    .text()
    .replace('Status：', '')
    .replace('Active', 'Ongoing')
    .trim();

  novel.genre = loadedCheerio('p:contains("Genre")')
    .text()
    ?.replace('Genre：', '')
    .trim();

  let chapter = [];

  loadedCheerio('ul.chapterlist > li').each(function () {
    const chapterName = loadedCheerio(this).find('a').text().trim();
    const releaseDate = null;
    const chapterUrl =
      baseUrl + loadedCheerio(this).find('a').attr('href').slice(1);

    chapter.push({
      name: chapterName,
      releaseTime: releaseDate,
      url: chapterUrl,
    });
  });

  novel.chapters = chapter;
  console.log(novel);
  return novel;
}

async function parseChapter(chapterUrl) {
  const body = await fetchApi(chapterUrl).then(r => r.text());

  let loadedCheerio = cheerio.load(body);

  const chapterText = loadedCheerio('.content').html();

  return chapterText;
}

async function searchNovels(searchTerm) {
  const url = `${baseUrl}index.php?s=so&module=book&keyword=${searchTerm}`;

  const body = await fetchApi(url).then(r => r.text());

  let loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('#article_list_content > li').each(function () {
    const novelName = loadedCheerio(this)
      .find('h3')
      .text()
      .replace(/\t+/g, '')
      .replace(/\n/g, ' ');
    const novelCover = loadedCheerio(this).find('img').attr('data-src');
    const novelUrl =
      baseUrl + loadedCheerio(this).find('a').attr('href').slice(1);

    const novel = {
      name: novelName,
      cover: novelCover,
      url: novelUrl,
    };

    novels.push(novel);
  });

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
  name: 'Novel Hold',
  version: '1.0.0',
  icon: 'src/en/novelhold/icon.png',
  site: baseUrl,
  protected: false,
  fetchImage,
  popularNovels,
  parseNovelAndChapters,
  parseChapter,
  searchNovels,
};
