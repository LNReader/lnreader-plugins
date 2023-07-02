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
const pluginId = 'mtlreader';
const baseUrl = 'https://mtlreader.com/';
function popularNovels(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${baseUrl}novels?page=${page}`;
        const body = yield fetchApi(url, {}, pluginId).then(r => r.text());
        const loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('.col-md-4.col-sm-4').each(function () {
            const novelName = loadedCheerio(this).find('h5').text();
            const novelCover = loadedCheerio(this).find('img').attr('src');
            const novelUrl = loadedCheerio(this).find('h5 > a').attr('href');
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
        const body = yield fetchApi(url, {}, pluginId).then(r => r.text());
        let loadedCheerio = cheerio.load(body);
        const novel = {
            url,
            chapters: [],
        };
        novel.name = loadedCheerio('.agent-title').text().trim();
        novel.cover = loadedCheerio('.agent-p-img > img').attr('src');
        novel.summary = loadedCheerio('#editdescription').text().trim();
        novel.author = loadedCheerio('i.fa-user')
            .parent()
            .text()
            .replace('Author: ', '')
            .trim();
        let chapter = [];
        loadedCheerio('tr.spaceUnder').each(function () {
            const chapterName = loadedCheerio(this).find('a').text().trim();
            const releaseDate = null;
            const chapterUrl = loadedCheerio(this).find('a').attr('href');
            chapter.push({
                name: chapterName,
                releaseTime: releaseDate,
                url: chapterUrl,
            });
        });
        novel.chapters = chapter;
        return novel;
    });
}
function parseChapter(chapterUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = yield fetchApi(chapterUrl, {}, pluginId).then(r => r.text());
        const loadedCheerio = cheerio.load(body);
        loadedCheerio('.container ins,script,p.mtlreader').remove();
        const chapterText = loadedCheerio('.container').html();
        return chapterText;
    });
}
function searchNovels(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${baseUrl}search?input=${searchTerm}`;
        const body = yield fetchApi(url, {}, pluginId).then(r => r.text());
        let loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('.col-md-4.col-sm-4').each(function () {
            const novelName = loadedCheerio(this).find('h5').text();
            const novelCover = loadedCheerio(this).find('img').attr('src');
            const novelUrl = loadedCheerio(this).find('h5 > a').attr('href');
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
    name: 'MTL Reader',
    version: '1.0.0',
    icon: 'src/en/mtlreader/icon.png',
    site: baseUrl,
    protected: false,
    fetchImage,
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
};
