const cheerio = require('cheerio');
const fetchApi = require('@libs/fetchApi');
const fetchFile = require('@libs/fetchFile');
const languages = require('@libs/languages');
const Status = require('@libs/novelStatus');

const pluginId = "BLN.com";
const sourceName = 'BestLightNovel';

const baseUrl = 'https://bestlightnovel.com/';

async function popularNovels  (page) {
  const url =
    baseUrl + 'novel_list?type=topview&category=all&state=all&page=1' + page;

  const result = await fetchApi(url);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('.update_item.list_category').each(function () {
    const novelName = loadedCheerio(this).find('h3 > a').text();
    const novelCover = loadedCheerio(this).find('img').attr('src');
    const novelUrl = loadedCheerio(this).find('h3 > a').attr('href');

    const novel = { name: novelName, cover: novelCover, url: novelUrl };

    novels.push(novel);
  });

  return novels;
};

async function parseNovelAndChapters  (novelUrl) {
  const url = novelUrl;

  const result = await fetchApi(url);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  let novel = {
    url,
    name: '',
    cover: '',
    author: '',
    status: Status.Unknown,
    genres: '',
    summary: '',
    chapters: [],
  };

  novel.name = loadedCheerio('.truyen_info_right  h1').text().trim();
  novel.cover = loadedCheerio('.info_image img').attr('src');
  novel.summary = loadedCheerio('#noidungm').text()?.trim();
  novel.author = loadedCheerio(
    '#main_body > div.cotgiua > div.truyen_info_wrapper > div.truyen_info > div.entry-header > div.truyen_if_wrap > ul > li:nth-child(2) > a',
  )
    .text()
    ?.trim();

  let status = loadedCheerio(
    '#main_body > div.cotgiua > div.truyen_info_wrapper > div.truyen_info > div.entry-header > div.truyen_if_wrap > ul > li:nth-child(4) > a',
  )
    .text()
    ?.trim();

  novel.status =
    status === 'ONGOING'
      ? Status.Ongoing
      : status === 'COMPLETED'
      ? Status.Completed
      : Status.Unknown;

  let novelChapters = [];

  loadedCheerio('.chapter-list div.row').each(function () {
    const chapterName = loadedCheerio(this).find('a').text().trim();
    const releaseDate = loadedCheerio(this)
      .find('span:nth-child(2)')
      .text()
      .trim();
    const chapterUrl = loadedCheerio(this).find('a').attr('href');

    novelChapters.push({ name: chapterName, releaseTime: releaseDate, url: chapterUrl });
  });

  novel.chapters = novelChapters.reverse();

  return novel;
};

async function parseChapter  ( chapterUrl) {
  const url = chapterUrl;

  const result = await fetchApi(url);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  const chapterText = loadedCheerio('#vung_doc').html();

  return chapterText;
};

async function searchNovels (searchTerm) {
  const url = `${baseUrl}search_novels/${searchTerm}`;

  const result = await fetchApi(url);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('.update_item.list_category').each(function () {
    const novelName = loadedCheerio(this).find('h3 > a').text();
    const novelCover = loadedCheerio(this).find('img').attr('src');
    const novelUrl = loadedCheerio(this).find('h3 > a').attr('href');

    const novel = { name: novelName, cover: novelCover, url: novelUrl };

    novels.push(novel);
  });

  return novels;
};

module.exports = {
    id: pluginId,
    name: sourceName,
    site: baseUrl,
    version: '1.0.0',
    lang: languages.English,
    icon: 'src/en/bestlightnovel/icon.png',
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};