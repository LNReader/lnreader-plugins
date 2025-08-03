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
var cheerio_1 = require("cheerio");
var isAbsoluteUrl_1 = require("@libs/isAbsoluteUrl");
var fetch_1 = require("@libs/fetch");
var filterInputs_1 = require("@libs/filterInputs");
var dayjs_1 = __importDefault(require("dayjs"));
var ReadLiteNovel = /** @class */ (function () {
    function ReadLiteNovel() {
        this.id = 'rln.app';
        this.name = 'ReadLiteNovel';
        this.version = '1.0.1';
        this.icon = 'src/en/readlitenovel/icon.png';
        this.site = 'https://rln.app';
        this.filters = {
            order: {
                value: 'top-rated',
                label: 'Order by',
                options: [
                    { label: 'MOST VIEWED', value: 'most-viewed' },
                    { label: 'TOP RATED', value: 'top-rated' },
                    { label: 'BOOKMARKS', value: 'subscribers' },
                    { label: 'NEW', value: 'new' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    ReadLiteNovel.prototype.parseAgoDate = function (date) {
        var _a;
        //parseMadaraDate
        if (date === null || date === void 0 ? void 0 : date.includes('ago')) {
            var dayJSDate = (0, dayjs_1.default)(new Date()); // today
            var timeAgo = ((_a = date.match(/\d+/)) === null || _a === void 0 ? void 0 : _a[0]) || '';
            var timeAgoInt = parseInt(timeAgo, 10);
            if (!timeAgo)
                return null; // there is no number!
            if (date.includes('hours ago') || date.includes('hour ago')) {
                dayJSDate.subtract(timeAgoInt, 'hours'); // go back N hours
            }
            if (date.includes('days ago') || date.includes('day ago')) {
                dayJSDate.subtract(timeAgoInt, 'days'); // go back N days
            }
            if (date.includes('months ago') || date.includes('month ago')) {
                dayJSDate.subtract(timeAgoInt, 'months'); // go back N months
            }
            if (date.includes('years ago') || date.includes('year ago')) {
                dayJSDate.subtract(timeAgoInt, 'years'); // go back N years
            }
            return dayJSDate.toISOString();
        }
        return null; // there is no "ago" so give up
    };
    ReadLiteNovel.prototype.popularNovels = function (page_1, _a) {
        return __awaiter(this, arguments, void 0, function (page, _b) {
            var link, result, body, loadedCheerio, novels;
            var _this = this;
            var filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        link = "".concat(this.site, "/ranking/").concat(filters.order.value, "/").concat(page);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(link)];
                    case 1:
                        result = _c.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _c.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio('.category-items li').each(function (i, el) {
                            var novelUrl = loadedCheerio(el).find('.category-name a').attr('href');
                            if (!novelUrl)
                                return;
                            var novelName = loadedCheerio(el)
                                .find('.category-name a')
                                .text()
                                .trim();
                            var novelCover = loadedCheerio(el).find('.category-img img').attr('src');
                            if (novelCover && !(0, isAbsoluteUrl_1.isUrlAbsolute)(novelCover)) {
                                novelCover = _this.site + novelCover;
                            }
                            var novel = {
                                path: novelUrl === null || novelUrl === void 0 ? void 0 : novelUrl.replace(_this.site, ''),
                                name: novelName,
                                cover: novelCover,
                            };
                            novels.push(novel);
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    ReadLiteNovel.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var result, body, loadedCheerio, novel, chapter;
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
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('.novel-title').text() || 'Untitled',
                            cover: loadedCheerio('.novels-detail img').attr('src'),
                            summary: loadedCheerio('.empty-box').text().trim(),
                            chapters: [],
                        };
                        loadedCheerio('.novels-detail-right li').each(function (i, el) {
                            var detailName = loadedCheerio(el).find('div:first').text();
                            var detail = loadedCheerio(el).find('div:last');
                            switch (detailName) {
                                case 'Status:':
                                    novel.status = detail.text();
                                    break;
                                case 'Genres:':
                                    novel.genres =
                                        detail
                                            .find('a')
                                            .map(function (i, el) { return loadedCheerio(el).text(); })
                                            .toArray()
                                            .join(', ') || detail.text();
                                    break;
                                case 'Author(s):':
                                    novel.author =
                                        detail
                                            .find('a')
                                            .map(function (i, el) { return loadedCheerio(el).text(); })
                                            .toArray()
                                            .join(', ') || detail.text();
                                    break;
                                case 'Translator:':
                                    novel.artist = detail.text();
                                    break;
                            }
                        });
                        chapter = [];
                        loadedCheerio('.cm-tabs-content li').each(function (i, el) {
                            var chapterUrl = loadedCheerio(el).find('a').attr('href');
                            if (!chapterUrl)
                                return;
                            var chapterName = loadedCheerio(el).find('a').text().trim();
                            var releaseDate = _this.parseAgoDate(loadedCheerio(el).find('svg').attr('data-bs-original-title'));
                            chapter.push({
                                name: chapterName,
                                path: chapterUrl === null || chapterUrl === void 0 ? void 0 : chapterUrl.replace(_this.site, ''),
                                releaseTime: releaseDate,
                            });
                        });
                        novel.chapters = chapter;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    ReadLiteNovel.prototype.parseChapter = function (chapterPath) {
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
                        chapterText = loadedCheerio('#chapterText').html() || '';
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    ReadLiteNovel.prototype.searchNovels = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, novels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site +
                            "/search/autocomplete?dataType=json&query=".concat(encodeURIComponent(searchTerm));
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.json()];
                    case 2:
                        body = _a.sent();
                        novels = [];
                        body.results.forEach(function (item) {
                            return novels.push({
                                path: item.link,
                                name: item.original_title,
                                cover: item.image,
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return ReadLiteNovel;
}());
exports.default = new ReadLiteNovel();
