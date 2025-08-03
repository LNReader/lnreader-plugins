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
var fetch_1 = require("@libs/fetch");
var defaultCover_1 = require("@libs/defaultCover");
var dayjs_1 = __importDefault(require("dayjs"));
var storage_1 = require("@libs/storage");
var novelStatus_1 = require("@libs/novelStatus");
var Novelight = /** @class */ (function () {
    function Novelight() {
        this.id = 'novelight';
        this.name = 'Novelight';
        this.version = '1.1.1';
        this.icon = 'src/en/novelight/icon.png';
        this.site = 'https://novelight.net/';
        this.hideLocked = storage_1.storage.get('hideLocked');
        this.pluginSettings = {
            hideLocked: {
                value: '',
                label: 'Hide locked chapters',
                type: 'Switch',
            },
        };
    }
    Novelight.prototype.popularNovels = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var url, body, loadedCheerio, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "catalog/?ordering=popularity&page=").concat(page);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio('a.item').each(function (idx, ele) {
                            var novelName = loadedCheerio(ele).find('div.title').text().trim();
                            var novelUrl = ele.attribs.href;
                            var bareNovelCover = loadedCheerio(ele).find('img').attr('src');
                            var novelCover = bareNovelCover
                                ? _this.site + bareNovelCover
                                : defaultCover_1.defaultCover;
                            if (!novelUrl)
                                return;
                            var novel = {
                                name: novelName,
                                cover: novelCover !== null && novelCover !== void 0 ? novelCover : defaultCover_1.defaultCover,
                                path: novelUrl.replace('/', ''),
                            };
                            novels.push(novel);
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    Novelight.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, novel, info, status, translation, _i, info_1, child, type;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('h1').text() || 'Untitled',
                            cover: this.site + loadedCheerio('.poster > img').attr('src'),
                            summary: loadedCheerio('section.text-info.section > p').text(),
                            totalPages: loadedCheerio('#select-pagination-chapter > option').length,
                            chapters: [],
                        };
                        info = loadedCheerio('div.mini-info > .item').toArray();
                        status = '';
                        translation = '';
                        for (_i = 0, info_1 = info; _i < info_1.length; _i++) {
                            child = info_1[_i];
                            type = loadedCheerio(child).find('.sub-header').text().trim();
                            if (type === 'Status') {
                                status = loadedCheerio(child).find('div.info').text().trim();
                            }
                            if (type === 'Translation') {
                                translation = loadedCheerio(child).find('div.info').text().trim();
                            }
                            if (type === 'Author') {
                                novel.author = loadedCheerio(child).find('div.info').text().trim();
                            }
                            if (type === 'Genres') {
                                novel.genres = loadedCheerio(child)
                                    .find('div.info > a')
                                    .map(function (i, el) { return loadedCheerio(el).text(); })
                                    .toArray()
                                    .join(', ');
                            }
                        }
                        if (status === 'cancelled')
                            novel.status = novelStatus_1.NovelStatus.Cancelled;
                        else if (status === 'releasing' || translation === 'ongoing')
                            novel.status = novelStatus_1.NovelStatus.Ongoing;
                        else if (status === 'completed' && translation === 'completed')
                            novel.status = novelStatus_1.NovelStatus.Completed;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    Novelight.prototype.parsePage = function (novelPath, page) {
        return __awaiter(this, void 0, void 0, function () {
            var rawBody, csrftoken, bookId, totalPages, chaptersRaw, chapter, chapters;
            var _this = this;
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath).then(function (r) { return r.text(); })];
                    case 1:
                        rawBody = _g.sent();
                        csrftoken = (_a = rawBody === null || rawBody === void 0 ? void 0 : rawBody.match(/window\.CSRF_TOKEN = "([^"]+)"/)) === null || _a === void 0 ? void 0 : _a[1];
                        bookId = (_b = rawBody === null || rawBody === void 0 ? void 0 : rawBody.match(/const OBJECT_BY_COMMENT = ([0-9]+)/)) === null || _b === void 0 ? void 0 : _b[1];
                        totalPages = parseInt((_f = (_e = (_d = (_c = rawBody === null || rawBody === void 0 ? void 0 : rawBody.match(/<option value="([0-9]+)"/g)) === null || _c === void 0 ? void 0 : _c.at(-1)) === null || _d === void 0 ? void 0 : _d.match(/([0-9]+)/)) === null || _e === void 0 ? void 0 : _e[1]) !== null && _f !== void 0 ? _f : '1');
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "/book/ajax/chapter-pagination?csrfmiddlewaretoken=").concat(csrftoken, "&book_id=").concat(bookId, "&page=").concat(totalPages - parseInt(page) + 1), {
                                headers: {
                                    'Host': this.site.replace('https://', '').replace('/', ''),
                                    'Referer': this.site + novelPath,
                                    'X-Requested-With': 'XMLHttpRequest',
                                },
                            })
                                .then(function (r) { return r.json(); })
                                .then(function (r) { return r.html; })];
                    case 2:
                        chaptersRaw = _g.sent();
                        chapter = [];
                        (0, cheerio_1.load)('<html>' + chaptersRaw + '</html>')('a').each(function (idx, ele) {
                            var title = (0, cheerio_1.load)(ele)('.title').text().trim();
                            var isLocked = !!(0, cheerio_1.load)(ele)('.cost').text().trim();
                            if (_this.hideLocked && isLocked)
                                return;
                            var date;
                            try {
                                date = (0, dayjs_1.default)((0, cheerio_1.load)(ele)('.date').text().trim(), 'DD.MM.YYYY').toISOString();
                            }
                            catch (error) { }
                            var chapterName = isLocked ? '🔒 ' + title : title;
                            var chapterUrl = ele.attribs.href;
                            chapter.push({
                                name: chapterName,
                                path: chapterUrl,
                                page: page,
                                releaseTime: date,
                            });
                        });
                        chapters = chapter.reverse();
                        return [2 /*return*/, { chapters: chapters }];
                }
            });
        });
    };
    Novelight.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var rawBody, csrftoken, chapterId, className, body, loadedCheerio, chapterText;
            var _this = this;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath).then(function (r) {
                            var res = r.text();
                            return res;
                        })];
                    case 1:
                        rawBody = _c.sent();
                        csrftoken = (_a = rawBody === null || rawBody === void 0 ? void 0 : rawBody.match(/window\.CSRF_TOKEN = "([^"]+)"/)) === null || _a === void 0 ? void 0 : _a[1];
                        chapterId = (_b = rawBody === null || rawBody === void 0 ? void 0 : rawBody.match(/const CHAPTER_ID = "([0-9]+)/)) === null || _b === void 0 ? void 0 : _b[1];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + 'book/ajax/read-chapter/' + chapterId, {
                                method: 'GET',
                                headers: {
                                    Cookie: 'csrftoken=' + csrftoken,
                                    Referer: this.site + chapterPath,
                                    'X-Requested-With': 'XMLHttpRequest',
                                },
                            }).then(function (r) { return __awaiter(_this, void 0, void 0, function () {
                                var res;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, r.json()];
                                        case 1:
                                            res = _a.sent();
                                            className = res.class;
                                            return [2 /*return*/, res.content];
                                    }
                                });
                            }); })];
                    case 2:
                        body = _c.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        chapterText = loadedCheerio('.' + className).html() || '';
                        return [2 /*return*/, chapterText.replace(/class="advertisment"/g, 'style="display:none;"')];
                }
            });
        });
    };
    Novelight.prototype.searchNovels = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var url, body, loadedCheerio, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "catalog/?search=").concat(encodeURIComponent(searchTerm));
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio('a.item').each(function (idx, ele) {
                            var novelName = loadedCheerio(ele).find('div.title').text().trim();
                            var novelUrl = ele.attribs.href;
                            var bareNovelCover = loadedCheerio(ele).find('img').attr('src');
                            var novelCover = bareNovelCover
                                ? _this.site + bareNovelCover
                                : defaultCover_1.defaultCover;
                            if (!novelUrl)
                                return;
                            var novel = {
                                name: novelName,
                                cover: novelCover !== null && novelCover !== void 0 ? novelCover : defaultCover_1.defaultCover,
                                path: novelUrl.replace('/', ''),
                            };
                            novels.push(novel);
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return Novelight;
}());
exports.default = new Novelight();
