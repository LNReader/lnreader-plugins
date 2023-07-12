const cheerio = require('cheerio');
const fetchApi = require('@libs/fetchApi').default;
import fetchFile from '@libs/fetchFile';
const pluginId = 'novelforest';
const baseUrl = 'https://novelforest.com/';

async function popularNovels(page) {
  const url = `${baseUrl}popular?page=${page}`;

  const body = await fetchApi(url, {}, pluginId).then(r => r.text());

  const loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('.book-item').each(function () {
    const novelName = loadedCheerio(this).find('.title').text();
    const novelCover =
      'https:' + loadedCheerio(this).find('img').attr('data-src');
    const novelUrl =
      baseUrl + loadedCheerio(this).find('.title a').attr('href').substring(1);

    const novel = {
      name: novelName,
      cover: novelCover,
      url: novelUrl,
    };

    novels.push(novel);
  });

  return novels;
}

const parseNovelAndChapters = async novelUrl => {
  const url = novelUrl;

  const body = await fetchApi(url, {}, pluginId).then(r => r.text());

  let loadedCheerio = cheerio.load(body);

  const novel = {
    url,
    chapters: [],
  };

  novel.name = loadedCheerio('.name h1').text().trim();

  novel.cover = 'https:' + loadedCheerio('.img-cover img').attr('data-src');

  novel.summary = loadedCheerio(
    'body > div.layout > div.main-container.book-details > div > div.row.no-gutters > div.col-lg-8 > div.mt-1 > div.section.box.mt-1.summary > div.section-body > p.content',
  )
    .text()
    .trim();

  novel.author = loadedCheerio(
    'body > div.layout > div.main-container.book-details > div > div.row.no-gutters > div.col-lg-8 > div.book-info > div.detail > div.meta.box.mt-1.p-10 > p:nth-child(1) > a > span',
  )
    .text()
    ?.trim();

  novel.status = loadedCheerio(
    'body > div.layout > div.main-container.book-details > div > div.row.no-gutters > div.col-lg-8 > div.book-info > div.detail > div.meta.box.mt-1.p-10 > p:nth-child(2) > a > span',
  )
    .text()
    ?.trim();

  novel.genre = loadedCheerio(
    'body > div.layout > div.main-container.book-details > div > div.row.no-gutters > div.col-lg-8 > div.book-info > div.detail > div.meta.box.mt-1.p-10 > p:nth-child(3)',
  )
    .text()
    ?.replace('Genres :', '')
    .replace(/[\s\n]+/g, ' ')
    .trim();

  let chapter = [];

  const chaptersUrl =
    novelUrl.replace(baseUrl, 'https://novelforest.com/api/novels/') +
    '/chapters?source=detail';

  const chaptersRequest = await fetch(chaptersUrl);
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

    const chapterUrl =
      baseUrl + loadedCheerio(this).find('a').attr('href').substring(1);

    chapter.push({
      name: chapterName,
      releaseTime: releaseDate,
      url: chapterUrl,
    });
  });

  novel.chapters = chapter;

  return novel;
};

async function parseChapter(chapterUrl) {
  const body = await fetchApi(chapterUrl, {}, pluginId).then(r => r.text());

  let loadedCheerio = cheerio.load(body);

  loadedCheerio('#listen-chapter').remove();
  loadedCheerio('#google_translate_element').remove();

  const chapterText = loadedCheerio('.chapter__content').html();

  return chapterText;
}

async function searchNovels(searchTerm) {
  const url = `${baseUrl}search?q=${searchTerm}`;

  const body = await fetchApi(url, {}, pluginId).then(r => r.text());

  let loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('.book-item').each(function () {
    const novelName = loadedCheerio(this).find('.title').text();
    const novelCover =
      'https:' + loadedCheerio(this).find('img').attr('data-src');
    const novelUrl =
      baseUrl + loadedCheerio(this).find('.title a').attr('href').substring(1);

    const novel = { sourceId, novelName, novelCover, novelUrl };

    novels.push(novel);
  });

  return novels;
}

module.exports = {
  id: pluginId,
  name: 'Novel Forest (Broken)',
  version: '1.0.0',
  icon: 'src/en/novelforest/icon.png',
  site: baseUrl,
  protected: false,
  popularNovels,
  parseNovelAndChapters,
  parseChapter,
  searchNovels,
  fetchImage: fetchFile,
};
