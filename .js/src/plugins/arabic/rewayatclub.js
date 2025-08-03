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
var RewayatClub = /** @class */ (function () {
    function RewayatClub() {
        this.id = 'rewayatclub';
        this.name = 'Rewayat Club';
        this.version = '1.0.1';
        this.icon = 'src/ar/rewayatclub/icon.png';
        this.site = 'https://rewayat.club/';
        this.filters = {
            genre: {
                value: [],
                label: 'Genres',
                options: [
                    { label: 'كوميديا', value: '1' }, // Comedy
                    { label: 'أكشن', value: '2' }, // Action
                    { label: 'دراما', value: '3' }, // Drama
                    { label: 'فانتازيا', value: '4' }, // Fantasy
                    { label: 'مهارات القتال', value: '5' }, // Combat Skills
                    { label: 'مغامرة', value: '6' }, // Adventure
                    { label: 'رومانسي', value: '7' }, // Romance
                    { label: 'خيال علمي', value: '8' }, // Science Fiction
                    { label: 'الحياة المدرسية', value: '9' }, // School Life
                    { label: 'قوى خارقة', value: '10' }, // Super Powers
                    { label: 'سحر', value: '11' }, // Magic
                    { label: 'رياضة', value: '12' }, // Sports
                    { label: 'رعب', value: '13' }, // Horror
                    { label: 'حريم', value: '14' }, // Harem
                ],
                type: filterInputs_1.FilterTypes.CheckboxGroup,
            },
            categories: {
                value: '0',
                label: 'الفئات',
                options: [
                    { label: 'جميع الروايات', value: '0' },
                    { label: 'مترجمة', value: '1' },
                    { label: 'مؤلفة', value: '2' },
                    { label: 'مكتملة', value: '3' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            sortOptions: {
                value: '-num_chapters',
                label: 'الترتيب',
                options: [
                    { label: 'عدد الفصول - من أقل ﻷعلى', value: 'num_chapters' },
                    { label: 'عدد الفصول - من أعلى ﻷقل', value: '-num_chapters' },
                    { label: 'الاسم - من أقل ﻷعلى', value: 'english' },
                    { label: 'الاسم - من أعلى ﻷقل', value: '-english' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    RewayatClub.prototype.parseNovels = function (data) {
        var novels = [];
        data.results.map(function (item) {
            var _a;
            novels.push({
                name: item.arabic || ((_a = item.novel) === null || _a === void 0 ? void 0 : _a.arabic) || 'novel',
                path: item.slug
                    ? "novel/".concat(item.slug)
                    : item.novel
                        ? "novel/".concat(item.novel.slug)
                        : 'novel',
                cover: item.poster_url
                    ? "https://api.rewayat.club/".concat(item.poster_url.slice(1))
                    : item.novel
                        ? "https://api.rewayat.club/".concat(item.novel.poster_url.slice(1))
                        : defaultCover_1.defaultCover,
            });
        });
        return novels;
    };
    RewayatClub.prototype.popularNovels = function (page_1, _a) {
        return __awaiter(this, arguments, void 0, function (page, _b) {
            var link, body;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        link = "https://api.rewayat.club/api/novels/";
                        body = {
                            count: 0,
                            next: '',
                            previous: '',
                            results: [],
                        };
                        if (!showLatestNovels) return [3 /*break*/, 2];
                        link = "".concat(this.site, "api/chapters/weekly/list/?page=").concat(page);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(link).then(function (r) { return r.json(); })];
                    case 1:
                        body = _c.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        if (!filters) return [3 /*break*/, 4];
                        if (filters.categories.value !== '') {
                            link += "?type=".concat(filters.categories.value);
                        }
                        if (filters.sortOptions.value !== '') {
                            link += "&ordering=".concat(filters.sortOptions.value);
                        }
                        if (filters.genre.value.length > 0) {
                            filters.genre.value.forEach(function (genre) {
                                link += "&genre=".concat(genre);
                            });
                        }
                        link += "&page=".concat(page);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(link).then(function (r) { return r.json(); })];
                    case 3:
                        body = _c.sent();
                        _c.label = 4;
                    case 4: return [2 /*return*/, this.parseNovels(body)];
                }
            });
        });
    };
    RewayatClub.prototype.parseNovel = function (novelUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var result, body, loadedCheerio, novel, statusWords, mainGenres, statusGenre, statusText, imageRaw, imageUrlRegex, imageUrlMatch, ImageUrlShort, imageUrl, chapterNumberStr, chapterNumber, pageNumber;
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
                            name: loadedCheerio('h1.primary--text span').text().trim() || 'Untitled',
                            author: loadedCheerio('.novel-author').text().trim(),
                            summary: loadedCheerio('div.text-pre-line span').text().trim(),
                            totalPages: 1,
                            chapters: [],
                        };
                        statusWords = new Set(['مكتملة', 'متوقفة', 'مستمرة']);
                        mainGenres = Array.from(loadedCheerio('.v-slide-group__content a'))
                            .map(function (el) { return loadedCheerio(el).text().trim(); })
                            .join(',');
                        statusGenre = Array.from(loadedCheerio('div.v-slide-group__content span.v-chip__content'))
                            .map(function (el) { return loadedCheerio(el).text().trim(); })
                            .filter(function (text) { return statusWords.has(text); });
                        novel.genres = "".concat(statusGenre, ",").concat(mainGenres);
                        statusText = Array.from(loadedCheerio('div.v-slide-group__content span.v-chip__content'))
                            .map(function (el) { return loadedCheerio(el).text().trim(); })
                            .filter(function (text) { return statusWords.has(text); })
                            .join();
                        novel.status =
                            {
                                'متوقفة': 'On Hiatus',
                                'مكتملة': 'Completed',
                                'مستمرة': 'Ongoing',
                            }[statusText] || 'Unknown';
                        imageRaw = loadedCheerio('body script:contains("__NUXT__")')
                            .first()
                            .text();
                        imageUrlRegex = /poster_url:"(\\u002F[^"]+)"/;
                        imageUrlMatch = imageRaw === null || imageRaw === void 0 ? void 0 : imageRaw.match(imageUrlRegex);
                        ImageUrlShort = imageUrlMatch
                            ? imageUrlMatch[1].replace(/\\u002F/g, '/').replace(/^\/*/, '')
                            : defaultCover_1.defaultCover;
                        imageUrl = "https://api.rewayat.club/".concat(ImageUrlShort);
                        novel.cover = imageUrl;
                        chapterNumberStr = loadedCheerio('div.v-tab--active span.mr-1')
                            .text()
                            .replace(/[^\d]/g, '');
                        chapterNumber = parseInt(chapterNumberStr, 10);
                        pageNumber = Math.ceil(chapterNumber / 24);
                        novel.totalPages = pageNumber;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    RewayatClub.prototype.parseChapters = function (data, novelPath) {
        var chapter = [];
        data.results.map(function (item) {
            chapter.push({
                name: item.title,
                releaseTime: new Date(item.date).toISOString(),
                path: "".concat(novelPath, "/").concat(item.number),
                chapterNumber: item.number,
            });
        });
        return chapter;
    };
    RewayatClub.prototype.parsePage = function (novelPath, page) {
        return __awaiter(this, void 0, void 0, function () {
            var pagePath, pageUrl, dataJson, chapters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pagePath = novelPath.slice(6);
                        pageUrl = "https://api.rewayat.club/api/chapters/".concat(pagePath, "/?ordering=number&page=").concat(page);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(pageUrl).then(function (r) { return r.json(); })];
                    case 1:
                        dataJson = _a.sent();
                        chapters = this.parseChapters(dataJson, novelPath);
                        return [2 /*return*/, {
                                chapters: chapters,
                            }];
                }
            });
        });
    };
    RewayatClub.prototype.parseChapter = function (chapterUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var link, result, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        link = this.site + 'api/chapters/' + chapterUrl.slice(6);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(link).then(function (r) { return r.json(); })];
                    case 1:
                        result = _a.sent();
                        chapterText = result.content
                            .flat()
                            .join('')
                            .replace(/<p>\n|\n<p>\n/g, '');
                        chapterText = chapterText.trim();
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    RewayatClub.prototype.searchNovels = function (searchTerm, page) {
        return __awaiter(this, void 0, void 0, function () {
            var searchUrl, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchUrl = "https://api.rewayat.club/api/novels/?type=0&ordering=-num_chapters&page=".concat(page, "&search=").concat(searchTerm);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(searchUrl).then(function (r) { return r.json(); })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, this.parseNovels(result)];
                }
            });
        });
    };
    return RewayatClub;
}());
exports.default = new RewayatClub();
