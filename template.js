// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// You can use fetch above to test. Remember to comment or remove it when commit.

/**
 * choose any lib you want
 * @cheerio and @languages are required
 * 
 */

const cheerio = require('cheerio');
const languages = require('@libs/languages');
// const novelStatus = require('@libs/novelStatus');
// const isUrlAbsolute = require('@libs/isAbsoluteUrl');
// const parseDate = require('@libs/parseDate');
// const htmlToText = require('@libs/htmlToText');


async function popularNovels (pageNo) {
  const novels = [];
  /*
    Do something....
    novel = {
      name: '',
      url: '',      must be absoulute
      cover: '',    
    }
    novels.push(novel);
  */
  return novels;
};

async function parseNovelAndChapters (novelUrl) {
  const novel = {
    url: novelUrl,
    chapters: [],
  };

  /**
   * novel.name = '';
   * novel.cover = '';
   * novel.summary = '';
   * novel.author = '';
   * novel.artist = '';
   * novel.status = '';   use @novelStatus
   * novel.genres = '';   join by commas. For example: 'romcom, action, school'
   */

  /*
    Do something....
    chapter = {
      name: '',
      url: '',      must be absoulute
      releaseTime: '',
    }
    novel.chapters.push(chapter);
  */

  return novel;
};

async function parseChapter (chapterUrl) {
  // Do something...
  chapterText = '';
  return chapterText;
};


async function searchNovels (searchTerm, pageNo) {
  novels = [];
  /*
    Do something....
    novel = {
      name: '',
      url: '',      must be absoulute
      cover: '',    
    }
    novels.push(novel);
  */
  return novels;
};

async function fetchImage (url) {
    // This is needed for download chapter. Because we dont save image in database
    // And some site cant fetch image normally (maybe need some headers)
    // const base64 = smt ...
    return base64; // 
};

module.exports = {
    id,       // string and must be unique.
    name: 'Source name',
    icon,     /** The relative path to the icon without @icons . For example: 'src/vi/hakolightnovel/icon.png' */
    version,  // xx.xx.xx   For example: 1.2.12
    site,
    lang: languages.English,     // must be included in languages
    description: 'This is descriptions',
    fetchImage,
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
}