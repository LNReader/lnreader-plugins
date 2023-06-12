const fetchApi = require('@libs/fetchApi');
const languages = require('@libs/languages');
const fetchFile = require('@libs/fetchFile');
const cheerio = require('cheerio');

const pluginId  = 'oasisTL.wp';
const sourceName = 'Oasis Translations';
const baseUrl = 'https://oasistranslations.wordpress.com/';

async function popularNovels  (page) {
  let url = baseUrl;

  const result = await fetchApi(url);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('.menu-item-1819')
    .find('.sub-menu > li')
    .each(function () {
      const novelName = loadedCheerio(this).text();
      if (!novelName.match(/Activas|Finalizadas|Dropeadas/)) {
        const novelCover = loadedCheerio(this).find('img').attr('src');

        let novelUrl = loadedCheerio(this).find('a').attr('href');

        const novel = {
          name: novelName,
          cover: novelCover,
          url: novelUrl,
        };

        novels.push(novel);
      }
    });

  return novels;
};

async function parseNovelAndChapters  (novelUrl) {
  const url = novelUrl

  const result = await fetchApi(url);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  let novel = {};

  novel.url = url;

  novel.name = loadedCheerio('h1.entry-title')
    .text()
    .replace(/[\t\n]/g, '')
    .trim();

  novel.cover = loadedCheerio('img[loading="lazy"]').attr('src');

  loadedCheerio('.entry-content > p').each(function (res) {
    if (loadedCheerio(this).text().includes('Autor')) {
      let details = loadedCheerio(this).html();
      details = details.match(/<\/strong>(.|\n)*?<br>/g);
      details = details.map(detail =>
        detail.replace(/<strong>|<\/strong>|<br>|:\s/g, ''),
      );

      novel.genres = '';

      novel.author = details[2];
      novel.genres = details[4].replace(/\s|&nbsp;/g, '');
      novel.artist = details[3];
    }
  });

  // let novelSummary = $(this).next().html();
  novel.summary = '';

  let novelChapters = [];

  // if ($(".entry-content").find("li").length) {
  loadedCheerio('.entry-content')
    .find('a')
    .each(function () {
      let chapterUrl = loadedCheerio(this).attr('href');

      if (chapterUrl && chapterUrl.includes(baseUrl)) {
        const chapterName = loadedCheerio(this).text();
        const releaseDate = null;

        const chapter = { name: chapterName, releaseTime: releaseDate, url: chapterUrl };

        novelChapters.push(chapter);
      }
    });

  novel.chapters = novelChapters;

  return novel;
};

async function parseChapter  (chapterUrl) {
  const url = chapterUrl;

  const result = await fetchApi(url);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  loadedCheerio('div#jp-post-flair').remove();

  let chapterText = loadedCheerio('.entry-content').html();

  return chapterText;
};

async function searchNovels  (searchTerm) {
  searchTerm = searchTerm.toLowerCase();

  let url = baseUrl;

  const result = await fetchApi(url);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  let novels = [];
  loadedCheerio('.menu-item-1819')
    .find('.sub-menu > li')
    .each(function () {
      const novelName = loadedCheerio(this).text();
      if (!novelName.match(/Activas|Finalizadas|Dropeadas/)) {
        const novelCover = loadedCheerio(this).find('img').attr('src');

        let novelUrl = loadedCheerio(this).find('a').attr('href');

        const novel = {
          name: novelName,
          cover: novelCover,
          url: novelUrl,
        };

        novels.push(novel);
      }
    });

  novels = novels.filter(novel =>
    novel.name.toLowerCase().includes(searchTerm),
  );

  return novels;
};

module.exports = {
    id: pluginId,
    name: sourceName,
    site: baseUrl,
    version: '1.0.0',
    icon: 'src/es/oasistranslations/icon.png',
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};