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
var fetch_1 = require("@libs/fetch");
var filterInputs_1 = require("@libs/filterInputs");
var cheerio_1 = require("cheerio");
var novelStatus_1 = require("@libs/novelStatus");
var Rainofsnow = /** @class */ (function () {
    function Rainofsnow() {
        this.id = 'rainofsnow';
        this.name = 'Rainofsnow';
        this.icon = 'src/en/rainofsnow/icon.png';
        this.site = 'https://rainofsnow.com/';
        this.version = '1.1.2';
        this.filters = {
            genre: {
                value: '',
                label: 'Filter By',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Action', value: '?n_orderby=16' },
                    { label: 'Adventure', value: '?n_orderby=11' },
                    { label: 'Angst', value: '?n_orderby=776' },
                    { label: 'Chinese', value: '?n_orderby=342' },
                    { label: 'Comedy', value: '?n_orderby=13' },
                    { label: 'Drama', value: '?n_orderby=3' },
                    { label: 'Fantasy', value: '?n_orderby=7' },
                    { label: 'Japanese', value: '?n_orderby=343' },
                    { label: 'Korean', value: '?n_orderby=341' },
                    { label: 'Mature', value: '?n_orderby=778' },
                    { label: 'Mystery', value: '?n_orderby=12' },
                    { label: 'Original Novel', value: '?n_orderby=339' },
                    { label: 'Psychological', value: '?n_orderby=769' },
                    { label: 'Romance', value: '?n_orderby=5' },
                    { label: 'Sci-fi', value: '?n_orderby=14' },
                    { label: 'Slice of Life', value: '?n_orderby=779' },
                    { label: 'Supernatural', value: '?n_orderby=780' },
                    { label: 'Tragedy', value: '?n_orderby=777' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    Rainofsnow.prototype.parseNovels = function (loadedCheerio) {
        var _this = this;
        var novels = [];
        loadedCheerio('.minbox').each(function (index, element) {
            var _a;
            var name = loadedCheerio(element).find('h3').text();
            var cover = loadedCheerio(element).find('img').attr('data-src');
            var path = (_a = loadedCheerio(element)
                .find('h3 > a')
                .attr('href')) === null || _a === void 0 ? void 0 : _a.replace(_this.site, '').replace(/\/+$/, '');
            if (!path) {
                return;
            }
            novels.push({ name: name, cover: cover, path: path });
        });
        return novels;
    };
    Rainofsnow.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var url, body, loadedCheerio;
            var filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        url = this.site + 'novels/page/' + pageNo + filters.genre.value;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (res) { return res.text(); })];
                    case 1:
                        body = _c.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, this.parseNovels(loadedCheerio)];
                }
            });
        });
    };
    Rainofsnow.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var novel, body, loadedCheerio, x;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        novel = {
                            path: novelPath,
                            name: '',
                            totalPages: 0,
                        };
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath).then(function (res) { return res.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel.name = loadedCheerio('.text h2').text().trim();
                        novel.cover = loadedCheerio('.imagboca1 img').attr('data-src');
                        novel.summary = loadedCheerio('#synop').text().trim();
                        novel.genres = loadedCheerio('span:contains("Genre(s)")')
                            .next()
                            .text()
                            .trim();
                        novel.author = loadedCheerio('span:contains("Author")').next().text();
                        x = 1;
                        loadedCheerio('.page-numbers li').each(function (i, el) {
                            var num = loadedCheerio(el).find('a').text().trim().match(/(\d+)/);
                            var n = Number((num === null || num === void 0 ? void 0 : num[1]) || '0');
                            if (n > x) {
                                x = n;
                            }
                        });
                        novel.totalPages = x;
                        novel.chapters = this.parseChapters(loadedCheerio);
                        novel.status = novelStatus_1.NovelStatus.Unknown;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    // parse paged chapters
    Rainofsnow.prototype.parsePage = function (novelPath, page) {
        return __awaiter(this, void 0, void 0, function () {
            var url, body, loadedCheerio, chapters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + novelPath + '/page/' + page + '/#chapter';
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (res) { return res.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        chapters = this.parseChapters(loadedCheerio);
                        return [2 /*return*/, { chapters: chapters }];
                }
            });
        });
    };
    // helper to parse a novel
    Rainofsnow.prototype.parseChapters = function (loadedCheerio) {
        var _this = this;
        var chapter = [];
        loadedCheerio('#chapter .march1 li').each(function (i, el) {
            var _a;
            var path = (_a = loadedCheerio(el)
                .find('a')
                .attr('href')) === null || _a === void 0 ? void 0 : _a.slice(_this.site.length);
            if (!path)
                return;
            var name = loadedCheerio(el).find('.chapter').first().text().trim();
            var date = loadedCheerio(el).find('small').text().trim().toLowerCase();
            var months = [
                'jan',
                'feb',
                'mar',
                'apr',
                'may',
                'jun',
                'jul',
                'aug',
                'sep',
                'oct',
                'nov',
                'dec',
            ];
            var regex = /([a-z]+) (..?), (.+)/;
            var _b = regex.exec(date) || [], monthName = _b[1], day = _b[2], year = _b[3];
            var month = months.indexOf(monthName.slice(0, 3));
            var releaseTime = monthName && month !== -1
                ? new Date(+year, month, +day).toISOString()
                : null;
            chapter.push({
                name: name,
                path: path,
                releaseTime: releaseTime,
            });
        });
        return chapter;
    };
    Rainofsnow.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var result, body, loadedCheerio, chapterName, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.site + chapterPath)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        chapterName = loadedCheerio('.content > h2').text();
                        chapterText = loadedCheerio('.content').html();
                        if (!chapterText)
                            return [2 /*return*/, ''];
                        return [2 /*return*/, chapterName + '\n' + chapterText];
                }
            });
        });
    };
    Rainofsnow.prototype.searchNovels = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var newSearch, url, result, body, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newSearch = searchTerm.replace(/\s+/g, '+');
                        url = this.site + '?s=' + encodeURIComponent(newSearch);
                        return [4 /*yield*/, fetch(url)];
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
    return Rainofsnow;
}());
exports.default = new Rainofsnow();
