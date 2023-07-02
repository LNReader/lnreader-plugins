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
const fetchApi = require('@libs/fetchApi');
const fetchFile = require('@libs/fetchFile');
const pluginId = 'novelhold';
const baseUrl = 'https://novelhold.com/';
function popularNovels(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${baseUrl}all-${page}.html`;
        const body = yield fetchApi(url).then(r => r.text());
        const loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('#article_list_content > li').each(function () {
            const novelName = loadedCheerio(this)
                .find('h3')
                .text()
                .replace(/\t+/g, '')
                .replace(/\n/g, ' ');
            const novelCover = loadedCheerio(this).find('img').attr('data-src');
            const novelUrl = baseUrl + loadedCheerio(this).find('a').attr('href').slice(1);
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
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const url = novelUrl;
        const body = yield fetchApi(url).then(r => r.text());
        let loadedCheerio = cheerio.load(body);
        const novel = {
            url,
            chapters: [],
        };
        novel.name = loadedCheerio('.booknav2 > h1').text();
        novel.cover = loadedCheerio('meta[property="og:image"]').attr('content');
        novel.summary = loadedCheerio('.navtxt').text().trim();
        novel.author = loadedCheerio('p:contains("Author")')
            .text()
            .replace('Author：', '')
            .trim();
        novel.status = loadedCheerio('p:contains("Status")')
            .text()
            .replace('Status：', '')
            .replace('Active', 'Ongoing')
            .trim();
        novel.genre = (_a = loadedCheerio('p:contains("Genre")')
            .text()) === null || _a === void 0 ? void 0 : _a.replace('Genre：', '').trim();
        let chapter = [];
        loadedCheerio('ul.chapterlist > li').each(function () {
            const chapterName = loadedCheerio(this).find('a').text().trim();
            const releaseDate = null;
            const chapterUrl = baseUrl + loadedCheerio(this).find('a').attr('href').slice(1);
            chapter.push({
                name: chapterName,
                releaseTime: releaseDate,
                url: chapterUrl,
            });
        });
        novel.chapters = chapter;
        console.log(novel);
        return novel;
    });
}
function parseChapter(chapterUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = yield fetchApi(chapterUrl).then(r => r.text());
        let loadedCheerio = cheerio.load(body);
        const chapterText = loadedCheerio('.content').html();
        return chapterText;
    });
}
function searchNovels(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${baseUrl}index.php?s=so&module=book&keyword=${searchTerm}`;
        const body = yield fetchApi(url).then(r => r.text());
        let loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('#article_list_content > li').each(function () {
            const novelName = loadedCheerio(this)
                .find('h3')
                .text()
                .replace(/\t+/g, '')
                .replace(/\n/g, ' ');
            const novelCover = loadedCheerio(this).find('img').attr('data-src');
            const novelUrl = baseUrl + loadedCheerio(this).find('a').attr('href').slice(1);
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
    name: 'Novel Hold',
    version: '1.0.0',
    icon: 'src/en/novelhold/icon.png',
    site: baseUrl,
    protected: false,
    fetchImage,
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
};
