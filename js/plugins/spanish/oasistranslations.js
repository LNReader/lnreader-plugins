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
const fetchApi = require('@libs/fetchApi').default;
const fetchFile = require('@libs/fetchFile').default;
const cheerio = require('cheerio');
const pluginId = 'oasisTL.wp';
const sourceName = 'Oasis Translations';
const baseUrl = 'https://oasistranslations.wordpress.com/';
function popularNovels(page) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = baseUrl;
        const result = yield fetchApi(url);
        const body = yield result.text();
        let loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('.menu-item-1819')
            .find('.sub-menu > li')
            .each(function () {
            const novelName = loadedCheerio(this).text();
            if (!novelName.match(/Activas|Finalizadas|Dropeadas/)) {
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
function parseNovelAndChapters(novelUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = novelUrl;
        const result = yield fetchApi(url);
        const body = yield result.text();
        let loadedCheerio = cheerio.load(body);
        let novel = {};
        novel.url = url;
        novel.name = loadedCheerio('h1.entry-title')
            .text()
            .replace(/[\t\n]/g, '')
            .trim();
        novel.cover = loadedCheerio('img[loading="lazy"]').attr('src');
        loadedCheerio('.entry-content > p').each(function (res) {
            if (loadedCheerio(this).text().includes('Autor')) {
                let details = loadedCheerio(this).html();
                details = details.match(/<\/strong>(.|\n)*?<br>/g);
                details = details.map(detail => detail.replace(/<strong>|<\/strong>|<br>|:\s/g, ''));
                novel.genres = '';
                novel.author = details[2];
                novel.genres = details[4].replace(/\s|&nbsp;/g, '');
                novel.artist = details[3];
            }
        });
        // let novelSummary = $(this).next().html();
        novel.summary = '';
        let novelChapters = [];
        // if ($(".entry-content").find("li").length) {
        loadedCheerio('.entry-content')
            .find('a')
            .each(function () {
            let chapterUrl = loadedCheerio(this).attr('href');
            if (chapterUrl && chapterUrl.includes(baseUrl)) {
                const chapterName = loadedCheerio(this).text();
                const releaseDate = null;
                const chapter = { name: chapterName, releaseTime: releaseDate, url: chapterUrl };
                novelChapters.push(chapter);
            }
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
        loadedCheerio('div#jp-post-flair').remove();
        let chapterText = loadedCheerio('.entry-content').html();
        return chapterText;
    });
}
;
function searchNovels(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        searchTerm = searchTerm.toLowerCase();
        let url = baseUrl;
        const result = yield fetchApi(url);
        const body = yield result.text();
        let loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('.menu-item-1819')
            .find('.sub-menu > li')
            .each(function () {
            const novelName = loadedCheerio(this).text();
            if (!novelName.match(/Activas|Finalizadas|Dropeadas/)) {
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
        novels = novels.filter(novel => novel.name.toLowerCase().includes(searchTerm));
        return novels;
    });
}
;
module.exports = {
    id: pluginId,
    name: sourceName,
    site: baseUrl,
    version: '1.0.0',
    icon: 'src/es/oasistranslations/icon.png',
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};
