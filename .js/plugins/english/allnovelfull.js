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
var filterInputs_1 = require("@libs/filterInputs");
var AllNovelFullPlugin = /** @class */ (function () {
    function AllNovelFullPlugin() {
        this.id = "anf.net";
        this.name = "AllNovelFull";
        this.icon = "src/en/allnovelfull/icon.png";
        this.site = "https://allnovelfull.net";
        this.version = "1.0.0";
        this.userAgent = "";
        this.filters = {
            order: {
                value: "/most-popular",
                label: "Order by",
                options: [
                    { label: "Latest Release", value: "/latest-release-novel" },
                    { label: "Hot Novel", value: "/hot-novel" },
                    { label: "Completed Novel", value: "/completed-novel" },
                    { label: "Most Popular", value: "/most-popular" },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genres: {
                value: "",
                label: "Genre",
                options: [
                    { label: "Shounen", value: "/genre/Shounen" },
                    { label: "Harem", value: "/genre/Harem" },
                    { label: "Comedy", value: "/genre/Comedy" },
                    { label: "Martial Arts", value: "/genre/Martial+Arts" },
                    { label: "School Life", value: "/genre/School+Life" },
                    { label: "Mystery", value: "/genre/Mystery" },
                    { label: "Shoujo", value: "/genre/Shoujo" },
                    { label: "Romance", value: "/genre/Romance" },
                    { label: "Sci-fi", value: "/genre/Sci-fi" },
                    { label: "Gender Bender", value: "/genre/Gender+Bender" },
                    { label: "Mature", value: "/genre/Mature" },
                    { label: "Fantasy", value: "/genre/Fantasy" },
                    { label: "Horror", value: "/genre/Horror" },
                    { label: "Drama", value: "/genre/Drama" },
                    { label: "Tragedy", value: "/genre/Tragedy" },
                    { label: "Supernatural", value: "/genre/Supernatural" },
                    { label: "Ecchi", value: "/genre/Ecchi" },
                    { label: "Xuanhuan", value: "/genre/Xuanhuan" },
                    { label: "Adventure", value: "/genre/Adventure" },
                    { label: "Action", value: "/genre/Action" },
                    { label: "Psychological", value: "/genre/Psychological" },
                    { label: "Xianxia", value: "/genre/Xianxia" },
                    { label: "Wuxia", value: "/genre/Wuxia" },
                    { label: "Historical", value: "/genre/Historical" },
                    { label: "Slice of Life", value: "/genre/Slice+of+Life" },
                    { label: "Seinen", value: "/genre/Seinen" },
                    { label: "Lolicon", value: "/genre/Lolicon" },
                    { label: "Adult", value: "/genre/Adult" },
                    { label: "Josei", value: "/genre/Josei" },
                    { label: "Sports", value: "/genre/Sports" },
                    { label: "Smut", value: "/genre/Smut" },
                    { label: "Mecha", value: "/genre/Mecha" },
                    { label: "Yaoi", value: "/genre/Yaoi" },
                    { label: "Shounen Ai", value: "/genre/Shounen+Ai" },
                    { label: "Magical Realism", value: "/genre/Magical+Realism" },
                    { label: "Video Games", value: "/genre/Video+Games" },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    AllNovelFullPlugin.prototype.parseNovels = function (loadedCheerio) {
        var _this = this;
        var novels = [];
        loadedCheerio(".col-truyen-main .list-truyen .row").each(function (i, el) {
            var novelName = loadedCheerio(el)
                .find("h3.truyen-title > a")
                .text();
            var novelCover = _this.site + loadedCheerio(el).find("img.cover").attr("src");
            var novelUrl = _this.site + loadedCheerio(el).find("h3.truyen-title > a").attr("href");
            var novel = {
                url: novelUrl,
                name: novelName,
                cover: novelCover,
            };
            novels.push(novel);
        });
        return novels;
    };
    ;
    AllNovelFullPlugin.prototype.popularNovels = function (pageNo, _a) {
        var filters = _a.filters;
        return __awaiter(this, void 0, void 0, function () {
            var link, headers, body, loadedCheerio;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        link = this.site;
                        if (filters.genres.value.length)
                            link += filters.genres.value;
                        else
                            link += filters.order.value;
                        link += "?page=".concat(pageNo);
                        headers = new Headers();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(link, { headers: headers }).then(function (result) {
                                return result.text();
                            })];
                    case 1:
                        body = _b.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, this.parseNovels(loadedCheerio)];
                }
            });
        });
    };
    AllNovelFullPlugin.prototype.parseNovelAndChapters = function (novelUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var url, headers, result, body, loadedCheerio, novel, novelId, getChapters, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = novelUrl;
                        headers = new Headers();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url, { headers: headers })];
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
                        novel.name = loadedCheerio(".book > img").attr("alt");
                        novel.cover = this.site + loadedCheerio(".book > img").attr("src");
                        novel.summary = loadedCheerio(".desc-text").text().trim();
                        loadedCheerio(".info > div").each(function (i, el) {
                            var detailName = loadedCheerio(el).find("h3").text();
                            var detail = loadedCheerio(el)
                                .find('a')
                                .map(function (a, ex) { return loadedCheerio(ex).text(); })
                                .toArray()
                                .join(', ');
                            switch (detailName) {
                                case 'Author:':
                                    novel.author = detail;
                                    break;
                                case 'Status:':
                                    novel.status = detail;
                                    break;
                                case 'Genre:':
                                    novel.genres = detail;
                                    break;
                            }
                        });
                        novelId = loadedCheerio("#rating").attr("data-novel-id");
                        getChapters = function (id) { return __awaiter(_this, void 0, void 0, function () {
                            var chapterListUrl, data, chapters, chapter;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        chapterListUrl = this.site + "/ajax/chapter-option?novelId=" + id;
                                        return [4 /*yield*/, (0, fetch_1.fetchApi)(chapterListUrl, { headers: headers })];
                                    case 1:
                                        data = _a.sent();
                                        return [4 /*yield*/, data.text()];
                                    case 2:
                                        chapters = _a.sent();
                                        loadedCheerio = (0, cheerio_1.load)(chapters);
                                        chapter = [];
                                        loadedCheerio("select > option").each(function (i, el) {
                                            var chapterName = loadedCheerio(el).text();
                                            var releaseDate = null;
                                            var cUrl = loadedCheerio(el).attr("value");
                                            var chapterUrl = _this.site + cUrl;
                                            if (cUrl) {
                                                chapter.push({
                                                    name: chapterName,
                                                    releaseTime: releaseDate,
                                                    url: chapterUrl,
                                                });
                                            }
                                        });
                                        return [2 /*return*/, chapter];
                                }
                            });
                        }); };
                        if (!novelId) return [3 /*break*/, 4];
                        _a = novel;
                        return [4 /*yield*/, getChapters(novelId)];
                    case 3:
                        _a.chapters = _b.sent();
                        _b.label = 4;
                    case 4: return [2 /*return*/, novel];
                }
            });
        });
    };
    ;
    AllNovelFullPlugin.prototype.parseChapter = function (chapterUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var headers, result, body, loadedCheerio, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        headers = new Headers();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(chapterUrl, { headers: headers })];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        chapterText = loadedCheerio("#chapter-content").html() || "";
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    ;
    AllNovelFullPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, headers, result, body, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "/search?keyword=").concat(searchTerm);
                        headers = new Headers();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url, { headers: headers })];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, this.parseNovels(loadedCheerio)];
                }
            });
        });
    };
    ;
    AllNovelFullPlugin.prototype.fetchImage = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchFile)(url)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return AllNovelFullPlugin;
}());
exports.default = new AllNovelFullPlugin();
