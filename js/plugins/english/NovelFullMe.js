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
const pluginId = 'NF.me';
const sourceName = 'NovelFull.me';
const baseUrl = 'https://novelfull.me/';
function popularNovels(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${baseUrl}popular?page=${page}`;
        const result = yield fetchApi(url);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('.book-item').each(function () {
            const novelName = loadedCheerio(this).find('.title').text();
            const novelCover = 'https:' + loadedCheerio(this).find('img').attr('data-src');
            const novelUrl = baseUrl + loadedCheerio(this).find('.title a').attr('href').substring(1);
            const novel = { name: novelName, cover: novelCover, url: novelUrl };
            novels.push(novel);
        });
        return novels;
    });
}
;
function parseNovelAndChapters(novelUrl) {
    var _a, _b;
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
            status: '',
            genres: '',
            summary: '',
            chapters: [],
        };
        novel.name = loadedCheerio('.name h1').text().trim();
        novel.cover =
            'https:' + loadedCheerio('.img-cover img').attr('data-src');
        novel.summary = loadedCheerio('body > div.layout > div.main-container.book-details > div > div.row.no-gutters > div.col-lg-8 > div.mt-1 > div.section.box.mt-1.summary > div.section-body > p.content')
            .text()
            .trim();
        novel.author = 'Unknown';
        novel.status = (_a = loadedCheerio('body > div.layout > div.main-container.book-details > div > div.row.no-gutters > div.col-lg-8 > div.book-info > div.detail > div.meta.box.mt-1.p-10 > p:nth-child(1) > a > span')
            .text()) === null || _a === void 0 ? void 0 : _a.trim();
        novel.genres = (_b = loadedCheerio('body > div.layout > div.main-container.book-details > div > div.row.no-gutters > div.col-lg-8 > div.book-info > div.detail > div.meta.box.mt-1.p-10 > p:nth-child(2)')
            .text()) === null || _b === void 0 ? void 0 : _b.replace('Genres :', '').replace(/[\s\n]+/g, ' ').trim();
        let chapters = [];
        const chaptersUrl = novelUrl.replace(baseUrl, 'https://novelfull.me/api/novels/') +
            '/chapters?source=detail';
        const chaptersRequest = yield fetchApi(chaptersUrl);
        const chaptersHtml = yield chaptersRequest.text();
        loadedCheerio = cheerio.load(chaptersHtml);
        loadedCheerio('li').each(function () {
            const chapterName = loadedCheerio(this)
                .find('.chapter-title')
                .text()
                .trim();
            const releaseDate = loadedCheerio(this)
                .find('.chapter-update')
                .text()
                .trim();
            const chapterUrl = loadedCheerio(this).find('a').attr('href');
            chapters.push({ name: chapterName, releaseTime: releaseDate, url: chapterUrl });
        });
        novel.chapters = chapters.reverse();
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
        loadedCheerio('#listen-chapter').remove();
        loadedCheerio('#google_translate_element').remove();
        const chapterText = loadedCheerio('.chapter__content').html();
        return chapterText;
    });
}
;
function searchNovels(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${baseUrl}search?status=all&sort=views&q=${searchTerm}`;
        const result = yield fetchApi(url);
        const body = yield result.text();
        let loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('.book-item').each(function () {
            const novelName = loadedCheerio(this).find('.title').text();
            const novelCover = 'https:' + loadedCheerio(this).find('img').attr('data-src');
            const novelUrl = baseUrl + loadedCheerio(this).find('.title a').attr('href').substring(1);
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
    icon: 'src/en/novelfullme/icon.png',
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};
