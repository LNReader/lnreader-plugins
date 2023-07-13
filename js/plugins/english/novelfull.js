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
const pluginId = 'novelfull';
const baseUrl = 'https://novelfull.com/';
function popularNovels(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${baseUrl}most-popular?page=${page}`;
        const result = yield fetchApi(url);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('.col-truyen-main .list-truyen .row').each(function () {
            const novelName = loadedCheerio(this).find('h3.truyen-title > a').text();
            const novelCover = baseUrl + loadedCheerio(this).find('img').attr('src').slice(1);
            const novelUrl = baseUrl +
                loadedCheerio(this).find('h3.truyen-title > a').attr('href').slice(1);
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
    return __awaiter(this, void 0, void 0, function* () {
        const url = novelUrl;
        const result = yield fetchApi(url);
        const body = yield result.text();
        let loadedCheerio = cheerio.load(body);
        const novel = {
            url,
            chapters: [],
        };
        novel.name = loadedCheerio('div.book > img').attr('alt');
        novel.cover = baseUrl + loadedCheerio('div.book > img').attr('src');
        novel.summary = loadedCheerio('div.desc-text').text().trim();
        novel.author = loadedCheerio('h3:contains("Author")')
            .parent()
            .contents()
            .text()
            .replace('Author:', '');
        novel.genre = loadedCheerio('h3:contains("Genre")')
            .siblings()
            .map((i, el) => loadedCheerio(el).text())
            .toArray()
            .join(',');
        novel.artist = null;
        novel.status = loadedCheerio('h3:contains("Status")').next().text();
        const novelId = loadedCheerio('#rating').attr('data-novel-id');
        function getChapters(id) {
            return __awaiter(this, void 0, void 0, function* () {
                const chapterListUrl = baseUrl + 'ajax/chapter-option?novelId=' + id;
                const data = yield fetchApi(chapterListUrl);
                const chapterlist = yield data.text();
                loadedCheerio = cheerio.load(chapterlist);
                let chapter = [];
                loadedCheerio('select > option').each(function () {
                    const chapterName = loadedCheerio(this).text();
                    const releaseDate = null;
                    const chapterUrl = baseUrl + loadedCheerio(this).attr('value').slice(1);
                    chapter.push({
                        name: chapterName,
                        releaseTime: releaseDate,
                        url: chapterUrl,
                    });
                });
                return chapter;
            });
        }
        novel.chapters = yield getChapters(novelId);
        return novel;
    });
}
function parseChapter(chapterUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield fetchApi(chapterUrl);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        loadedCheerio('#chapter-content div.ads').remove();
        let chapterText = loadedCheerio('#chapter-content').html();
        return chapterText;
    });
}
function searchNovels(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const searchUrl = `${baseUrl}search?keyword=${searchTerm}`;
        const result = yield fetchApi(searchUrl);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('.col-truyen-main .list-truyen .row').each(function () {
            const novelName = loadedCheerio(this).find('h3.truyen-title > a').text();
            const novelCover = baseUrl + loadedCheerio(this).find('img').attr('src').slice(1);
            const novelUrl = baseUrl +
                loadedCheerio(this).find('h3.truyen-title > a').attr('href').slice(1);
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
    name: 'NovelFull',
    version: '1.0.0',
    icon: 'src/en/novelfull/icon.png',
    site: baseUrl,
    protected: false,
    fetchImage,
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
};
