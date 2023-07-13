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
const defaultCoverUri = 'https://github.com/LNReader/lnreader-sources/blob/main/icons/src/coverNotAvailable.jpg?raw=true';
const pluginId = 'DDL.com';
const sourceName = 'Divine Dao Library';
const baseUrl = 'https://www.divinedaolibrary.com/';
function popularNovels(page) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = baseUrl + 'novels';
        const result = yield fetchApi(url);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('#main')
            .find('li')
            .each(function () {
            const novelName = loadedCheerio(this).find('a').text();
            const novelCover = defaultCoverUri;
            const novelUrl = loadedCheerio(this).find(' a').attr('href');
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
;
function parseNovelAndChapters(novelUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = novelUrl;
        const result = yield fetchApi(url);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        let novel = { url };
        novel.name = loadedCheerio('h1.entry-title').text().trim();
        novel.cover =
            loadedCheerio('.entry-content').find('img').attr('data-ezsrc') || defaultCoverUri;
        novel.summary = loadedCheerio('#main > article > div > p:nth-child(6)')
            .text()
            .trim();
        novel.genres = null;
        novel.status = null;
        novel.author = loadedCheerio('#main > article > div > h3:nth-child(2)')
            .text()
            .replace(/Author:/g, '')
            .trim();
        let novelChapters = [];
        loadedCheerio('#main')
            .find('li > span > a')
            .each(function () {
            const chapterName = loadedCheerio(this).text().trim();
            const releaseDate = null;
            const chapterUrl = loadedCheerio(this).attr('href');
            novelChapters.push({ name: chapterName, releaseTime: releaseDate, url: chapterUrl });
        });
        novel.chapters = novelChapters;
        return novel;
    });
}
;
function parseChapter(chapterUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = chapterUrl;
        const result = yield fetchApi(url);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        let chapterName = loadedCheerio('.entry-title').text().trim();
        let chapterText = loadedCheerio('.entry-content').html();
        if (!chapterText) {
            chapterText = loadedCheerio('.page-header').html();
        }
        chapterText = `<p><h1>${chapterName}</h1></p>` + chapterText;
        return chapterText;
    });
}
;
function searchNovels(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = baseUrl + 'novels';
        const result = yield fetchApi(url);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('#main')
            .find('li')
            .each(function () {
            const novelName = loadedCheerio(this).find('a').text();
            const novelCover = defaultCoverUri;
            const novelUrl = loadedCheerio(this).find(' a').attr('href');
            const novel = {
                name: novelName,
                cover: novelCover,
                url: novelUrl,
            };
            novels.push(novel);
        });
        novels = novels.filter(novel => novel.name.toLowerCase().includes(searchTerm.toLowerCase()));
        return novels;
    });
}
;
module.exports = {
    id: pluginId,
    name: sourceName,
    site: baseUrl,
    version: '1.0.0',
    icon: 'src/en/divinedaolibrary/icon.png',
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};
