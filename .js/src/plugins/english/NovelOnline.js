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
var filterInputs_1 = require("@libs/filterInputs");
var NovelsOnline = /** @class */ (function () {
    function NovelsOnline() {
        this.id = 'NO.net';
        this.name = 'novelsOnline';
        this.site = 'https://novelsonline.net';
        this.icon = 'src/en/novelsonline/icon.png';
        this.version = '1.0.0';
        this.filters = {
            sort: {
                value: 'top_rated',
                label: 'Sort by',
                options: [
                    { label: 'Top Rated', value: 'top_rated' },
                    { label: 'Most Viewed', value: 'view' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genre: {
                value: '',
                label: 'Category',
                options: [
                    { label: 'None', value: '' },
                    { label: 'Action', value: 'action' },
                    { label: 'Adventure', value: 'adventure' },
                    { label: 'Celebrity', value: 'celebrity' },
                    { label: 'Comedy', value: 'comedy' },
                    { label: 'Drama', value: 'drama' },
                    { label: 'Ecchi', value: 'ecchi' },
                    { label: 'Fantasy', value: 'fantasy' },
                    { label: 'Gender Bender', value: 'gender-bender' },
                    { label: 'Harem', value: 'harem' },
                    { label: 'Historical', value: 'historical' },
                    { label: 'Horror', value: 'horror' },
                    { label: 'Josei', value: 'josei' },
                    { label: 'Martial Arts', value: 'martial-arts' },
                    { label: 'Mature', value: 'mature' },
                    { label: 'Mecha', value: 'mecha' },
                    { label: 'Mystery', value: 'mystery' },
                    { label: 'Psychological', value: 'psychological' },
                    { label: 'Romance', value: 'romance' },
                    { label: 'School Life', value: 'school-life' },
                    { label: 'Sci-fi', value: 'sci-fi' },
                    { label: 'Seinen', value: 'seinen' },
                    { label: 'Shotacon', value: 'shotacon' },
                    { label: 'Shoujo', value: 'shoujo' },
                    { label: 'Shoujo Ai', value: 'shoujo-ai' },
                    { label: 'Shounen', value: 'shounen' },
                    { label: 'Shounen Ai', value: 'shounen-ai' },
                    { label: 'Slice of Life', value: 'slice-of-life' },
                    { label: 'Sports', value: 'sports' },
                    { label: 'Supernatural', value: 'supernatural' },
                    { label: 'Tragedy', value: 'tragedy' },
                    { label: 'Wuxia', value: 'wuxia' },
                    { label: 'Xianxia', value: 'xianxia' },
                    { label: 'Xuanhuan', value: 'xuanhuan' },
                    { label: 'Yaoi', value: 'yaoi' },
                    { label: 'Yuri', value: 'yuri' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    NovelsOnline.prototype.popularNovels = function (page_1, _a) {
        return __awaiter(this, arguments, void 0, function (page, _b) {
            var link, body, loadedCheerio, novel;
            var _this = this;
            var filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        link = this.site;
                        if (filters.genre.value !== '')
                            link += "/category/".concat(filters.genre.value, "/");
                        else
                            link += "/top-novel/";
                        link += page;
                        link += "?change_type=".concat(filters.sort.value);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(link).then(function (r) { return r.text(); })];
                    case 1:
                        body = _c.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = [];
                        loadedCheerio('.top-novel-block').each(function (i, el) {
                            var novelName = loadedCheerio(el).find('h2').text();
                            var novelCover = loadedCheerio(el)
                                .find('.top-novel-cover img')
                                .attr('src');
                            var novelUrl = loadedCheerio(el).find('h2 a').attr('href');
                            if (!novelUrl)
                                return;
                            novel.push({
                                name: novelName,
                                cover: novelCover,
                                path: novelUrl.replace(_this.site, ''),
                            });
                        });
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    NovelsOnline.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var result, $, novel;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath).then(function (res) {
                            return res.text();
                        })];
                    case 1:
                        result = _a.sent();
                        $ = (0, cheerio_1.load)(result);
                        novel = {
                            path: novelPath,
                            name: $('h1').text() || 'Untitled',
                            cover: $('.novel-cover').find('a > img').attr('src'),
                            chapters: [],
                        };
                        $('.novel-detail-item').each(function (i, el) {
                            var detailName = $(el).find('h6').text();
                            var detail = $(el).find('.novel-detail-body');
                            switch (detailName) {
                                case 'Description':
                                    novel.summary = detail.text();
                                    break;
                                case 'Genre':
                                    novel.genres = detail
                                        .find('li')
                                        .map(function (_, el) { return $(el).text(); })
                                        .get()
                                        .join(', ');
                                    break;
                                case 'Author(s)':
                                    novel.author = detail
                                        .find('li')
                                        .map(function (_, el) { return $(el).text(); })
                                        .get()
                                        .join(', ');
                                    break;
                                case 'Status':
                                    novel.status = detail.text().trim();
                                    break;
                            }
                        });
                        novel.chapters = $('ul.chapter-chs > li > a')
                            .map(function (_, el) {
                            var chapterUrl = $(el).attr('href');
                            var chapterName = $(el).text();
                            return {
                                name: chapterName,
                                path: chapterUrl === null || chapterUrl === void 0 ? void 0 : chapterUrl.replace(_this.site, ''),
                            };
                        })
                            .get();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    NovelsOnline.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var result, loadedCheerio, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath).then(function (res) {
                            return res.text();
                        })];
                    case 1:
                        result = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(result);
                        chapterText = loadedCheerio('#contentall').html() || '';
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    NovelsOnline.prototype.searchNovels = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var result, $, headers;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/sResults.php', {
                            headers: {
                                Accept: '*/*',
                                'Accept-Language': 'pl,en-US;q=0.7,en;q=0.3',
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            },
                            method: 'POST',
                            body: new URLSearchParams({ q: searchTerm }).toString(),
                        }).then(function (res) { return res.text(); })];
                    case 1:
                        result = _a.sent();
                        $ = (0, cheerio_1.load)(result);
                        headers = $('li');
                        return [2 /*return*/, headers
                                .map(function (i, h) {
                                var novelName = $(h).text();
                                var novelUrl = $(h).find('a').attr('href');
                                var novelCover = $(h).find('img').attr('src');
                                if (!novelUrl)
                                    return;
                                return {
                                    name: novelName,
                                    cover: novelCover,
                                    path: novelUrl.replace(_this.site, ''),
                                };
                            })
                                .get()
                                .filter(function (sr) { return sr !== null; })];
                }
            });
        });
    };
    return NovelsOnline;
}());
exports.default = new NovelsOnline();
