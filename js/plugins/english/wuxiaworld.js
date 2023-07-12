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
const pluginId = 'wuxiaworld';
const baseUrl = 'https://www.wuxiaworld.com/';
function popularNovels(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const link = `${baseUrl}api/novels`;
        const result = yield fetchApi(link, {}, pluginId);
        const data = yield result.json();
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
        return novels;
    });
}
;
function parseNovelAndChapters(novelUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = novelUrl;
        console.log(url);
        const result = yield fetchApi(url, {}, pluginId);
        const body = yield result.text();
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
        novel.genres = genres.join(',');
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
        return novel;
    });
}
;
function parseChapter(chapterUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield fetchApi(chapterUrl, {}, pluginId);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        loadedCheerio('.chapter-nav').remove();
        loadedCheerio('#chapter-content > script').remove();
        let chapterText = loadedCheerio('#chapter-content').html();
        return chapterText;
    });
}
;
function searchNovels(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const searchUrl = 'https://www.wuxiaworld.com/api/novels/search?query=';
        const url = `${searchUrl}${searchTerm}`;
        const result = yield fetchApi(url);
        const data = yield result.json();
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
    });
}
;
function fetchImage(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const headers = {
            Referer: baseUrl,
        };
        return yield fetchFile(url, { headers: headers });
    });
}
;
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
