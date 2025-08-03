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
var defaultCover_1 = require("@libs/defaultCover");
var filterInputs_1 = require("@libs/filterInputs");
var novelStatus_1 = require("@libs/novelStatus");
// const novelStatus = require('@libs/novelStatus');
// const isUrlAbsolute = require('@libs/isAbsoluteUrl');
// const parseDate = require('@libs/parseDate');
var Syosetu = /** @class */ (function () {
    function Syosetu() {
        var _this = this;
        this.id = 'yomou.syosetu';
        this.name = 'Syosetu';
        this.icon = 'src/jp/syosetu/icon.png';
        this.site = 'https://yomou.syosetu.com/';
        this.novelPrefix = 'https://ncode.syosetu.com';
        this.version = '1.1.2';
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        };
        this.searchUrl = function (pagenum, order) {
            return "".concat(_this.site, "search.php?order=").concat(order || 'hyoka').concat(pagenum !== undefined
                ? "&p=".concat(pagenum <= 1 || pagenum > 100 ? '1' : pagenum) // check if pagenum is between 1 and 100
                : '' // if isn't don't set ?p
            );
        };
        this.filters = {
            ranking: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Ranked by',
                options: [
                    { label: '日間', value: 'daily' },
                    { label: '週間', value: 'weekly' },
                    { label: '月間', value: 'monthly' },
                    { label: '四半期', value: 'quarter' },
                    { label: '年間', value: 'yearly' },
                    { label: '累計', value: 'total' },
                ],
                value: 'total',
            },
            genre: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Ranking Genre',
                options: [
                    { label: '総ジャンル', value: '' },
                    { label: '異世界転生/転移〔恋愛〕〕', value: '1' },
                    { label: '異世界転生/転移〔ファンタジー〕', value: '2' },
                    { label: '異世界転生/転移〔文芸・SF・その他〕', value: 'o' },
                    { label: '異世界〔恋愛〕', value: '101' },
                    { label: '現実世界〔恋愛〕', value: '102' },
                    { label: 'ハイファンタジー〔ファンタジー〕', value: '201' },
                    { label: 'ローファンタジー〔ファンタジー〕', value: '202' },
                    { label: '純文学〔文芸〕', value: '301' },
                    { label: 'ヒューマンドラマ〔文芸〕', value: '302' },
                    { label: '歴史〔文芸〕', value: '303' },
                    { label: '推理〔文芸〕', value: '304' },
                    { label: 'ホラー〔文芸〕', value: '305' },
                    { label: 'アクション〔文芸〕', value: '306' },
                    { label: 'コメディー〔文芸〕', value: '307' },
                    { label: 'VRゲーム〔SF〕', value: '401' },
                    { label: '宇宙〔SF〕', value: '402' },
                    { label: '空想科学〔SF〕', value: '403' },
                    { label: 'パニック〔SF〕', value: '404' },
                    { label: '童話〔その他〕', value: '9901' },
                    { label: '詩〔その他〕', value: '9902' },
                    { label: 'エッセイ〔その他〕', value: '9903' },
                    { label: 'その他〔その他〕', value: '9999' },
                ],
                value: '',
            },
            modifier: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Modifier',
                options: [
                    { label: 'すべて', value: 'total' },
                    { label: '連載中', value: 'r' },
                    { label: '完結済', value: 'er' },
                    { label: '短編', value: 't' },
                ],
                value: 'total',
            },
        };
    }
    Syosetu.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var getNovelsFromPage, novels;
            var _this = this;
            var filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        getNovelsFromPage = function (pagenumber) { return __awaiter(_this, void 0, void 0, function () {
                            var url, html, loadedCheerio, novels;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        url = this.site;
                                        if (!filters.genre.value) {
                                            url += "rank/list/type/".concat(filters.ranking.value, "_").concat(filters.modifier.value, "/?p=").concat(pagenumber);
                                        }
                                        else {
                                            url += "rank/".concat(filters.genre.value.length === 1 ? 'isekailist' : 'genrelist', "/type/").concat(filters.ranking.value, "_").concat(filters.genre.value).concat(filters.modifier.value === 'total' ? '' : "_".concat(filters.modifier.value), "/?p=").concat(pagenumber);
                                        }
                                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                                    case 1: return [4 /*yield*/, (_a.sent()).text()];
                                    case 2:
                                        html = _a.sent();
                                        loadedCheerio = (0, cheerio_1.load)(html, {
                                            decodeEntities: false,
                                        });
                                        if (parseInt(loadedCheerio('.is-current').html() || '1') !== pagenumber)
                                            return [2 /*return*/, []];
                                        novels = [];
                                        loadedCheerio('.c-card').each(function (_, e) {
                                            var anchor = loadedCheerio(e).find('.p-ranklist-item__title a');
                                            var url = anchor.attr('href');
                                            if (!url)
                                                return;
                                            var name = anchor.text();
                                            var novel = {
                                                path: url.replace(_this.novelPrefix, ''),
                                                name: name,
                                                cover: defaultCover_1.defaultCover,
                                            };
                                            novels.push(novel);
                                        });
                                        return [2 /*return*/, novels];
                                }
                            });
                        }); };
                        return [4 /*yield*/, getNovelsFromPage(pageNo)];
                    case 1:
                        novels = _c.sent();
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    Syosetu.prototype.parseChaptersFromPage = function (loadedCheerio) {
        return __awaiter(this, void 0, void 0, function () {
            var chapters;
            var _this = this;
            return __generator(this, function (_a) {
                chapters = [];
                loadedCheerio('.p-eplist__sublist').each(function (_, element) {
                    var chapterLink = loadedCheerio(element).find('a');
                    var chapterUrl = chapterLink.attr('href');
                    var chapterName = chapterLink.text().trim();
                    var releaseDate = loadedCheerio(element)
                        .find('.p-eplist__update')
                        .text()
                        .trim()
                        .split(' ')[0]
                        .replace(/\//g, '-');
                    if (chapterUrl) {
                        chapters.push({
                            name: chapterName,
                            releaseTime: releaseDate,
                            path: chapterUrl.replace(_this.novelPrefix, ''),
                        });
                    }
                });
                return [2 /*return*/, chapters];
            });
        });
    };
    Syosetu.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var result, body, loadedCheerio, status, novel, chapters, lastPageLink, lastPageMatch, totalPages, pagePromises, pageResults;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.novelPrefix + novelPath, {
                            headers: this.headers,
                        })];
                    case 1:
                        result = _b.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _b.sent();
                        loadedCheerio = (0, cheerio_1.load)(body, { decodeEntities: false });
                        status = 'Unknown';
                        if (loadedCheerio('.c-announce').text().includes('連載中') ||
                            loadedCheerio('.c-announce').text().includes('未完結')) {
                            status = novelStatus_1.NovelStatus.Ongoing;
                        }
                        else if (loadedCheerio('.c-announce').text().includes('更新されていません')) {
                            status = novelStatus_1.NovelStatus.OnHiatus;
                        }
                        else if (loadedCheerio('.c-announce').text().includes('完結')) {
                            status = novelStatus_1.NovelStatus.Completed;
                        }
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('.p-novel__title').text(),
                            author: loadedCheerio('.p-novel__author')
                                .text()
                                .replace('作者：', '')
                                .trim(),
                            status: status,
                            artist: '',
                            cover: defaultCover_1.defaultCover,
                            chapters: [],
                            genres: (_a = loadedCheerio('meta[property="og:description"]')
                                .attr('content')) === null || _a === void 0 ? void 0 : _a.split(' ').join(','), // Get genres from meta tag
                        };
                        // Get summary if available
                        novel.summary = loadedCheerio('#novel_ex').html() || '';
                        chapters = [];
                        lastPageLink = loadedCheerio('.c-pager__item--last').attr('href');
                        if (!!lastPageLink) return [3 /*break*/, 3];
                        // If no pagination, just parse chapters from the current page
                        loadedCheerio('.p-eplist__sublist').each(function (_, element) {
                            var chapterLink = loadedCheerio(element).find('a');
                            var chapterUrl = chapterLink.attr('href');
                            var chapterName = chapterLink.text().trim();
                            var releaseDate = loadedCheerio(element)
                                .find('.p-eplist__update')
                                .text()
                                .trim()
                                .split(' ')[0]
                                .replace(/\//g, '-');
                            if (chapterUrl) {
                                chapters.push({
                                    name: chapterName,
                                    releaseTime: releaseDate,
                                    path: chapterUrl.replace(_this.novelPrefix, ''),
                                });
                            }
                        });
                        return [3 /*break*/, 5];
                    case 3:
                        lastPageMatch = lastPageLink.match(/\?p=(\d+)/);
                        totalPages = lastPageMatch ? parseInt(lastPageMatch[1]) : 1;
                        pagePromises = Array.from({ length: totalPages }, function (_, i) {
                            return (0, fetch_1.fetchApi)("".concat(_this.novelPrefix).concat(novelPath, "?p=").concat(i + 1)).then(function (r) {
                                return r.text();
                            });
                        });
                        return [4 /*yield*/, Promise.all(pagePromises)];
                    case 4:
                        pageResults = _b.sent();
                        // Process each page's chapters
                        pageResults.forEach(function (pageBody) {
                            var pageCheerio = (0, cheerio_1.load)(pageBody, { decodeEntities: false });
                            pageCheerio('.p-eplist__sublist').each(function (_, element) {
                                var chapterLink = pageCheerio(element).find('a');
                                var chapterUrl = chapterLink.attr('href');
                                var chapterName = chapterLink.text().trim();
                                var releaseDate = pageCheerio(element)
                                    .find('.p-eplist__update')
                                    .text()
                                    .trim()
                                    .split(' ')[0]
                                    .replace(/\//g, '-');
                                if (chapterUrl) {
                                    chapters.push({
                                        name: chapterName,
                                        releaseTime: releaseDate,
                                        path: chapterUrl.replace(_this.novelPrefix, ''),
                                    });
                                }
                            });
                        });
                        _b.label = 5;
                    case 5:
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    Syosetu.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var result, body, cheerioQuery, chapterTitle, chapterContent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.novelPrefix + chapterPath, {
                            headers: this.headers,
                        })];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        cheerioQuery = (0, cheerio_1.load)(body, {
                            decodeEntities: false,
                        });
                        chapterTitle = cheerioQuery('.p-novel__title').html() || '';
                        chapterContent = cheerioQuery('.p-novel__body .p-novel__text:not([class*="p-novel__text--"])').html() || '';
                        // Combine title and content with proper HTML structure
                        return [2 /*return*/, "<h1>".concat(chapterTitle, "</h1>").concat(chapterContent)];
                }
            });
        });
    };
    Syosetu.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var novels, getNovelsFromPage;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        novels = [];
                        getNovelsFromPage = function (pagenumber) { return __awaiter(_this, void 0, void 0, function () {
                            var url, result, body, cheerioQuery, pageNovels;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        url = this.searchUrl(pagenumber) + "&word=".concat(searchTerm);
                                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url, { headers: this.headers })];
                                    case 1:
                                        result = _a.sent();
                                        return [4 /*yield*/, result.text()];
                                    case 2:
                                        body = _a.sent();
                                        cheerioQuery = (0, cheerio_1.load)(body, { decodeEntities: false });
                                        pageNovels = [];
                                        // find class=searchkekka_box
                                        cheerioQuery('.searchkekka_box').each(function (i, e) {
                                            // get div with link and name
                                            var novelDIV = cheerioQuery(e).find('.novel_h');
                                            // get link element
                                            var novelA = novelDIV.children()[0];
                                            // add new novel to array
                                            var novelPath = novelA.attribs.href.replace(_this.novelPrefix, '');
                                            if (novelPath) {
                                                pageNovels.push({
                                                    name: novelDIV.text(), // get the name
                                                    path: novelPath, // get last part of the link
                                                    cover: defaultCover_1.defaultCover,
                                                });
                                            }
                                        });
                                        // return all novels from this page
                                        return [2 /*return*/, pageNovels];
                                }
                            });
                        }); };
                        return [4 /*yield*/, getNovelsFromPage(pageNo)];
                    case 1:
                        // counter of loaded pages
                        // let pagesLoaded = 0;
                        // do {
                        //     // always load first one
                        //     novels.push(...(await getNovelsFromPage(pagesLoaded + 1)));
                        //     pagesLoaded++;
                        // } while (pagesLoaded < maxPageLoad && isNext); // check if we should load more
                        novels = _a.sent();
                        /** Use
                         * novels.push(...(await getNovelsFromPage(pageNumber)))
                         * if you want to load more
                         */
                        // respond with novels!
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    Syosetu.prototype.resolveUrl = function (path) {
        return this.novelPrefix + path;
    };
    return Syosetu;
}());
exports.default = new Syosetu();
