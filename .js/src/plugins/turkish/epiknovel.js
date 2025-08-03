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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var EpikNovel = /** @class */ (function () {
    function EpikNovel() {
        this.id = 'epiknovel';
        this.name = 'EpikNovel';
        this.icon = 'src/tr/epiknovel/icon.png';
        this.site = 'https://www.epiknovel.com/';
        this.version = '1.0.0';
    }
    EpikNovel.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + 'seri-listesi?Sayfa=' + pageNo;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio('div.col-lg-12.col-md-12').each(function (idx, ele) {
                            var novelName = loadedCheerio(ele).find('h3').text();
                            var novelCover = loadedCheerio(ele).find('img').attr('data-src');
                            var novelUrl = loadedCheerio(ele).find('h3 > a').attr('href');
                            if (!novelUrl)
                                return;
                            var novel = {
                                name: novelName,
                                cover: novelCover,
                                path: novelUrl.replace(_this.site, ''),
                            };
                            novels.push(novel);
                        });
                        // console.log(novels);
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    EpikNovel.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, novel, novelChapters;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + novelPath;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('h1#tables').text().trim(),
                        };
                        novel.cover = loadedCheerio('img.manga-cover').attr('src');
                        novel.summary = loadedCheerio('#wrapper > div.row > div.col-md-9 > div:nth-child(6) > p:nth-child(3)')
                            .text()
                            .trim();
                        novel.status = loadedCheerio('#wrapper > div.row > div.col-md-9 > div.row > div.col-md-9 > h4:nth-child(3) > a')
                            .text()
                            .trim();
                        novel.author = loadedCheerio('#NovelInfo > p:nth-child(4)')
                            .text()
                            .replace(/Publisher:|\s/g, '')
                            .trim();
                        novelChapters = [];
                        loadedCheerio('table').find('tr').first().remove();
                        loadedCheerio('table')
                            .find('tr')
                            .each(function (idx, ele) {
                            var releaseDate = loadedCheerio(ele).find('td:nth-child(3)').text();
                            var chapterName = loadedCheerio(ele).find('td:nth-child(1) > a').text();
                            if (loadedCheerio(ele).find('td:nth-child(1) > span').length > 0) {
                                chapterName = '🔒 ' + chapterName;
                            }
                            var chapterUrl = loadedCheerio(ele)
                                .find(' td:nth-child(1) > a')
                                .attr('href');
                            if (!chapterUrl)
                                return;
                            novelChapters.push({
                                name: chapterName,
                                path: chapterUrl.replace(_this.site, ''),
                                releaseTime: releaseDate,
                            });
                        });
                        novel.chapters = novelChapters;
                        // console.log(novel);
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    EpikNovel.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + chapterPath;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        chapterText = '';
                        if (result.url === this.site + 'login') {
                            chapterText = 'Premium Chapter';
                        }
                        else {
                            chapterText = loadedCheerio('div#icerik').html() || '';
                        }
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    EpikNovel.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + 'seri-listesi?q=' + searchTerm + '&Sayfa=' + pageNo;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio('div.col-lg-12.col-md-12').each(function (idx, ele) {
                            var novelName = loadedCheerio(ele).find('h3').text();
                            var novelCover = loadedCheerio(ele).find('img').attr('data-src');
                            var novelUrl = loadedCheerio(ele).find('h3 > a').attr('href');
                            if (!novelUrl)
                                return;
                            var novel = {
                                name: novelName,
                                cover: novelCover,
                                path: novelUrl.replace(_this.site, ''),
                            };
                            novels.push(novel);
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return EpikNovel;
}());
exports.default = new EpikNovel();
