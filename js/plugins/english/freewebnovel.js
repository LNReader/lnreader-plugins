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
const pluginId = 'FWN.com';
const sourceName = "Web NOVEL";
const baseUrl = 'https://freewebnovel.com/';
function popularNovels(page) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = baseUrl + 'completed-novel/' + page;
        const result = yield fetchApi(url);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('.li-row').each(function () {
            const novelName = loadedCheerio(this).find('.tit').text();
            const novelCover = loadedCheerio(this).find('img').attr('src');
            let novelUrl = 'https://freewebnovel.com' + loadedCheerio(this)
                .find('h3 > a')
                .attr('href');
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
        let novel = {};
        novel.url = url;
        novel.name = loadedCheerio('h1.tit').text();
        novel.cover = loadedCheerio('.pic > img').attr('src');
        novel.genres = loadedCheerio('[title=Genre]')
            .next()
            .text()
            .replace(/[\t\n]/g, '');
        novel.author = loadedCheerio('[title=Author]')
            .next()
            .text()
            .replace(/[\t\n]/g, '');
        novel.artist = null;
        novel.status = loadedCheerio('[title=Status]')
            .next()
            .text()
            .replace(/[\t\n]/g, '');
        let novelSummary = loadedCheerio('.inner').text().trim();
        novel.summary = novelSummary;
        let novelChapters = [];
        let latestChapter;
        loadedCheerio('h3.tit').each(function (res) {
            if (loadedCheerio(this).find('a').text() === novel.name) {
                latestChapter = loadedCheerio(this)
                    .next()
                    .find('span.s3')
                    .text()
                    .match(/\d+/);
            }
        });
        latestChapter = latestChapter[0];
        let prefixUrl = novelUrl.replace('.html', '/');
        for (let i = 1; i <= parseInt(latestChapter, 10); i++) {
            const chapterName = 'Chapter ' + i;
            const releaseDate = null;
            let chapterUrl = 'chapter-' + i;
            chapterUrl = `${prefixUrl}${chapterUrl}.html`;
            const chapter = { name: chapterName, releaseTime: releaseDate, url: chapterUrl };
            novelChapters.push(chapter);
        }
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
        let chapterText = loadedCheerio('div.txt').html();
        return chapterText;
    });
}
;
function searchNovels(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = baseUrl + 'search/';
        const formData = {
            searchkey: searchTerm,
        };
        const result = yield fetchApi(url, {
            method: 'POST',
            body: formData,
        });
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('.li-row > .li > .con').each(function () {
            const novelName = loadedCheerio(this).find('.tit').text();
            const novelCover = loadedCheerio(this)
                .find('.pic > a > img')
                .attr('data-cfsrc');
            let novelUrl = "https://freewebnovel.com" + loadedCheerio(this)
                .find('h3 > a')
                .attr('href');
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
    version: '1.0.0',
    icon: 'src/en/freewebnovel/icon.png',
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};
