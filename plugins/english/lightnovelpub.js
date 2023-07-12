const cheerio = require('cheerio');
const fetchApi = require('@libs/fetchApi').default;
const fetchFile = require('@libs/fetchFile').default;

const baseUrl = 'https://www.lightnovelpub.com/';
const pluginId = 'lightnovelpub';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

async function popularNovels(page) {
  const url = `${baseUrl}browse/all/popular/all/${page}`;

  const body = await fetchApi(url, {}, pluginId).then(r => r.text());

  const loadedCheerio = cheerio.load(body);

  const novels = [];

  loadedCheerio('.novel-item.ads').remove();

  loadedCheerio('.novel-item').each(function () {
    const novelName = loadedCheerio(this).find('.novel-title').text().trim();
    const novelCover = loadedCheerio(this).find('img').attr('data-src');
    const novelUrl =
      baseUrl +
      loadedCheerio(this).find('.novel-title > a').attr('href').substring(1);

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

  novel.name = loadedCheerio('h1.novel-title').text().trim();

  novel.cover = loadedCheerio('figure.cover > img').attr('data-src');

  novel.genres = '';

  loadedCheerio('.categories > ul > li > a').each(function () {
    novel.genres += loadedCheerio(this).text() + ',';
  });

  novel.genres = novel.genre.slice(0, -1);

  loadedCheerio('div.header-stats > span').each(function () {
    if (loadedCheerio(this).find('small').text() === 'Status') {
      novel.status = loadedCheerio(this).find('strong').text();
    }
  });

  novel.author = loadedCheerio('.author > a > span').text();

  novel.summary = loadedCheerio('.summary > .content').text().trim();

  const delay = ms => new Promise(res => setTimeout(res, ms));

  let lastPage = 1;

  lastPage = loadedCheerio(
    '#novel > header > div.header-body.container > div.novel-info > div.header-stats > span:nth-child(1) > strong',
  )
    .text()
    ?.trim();

  lastPage = Math.ceil(lastPage / 100);

  async function getChapters() {
    let chapter = [];

    for (let i = 1; i <= lastPage; i++) {
      const chaptersUrl = `${novelUrl}/chapters/page-${i}`;

      const chaptersHtml = await fetchApi(
        chaptersUrl,
        { headers: headers },
        pluginId,
      ).then(r => r.text());

      loadedCheerio = cheerio.load(chaptersHtml);

      loadedCheerio('.chapter-list li').each(function () {
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

  let chapterText = loadedCheerio('#chapter-container').html();

  return chapterText;
}

async function searchNovels(searchTerm) {
  const url = `${baseUrl}lnsearchlive`;
  const link = `${baseUrl}search`;
  const response = await fetchApi(link, {}, pluginId).then(r => r.text());
  const token = cheerio.load(response);
  let verifytoken = token('#novelSearchForm > input').attr('value');

  let formData = new FormData();
  formData.append('inputContent', searchTerm);

  const body = await fetchApi(
    url,
    {
      method: 'POST',
      headers: { 'LNRequestVerifyToken': verifytoken },
      body: formData,
    },
    pluginId,
  ).then(r => r.text());

  let loadedCheerio = cheerio.load(body);

  let novels = [];

  let results = JSON.parse(loadedCheerio('body').text());

  loadedCheerio = cheerio.load(results.resultview);

  loadedCheerio('.novel-item').each(function () {
    const novelName = loadedCheerio(this).find('h4.novel-title').text().trim();
    const novelCover = loadedCheerio(this).find('img').attr('src');
    const novelUrl =
      baseUrl + loadedCheerio(this).find('a').attr('href').substring(1);

    novels.push({
      name: novelName,
      url: novelUrl,
      cover: novelCover,
    });
  });

  return novels;
}

async function fetchImage(url) {
  return await fetchFile(url, { headers: headers });
}

module.exports = {
  id: pluginId,
  name: 'LightNovelPub',
  version: '1.0.0',
  icon: 'src/en/lightnovelpub/icon.png',
  site: baseUrl,
  protected: true,
  fetchImage,
  popularNovels,
  parseNovelAndChapters,
  parseChapter,
  searchNovels,
};
