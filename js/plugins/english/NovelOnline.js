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
const pluginId = 'NO.net';
const sourceName = 'novelsOnline';
const baseUrl = 'https://novelsonline.net';
function searchNovels(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield fetchApi('https://novelsonline.net/sResults.php', {
            headers: {
                'Accept': '*/*',
                'Accept-Language': 'pl,en-US;q=0.7,en;q=0.3',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            method: 'POST',
            body: 'q=' + encodeURIComponent(searchTerm),
        }, pluginId).then(res => res.text());
        let $ = cheerio.load(result);
        const headers = $('li');
        return headers
            .map((i, h) => {
            const novelName = $(h).text();
            const novelUrl = $(h).find('a').attr('href');
            const novelCover = $(h).find('img').attr('src');
            if (!novelUrl) {
                return null;
            }
            return {
                name: novelName,
                cover: novelCover,
                url: novelUrl,
            };
        })
            .get()
            .filter(sr => sr !== null);
    });
}
;
function parseNovelAndChapters(novelUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        let novel = {
            url: novelUrl,
            chapters: [],
        };
        const result = yield fetchApi(novelUrl).then(res => res.text());
        let $ = cheerio.load(result);
        novel.name = $('h1').text();
        novel.cover = $('.novel-cover').find('a > img').attr('src');
        novel.author = $('div.novel-details > div:nth-child(5) > div.novel-detail-body')
            .find('li')
            .map((_, el) => $(el).text())
            .get()
            .join(', ');
        novel.genres = $('div.novel-details > div:nth-child(2) > div.novel-detail-body')
            .find('li')
            .map((_, el) => $(el).text())
            .get()
            .join(',');
        novel.summary = $('div.novel-right > div > div:nth-child(1) > div.novel-detail-body').text();
        novel.chapters = $('ul.chapter-chs > li > a')
            .map((_, el) => {
            const chapterUrl = $(el).attr('href');
            const chapterName = $(el).text();
            return {
                name: chapterName,
                releaseTime: '',
                url: chapterUrl,
            };
        })
            .get();
        return novel;
    });
}
;
function popularNovels(page) {
    return __awaiter(this, void 0, void 0, function* () {
        return { novels: [] }; /** TO DO */
    });
}
;
function parseChapter(chapterUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield fetchApi(chapterUrl).then(res => res.text());
        let loadedCheerio = cheerio.load(result);
        const chapterText = loadedCheerio('#contentall').html() || '';
        return chapterText;
    });
}
;
module.exports = {
    id: pluginId,
    name: sourceName,
    site: baseUrl,
    icon: 'src/coverNotAvailable.jpg',
    version: '1.0.0',
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};
