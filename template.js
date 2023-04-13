const cheerio = require('cheerio');
const languages = require('@libs/languages');
const fetchApi = require('@libs/fetchApi');
const fetchFile = require('@libs/fetchFile');
// const novelStatus = require('@libs/novelStatus');
// const isUrlAbsolute = require('@libs/isAbsoluteUrl');
// const parseDate = require('@libs/parseDate');


async function popularNovels (pageNo) {
  const novels = [];
  /*
    Do something....
    novel = {
      name: '',
      url: '',      must be absolute
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
      url: '',      must be absolute
      cover: '',    
    }
    novels.push(novel);
  */
  return novels;
};

async function fetchImage (url) {
    // Some site cant fetch images normally (maybe need some headers)
    // Must return base64 of image
    return await fetchFile(url, {});
};

module.exports = {
    id,       // string and must be unique. For example: languages.Vietnamese + 'Hako';
    name: 'Source name',
    icon,     /** The relative path to the icon without @icons . For example: 'src/vi/hakolightnovel/icon.png' */
    version,  // xx.xx.xx   For example: 1.2.12
    site,
    lang: languages.English,     // must be included in languages
    description: 'This is descriptions',
    protected: false,   // true if this site protect its resources (images) and you have to define header or smt to bypass
    filters,
    fetchImage,
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
}