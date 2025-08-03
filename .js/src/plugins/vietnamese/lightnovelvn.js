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
var novelStatus_1 = require("@libs/novelStatus");
var LightNovelVN = /** @class */ (function () {
    function LightNovelVN() {
        this.id = 'lightnovel.vn';
        this.name = 'Light Novel VN';
        this.version = '1.0.0';
        this.icon = 'src/vi/lightnovelvn/icon.png';
        this.site = 'https://lightnovel.vn';
    }
    LightNovelVN.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, body, loadedCheerio, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "/truyen-hot-ds?page=").concat(pageNo);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio(".flex.flex-col[itemtype='https://schema.org/Book']").each(function (idx, ele) {
                            var _a;
                            var novelName = loadedCheerio(ele)
                                .find('h3[itemprop="name"] > a')
                                .text()
                                .trim();
                            var img = loadedCheerio(ele).find('noscript').html();
                            var novelCover = (_a = img === null || img === void 0 ? void 0 : img.match(/srcSet="([^\s]+)/)) === null || _a === void 0 ? void 0 : _a[1];
                            var novelUrl = loadedCheerio(ele)
                                .find('h3[itemprop="name"] > a')
                                .attr('href');
                            if (novelUrl)
                                novels.push({
                                    name: novelName,
                                    cover: novelCover,
                                    path: novelUrl.replace(_this.site, ''),
                                });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    LightNovelVN.prototype.parseChapters = function (loadedCheerio) {
        var _this = this;
        var chapters = [];
        loadedCheerio('ul.chapter-list > li').each(function (idx, ele) {
            var chNum = Number(loadedCheerio(ele).find('div').first().text());
            var chapterUrl = loadedCheerio(ele).find('a').attr('href');
            var name = loadedCheerio(ele).find('a').text().trim();
            if (chapterUrl) {
                chapters.push({
                    path: chapterUrl.replace(_this.site, ''),
                    name: name,
                    chapterNumber: chNum,
                });
            }
        });
        return chapters;
    };
    LightNovelVN.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, body, loadedCheerio, novel, genres, delay, chapterListUrl, chapterListBody, loadedChapterList;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = this.site + novelPath;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.text(); })];
                    case 1:
                        body = _b.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelPath,
                            chapters: [],
                            name: 'Không có tiêu đề',
                            totalPages: 1,
                        };
                        novel.name = loadedCheerio('h1[itemprop="name"]').text().trim();
                        novel.cover = (_a = loadedCheerio('header div:nth-child(2) img')
                            .attr('srcset')) === null || _a === void 0 ? void 0 : _a.split(/\s+/)[0];
                        genres = [];
                        loadedCheerio('a[itemprop="genre"]').each(function () {
                            genres.push(loadedCheerio(this).text());
                        });
                        novel.genres = genres.join(',');
                        novel.status = loadedCheerio('span.font-bold.text-size22:last').text();
                        if (novel.status === 'Đang ra') {
                            novel.status = novelStatus_1.NovelStatus.Ongoing;
                        }
                        else if (novel.status === 'Hoàn thành') {
                            novel.status = novelStatus_1.NovelStatus.Completed;
                        }
                        else {
                            novel.status = novelStatus_1.NovelStatus.Unknown;
                        }
                        novel.author = loadedCheerio('a[itemprop="author"] > span').text();
                        novel.summary = loadedCheerio('#bookIntro').text().replace(/\s+/g, ' ');
                        delay = function (ms) { return new Promise(function (res) { return setTimeout(res, ms); }); };
                        return [4 /*yield*/, delay(1000)];
                    case 2:
                        _b.sent();
                        chapterListUrl = url + '/danh-sach-chuong';
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(chapterListUrl).then(function (r) { return r.text(); })];
                    case 3:
                        chapterListBody = _b.sent();
                        loadedChapterList = (0, cheerio_1.load)(chapterListBody);
                        novel.chapters = this.parseChapters(loadedChapterList);
                        loadedChapterList('nav[aria-label="Pagination"] a').each(function (index, ele) {
                            var _a;
                            var href = ele.attribs['href'];
                            if (href) {
                                var page = Number((_a = href.match(/\?page=(\d+)/)) === null || _a === void 0 ? void 0 : _a[1]);
                                if (page && page > novel.totalPages) {
                                    novel.totalPages = page;
                                }
                            }
                        });
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    LightNovelVN.prototype.parsePage = function (novelPath, page) {
        return __awaiter(this, void 0, void 0, function () {
            var url, chapterListBody, chapters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site).concat(novelPath, "/danh-sach-chuong?page=").concat(page);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.text(); })];
                    case 1:
                        chapterListBody = _a.sent();
                        chapters = this.parseChapters((0, cheerio_1.load)(chapterListBody));
                        return [2 /*return*/, {
                                chapters: chapters,
                            }];
                }
            });
        });
    };
    LightNovelVN.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        chapterText = loadedCheerio('div.chapter-content').html() || '';
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    LightNovelVN.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, formData, result, novels;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        url = "".concat(this.site, "/api/book-search");
                        formData = new FormData();
                        formData.append('keyword', searchTerm);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url, {
                                method: 'POST',
                                body: formData,
                            }).then(function (r) { return r.json(); })];
                    case 1:
                        result = _b.sent();
                        novels = ((_a = result.data) === null || _a === void 0 ? void 0 : _a.map(function (item) {
                            return {
                                name: item.name,
                                path: '/truyen/' + item.slug,
                                cover: (_this.site + item.coverUrl).replace('default.jpg', '150.jpg?w=256&q='),
                            };
                        })) || [];
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return LightNovelVN;
}());
exports.default = new LightNovelVN();
