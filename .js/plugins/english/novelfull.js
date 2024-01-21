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
var cheerio_1 = require("cheerio");
var fetch_1 = require("@libs/fetch");
var NovelFull = /** @class */ (function () {
    function NovelFull() {
        this.id = "novelfull";
        this.name = "NovelFull";
        this.version = "1.0.0";
        this.icon = "src/en/novelfull/icon.png";
        this.site = "https://novelfull.com/";
        this.baseUrl = this.site;
    }
    NovelFull.prototype.popularNovels = function (pageNo, options) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.baseUrl, "most-popular?page=").concat(pageNo);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio(".col-truyen-main .list-truyen .row").each(function (idx, ele) {
                            var _a, _b;
                            var novelName = loadedCheerio(ele)
                                .find("h3.truyen-title > a")
                                .text();
                            var novelCover = _this.baseUrl + ((_a = loadedCheerio(ele).find("img").attr("src")) === null || _a === void 0 ? void 0 : _a.slice(1));
                            var novelUrl = _this.baseUrl +
                                ((_b = loadedCheerio(ele)
                                    .find("h3.truyen-title > a")
                                    .attr("href")) === null || _b === void 0 ? void 0 : _b.slice(1));
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
        });
    };
    NovelFull.prototype.parseNovelAndChapters = function (novelUrl) {
        return __awaiter(this, void 0, void 0, function () {
            function getChapters(id, baseUrl) {
                return __awaiter(this, void 0, void 0, function () {
                    var chapterListUrl, data, chapterlist, chapter;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                chapterListUrl = baseUrl + "ajax/chapter-option?novelId=" + id;
                                return [4 /*yield*/, (0, fetch_1.fetchApi)(chapterListUrl)];
                            case 1:
                                data = _a.sent();
                                return [4 /*yield*/, data.text()];
                            case 2:
                                chapterlist = _a.sent();
                                loadedCheerio = (0, cheerio_1.load)(chapterlist);
                                chapter = [];
                                loadedCheerio("select > option").each(function () {
                                    var _a;
                                    var chapterName = loadedCheerio(this).text();
                                    var releaseDate = null;
                                    var chapterUrl = baseUrl + ((_a = loadedCheerio(this).attr("value")) === null || _a === void 0 ? void 0 : _a.slice(1));
                                    chapter.push({
                                        name: chapterName,
                                        releaseTime: releaseDate,
                                        url: chapterUrl,
                                    });
                                });
                                return [2 /*return*/, chapter];
                        }
                    });
                });
            }
            var url, result, body, loadedCheerio, novel, novelId, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = novelUrl;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _b.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _b.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            url: url,
                            chapters: [],
                        };
                        novel.name = loadedCheerio("div.book > img").attr("alt");
                        novel.cover = this.baseUrl + loadedCheerio("div.book > img").attr("src");
                        novel.summary = loadedCheerio("div.desc-text").text().trim();
                        novel.author = loadedCheerio('h3:contains("Author")')
                            .parent()
                            .contents()
                            .text()
                            .replace("Author:", "");
                        novel.genres = loadedCheerio('h3:contains("Genre")')
                            .siblings()
                            .map(function (i, el) { return loadedCheerio(el).text(); })
                            .toArray()
                            .join(",");
                        novel.status = loadedCheerio('h3:contains("Status")').next().text();
                        novelId = loadedCheerio("#rating").attr("data-novel-id");
                        _a = novel;
                        return [4 /*yield*/, getChapters(novelId, this.baseUrl)];
                    case 3:
                        _a.chapters = _b.sent();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    NovelFull.prototype.parseChapter = function (chapterUrl) {
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
                        loadedCheerio("#chapter-content div.ads").remove();
                        chapterText = loadedCheerio("#chapter-content").html() || '';
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    NovelFull.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var searchUrl, result, body, loadedCheerio, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchUrl = "".concat(this.baseUrl, "search?keyword=").concat(searchTerm);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(searchUrl)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio(".col-truyen-main .list-truyen .row").each(function (idx, ele) {
                            var _a, _b;
                            var novelName = loadedCheerio(ele)
                                .find("h3.truyen-title > a")
                                .text();
                            var novelCover = _this.baseUrl + ((_a = loadedCheerio(ele).find("img").attr("src")) === null || _a === void 0 ? void 0 : _a.slice(1));
                            var novelUrl = _this.baseUrl +
                                ((_b = loadedCheerio(ele)
                                    .find("h3.truyen-title > a")
                                    .attr("href")) === null || _b === void 0 ? void 0 : _b.slice(1));
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
        });
    };
    NovelFull.prototype.fetchImage = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, fetch_1.fetchFile)(url)];
            });
        });
    };
    return NovelFull;
}());
exports.default = new NovelFull();
