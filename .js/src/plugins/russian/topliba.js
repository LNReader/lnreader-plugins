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
var filterInputs_1 = require("@libs/filterInputs");
var fetch_1 = require("@libs/fetch");
var cheerio_1 = require("cheerio");
var TopLiba = /** @class */ (function () {
    function TopLiba() {
        var _this = this;
        this.id = 'TopLiba';
        this.name = 'ТопЛиба';
        this.site = 'https://topliba.com';
        this.version = '1.0.0';
        this.icon = 'src/ru/topliba/icon.png';
        this._token = '';
        this.popularNovels = this.fetchNovels;
        this.resolveUrl = function (path, isNovel) {
            return _this.site + (isNovel ? '/books/' + path : '/reader/' + path.split('?')[0]);
        };
        this.filters = {
            sort: {
                label: 'Сортировка:',
                value: 'rating',
                options: [
                    { label: 'По рейтингу', value: 'rating' },
                    { label: 'По популярности', value: 'num_downloads' },
                    { label: 'По году выхода', value: 'year' },
                    { label: 'По дате добавления', value: 'date' },
                    { label: 'По названию', value: 'title' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    TopLiba.prototype.fetchNovels = function (page_1, _a, searchTerm_1) {
        return __awaiter(this, arguments, void 0, function (page, _b, searchTerm) {
            var data, body, novels, elements;
            var _this = this;
            var _c, _d;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        data = new URLSearchParams({
                            order_field: showLatestNovels ? 'date' : ((_c = filters === null || filters === void 0 ? void 0 : filters.sort) === null || _c === void 0 ? void 0 : _c.value) || 'rating',
                            p: page,
                        });
                        if (searchTerm)
                            data.append('q', searchTerm);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/?' + data.toString()).then(function (res) {
                                return res.text();
                            })];
                    case 1:
                        body = _e.sent();
                        novels = [];
                        this._token = (_d = body.match(/<meta name="_token" content="(.*?)"/)) === null || _d === void 0 ? void 0 : _d[1];
                        elements = body.match(/<img class="cover" data-original=".*>/g) || [];
                        elements.forEach(function (element) {
                            var _a = element.match(/data-original=".*covers\/(.*?)_.*title="(.*?)"/) || [], path = _a[1], name = _a[2];
                            if (path && name) {
                                novels.push({
                                    name: name,
                                    cover: _this.site + '/covers/' + path + '.jpg',
                                    path: path,
                                });
                            }
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    TopLiba.prototype.searchNovels = function (searchTerm, page) {
        return __awaiter(this, void 0, void 0, function () {
            var defaultOptions;
            return __generator(this, function (_a) {
                defaultOptions = {
                    showLatestNovels: false,
                    filters: {},
                };
                return [2 /*return*/, this.fetchNovels(page, defaultOptions, searchTerm)];
            });
        });
    };
    TopLiba.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, novel, chaptersHTML, chapters, elements;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.resolveUrl(novelPath, true)).then(function (res) {
                            return res.text();
                        })];
                    case 1:
                        body = _c.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('div > h1').text().trim(),
                            cover: this.site + '/covers/' + novelPath + '.jpg',
                            summary: loadedCheerio('.description').text().trim(),
                            author: loadedCheerio('.book-author > a').text().trim(),
                            genres: loadedCheerio('.book-genres > div > a')
                                .map(function (index, element) { return loadedCheerio(element).text(); })
                                .get()
                                .join(','),
                        };
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.resolveUrl(novelPath)).then(function (res) {
                                return res.text();
                            })];
                    case 2:
                        chaptersHTML = _c.sent();
                        this._token =
                            ((_a = chaptersHTML.match(/<meta name="_token" content="(.*?)"/)) === null || _a === void 0 ? void 0 : _a[1]) ||
                                ((_b = body.match(/<meta name="_token" content="(.*?)"/)) === null || _b === void 0 ? void 0 : _b[1]) ||
                                this._token;
                        chapters = [];
                        elements = chaptersHTML.match(/<li class="padding-\d+" data-capter="\d+">([\s\S]*?)</g) || [];
                        elements.forEach(function (chapter, chapterIndex) {
                            var _a = chapter.match(/class="padding-(\d+)" data-capter="(\d+)">([\s\S]*?)</) || [], padding = _a[1], capter = _a[2], name = _a[3];
                            if (padding && capter && name) {
                                var id = padding === '0' ? capter : padding + '-' + (parseInt(capter, 10) - 1);
                                chapters.push({
                                    name: name.trim(),
                                    path: novelPath + '?' + id,
                                    releaseTime: null,
                                    chapterNumber: chapterIndex + 1,
                                });
                            }
                        });
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    TopLiba.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, bookID, chapterID, chaptersHTML, chapterText;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = chapterPath.split('?'), bookID = _a[0], chapterID = _a[1];
                        if (!!this._token) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.resolveUrl(bookID)).then(function (res) {
                                return res.text();
                            })];
                    case 1:
                        chaptersHTML = _c.sent();
                        this._token = (_b = chaptersHTML.match(/<meta name="_token" content="(.*?)"/)) === null || _b === void 0 ? void 0 : _b[1];
                        _c.label = 2;
                    case 2: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.resolveUrl(bookID) + '/chapter', {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                                Referer: this.resolveUrl(bookID),
                                Origin: this.site,
                            },
                            method: 'POST',
                            body: new URLSearchParams({
                                chapter: chapterID,
                                _token: this._token,
                            }).toString(),
                        }).then(function (res) { return res.text(); })];
                    case 3:
                        chapterText = _c.sent();
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    return TopLiba;
}());
exports.default = new TopLiba();
