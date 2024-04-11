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
var filterInputs_1 = require("@libs/filterInputs");
var IndoWebNovel = /** @class */ (function () {
    function IndoWebNovel() {
        this.id = 'IDWN.id';
        this.name = 'IndoWebNovel';
        this.icon = 'src/id/indowebnovel/icon.png';
        this.site = 'https://indowebnovel.id/id';
        this.version = '1.2.1';
        this.filters = {
            status: {
                value: '',
                label: 'Status',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Ongoing', value: 'ongoing' },
                    { label: 'Completed', value: 'completed' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            type: {
                value: '',
                label: 'Type',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Web Novel', value: 'Web+Novel' },
                    { label: 'Light Novel', value: 'Light+Novel' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            sort: {
                value: 'rating',
                label: 'Order By',
                options: [
                    { label: 'A-Z', value: 'title' },
                    { label: 'Z-A', value: 'titlereverse' },
                    { label: 'Latest Update', value: 'update' },
                    { label: 'Latest Added', value: 'latest' },
                    { label: 'Popular', value: 'popular' },
                    { label: 'Rating', value: 'rating' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            lang: {
                value: ['china', 'jepang', 'korea', 'unknown'],
                label: 'Country',
                options: [
                    { label: 'China', value: 'china' },
                    { label: 'Jepang', value: 'jepang' },
                    { label: 'Korea', value: 'korea' },
                    { label: 'Unknown', value: 'unknown' },
                ],
                type: filterInputs_1.FilterTypes.CheckboxGroup,
            },
            genre: {
                value: [],
                label: 'Genres',
                options: [
                    { label: 'Action', value: 'action' },
                    { label: 'Adult', value: 'adult' },
                    { label: 'Adventure', value: 'adventure' },
                    { label: 'Comedy', value: 'comedy' },
                    { label: 'Drama', value: 'drama' },
                    { label: 'Ecchi', value: 'ecchi' },
                    { label: 'Fantasy', value: 'fantasy' },
                    { label: 'Gender Bender', value: 'gender-bender' },
                    { label: 'Harem', value: 'harem' },
                    { label: 'Horror', value: 'horror' },
                    { label: 'Josei', value: 'josei' },
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
                    { label: 'Shoujo', value: 'shoujo' },
                    { label: 'Shounen', value: 'shounen' },
                    { label: 'Slice of Life', value: 'slice-of-life' },
                    { label: 'Smut', value: 'smut' },
                    { label: 'Supernatural', value: 'supernatural' },
                    { label: 'Tragedy', value: 'tragedy' },
                    { label: 'Wuxia', value: 'wuxia' },
                    { label: 'Xianxia', value: 'xianxia' },
                    { label: 'Xuanhuan', value: 'xuanhuan' },
                ],
                type: filterInputs_1.FilterTypes.CheckboxGroup,
            },
        };
    }
    IndoWebNovel.prototype.parseNovels = function (loadedCheerio) {
        var _this = this;
        var novels = [];
        loadedCheerio('.flexbox2-item').each(function (i, el) {
            var novelName = loadedCheerio(el)
                .find('.flexbox2-title span')
                .first()
                .text();
            var novelCover = loadedCheerio(el).find('img').attr('src');
            var novelUrl = loadedCheerio(el)
                .find('.flexbox2-content > a')
                .attr('href');
            if (!novelUrl)
                return;
            novels.push({
                name: novelName,
                cover: novelCover,
                path: novelUrl.slice(_this.site.length),
            });
        });
        return novels;
    };
    IndoWebNovel.prototype.popularNovels = function (page, _a) {
        var filters = _a.filters;
        return __awaiter(this, void 0, Promise, function () {
            var link, result, body, loadedCheerio;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        link = "".concat(this.site, "advanced-search/page/").concat(page, "/?title=&author=&yearx=");
                        link += "&status=".concat(filters.status.value);
                        link += "&type=".concat(filters.type.value);
                        link += "&order=".concat(filters.sort.value);
                        if (filters.lang.value.length)
                            link += filters.lang.value.map(function (i) { return "&country[]=".concat(i); }).join('');
                        if (filters.genre.value.length)
                            link += filters.genre.value.map(function (i) { return "&genre[]=".concat(i); }).join('');
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(link)];
                    case 1:
                        result = _b.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _b.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, this.parseNovels(loadedCheerio)];
                }
            });
        });
    };
    IndoWebNovel.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, Promise, function () {
            var result, body, loadedCheerio, novel, chapters;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        loadedCheerio('.series-synops div').remove();
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('.series-title').text().trim() || 'Untitled',
                            cover: loadedCheerio('.series-thumb img').attr('src'),
                            author: loadedCheerio("ul.series-infolist b:contains('Author') +")
                                .text()
                                .trim(),
                            status: loadedCheerio('.status').text().trim(),
                            summary: loadedCheerio('.series-synops').text().trim(),
                            chapters: [],
                        };
                        novel.genres = loadedCheerio('.series-genres a')
                            .map(function (i, el) { return loadedCheerio(el).text().trim(); })
                            .toArray()
                            .join(',');
                        chapters = [];
                        loadedCheerio('.series-chapterlist li').each(function (i, el) {
                            var chapterName = loadedCheerio(el).find('a').text().trim();
                            var chapterUrl = loadedCheerio(el).find('a').attr('href');
                            if (!chapterUrl)
                                return;
                            chapters.push({
                                name: chapterName,
                                path: chapterUrl.slice(_this.site.length),
                            });
                        });
                        novel.chapters = chapters.reverse();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    IndoWebNovel.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, Promise, function () {
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
                        chapterText = loadedCheerio('.readersss').html() || '';
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    IndoWebNovel.prototype.searchNovels = function (searchTerm, page) {
        return __awaiter(this, void 0, Promise, function () {
            var link, result, body, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        link = "".concat(this.site, "advanced-search/page/").concat(page, "/?title=").concat(searchTerm, "&author=&yearx=");
                        link += "&status=".concat(this.filters.status.value);
                        link += "&type=".concat(this.filters.type.value);
                        link += "&order=".concat(this.filters.sort.value);
                        link += this.filters.lang.value.map(function (i) { return "&country[]=".concat(i); }).join('');
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(link)];
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
    IndoWebNovel.prototype.fetchImage = function (url) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, fetch_1.fetchFile)(url)];
            });
        });
    };
    return IndoWebNovel;
}());
exports.default = new IndoWebNovel();
