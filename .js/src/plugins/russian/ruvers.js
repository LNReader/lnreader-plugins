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
var cheerio_1 = require("cheerio");
var dayjs_1 = __importDefault(require("dayjs"));
var RV = /** @class */ (function () {
    function RV() {
        this.id = 'RV';
        this.name = 'Ruvers';
        this.site = 'https://ruvers.ru/';
        this.version = '1.0.0';
        this.icon = 'src/ru/ruvers/icon.png';
        this.popularNovels = this.fetchNovels;
        this.filters = {
            sort: {
                label: 'Сортировка',
                value: '-rating',
                options: [
                    { label: 'По названию', value: 'name' },
                    { label: 'По дате добавления', value: '-created_at' },
                    { label: 'По рейтингу', value: '-rating' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    RV.prototype.fetchNovels = function (page_1, _a, searchTerm_1) {
        return __awaiter(this, arguments, void 0, function (page, _b, searchTerm) {
            var url, data, novels;
            var _this = this;
            var _c;
            var filters = _b.filters;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        url = this.site + 'api/books?page=' + page;
                        url += '&sort=' + (((_c = filters === null || filters === void 0 ? void 0 : filters.sort) === null || _c === void 0 ? void 0 : _c.value) || '-rating');
                        if (searchTerm)
                            url += '&search=' + searchTerm;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (res) {
                                return res.json();
                            })];
                    case 1:
                        data = (_d.sent()).data;
                        novels = [];
                        data.forEach(function (novel) {
                            return novels.push({
                                name: novel.name,
                                cover: novel.images[0] ? _this.site + novel.images[0] : defaultCover_1.defaultCover,
                                path: novel.slug,
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    RV.prototype.searchNovels = function (searchTerm, page) {
        return __awaiter(this, void 0, void 0, function () {
            var defaultOptions;
            return __generator(this, function (_a) {
                defaultOptions = { filters: {} };
                return [2 /*return*/, this.fetchNovels(page, defaultOptions, searchTerm)];
            });
        });
    };
    RV.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, novel, bookId, chaptersJSON, chapters_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath).then(function (res) { return res.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('div.name > h1').text().trim(),
                            cover: loadedCheerio('.slider_prods_single > img').attr('src'),
                            summary: loadedCheerio('.book_description').text().trim(),
                            genres: loadedCheerio('.genres > a')
                                .map(function (index, element) { var _a; return (_a = loadedCheerio(element).text()) === null || _a === void 0 ? void 0 : _a.trim(); })
                                .get()
                                .join(','),
                            status: loadedCheerio('.status_row > div:nth-child(1) > a')
                                .text()
                                .includes('В работе')
                                ? novelStatus_1.NovelStatus.Ongoing
                                : novelStatus_1.NovelStatus.Completed,
                        };
                        bookId = loadedCheerio('comments-list').attr('commentable-id');
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + 'api/books/' + bookId + '/chapters/all').then(function (res) { return res.json(); })];
                    case 2:
                        chaptersJSON = _a.sent();
                        if (chaptersJSON.data.length) {
                            chapters_1 = [];
                            chaptersJSON.data.forEach(function (chapter, chapterIndex) {
                                if (chapter.is_published &&
                                    (chapter.is_free || chapter.purchased_by_user)) {
                                    chapters_1.push({
                                        name: 'Глава ' + chapter.number + ' ' + (chapter.name || ''),
                                        path: novelPath + '/' + chapter.id,
                                        releaseTime: (0, dayjs_1.default)(chapter.created_at).format('LLL'),
                                        chapterNumber: chapterIndex + 1,
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
    RV.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, encrypted;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath).then(function (res) {
                            return res.text();
                        })];
                    case 1:
                        body = _b.sent();
                        encrypted = (_a = body.match(/(mobile-books|books)-chapters-text-component.*:text='"(.*?)"'/s)) === null || _a === void 0 ? void 0 : _a[2];
                        if (!encrypted)
                            throw new Error('No chapter found');
                        return [2 /*return*/, unicodeToUtf8(encrypted)];
                }
            });
        });
    };
    return RV;
}());
exports.default = new RV();
function unicodeToUtf8(unicode) {
    return unicode.replace(/\\u([\d\w]{4})/gi, function (match, hex) {
        return String.fromCharCode(parseInt(hex, 16));
    });
}
