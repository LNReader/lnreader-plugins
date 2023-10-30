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
exports.fetchImage = exports.searchNovels = exports.parseChapter = exports.parseNovelAndChapters = exports.popularNovels = exports.site = exports.icon = exports.version = exports.name = exports.id = void 0;
var cheerio_1 = require("cheerio");
var fetch_1 = require("@libs/fetch");
var showToast_1 = require("@libs/showToast");
var defaultCover_1 = require("@libs/defaultCover");
exports.id = "earlynovel";
exports.name = "Early Novel";
exports.version = "1.0.0";
exports.icon = "multisrc/madara/icons/latestnovel.png";
exports.site = "https://earlynovel.net/";
var pluginId = exports.id;
var baseUrl = exports.site;
var popularNovels = function (page) {
    return __awaiter(this, void 0, void 0, function () {
        var url, body, loadedCheerio, novels;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "".concat(baseUrl, "most-popular?page=").concat(page);
                    return [4 /*yield*/, (0, fetch_1.fetchApi)(url, {}, pluginId).then(function (r) { return r.text(); })];
                case 1:
                    body = _a.sent();
                    loadedCheerio = (0, cheerio_1.load)(body);
                    novels = [];
                    loadedCheerio(".col-truyen-main > .list-truyen > .row").each(function () {
                        var _a;
                        var novelName = loadedCheerio(this)
                            .find("h3.truyen-title > a")
                            .attr("title");
                        var novelCover = loadedCheerio(this).find(".lazyimg").attr("data-desk-image") ||
                            loadedCheerio(this).find("img.cover").attr("src");
                        var novelUrl = baseUrl +
                            ((_a = loadedCheerio(this)
                                .find("h3.truyen-title > a")
                                .attr("href")) === null || _a === void 0 ? void 0 : _a.slice(1));
                        if (!novelUrl || !novelName)
                            return;
                        var novel = {
                            name: novelName,
                            cover: novelCover || defaultCover_1.defaultCover,
                            url: novelUrl,
                        };
                        novels.push(novel);
                    });
                    return [2 /*return*/, novels];
            }
        });
    });
};
exports.popularNovels = popularNovels;
var parseNovelAndChapters = function (novelUrl) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        function getChapters() {
            return __awaiter(this, void 0, void 0, function () {
                var chapter, i, chaptersUrl, chaptersHtml;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            chapter = [];
                            i = 1;
                            _a.label = 1;
                        case 1:
                            if (!(i <= lastPage)) return [3 /*break*/, 5];
                            chaptersUrl = "".concat(novelUrl, "?page=").concat(i);
                            return [4 /*yield*/, (0, fetch_1.fetchApi)(chaptersUrl, {}, pluginId).then(function (r) { return r.text(); })];
                        case 2:
                            chaptersHtml = _a.sent();
                            loadedCheerio = (0, cheerio_1.load)(chaptersHtml);
                            loadedCheerio("ul.list-chapter > li").each(function () {
                                var _a;
                                var chapterName = loadedCheerio(this)
                                    .find(".chapter-text")
                                    .text()
                                    .trim();
                                var releaseDate = null;
                                var chapterHref = (_a = loadedCheerio(this)
                                    .find("a")
                                    .attr("href")) === null || _a === void 0 ? void 0 : _a.slice(1);
                                if (!chapterHref)
                                    return;
                                var chapterUrl = baseUrl + chapterHref;
                                chapter.push({
                                    name: chapterName,
                                    releaseTime: releaseDate,
                                    url: chapterUrl,
                                });
                            });
                            return [4 /*yield*/, delay(1000)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            i++;
                            return [3 /*break*/, 1];
                        case 5: return [2 /*return*/, chapter];
                    }
                });
            });
        }
        var url, body, loadedCheerio, name, cover, summary, novel, delay, lastPageStr, lastPage, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    (0, showToast_1.showToast)("Early Novel may take 20-30 seconds");
                    url = novelUrl;
                    return [4 /*yield*/, (0, fetch_1.fetchApi)(url, {}, pluginId).then(function (r) { return r.text(); })];
                case 1:
                    body = _c.sent();
                    loadedCheerio = (0, cheerio_1.load)(body);
                    name = loadedCheerio(".book > img").attr("alt");
                    cover = loadedCheerio(".book > img").attr("src") || defaultCover_1.defaultCover;
                    summary = loadedCheerio(".desc-text").text().trim();
                    novel = {
                        url: url,
                        chapters: [],
                        name: name,
                        summary: summary,
                        cover: cover,
                    };
                    loadedCheerio(".info > div > h3").each(function () {
                        var detailName = loadedCheerio(this).text();
                        var detail = loadedCheerio(this)
                            .siblings()
                            .map(function (i, el) { return loadedCheerio(el).text(); })
                            .toArray()
                            .join(",");
                        switch (detailName) {
                            case "Author:":
                                novel.author = detail;
                                break;
                            case "Status:":
                                novel.status = detail;
                                break;
                            case "Genre:":
                                novel.genres = detail;
                                break;
                        }
                    });
                    delay = function (ms) { return new Promise(function (res) { return setTimeout(res, ms); }); };
                    lastPageStr = (_a = loadedCheerio('a:contains("Last ")')
                        .attr("title")) === null || _a === void 0 ? void 0 : _a.match(/(\d+)/g);
                    lastPage = Number((lastPageStr === null || lastPageStr === void 0 ? void 0 : lastPageStr[1]) || "0");
                    _b = novel;
                    return [4 /*yield*/, getChapters()];
                case 2:
                    _b.chapters = _c.sent();
                    return [2 /*return*/, novel];
            }
        });
    });
};
exports.parseNovelAndChapters = parseNovelAndChapters;
var parseChapter = function (chapterUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var body, loadedCheerio, chapterText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(chapterUrl, {}, pluginId).then(function (r) { return r.text(); })];
                case 1:
                    body = _a.sent();
                    loadedCheerio = (0, cheerio_1.load)(body);
                    chapterText = loadedCheerio("#chapter-c").html() || "";
                    return [2 /*return*/, chapterText];
            }
        });
    });
};
exports.parseChapter = parseChapter;
var searchNovels = function (searchTerm) {
    return __awaiter(this, void 0, void 0, function () {
        var url, body, loadedCheerio, novels;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "".concat(baseUrl, "search?keyword=").concat(searchTerm);
                    return [4 /*yield*/, (0, fetch_1.fetchApi)(url, {}, pluginId).then(function (r) { return r.text(); })];
                case 1:
                    body = _a.sent();
                    loadedCheerio = (0, cheerio_1.load)(body);
                    novels = [];
                    loadedCheerio("div.col-truyen-main > div.list-truyen > .row").each(function () {
                        var novelUrl = baseUrl +
                            loadedCheerio(this).find("h3.truyen-title > a").attr("href");
                        var novelName = loadedCheerio(this)
                            .find("h3.truyen-title > a")
                            .text();
                        var novelCover = baseUrl + loadedCheerio(this).find("img").attr("src");
                        if (novelUrl) {
                            novels.push({
                                url: novelUrl,
                                name: novelName,
                                cover: novelCover,
                            });
                        }
                    });
                    return [2 /*return*/, novels];
            }
        });
    });
};
exports.searchNovels = searchNovels;
var fetchImage = function fetchImage(url) {
    return __awaiter(this, void 0, void 0, function () {
        var headers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = {
                        Referer: baseUrl,
                    };
                    return [4 /*yield*/, (0, fetch_1.fetchFile)(url, { headers: headers })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.fetchImage = fetchImage;
