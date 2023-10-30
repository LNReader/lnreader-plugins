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
exports.fetchImage = exports.searchNovels = exports.parseChapter = exports.parseNovelAndChapters = exports.popularNovels = exports.site = exports.version = exports.icon = exports.name = exports.id = void 0;
var cheerio_1 = require("cheerio");
var isAbsoluteUrl_1 = require("@libs/isAbsoluteUrl");
var fetch_1 = require("@libs/fetch");
exports.id = "LNR.org";
exports.name = "LightNovelReader";
exports.icon = "src/en/lightnovelreader/icon.png";
exports.version = "1.0.0";
exports.site = "https://lightnovelreader.org";
var baseUrl = exports.site;
var popularNovels = function (page) {
    return __awaiter(this, void 0, void 0, function () {
        var url, result, body, loadedCheerio, novels;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = baseUrl + "/ranking/top-rated/" + page;
                    return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, result.text()];
                case 2:
                    body = _a.sent();
                    loadedCheerio = (0, cheerio_1.load)(body);
                    novels = [];
                    loadedCheerio(".category-items.ranking-category.cm-list > ul > li").each(function () {
                        var novelUrl = loadedCheerio(this).find("a").attr("href");
                        if (novelUrl && !(0, isAbsoluteUrl_1.isUrlAbsolute)(novelUrl)) {
                            novelUrl = baseUrl + novelUrl;
                        }
                        if (novelUrl) {
                            var novelName = loadedCheerio(this)
                                .find(".category-name a")
                                .text()
                                .trim();
                            var novelCover = loadedCheerio(this)
                                .find(".category-img img")
                                .attr("src");
                            if (novelCover && !(0, isAbsoluteUrl_1.isUrlAbsolute)(novelCover)) {
                                novelCover = baseUrl + novelCover;
                            }
                            var novel = {
                                url: novelUrl,
                                name: novelName,
                                cover: novelCover,
                            };
                            novels.push(novel);
                        }
                    });
                    return [2 /*return*/, novels];
            }
        });
    });
};
exports.popularNovels = popularNovels;
var parseNovelAndChapters = function (novelUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var url, result, body, loadedCheerio, novel, novelCover;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = novelUrl;
                    return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
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
                    novel.name = loadedCheerio(".section-header-title > h2").text();
                    novelCover = loadedCheerio(".novels-detail img").attr("src");
                    novel.cover = novelCover
                        ? (0, isAbsoluteUrl_1.isUrlAbsolute)(novelCover)
                            ? novelCover
                            : baseUrl + novelCover
                        : undefined;
                    novel.summary = loadedCheerio("div.container > div > div.col-12.col-xl-9 > div > div:nth-child(5) > div")
                        .text()
                        .trim();
                    novel.author = loadedCheerio("div.novels-detail-right > ul > li:nth-child(6) > .novels-detail-right-in-right > a")
                        .text()
                        .trim();
                    novel.genres = loadedCheerio("body > section:nth-child(4) > div > div > div.col-12.col-xl-9 > div > div:nth-child(2) > div > div.novels-detail-right > ul > li:nth-child(3) > div.novels-detail-right-in-right")
                        .text()
                        .trim();
                    novel.status = loadedCheerio("div.novels-detail-right > ul > li:nth-child(2) > .novels-detail-right-in-right")
                        .text()
                        .trim();
                    loadedCheerio(".cm-tabs-content > ul > li").each(function () {
                        var _a;
                        var chapterUrl = loadedCheerio(this).find("a").attr("href");
                        if (chapterUrl && !(0, isAbsoluteUrl_1.isUrlAbsolute)(chapterUrl)) {
                            chapterUrl = baseUrl + chapterUrl;
                        }
                        if (chapterUrl) {
                            var chapterName = loadedCheerio(this).find("a").text().trim();
                            var releaseDate = null;
                            var chapter = {
                                name: chapterName,
                                releaseTime: releaseDate,
                                url: chapterUrl,
                            };
                            (_a = novel.chapters) === null || _a === void 0 ? void 0 : _a.push(chapter);
                        }
                    });
                    return [2 /*return*/, novel];
            }
        });
    });
};
exports.parseNovelAndChapters = parseNovelAndChapters;
var parseChapter = function (chapterUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var url, result, body, loadedCheerio, chapterText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = chapterUrl;
                    return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, result.text()];
                case 2:
                    body = _a.sent();
                    loadedCheerio = (0, cheerio_1.load)(body);
                    chapterText = loadedCheerio("#chapterText").html() || "";
                    return [2 /*return*/, chapterText];
            }
        });
    });
};
exports.parseChapter = parseChapter;
var searchNovels = function (searchTerm) {
    return __awaiter(this, void 0, void 0, function () {
        var url, result, body, novels;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = baseUrl + "/search/autocomplete?dataType=json&query=".concat(searchTerm);
                    return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, result.json()];
                case 2:
                    body = _a.sent();
                    novels = [];
                    body.results.forEach(function (item) {
                        return novels.push({
                            url: item.link,
                            name: item.original_title,
                            cover: item.image,
                        });
                    });
                    return [2 /*return*/, novels];
            }
        });
    });
};
exports.searchNovels = searchNovels;
var fetchImage = function (url) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, fetch_1.fetchFile)(url, {})];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.fetchImage = fetchImage;
