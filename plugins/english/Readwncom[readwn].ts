
    import { load as parseHTML } from "cheerio";
    // import dayjs from 'dayjs';
    import { fetchFile, fetchApi } from "@libs/fetch";
    import { Novel, Plugin, Chapter } from "@typings/plugin";
    // import { parseMadaraDate } from "@libs/parseMadaraDate";
    // import { isUrlAbsolute } from '@libs/isAbsoluteUrl';
    // import { showToast } from "@libs/showToast";
    import { FilterInputs } from "@libs/filterInputs";
    // import { NovelStatus } from '@libs/novelStatus';
    // import { defaultCover } from "@libs/defaultCover";
    
    
    export const id = "Readwn.com";
    export const name = "Readwn.com";
    export const icon = "multisrc/readwn/icons/readwn.png";
    export const version = "1.0.0";
    export const site = "https://www.readwn.com/";
    
    const baseUrl = site;
    
    export const popularNovels: Plugin.popularNovels = async function (
        page,
        { filters, showLatestNovels }
    ) {
        const novels: Novel.Item[] = [];
        const pageNo = page - 1;

        let url = baseUrl + 'list/';
        url += (filters?.genres || 'all') + '/';
        url += (filters?.status || 'all') + '-';
        url += (showLatestNovels ? 'lastdotime' : filters?.sort || 'newstime') + '-';
        url += pageNo + '.html';

        const result = await fetchApi(url);
        const body = await result.text();
    
        const loadedCheerio = parseHTML(body);
    
    
        loadedCheerio('li.novel-item').each(function () {
            const novelName = loadedCheerio(this).find('h4').text();
            const novelUrl = baseUrl + loadedCheerio(this).find('a').attr('href');
    
            const coverUri = loadedCheerio(this)
                .find('.novel-cover > img')
                .attr('data-src');
    
            const novelCover = baseUrl + coverUri;
    
            const novel = { name: novelName, cover: novelCover, url: novelUrl };
    
            novels.push(novel);
        });
    
        return novels;
    };
    
    
    export const parseNovelAndChapters: Plugin.parseNovelAndChapters =
        async function (novelUrl) {
            const result = await fetchApi(novelUrl);
            const body = await result.text();
    
            let loadedCheerio = parseHTML(body);
    
            const novel: Novel.instance = {
                url: novelUrl,
                chapters: [],
            };
    
            novel.name = loadedCheerio('h1.novel-title').text();
    
            const coverUri = loadedCheerio('figure.cover > img').attr('data-src');
            novel.cover = baseUrl + coverUri;
    
            novel.summary = loadedCheerio('.summary')
                .text()
                .replace('Summary', '')
                .trim();
    
            novel.genres = '';
    
            loadedCheerio('div.categories > ul > li').each(function () {
                novel.genres += loadedCheerio(this).text().trim() + ',';
            });
    
            loadedCheerio('div.header-stats > span').each(function () {
                if (loadedCheerio(this).find('small').text() === 'Status') {
                    novel.status = loadedCheerio(this).find('strong').text();
                }
            });
    
            novel.genres = novel.genres.slice(0, -1);
    
            novel.author = loadedCheerio('span[itemprop=author]').text();
    
            let novelChapters: Chapter.Item[] = [];
    
            const novelId = novelUrl.replace('.html', '').replace(baseUrl, '');
    
            const latestChapterNo = parseInt(loadedCheerio('.header-stats')
                .find('span > strong')
                .first()
                .text()
                .trim());
    
            let lastChapterNo = 1;
            loadedCheerio('.chapter-list li').each(function () {
                const chapterName = loadedCheerio(this)
                    .find('a .chapter-title')
                    .text()
                    .trim();
    
                const chapterUrl = baseUrl + loadedCheerio(this).find('a').attr('href')?.trim();
    
                const releaseDate = loadedCheerio(this)
                    .find('a .chapter-update')
                    .text()
                    .trim();
    
                lastChapterNo = parseInt(loadedCheerio(this).find('a .chapter-no').text().trim());
    
                const chapter = { name: chapterName, releaseTime: releaseDate, url: chapterUrl };
    
                novelChapters.push(chapter);
            });
    
            // Itterate once more before loop to finish off
            lastChapterNo++;
            for (let i = lastChapterNo; i <= latestChapterNo; i++) {
                const chapterName = 'Chapter ' + i;
                const chapterUrl = baseUrl + novelId+'_'+ i +'.html';
                const releaseDate = null;
    
                const chapter = { name: chapterName, releaseTime: releaseDate,url:  chapterUrl };
    
                novelChapters.push(chapter);
            }
    
            novel.chapters = novelChapters;
            return novel;
        };
    
    export const parseChapter: Plugin.parseChapter = async function (chapterUrl) {
        const result = await fetchApi(chapterUrl);
        const body = await result.text();
    
        const loadedCheerio = parseHTML(body);
    
        const chapterText = loadedCheerio('.chapter-content').html();
        return chapterText;
    };
    
    export const searchNovels: Plugin.searchNovels = async (searchTerm) => {
        const novels: Novel.Item[] = [];
        const searchUrl = baseUrl + 'e/search/index.php';
    
        const result = await fetchApi(searchUrl, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Referer: baseUrl + 'search.html',
            Origin: baseUrl,
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36',
          },
          method: 'POST',
          body: JSON.stringify({
            show: 'title',
            tempid: 1,
            tbname: 'news',
            keyboard: searchTerm,
          }),
        });
        const body = await result.text();
    
        const loadedCheerio = parseHTML(body);
    
        loadedCheerio('li.novel-item').each(function () {
          const novelName = loadedCheerio(this).find('h4').text();
          const novelUrl = baseUrl + loadedCheerio(this).find('a').attr('href');
    
          const coverUri = baseUrl + loadedCheerio(this).find('img').attr('data-src');
          const novelCover = baseUrl + coverUri;
          const novel = {
            name: novelName,
            cover: novelCover,
            url: novelUrl,
          };
    
          novels.push(novel);
        });
        return novels;
    };
    
    export const fetchImage: Plugin.fetchImage = async (url) => {
        return await fetchFile(url, {});
    };

    export const filters = [{"key":"sort","label":"Sort By","values":[{"label":"New","key":"newstime"},{"label":"Popular","key":"onclick"},{"label":"Updates","key":"lastdotime"}], "inputType":FilterInputs.Picker},{"key":"status","label":"Status","values":[{"label":"All","key":"all"},{"label":"Completed","key":"Completed"},{"label":"Ongoing","key":"Ongoing"}], "inputType":FilterInputs.Picker},{"key":"genres","label":"Genre / Category","values":[{"label":"All","key":"all"},{"label":"Action","key":"action"},{"label":"Adventure","key":"adventure"},{"label":"Chinese","key":"chinese"},{"label":"Comedy","key":"comedy"},{"label":"Contemporary Romance","key":"contemporary-romance"},{"label":"Drama","key":"drama"},{"label":"Eastern Fantasy","key":"eastern-fantasy"},{"label":"Ecchi","key":"ecchi"},{"label":"Erciyuan","key":"erciyuan"},{"label":"Faloo","key":"faloo"},{"label":"Fan-Fiction","key":"fan-fiction"},{"label":"Fantasy","key":"fantasy"},{"label":"Fantasy Romance","key":"fantasy-romance"},{"label":"Game","key":"game"},{"label":"Gender Bender","key":"gender-bender"},{"label":"Harem","key":"harem"},{"label":"Hentai","key":"hentai"},{"label":"Historical","key":"historical"},{"label":"Horror","key":"horror"},{"label":"Isekai","key":"isekai"},{"label":"Japanese","key":"japanese"},{"label":"Josei","key":"josei"},{"label":"Korean","key":"korean"},{"label":"Lolicon","key":"lolicon"},{"label":"Magic","key":"magic"},{"label":"Magical Realism","key":"magical-realism"},{"label":"Martial Arts","key":"martial-arts"},{"label":"Mecha","key":"mecha"},{"label":"Military","key":"military"},{"label":"Mystery","key":"mystery"},{"label":"Official Circles","key":"official_circles"},{"label":"Psychological","key":"psychological"},{"label":"Romance","key":"romance"},{"label":"School Life","key":"school-life"},{"label":"Sci-fi","key":"sci-fi"},{"label":"Science Fiction","key":"science_fiction"},{"label":"Seinen","key":"seinen"},{"label":"Shoujo","key":"shoujo"},{"label":"Shoujo Ai","key":"shoujo-ai"},{"label":"Shounen","key":"shounen"},{"label":"Shounen Ai","key":"shounen-ai"},{"label":"Slice of Life","key":"slice-of-life"},{"label":"Sports","key":"sports"},{"label":"Supernatural","key":"supernatural"},{"label":"Suspense Thriller","key":"suspense_thriller"},{"label":"Tragedy","key":"tragedy"},{"label":"Travel Through Time","key":"travel_through_time"},{"label":"Two-dimensional","key":"two-dimensional"},{"label":"Urban","key":"urban"},{"label":"Urban Life","key":"urban-life"},{"label":"Video Games","key":"video-games"},{"label":"Virtual Reality","key":"virtual-reality"},{"label":"Wuxia","key":"wuxia"},{"label":"Wuxia Xianxia","key":"wuxia_xianxia"},{"label":"Xianxia","key":"xianxia"},{"label":"Xuanhuan","key":"xuanhuan"},{"label":"Yaoi","key":"yaoi"},{"label":"Yuri","key":"yuri"}], "inputType":FilterInputs.Picker}];