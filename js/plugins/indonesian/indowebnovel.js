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
const pluginId = "IDWN.id";
const sourceName = 'IndoWebNovel';
const baseUrl = 'https://indowebnovel.id/id/';
function popularNovels(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${baseUrl}daftar-novel/`;
        const result = yield fetchApi(url);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('.novellist-blc li').each(function () {
            const novelName = loadedCheerio(this).find('a').text();
            const novelCover = null;
            const novelUrl = loadedCheerio(this).find('a').attr('href');
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
        novel.name = loadedCheerio('.series-title').text().trim();
        novel.cover = loadedCheerio('.series-thumb > img').attr('src');
        novel.summary = loadedCheerio('.series-synops').text().trim();
        novel.status = loadedCheerio('.status').text().trim();
        novel.genres = [];
        loadedCheerio('.series-genres').each(function () {
            novel.genres.push(loadedCheerio(this).find('a').text().trim());
        });
        novel.genres = novel.genres.toString();
        let chapters = [];
        loadedCheerio('.series-chapterlist li').each(function () {
            const chapterName = loadedCheerio(this).find('a').text().trim();
            const releaseDate = null;
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
        const chapterText = loadedCheerio('.reader').html();
        return chapterText;
    });
}
;
function searchNovels(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${baseUrl}daftar-novel/`;
        const result = yield fetchApi(url);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('.novellist-blc li').each(function () {
            const novelName = loadedCheerio(this).find('a').text();
            const novelCover = null;
            const novelUrl = loadedCheerio(this).find('a').attr('href');
            const novel = {
                name: novelName,
                cover: novelCover,
                url: novelUrl,
            };
            if (novelName.toLowerCase().includes(searchTerm.toLowerCase())) {
                novels.push(novel);
            }
        });
        return novels;
    });
}
;
module.exports = {
    id: pluginId,
    name: sourceName,
    site: baseUrl,
    icon: 'src/id/indowebnovel/icon.png',
    version: '1.0.0',
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};
