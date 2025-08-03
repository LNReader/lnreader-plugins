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
var cheerio_1 = require("cheerio");
var filterInputs_1 = require("@libs/filterInputs");
var storage_1 = require("@libs/storage");
var FenrirRealmPlugin = /** @class */ (function () {
    function FenrirRealmPlugin() {
        var _this = this;
        this.id = 'fenrir';
        this.name = 'Fenrir Realm';
        this.icon = 'src/en/fenrirrealm/icon.png';
        this.site = 'https://fenrirealm.com';
        this.version = '1.0.8';
        this.imageRequestInit = undefined;
        this.hideLocked = storage_1.storage.get('hideLocked');
        this.pluginSettings = {
            hideLocked: {
                value: '',
                label: 'Hide locked chapters',
                type: 'Switch',
            },
        };
        this.resolveUrl = function (path, isNovel) {
            return _this.site + '/series/' + path;
        };
        this.filters = {
            status: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Status',
                value: 'any',
                options: [
                    { label: 'All', value: 'any' },
                    { label: 'Ongoing', value: 'ongoing' },
                    {
                        label: 'Completed',
                        value: 'completed',
                    },
                ],
            },
            sort: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Sort',
                value: 'popular',
                options: [
                    { label: 'Popular', value: 'popular' },
                    { label: 'Latest', value: 'latest' },
                    { label: 'Updated', value: 'updated' },
                ],
            },
            genres: {
                type: filterInputs_1.FilterTypes.CheckboxGroup,
                label: 'Genres',
                value: [],
                options: [
                    { 'label': 'Action', 'value': '1' },
                    { 'label': 'Adult', 'value': '2' },
                    {
                        'label': 'Adventure',
                        'value': '3',
                    },
                    { 'label': 'Comedy', 'value': '4' },
                    { 'label': 'Drama', 'value': '5' },
                    {
                        'label': 'Ecchi',
                        'value': '6',
                    },
                    { 'label': 'Fantasy', 'value': '7' },
                    { 'label': 'Gender Bender', 'value': '8' },
                    {
                        'label': 'Harem',
                        'value': '9',
                    },
                    { 'label': 'Historical', 'value': '10' },
                    { 'label': 'Horror', 'value': '11' },
                    {
                        'label': 'Josei',
                        'value': '12',
                    },
                    { 'label': 'Martial Arts', 'value': '13' },
                    { 'label': 'Mature', 'value': '14' },
                    {
                        'label': 'Mecha',
                        'value': '15',
                    },
                    { 'label': 'Mystery', 'value': '16' },
                    { 'label': 'Psychological', 'value': '17' },
                    {
                        'label': 'Romance',
                        'value': '18',
                    },
                    { 'label': 'School Life', 'value': '19' },
                    { 'label': 'Sci-fi', 'value': '20' },
                    {
                        'label': 'Seinen',
                        'value': '21',
                    },
                    { 'label': 'Shoujo', 'value': '22' },
                    { 'label': 'Shoujo Ai', 'value': '23' },
                    {
                        'label': 'Shounen',
                        'value': '24',
                    },
                    { 'label': 'Shounen Ai', 'value': '25' },
                    { 'label': 'Slice of Life', 'value': '26' },
                    {
                        'label': 'Smut',
                        'value': '27',
                    },
                    { 'label': 'Sports', 'value': '28' },
                    { 'label': 'Supernatural', 'value': '29' },
                    {
                        'label': 'Tragedy',
                        'value': '30',
                    },
                    { 'label': 'Wuxia', 'value': '31' },
                    { 'label': 'Xianxia', 'value': '32' },
                    {
                        'label': 'Xuanhuan',
                        'value': '33',
                    },
                    { 'label': 'Yaoi', 'value': '34' },
                    { 'label': 'Yuri', 'value': '35' },
                ],
            },
        };
    }
    FenrirRealmPlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var sort, genresFilter, res;
            var _this = this;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        sort = filters.sort.value;
                        if (showLatestNovels)
                            sort = 'latest';
                        genresFilter = filters.genres.value
                            .map(function (g) { return '&genres%5B%5D=' + g; })
                            .join('');
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "/api/novels/filter?page=").concat(pageNo, "&per_page=20&status=").concat(filters.status.value, "&order=").concat(sort).concat(genresFilter)).then(function (r) { return r.json(); })];
                    case 1:
                        res = _c.sent();
                        return [2 /*return*/, res.data.map(function (r) { return _this.parseNovelFromApi(r); })];
                }
            });
        });
    };
    FenrirRealmPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var html, loadedCheerio, novel, chapters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "/series/").concat(novelPath), {
                            headers: {
                                'User-Agent': '',
                            },
                        }).then(function (r) { return r.text(); })];
                    case 1:
                        html = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(html);
                        loadedCheerio('div.overflow-hidden.transition-all.max-h-\\[108px\\] > br').replaceWith('%%NEWLINE%%');
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('h1.my-2').text(),
                            summary: loadedCheerio('div.overflow-hidden.transition-all.max-h-\\[108px\\]')
                                .text()
                                .replaceAll('%%NEWLINE%%', '\n'),
                        };
                        // novel.artist = '';
                        novel.author = loadedCheerio('div.flex-1 > div.mb-3 > a.inline-flex').text();
                        novel.cover =
                            this.site +
                                '/storage/' +
                                html.match(/,cover:"storage\/(.+?)",cover_data_url/)[1];
                        novel.genres = loadedCheerio('div.flex-1 > div.flex:not(.mb-3, .mt-5) > a')
                            .map(function (i, el) { return (0, cheerio_1.load)(el).text(); })
                            .toArray()
                            .join(',');
                        novel.status = loadedCheerio('div.flex-1 > div.mb-3 > span.rounded-md')
                            .first()
                            .text();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/api/novels/chapter-list/' + novelPath).then(function (r) { return r.json(); })];
                    case 2:
                        chapters = _a.sent();
                        if (this.hideLocked) {
                            chapters = chapters.filter(function (c) { var _a; return !((_a = c.locked) === null || _a === void 0 ? void 0 : _a.price); });
                        }
                        novel.chapters = chapters
                            .map(function (c) {
                            var _a;
                            return ({
                                name: (((_a = c.locked) === null || _a === void 0 ? void 0 : _a.price) ? '🔒 ' : '') +
                                    'Chapter ' +
                                    c.number +
                                    (c.title && c.title.trim() != 'Chapter ' + c.number
                                        ? ' - ' + c.title
                                        : ''),
                                path: novelPath + '/chapter-' + c.number,
                                releaseTime: c.created_at,
                                chapterNumber: c.number,
                            });
                        })
                            .sort(function (a, b) { return a.chapterNumber - b.chapterNumber; });
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    FenrirRealmPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var page;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/series/' + chapterPath, {
                            headers: {
                                'User-Agent': '',
                            },
                        }).then(function (r) { return r.text(); })];
                    case 1:
                        page = _a.sent();
                        return [2 /*return*/, (0, cheerio_1.load)(page)('#reader-area').html()];
                }
            });
        });
    };
    FenrirRealmPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "/api/novels/filter?page=").concat(pageNo, "&per_page=20&search=").concat(encodeURIComponent(searchTerm)))
                            .then(function (r) { return r.json(); })
                            .then(function (r) { return r.data.map(function (novel) { return _this.parseNovelFromApi(novel); }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    FenrirRealmPlugin.prototype.parseNovelFromApi = function (apiData) {
        return {
            name: apiData.title,
            path: apiData.slug,
            cover: this.site + '/' + apiData.cover,
            summary: apiData.description,
            status: apiData.status,
            genres: apiData.genres.map(function (g) { return g.name; }).join(','),
        };
    };
    return FenrirRealmPlugin;
}());
exports.default = new FenrirRealmPlugin();
//paste into console on site to load
function getUpdatedGenres() {
    return __awaiter(this, void 0, void 0, function () {
        var data, genreData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('https://fenrirealm.com/api/novels/taxonomy/genres').then(function (d) { return d.json(); })];
                case 1:
                    data = _a.sent();
                    genreData = data.map(function (g) { return ({ label: g.name, value: g.id.toString() }); });
                    console.log(JSON.stringify(genreData));
                    return [2 /*return*/];
            }
        });
    });
}
