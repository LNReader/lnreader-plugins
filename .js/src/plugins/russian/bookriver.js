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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var filterInputs_1 = require("@libs/filterInputs");
var fetch_1 = require("@libs/fetch");
var novelStatus_1 = require("@libs/novelStatus");
var dayjs_1 = __importDefault(require("dayjs"));
var regex = /<script id="__NEXT_DATA__" type="application\/json">(\{.*?\})<\/script>/;
var Bookriver = /** @class */ (function () {
    function Bookriver() {
        var _this = this;
        this.id = 'bookriver';
        this.name = 'Bookriver';
        this.site = 'https://bookriver.ru';
        this.apiSite = 'https://api.bookriver.ru/api/v1/';
        this.version = '1.0.1';
        this.icon = 'src/ru/bookriver/icon.png';
        this.resolveUrl = function (path, isNovel) {
            return _this.site + (isNovel ? '/book/' : '/reader/') + path;
        };
        this.filters = {
            sort: {
                label: 'Сортировка',
                value: 'bestseller',
                options: [
                    { label: 'Бестселлеры', value: 'bestseller' },
                    { label: 'Дате добавления', value: 'newest' },
                    { label: 'Дате обновления', value: 'last-update' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genres: {
                label: 'жанры',
                value: [],
                options: [
                    { label: 'Альтернативная история', value: 'alternativnaya-istoriya' },
                    { label: 'Боевая фантастика', value: 'boevaya-fantastika' },
                    { label: 'Боевое фэнтези', value: 'boevoe-fentezi' },
                    { label: 'Бытовое фэнтези', value: 'bytovoe-fentezi' },
                    { label: 'Героическая фантастика', value: 'geroicheskaya-fantastika' },
                    { label: 'Героическое фэнтези', value: 'geroicheskoe-fentezi' },
                    { label: 'Городское фэнтези', value: 'gorodskoe-fentezi' },
                    { label: 'Детектив', value: 'detektiv' },
                    { label: 'Детективная фантастика', value: 'detektivnaya-fantastika' },
                    { label: 'Жёсткая эротика', value: 'zhyostkaya-erotika' },
                    { label: 'Исторический детектив', value: 'istoricheskii-detektiv' },
                    {
                        label: 'Исторический любовный роман',
                        value: 'istoricheskii-lyubovnyi-roman',
                    },
                    { label: 'Историческое фэнтези', value: 'istoricheskoe-fentezi' },
                    { label: 'Киберпанк', value: 'kiberpank' },
                    { label: 'Классический детектив', value: 'klassicheskii-detektiv' },
                    { label: 'Короткий любовный роман', value: 'korotkii-lyubovnyi-roman' },
                    { label: 'Космическая фантастика', value: 'kosmicheskaya-fantastika' },
                    { label: 'Криминальный детектив', value: 'kriminalnyi-detektiv' },
                    { label: 'ЛитРПГ', value: 'litrpg' },
                    { label: 'Любовная фантастика', value: 'lyubovnaya-fantastika' },
                    { label: 'Любовное фэнтези', value: 'lyubovnoe-fentezi' },
                    { label: 'Любовный роман', value: 'lyubovnyi-roman' },
                    { label: 'Мистика', value: 'mistika' },
                    { label: 'Молодежная проза', value: 'molodezhnaya-proza' },
                    { label: 'Научная фантастика', value: 'nauchnaya-fantastika' },
                    {
                        label: 'Остросюжетный любовный роман',
                        value: 'ostrosyuzhetnyi-lyubovnyi-roman',
                    },
                    { label: 'Политический детектив', value: 'politicheskii-detektiv' },
                    { label: 'Попаданцы', value: 'popadantsy' },
                    { label: 'Постапокалипсис', value: 'postapokalipsis' },
                    {
                        label: 'Приключенческое фэнтези',
                        value: 'priklyuchencheskoe-fentezi',
                    },
                    { label: 'Романтическая эротика', value: 'romanticheskaya-erotika' },
                    { label: 'С элементами эротики', value: 's-elementami-erotiki' },
                    { label: 'Славянское фэнтези', value: 'slavyanskoe-fentezi' },
                    {
                        label: 'Современный любовный роман',
                        value: 'sovremennyi-lyubovnyi-roman',
                    },
                    { label: 'Социальная фантастика', value: 'sotsialnaya-fantastika' },
                    { label: 'Тёмное фэнтези', value: 'temnoe-fentezi' },
                    { label: 'Фантастика', value: 'fantastika' },
                    { label: 'Фэнтези', value: 'fentezi' },
                    { label: 'Шпионский детектив', value: 'shpionskii-detektiv' },
                    { label: 'Эпическое фэнтези', value: 'epicheskoe-fentezi' },
                    { label: 'Эротика', value: 'erotika' },
                    { label: 'Эротическая фантастика', value: 'eroticheskaya-fantastika' },
                    { label: 'Эротический фанфик', value: 'eroticheskii-fanfik' },
                    { label: 'Эротическое фэнтези', value: 'eroticheskoe-fentezi' },
                    {
                        label: 'Юмористический детектив',
                        value: 'yumoristicheskii-detektiv',
                    },
                    { label: 'Юмористическое фэнтези', value: 'yumoristicheskoe-fentezi' },
                ],
                type: filterInputs_1.FilterTypes.CheckboxGroup,
            },
        };
    }
    Bookriver.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var url, result, novels, jsonRaw, json;
            var _c, _d, _e, _f, _g, _h;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        url = this.site + '/genre?page=' + pageNo + '&perPage=24&sortingType=';
                        url += showLatestNovels
                            ? 'last-update'
                            : ((_c = filters === null || filters === void 0 ? void 0 : filters.sort) === null || _c === void 0 ? void 0 : _c.value) || 'bestseller';
                        if ((_e = (_d = filters === null || filters === void 0 ? void 0 : filters.genres) === null || _d === void 0 ? void 0 : _d.value) === null || _e === void 0 ? void 0 : _e.length) {
                            url += '&g=' + filters.genres.value.join(',');
                        }
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (res) { return res.text(); })];
                    case 1:
                        result = _j.sent();
                        novels = [];
                        jsonRaw = result.match(regex);
                        if (jsonRaw instanceof Array && jsonRaw[1]) {
                            json = JSON.parse(jsonRaw[1]);
                            (_h = (_g = (_f = json.props.pageProps.state.pagesFilter) === null || _f === void 0 ? void 0 : _f.genre) === null || _g === void 0 ? void 0 : _g.books) === null || _h === void 0 ? void 0 : _h.forEach(function (novel) {
                                return novels.push({
                                    name: novel.name,
                                    cover: novel.coverImages[0].url,
                                    path: novel.slug,
                                });
                            });
                        }
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    Bookriver.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var result, novel, jsonRaw, book, chapters_1;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.resolveUrl(novelPath, true)).then(function (res) {
                            return res.text();
                        })];
                    case 1:
                        result = _f.sent();
                        novel = {
                            path: novelPath,
                            name: '',
                        };
                        jsonRaw = result.match(regex);
                        if (jsonRaw instanceof Array && jsonRaw[1]) {
                            book = JSON.parse(jsonRaw[1]).props.pageProps.state
                                .book.bookPage;
                            novel.name = book.name || '';
                            novel.cover = book.coverImages[0].url;
                            novel.summary = book.annotation;
                            novel.author = (_a = book.author) === null || _a === void 0 ? void 0 : _a.name;
                            novel.status =
                                (book === null || book === void 0 ? void 0 : book.statusComplete) === 'writing'
                                    ? novelStatus_1.NovelStatus.Ongoing
                                    : novelStatus_1.NovelStatus.Completed;
                            if ((_b = book.tags) === null || _b === void 0 ? void 0 : _b.length)
                                novel.genres = (_c = book.tags) === null || _c === void 0 ? void 0 : _c.map(function (tag) { return tag.name; }).join(',');
                            if ((_e = (_d = book === null || book === void 0 ? void 0 : book.ebook) === null || _d === void 0 ? void 0 : _d.chapters) === null || _e === void 0 ? void 0 : _e.length) {
                                chapters_1 = [];
                                book.ebook.chapters.forEach(function (chapter, chapterIndex) {
                                    if (chapter.available) {
                                        chapters_1.push({
                                            name: chapter.name,
                                            path: novelPath + '/' + chapter.chapterId,
                                            releaseTime: (0, dayjs_1.default)(chapter.firstPublishedAt || chapter.createdAt || undefined).format('LLL'),
                                            chapterNumber: chapterIndex + 1,
                                        });
                                    }
                                });
                                novel.chapters = chapters_1;
                            }
                        }
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    Bookriver.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, data, chapterText;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = this.apiSite + 'books/chapter/text/';
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url + chapterPath.split('/').pop()).then(function (res) { return res.json(); })];
                    case 1:
                        data = (_b.sent()).data;
                        chapterText = data.content || 'Конец произведения';
                        if ((_a = data === null || data === void 0 ? void 0 : data.audio) === null || _a === void 0 ? void 0 : _a.available) {
                            chapterText += '\n' + data.audio.url;
                        }
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    Bookriver.prototype.searchNovels = function (searchTerm_1) {
        return __awaiter(this, arguments, void 0, function (searchTerm, pageNo) {
            var url, data, novels;
            var _a;
            if (pageNo === void 0) { pageNo = 1; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = this.apiSite +
                            'search/autocomplete?keyword=' +
                            searchTerm +
                            '&page=' +
                            pageNo +
                            '&perPage=10';
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (res) {
                                return res.json();
                            })];
                    case 1:
                        data = (_b.sent()).data;
                        novels = [];
                        (_a = data === null || data === void 0 ? void 0 : data.books) === null || _a === void 0 ? void 0 : _a.forEach(function (novel) {
                            return novels.push({
                                name: novel.name,
                                cover: novel.coverImages[0].url,
                                path: novel.slug,
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return Bookriver;
}());
exports.default = new Bookriver();
