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
const fetchApi = require('@libs/fetchApi');
const fetchFile = require('@libs/fetchFile');
const cheerio = require('cheerio');
const pluginId = "yuukitls.com";
const baseUrl = 'https://yuukitls.com/';
function popularNovels(page) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = baseUrl;
        const result = yield fetchApi(url);
        const body = yield result.text();
        let loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('.quadmenu-navbar-collapse ul li:nth-child(2)')
            .find('li')
            .each(function () {
            const novelName = loadedCheerio(this).text().replace(/[\s\n]+/g, ' ');
            const novelCover = loadedCheerio(this).find('img').attr('src');
            let novelUrl = loadedCheerio(this).find('a').attr('href');
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
        novel.name = loadedCheerio('h1.entry-title')
            .text()
            .replace(/[\t\n]/g, '')
            .trim();
        novel.cover = loadedCheerio('img[loading="lazy"]').attr('src');
        loadedCheerio('.entry-content')
            .find('div')
            .each(function () {
            if (loadedCheerio(this).text().includes('Escritor:')) {
                novel.author = loadedCheerio(this)
                    .text()
                    .replace('Escritor: ', '')
                    .trim();
            }
            if (loadedCheerio(this).text().includes('Ilustrador:')) {
                novel.artist = loadedCheerio(this)
                    .text()
                    .replace('Ilustrador: ', '')
                    .trim();
            }
            if (loadedCheerio(this).text().includes('Género:')) {
                novel.genres = loadedCheerio(this)
                    .text()
                    .replace(/Género: |\s/g, '');
            }
            if (loadedCheerio(this).text().includes('Sinopsis:')) {
                novel.summary = loadedCheerio(this).next().text();
            }
        });
        let novelChapters = [];
        if (loadedCheerio('.entry-content').find('li').length) {
            loadedCheerio('.entry-content')
                .find('li')
                .each(function () {
                let chapterUrl = loadedCheerio(this).find('a').attr('href');
                if (chapterUrl && chapterUrl.includes(baseUrl)) {
                    const chapterName = loadedCheerio(this).text();
                    const releaseDate = null;
                    const chapter = { name: chapterName, releaseTime: releaseDate, url: chapterUrl };
                    novelChapters.push(chapter);
                }
            });
        }
        else {
            loadedCheerio('.entry-content')
                .find('p')
                .each(function () {
                let chapterUrl = loadedCheerio(this).find('a').attr('href');
                if (chapterUrl && chapterUrl.includes(baseUrl)) {
                    const chapterName = loadedCheerio(this).text();
                    const releaseDate = null;
                    const chapter = { name: chapterName, releaseTime: releaseDate, url: chapterUrl };
                    novelChapters.push(chapter);
                }
            });
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
        let loadedCheerio = cheerio.load(body);
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
        loadedCheerio('.menu-item-2869')
            .find('.menu-item.menu-item-type-post_type.menu-item-object-post')
            .each(function () {
            const novelName = loadedCheerio(this).text();
            const novelCover = loadedCheerio(this).find('img').attr('src');
            let novelUrl = loadedCheerio(this).find('a').attr('href');
            const novel = {
                name: novelName,
                cover: novelCover,
                url: novelUrl,
            };
            novels.push(novel);
        });
        novels = novels.filter(novel => novel.novelName.toLowerCase().includes(searchTerm));
        return novels;
    });
}
;
module.exports = {
    id: pluginId,
    name: "Yuuki Tls",
    site: baseUrl,
    version: '1.0.0',
    icon: 'src/es/yuukitls/icon.png',
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};