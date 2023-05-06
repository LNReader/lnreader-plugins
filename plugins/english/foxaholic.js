const cheerio = require('cheerio');
const languages = require('@libs/languages');
const fetchApi = require('@libs/fetchApi');
const fetchFile = require('@libs/fetchFile');

const pluginId = 'foxaholic';
const baseUrl = 'https://www.foxaholic.com/';

async function popularNovels (page){
  const link = `${baseUrl}novel/page/${page}/?m_orderby=rating`;

  const result = await fetchApi(link, {}, pluginId);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  const novels = [];

  loadedCheerio('.page-item-detail').each(function () {
    const name = loadedCheerio(this).find('.h5 > a').text();
    const cover = loadedCheerio(this).find('img').attr('data-src');
    const url = loadedCheerio(this).find('.h5 > a').attr('href');

    const novel = {
      name,
      url,
      cover,
    };

    novels.push(novel);
  });

  return novels;
};

async function parseNovelAndChapters (novelUrl){
  const url = novelUrl;
  const result = await fetchApi(url, {}, pluginId);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  const novel = {
    url,
    chapters: [],
  };

  novel.name = loadedCheerio('.post-title > h1')
    .text()
    .replace(/[\t\n]/g, '')
    .trim();

  novel.cover = loadedCheerio('.summary_image > a > img').attr('data-src');

  loadedCheerio('.post-content_item').each(function () {
    const detailName = loadedCheerio(this)
      .find('.summary-heading > h5')
      .text()
      .replace(/[\t\n]/g, '')
      .trim();
    const detail = loadedCheerio(this)
      .find('.summary-content')
      .text()
      .replace(/[\t\n]/g, '')
      .trim();

    switch (detailName) {
      case 'Genre':
        novel.genre = detail.trim().replace(/[\t\n]/g, ',');
        break;
      case 'Author':
        novel.author = detail.trim();
        break;
      case 'Novel':
        novel.status = detail.trim();
        break;
    }
  });

  loadedCheerio('.description-summary > div.summary__content')
    .find('em')
    .remove();

  novel.summary = loadedCheerio('.description-summary > div.summary__content')
    .text()
    .trim();

  let chapter = [];
  loadedCheerio('.wp-manga-chapter').each(function () {
    const name = loadedCheerio(this)
      .find('a')
      .text()
      .replace(/[\t\n]/g, '')
      .trim();
	  const releaseTime = loadedCheerio(this).find('span').text().trim();
	  const url = loadedCheerio(this).find('a').attr('href');
    
    chapter.push({ name, releaseTime, url });
  });

  novel.chapters = chapter.reverse();

  return novel;
};

async function parseChapter (chapterUrl){
  const result = await fetchApi(chapterUrl, {}, pluginId);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  let chapterText = loadedCheerio('.reading-content').html();

  return chapterText;
};

async function searchNovels (searchTerm) {
  const url = `${baseUrl}?s=${searchTerm}&post_type=wp-manga`;
  const result = await fetchApi(url, {}, pluginId);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  const novels = [];

  loadedCheerio('.c-tabs-item__content').each(function () {
    const novelName = loadedCheerio(this).find('.h4 > a').text();
    const novelCover = loadedCheerio(this).find('img').attr('data-src');
    const novelUrl = loadedCheerio(this).find('.h4 > a').attr('href');
    
    novels.push({
      name: novelName,
      url: novelUrl,
      cover: novelCover,
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
  name: 'Foxaholic',
  version: '1.0.0',
  icon: 'src/en/foxaholic/icon.png',
  site: baseUrl,
  lang: languages.English,
  description: 'Digging Pits',
  protected: false,
  fetchImage,
  popularNovels,
  parseNovelAndChapters,
  parseChapter,
  searchNovels,
};