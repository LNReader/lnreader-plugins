const cheerio = require('cheerio');
const fetchApi = require('@libs/fetchApi').default;
const fetchFile = require('@libs/fetchFile').default;
const showToast = require('@libs/showToast').default;
const isUrlAbsolute = require('@libs/isAbsoluteUrl').default;

const pluginId = 'freenovelupdates';
const baseUrl = 'https://www.freenovelupdates.com';

async function popularNovels(page) {
  const url = `${baseUrl}genres/light-novel-1002`;

  const body = await fetchApi(url, {}, pluginId).then(r => r.text());

  const loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('.books-item').each(function () {
    let novelUrl = loadedCheerio(this).find('a').attr('href');

    if (novelUrl && !isUrlAbsolute(novelUrl)) {
      novelUrl = baseUrl + novelUrl;
    }

    if (novelUrl) {
      const novelName = loadedCheerio(this).find('.title').text().trim();
      let novelCover = loadedCheerio(this).find('img').attr('src');

      if (novelCover && !isUrlAbsolute(novelCover)) {
        novelCover = baseUrl + novelCover;
      }

      const novel = {
        name: novelName,
        cover: novelCover,
        url: novelUrl,
      };

      novels.push(novel);
    }
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

  novel.name = loadedCheerio('h1').text();

  let novelCover = loadedCheerio('.img > img').attr('src');

  novel.cover = novelCover
    ? isUrlAbsolute(novelCover)
      ? novelCover
      : baseUrl + novelCover
    : undefined;

  novel.summary = loadedCheerio('.description-content').text().trim();

  novel.author = loadedCheerio('.author').text().trim();

  novel.genres = loadedCheerio('.category').text().trim();

  novel.status = loadedCheerio('.status').text().trim();

  loadedCheerio('.chapter').each(function () {
    let chapterUrl = loadedCheerio(this).find('a').attr('href');

    if (chapterUrl && !isUrlAbsolute(chapterUrl)) {
      chapterUrl = baseUrl + chapterUrl;
    }

    if (chapterUrl) {
      const chapterName = loadedCheerio(this).find('a').text().trim();
      const releaseDate = null;

      const chapter = {
        name: chapterName,
        releaseTime: releaseDate,
        url: chapterUrl,
      };

      novel.chapters?.push(chapter);
    }
  });

  return novel;
}

async function parseChapter(chapterUrl) {
  const body = await fetchApi(chapterUrl, {}, pluginId).then(r => r.text());

  const loadedCheerio = cheerio.load(body);

  const chapterText = loadedCheerio('.content').html() || '';

  return chapterText;
}

async function searchNovels(searchTerm) {
  showToast('Search is not available in this source');

  return [];
}

async function fetchImage(url) {
  const headers = {
    Referer: baseUrl,
  };
  return await fetchFile(url, { headers: headers });
}

module.exports = {
  id: pluginId,
  name: 'Free Novel Updates (Broken)',
  version: '1.0.0',
  icon: 'src/en/freenovelupdates/icon.png',
  site: baseUrl,
  protected: false,
  fetchImage,
  popularNovels,
  parseNovelAndChapters,
  parseChapter,
  searchNovels,
};
