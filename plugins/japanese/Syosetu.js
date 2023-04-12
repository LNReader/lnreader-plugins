const cheerio = require('cheerio');
const languages = require('@libs/languages');
const fetchApi = require('@libs/fetchApi');
const fetchFile = require('@libs/fetchFile');
// const novelStatus = require('@libs/novelStatus');
// const isUrlAbsolute = require('@libs/isAbsoluteUrl');
// const parseDate = require('@libs/parseDate');

const pluginId = 'yomou.syosetu';

const defaultCoverUri =
    'https://github.com/LNReader/lnreader-sources/blob/main/icons/src/coverNotAvailable.jpg?raw=true';

const searchUrl = (pagenum, order) => {
    return `https://yomou.syosetu.com/search.php?order=${order || 'hyoka'}${!isNaN((pagenum = parseInt(pagenum, 10))) // check if pagenum is a number
        ? `&p=${pagenum <= 1 || pagenum > 100 ? '1' : pagenum}` // check if pagenum is between 1 and 100
        : '' // if isn't don't set ?p
        }`;
};

const novelCover = defaultCoverUri;

async function popularNovels(pageNo) {
    let novels = [];

    async function getNovelsFromPage(pagenumber) {
        // load page
        const result = await fetchApi(searchUrl(pagenumber || null));
        const body = await result.text();
        // Cheerio it!
        const cheerioQuery = cheerio.load(body, { decodeEntities: false });
        let pageNovels = [];
        // find class=searchkekka_box
        cheerioQuery('.searchkekka_box').each(function (i, e) {
            // get div with link and name
            const novelDIV = cheerioQuery(this).find('.novel_h');
            // get link element
            const novelA = novelDIV.children()[0];
            // add new novel to array
            pageNovels.push({
                name: novelDIV.text(), // get the name
                url: novelA.attribs.href, // get last part of the link
                cover: novelCover, // TODO: IDK what to do about covers... On Syo they don't have them
            });
        });
        // return all novels from this page
        return pageNovels;
    };

    novels = await getNovelsFromPage(pageNo);

    return novels;
};

async function parseNovelAndChapters(novelUrl) {
    let chapters = [];
    const result = await fetchApi(novelUrl);
    const body = await result.text();
    const cheerioQuery = cheerio.load(body, { decodeEntities: false });

    // create novel object
    let novel = {
        url: novelUrl,
        name: cheerioQuery('.novel_title').text(),
        author: cheerioQuery('.novel_writername').text().replace('作者：', ''),
        cover: novelCover,
    };

    // Get all the chapters
    const cqGetChapters = cheerioQuery('.novel_sublist2');
    if (cqGetChapters.length !== 0) {
        // has more than 1 chapter
        novel.summary = cheerioQuery('#novel_ex')
            .text()
            .replace(/<\s*br.*?>/g, '\n');
        cqGetChapters.each(function (i, e) {
            const chapterA = cheerioQuery(this).find('a');
            const [chapterName, releaseDate, chapterUrl] = [
                // set the variables
                chapterA.text(),
                cheerioQuery(this)
                    .find('dt') // get title
                    .text() // get text
                    .replace(/（.）/g, '') // remove "(edited)" mark
                    .trim(), // trim spaces
                'https://ncode.syosetu.com' + chapterA.attr('href'),
            ];
            chapters.push({ name: chapterName, releaseTime: releaseDate, url: chapterUrl });
        });
    } else {
        /**
         * Because there are oneshots on the site, they have to be treated with special care
         * that's what pisses me off in Shosetsu app. They have this extension,
         * but every oneshot is set as "there are no chapters" and all contents are thrown into the description!!
         */
        // get summary for oneshot chapter

        const nameResult = await fetchApi(searchUrl() + `&word=${novel.name}`);
        const nameBody = await nameResult.text();
        const summaryQuery = cheerio.load(nameBody, { decodeEntities: false });
        const foundText = summaryQuery('.searchkekka_box')
            .first()
            .find('.ex')
            .text()
            .replace(/\s{2,}/g, '\n');
        novel.summary = foundText;

        // add single chapter
        chapters.push({
            name: 'Oneshot',
            releaseTime: cheerioQuery('head')
                .find("meta[name='WWWC']")
                .attr('content'), // get date from metadata
            url: novelUrl, // set chapterUrl to oneshot so that chapterScraper knows it's a one-shot
        });
    }
    novel.chapters = chapters;
    return novel;
};

async function parseChapter(chapterUrl) {
    const result = await fetchApi(chapterUrl);
    const body = await result.text();

    // create cheerioQuery
    const cheerioQuery = cheerio.load(body, {
        decodeEntities: false,
    });

    let chapterText = cheerioQuery('#novel_honbun') // get chapter text
        .html();
    return chapterText;
};


async function searchNovels(searchTerm, pageNo) {
    let novels = [];

    // returns list of novels from given page
    async function getNovelsFromPage (pagenumber) {
      // load page
      const result = await fetchApi(
        searchUrl(pagenumber || null, null) + `&word=${searchTerm}`
      );
      const body = await result.text();
      // Cheerio it!
      const cheerioQuery = cheerio.load(body, { decodeEntities: false });
  
      let pageNovels = [];
      // find class=searchkekka_box
      cheerioQuery('.searchkekka_box').each(function (i, e) {
        // get div with link and name
        const novelDIV = cheerioQuery(this).find('.novel_h');
        // get link element
        const novelA = novelDIV.children()[0];
        // add new novel to array
        pageNovels.push({
          name: novelDIV.text(), // get the name
          url: novelA.attribs.href, // get last part of the link
          cover: novelCover, // TODO: IDK what to do about covers... On Syo they don't have them
        });
      });
      // return all novels from this page
      return pageNovels;
    };
  
    // counter of loaded pages
    // let pagesLoaded = 0;
    // do {
    //     // always load first one
    //     novels.push(...(await getNovelsFromPage(pagesLoaded + 1)));
    //     pagesLoaded++;
    // } while (pagesLoaded < maxPageLoad && isNext); // check if we should load more
  
    novels = await getNovelsFromPage(1);
  
    /** Use
     * novels.push(...(await getNovelsFromPage(pageNumber)))
     * if you want to load more
     */
  
    // respond with novels!
    return novels;
};

async function fetchImage(url) {

    return await fetchFile(url);
};

module.exports = {
    id: pluginId,
    name: 'Syosetu',
    icon: 'src/jp/syosetu/icon.png',
    version: '1.0.0',
    site: 'https://yomou.syosetu.com/',
    lang: languages.Japanese,
    description: '小説を読もう！は｢小説家になろう｣に投稿された',
    protected: false,
    fetchImage,
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
}