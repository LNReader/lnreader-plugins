// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const cheerio = require('cheerio');
const isUrlAbsolute = require('@libs/isAbsoluteUrl');
const languages = require('@libs/languages');
const fetchFile = require('@libs/fetchFile');

const baseUrl = 'https://ln.hako.vn';

async function popularNovels (page) {
  const url = baseUrl + '/danh-sach?truyendich=1&sapxep=topthang&page=' + page;
  const result = await fetch(url);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  const novels = [];

  loadedCheerio('main.row > .thumb-item-flow').each(function () {
    let novelUrl = baseUrl + loadedCheerio(this)
      .find('div.thumb_attr.series-title > a')
      .attr('href');

    if (novelUrl && !isUrlAbsolute(novelUrl)) {
      novelUrl = baseUrl + novelUrl;
    }

    if (novelUrl) {
      const novelName = loadedCheerio(this).find('.series-title').text().trim();
      let novelCover = loadedCheerio(this)
        .find('.img-in-ratio')
        .attr('data-bg');

      if (novelCover && !isUrlAbsolute(novelCover)) {
        novelCover = baseUrl + novelCover;
      }

      const novel = {
        url: novelUrl,
        name: novelName,
        cover: novelCover,
      };

      novels.push(novel);
    }
  });

  return novels;
};

async function parseNovelAndChapters (novelUrl){
  const url = novelUrl;
  const result = await fetch(url);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  const novel = {
    url: novelUrl,
    chapters: [],
  };

  novel.name = loadedCheerio('.series-name').text();

  const background = loadedCheerio('.series-cover > .a6-ratio > div').attr(
    'style',
  );
  const novelCover = background.substring(
    background.indexOf('http'),
    background.length - 2,
  );

  novel.cover = novelCover
    ? isUrlAbsolute(novelCover)
      ? novelCover
      : baseUrl + novelCover
    : undefined;

  novel.summary = loadedCheerio('.summary-content').text().trim();

  novel.author = loadedCheerio(
    '#mainpart > div:nth-child(2) > div > div:nth-child(1) > section > main > div.top-part > div > div.col-12.col-md-9 > div.series-information > div:nth-child(2) > span.info-value > a',
  )
    .text()
    .trim();

  novel.genres = loadedCheerio('.series-gernes')
    .text()
    .trim()

  novel.status = loadedCheerio(
    '#mainpart > div:nth-child(2) > div > div:nth-child(1) > section > main > div.top-part > div > div.col-12.col-md-9 > div.series-information > div:nth-child(4) > span.info-value > a',
  )
    .text()
    .trim();

  loadedCheerio('.list-chapters li').each(function () {
    let chapterUrl = loadedCheerio(this).find('a').attr('href');

    if (chapterUrl && !isUrlAbsolute(chapterUrl)) {
      chapterUrl = baseUrl + chapterUrl;
    }

    if (chapterUrl) {
      const chapterName = loadedCheerio(this)
        .find('.chapter-name')
        .text()
        .trim();
      const releaseDate = loadedCheerio(this).find('.chapter-time').text();

      const chapter = {
        name: chapterName,
        releaseTime: releaseDate,
        url: chapterUrl,
      };

      novel.chapters.push(chapter);
    }
  });

  return novel;
};

async function parseChapter (chapterUrl){
  const url = chapterUrl;
  const result = await fetch(url);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  const chapterText = loadedCheerio('#chapter-content').html() || '';

  return chapterText;
};

async function searchNovels (searchTerm) {
  const url = baseUrl + '/tim-kiem?keywords=' + searchTerm;
  const result = await fetch(url);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  const novels = [];

  loadedCheerio('div.row > .thumb-item-flow').each(function () {
    let novelUrl = loadedCheerio(this)
      .find('div.thumb_attr.series-title > a')
      .attr('href');

    if (novelUrl && !isUrlAbsolute(novelUrl)) {
      novelUrl = baseUrl + novelUrl;
    }

    if (novelUrl) {
      const novelName = loadedCheerio(this).find('.series-title').text();
      let novelCover = loadedCheerio(this)
        .find('.img-in-ratio')
        .attr('data-bg');

      if (novelCover && !isUrlAbsolute(novelCover)) {
        novelCover = baseUrl + novelCover;
      }

      novels.push({
        url: novelUrl,
        name: novelName,
        cover: novelCover,
      });
    }
  });

  return novels;
};

async function fetchImage (url){
  const headers = {
    Referer: 'https://ln.hako.vn',
  }
  return await fetchFile(url, {headers: headers});
};

module.exports = {
  id: 'Tiếng Việt - 1',
  name: 'Hako',
  version: '1.0.16',
  icon: 'src/vi/hakolightnovel/icon.png',   //relative path without 'icons' prefix
  site: baseUrl,
  lang: languages.Vietnamese,
  description: 'This is description for plugin',
  protected: true,
  fetchImage,
  popularNovels,
  parseNovelAndChapters,
  parseChapter,
  searchNovels,
};