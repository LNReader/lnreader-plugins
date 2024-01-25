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
var cheerio_1 = require("cheerio");
var defaultCover_1 = require("@libs/defaultCover");
var ReinoWuxia = /** @class */ (function () {
    function ReinoWuxia() {
        this.id = "awuxia.com";
        this.name = "ReinoWuxia";
        this.icon = "src/es/novelawuxia/icon.png";
        this.version = "1.0.0";
        this.site = "http://www.reinowuxia.com/";
        this.baseUrl = this.site;
    }
    ReinoWuxia.prototype.getNovelName = function (y) {
        return y === null || y === void 0 ? void 0 : y.replace(/-/g, " ").replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
    };
    ReinoWuxia.prototype.popularNovels = function (pageNo, options) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.baseUrl + "p/todas-las-novelas.html";
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url, {
                                method: "GET",
                            })];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio(".post-body.entry-content")
                            .find("a")
                            .each(function (idx, ele) {
                            var _a, _b;
                            var novelName = (_b = (_a = loadedCheerio(ele)
                                .attr("href")) === null || _a === void 0 ? void 0 : _a.split("/").pop()) === null || _b === void 0 ? void 0 : _b.replace(".html", "");
                            novelName = _this.getNovelName(novelName);
                            var novelCover = loadedCheerio(ele).find("img").attr("src");
                            var novelUrl = loadedCheerio(ele).attr("href");
                            if (!novelName || !novelUrl)
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
    ReinoWuxia.prototype.parseNovelAndChapters = function (novelUrl) {
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
                        novel.name = loadedCheerio("h1.post-title").text().trim();
                        novel.cover = loadedCheerio("div.separator").find("a").attr("href");
                        novel.status = "";
                        loadedCheerio("div > b").each(function () {
                            var detailName = loadedCheerio(this).text();
                            var detail = loadedCheerio(this)[0].nextSibling;
                            if (detailName && detail) {
                                var text = loadedCheerio(detail).text();
                                if (detailName.includes("Autor")) {
                                    novel.author = text.replace("Autor:", "");
                                }
                                if (detailName.includes("Estatus")) {
                                    novel.status = text.replace("Estatus: ", "");
                                }
                                if (detailName.includes("Géneros:")) {
                                    novel.genres = text
                                        .replace("Géneros: ", "")
                                        .replace(/,\s/g, ",");
                                }
                            }
                        });
                        novelChapters = [];
                        loadedCheerio("div").each(function () {
                            var detailName = loadedCheerio(this).text();
                            if (detailName.includes("Sinopsis")) {
                                novel.summary =
                                    loadedCheerio(this).next().text() !== ""
                                        ? loadedCheerio(this)
                                            .next()
                                            .text()
                                            .replace("Sinopsis", "")
                                            .trim()
                                        : loadedCheerio(this)
                                            .next()
                                            .next()
                                            .text()
                                            .replace("Sinopsis", "")
                                            .trim();
                            }
                            if (detailName.includes("Lista de Capítulos")) {
                                loadedCheerio(this)
                                    .find("a")
                                    .each(function (res) {
                                    var chapterName = loadedCheerio(this).text();
                                    var chapterUrl = loadedCheerio(this).attr("href");
                                    var releaseDate = null;
                                    if (chapterName &&
                                        chapterUrl &&
                                        !novelChapters.some(function (chap) { return chap.name === chapterName; })) {
                                        var chapter = {
                                            name: chapterName,
                                            releaseTime: releaseDate,
                                            url: chapterUrl,
                                        };
                                        novelChapters.push(chapter);
                                    }
                                });
                            }
                        });
                        novel.chapters = novelChapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    ReinoWuxia.prototype.parseChapter = function (chapterUrl) {
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
                        chapterText = loadedCheerio(".post-body.entry-content").html() || '';
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    ReinoWuxia.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.baseUrl, "search?q=").concat(searchTerm);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio(".date-outer").each(function (idx, ele) {
                            var _a, _b;
                            var novelName = (_b = (_a = loadedCheerio(ele)
                                .find("a")
                                .attr("href")) === null || _a === void 0 ? void 0 : _a.split("/").pop()) === null || _b === void 0 ? void 0 : _b.replace(/-capitulo(.*?).html/, "");
                            var novelUrl = novelName + ".html/";
                            novelName = _this.getNovelName(novelName);
                            var exists = novels.some(function (novel) { return novel.name === novelName; });
                            if (!exists) {
                                var novelCover = defaultCover_1.defaultCover;
                                if (!novelUrl || !novelName)
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
    ReinoWuxia.prototype.fetchImage = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, fetch_1.fetchFile)(url)];
            });
        });
    };
    return ReinoWuxia;
}());
exports.default = new ReinoWuxia();
