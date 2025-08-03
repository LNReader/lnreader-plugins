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
var defaultCover_1 = require("@libs/defaultCover");
var fetch_1 = require("@libs/fetch");
var headers = {
    'Content-Type': 'application/json',
    'X-Inertia': true,
    'X-Inertia-Version': '6666cd76f96956469e7be39d750cc7d9',
};
var freedlit = /** @class */ (function () {
    function freedlit() {
        var _this = this;
        this.id = 'freedlit.space';
        this.name = 'LitSpace';
        this.site = 'https://freedlit.space';
        this.version = '1.1.0';
        this.icon = 'src/ru/freedlit/icon.png';
        this.resolveUrl = function (path, isNovel) {
            return _this.site + (isNovel ? '/book/' : '/reader/') + path;
        };
        this.getToken = function (header) {
            var cookies = header.map['set-cookie'] || '';
            for (var _i = 0, _a = cookies.split('; '); _i < _a.length; _i++) {
                var cookie = _a[_i];
                var _b = cookie.split('='), key = _b[0], val = _b[1];
                if (key === 'XSRF-TOKEN') {
                    headers['X-XSRF-TOKEN'] = decodeURIComponent(val);
                    return;
                }
            }
            if (!headers['X-XSRF-TOKEN'])
                throw new Error('Failed to find the token');
        };
        this.filters = {
            sort: {
                label: 'Сортировка:',
                value: 'popular',
                options: [
                    { label: 'По популярности', value: 'popular' },
                    { label: 'последние обновления', value: 'updated' },
                    { label: 'По новизне', value: 'recent' },
                    { label: 'По просмотрам', value: 'views' },
                    { label: 'По количеству лайков', value: 'likes' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            access: {
                label: 'Доступ:',
                value: 'all',
                options: [
                    { label: 'Любой доступ', value: 'all' },
                    { label: 'Бесплатные', value: 'free' },
                    { label: 'Платные', value: 'paid' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            hideAdult: {
                label: 'Скрыть 18+',
                value: true,
                type: filterInputs_1.FilterTypes.Switch,
            },
        };
    }
    freedlit.prototype.popularNovels = function (page_1, _a) {
        return __awaiter(this, arguments, void 0, function (page, _b) {
            var url, novels, books;
            var _this = this;
            var _c, _d, _e;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        url = this.site + '/get-books/?sort=';
                        url += showLatestNovels ? 'recent' : ((_c = filters === null || filters === void 0 ? void 0 : filters.sort) === null || _c === void 0 ? void 0 : _c.value) || 'popular';
                        url += '&access=' + (((_d = filters === null || filters === void 0 ? void 0 : filters.access) === null || _d === void 0 ? void 0 : _d.value) || 'all');
                        url += '&hideAdult=' + (((_e = filters === null || filters === void 0 ? void 0 : filters.hideAdult) === null || _e === void 0 ? void 0 : _e.value) || false);
                        url += '&page=' + page;
                        novels = [];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (res) {
                                _this.getToken(res.headers);
                                return res.json();
                            })];
                    case 1:
                        books = (_f.sent()).books;
                        books.data.forEach(function (novel) {
                            return novels.push({
                                name: novel.title,
                                cover: novel.cover
                                    ? _this.site + '/storage/' + novel.cover
                                    : defaultCover_1.defaultCover,
                                path: novel.item_id.toString(),
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    freedlit.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var book, novel, success, chapters;
            var _this = this;
            var _a, _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.resolveUrl(novelPath, true), {
                            headers: headers,
                            Referer: this.resolveUrl(novelPath, true),
                        }).then(function (res) {
                            _this.getToken(res.headers);
                            return res.json();
                        })];
                    case 1:
                        book = (_h.sent()).props.book;
                        novel = {
                            path: novelPath,
                            name: book.title,
                            cover: book.cover ? this.site + '/storage/' + book.cover : defaultCover_1.defaultCover,
                            summary: book.annotation,
                            author: ((_b = (_a = book.authors_names) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.name) || '',
                            genres: ((_f = (_e = (_d = (_c = book.tags) === null || _c === void 0 ? void 0 : _c.map) === null || _d === void 0 ? void 0 : _d.call(_c, function (tags) { return tags.name; })) === null || _e === void 0 ? void 0 : _e.join) === null || _f === void 0 ? void 0 : _f.call(_e, ', ')) || '',
                        };
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/api/bookpage/get-chapters', {
                                method: 'post',
                                headers: headers,
                                Referer: this.resolveUrl(novelPath),
                                body: JSON.stringify({ book_id: novelPath }),
                            }).then(function (res) {
                                _this.getToken(res.headers);
                                return res.json();
                            })];
                    case 2:
                        success = (_h.sent()).success;
                        chapters = [];
                        if ((_g = success === null || success === void 0 ? void 0 : success.items) === null || _g === void 0 ? void 0 : _g.length) {
                            success.items.forEach(function (chapter, chapterIndex) {
                                return chapters.push({
                                    name: chapter.header,
                                    path: novelPath + '/' + chapter.id,
                                    releaseTime: chapter.first_published_formated,
                                    chapterNumber: chapterIndex + 1,
                                });
                            });
                        }
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    freedlit.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, book_id, chapter_id, success, chapterText;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = chapterPath.split('/'), book_id = _a[0], chapter_id = _a[1];
                        if (!!headers['X-XSRF-TOKEN']) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site).then(function (res) { return _this.getToken(res.headers); })];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/reader/get-content', {
                            method: 'post',
                            headers: headers,
                            Referer: this.resolveUrl(chapterPath),
                            body: JSON.stringify({ book_id: book_id, chapter_id: chapter_id }),
                        }).then(function (res) {
                            _this.getToken(res.headers);
                            return res.json();
                        })];
                    case 3:
                        success = (_b.sent()).success;
                        chapterText = success.content;
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    freedlit.prototype.searchNovels = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var success, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/api/search?query=' + searchTerm).then(function (res) {
                            _this.getToken(res.headers);
                            return res.json();
                        })];
                    case 1:
                        success = (_a.sent()).success;
                        novels = [];
                        if (success === null || success === void 0 ? void 0 : success.length) {
                            success.forEach(function (novel) {
                                if (novel.type === 'book' && novel.title) {
                                    novels.push({
                                        name: novel.title,
                                        cover: novel.cover
                                            ? _this.site + '/storage/' + novel.cover
                                            : defaultCover_1.defaultCover,
                                        path: novel.id.toString(),
                                    });
                                }
                            });
                        }
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return freedlit;
}());
exports.default = new freedlit();
