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
var NovelBuddy = /** @class */ (function () {
    function NovelBuddy() {
        this.id = 'novelbuddy';
        this.name = 'NovelBuddy.io';
        this.site = 'https://novelbuddy.io/';
        this.version = '1.0.3';
        this.icon = 'src/en/novelbuddy/icon.png';
        this.filters = {
            orderBy: {
                value: 'views',
                label: 'Order by',
                options: [
                    { label: 'Views', value: 'views' },
                    { label: 'Updated At', value: 'updated_at' },
                    { label: 'Created At', value: 'created_at' },
                    { label: 'Name', value: 'name' },
                    { label: 'Rating', value: 'rating' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            keyword: {
                value: '',
                label: 'Keywords',
                type: filterInputs_1.FilterTypes.TextInput,
            },
            status: {
                value: 'all',
                label: 'Status',
                options: [
                    { label: 'All', value: 'all' },
                    { label: 'Ongoing', value: 'ongoing' },
                    { label: 'Completed', value: 'completed' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genre: {
                value: [],
                label: 'Genres (OR, not AND)',
                options: [
                    { label: 'Action', value: 'action' },
                    { label: 'Action Adventure', value: 'action-adventure' },
                    { label: 'Adult', value: 'adult' },
                    { label: 'Adventcure', value: 'adventcure' },
                    { label: 'Adventure', value: 'adventure' },
                    { label: 'Adventurer', value: 'adventurer' },
                    { label: 'Bender', value: 'bender' },
                    { label: 'Chinese', value: 'chinese' },
                    { label: 'Comedy', value: 'comedy' },
                    { label: 'Cultivation', value: 'cultivation' },
                    { label: 'Drama', value: 'drama' },
                    { label: 'Eastern', value: 'eastern' },
                    { label: 'Ecchi', value: 'ecchi' },
                    { label: 'Fan Fiction', value: 'fan-fiction' },
                    { label: 'Fanfiction', value: 'fanfiction' },
                    { label: 'Fantas', value: 'fantas' },
                    { label: 'Fantasy', value: 'fantasy' },
                    { label: 'Game', value: 'game' },
                    { label: 'Gender', value: 'gender' },
                    { label: 'Gender Bender', value: 'gender-bender' },
                    { label: 'Harem', value: 'harem' },
                    { label: 'HaremAction', value: 'haremaction' },
                    { label: 'Haremv', value: 'haremv' },
                    { label: 'Historica', value: 'historica' },
                    { label: 'Historical', value: 'historical' },
                    { label: 'History', value: 'history' },
                    { label: 'Horror', value: 'horror' },
                    { label: 'Isekai', value: 'isekai' },
                    { label: 'Josei', value: 'josei' },
                    { label: 'Lolicon', value: 'lolicon' },
                    { label: 'Magic', value: 'magic' },
                    { label: 'Martial', value: 'martial' },
                    { label: 'Martial Arts', value: 'martial-arts' },
                    { label: 'Mature', value: 'mature' },
                    { label: 'Mecha', value: 'mecha' },
                    { label: 'Military', value: 'military' },
                    { label: 'Modern Life', value: 'modern-life' },
                    { label: 'Mystery', value: 'mystery' },
                    { label: 'Mystery Adventure', value: 'mystery-adventure' },
                    { label: 'Psychologic', value: 'psychologic' },
                    { label: 'Psychological', value: 'psychological' },
                    { label: 'Reincarnation', value: 'reincarnation' },
                    { label: 'Romance', value: 'romance' },
                    { label: 'Romance Adventure', value: 'romance-adventure' },
                    { label: 'Romance Harem', value: 'romance-harem' },
                    { label: 'Romancem', value: 'romancem' },
                    { label: 'School Life', value: 'school-life' },
                    { label: 'Sci-fi', value: 'sci-fi' },
                    { label: 'Seinen', value: 'seinen' },
                    { label: 'Shoujo', value: 'shoujo' },
                    { label: 'Shoujo Ai', value: 'shoujo-ai' },
                    { label: 'Shounen', value: 'shounen' },
                    { label: 'Shounen Ai', value: 'shounen-ai' },
                    { label: 'Slice of Life', value: 'slice-of-life' },
                    { label: 'Smut', value: 'smut' },
                    { label: 'Sports', value: 'sports' },
                    { label: 'Superna', value: 'superna' },
                    { label: 'Supernatural', value: 'supernatural' },
                    { label: 'System', value: 'system' },
                    { label: 'Tragedy', value: 'tragedy' },
                    { label: 'Urban', value: 'urban' },
                    { label: 'Urban Life', value: 'urban-life' },
                    { label: 'Wuxia', value: 'wuxia' },
                    { label: 'Xianxia', value: 'xianxia' },
                    { label: 'Xuanhuan', value: 'xuanhuan' },
                    { label: 'Yaoi', value: 'yaoi' },
                    { label: 'Yuri', value: 'yuri' },
                ],
                type: filterInputs_1.FilterTypes.CheckboxGroup,
            },
        };
    }
    NovelBuddy.prototype.parseNovels = function (loadedCheerio) {
        var novels = [];
        loadedCheerio('.book-item').each(function (idx, ele) {
            var _a;
            var novelName = loadedCheerio(ele).find('.title').text();
            var novelCover = 'https:' + loadedCheerio(ele).find('img').attr('data-src');
            var novelUrl = (_a = loadedCheerio(ele)
                .find('.title a')
                .attr('href')) === null || _a === void 0 ? void 0 : _a.substring(1);
            if (!novelUrl)
                return;
            var novel = { name: novelName, cover: novelCover, path: novelUrl };
            novels.push(novel);
        });
        return novels;
    };
    NovelBuddy.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var params, url, result, body, loadedCheerio;
            var filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        params = new URLSearchParams();
                        // apply all filters
                        params.append('sort', filters.orderBy.value.toString());
                        params.append('status', filters.status.value.toString());
                        if (filters.genre.value instanceof Array) {
                            filters.genre.value.forEach(function (genre) {
                                params.append('genre[]', genre.toString());
                            });
                        }
                        params.append('q', filters.keyword.value.toString());
                        params.append('page', pageNo.toString());
                        url = "".concat(this.site, "search?").concat(params.toString());
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _c.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _c.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, this.parseNovels(loadedCheerio)];
                }
            });
        });
    };
    NovelBuddy.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var result, body, loadedCheerio, novel, novelId, chapter, getChapters, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath)];
                    case 1:
                        result = _b.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _b.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('.name h1').text().trim() || 'Untitled',
                            cover: 'https:' + loadedCheerio('.img-cover img').attr('data-src'),
                            summary: loadedCheerio('.section-body.summary .content').text().trim(),
                            chapters: [],
                        };
                        loadedCheerio('.meta.box p').each(function (i, el) {
                            var detailName = loadedCheerio(el).find('strong').text();
                            var detail = loadedCheerio(el).find('a');
                            switch (detailName) {
                                case 'Authors :':
                                    novel.author = detail
                                        .find('span')
                                        .map(function (a, ex) { return loadedCheerio(ex).text(); })
                                        .toArray()
                                        .join(', ');
                                    break;
                                case 'Status :':
                                    novel.status = detail.text();
                                    break;
                                case 'Genres :':
                                    novel.genres = detail.text().trim();
                                    break;
                            }
                        });
                        novelId = loadedCheerio('script')
                            .text()
                            .match(/bookId = (\d+);/)[1];
                        chapter = [];
                        getChapters = function (id) { return __awaiter(_this, void 0, void 0, function () {
                            var chapterListUrl, data, chapterlist;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        chapterListUrl = "".concat(this.site, "api/manga/").concat(id, "/chapters?source=detail");
                                        return [4 /*yield*/, (0, fetch_1.fetchApi)(chapterListUrl)];
                                    case 1:
                                        data = _a.sent();
                                        return [4 /*yield*/, data.text()];
                                    case 2:
                                        chapterlist = _a.sent();
                                        loadedCheerio = (0, cheerio_1.load)(chapterlist);
                                        loadedCheerio('li').each(function (i, el) {
                                            var _a;
                                            var chapterName = loadedCheerio(el)
                                                .find('.chapter-title')
                                                .text()
                                                .trim();
                                            var releaseDate = loadedCheerio(el)
                                                .find('.chapter-update')
                                                .text()
                                                .trim();
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
                                            var monthsJoined = months.join('|');
                                            var rx = new RegExp("(".concat(monthsJoined, ") (\\d{1,2}), (\\d{4})"), 'i').exec(releaseDate);
                                            if (!rx)
                                                return;
                                            var year = +rx[3];
                                            var month = months.indexOf(rx[1].toLowerCase());
                                            var day = +rx[2];
                                            var chapterUrl = (_a = loadedCheerio(el).find('a').attr('href')) === null || _a === void 0 ? void 0 : _a.slice(1);
                                            if (!chapterUrl)
                                                return;
                                            chapter.push({
                                                name: chapterName,
                                                releaseTime: new Date(year, month, day).toISOString(),
                                                path: chapterUrl,
                                            });
                                        });
                                        return [2 /*return*/, chapter];
                                }
                            });
                        }); };
                        _a = novel;
                        return [4 /*yield*/, getChapters(novelId)];
                    case 3:
                        _a.chapters = (_b.sent()).reverse();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    NovelBuddy.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var result, body, loadedCheerio, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        loadedCheerio('#listen-chapter').remove();
                        loadedCheerio('#google_translate_element').remove();
                        chapterText = loadedCheerio('.chapter__content').html() || '';
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    NovelBuddy.prototype.searchNovels = function (searchTerm, page) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "search?q=").concat(encodeURIComponent(searchTerm), "&page=").concat(page);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
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
    return NovelBuddy;
}());
exports.default = new NovelBuddy();
