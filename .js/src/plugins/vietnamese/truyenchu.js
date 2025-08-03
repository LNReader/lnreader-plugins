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
var TruyenFull = /** @class */ (function () {
    function TruyenFull() {
        this.id = 'truyenchu';
        this.name = 'Truyện Chữ';
        this.icon = 'src/vi/truyenchu/icon.png';
        this.site = 'https://truyenchu.vn';
        this.version = '1.0.0';
    }
    TruyenFull.prototype.parseNovels = function (loadedCheerio) {
        var _this = this;
        var novels = [];
        loadedCheerio('.list-truyen .row').each(function (idx, ele) {
            var novelName = loadedCheerio(ele).find('h3.truyen-title > a').text();
            var novelCover = _this.site +
                loadedCheerio(ele)
                    .find("div[data-classname='cover']")
                    .attr('data-image');
            var novelUrl = loadedCheerio(ele)
                .find('h3.truyen-title > a')
                .attr('href');
            if (novelUrl) {
                novels.push({
                    name: novelName,
                    cover: novelCover,
                    path: novelUrl.replace(_this.site, ''),
                });
            }
        });
        return novels;
    };
    TruyenFull.prototype.parseChapters = function (html) {
        var _this = this;
        var _a;
        var listChapterHTML = (_a = html.match(/("list_chapter":\s?\\{0}"(.+)\\{0}"),/)) === null || _a === void 0 ? void 0 : _a[1];
        if (!listChapterHTML)
            throw new Error('Không tải được chương');
        var listChapter = JSON.parse("{".concat(listChapterHTML, "}"));
        var loadedChapterList = (0, cheerio_1.load)(listChapter.list_chapter);
        var chapters = [];
        loadedChapterList('ul > li > a').each(function (idx, ele) {
            var _a;
            var path = ele.attribs['href'].replace(_this.site, '');
            if (path) {
                chapters.push({
                    name: ele.attribs['title'],
                    path: path,
                    chapterNumber: Number((_a = path.match(/\/chuong-(\d+)/)) === null || _a === void 0 ? void 0 : _a[1]),
                });
            }
        });
        return chapters;
    };
    TruyenFull.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "/danh-sach/truyen-hot?page=").concat(pageNo);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, this.parseNovels(loadedCheerio)];
                }
            });
        });
    };
    TruyenFull.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, lastPage, regex, novel;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = this.site + novelPath;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _b.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _b.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        lastPage = 1;
                        regex = new RegExp("".concat(novelPath, "\\?page=\\d+"), 'g');
                        (_a = body.match(regex)) === null || _a === void 0 ? void 0 : _a.forEach(function (v) {
                            var _a;
                            var page = Number((_a = v.match(/\?page=(\d+)/)) === null || _a === void 0 ? void 0 : _a[1]);
                            if (page && page > lastPage) {
                                lastPage = page;
                            }
                        });
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('div.book > img').attr('alt') || 'Không có tiêu đề',
                            chapters: [],
                            totalPages: lastPage,
                        };
                        novel.cover = this.site + loadedCheerio('div.book > img').attr('src');
                        novel.summary = loadedCheerio('div.desc-text').text().trim();
                        novel.author = loadedCheerio('h3:contains("Tác giả:")')
                            .parent()
                            .contents()
                            .text()
                            .replace('Tác giả:', '');
                        novel.genres = loadedCheerio('h3:contains("Thể loại")')
                            .siblings()
                            .map(function (i, el) { return loadedCheerio(el).text(); })
                            .toArray()
                            .join(',');
                        novel.status = loadedCheerio('h3:contains("Trạng thái")').next().text();
                        if (novel.status === 'Full') {
                            novel.status = novelStatus_1.NovelStatus.Completed;
                        }
                        else if (novel.status === 'Đang ra') {
                            novel.status = novelStatus_1.NovelStatus.Ongoing;
                        }
                        else {
                            novel.status = novelStatus_1.NovelStatus.Unknown;
                        }
                        novel.chapters = this.parseChapters(body);
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    TruyenFull.prototype.parsePage = function (novelPath, page) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, chapters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site).concat(novelPath, "?page=").concat(page);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        chapters = this.parseChapters(body);
                        return [2 /*return*/, {
                                chapters: chapters,
                            }];
                }
            });
        });
    };
    TruyenFull.prototype.parseChapter = function (chapterPath) {
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
                        chapterText = (loadedCheerio('.chapter-title').html() || '') +
                            (loadedCheerio('#chapter-c').html() || '');
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    TruyenFull.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var searchUrl, result, body, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchUrl = "".concat(this.site, "/tim-kiem?tukhoa=").concat(searchTerm, "&page=").concat(pageNo);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(searchUrl)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, this.parseNovels(loadedCheerio)];
                }
            });
        });
    };
    return TruyenFull;
}());
exports.default = new TruyenFull();
