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
const baseUrl = 'https://hasutl.wordpress.com/';
function popularNovels(page) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = baseUrl + 'light-novels-activas/';
        const result = yield fetchApi(url);
        const body = yield result.text();
        let loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('div.wp-block-columns').each(function () {
            const novelName = loadedCheerio(this).find('.wp-block-button').text();
            const novelCover = loadedCheerio(this).find('img').attr('src');
            let novelUrl = loadedCheerio(this)
                .find('.wp-block-button > a')
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
        let loadedCheerio = cheerio.load(body);
        let novel = {};
        novel.url = url;
        novel.url = novelUrl;
        novel.name = loadedCheerio('.post-header').text();
        novel.cover = loadedCheerio('.featured-media > img').attr('src');
        let novelSummary = loadedCheerio('.post-content').find('p').html();
        novel.summary = novelSummary;
        let novelChapters = [];
        loadedCheerio('.wp-block-media-text__content')
            .find('a')
            .each(function () {
            const chapterName = loadedCheerio(this).text().trim();
            const releaseDate = null;
            let chapterUrl = loadedCheerio(this).attr('href');
            const chapter = { name: chapterName, releaseTime: releaseDate, url: chapterUrl };
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
        const result = yield fetchApi(url);
        const body = yield result.text();
        let loadedCheerio = cheerio.load(body);
        let chapterText = loadedCheerio('.post-content').html();
        return chapterText;
    });
}
;
function searchNovels(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${baseUrl}?s=${searchTerm}&post_type=wp-manga`;
        const result = yield fetchApi(url);
        const body = yield result.text();
        let loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('.post-container ').each(function () {
            const novelName = loadedCheerio(this).find('.post-header').text();
            if (!novelName.includes('Cap') &&
                !novelName.includes('Vol') &&
                !novelName.includes('Light Novels')) {
                const novelCover = loadedCheerio(this).find('img').attr('src');
                let novelUrl = loadedCheerio(this).find('a').attr('href');
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
;
module.exports = {
    id: "HasuTL",
    name: 'Hasu Translations',
    site: baseUrl,
    version: '1.0.0',
    icon: 'src/es/hasutl/icon.png',
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};
