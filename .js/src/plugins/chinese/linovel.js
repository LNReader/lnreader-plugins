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
var fetch_1 = require("@libs/fetch");
var cheerio_1 = require("cheerio");
var novelStatus_1 = require("@libs/novelStatus");
var LinovelPlugin = /** @class */ (function () {
    function LinovelPlugin() {
        this.id = 'linovel';
        this.name = 'linovel';
        this.icon = 'src/cn/linovel/icon.png';
        this.site = 'https://www.linovel.net';
        this.version = '1.0.0';
        this.filters = undefined;
        this.imageRequestInit = undefined;
        this.userAgent = 'Mozilla/5.0 (X11; Linux x86_64; rv:136.0) Gecko/20100101 Firefox/136.0';
    }
    LinovelPlugin.prototype.fetchHTML = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchText)(url, {
                            headers: { 'User-Agent': this.userAgent },
                        })];
                    case 1:
                        body = _a.sent();
                        if (body === '')
                            throw Error('无法获取内容，请检查网络');
                        return [2 /*return*/, (0, cheerio_1.load)(body)];
                }
            });
        });
    };
    LinovelPlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var novels, loadedCheerio;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        novels = [];
                        return [4 /*yield*/, this.fetchHTML(this.site)];
                    case 1:
                        loadedCheerio = _c.sent();
                        loadedCheerio('a.book-item-inner').each(function (i, elem) {
                            var _a, _b;
                            var name = loadedCheerio(elem).find('.book-item-name').text().trim();
                            var path = (_a = loadedCheerio(elem).attr('href')) !== null && _a !== void 0 ? _a : '';
                            var cover = ((_b = loadedCheerio(elem).find('img').attr('data-original')) !== null && _b !== void 0 ? _b : '').replace(/!min300jpg$/, '');
                            novels.push({ name: name, path: path, cover: cover });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    LinovelPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var novel, loadedCheerio, chapters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        novel = {
                            path: novelPath,
                            name: 'Untitled',
                        };
                        return [4 /*yield*/, this.fetchHTML(this.site + novelPath)];
                    case 1:
                        loadedCheerio = _a.sent();
                        loadedCheerio('div.name')
                            .find('a')
                            .each(function (_i, elem) {
                            novel.author = loadedCheerio(elem).text().trim();
                        });
                        loadedCheerio('.book-title').each(function (_i, elem) {
                            novel.name = loadedCheerio(elem).text().trim();
                        });
                        loadedCheerio('.book-data')
                            .find('span')
                            .each(function (_i, elem) {
                            var text = loadedCheerio(elem).text().trim();
                            if (text.includes('字数')) {
                                // Handle word count
                            }
                            else if (text.includes('热度')) {
                                // Handle popularity
                            }
                            else if (text.includes('收藏')) {
                                // Handle favorites
                            }
                            else if (text === '连载中') {
                                novel.status = novelStatus_1.NovelStatus.Ongoing;
                            }
                            else if (text === '已完结') {
                                novel.status = novelStatus_1.NovelStatus.Completed;
                            }
                        });
                        loadedCheerio('.book-cover')
                            .find('img')
                            .each(function (_i, elem) {
                            var _a;
                            novel.cover = (_a = loadedCheerio(elem).attr('src')) !== null && _a !== void 0 ? _a : '';
                        });
                        novel.genres = loadedCheerio('.book-cats')
                            .children('a')
                            .map(function (i, el) { return loadedCheerio(el).text(); })
                            .toArray()
                            .join(',');
                        novel.summary = loadedCheerio('.about-text').text().trim();
                        chapters = [];
                        loadedCheerio('div.chapter')
                            .find('a')
                            .each(function (i, elem) {
                            var _a;
                            var name = loadedCheerio(elem).text().trim();
                            var path = (_a = loadedCheerio(elem).attr('href')) !== null && _a !== void 0 ? _a : '';
                            chapters.push({ name: name, path: path });
                        });
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    LinovelPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var loadedCheerio, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchHTML(this.site + chapterPath)];
                    case 1:
                        loadedCheerio = _a.sent();
                        chapterText = '';
                        if (loadedCheerio('.fufei-app-download-hint').length) {
                            throw Error('本章节需订阅后才能阅览，请下载轻之文库App订阅');
                        }
                        loadedCheerio('.article-text')
                            .find('p, img')
                            .each(function (i, elem) {
                            if (elem.tagName === 'img') {
                                var imgSrc = loadedCheerio(elem).attr('src');
                                chapterText += "<img src=\"".concat(imgSrc, "\">\n");
                            }
                            else {
                                var text = loadedCheerio(elem).text().trim();
                                if (text === '&nbsp;') {
                                    chapterText += '<br>\n';
                                }
                                else {
                                    chapterText += "<p>".concat(text, "</p>\n");
                                }
                            }
                        });
                        return [2 /*return*/, chapterText.trim()];
                }
            });
        });
    };
    LinovelPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var loadedCheerio, novels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchHTML(this.site + '/search/?kw=' + searchTerm)];
                    case 1:
                        loadedCheerio = _a.sent();
                        novels = [];
                        loadedCheerio('.rank-book-list')
                            .find('a.search-book')
                            .each(function (i, elem) {
                            var _a, _b;
                            var name = loadedCheerio(elem).find('.book-name').text().trim();
                            var path = (_a = loadedCheerio(elem).attr('href')) !== null && _a !== void 0 ? _a : '';
                            var cover = ((_b = loadedCheerio(elem).find('img').attr('src')) !== null && _b !== void 0 ? _b : '').replace(/!min300jpg$/, '');
                            novels.push({ name: name, path: path, cover: cover });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return LinovelPlugin;
}());
exports.default = new LinovelPlugin();
