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
var fetch_1 = require("@libs/fetch");
var novelStatus_1 = require("@libs/novelStatus");
var cheerio_1 = require("cheerio");
var Wuxiaworld = /** @class */ (function () {
    function Wuxiaworld() {
        this.id = "wuxiaworld";
        this.name = "Wuxia World (WIP)";
        this.version = "1.0.0";
        this.icon = "src/en/wuxiaworld/icon.png";
        this.site = "https://www.wuxiaworld.com";
        this.fetchImage = fetch_1.fetchFile;
    }
    Wuxiaworld.prototype.popularNovels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + "/api/novels").then(function (res) {
                            return res.json();
                        })];
                    case 1:
                        result = (_a.sent());
                        novels = result.items.map(function (novel) { return ({
                            name: novel.name,
                            cover: novel.coverUrl,
                            url: _this.site + "/novel/" + novel.slug,
                        }); });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    Wuxiaworld.prototype.parseNovelAndChapters = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var result, loadedCheerio, novel, genres, chapters;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (res) { return res.text(); })];
                    case 1:
                        result = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(result);
                        novel = { url: url };
                        novel.name = loadedCheerio("h1.line-clamp-2").text();
                        novel.cover = loadedCheerio("img.absolute").attr("src");
                        novel.summary = loadedCheerio("div.flex-col:nth-child(4) > div > div > span > span")
                            .text()
                            .trim();
                        novel.author = loadedCheerio("div.MuiGrid-container > div > div > div")
                            .filter(function () {
                            return loadedCheerio(this).text().trim() === "Author:";
                        })
                            .next()
                            .text();
                        genres = loadedCheerio("a.MuiLink-underlineNone")
                            .map(function (index, element) { var _a; return (_a = loadedCheerio(element).find("div > div").text()) === null || _a === void 0 ? void 0 : _a.trim(); })
                            .get();
                        if (genres === null || genres === void 0 ? void 0 : genres.length) {
                            novel.genres = genres.join(",");
                        }
                        novel.status = loadedCheerio("div.font-set-b10").text().includes("Complete")
                            ? novelStatus_1.NovelStatus.Completed
                            : novelStatus_1.NovelStatus.Ongoing;
                        chapters = loadedCheerio("div.border-b.border-gray-line-base")
                            .map(function (chapterIndex, element) { return ({
                            name: loadedCheerio(element).find("a > div > div > div > span").text(),
                            url: _this.site + loadedCheerio(element).find("a").attr("href"),
                            releaseTime: loadedCheerio(element).find("a > div > div > div > div > span").text(),
                            chapterNumber: chapterIndex + 1,
                        }); })
                            .get();
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    Wuxiaworld.prototype.parseChapter = function (chapterUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(chapterUrl).then(function (res) { return res.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        loadedCheerio(".chapter-nav").remove();
                        loadedCheerio("#chapter-content > script").remove();
                        chapterText = loadedCheerio("#chapter-content").html() || "";
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    Wuxiaworld.prototype.searchNovels = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + "/api/novels/search?query=" + searchTerm;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (res) { return res.json(); })];
                    case 1:
                        result = (_a.sent());
                        novels = result.items.map(function (novel) { return ({
                            name: novel.name,
                            cover: novel.coverUrl,
                            url: _this.site + "/novel/" + novel.slug,
                        }); });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return Wuxiaworld;
}());
exports.default = new Wuxiaworld();
