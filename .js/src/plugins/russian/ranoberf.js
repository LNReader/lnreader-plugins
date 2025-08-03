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
var defaultCover_1 = require("@libs/defaultCover");
var fetch_1 = require("@libs/fetch");
var novelStatus_1 = require("@libs/novelStatus");
var dayjs_1 = __importDefault(require("dayjs"));
var regex = /<script id="__NEXT_DATA__" type="application\/json">(\{.*?\})<\/script>/;
var RNRF = /** @class */ (function () {
    function RNRF() {
        this.id = 'RNRF';
        this.name = 'РанобэРФ';
        this.site = 'https://ранобэ.рф';
        this.version = '1.0.1';
        this.icon = 'src/ru/ranoberf/icon.png';
        this.filters = {
            sort: {
                label: 'Сортировка',
                value: 'popular',
                options: [
                    { label: 'Рейтинг', value: 'popular' },
                    { label: 'Дате добавления', value: 'new' },
                    { label: 'Дате обновления', value: 'lastPublishedChapter' },
                    { label: 'Законченные', value: 'completed' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    RNRF.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var url, body, novels, jsonRaw, json;
            var _this = this;
            var _c, _d, _e, _f;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        url = this.site + '/books?order=';
                        url += showLatestNovels
                            ? 'lastPublishedChapter'
                            : ((_c = filters === null || filters === void 0 ? void 0 : filters.sort) === null || _c === void 0 ? void 0 : _c.value) || 'popular';
                        url += '&page=' + pageNo;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (res) { return res.text(); })];
                    case 1:
                        body = _g.sent();
                        novels = [];
                        jsonRaw = body.match(regex);
                        if (jsonRaw instanceof Array && jsonRaw[1]) {
                            json = JSON.parse(jsonRaw[1]);
                            (_f = (_e = (_d = json.props.pageProps) === null || _d === void 0 ? void 0 : _d.totalData) === null || _e === void 0 ? void 0 : _e.items) === null || _f === void 0 ? void 0 : _f.forEach(function (novel) {
                                var _a;
                                return novels.push({
                                    name: novel.title,
                                    cover: ((_a = novel === null || novel === void 0 ? void 0 : novel.verticalImage) === null || _a === void 0 ? void 0 : _a.url)
                                        ? _this.site + novel.verticalImage.url
                                        : defaultCover_1.defaultCover,
                                    path: '/' + novel.slug,
                                });
                            });
                        }
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    RNRF.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, novel, jsonRaw, book_1, chapters_1;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath).then(function (res) { return res.text(); })];
                    case 1:
                        body = _d.sent();
                        novel = {
                            path: novelPath,
                            name: '',
                        };
                        jsonRaw = body.match(regex);
                        if (jsonRaw instanceof Array && jsonRaw[1]) {
                            book_1 = JSON.parse(jsonRaw[1]).props.pageProps.book;
                            novel.name = book_1.title;
                            novel.summary = book_1.description;
                            novel.cover = ((_a = book_1.verticalImage) === null || _a === void 0 ? void 0 : _a.url)
                                ? this.site + book_1.verticalImage.url
                                : defaultCover_1.defaultCover;
                            novel.status = (book_1 === null || book_1 === void 0 ? void 0 : book_1.additionalInfo.includes('Активен'))
                                ? novelStatus_1.NovelStatus.Ongoing
                                : novelStatus_1.NovelStatus.Completed;
                            if (book_1.author)
                                novel.author = book_1.author;
                            if ((_b = book_1.genres) === null || _b === void 0 ? void 0 : _b.length)
                                novel.genres = book_1 === null || book_1 === void 0 ? void 0 : book_1.genres.map(function (item) { return item.title; }).join(',');
                            if ((_c = book_1.chapters) === null || _c === void 0 ? void 0 : _c.length) {
                                chapters_1 = [];
                                book_1.chapters.forEach(function (chapter, chapterIndex) {
                                    if (!chapter.isDonate || chapter.isUserPaid) {
                                        chapters_1.push({
                                            name: chapter.title,
                                            path: chapter.url,
                                            releaseTime: (0, dayjs_1.default)(chapter.publishedAt).format('LLL'),
                                            chapterNumber: book_1.chapters.length - chapterIndex,
                                        });
                                    }
                                });
                                novel.chapters = chapters_1.reverse();
                            }
                        }
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    RNRF.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, jsonRaw, chapter;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath).then(function (res) {
                            return res.text();
                        })];
                    case 1:
                        body = _f.sent();
                        jsonRaw = body.match(regex);
                        if (jsonRaw instanceof Array && jsonRaw[1]) {
                            chapter = ((_e = (_d = (_c = (_b = (_a = JSON.parse(jsonRaw[1])) === null || _a === void 0 ? void 0 : _a.props) === null || _b === void 0 ? void 0 : _b.pageProps) === null || _c === void 0 ? void 0 : _c.chapter) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.text) || '';
                            return [2 /*return*/, chapter];
                        }
                        return [2 /*return*/, ''];
                }
            });
        });
    };
    RNRF.prototype.searchNovels = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var url, items, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "/v3/books?filter[or][0][title][like]=").concat(searchTerm, "&filter[or][1][titleEn][like]=").concat(searchTerm, "&filter[or][2][fullTitle][like]=").concat(searchTerm, "&filter[status][]=active&filter[status][]=abandoned&filter[status][]=completed&expand=verticalImage");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (res) {
                                return res.json();
                            })];
                    case 1:
                        items = (_a.sent()).items;
                        novels = [];
                        items.forEach(function (novel) {
                            var _a;
                            return novels.push({
                                name: novel.title,
                                cover: ((_a = novel === null || novel === void 0 ? void 0 : novel.verticalImage) === null || _a === void 0 ? void 0 : _a.url)
                                    ? _this.site + novel.verticalImage.url
                                    : defaultCover_1.defaultCover,
                                path: '/' + novel.slug,
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return RNRF;
}());
exports.default = new RNRF();
