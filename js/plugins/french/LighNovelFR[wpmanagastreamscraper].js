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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchImage = exports.searchNovels = exports.parseChapter = exports.parseNovelAndChapters = exports.popularNovels = exports.icon = exports.version = exports.site = exports.name = exports.id = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const fetch_1 = require("@libs/fetch");
exports.id = "lightnovelfr.com";
exports.name = "Ligh Novel FR";
exports.site = "https://lightnovelfr.com/";
exports.version = "1.0.0";
exports.icon = "src/Ligh Novel FR/ligh novel fr.png";
const pluginId = exports.id;
const baseUrl = exports.site;
const popularNovels = function (page, { filters, showLatestNovels }) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = baseUrl + 'series/?page=' + page + '&status=&order=popular';
        const body = yield (yield (0, fetch_1.fetchApi)(url, {})).text();
        const loadedCheerio = cheerio_1.default.load(body);
        let novels = [];
        loadedCheerio('article.maindet').each(function () {
            const novelName = loadedCheerio(this).find('h2').text();
            let image = loadedCheerio(this).find('img');
            const novelCover = image.attr('data-src') || image.attr('src');
            const novelUrl = loadedCheerio(this).find('h2 a').attr('href');
            if (!novelUrl)
                return;
            const novel = {
                name: novelName,
                cover: novelCover,
                url: novelUrl,
            };
            novels.push(novel);
        });
        return novels;
    });
};
exports.popularNovels = popularNovels;
const parseNovelAndChapters = function (novelUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = novelUrl;
        const body = yield (yield (0, fetch_1.fetchApi)(url, {})).text();
        let loadedCheerio = cheerio_1.default.load(body);
        const novel = { url };
        novel.url = url;
        novel.name = loadedCheerio('h1.entry-title').text();
        novel.cover =
            loadedCheerio('img.wp-post-image').attr('data-src') ||
                loadedCheerio('img.wp-post-image').attr('src');
        novel.status = loadedCheerio('div.sertostat > span').attr('class');
        loadedCheerio('div.serl > span').each(function () {
            const detailName = loadedCheerio(this).text().trim();
            const detail = loadedCheerio(this).next().text().trim();
            switch (detailName) {
                case 'الكاتب':
                case 'Author':
                case 'Auteur':
                    novel.author = detail;
                    break;
            }
        });
        novel.genres = loadedCheerio('.sertogenre')
            .children('a')
            .map((i, el) => loadedCheerio(el).text())
            .toArray()
            .join(',');
        let summary = loadedCheerio('.sersys > p').siblings().remove("div").end();
        novel.summary = "";
        for (let i = 0; i < summary.length; i++) {
            const p = summary[i];
            novel.summary += loadedCheerio(p).text().trim() + "\n\n";
        }
        let novelChapters = [];
        loadedCheerio('.eplister')
            .find('li')
            .each(function () {
            const chapterName = loadedCheerio(this).find('.epl-num').text() +
                ' - ' +
                loadedCheerio(this).find('.epl-title').text();
            const releaseDate = loadedCheerio(this).find('.epl-date').text().trim();
            const chapterUrl = loadedCheerio(this).find('a').attr('href');
            if (!chapterUrl)
                return;
            const chapter = {
                name: chapterName,
                url: chapterUrl,
                releaseDate,
            };
            novelChapters.push(chapter);
        });
        novel.chapters = novelChapters;
        if (novel.chapters)
            novel.chapters.reverse();
        return novel;
    });
};
exports.parseNovelAndChapters = parseNovelAndChapters;
const parseChapter = function (chapterUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = chapterUrl;
        const body = yield (yield (0, fetch_1.fetchApi)(url, {})).text();
        const loadedCheerio = cheerio_1.default.load(body);
        let chapterText = loadedCheerio('.epcontent').html();
        // if (sourceId === 53) {
        //   let ignore = loadedCheerio('article > style').text().trim().split(',');
        //   ignore.push(...ignore.pop().match(/^.w+/));
        //   ignore.map(tag => loadedCheerio(p${tag}).remove());
        //   chapterText = loadedCheerio('.epcontent').html();
        // }
        return chapterText;
    });
};
exports.parseChapter = parseChapter;
const searchNovels = function (searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = baseUrl + "?s=" + searchTerm;
        const body = yield (yield (0, fetch_1.fetchApi)(url, {})).text();
        const loadedCheerio = cheerio_1.default.load(body);
        let novels = [];
        loadedCheerio('article.maindet').each(function () {
            const novelName = loadedCheerio(this).find('h2').text();
            let image = loadedCheerio(this).find('img');
            const novelCover = image.attr('data-src') || image.attr('src');
            const novelUrl = loadedCheerio(this).find('h2 a').attr('href');
            if (!novelUrl)
                return;
            const novel = {
                name: novelName,
                cover: novelCover,
                url: novelUrl,
            };
            novels.push(novel);
        });
        return novels;
    });
};
exports.searchNovels = searchNovels;
exports.fetchImage = fetch_1.fetchFile;
