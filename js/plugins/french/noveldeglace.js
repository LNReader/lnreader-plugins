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
const sourceName = 'NovelDeGlace';
const pluginId = 'NDG.com';
const baseUrl = 'https://noveldeglace.com/';
function popularNovels(page) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = baseUrl + 'roman';
        const result = yield fetchApi(url);
        const body = yield result.text();
        let loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('article').each(function () {
            const novelName = loadedCheerio(this).find('h2').text().trim();
            const novelCover = loadedCheerio(this).find('img').attr('src');
            const novelUrl = loadedCheerio(this)
                .find('h2 > a')
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
        const result = yield fetchApi(url, {}, pluginId);
        const body = yield result.text();
        let loadedCheerio = cheerio.load(body);
        let novel = { url };
        novel.name = loadedCheerio('div.entry-content > div > strong')[0].nextSibling.nodeValue.trim();
        novel.cover = loadedCheerio('.su-row > div > div > img').attr('src');
        novel.summary = loadedCheerio('div[data-title=Synopsis]').text();
        const author = loadedCheerio('div.romans > div.project-large > div.su-row > div.su-column.su-column-size-3-4 > div > div:nth-child(3) > strong')[0];
        novel.author = author ? author.nextSibling.nodeValue.trim() : null;
        novel.genres = loadedCheerio('.genre')
            .text()
            .replace('Genre : ', '')
            .replace(/, /g, ',');
        let novelChapters = [];
        loadedCheerio('.chpt').each(function () {
            const chapterName = loadedCheerio(this).find('a').text().trim();
            const releaseDate = null;
            const chapterUrl = loadedCheerio(this).find('a').attr('href');
            const chapter = {
                name: chapterName,
                releaseTime: releaseDate,
                url: chapterUrl,
            };
            novelChapters.push(chapter);
        });
        novel.chapters = novelChapters;
        return novel;
    });
}
;
function parseChapter(chapterUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = chapterUrl;
        const result = yield fetchApi(url, {}, pluginId);
        const body = yield result.text();
        let loadedCheerio = cheerio.load(body);
        let chapterText = loadedCheerio('.chapter-content').html();
        return chapterText;
    });
}
;
function searchNovels(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = baseUrl + 'roman';
        const result = yield fetchApi(url);
        const body = yield result.text();
        let loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('article').each(function () {
            const novelName = loadedCheerio(this).find('h2').text().trim();
            const novelCover = loadedCheerio(this).find('img').attr('src');
            const novelUrl = loadedCheerio(this)
                .find('h2 > a')
                .attr('href');
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
    icon: 'src/fr/noveldeglace/icon.png',
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};
