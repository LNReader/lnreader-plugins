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
exports.fetchImage = exports.searchNovels = exports.parseChapter = exports.parseNovelAndChapters = exports.popularNovels = exports.icon = exports.version = exports.site = exports.name = exports.id = void 0;
var cheerio_1 = require("cheerio");
var fetch_1 = require("@libs/fetch");
exports.id = "novelpub.com";
exports.name = "NovelPub";
exports.site = "https://www.novelpub.com/";
exports.version = "1.0.0";
exports.icon = "src/en/novelpub/icon.png";
var baseUrl = exports.site;
var headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
};
var popularNovels = function (page) {
    return __awaiter(this, void 0, void 0, function () {
        var url, result, body, loadedCheerio, novels;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = baseUrl + "browse/all/popular/all/" + page;
                    return [4 /*yield*/, (0, fetch_1.fetchApi)(url, { method: "GET", headers: headers })];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, result.text()];
                case 2:
                    body = _a.sent();
                    loadedCheerio = (0, cheerio_1.load)(body);
                    novels = [];
                    loadedCheerio(".novel-item.ads").remove();
                    loadedCheerio(".novel-item").each(function () {
                        var _a;
                        var novelName = loadedCheerio(this)
                            .find(".novel-title")
                            .text()
                            .trim();
                        var novelCover = loadedCheerio(this).find("img").attr("data-src");
                        var novelUrl = baseUrl +
                            ((_a = loadedCheerio(this)
                                .find(".novel-title > a")
                                .attr("href")) === null || _a === void 0 ? void 0 : _a.substring(1));
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
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var url, result, body, loadedCheerio, novel, delay, lastPage, getChapters, _c;
        var _this = this;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    url = novelUrl;
                    return [4 /*yield*/, (0, fetch_1.fetchApi)(url, { method: "GET", headers: headers })];
                case 1:
                    result = _d.sent();
                    return [4 /*yield*/, result.text()];
                case 2:
                    body = _d.sent();
                    loadedCheerio = (0, cheerio_1.load)(body);
                    novel = { url: url, genres: "" };
                    novel.name = loadedCheerio("h1.novel-title").text().trim();
                    novel.cover = loadedCheerio("figure.cover > img").attr("data-src");
                    loadedCheerio("div.categories > ul > li").each(function () {
                        novel.genres +=
                            loadedCheerio(this)
                                .text()
                                .replace(/[\t\n]/g, "") + ",";
                    });
                    loadedCheerio("div.header-stats > span").each(function () {
                        if (loadedCheerio(this).find("small").text() === "Status") {
                            novel.status = loadedCheerio(this).find("strong").text();
                        }
                    });
                    novel.genres = (_a = novel.genres) === null || _a === void 0 ? void 0 : _a.slice(0, -1);
                    novel.author = loadedCheerio(".author > a > span").text();
                    novel.summary = loadedCheerio(".summary > .content").text().trim();
                    delay = function (ms) { return new Promise(function (res) { return setTimeout(res, ms); }); };
                    lastPage = 1;
                    lastPage = parseInt((_b = loadedCheerio("#novel > header > div.header-body.container > div.novel-info > div.header-stats > span:nth-child(1) > strong")
                        .text()) === null || _b === void 0 ? void 0 : _b.trim());
                    lastPage = Math.ceil(lastPage / 100);
                    getChapters = function () { return __awaiter(_this, void 0, void 0, function () {
                        var novelChapters, i, chaptersUrl, chaptersRequest, chaptersHtml;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    novelChapters = [];
                                    i = 1;
                                    _a.label = 1;
                                case 1:
                                    if (!(i <= lastPage)) return [3 /*break*/, 6];
                                    chaptersUrl = "".concat(novelUrl, "/chapters/page-").concat(i);
                                    return [4 /*yield*/, (0, fetch_1.fetchApi)(chaptersUrl, {
                                            headers: headers,
                                        })];
                                case 2:
                                    chaptersRequest = _a.sent();
                                    return [4 /*yield*/, chaptersRequest.text()];
                                case 3:
                                    chaptersHtml = _a.sent();
                                    loadedCheerio = (0, cheerio_1.load)(chaptersHtml);
                                    loadedCheerio(".chapter-list li").each(function () {
                                        var _a;
                                        var chapterName = loadedCheerio(this)
                                            .find(".chapter-title")
                                            .text()
                                            .trim();
                                        var releaseDate = loadedCheerio(this)
                                            .find(".chapter-update")
                                            .text()
                                            .trim();
                                        var chapterUrl = baseUrl +
                                            ((_a = loadedCheerio(this)
                                                .find("a")
                                                .attr("href")) === null || _a === void 0 ? void 0 : _a.substring(1));
                                        novelChapters.push({
                                            name: chapterName,
                                            releaseTime: releaseDate,
                                            url: chapterUrl,
                                        });
                                    });
                                    return [4 /*yield*/, delay(1000)];
                                case 4:
                                    _a.sent();
                                    _a.label = 5;
                                case 5:
                                    i++;
                                    return [3 /*break*/, 1];
                                case 6: return [2 /*return*/, novelChapters];
                            }
                        });
                    }); };
                    _c = novel;
                    return [4 /*yield*/, getChapters()];
                case 3:
                    _c.chapters = _d.sent();
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
                    return [4 /*yield*/, (0, fetch_1.fetchApi)(url, { method: "GET", headers: headers })];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, result.text()];
                case 2:
                    body = _a.sent();
                    loadedCheerio = (0, cheerio_1.load)(body);
                    chapterText = loadedCheerio("#chapter-container").html();
                    return [2 /*return*/, chapterText];
            }
        });
    });
};
exports.parseChapter = parseChapter;
// They have API to search, pls update it, im quite lazy xD
var searchNovels = function (searchTerm) {
    return __awaiter(this, void 0, void 0, function () {
        var url, result, body, loadedCheerio, novels;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "".concat(baseUrl, "lnwsearchlive?inputContent=").concat(searchTerm);
                    return [4 /*yield*/, (0, fetch_1.fetchApi)(url, { method: "GET", headers: headers })];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, result.text()];
                case 2:
                    body = _a.sent();
                    loadedCheerio = (0, cheerio_1.load)(body);
                    novels = [];
                    //   let results = JSON.parse(loadedCheerio('body').text());
                    //   loadedCheerio = load(results.resultview);
                    //   loadedCheerio('.novel-item').each(function () {
                    //     const novelName = loadedCheerio(this).find('.novel-title').text().trim();
                    //     const novelCover = loadedCheerio(this).find('img').attr('src');
                    //     const novelUrl =
                    //       baseUrl + loadedCheerio(this).find('a').attr('href').substring(1);
                    //     const novel = { name: novelName, cover: novelCover, url: novelUrl };
                    //     novels.push(novel);
                    //   });
                    return [2 /*return*/, novels];
            }
        });
    });
};
exports.searchNovels = searchNovels;
exports.fetchImage = fetch_1.fetchFile;
