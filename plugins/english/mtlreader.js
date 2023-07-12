const cheerio = require('cheerio');
const fetchApi = require('@libs/fetchApi').default;
const fetchFile = require('@libs/fetchFile').default;

const pluginId = 'mtlreader';
const baseUrl = 'https://mtlreader.com/';

async function popularNovels(page) {
  const url = `${baseUrl}novels?page=${page}`;

  const body = await fetchApi(url, {}, pluginId).then(r => r.text());

  const loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('.col-md-4.col-sm-4').each(function () {
    const novelName = loadedCheerio(this).find('h5').text();
    const novelCover = loadedCheerio(this).find('img').attr('src');
    const novelUrl = loadedCheerio(this).find('h5 > a').attr('href');

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

  const body = await fetchApi(url, {}, pluginId).then(r => r.text());

  let loadedCheerio = cheerio.load(body);

  const novel = {
    url,
    chapters: [],
  };

  novel.name = loadedCheerio('.agent-title').text().trim();

  novel.cover = loadedCheerio('.agent-p-img > img').attr('src');

  novel.summary = loadedCheerio('#editdescription').text().trim();

  novel.author = loadedCheerio('i.fa-user')
    .parent()
    .text()
    .replace('Author: ', '')
    .trim();

  let chapter = [];

  loadedCheerio('tr.spaceUnder').each(function () {
    const chapterName = loadedCheerio(this).find('a').text().trim();
    const releaseDate = null;
    const chapterUrl = loadedCheerio(this).find('a').attr('href');

    chapter.push({
      name: chapterName,
      releaseTime: releaseDate,
      url: chapterUrl,
    });
  });

  novel.chapters = chapter;

  return novel;
}

async function parseChapter(chapterUrl) {
  const body = await fetchApi(chapterUrl, {}, pluginId).then(r => r.text());

  const loadedCheerio = cheerio.load(body);

  loadedCheerio('.container ins,script,p.mtlreader').remove();
  const chapterText = loadedCheerio('.container').html();

  return chapterText;
}

async function searchNovels(searchTerm) {
  const url = `${baseUrl}search?input=${searchTerm}`;

  const body = await fetchApi(url, {}, pluginId).then(r => r.text());

  let loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('.col-md-4.col-sm-4').each(function () {
    const novelName = loadedCheerio(this).find('h5').text();
    const novelCover = loadedCheerio(this).find('img').attr('src');
    const novelUrl = loadedCheerio(this).find('h5 > a').attr('href');

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
  name: 'MTL Reader',
  version: '1.0.0',
  icon: 'src/en/mtlreader/icon.png',
  site: baseUrl,
  protected: false,
  fetchImage,
  popularNovels,
  parseNovelAndChapters,
  parseChapter,
  searchNovels,
};
