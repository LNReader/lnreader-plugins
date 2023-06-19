const cheerio = require('cheerio');
const fetchApi = require('@libs/fetchApi');
const fetchFile = require('@libs/fetchFile');

const pluginId = 'wuxiaworld';
const baseUrl = 'https://www.wuxiaworld.com/';

async function popularNovels(page) {
  const link = `${baseUrl}api/novels`;

  const result = await fetchApi(link, {}, pluginId);
  const data = await result.json();

  let novels = [];

  data.items.map(novel => {
    let name = novel.name;
    let cover = novel.coverUrl;
    let url = baseUrl + 'novel/' + novel.slug + '/';

    novels.push({
      name,
      cover,
      url,
    });
  });

  return  novels;
};

async function parseNovelAndChapters(novelUrl) {
  const url = novelUrl;
  console.log(url);
  const result = await fetchApi(url, {}, pluginId);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  const novel = {
    url,
    chapters: [],
  };
  
  novel.name = loadedCheerio('h1.line-clamp-2').text();

  novel.cover = loadedCheerio('img.absolute').attr('src');
  
  novel.summary = loadedCheerio('div.flex-col:nth-child(4) > div > div > span > span')
    .text()
    .trim();

  novel.author = loadedCheerio('div.MuiGrid-container > div > div > div').filter(function () {
      return loadedCheerio(this).text().trim() === 'Author:';
    })
    .next()
    .text();

  let genres = [];

  loadedCheerio('a.MuiLink-underlineNone').each(function () {
      genres.push(loadedCheerio(this).find('div > div').text());
    });

  novel.genre = genres.join(',');
  
  novel.status = null;

  novel.status = loadedCheerio('div.font-set-b10').text().includes('Complete');

  let chapter = [];

  loadedCheerio('div.border-b').each(function () {
    const name = loadedCheerio(this).find('a > div > div > div > span').text();
    const releaseTime = loadedCheerio(this).find('a > div > div > div > div > span').text();
    let url = loadedCheerio(this).find('a').attr('href').slice(1);
	  url = `${baseUrl}${url}`;

    chapter.push({ name, releaseTime, url });
  });

  novel.chapters = chapter;
  
  return novel
};

async function parseChapter(chapterUrl) {
  const result = await fetchApi(chapterUrl, {}, pluginId);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  loadedCheerio('.chapter-nav').remove();

  loadedCheerio('#chapter-content > script').remove();

  let chapterText = loadedCheerio('#chapter-content').html();

  return chapterText;
};

async function searchNovels(searchTerm) {
  const searchUrl = 'https://www.wuxiaworld.com/api/novels/search?query=';

  const url = `${searchUrl}${searchTerm}`;

  const result = await fetchApi(url);
  const data = await result.json();

  const novels = [];

  data.items.map(novel => {
    let name = novel.name;
    let cover = novel.cover;
    let url = baseUrl + 'novel/' + novel.slug + '/';

    novels.push({
      name,
      url,
      cover,
    });
  });

  return novels;
};

async function fetchImage (url){
    const headers = {
      Referer: baseUrl,
    }
    return await fetchFile(url, {headers: headers});
};

module.exports = {
    id: pluginId,
    name: 'Wuxia World (WIP)',
    version: '0.5.0',
    icon: 'src/en/wuxiaworld/icon.png',
    site: baseUrl,
    protected: true,
    fetchImage,
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
};
