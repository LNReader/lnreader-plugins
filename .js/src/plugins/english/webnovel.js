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
var storage_1 = require("@libs/storage");
var Webnovel = /** @class */ (function () {
    function Webnovel() {
        this.id = 'webnovel';
        this.name = 'Webnovel';
        this.version = '1.0.3';
        this.icon = 'src/en/webnovel/icon.png';
        this.site = 'https://www.webnovel.com';
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        };
        this.imageRequestInit = {
            headers: {
                'referrer': this.site,
            },
        };
        this.hideLocked = storage_1.storage.get('hideLocked');
        this.pluginSettings = {
            hideLocked: {
                value: '',
                label: 'Hide locked chapters',
                type: 'Switch',
            },
        };
        this.filters = {
            sort: {
                label: 'Sort Results By',
                value: '1',
                options: [
                    { label: 'Popular', value: '1' },
                    { label: 'Recommended', value: '2' },
                    { label: 'Most Collections', value: '3' },
                    { label: 'Rating', value: '4' },
                    { label: 'Time Updated', value: '5' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            status: {
                label: 'Content Status',
                value: '0',
                options: [
                    { label: 'All', value: '0' },
                    { label: 'Completed', value: '2' },
                    { label: 'Ongoing', value: '1' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genres_gender: {
                label: 'Genres (Male/Female)',
                value: '1',
                options: [
                    { label: 'Male', value: '1' },
                    { label: 'Female', value: '2' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genres_male: {
                label: 'Male Genres',
                value: '1',
                options: [
                    { label: 'All', value: '1' },
                    { label: 'Action', value: 'novel-action-male' },
                    { label: 'Animation, Comics, Games', value: 'novel-acg-male' },
                    { label: 'Eastern', value: 'novel-eastern-male' },
                    { label: 'Fantasy', value: 'novel-fantasy-male' },
                    { label: 'Games', value: 'novel-games-male' },
                    { label: 'History', value: 'novel-history-male' },
                    { label: 'Horror', value: 'novel-horror-male' },
                    { label: 'Realistic', value: 'novel-realistic-male' },
                    { label: 'Sci-fi', value: 'novel-scifi-male' },
                    { label: 'Sports', value: 'novel-sports-male' },
                    { label: 'Urban', value: 'novel-urban-male' },
                    { label: 'War', value: 'novel-war-male' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genres_female: {
                label: 'Female Genres',
                value: '2',
                options: [
                    { label: 'All', value: '2' },
                    { label: 'Fantasy', value: 'novel-fantasy-female' },
                    { label: 'General', value: 'novel-general-female' },
                    { label: 'History', value: 'novel-history-female' },
                    { label: 'LGBT+', value: 'novel-lgbt-female' },
                    { label: 'Sci-fi', value: 'novel-scifi-female' },
                    { label: 'Teen', value: 'novel-teen-female' },
                    { label: 'Urban', value: 'novel-urban-female' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            type: {
                label: 'Content Type',
                value: '0',
                options: [
                    { label: 'All', value: '0' },
                    { label: 'Translate', value: '1' },
                    { label: 'Original', value: '2' },
                    { label: 'MTL (Machine Translation)', value: '3' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            fanfic_search: {
                label: 'Search fanfics (Overrides other filters)',
                value: '',
                type: filterInputs_1.FilterTypes.TextInput,
            },
        };
    }
    Webnovel.prototype.parseNovels = function (loadedCheerio, category_bool, search_bool) {
        return __awaiter(this, void 0, void 0, function () {
            var selector, attribute;
            return __generator(this, function (_a) {
                selector = category_bool
                    ? '.j_category_wrapper'
                    : search_bool
                        ? '.j_list_container'
                        : '';
                attribute = category_bool
                    ? 'data-original'
                    : search_bool
                        ? 'src'
                        : '';
                return [2 /*return*/, loadedCheerio("".concat(selector, " li"))
                        .map(function (i_, ele) {
                        var novelName = loadedCheerio(ele).find('.g_thumb').attr('title') || 'No Title Found';
                        var novelCover = loadedCheerio(ele)
                            .find('.g_thumb > img')
                            .attr(attribute);
                        var novelPath = loadedCheerio(ele).find('.g_thumb').attr('href');
                        if (!novelPath)
                            return null;
                        return {
                            name: novelName,
                            cover: 'https:' + novelCover,
                            path: novelPath,
                        };
                    })
                        .get()
                        .filter(function (novel) { return novel !== null; })];
            });
        });
    };
    Webnovel.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var url, params, result, body, loadedCheerio;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (filters === null || filters === void 0 ? void 0 : filters.fanfic_search.value) {
                            return [2 /*return*/, this.searchNovelsInternal(filters.fanfic_search.value, pageNo, 'fanfic')];
                        }
                        url = this.site + '/stories/';
                        params = new URLSearchParams();
                        if (showLatestNovels) {
                            url += "novel?orderBy=5&pageIndex=".concat(pageNo);
                        }
                        else if (filters) {
                            if (filters.genres_gender.value === '1') {
                                if (filters.genres_male.value !== '1') {
                                    url += filters.genres_male.value;
                                }
                                else {
                                    url += 'novel';
                                    params.append('gender', '1');
                                }
                            }
                            else if (filters.genres_gender.value === '2') {
                                if (filters.genres_female.value !== '2') {
                                    url += filters.genres_female.value;
                                }
                                else {
                                    url += 'novel';
                                    params.append('gender', '2');
                                }
                            }
                            if (filters.type.value !== '3') {
                                params.append('sourceType', filters.type.value);
                            }
                            else {
                                params.append('translateMode', '3');
                                params.append('sourceType', '1');
                            }
                            params.append('bookStatus', filters.status.value);
                            params.append('orderBy', filters.sort.value);
                            params.append('pageIndex', pageNo.toString());
                            url += '?' + params.toString();
                        }
                        else {
                            url += "novel?orderBy=1&pageIndex=".concat(pageNo);
                        }
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url, {
                                headers: this.headers,
                            })];
                    case 1:
                        result = _c.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _c.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, this.parseNovels(loadedCheerio, true, false)];
                }
            });
        });
    };
    Webnovel.prototype.parseChapters = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, chapters;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + novelPath + '/catalog';
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url, {
                                headers: this.headers,
                            })];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        chapters = [];
                        loadedCheerio('.volume-item').each(function (i_v_, ele_v) {
                            var originalVolumeName = loadedCheerio(ele_v).first().text().trim();
                            var volumeNameMatch = originalVolumeName.match(/Volume\s(\d+)/);
                            var volumeName = volumeNameMatch
                                ? "Volume ".concat(volumeNameMatch[1])
                                : 'Unknown Volume';
                            loadedCheerio(ele_v)
                                .find('li')
                                .each(function (i_c_, ele_c) {
                                var _a;
                                var chapterName = "".concat(volumeName, ": ") +
                                    (((_a = loadedCheerio(ele_c).find('a').attr('title')) === null || _a === void 0 ? void 0 : _a.trim()) ||
                                        'No Title Found');
                                var chapterPath = loadedCheerio(ele_c).find('a').attr('href');
                                var locked = loadedCheerio(ele_c).find('svg').length;
                                if (chapterPath && !(locked && _this.hideLocked)) {
                                    chapters.push({
                                        name: locked ? "".concat(chapterName, " \uD83D\uDD12") : chapterName,
                                        path: chapterPath,
                                    });
                                }
                            });
                        });
                        return [2 /*return*/, chapters];
                }
            });
        });
    };
    Webnovel.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, novel;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = this.site + novelPath;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url, {
                                headers: this.headers,
                            })];
                    case 1:
                        result = _b.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _b.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        _a = {
                            path: novelPath,
                            name: loadedCheerio('.g_thumb > img').attr('alt') || 'No Title Found',
                            cover: 'https:' + loadedCheerio('.g_thumb > img').attr('src'),
                            genres: loadedCheerio('.det-hd-detail > .det-hd-tag').attr('title') || '',
                            summary: loadedCheerio('.j_synopsis > p')
                                .find('br')
                                .replaceWith('\n')
                                .end()
                                .text()
                                .trim() || 'No Summary Found',
                            author: loadedCheerio('.det-info .c_s')
                                .filter(function (i_, ele) {
                                return loadedCheerio(ele).text().trim() === 'Author:';
                            })
                                .next()
                                .text()
                                .trim() || 'No Author Found',
                            status: loadedCheerio('.det-hd-detail svg')
                                .filter(function (i_, ele) {
                                return loadedCheerio(ele).attr('title') === 'Status';
                            })
                                .next()
                                .text()
                                .trim() || 'Unknown Status'
                        };
                        return [4 /*yield*/, this.parseChapters(novelPath)];
                    case 3:
                        novel = (_a.chapters = _b.sent(),
                            _a);
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    Webnovel.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, bloatElements;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + chapterPath;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url, {
                                headers: this.headers,
                            })];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        bloatElements = ['.para-comment'];
                        bloatElements.forEach(function (tag) { return loadedCheerio(tag).remove(); });
                        return [2 /*return*/, (loadedCheerio('.cha-tit').html() + loadedCheerio('.cha-words').html())];
                }
            });
        });
    };
    Webnovel.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.searchNovelsInternal(searchTerm, pageNo)];
            });
        });
    };
    Webnovel.prototype.searchNovelsInternal = function (searchTerm, pageNo, type) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchTerm = searchTerm.replace(/\s+/g, '+');
                        url = "".concat(this.site, "/search?keywords=").concat(encodeURIComponent(searchTerm), "&pageIndex=").concat(pageNo).concat(type ? "&type=".concat(type) : '');
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url, {
                                headers: this.headers,
                            })];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, this.parseNovels(loadedCheerio, false, true)];
                }
            });
        });
    };
    return Webnovel;
}());
exports.default = new Webnovel();
