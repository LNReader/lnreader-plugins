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
var novelStatus_1 = require("@libs/novelStatus");
var statusKey = {
    '0': novelStatus_1.NovelStatus.Unknown,
    '1': novelStatus_1.NovelStatus.Ongoing,
    '2': novelStatus_1.NovelStatus.Completed,
    '3': novelStatus_1.NovelStatus.OnHiatus,
    '4': novelStatus_1.NovelStatus.Cancelled,
};
var Neobook = /** @class */ (function () {
    function Neobook() {
        var _this = this;
        this.id = 'neobook';
        this.name = 'Neobook';
        this.site = 'https://neobook.org';
        this.apiSite = 'https://api.neobook.org/';
        this.version = '1.0.2';
        this.icon = 'src/ru/neobook/icon.png';
        this.popularNovels = this.fetchNovels;
        this.resolveUrl = function (path, isNovel) {
            return _this.site + (isNovel ? '/book/' : '/reader/') + path;
        };
        this.filters = {
            sort: {
                label: 'Сортировка:',
                value: 'popular',
                options: [
                    { label: 'Сначала популярные', value: 'popular' },
                    { label: 'Сначала новые', value: 'new' },
                    { label: 'В случайном порядке', value: 'rand' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            timeread: {
                label: 'Время прочтения:',
                value: '0-999999',
                options: [
                    { label: 'Все', value: '0-999999' },
                    { label: 'Менее 15 минут', value: '0-900' },
                    { label: '15-30 минут', value: '900-1800' },
                    { label: '30-60 минут', value: '1800-3600' },
                    { label: '1-2 часа', value: '3600-7200' },
                    { label: 'Более 2 часов', value: '7200-999999' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            category: {
                label: 'Жанр:',
                value: '',
                options: [
                    { label: 'Все', value: '' },
                    { label: 'Антиутопия', value: '10' },
                    { label: 'Детектив', value: '13' },
                    { label: 'Детские книги', value: '14' },
                    { label: 'Драма', value: '15' },
                    { label: 'Другое', value: '16' },
                    { label: 'История', value: '18' },
                    { label: 'Мелодрама', value: '21' },
                    { label: 'Мистика', value: '22' },
                    { label: 'Научная фантастика', value: '23' },
                    { label: 'Нон-фикшн', value: '35' },
                    { label: 'Подростки и молодежь', value: '26' },
                    { label: 'Постапокалипсис', value: '27' },
                    { label: 'Поэзия', value: '28' },
                    { label: 'Приключения', value: '29' },
                    { label: 'Рассказ', value: '34' },
                    { label: 'Роман', value: '36' },
                    { label: 'Творчество', value: '40' },
                    { label: 'Триллер', value: '91' },
                    { label: 'Ужасы', value: '90' },
                    { label: 'Фантастика', value: '41' },
                    { label: 'Фанфик', value: '42' },
                    { label: 'Фэнтези', value: '44' },
                    { label: 'Эротика', value: '46' },
                    { label: 'Юмор', value: '47' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            tags: {
                label: 'Тэги:',
                value: '',
                type: filterInputs_1.FilterTypes.TextInput,
            },
        };
    }
    Neobook.prototype.fetchNovels = function (page_1, _a, searchTerm_1) {
        return __awaiter(this, arguments, void 0, function (page, _b, searchTerm) {
            var formData, bundle_books, novels;
            var _c, _d, _e, _f, _g, _h;
            var filters = _b.filters, showLatestNovels = _b.showLatestNovels;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        formData = new FormData();
                        formData.append('version', '4.4');
                        formData.append('uid', '0');
                        formData.append('utoken', '');
                        formData.append('resource', 'general');
                        formData.append('action', 'get_bundle');
                        formData.append('bundle', 'bundle_books');
                        formData.append('target', 'feed');
                        formData.append('page', page.toString());
                        formData.append('filter_category_id', ((_c = filters === null || filters === void 0 ? void 0 : filters.category) === null || _c === void 0 ? void 0 : _c.value) || '0');
                        formData.append('filter_completed', '-1');
                        formData.append('filter_search', searchTerm || '');
                        formData.append('filter_tags', ((_d = filters === null || filters === void 0 ? void 0 : filters.tags) === null || _d === void 0 ? void 0 : _d.value) || '');
                        formData.append('filter_sort', showLatestNovels ? 'new' : ((_e = filters === null || filters === void 0 ? void 0 : filters.sort) === null || _e === void 0 ? void 0 : _e.value) || 'popular');
                        formData.append('filter_timeread', ((_f = filters === null || filters === void 0 ? void 0 : filters.timeread) === null || _f === void 0 ? void 0 : _f.value) || '0-999999');
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.apiSite, {
                                method: 'post',
                                body: formData,
                                referrer: this.site,
                            }).then(function (res) { return res.json(); })];
                    case 1:
                        bundle_books = (_j.sent()).bundle_books;
                        novels = [];
                        if ((_g = bundle_books.feed) === null || _g === void 0 ? void 0 : _g.length) {
                            (_h = bundle_books.feed) === null || _h === void 0 ? void 0 : _h.forEach(function (novel) {
                                var _a, _b;
                                return novels.push({
                                    name: novel.title,
                                    cover: ((_b = (_a = novel === null || novel === void 0 ? void 0 : novel.attachment) === null || _a === void 0 ? void 0 : _a.image) === null || _b === void 0 ? void 0 : _b.m) || defaultCover_1.defaultCover,
                                    path: novel.token + '/',
                                });
                            });
                        }
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    Neobook.prototype.searchNovels = function (searchTerm, page) {
        return __awaiter(this, void 0, void 0, function () {
            var defaultOptions;
            return __generator(this, function (_a) {
                defaultOptions = {
                    filters: undefined,
                    showLatestNovels: false,
                };
                return [2 /*return*/, this.fetchNovels(page, defaultOptions, searchTerm)];
            });
        });
    };
    Neobook.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, novel, bookRaw, book_1, chapters_1;
            var _a, _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.resolveUrl(novelPath, true)).then(function (res) {
                            return res.text();
                        })];
                    case 1:
                        body = _h.sent();
                        novel = {
                            path: novelPath,
                            name: '',
                            cover: defaultCover_1.defaultCover,
                        };
                        bookRaw = body.match(/var postData = ({.*?});/);
                        if (bookRaw instanceof Array && bookRaw[1]) {
                            book_1 = JSON.parse(bookRaw[1]);
                            novel.name = book_1.title;
                            novel.summary = ((_b = (_a = book_1.text) === null || _a === void 0 ? void 0 : _a.replace) === null || _b === void 0 ? void 0 : _b.call(_a, /<br>/g, '\n')) || book_1.text_fix;
                            novel.author =
                                book_1.user && book_1.user.firstname && book_1.user.lastname
                                    ? book_1.user.firstname + ' ' + book_1.user.lastname
                                    : ((_c = book_1.user) === null || _c === void 0 ? void 0 : _c.initials) || '';
                            novel.status = statusKey[book_1.status || '0'] || novelStatus_1.NovelStatus.Unknown;
                            if ((_e = (_d = book_1.attachment) === null || _d === void 0 ? void 0 : _d.image) === null || _e === void 0 ? void 0 : _e.m)
                                novel.cover = book_1.attachment.image.m;
                            if ((_f = book_1.tags) === null || _f === void 0 ? void 0 : _f.length)
                                novel.genres = book_1.tags.join(',');
                            chapters_1 = [];
                            (_g = book_1.chapters) === null || _g === void 0 ? void 0 : _g.forEach(function (chapter, chapterIndex) {
                                if (chapter.access == '1' && chapter.status == '1') {
                                    chapters_1.push({
                                        name: chapter.title || 'Глава ' + (chapterIndex + 1),
                                        path: "?book=".concat(book_1.token, "&chapter=").concat(chapter.token),
                                        releaseTime: null,
                                        chapterNumber: Number(chapter.sort) || chapterIndex + 1,
                                    });
                                }
                            });
                            novel.chapters = chapters_1;
                        }
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    Neobook.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, bookRaw, chapterText, token_1, book, chapter;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.resolveUrl(chapterPath)).then(function (res) {
                            return res.text();
                        })];
                    case 1:
                        body = _d.sent();
                        bookRaw = body.match(/var data = ({.*?});/);
                        chapterText = '';
                        if (bookRaw instanceof Array && bookRaw[1]) {
                            token_1 = chapterPath.split('=')[2];
                            book = JSON.parse(bookRaw[1]);
                            chapter = (_b = (_a = book.chapters) === null || _a === void 0 ? void 0 : _a.find) === null || _b === void 0 ? void 0 : _b.call(_a, function (chapter) { return chapter.token == token_1; });
                            chapterText = (((_c = chapter === null || chapter === void 0 ? void 0 : chapter.data) === null || _c === void 0 ? void 0 : _c.html) || '').replace(/<br>/g, '');
                        }
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    return Neobook;
}());
exports.default = new Neobook();
