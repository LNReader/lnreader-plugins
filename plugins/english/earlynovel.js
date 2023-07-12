const cheerio = require('cheerio');
const fetchApi = require('@libs/fetchApi').default;
const fetchFile = require('@libs/fetchFile').default;
const showToast = require('@libs/showToast').default;

const pluginId = 'earlynovel';
const baseUrl = 'https://earlynovel.net/';

async function popularNovels(page) {
  const url = `${baseUrl}most-popular?page=${page}`;

  const body = await fetchApi(url, {}, pluginId).then(r => r.text());

  const loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('.col-truyen-main > .list-truyen > .row').each(function () {
    const novelName = loadedCheerio(this)
      .find('h3.truyen-title > a')
      .attr('title');
    const novelCover =
      loadedCheerio(this).find('.lazyimg').attr('data-desk-image') ||
      loadedCheerio(this).find('img.cover').attr('src');
    const novelUrl =
      baseUrl +
      loadedCheerio(this).find('h3.truyen-title > a').attr('href').slice(1);

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
  showToast('Early Novel may take 20-30 seconds');
  const url = novelUrl;

  const body = await fetchApi(url, {}, pluginId).then(r => r.text());

  let loadedCheerio = cheerio.load(body);

  const novel = {
    url,
    chapters: [],
  };

  novel.name = loadedCheerio('.book > img').attr('alt');

  novel.cover = loadedCheerio('.book > img').attr('src');

  novel.summary = loadedCheerio('.desc-text').text().trim();

  loadedCheerio('.info > div > h3').each(function () {
    let detailName = loadedCheerio(this).text();
    let detail = loadedCheerio(this)
      .siblings()
      .map((i, el) => loadedCheerio(el).text())
      .toArray()
      .join(',');

    switch (detailName) {
      case 'Author:':
        novel.author = detail;
        break;
      case 'Status:':
        novel.status = detail;
        break;
      case 'Genre:':
        novel.genres = detail;
        break;
    }
  });

  //! Doesn't work since there are multiple pages and can't find source API
  //# Since cannot find sourceAPI i try similar function to lightnovelpub
  const delay = ms => new Promise(res => setTimeout(res, ms));

  let lastPage = loadedCheerio('a:contains("Last ")')
    .attr('title')
    .match(/\d+/g);

  async function getChapters() {
    let chapter = [];
    for (let i = 1; i <= lastPage; i++) {
      const chaptersUrl = `${novelUrl}?page=${i}`;

      const chaptersHtml = await fetchApi(chaptersUrl, {}, pluginId).then(r =>
        r.text(),
      );

      loadedCheerio = cheerio.load(chaptersHtml);

      loadedCheerio('ul.list-chapter > li').each(function () {
        const chapterName = loadedCheerio(this)
          .find('.chapter-text')
          .text()
          .trim();
        const releaseDate = null;
        const chapterUrl =
          baseUrl + loadedCheerio(this).find('a').attr('href').slice(1);

        chapter.push({
          name: chapterName,
          releaseTime: releaseDate,
          url: chapterUrl,
        });
      });

      await delay(1000);
    }

    return chapter;
  }

  novel.chapters = await getChapters();

  return novel;
}

async function parseChapter(chapterUrl) {
  const body = await fetchApi(chapterUrl, {}, pluginId).then(r => r.text());

  const loadedCheerio = cheerio.load(body);

  const chapterText = loadedCheerio('#chapter-c').html() || '';

  return chapterText;
}

async function searchNovels(searchTerm) {
  const url = `${baseUrl}search?keyword=${searchTerm}`;

  const body = await fetchApi(url, {}, pluginId).then(r => r.text());

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
}

async function fetchImage(url) {
  const headers = {
    Referer: baseUrl,
  };
  return await fetchFile(url, { headers: headers });
}

module.exports = {
  id: pluginId,
  name: 'Early Novel',
  version: '1.0.0',
  icon: 'multisrc/madara/icons/latestnovel.png',
  site: baseUrl,
  protected: false,
  fetchImage,
  popularNovels,
  parseNovelAndChapters,
  parseChapter,
  searchNovels,
};
