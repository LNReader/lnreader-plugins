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
const pluginId = 'chireads.com';
const sourceName = 'Chireads';
const baseUrl = 'https://chireads.com/';
function popularNovels(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${baseUrl}category/translatedtales/page/${page}/`;
        const result = yield fetchApi(url);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('#content li').each(function () {
            const novelName = loadedCheerio(this).find('.news-list-tit h5').text();
            const novelCover = loadedCheerio(this).find('img').attr('src');
            const novelUrl = loadedCheerio(this)
                .find('.news-list-tit h5 a')
                .attr('href');
            const novel = { name: novelName, cover: novelCover, url: novelUrl };
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
        let loadedCheerio = cheerio.load(body);
        let novel = {
            url,
            name: '',
            cover: '',
            author: '',
            artist: '',
            status: '',
            genres: '',
            summary: '',
            chapters: [],
        };
        novel.name = loadedCheerio('.inform-title').text().trim();
        novel.cover = loadedCheerio('.inform-product img').attr('src');
        novel.summary = loadedCheerio('.inform-inform-txt').text().trim();
        let chapters = [];
        loadedCheerio('.chapitre-table a').each(function () {
            const chapterName = loadedCheerio(this).text().trim();
            const releaseDate = null;
            const chapterUrl = loadedCheerio(this).attr('href');
            chapters.push({ name: chapterName, releaseTime: releaseDate, url: chapterUrl });
        });
        novel.chapters = chapters;
        return novel;
    });
}
;
function parseChapter(chapterUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = chapterUrl;
        const result = yield fetchApi(url);
        const body = yield result.text();
        let loadedCheerio = cheerio.load(body);
        const chapterText = loadedCheerio('#content').html();
        return chapterText;
    });
}
;
function searchNovels(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${baseUrl}search?x=0&y=0&name=${searchTerm}`;
        const result = yield fetchApi(url);
        const body = yield result.text();
        let loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('#content li').each(function () {
            const novelName = loadedCheerio(this).find('.news-list-tit h5').text();
            const novelCover = loadedCheerio(this).find('img').attr('src');
            const novelUrl = loadedCheerio(this)
                .find('.news-list-tit h5 a')
                .attr('href');
            const novel = { name: novelName, cover: novelCover, url: novelUrl };
            novels.push(novel);
        });
        return novels;
    });
}
;
module.exports = {
    id: pluginId,
    name: sourceName,
    site: baseUrl,
    version: '1.0.0',
    icon: 'src/fr/chireads/icon.png',
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};
