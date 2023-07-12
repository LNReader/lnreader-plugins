"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const cheerio = require('cheerio');
const fetchApi = require('@libs/fetchApi').default;
const fetchFile = require('@libs/fetchFile').default;
const pluginId = 'mtlnovel';
const baseUrl = 'https://www.mtlnovel.com/';
function popularNovels(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${baseUrl}alltime-rank/page/${page}`;
        const headers = {
            Referer: `${baseUrl}`,
            'User-Agent': "'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
        };
        const body = yield fetchApi(url, {
            method: 'GET',
            headers: headers,
        }, pluginId).then(result => result.text());
        const loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('div.box.wide').each(function () {
            const novelName = loadedCheerio(this).find('a.list-title').text().slice(4);
            const novelCover = loadedCheerio(this).find('amp-img').attr('src');
            const novelUrl = loadedCheerio(this).find('a.list-title').attr('href');
            const novel = {
                name: novelName,
                cover: novelCover,
                url: novelUrl,
            };
            novels.push(novel);
        });
        return novels;
    });
}
function parseNovelAndChapters(novelUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = novelUrl;
        let headers = {
            Referer: `${baseUrl}alltime-rank/`,
            'User-Agent': "'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
        };
        const body = yield fetchApi(url, {
            method: 'GET',
            headers: headers,
        }, pluginId).then(result => result.text());
        let loadedCheerio = cheerio.load(body);
        const novel = {
            url,
            chapters: [],
        };
        novel.name = loadedCheerio('h1.entry-title').text();
        novel.cover = loadedCheerio('.nov-head > amp-img').attr('src');
        novel.summary = loadedCheerio('div.desc > h2').next().text().trim();
        novel.author = loadedCheerio('#author').text();
        novel.status = loadedCheerio('#status').text();
        novel.genre = loadedCheerio('#genre').text().replace(/\s+/g, '');
        novel.artist = null;
        const chapterListUrl = url + 'chapter-list/';
        function getChapters() {
            return __awaiter(this, void 0, void 0, function* () {
                const listResult = yield fetch(chapterListUrl);
                const listBody = yield listResult.text();
                loadedCheerio = cheerio.load(listBody);
                let chapter = [];
                loadedCheerio('div.ch-list')
                    .find('a.ch-link')
                    .each(function () {
                    const chapterName = loadedCheerio(this).text().replace('~ ', '');
                    const releaseDate = null;
                    const chapterUrl = loadedCheerio(this).attr('href');
                    chapter.push({
                        url: chapterUrl,
                        name: chapterName,
                        releaseTime: releaseDate,
                    });
                });
                return chapter.reverse();
            });
        }
        novel.chapters = yield getChapters();
        return novel;
    });
}
;
function parseChapter(chapterUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = yield fetchApi(chapterUrl, {}, pluginId).then(r => r.text());
        const loadedCheerio = cheerio.load(body);
        const chapterText = loadedCheerio('div.par').html();
        return chapterText;
    });
}
function searchNovels(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const searchUrl = baseUrl +
            'wp-admin/admin-ajax.php?action=autosuggest&q=' +
            searchTerm +
            '&__amp_source_origin=https%3A%2F%2Fwww.mtlnovel.com';
        const res = yield fetch(searchUrl);
        const result = yield res.json();
        let novels = [];
        result.items[0].results.map(item => {
            const novelName = item.title.replace(/<\/?strong>/g, '');
            const novelCover = item.thumbnail;
            const novelUrl = item.permalink.replace('https://www.mtlnovel.com/', '');
            const novel = { name: novelName, cover: novelCover, url: novelUrl };
            novels.push(novel);
        });
        return novels;
    });
}
function fetchImage(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const headers = {
            Referer: baseUrl,
        };
        return yield fetchFile(url, { headers: headers });
    });
}
module.exports = {
    id: pluginId,
    name: 'MTL Novel',
    version: '1.0.0',
    icon: 'src/en/mtlnovel/icon.png',
    site: baseUrl,
    protected: false,
    fetchImage,
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
};
