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
exports.icon = exports.version = exports.site = exports.name = exports.id = void 0;
var fetch_1 = require("@libs/fetch");
var cheerio_1 = require("cheerio");
exports.id = "oasisTL.wp";
exports.name = "Oasis Translations";
exports.site = "https://oasistranslations.wordpress.com/";
exports.version = "1.0.0";
exports.icon = "src/es/oasistranslations/icon.png";
var baseUrl = exports.site;
var Oasis = /** @class */ (function () {
    function Oasis() {
        this.id = "oasisTL.wp";
        this.name = "Oasis Translations";
        this.site = "https://oasistranslations.wordpress.com/";
        this.version = "1.0.0";
        this.icon = "src/es/oasistranslations/icon.png";
    }
    Oasis.prototype.popularNovels = function (pageNo, options) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, novels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = baseUrl;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio(".menu-item-1819")
                            .find(".sub-menu > li")
                            .each(function () {
                            var novelName = loadedCheerio(this).text();
                            if (!novelName.match(/Activas|Finalizadas|Dropeadas/)) {
                                var novelCover = loadedCheerio(this).find("img").attr("src");
                                var novelUrl = loadedCheerio(this).find("a").attr("href");
                                if (!novelUrl)
                                    return;
                                var novel = {
                                    name: novelName,
                                    cover: novelCover,
                                    url: novelUrl,
                                };
                                novels.push(novel);
                            }
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    Oasis.prototype.parseNovelAndChapters = function (novelUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, novel, novelChapters;
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
                        novel = { url: url };
                        novel.name = loadedCheerio("h1.entry-title")
                            .text()
                            .replace(/[\t\n]/g, "")
                            .trim();
                        novel.cover = loadedCheerio('img[loading="lazy"]').attr("src");
                        loadedCheerio(".entry-content > p").each(function (res) {
                            var _a, _b;
                            if (loadedCheerio(this).text().includes("Autor")) {
                                var details = (_b = (_a = loadedCheerio(this).html()) === null || _a === void 0 ? void 0 : _a.match(/<\/strong>(.|\n)*?<br>/g)) === null || _b === void 0 ? void 0 : _b.map(function (detail) { return detail.replace(/<strong>|<\/strong>|<br>|:\s/g, ""); });
                                novel.genres = "";
                                if (details) {
                                    novel.author = details[2];
                                    novel.genres = details[4].replace(/\s|&nbsp;/g, "");
                                }
                            }
                        });
                        // let novelSummary = $(this).next().html();
                        novel.summary = "";
                        novelChapters = [];
                        // if ($(".entry-content").find("li").length) {
                        loadedCheerio(".entry-content")
                            .find("a")
                            .each(function () {
                            var chapterUrl = loadedCheerio(this).attr("href");
                            if (chapterUrl && chapterUrl.includes(baseUrl)) {
                                var chapterName = loadedCheerio(this).text();
                                var releaseDate = null;
                                var chapter = {
                                    name: chapterName,
                                    releaseTime: releaseDate,
                                    url: chapterUrl,
                                };
                                novelChapters.push(chapter);
                            }
                        });
                        novel.chapters = novelChapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    Oasis.prototype.parseChapter = function (chapterUrl) {
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
                        loadedCheerio("div#jp-post-flair").remove();
                        chapterText = loadedCheerio(".entry-content").html() || '';
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    Oasis.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, novels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchTerm = searchTerm.toLowerCase();
                        url = baseUrl;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio(".menu-item-1819")
                            .find(".sub-menu > li")
                            .each(function () {
                            var novelName = loadedCheerio(this).text();
                            if (!novelName.match(/Activas|Finalizadas|Dropeadas/)) {
                                var novelCover = loadedCheerio(this).find("img").attr("src");
                                var novelUrl = loadedCheerio(this).find("a").attr("href");
                                if (!novelUrl)
                                    return;
                                var novel = {
                                    name: novelName,
                                    cover: novelCover,
                                    url: novelUrl,
                                };
                                novels.push(novel);
                            }
                        });
                        novels = novels.filter(function (novel) {
                            return novel.name.toLowerCase().includes(searchTerm);
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    Oasis.prototype.fetchImage = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, fetch_1.fetchFile)(url)];
            });
        });
    };
    return Oasis;
}());
exports.default = new Oasis();
