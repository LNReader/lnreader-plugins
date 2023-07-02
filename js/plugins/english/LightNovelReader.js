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
const pluginId = 'LNR.org';
const baseUrl = 'https://lightnovelreader.org';
function popularNovels(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = baseUrl + '/ranking/top-rated/' + page;
        const result = yield fetchApi(url);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        const novels = [];
        loadedCheerio('.category-items.ranking-category.cm-list > ul > li').each(function () {
            let novelUrl = loadedCheerio(this).find('a').attr('href');
            if (novelUrl && !isUrlAbsolute(novelUrl)) {
                novelUrl = baseUrl + novelUrl;
            }
            if (novelUrl) {
                const novelName = loadedCheerio(this)
                    .find('.category-name a')
                    .text()
                    .trim();
                let novelCover = loadedCheerio(this)
                    .find('.category-img img')
                    .attr('src');
                if (novelCover && !isUrlAbsolute(novelCover)) {
                    novelCover = baseUrl + novelCover;
                }
                const novel = {
                    url: novelUrl,
                    name: novelName,
                    cover: novelCover,
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
            url: novelUrl,
            chapters: [],
        };
        novel.name = loadedCheerio('.section-header-title > h2').text();
        let novelCover = loadedCheerio('.novels-detail img').attr('src');
        novel.cover = novelCover
            ? isUrlAbsolute(novelCover)
                ? novelCover
                : baseUrl + novelCover
            : undefined;
        novel.summary = loadedCheerio('div.container > div > div.col-12.col-xl-9 > div > div:nth-child(5) > div')
            .text()
            .trim();
        novel.author = loadedCheerio('div.novels-detail-right > ul > li:nth-child(6) > .novels-detail-right-in-right > a')
            .text()
            .trim();
        novel.genres = loadedCheerio('body > section:nth-child(4) > div > div > div.col-12.col-xl-9 > div > div:nth-child(2) > div > div.novels-detail-right > ul > li:nth-child(3) > div.novels-detail-right-in-right')
            .text()
            .trim();
        novel.status = loadedCheerio('div.novels-detail-right > ul > li:nth-child(2) > .novels-detail-right-in-right')
            .text()
            .trim();
        loadedCheerio('.cm-tabs-content > ul > li').each(function () {
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
                novel.chapters.push(chapter);
            }
        });
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
        const chapterText = loadedCheerio('#chapterText').html() || '';
        return chapterText;
    });
}
;
function searchNovels(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = baseUrl + `/search/autocomplete?dataType=json&query=${searchTerm}`;
        const result = yield fetchApi(url);
        const body = yield result.json();
        const data = body.results || [];
        const novels = [];
        data.forEach(item => {
            let novelUrl = item.link;
            let novelName = item.original_title;
            let novelCover = item.image;
            novels.push({
                url: novelUrl,
                name: novelName,
                cover: novelCover,
            });
        });
        return novels;
    });
}
;
function fetchImage(url) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield fetchFile(url, {});
    });
}
module.exports = {
    id: pluginId,
    name: 'LightNovelReader',
    icon: 'src/en/lightnovelreader/icon.png',
    version: '1.0.0',
    site: baseUrl,
    protected: false,
    fetchImage,
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
};
