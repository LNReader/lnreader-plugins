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
const Status = require('@libs/novelStatus').default;
const pluginId = "novelringan.com";
const sourceName = 'NovelRingan';
const baseUrl = 'https://novelringan.com/';
const coverUriPrefix = 'https://i0.wp.com/novelringan.com/wp-content/uploads/';
function popularNovels(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${baseUrl}/top-novel/page/${page}`;
        const result = yield fetchApi(url);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        const novels = [];
        loadedCheerio('article.post').each(function () {
            var _a;
            const novelName = (_a = loadedCheerio(this).find('.entry-title').text()) === null || _a === void 0 ? void 0 : _a.trim();
            const novelCover = coverUriPrefix + loadedCheerio(this).find('img').attr('data-sxrx');
            const novelUrl = loadedCheerio(this).find('h2 > a').attr('href');
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
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const url = novelUrl;
        const result = yield fetchApi(url);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        let novel = {
            url,
            name: '',
            cover: '',
            genres: '',
            author: '',
            status: Status.Unknown,
            artist: '',
            summary: '',
            chapters: [],
        };
        novel.name = (_a = loadedCheerio('.entry-title').text()) === null || _a === void 0 ? void 0 : _a.trim();
        novel.cover =
            coverUriPrefix + loadedCheerio('img.ts-post-image').attr('data-sxrx');
        novel.summary = loadedCheerio('body > div.site-container > div > main > article > div > div.maininfo > span > p').text();
        let genreSelector = loadedCheerio('body > div.site-container > div > main > article > div > div.maininfo > span > ul > li:nth-child(4)').text();
        novel.genres = genreSelector.includes('Genre')
            ? genreSelector.replace('Genre:', '').trim()
            : '';
        let statusSelector = loadedCheerio('body > div.site-container > div > main > article > div > div.maininfo > span > ul > li:nth-child(3)').text();
        novel.status = statusSelector.includes('Status')
            ? statusSelector.replace('Status:', '').trim()
            : Status.Unknown;
        let chapters = [];
        loadedCheerio('.bxcl > ul > li').each(function () {
            const chapterName = loadedCheerio(this).find('a').text();
            const releaseDate = null;
            const chapterUrl = loadedCheerio(this).find('a').attr('href');
            const chapter = {
                name: chapterName,
                releaseTime: releaseDate,
                url: chapterUrl,
            };
            chapters.push(chapter);
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
        const loadedCheerio = cheerio.load(body);
        loadedCheerio('.entry-content div[style="display:none"]').remove();
        const chapterText = loadedCheerio('.entry-content').html();
        return chapterText;
    });
}
;
function searchNovels(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = baseUrl + '?s=' + searchTerm;
        const result = yield fetchApi(url);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('article.post').each(function () {
            const novelName = loadedCheerio(this).find('.entry-title').text();
            const novelCover = coverUriPrefix + loadedCheerio(this).find('img').attr('data-sxrx');
            const novelUrl = loadedCheerio(this).find('h2 > a').attr('href');
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
module.exports = {
    id: pluginId,
    name: sourceName,
    site: baseUrl,
    icon: 'src/id/novelringan/icon.png',
    version: '1.0.0',
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};
