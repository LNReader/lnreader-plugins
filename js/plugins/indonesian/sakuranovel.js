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
const pluginId = 'sakura.id';
const sourceName = 'SakuraNovel';
const baseUrl = 'https://sakuranovel.id/';
function popularNovels(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${baseUrl}advanced-search/page/${page}/?title&author&yearx&status&type&order=rating&country%5B0%5D=china&country%5B1%5D=jepang&country%5B2%5D=unknown`;
        const result = yield fetchApi(url, {}, pluginId);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('.flexbox2-item').each(function () {
            const novelName = loadedCheerio(this)
                .find('.flexbox2-title span')
                .first()
                .text();
            const novelCover = loadedCheerio(this).find('img').attr('src');
            const novelUrl = loadedCheerio(this)
                .find('.flexbox2-content > a')
                .attr('href');
            const novel = { name: novelName, cover: novelCover, url: novelUrl };
            novels.push(novel);
        });
        return novels;
    });
}
function parseNovelAndChapters(novelUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield fetchApi(novelUrl, {}, pluginId);
        const body = yield result.text();
        let loadedCheerio = cheerio.load(body);
        let novel = {
            name: sourceName,
            url: novelUrl,
        };
        novel.name = loadedCheerio('.series-title h2').text().trim();
        novel.cover = loadedCheerio('.series-thumb img').attr('src');
        loadedCheerio('.series-infolist > li').each(function () {
            const detailName = loadedCheerio(this).find('b').text().trim();
            const detail = loadedCheerio(this).find('b').next().text().trim();
            switch (detailName) {
                case 'Author':
                    novel.author = detail;
                    break;
            }
        });
        novel.status = loadedCheerio('.status').text().trim();
        novel.genre = loadedCheerio('.series-genres')
            .children('a')
            .map((i, el) => loadedCheerio(el).text())
            .toArray()
            .join(',');
        loadedCheerio('.series-synops div').remove();
        novel.summary = loadedCheerio('.series-synops').text().trim();
        let chapters = [];
        loadedCheerio('.series-chapterlist li').each(function () {
            const chapterName = loadedCheerio(this)
                .find('a span')
                .first()
                .text()
                .replace(/.*?(Chapter.|[0-9])/g, '$1')
                .replace(/Bahasa Indonesia/g, '')
                .replace(/\s+/g, ' ')
                .trim();
            const releaseDate = loadedCheerio(this)
                .find('a span')
                .first()
                .next()
                .text();
            const chapterUrl = loadedCheerio(this).find('a').attr('href');
            chapters.push({
                name: chapterName,
                releaseTime: releaseDate,
                url: chapterUrl,
            });
        });
        novel.chapters = chapters.reverse();
        return novel;
    });
}
function parseChapter(chapterUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield fetchApi(chapterUrl, {}, pluginId);
        const body = yield result.text();
        let loadedCheerio = cheerio.load(body);
        const chapterText = loadedCheerio('.readers').html();
        return chapterText;
    });
}
function searchNovels(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${baseUrl}?s=${searchTerm}`;
        const result = yield fetchApi(url, {}, pluginId);
        const body = yield result.text();
        let loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('.flexbox2-item').each(function () {
            const novelName = loadedCheerio(this)
                .find('.flexbox2-title span')
                .first()
                .text();
            const novelCover = loadedCheerio(this).find('img').attr('src');
            const novelUrl = loadedCheerio(this)
                .find('.flexbox2-content > a')
                .attr('href');
            const novel = { name: novelName, cover: novelCover, url: novelUrl };
            novels.push(novel);
        });
        return novels;
    });
}
module.exports = {
    id: pluginId,
    name: sourceName,
    site: baseUrl,
    icon: 'src/id/sakuranovel/icon.png',
    version: '1.0.0',
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};
