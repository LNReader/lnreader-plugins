const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
// fetch will be removed after generating plugin json (because it's unnecessary on RN)

/**
 * choose any lib you want
 * @cheerio and @languages are required
 * 
 */

// You can change @ to real path for convenient using 

const cheerio = require('cheerio');
const languages = require('@libs/languages');
const pluginStatus = require('@libs/pluginStatus');
// const novelStatus = require('@libs/novelStatus');
// const isUrlAbsolute = require('@libs/isAbsoluteUrl');
// const parseDate = require('@libs/parseDate');
// const htmlToText = require('@libs/htmlToText');


const popularNovels = async (pageNo) => {
  const novels = [];
  /*
    Do somethin....
  */
  return novels;
};

const parseNovelAndChapters = async (novelUrl) => {
  const novel = {
    url: novelUrl,
    chapters: [],
  };
  return novel;
};

const parseChapter = async (chapterUrl) => {
  return chapterText;
};


const searchNovels = async (searchTerm, pageNo) => {
  return novels;
};

const fetchImage = async (url) => {
    // This is needed for download chapter. Because we dont save image in database
    // And some site cant fetch image normally (maybe need some headers)
    // const base64 = smt ...
    return base64; // 
};

const valid = async () => {
    return pluginStatus.OK;
}

module.exports = {
    id,
    name,
    version,
    site,
    lang,
    description,
    valid,
    fetchImage,
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
}