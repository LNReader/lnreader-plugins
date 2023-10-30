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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filters = exports.fetchImage = exports.searchNovels = exports.parseChapter = exports.parseNovelAndChapters = exports.popularNovels = exports.site = exports.version = exports.icon = exports.name = exports.id = void 0;
var cheerio_1 = require("cheerio");
// import dayjs from 'dayjs';
var fetch_1 = require("@libs/fetch");
var parseMadaraDate_1 = require("@libs/parseMadaraDate");
// import { isUrlAbsolute } from '@libs/isAbsoluteUrl';
// import { showToast } from "@libs/showToast";
var filterInputs_1 = require("@libs/filterInputs");
// import { NovelStatus } from '@libs/novelStatus';
// import { defaultCover } from "@libs/defaultCover";
exports.id = "Novelmt.com";
exports.name = "Novelmt.com";
exports.icon = "multisrc/readwn/icons/novelmt.png";
exports.version = "1.0.0";
exports.site = "https://www.novelmt.com/";
var popularNovels = function (page, _a) {
    var filters = _a.filters, showLatestNovels = _a.showLatestNovels;
    return __awaiter(this, void 0, void 0, function () {
        var novels, pageNo, url, result, body, loadedCheerio;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    novels = [];
                    pageNo = page - 1;
                    url = exports.site + 'list/';
                    url += ((filters === null || filters === void 0 ? void 0 : filters.genres) || 'all') + '/';
                    url += ((filters === null || filters === void 0 ? void 0 : filters.status) || 'all') + '-';
                    url += (showLatestNovels ? 'lastdotime' : (filters === null || filters === void 0 ? void 0 : filters.sort) || 'newstime') + '-';
                    url += pageNo + '.html';
                    return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                case 1:
                    result = _b.sent();
                    return [4 /*yield*/, result.text()];
                case 2:
                    body = _b.sent();
                    loadedCheerio = (0, cheerio_1.load)(body);
                    loadedCheerio('li.novel-item').each(function () {
                        var novelName = loadedCheerio(this).find('h4').text();
                        var novelUrl = exports.site + loadedCheerio(this).find('a').attr('href');
                        var coverUri = loadedCheerio(this)
                            .find('.novel-cover > img')
                            .attr('data-src');
                        var novelCover = exports.site + coverUri;
                        var novel = { name: novelName, cover: novelCover, url: novelUrl };
                        novels.push(novel);
                    });
                    return [2 /*return*/, novels];
            }
        });
    });
};
exports.popularNovels = popularNovels;
var parseNovelAndChapters = function (novelUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var result, body, loadedCheerio, novel, coverUri, novelChapters, novelId, latestChapterNo, lastChapterNo, i, chapterName, chapterUrl, releaseDate, chapter;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(novelUrl)];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, result.text()];
                case 2:
                    body = _a.sent();
                    loadedCheerio = (0, cheerio_1.load)(body);
                    novel = {
                        url: novelUrl,
                        chapters: [],
                    };
                    novel.name = loadedCheerio('h1.novel-title').text();
                    coverUri = loadedCheerio('figure.cover > img').attr('data-src');
                    novel.cover = exports.site + coverUri;
                    novel.summary = loadedCheerio('.summary')
                        .text()
                        .replace('Summary', '')
                        .trim();
                    novel.genres = '';
                    loadedCheerio('div.categories > ul > li').each(function () {
                        novel.genres += loadedCheerio(this).text().trim() + ',';
                    });
                    loadedCheerio('div.header-stats > span').each(function () {
                        if (loadedCheerio(this).find('small').text() === 'Status') {
                            novel.status = loadedCheerio(this).find('strong').text();
                        }
                    });
                    novel.genres = novel.genres.slice(0, -1);
                    novel.author = loadedCheerio('span[itemprop=author]').text();
                    novelChapters = [];
                    novelId = novelUrl.replace('.html', '').replace(exports.site, '');
                    latestChapterNo = parseInt(loadedCheerio('.header-stats')
                        .find('span > strong')
                        .first()
                        .text()
                        .trim());
                    lastChapterNo = 1;
                    loadedCheerio('.chapter-list li').each(function () {
                        var _a;
                        var chapterName = loadedCheerio(this)
                            .find('a .chapter-title')
                            .text()
                            .trim();
                        var chapterUrl = exports.site + ((_a = loadedCheerio(this).find('a').attr('href')) === null || _a === void 0 ? void 0 : _a.trim());
                        var releaseDate = loadedCheerio(this)
                            .find('a .chapter-update')
                            .text()
                            .trim();
                        lastChapterNo = parseInt(loadedCheerio(this).find('a .chapter-no').text().trim());
                        var chapter = { name: chapterName, releaseTime: (0, parseMadaraDate_1.parseMadaraDate)(releaseDate), url: chapterUrl };
                        novelChapters.push(chapter);
                    });
                    // Itterate once more before loop to finish off
                    lastChapterNo++;
                    for (i = lastChapterNo; i <= latestChapterNo; i++) {
                        chapterName = 'Chapter ' + i;
                        chapterUrl = exports.site + novelId + '_' + i + '.html';
                        releaseDate = null;
                        chapter = { name: chapterName, releaseTime: releaseDate, url: chapterUrl };
                        novelChapters.push(chapter);
                    }
                    novel.chapters = novelChapters;
                    return [2 /*return*/, novel];
            }
        });
    });
};
exports.parseNovelAndChapters = parseNovelAndChapters;
var parseChapter = function (chapterUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var result, body, loadedCheerio, chapterText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(chapterUrl)];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, result.text()];
                case 2:
                    body = _a.sent();
                    loadedCheerio = (0, cheerio_1.load)(body);
                    chapterText = loadedCheerio('.chapter-content').html();
                    return [2 /*return*/, chapterText];
            }
        });
    });
};
exports.parseChapter = parseChapter;
var searchNovels = function (searchTerm) { return __awaiter(void 0, void 0, void 0, function () {
    var novels, searchUrl, result, body, loadedCheerio;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                novels = [];
                searchUrl = exports.site + 'e/search/index.php';
                return [4 /*yield*/, (0, fetch_1.fetchApi)(searchUrl, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            Referer: exports.site + 'search.html',
                            Origin: exports.site,
                            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36',
                        },
                        method: 'POST',
                        body: JSON.stringify({
                            show: 'title',
                            tempid: 1,
                            tbname: 'news',
                            keyboard: searchTerm,
                        }),
                    })];
            case 1:
                result = _a.sent();
                return [4 /*yield*/, result.text()];
            case 2:
                body = _a.sent();
                loadedCheerio = (0, cheerio_1.load)(body);
                loadedCheerio('li.novel-item').each(function () {
                    var novelName = loadedCheerio(this).find('h4').text();
                    var novelUrl = exports.site + loadedCheerio(this).find('a').attr('href');
                    var coverUri = exports.site + loadedCheerio(this).find('img').attr('data-src');
                    var novelCover = exports.site + coverUri;
                    var novel = {
                        name: novelName,
                        cover: novelCover,
                        url: novelUrl,
                    };
                    novels.push(novel);
                });
                return [2 /*return*/, novels];
        }
    });
}); };
exports.searchNovels = searchNovels;
exports.fetchImage = fetch_1.fetchFile;
exports.filters = [{ "key": "sort", "label": "Sort By", "values": [{ "label": "New", "value": "newstime" }, { "label": "Popular", "value": "onclick" }, { "label": "Updates", "value": "lastdotime" }], "inputType": filterInputs_1.FilterInputs.Picker }, { "key": "status", "label": "Status", "values": [{ "label": "All", "value": "all" }, { "label": "Completed", "value": "Completed" }, { "label": "Ongoing", "value": "Ongoing" }], "inputType": filterInputs_1.FilterInputs.Picker }, { "key": "genres", "label": "Genre / Category", "values": [{ "label": "All", "value": "all" }, { "label": "Action", "value": "action" }, { "label": "Adult", "value": "adult" }, { "label": "Adventure", "value": "adventure" }, { "label": "Billionaire", "value": "billionaire" }, { "label": "CEO", "value": "ceo" }, { "label": "Chinese", "value": "chinese" }, { "label": "Comedy", "value": "comedy" }, { "label": "Contemporary Romance", "value": "contemporary-romance" }, { "label": "Drama", "value": "drama" }, { "label": "Eastern Fantasy", "value": "eastern-fantasy" }, { "label": "Ecchi", "value": "ecchi" }, { "label": "Erciyuan", "value": "erciyuan" }, { "label": "Faloo", "value": "faloo" }, { "label": "Fan-Fiction", "value": "fan-fiction" }, { "label": "Fantasy", "value": "fantasy" }, { "label": "Fantasy Romance", "value": "fantasy-romance" }, { "label": "Farming", "value": "farming" }, { "label": "Game", "value": "game" }, { "label": "Games", "value": "games" }, { "label": "Gay Romance", "value": "gay-romance" }, { "label": "Gender Bender", "value": "gender-bender" }, { "label": "Harem", "value": "harem" }, { "label": "Historical", "value": "historical" }, { "label": "Historical Romance", "value": "historical-romance" }, { "label": "Horror", "value": "horror" }, { "label": "Isekai", "value": "isekai" }, { "label": "Japanese", "value": "japanese" }, { "label": "Josei", "value": "josei" }, { "label": "Korean", "value": "korean" }, { "label": "Lolicon", "value": "lolicon" }, { "label": "Magic", "value": "magic" }, { "label": "Magical Realism", "value": "magical-realism" }, { "label": "Martial Arts", "value": "martial-arts" }, { "label": "Mature", "value": "mature" }, { "label": "Mecha", "value": "mecha" }, { "label": "Military", "value": "military" }, { "label": "Modern Life", "value": "modern-life" }, { "label": "Modern Romance", "value": "modern-romance" }, { "label": "Mystery", "value": "mystery" }, { "label": "Psychological", "value": "psychological" }, { "label": "Romance", "value": "romance" }, { "label": "Romantic", "value": "romantic" }, { "label": "School Life", "value": "school-life" }, { "label": "Sci-fi", "value": "sci-fi" }, { "label": "Seinen", "value": "seinen" }, { "label": "Shoujo", "value": "shoujo" }, { "label": "Shoujo Ai", "value": "shoujo-ai" }, { "label": "Shounen", "value": "shounen" }, { "label": "Shounen Ai", "value": "shounen-ai" }, { "label": "Slice of Life", "value": "slice-of-life" }, { "label": "Smut", "value": "smut" }, { "label": "Sports", "value": "sports" }, { "label": "Supernatural", "value": "supernatural" }, { "label": "Tragedy", "value": "tragedy" }, { "label": "Two-dimensional", "value": "two-dimensional" }, { "label": "Urban", "value": "urban" }, { "label": "Urban Life", "value": "urban-life" }, { "label": "Video Games", "value": "video-games" }, { "label": "Virtual Reality", "value": "virtual-reality" }, { "label": "Wuxia", "value": "wuxia" }, { "label": "Xianxia", "value": "xianxia" }, { "label": "Xuanhuan", "value": "xuanhuan" }, { "label": "Yaoi", "value": "yaoi" }, { "label": "Yuri", "value": "yuri" }], "inputType": filterInputs_1.FilterInputs.Picker }];
