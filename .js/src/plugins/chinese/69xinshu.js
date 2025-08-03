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
var filterInputs_1 = require("@libs/filterInputs");
var urlencode_1 = require("urlencode");
var novelStatus_1 = require("@libs/novelStatus");
var XinShu69 = /** @class */ (function () {
    function XinShu69() {
        this.id = '69xinshu';
        this.name = '69书吧';
        this.icon = 'src/cn/69xinshu/icon.png';
        this.site = 'https://69shu.biz';
        this.version = '0.1.2';
        this.filters = {
            class: {
                label: '分类',
                value: '0',
                options: [
                    { label: '全部分类', value: '0' },
                    { label: '言情小说', value: '3' },
                    { label: '玄幻魔法', value: '1' },
                    { label: '修真武侠', value: '2' },
                    { label: '穿越时空', value: '11' },
                    { label: '都市小说', value: '9' },
                    { label: '历史军事', value: '4' },
                    { label: '游戏竞技', value: '5' },
                    { label: '科幻空间', value: '6' },
                    { label: '悬疑惊悚', value: '7' },
                    { label: '同人小说', value: '8' },
                    { label: '官场职场', value: '10' },
                    { label: '青春校园', value: '12' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    XinShu69.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var url, body, loadedCheerio, novels, novelsList;
            var _this = this;
            var filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (pageNo === 1) {
                            url = "".concat(this.site, "/novels/class/").concat(filters.class.value, ".htm");
                        }
                        else {
                            url = "".concat(this.site, "/ajax_novels/class/").concat(filters.class.value, "/").concat(pageNo, ".htm");
                        }
                        return [4 /*yield*/, (0, fetch_1.fetchText)(url, {}, 'gbk')];
                    case 1:
                        body = _c.sent();
                        if (body === '')
                            throw Error('无法获取小说列表，请检查网络');
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        novelsList = pageNo === 1
                            ? loadedCheerio('.newlistbox > ul > li')
                            : loadedCheerio('li');
                        novelsList.each(function (i, e) {
                            var novelUrl = loadedCheerio(e).find('div > h3 > a').attr('href');
                            if (novelUrl) {
                                var novelName = loadedCheerio(e).find('div > h3 > a').text();
                                var novelCover = loadedCheerio(e).find('a > img').attr('data-src');
                                var novel = {
                                    name: novelName,
                                    cover: novelCover,
                                    path: novelUrl.replace(_this.site, ''),
                                };
                                novels.push(novel);
                            }
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    XinShu69.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, body, loadedCheerio, novel, bookInfo, authorMatch, genresMatch, chapters, chaptersUrl, chaptersBody, chaptersLoadedCheerio_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + novelPath;
                        return [4 /*yield*/, (0, fetch_1.fetchText)(url, {}, 'gbk')];
                    case 1:
                        body = _a.sent();
                        if (body === '')
                            throw Error('无法获取小说内容，请检查网络');
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelPath,
                            chapters: [],
                            name: loadedCheerio('h1 > a').text(),
                        };
                        novel.cover = loadedCheerio('div.bookimg2 > img').attr('src');
                        novel.summary = loadedCheerio('div.navtxt').text().trim();
                        bookInfo = loadedCheerio('div.booknav2').text();
                        authorMatch = bookInfo.match(/作者：(.*)/);
                        if (authorMatch) {
                            novel.author = authorMatch[1];
                        }
                        novel.artist = undefined;
                        novel.status = bookInfo.includes('连载')
                            ? novelStatus_1.NovelStatus.Ongoing
                            : novelStatus_1.NovelStatus.Completed;
                        genresMatch = bookInfo.match(/分类：(.*)/);
                        if (genresMatch) {
                            novel.genres = genresMatch[1];
                        }
                        chapters = [];
                        chaptersUrl = loadedCheerio('a.more-btn').attr('href');
                        if (!chaptersUrl) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, fetch_1.fetchText)(chaptersUrl, {}, 'gbk')];
                    case 2:
                        chaptersBody = _a.sent();
                        chaptersLoadedCheerio_1 = (0, cheerio_1.load)(chaptersBody);
                        chaptersLoadedCheerio_1('li').each(function (i, e) {
                            var chapterUrl = chaptersLoadedCheerio_1(e).find('a').attr('href');
                            if (chapterUrl === null || chapterUrl === void 0 ? void 0 : chapterUrl.startsWith('https://')) {
                                var chapterName = chaptersLoadedCheerio_1(e).find('a').text().trim();
                                chapters.push({
                                    name: chapterName,
                                    path: chapterUrl.replace(_this.site, ''),
                                });
                            }
                        });
                        _a.label = 3;
                    case 3:
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    XinShu69.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, chapterText;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchText)(this.site + chapterPath, {}, 'gbk')];
                    case 1:
                        body = _b.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        chapterText = ((_a = loadedCheerio('div.txtnav').prop('innerText')) !== null && _a !== void 0 ? _a : '')
                            .split('\n')
                            // remove empty lines
                            .map(function (line) { return line.trim(); })
                            .filter(function (line) { return line !== ''; })
                            // remove the first two lines which are the chapter name and author name
                            .slice(2)
                            .map(function (line) { return "<p>".concat(line, "</p>"); })
                            .join('\n');
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    XinShu69.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var searchUrl, formData, body, loadedCheerio, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        searchUrl = "".concat(this.site, "/modules/article/search.php");
                        formData = new FormData();
                        formData.append('searchkey', (0, urlencode_1.encode)(searchTerm, 'gbk'));
                        formData.append('searchtype', 'all');
                        return [4 /*yield*/, (0, fetch_1.fetchText)(searchUrl, { method: 'post', body: formData }, 'gbk')];
                    case 1:
                        body = _a.sent();
                        if (body === '')
                            throw Error('无法获取搜索结果，请检查网络');
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio('.newbox > ul > li').each(function (i, e) {
                            var novelUrl = loadedCheerio(e).find('a').attr('href');
                            var novelName = loadedCheerio(e).find('div.newnav > h3').text();
                            var novelCover = loadedCheerio(e).find('img').attr('data-src');
                            var novel = {
                                name: novelName,
                                path: novelUrl.replace(_this.site, ''),
                                cover: novelCover,
                            };
                            novels.push(novel);
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return XinShu69;
}());
exports.default = new XinShu69();
