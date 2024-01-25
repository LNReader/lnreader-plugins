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
var SakuraNovel = /** @class */ (function () {
    function SakuraNovel() {
        this.id = "sakura.id";
        this.name = "SakuraNovel";
        this.icon = "src/id/sakuranovel/icon.png";
        this.site = "https://sakuranovel.id/";
        this.version = "1.0.0";
        this.baseUrl = this.site;
    }
    SakuraNovel.prototype.popularNovels = function (pageNo, options) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, novels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.baseUrl, "advanced-search/page/").concat(pageNo, "/?title&author&yearx&status&type&order=rating&country%5B0%5D=china&country%5B1%5D=jepang&country%5B2%5D=unknown");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio(".flexbox2-item").each(function () {
                            var novelName = loadedCheerio(this)
                                .find(".flexbox2-title span")
                                .first()
                                .text();
                            var novelCover = loadedCheerio(this).find("img").attr("src");
                            var novelUrl = loadedCheerio(this)
                                .find(".flexbox2-content > a")
                                .attr("href");
                            if (!novelUrl)
                                return;
                            var novel = { name: novelName, cover: novelCover, url: novelUrl };
                            novels.push(novel);
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    SakuraNovel.prototype.parseNovelAndChapters = function (novelUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var result, body, loadedCheerio, novel, chapters;
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
                        };
                        novel.name = loadedCheerio(".series-title h2").text().trim();
                        novel.cover = loadedCheerio(".series-thumb img").attr("src");
                        loadedCheerio(".series-infolist > li").each(function () {
                            var detailName = loadedCheerio(this).find("b").text().trim();
                            var detail = loadedCheerio(this).find("b").next().text().trim();
                            switch (detailName) {
                                case "Author":
                                    novel.author = detail;
                                    break;
                            }
                        });
                        novel.status = loadedCheerio(".status").text().trim();
                        novel.genres = loadedCheerio(".series-genres")
                            .children("a")
                            .map(function (i, el) { return loadedCheerio(el).text(); })
                            .toArray()
                            .join(",");
                        loadedCheerio(".series-synops div").remove();
                        novel.summary = loadedCheerio(".series-synops").text().trim();
                        chapters = [];
                        loadedCheerio(".series-chapterlist li").each(function () {
                            var chapterName = loadedCheerio(this)
                                .find("a span")
                                .first()
                                .text()
                                .replace(/.*?(Chapter.|[0-9])/g, "$1")
                                .replace(/Bahasa Indonesia/g, "")
                                .replace(/\s+/g, " ")
                                .trim();
                            var releaseDate = loadedCheerio(this)
                                .find("a span")
                                .first()
                                .next()
                                .text();
                            var chapterUrl = loadedCheerio(this).find("a").attr("href");
                            if (!chapterUrl)
                                return;
                            chapters.push({
                                name: chapterName,
                                releaseTime: releaseDate,
                                url: chapterUrl,
                            });
                        });
                        novel.chapters = chapters.reverse();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    SakuraNovel.prototype.parseChapter = function (chapterUrl) {
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
                        chapterText = loadedCheerio(".readerss").html() || '';
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    SakuraNovel.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, novels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.baseUrl, "?s=").concat(searchTerm);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio(".flexbox2-item").each(function () {
                            var novelName = loadedCheerio(this)
                                .find(".flexbox2-title span")
                                .first()
                                .text();
                            var novelCover = loadedCheerio(this).find("img").attr("src");
                            var novelUrl = loadedCheerio(this)
                                .find(".flexbox2-content > a")
                                .attr("href");
                            if (!novelUrl)
                                return;
                            var novel = { name: novelName, cover: novelCover, url: novelUrl };
                            novels.push(novel);
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    SakuraNovel.prototype.fetchImage = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, fetch_1.fetchFile)(url)];
            });
        });
    };
    return SakuraNovel;
}());
exports.default = new SakuraNovel();
