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
var novelStatus_1 = require("@libs/novelStatus");
var NovelRingan = /** @class */ (function () {
    function NovelRingan() {
        this.id = "novelringan.com";
        this.name = "NovelRingan";
        this.icon = "src/id/novelringan/icon.png";
        this.site = "https://novelringan.com/";
        this.version = "1.0.0";
        this.baseUrl = this.site;
        this.coverUriPrefix = "https://i0.wp.com/novelringan.com/wp-content/uploads/";
    }
    NovelRingan.prototype.popularNovels = function (pageNo, options) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.baseUrl, "/top-novel/page/").concat(pageNo);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio("article.post").each(function (idx, ele) {
                            var _a;
                            var novelName = (_a = loadedCheerio(ele)
                                .find(".entry-title")
                                .text()) === null || _a === void 0 ? void 0 : _a.trim();
                            var novelCover = _this.coverUriPrefix + loadedCheerio(ele).find("img").attr("data-sxrx");
                            var novelUrl = loadedCheerio(ele).find("h2 > a").attr("href");
                            if (!novelUrl)
                                return;
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
    NovelRingan.prototype.parseNovelAndChapters = function (novelUrl) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, novel, genreSelector, statusSelector, chapters;
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
                            name: "",
                            cover: "",
                            genres: "",
                            author: "",
                            status: novelStatus_1.NovelStatus.Unknown,
                            summary: "",
                            chapters: [],
                        };
                        novel.name = (_a = loadedCheerio(".entry-title").text()) === null || _a === void 0 ? void 0 : _a.trim();
                        novel.cover =
                            this.coverUriPrefix +
                                loadedCheerio("img.ts-post-image").attr("data-sxrx");
                        novel.summary = loadedCheerio("body > div.site-container > div > main > article > div > div.maininfo > span > p").text();
                        genreSelector = loadedCheerio("body > div.site-container > div > main > article > div > div.maininfo > span > ul > li:nth-child(4)").text();
                        novel.genres = genreSelector.includes("Genre")
                            ? genreSelector.replace("Genre:", "").trim()
                            : "";
                        statusSelector = loadedCheerio("body > div.site-container > div > main > article > div > div.maininfo > span > ul > li:nth-child(3)").text();
                        novel.status = statusSelector.includes("Status")
                            ? statusSelector.replace("Status:", "").trim()
                            : novelStatus_1.NovelStatus.Unknown;
                        chapters = [];
                        loadedCheerio(".bxcl > ul > li").each(function () {
                            var chapterName = loadedCheerio(this).find("a").text();
                            var releaseDate = null;
                            var chapterUrl = loadedCheerio(this).find("a").attr("href");
                            if (!chapterUrl)
                                return;
                            var chapter = {
                                name: chapterName,
                                releaseTime: releaseDate,
                                url: chapterUrl,
                            };
                            chapters.push(chapter);
                        });
                        novel.chapters = chapters.reverse();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    NovelRingan.prototype.parseChapter = function (chapterUrl) {
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
                        loadedCheerio('.entry-content div[style="display:none"]').remove();
                        chapterText = loadedCheerio(".entry-content").html() || '';
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    NovelRingan.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.baseUrl + "?s=" + searchTerm;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio("article.post").each(function (idx, ele) {
                            var novelName = loadedCheerio(ele).find(".entry-title").text();
                            var novelCover = _this.coverUriPrefix + loadedCheerio(ele).find("img").attr("data-sxrx");
                            var novelUrl = loadedCheerio(ele).find("h2 > a").attr("href");
                            if (!novelUrl)
                                return;
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
    NovelRingan.prototype.fetchImage = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, fetch_1.fetchFile)(url)];
            });
        });
    };
    return NovelRingan;
}());
exports.default = new NovelRingan();
