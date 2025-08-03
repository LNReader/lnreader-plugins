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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = require("@libs/fetch");
var cheerio_1 = require("cheerio");
var novelStatus_1 = require("@libs/novelStatus");
var dayjs_1 = __importDefault(require("dayjs"));
var FictionZonePlugin = /** @class */ (function () {
    function FictionZonePlugin() {
        var _this = this;
        this.id = 'fictionzone';
        this.name = 'Fiction Zone';
        this.icon = 'src/en/fictionzone/icon.png';
        this.site = 'https://fictionzone.net';
        this.version = '1.0.1';
        this.filters = undefined;
        this.imageRequestInit = undefined;
        this.cachedNovelIds = new Map();
        this.resolveUrl = function (path, isNovel) { return _this.site + '/' + path; };
    }
    FictionZonePlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getPage(this.site + '/library?page=' + pageNo)];
                    case 1: return [2 /*return*/, _c.sent()];
                }
            });
        });
    };
    FictionZonePlugin.prototype.getPage = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var req, body, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        req = _a.sent();
                        return [4 /*yield*/, req.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, loadedCheerio('div.novel-card')
                                .map(function (i, el) {
                                var novelName = loadedCheerio(el).find('a > div.title > h1').text();
                                var novelCover = loadedCheerio(el).find('img').attr('src');
                                var novelUrl = loadedCheerio(el).find('a').attr('href');
                                return {
                                    name: novelName,
                                    cover: novelCover,
                                    path: novelUrl.replace(/^\//, '').replace(/\/$/, ''),
                                };
                            })
                                .toArray()];
                }
            });
        });
    };
    FictionZonePlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var req, body, loadedCheerio, novel, status, nuxtData, parsed, last, _i, parsed_1, a;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/' + novelPath)];
                    case 1:
                        req = _a.sent();
                        return [4 /*yield*/, req.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('div.novel-title > h1').text(),
                            totalPages: 1,
                        };
                        // novel.artist = '';
                        novel.author = loadedCheerio('div.novel-author > content').text();
                        novel.cover = loadedCheerio('div.novel-img > img').attr('src');
                        novel.genres = __spreadArray(__spreadArray([], loadedCheerio('div.genres > .items > span')
                            .map(function (i, el) { return loadedCheerio(el).text(); })
                            .toArray(), true), loadedCheerio('div.tags > .items > a')
                            .map(function (i, el) { return loadedCheerio(el).text(); })
                            .toArray(), true).join(',');
                        status = loadedCheerio('div.novel-status > div.content')
                            .text()
                            .trim();
                        if (status === 'Ongoing')
                            novel.status = novelStatus_1.NovelStatus.Ongoing;
                        novel.summary = loadedCheerio('#synopsis > div.content').text();
                        nuxtData = loadedCheerio('script#__NUXT_DATA__').html();
                        parsed = JSON.parse(nuxtData);
                        last = null;
                        for (_i = 0, parsed_1 = parsed; _i < parsed_1.length; _i++) {
                            a = parsed_1[_i];
                            if (typeof a === 'string' && a.startsWith('novel_covers/'))
                                break;
                            last = a;
                        }
                        this.cachedNovelIds.set(novelPath, last.toString());
                        // @ts-ignore
                        novel.chapters = loadedCheerio('div.chapters > div.list-wrapper > div.items > a.chapter')
                            .map(function (i, el) {
                            var _a;
                            var chapterName = loadedCheerio(el).find('span.chapter-title').text();
                            var chapterUrl = (_a = loadedCheerio(el)
                                .attr('href')) === null || _a === void 0 ? void 0 : _a.replace(/^\//, '').replace(/\/$/, '');
                            var uploadTime = _this.parseAgoDate(loadedCheerio(el).find('span.update-date').text());
                            return {
                                name: chapterName,
                                releaseTime: uploadTime,
                                path: chapterUrl === null || chapterUrl === void 0 ? void 0 : chapterUrl.replace(/^\//, '').replace(/\/$/, ''),
                            };
                        })
                            .toArray()
                            .filter(function (chap) { return !!chap.path; });
                        novel.totalPages = parseInt(loadedCheerio('div.chapters ul.el-pager > li:last-child').text());
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    FictionZonePlugin.prototype.parsePage = function (novelPath, page) {
        return __awaiter(this, void 0, void 0, function () {
            var id, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = this.cachedNovelIds.get(novelPath);
                        if (!!id) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.parseNovel(novelPath)];
                    case 1:
                        _a.sent();
                        id = this.cachedNovelIds.get(novelPath);
                        _a.label = 2;
                    case 2: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/api/__api_party/api-v1', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                'path': '/chapter/all/' + id,
                                'query': { 'page': parseInt(page) },
                                'headers': { 'content-type': 'application/json' },
                                'method': 'get',
                            }),
                        }).then(function (r) { return r.json(); })];
                    case 3:
                        data = _a.sent();
                        return [2 /*return*/, {
                                chapters: data._data.map(function (c) { return ({
                                    name: c.title,
                                    releaseTime: new Date(c.created_at).toISOString(),
                                    path: novelPath + '/' + c.slug,
                                }); }),
                            }];
                }
            });
        });
    };
    FictionZonePlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var req, body, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/' + chapterPath)];
                    case 1:
                        req = _a.sent();
                        return [4 /*yield*/, req.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, loadedCheerio('div.chapter-content').html() || ''];
                }
            });
        });
    };
    FictionZonePlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPage(this.site +
                            '/library?query=' +
                            encodeURIComponent(searchTerm) +
                            '&page=' +
                            pageNo +
                            '&sort=views-all')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    FictionZonePlugin.prototype.parseAgoDate = function (date) {
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
    return FictionZonePlugin;
}());
exports.default = new FictionZonePlugin();
