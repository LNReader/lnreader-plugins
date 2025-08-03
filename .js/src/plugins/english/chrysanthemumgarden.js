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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = require("@libs/fetch");
var cheerio_1 = require("cheerio");
var defaultCover_1 = require("@libs/defaultCover");
var Chrysanthemumgarden = /** @class */ (function () {
    function Chrysanthemumgarden() {
        var _this = this;
        this.id = 'chrysanthemumgarden';
        this.name = 'Chrysanthemum Garden';
        this.icon = 'src/en/chrysanthemumgarden/icon.png';
        this.site = 'https://chrysanthemumgarden.com';
        this.version = '1.0.0';
        this.filters = undefined;
        this.imageRequestInit = undefined;
        this.resolveUrl = function (path, isNovel) {
            return _this.site + (isNovel ? '/book/' : '/chapter/') + path;
        };
    }
    Chrysanthemumgarden.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var req, body, loadedCheerio;
            var _this = this;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + (pageNo === 1 ? '/books' : '/books/page/' + pageNo) + '/')];
                    case 1:
                        req = _c.sent();
                        return [4 /*yield*/, req.text()];
                    case 2:
                        body = _c.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, loadedCheerio('article')
                                .map(function (i, el) {
                                var _a;
                                if (loadedCheerio(el)
                                    .find('div.series-genres > a')
                                    .text()
                                    .includes('Manhua'))
                                    return;
                                return {
                                    name: loadedCheerio(el).find('h2.novel-title > a').text(),
                                    path: (_a = loadedCheerio(el)
                                        .find('h2.novel-title > a')
                                        .attr('href')) === null || _a === void 0 ? void 0 : _a.replace(_this.site, '').replace(/^\//, '').replace(/\/$/, ''),
                                    cover: loadedCheerio(el)
                                        .find('div.novel-cover > img')
                                        .attr('data-breeze'),
                                };
                            })
                                .toArray()
                                .filter(Boolean)];
                }
            });
        });
    };
    Chrysanthemumgarden.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var req, body, loadedCheerio, novel;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/' + novelPath + '/')];
                    case 1:
                        req = _b.sent();
                        return [4 /*yield*/, req.text()];
                    case 2:
                        body = _b.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        loadedCheerio('h1.novel-title > span.novel-raw-title').remove();
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('h1.novel-title').text(),
                            cover: loadedCheerio('div.novel-cover > img').attr('data-breeze'),
                            summary: loadedCheerio('div.entry-content').text(),
                        };
                        novel.author = (_a = loadedCheerio('div.novel-info')
                            .html()
                            .match(/Author:\s*([^<]*)<br>/)) === null || _a === void 0 ? void 0 : _a[1].trim();
                        novel.genres = __spreadArray(__spreadArray([], loadedCheerio('div.series-genres > a')
                            .map(function (i, el) { return loadedCheerio(el).text(); })
                            .toArray(), true), loadedCheerio('a.series-tag')
                            .map(function (i, el) { return loadedCheerio(el).text().split('(')[0].trim(); })
                            .toArray(), true).join(', ');
                        novel.chapters = loadedCheerio('div.chapter-item > a').map(function (i, el) {
                            var _a;
                            return {
                                name: loadedCheerio(el).text().trim(),
                                path: (_a = loadedCheerio(el)
                                    .attr('href')) === null || _a === void 0 ? void 0 : _a.replace(_this.site, '').replace(/^\//, '').replace(/\/$/, ''),
                            };
                        });
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    Chrysanthemumgarden.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var req, body, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/' + chapterPath + '/')];
                    case 1:
                        req = _a.sent();
                        return [4 /*yield*/, req.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, loadedCheerio('div#novel-content').html() || ''];
                }
            });
        });
    };
    Chrysanthemumgarden.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.paginate;
                        return [4 /*yield*/, this.getAllNovels()];
                    case 1: return [2 /*return*/, _a.apply(this, [(_b.sent()).filter(function (novel) {
                                return novel.name.toLowerCase().includes(searchTerm.toLowerCase());
                            }),
                            pageNo])];
                }
            });
        });
    };
    Chrysanthemumgarden.prototype.paginate = function (data, page) {
        var startIndex = (page - 1) * 20;
        var endIndex = startIndex + 20;
        return data.slice(startIndex, endIndex);
    };
    Chrysanthemumgarden.prototype.getAllNovels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, body;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.allNovelsCache)
                            return [2 /*return*/, this.allNovelsCache];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/wp-json/melimeli/novels')];
                    case 1:
                        req = _a.sent();
                        return [4 /*yield*/, req.json()];
                    case 2:
                        body = _a.sent();
                        this.allNovelsCache = body.map(function (novel) { return ({
                            name: novel.name,
                            path: novel.link
                                .replace(_this.site, '')
                                .replace(/\/$/, '')
                                .replace(/^\//, ''),
                            cover: defaultCover_1.defaultCover,
                        }); });
                        return [2 /*return*/, this.allNovelsCache];
                }
            });
        });
    };
    return Chrysanthemumgarden;
}());
exports.default = new Chrysanthemumgarden();
