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
var DreamBigTL = /** @class */ (function () {
    function DreamBigTL() {
        this.id = 'dreambigtl';
        this.name = 'Dream Big Translations';
        this.version = '1.0.0';
        this.site = 'https://www.dreambigtl.com/';
        this.icon = 'src/en/dreambigtl/icon.png';
    }
    DreamBigTL.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var url, response, body, loadedCheerio, novels, categories;
            var _this = this;
            var showLatestNovels = _b.showLatestNovels;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        url = "".concat(this.site, "p/disclaimer.html");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        response = _c.sent();
                        return [4 /*yield*/, response.text()];
                    case 2:
                        body = _c.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        categories = ['New Novels', 'Ongoing Novels', 'Completed Novels'];
                        loadedCheerio('#webify-pro-main-nav-menu > li.has-sub').each(function (_, categoryElem) {
                            var categoryName = loadedCheerio(categoryElem)
                                .children('a')
                                .first()
                                .text()
                                .trim();
                            if (categories.includes(categoryName)) {
                                var subMenu = loadedCheerio(categoryElem).find('ul.sub-menu.m-sub');
                                subMenu.find('li > a').each(function (_, novelElem) {
                                    var novelName = loadedCheerio(novelElem).text().trim();
                                    var novelUrl = loadedCheerio(novelElem).attr('href');
                                    if (novelUrl) {
                                        novels.push({
                                            name: novelName,
                                            path: novelUrl.replace(_this.site, ''),
                                            cover: '',
                                        });
                                    }
                                });
                            }
                        });
                        novels.forEach(function (novel) { return console.log('Novel:', novel.name, novel.path); });
                        if (novels.length === 0) {
                            // Fallback: try to parse everything...
                            loadedCheerio('a').each(function (_, elem) {
                                var href = loadedCheerio(elem).attr('href');
                                if (href && href.includes('/p/') && !href.includes('disclaimer')) {
                                    var novelName = loadedCheerio(elem).text().trim();
                                    novels.push({
                                        name: novelName,
                                        path: href.replace(_this.site, ''),
                                        cover: '',
                                    });
                                }
                            });
                        }
                        if (showLatestNovels) {
                            novels.sort(function (a, b) { return b.path.localeCompare(a.path); });
                        }
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    DreamBigTL.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, novel;
            var _a;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        url = this.site + novelPath;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _d.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _d.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        _a = {
                            path: novelPath,
                            name: loadedCheerio('h1.entry-title').text().trim(),
                            cover: loadedCheerio('.post-body img').first().attr('src') || '',
                            summary: loadedCheerio('.post-body p').first().text().trim(),
                            author: ((_c = (_b = loadedCheerio('.post-body')
                                .text()
                                .match(/Author:\s*(.+)/i)) === null || _b === void 0 ? void 0 : _b[1]) === null || _c === void 0 ? void 0 : _c.trim()) || 'Unknown',
                            status: this.getNovelStatus(novelPath)
                        };
                        return [4 /*yield*/, this.parseChapters(loadedCheerio)];
                    case 3:
                        novel = (_a.chapters = _d.sent(),
                            _a);
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    DreamBigTL.prototype.parseChapters = function (loadedCheerio) {
        return __awaiter(this, void 0, void 0, function () {
            var chapters;
            var _this = this;
            return __generator(this, function (_a) {
                chapters = [];
                // Parse "Free Tier" chapters
                loadedCheerio('.chapter-panel').each(function (_, panel) {
                    var panelTitle = loadedCheerio(panel).find('summary').text().trim();
                    if (panelTitle === 'Free Tier') {
                        loadedCheerio(panel)
                            .find('ul li a')
                            .each(function (_, chapterEle) {
                            var chapterName = loadedCheerio(chapterEle).text().trim();
                            var chapterUrl = loadedCheerio(chapterEle).attr('href');
                            if (chapterUrl) {
                                chapters.push({
                                    name: chapterName,
                                    path: chapterUrl.replace(_this.site, ''),
                                });
                            }
                        });
                    }
                });
                // Parse "List of Chapters"
                if (chapters.length === 0) {
                    loadedCheerio('h2:contains("List of Chapters"), span:contains("List of Chapters")').each(function (_, header) {
                        var chapterList = loadedCheerio(header).next('ul');
                        chapterList.find('li a').each(function (_, chapterEle) {
                            var chapterName = loadedCheerio(chapterEle).text().trim();
                            var chapterUrl = loadedCheerio(chapterEle).attr('href');
                            if (chapterUrl) {
                                chapters.push({
                                    name: chapterName,
                                    path: chapterUrl.replace(_this.site, ''),
                                });
                            }
                        });
                    });
                }
                return [2 /*return*/, chapters.reverse()];
            });
        });
    };
    DreamBigTL.prototype.getNovelStatus = function (novelPath) {
        if (novelPath.includes('completed'))
            return 'Completed';
        return 'Ongoing';
    };
    DreamBigTL.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, chapterTitle, chapterContent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + chapterPath;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        chapterTitle = loadedCheerio('h1.entry-title').text().trim();
                        chapterContent = loadedCheerio('.post-body').html() || '';
                        return [2 /*return*/, "<h1>".concat(chapterTitle, "</h1>").concat(chapterContent)];
                }
            });
        });
    };
    DreamBigTL.prototype.searchNovels = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "search?q=").concat(encodeURIComponent(searchTerm));
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio('.blog-posts.index-post-wrap .blog-post.hentry.index-post').each(function (_, ele) {
                            var novelName = loadedCheerio(ele).find('.entry-title a').text().trim();
                            var novelUrl = loadedCheerio(ele).find('.entry-title a').attr('href');
                            var novelCover = loadedCheerio(ele).find('.entry-image').attr('data-image') || '';
                            if (novelUrl) {
                                novels.push({
                                    name: novelName,
                                    path: novelUrl.replace(_this.site, ''),
                                    cover: novelCover,
                                });
                            }
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return DreamBigTL;
}());
exports.default = new DreamBigTL();
