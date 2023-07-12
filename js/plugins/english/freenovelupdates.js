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
const showToast = require('@libs/showToast').default;
const isUrlAbsolute = require('@libs/isAbsoluteUrl').default;
const pluginId = 'freenovelupdates';
const baseUrl = 'https://www.freenovelupdates.com';
function popularNovels(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${baseUrl}genres/light-novel-1002`;
        const body = yield fetchApi(url, {}, pluginId).then(r => r.text());
        const loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('.books-item').each(function () {
            let novelUrl = loadedCheerio(this).find('a').attr('href');
            if (novelUrl && !isUrlAbsolute(novelUrl)) {
                novelUrl = baseUrl + novelUrl;
            }
            if (novelUrl) {
                const novelName = loadedCheerio(this).find('.title').text().trim();
                let novelCover = loadedCheerio(this).find('img').attr('src');
                if (novelCover && !isUrlAbsolute(novelCover)) {
                    novelCover = baseUrl + novelCover;
                }
                const novel = {
                    name: novelName,
                    cover: novelCover,
                    url: novelUrl,
                };
                novels.push(novel);
            }
        });
        return novels;
    });
}
function parseNovelAndChapters(novelUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = novelUrl;
        const body = yield fetchApi(url, {}, pluginId).then(r => r.text());
        let loadedCheerio = cheerio.load(body);
        const novel = {
            url,
            chapters: [],
        };
        novel.name = loadedCheerio('h1').text();
        let novelCover = loadedCheerio('.img > img').attr('src');
        novel.cover = novelCover
            ? isUrlAbsolute(novelCover)
                ? novelCover
                : baseUrl + novelCover
            : undefined;
        novel.summary = loadedCheerio('.description-content').text().trim();
        novel.author = loadedCheerio('.author').text().trim();
        novel.genres = loadedCheerio('.category').text().trim();
        novel.status = loadedCheerio('.status').text().trim();
        loadedCheerio('.chapter').each(function () {
            var _a;
            let chapterUrl = loadedCheerio(this).find('a').attr('href');
            if (chapterUrl && !isUrlAbsolute(chapterUrl)) {
                chapterUrl = baseUrl + chapterUrl;
            }
            if (chapterUrl) {
                const chapterName = loadedCheerio(this).find('a').text().trim();
                const releaseDate = null;
                const chapter = {
                    name: chapterName,
                    releaseTime: releaseDate,
                    url: chapterUrl,
                };
                (_a = novel.chapters) === null || _a === void 0 ? void 0 : _a.push(chapter);
            }
        });
        return novel;
    });
}
function parseChapter(chapterUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = yield fetchApi(chapterUrl, {}, pluginId).then(r => r.text());
        const loadedCheerio = cheerio.load(body);
        const chapterText = loadedCheerio('.content').html() || '';
        return chapterText;
    });
}
function searchNovels(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        showToast('Search is not available in this source');
        return [];
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
    name: 'Free Novel Updates (Broken)',
    version: '1.0.0',
    icon: 'src/en/freenovelupdates/icon.png',
    site: baseUrl,
    protected: false,
    fetchImage,
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
};
