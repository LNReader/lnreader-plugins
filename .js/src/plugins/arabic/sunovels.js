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
var defaultCover_1 = require("@libs/defaultCover");
var Sunovels = /** @class */ (function () {
    function Sunovels() {
        this.id = 'sunovels';
        this.name = 'Sunovels';
        this.version = '1.0.0';
        this.icon = 'src/ar/sunovels/icon.png';
        this.site = 'https://sunovels.com/';
        this.filters = {
            categories: {
                value: [],
                label: 'التصنيفات',
                options: [
                    { label: 'Wuxia', value: 'Wuxia' },
                    { label: 'Xianxia', value: 'Xianxia' },
                    { label: 'XUANHUAN', value: 'XUANHUAN' },
                    { label: 'أصلية', value: 'أصلية' }, // Original
                    { label: 'أكشن', value: 'أكشن' }, // Action
                    { label: 'إثارة', value: 'إثارة' }, // Thriller
                    { label: 'إنتقال الى عالم أخر', value: 'إنتقال+الى+عالم+أخر' }, // Isekai
                    { label: 'إيتشي', value: 'إيتشي' }, // Ecchi
                    { label: 'الخيال العلمي', value: 'الخيال+العلمي' }, // Science Fiction
                    { label: 'بوليسي', value: 'بوليسي' }, // Detective
                    { label: 'تاريخي', value: 'تاريخي' }, // Historical
                    { label: 'تقمص شخصيات', value: 'تقمص+شخصيات' }, // Roleplaying
                    { label: 'جريمة', value: 'جريمة' }, // Crime
                    { label: 'جوسى', value: 'جوسى' }, // Josei
                    { label: 'حريم', value: 'حريم' }, // Harem
                    { label: 'حياة مدرسية', value: 'حياة+مدرسية' }, // School Life
                    { label: 'خارقة للطبيعة', value: 'خارقة+للطبيعة' }, // Supernatural
                    { label: 'خيالي', value: 'خيالي' }, // Fantasy
                    { label: 'دراما', value: 'دراما' }, // Drama
                    { label: 'رعب', value: 'رعب' }, // Horror
                    { label: 'رومانسي', value: 'رومانسي' }, // Romance
                    { label: 'سحر', value: 'سحر' }, // Magic
                    { label: 'سينن', value: 'سينن' }, // Seinen
                    { label: 'شريحة من الحياة', value: 'شريحة+من+الحياة' }, // Slice of Life
                    { label: 'شونين', value: 'شونين' }, // Shounen
                    { label: 'غموض', value: 'غموض' }, // Mystery
                    { label: 'فنون القتال', value: 'فنون+القتال' }, // Martial Arts
                    { label: 'قوى خارقة', value: 'قوى+خارقة' }, // Super Powers
                    { label: 'كوميدى', value: 'كوميدى' }, // Comedy
                    { label: 'مأساوي', value: 'مأساوي' }, // Tragedy
                    { label: 'ما بعد الكارثة', value: 'ما+بعد+الكارثة' }, // Post-Apocalypse
                    { label: 'مغامرة', value: 'مغامرة' }, // Adventure
                    { label: 'ميكا', value: 'ميكا' }, // Mecha
                    { label: 'ناضج', value: 'ناضج' }, // Mature
                    { label: 'نفسي', value: 'نفسي' }, // Psychological
                    { label: 'فانتازيا', value: 'فانتازيا' }, // Fantasy
                    { label: 'رياضة', value: 'رياضة' }, // Sports
                    { label: 'ابراج', value: 'ابراج' }, // Astrology
                    { label: 'الالهة', value: 'الالهة' }, // Deities
                    { label: 'شياطين', value: 'شياطين' }, // Demons
                    { label: 'السفر عبر الزمن', value: 'السفر+عبر+الزمن' }, // Time Travel
                    { label: 'رواية صينية', value: 'رواية+صينية' }, // Chinese Novel
                    { label: 'رواية ويب', value: 'رواية+ويب' }, // Web Novel
                    { label: 'لايت نوفل', value: 'لايت+نوفل' }, // Light Novel
                    { label: 'كوري', value: 'كوري' }, // Korean
                    { label: '+18', value: '%2B18' }, // +18
                    { label: 'إيسكاي', value: 'إيسكاي' }, // Isekai
                    { label: 'ياباني', value: 'ياباني' }, // Japanese
                    { label: 'مؤلفة', value: 'مؤلفة' }, // Authored
                ],
                type: filterInputs_1.FilterTypes.CheckboxGroup,
            },
            status: {
                value: '',
                label: 'الحالة',
                options: [
                    { label: 'جميع الروايات', value: '' },
                    { label: 'مكتمل', value: 'Completed' },
                    { label: 'جديد', value: 'New' },
                    { label: 'مستمر', value: 'Ongoing' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    Sunovels.prototype.parseNovels = function (loadedCheerio) {
        var _this = this;
        var novels = [];
        var imageUrlList = [];
        loadedCheerio('script').each(function (idx, ele) {
            var regax = /\/uploads\/[^\s"]+/g;
            var scriptText = loadedCheerio(ele).text();
            var imageUrlMatched = scriptText.match(regax);
            if (imageUrlMatched) {
                imageUrlList.push.apply(imageUrlList, imageUrlMatched);
            }
        });
        var counter = 0;
        loadedCheerio('.list-item').each(function (idx, ele) {
            loadedCheerio(ele)
                .find('a')
                .each(function (idx, ele) {
                var _a;
                var novelName = loadedCheerio(ele).find('h4').text().trim();
                var novelUrl = ((_a = loadedCheerio(ele).attr('href')) === null || _a === void 0 ? void 0 : _a.trim().replace(/^\/*/, '')) || '';
                var novelCover = defaultCover_1.defaultCover;
                if (imageUrlList.length > 0) {
                    novelCover = _this.site + imageUrlList[counter].slice(1);
                }
                else {
                    var imageUrl = loadedCheerio(ele).find('img').attr('src');
                    novelCover = _this.site + (imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.slice(1));
                }
                var novel = {
                    name: novelName,
                    cover: novelCover,
                    path: novelUrl,
                };
                counter++;
                novels.push(novel);
            });
        });
        return novels;
    };
    Sunovels.prototype.popularNovels = function (page_1, _a) {
        return __awaiter(this, arguments, void 0, function (page, _b) {
            var pageCorrected, link, body, loadedCheerio;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        pageCorrected = page - 1;
                        link = "".concat(this.site, "library?");
                        if (filters) {
                            if (Array.isArray(filters.categories.value) &&
                                filters.categories.value.length > 0) {
                                filters.categories.value.forEach(function (genre) {
                                    link += "&category=".concat(genre);
                                });
                            }
                            if (filters.status.value !== '') {
                                link += "&status=".concat(filters.status.value);
                            }
                        }
                        link += "&page=".concat(pageCorrected);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(link).then(function (r) { return r.text(); })];
                    case 1:
                        body = _c.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, this.parseNovels(loadedCheerio)];
                }
            });
        });
    };
    Sunovels.prototype.parseNovel = function (novelUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var result, body, loadedCheerio, novel, statusWords, mainGenres, statusGenre, statusText, imageUrl, imageUrlFull, chapterNumberStr, chapterNumber, pageNumber;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(new URL(novelUrl, this.site).toString())];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelUrl,
                            name: loadedCheerio('div.main-head h3').text().trim() || 'Untitled',
                            author: loadedCheerio('.novel-author').text().trim(),
                            summary: loadedCheerio('section.info-section div.description p')
                                .text()
                                .trim(),
                            totalPages: 1,
                            chapters: [],
                        };
                        statusWords = new Set(['مكتمل', 'جديد', 'مستمر']);
                        mainGenres = Array.from(loadedCheerio('div.categories li.tag'))
                            .map(function (el) { return loadedCheerio(el).text().trim(); })
                            .join(',');
                        statusGenre = Array.from(loadedCheerio('div.header-stats span').eq(3).find('strong'))
                            .map(function (el) { return loadedCheerio(el).text().trim(); })
                            .filter(function (text) { return statusWords.has(text); });
                        novel.genres = "".concat(statusGenre, ",").concat(mainGenres);
                        statusText = Array.from(loadedCheerio('div.header-stats span').eq(3).find('strong'))
                            .map(function (el) { return loadedCheerio(el).text().trim(); })
                            .filter(function (text) { return statusWords.has(text); })
                            .join();
                        novel.status =
                            {
                                'جديد': 'Ongoing',
                                'مكتمل': 'Completed',
                                'مستمر': 'Ongoing',
                            }[statusText] || 'Unknown';
                        imageUrl = loadedCheerio('div.img-container figure.cover img').attr('src');
                        imageUrlFull = this.site + (imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.slice(1));
                        novel.cover = imageUrlFull;
                        chapterNumberStr = loadedCheerio('div.header-stats span')
                            .first()
                            .text()
                            .replace(/[^\d]/g, '');
                        chapterNumber = parseInt(chapterNumberStr, 10);
                        pageNumber = Math.ceil(chapterNumber / 50);
                        novel.totalPages = pageNumber;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    Sunovels.prototype.parseChapters = function (data) {
        var chapter = [];
        data.chapters.map(function (item) {
            chapter.push({
                name: item.chapterName,
                releaseTime: new Date(item.releaseTime).toISOString(),
                path: item.chapterUrl,
                chapterNumber: item.chapterNumber,
            });
        });
        return chapter;
    };
    Sunovels.prototype.parsePage = function (novelPath, page) {
        return __awaiter(this, void 0, void 0, function () {
            var numPage, pageCorrected, pagePath, firstUrl, pageUrl, body, loadedCheerio, dataJson, chaptersinfo, pagecount, chapters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        numPage = parseInt(page, 10);
                        pageCorrected = numPage - 1;
                        pagePath = novelPath;
                        firstUrl = this.site + pagePath;
                        pageUrl = firstUrl + '?activeTab=chapters&page=' + pageCorrected;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(pageUrl).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        dataJson = { pages_count: '', chapters: [] };
                        chaptersinfo = [];
                        loadedCheerio('ul.chaptersList a').each(function (i, el) {
                            var _a, _b;
                            var chapterName = (_a = loadedCheerio(el).attr('title')) !== null && _a !== void 0 ? _a : '';
                            var chapterUrl = (_b = loadedCheerio(el)
                                .attr('href')) === null || _b === void 0 ? void 0 : _b.trim().replace(/^\/*/, '');
                            var dateAttr = loadedCheerio(el)
                                .find('time.chapter-update')
                                .attr('datetime');
                            var date = new Date(dateAttr);
                            var releaseTime = date.toISOString();
                            var chapternumber = loadedCheerio(el)
                                .find('strong.chapter-title')
                                .text()
                                .replace(/[^\d٠-٩]/g, '');
                            var chapterNumber = parseInt(chapternumber, 10);
                            chaptersinfo.push({
                                chapterName: chapterName,
                                chapterUrl: chapterUrl || '',
                                releaseTime: releaseTime || '',
                                chapterNumber: chapterNumber || '',
                            });
                        });
                        pagecount = loadedCheerio('ul.pagination a.active').text();
                        dataJson.pages_count = pagecount;
                        dataJson.chapters = chaptersinfo;
                        chapters = this.parseChapters(dataJson);
                        return [2 /*return*/, {
                                chapters: chapters,
                            }];
                }
            });
        });
    };
    Sunovels.prototype.parseChapter = function (chapterUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var result, body, loadedCheerio, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(new URL(chapterUrl, this.site).toString())];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        chapterText = '';
                        loadedCheerio('div.chapter-content').each(function (idx, ele) {
                            loadedCheerio(ele)
                                .find('p')
                                .not('.d-none')
                                .each(function (idx, textEle) {
                                chapterText +=
                                    loadedCheerio(textEle)
                                        .map(function (_, pEle) { return loadedCheerio(pEle).text().trim(); })
                                        .get()
                                        .join(' ') + ' ';
                            });
                        });
                        chapterText = chapterText.trim();
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    Sunovels.prototype.searchNovels = function (searchTerm, page) {
        return __awaiter(this, void 0, void 0, function () {
            var searchUrl, result, body, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchUrl = "".concat(this.site, "search?page=").concat(page, "&title=").concat(searchTerm);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(searchUrl)];
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
    return Sunovels;
}());
exports.default = new Sunovels();
