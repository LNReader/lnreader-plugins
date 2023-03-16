// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// You can use fetch above to test. Remember to remove it when commit.

/**
 * choose any lib you want
 * @cheerio and @languages are required
 * 
 */

// You can change @ to real path for convenient using
// But after you finish your job. Please change it back

const cheerio = require('cheerio');
const languages = require('@libs/languages');
// const novelStatus = require('@libs/novelStatus');
// const isUrlAbsolute = require('@libs/isAbsoluteUrl');
// const parseDate = require('@libs/parseDate');
// const htmlToText = require('@libs/htmlToText');


const popularNovels = async (pageNo) => {
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

const parseNovelAndChapters = async (novelUrl) => {
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

const parseChapter = async (chapterUrl) => {
  // Do something...
  chapterText = '';
  return chapterText;
};


const searchNovels = async (searchTerm, pageNo) => {
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

const fetchImage = async (url) => {
    // This is needed for download chapter. Because we dont save image in database
    // And some site cant fetch image normally (maybe need some headers)
    // const base64 = smt ...
    return base64; // 
};

module.exports = {
    id,       // string and must be unique.
    name,
    icon,     /** The relative path to icon without @icons . For example: 'src/vi/hakolightnovel/icon.png' */
    version,  // xx.xx.xx   For example: 1.2.12
    site,
    lang,     // must be included in languages
    description,
    fetchImage,
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
}