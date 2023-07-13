const cheerio = require('cheerio');
const fetchApi = require('@libs/fetchApi');
const fetchFile = require('@libs/fetchFile');

const pluginId = 'fastnovel';
const baseUrl = 'https://fastnovel.org/';

async function popularNovels(page) {
  const url = `${baseUrl}sort/p/?page=${page}`;

  const body = await fetchApi(url, {}, pluginId).then(r => r.text());

  const loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('.col-novel-main .list-novel .row').each(function () {
    const novelName = loadedCheerio(this).find('h3.novel-title > a').text();
    const novelCover = loadedCheerio(this).find('img.cover').attr('src');
    const novelUrl = loadedCheerio(this)
      .find('h3.novel-title > a')
      .attr('href');

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

  novel.name = loadedCheerio('div.book > img').attr('alt');

  novel.cover = loadedCheerio('div.book > img').attr('src');

  novel.summary = loadedCheerio('div.desc-text').text().trim();

  loadedCheerio('ul.info > li > h3').each(function () {
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

  const novelId = loadedCheerio('#rating').attr('data-novel-id');

  async function getChapters(id) {
    const chapterListUrl = baseUrl + 'ajax/chapter-archive?novelId=' + id;

    const data = await fetchApi(chapterListUrl);
    const chapterdata = await data.text();

    loadedCheerio = cheerio.load(chapterdata);

    let chapter = [];

    loadedCheerio('ul.list-chapter > li').each(function () {
      const chapterName = loadedCheerio(this).find('a').attr('title');
      const releaseDate = null;
      const chapterUrl = loadedCheerio(this).find('a').attr('href');

      chapter.push({
        name: chapterName,
        releaseTime: releaseDate,
        url: chapterUrl,
      });
    });
    return chapter;
  }

  if (novelId) {
    novel.chapters = await getChapters(novelId);
  }

  return novel;
}

async function parseChapter(chapterUrl) {
  const body = await fetchApi(chapterUrl, {}, pluginId).then(r => r.text());

  const loadedCheerio = cheerio.load(body);

  loadedCheerio('#chr-content > div,h6,p[style="display: none;"]').remove();
  let chapterText = loadedCheerio('#chr-content').html();

  return chapterText;
}

async function searchNovels(searchTerm) {
  const url = `${baseUrl}search/?keyword=${searchTerm}`;
  const body = await fetchApi(url, {}, pluginId).then(r => r.text());

  const loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('div.col-novel-main > div.list-novel > .row').each(function () {
    const novelUrl = loadedCheerio(this)
      .find('h3.novel-title > a')
      .attr('href');

    const novelName = loadedCheerio(this).find('h3.novel-title > a').text();
    const novelCover = loadedCheerio(this).find('img').attr('src');

    if (novelUrl) {
      novels.push({
        url: novelUrl,
        name: novelName,
        cover: novelCover,
      });
    }
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
  name: 'Fast Novel',
  version: '1.0.0',
  icon: 'src/en/fastnovel/icon.png',
  site: baseUrl,
  protected: false,
  fetchImage,
  popularNovels,
  parseNovelAndChapters,
  parseChapter,
  searchNovels,
};
