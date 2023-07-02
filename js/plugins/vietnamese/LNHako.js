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
const isUrlAbsolute = require('@libs/isAbsoluteUrl');
const fetchApi = require('@libs/fetchApi');
const fetchFile = require('@libs/fetchFile');
const pluginId = 'ln.hako';
const baseUrl = 'https://ln.hako.vn';
function popularNovels(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const link = baseUrl + '/danh-sach?truyendich=1&sapxep=topthang&page=' + page;
        const result = yield fetchApi(link);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        const novels = [];
        loadedCheerio('main.row > .thumb-item-flow').each(function () {
            let url = loadedCheerio(this)
                .find('div.thumb_attr.series-title > a')
                .attr('href');
            if (url && !isUrlAbsolute(url)) {
                url = baseUrl + url;
            }
            if (url) {
                const name = loadedCheerio(this).find('.series-title').text().trim();
                let cover = loadedCheerio(this)
                    .find('.img-in-ratio')
                    .attr('data-bg');
                if (cover && !isUrlAbsolute(cover)) {
                    cover = baseUrl + cover;
                }
                const novel = {
                    name,
                    url,
                    cover,
                };
                novels.push(novel);
            }
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
        const novel = {
            url,
            chapters: [],
        };
        novel.name = loadedCheerio('.series-name').text();
        const background = loadedCheerio('.series-cover > .a6-ratio > div').attr('style');
        const novelCover = background.substring(background.indexOf('http'), background.length - 2);
        novel.cover = novelCover
            ? isUrlAbsolute(novelCover)
                ? novelCover
                : baseUrl + novelCover
            : '';
        novel.summary = loadedCheerio('.summary-content').text().trim();
        novel.author = loadedCheerio('#mainpart > div:nth-child(2) > div > div:nth-child(1) > section > main > div.top-part > div > div.col-12.col-md-9 > div.series-information > div:nth-child(2) > span.info-value > a')
            .text()
            .trim();
        novel.genres = loadedCheerio('.series-gernes')
            .text()
            .trim()
            .replaceAll(/ +/g, " ")
            .split('\n')
            .filter(e => e.trim())
            .join(', ');
        novel.status = loadedCheerio('#mainpart > div:nth-child(2) > div > div:nth-child(1) > section > main > div.top-part > div > div.col-12.col-md-9 > div.series-information > div:nth-child(4) > span.info-value > a')
            .text()
            .trim();
        loadedCheerio('.list-chapters li').each(function () {
            let chapterUrl = loadedCheerio(this).find('a').attr('href');
            if (chapterUrl && !isUrlAbsolute(chapterUrl)) {
                chapterUrl = baseUrl + chapterUrl;
            }
            if (chapterUrl) {
                const chapterName = loadedCheerio(this)
                    .find('.chapter-name')
                    .text()
                    .trim();
                const releaseTime = loadedCheerio(this).find('.chapter-time').text();
                const chapter = {
                    name: chapterName,
                    releaseTime: releaseTime,
                    url: chapterUrl,
                };
                novel.chapters.push(chapter);
            }
        });
        return novel;
    });
}
;
function parseChapter(chapterUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield fetchApi(chapterUrl);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        const chapterText = loadedCheerio('#chapter-content').html() || '';
        return chapterText;
    });
}
;
function searchNovels(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = baseUrl + '/tim-kiem?keywords=' + searchTerm;
        const result = yield fetchApi(url);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        const novels = [];
        loadedCheerio('div.row > .thumb-item-flow').each(function () {
            let novelUrl = loadedCheerio(this)
                .find('div.thumb_attr.series-title > a')
                .attr('href');
            if (novelUrl && !isUrlAbsolute(novelUrl)) {
                novelUrl = baseUrl + novelUrl;
            }
            if (novelUrl) {
                const novelName = loadedCheerio(this).find('.series-title').text();
                let novelCover = loadedCheerio(this)
                    .find('.img-in-ratio')
                    .attr('data-bg');
                if (novelCover && !isUrlAbsolute(novelCover)) {
                    novelCover = baseUrl + novelCover;
                }
                novels.push({
                    name: novelName,
                    url: novelUrl,
                    cover: novelCover,
                });
            }
        });
        return novels;
    });
}
;
function fetchImage(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const headers = {
            Referer: 'https://ln.hako.vn',
        };
        return yield fetchFile(url, { headers: headers });
    });
}
;
module.exports = {
    id: pluginId,
    name: 'Hako',
    version: '1.0.0',
    icon: 'src/vi/hakolightnovel/icon.png',
    site: baseUrl,
    protected: true,
    fetchImage,
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
};
