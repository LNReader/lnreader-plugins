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
var parseMadaraDate_1 = require("@libs/parseMadaraDate");
var ComradeMaoPlugin = /** @class */ (function () {
    function ComradeMaoPlugin() {
        this.id = "comrademao";
        this.name = "Comrade Mao";
        this.site = "https://comrademao.com/";
        this.version = "1.0.0";
        this.icon = "src/en/comrademao/icon.png";
        this.filters = {
            category: {
                value: "",
                label: "Type",
                options: [
                    { label: "None", value: "" },
                    { label: "Chinese", value: "/mtype/chinese/" },
                    { label: "Japanese", value: "/mtype/japanese/" },
                    { label: "Korean", value: "/mtype/korean/" },
                    { label: "Manhua", value: "/mtype/manhua/" },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    ComradeMaoPlugin.prototype.parseNovels = function (loadedCheerio) {
        var novels = [];
        loadedCheerio(".listupd")
            .find("div.bs")
            .each(function () {
            var novelName = loadedCheerio(this).find(".tt").text().trim();
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
        });
        return novels;
    };
    ComradeMaoPlugin.prototype.popularNovels = function (pageNo, _a) {
        var filters = _a.filters;
        return __awaiter(this, void 0, void 0, function () {
            var link, headers, body, loadedCheerio;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        link = this.site;
                        link += filters.category.value;
                        link += "page/" + pageNo + "/?post_type=novel";
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
    ComradeMaoPlugin.prototype.parseNovelAndChapters = function (novelUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var url, headers, result, body, loadedCheerio, novel, chapter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = novelUrl;
                        headers = new Headers();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url, { headers: headers })];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            url: url,
                            chapters: [],
                        };
                        novel.name = loadedCheerio(".entry-title").text().trim();
                        novel.cover = loadedCheerio("div.thumbook > div > img").attr("src");
                        loadedCheerio(".infox .wd-full").each(function (i, el) {
                            var detailName = loadedCheerio(el).find("b").text();
                            var detail = loadedCheerio(el).find('span').text();
                            switch (detailName) {
                                case 'Publisher: ':
                                    novel.author = detail.trim();
                                    break;
                                case 'Status: ':
                                    novel.status = detail.trim();
                                    break;
                                case 'Genres:':
                                    novel.genres = detail.trim().replace(/ , /g, ',');
                                    break;
                                case 'Description: ':
                                    novel.summary = detail.trim();
                                    break;
                            }
                        });
                        chapter = [];
                        loadedCheerio("#chapterlist")
                            .find("li")
                            .each(function () {
                            var releaseDate = (0, parseMadaraDate_1.parseMadaraDate)(loadedCheerio(this).find(".chapterdate").text());
                            var chapterName = loadedCheerio(this)
                                .find(".chapternum")
                                .text();
                            var chapterUrl = loadedCheerio(this).find("a").attr("href");
                            if (!chapterUrl)
                                return;
                            chapter.push({
                                name: chapterName,
                                url: chapterUrl,
                                releaseTime: releaseDate,
                            });
                        });
                        novel.chapters = chapter.reverse();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    ;
    ComradeMaoPlugin.prototype.parseChapter = function (chapterUrl) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var headers, result, body, loadedCheerio, chapterText;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        headers = new Headers();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(chapterUrl, { headers: headers })];
                    case 1:
                        result = _b.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _b.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        chapterText = ((_a = loadedCheerio("#chaptercontent").html()) === null || _a === void 0 ? void 0 : _a.trim()) || "";
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    ;
    ComradeMaoPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, headers, result, body, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "page/").concat(pageNo, "/?s=").concat(searchTerm, "&post_type=novel");
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
    ComradeMaoPlugin.prototype.fetchImage = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchFile)(url)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return ComradeMaoPlugin;
}());
exports.default = new ComradeMaoPlugin();
