"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var novelStatus_1 = require("@libs/novelStatus");
var Shu69 = /** @class */ (function () {
    function Shu69() {
        this.fetchOptions = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,us;q=0.5',
                'Referer': 'https://www.69shu.xyz/', // Referer
                'DNT': '1', // Do Not Track
                'Upgrade-Insecure-Requests': '1', // Upgrade-Insecure-Requests
            },
        };
        this.id = '69shu';
        this.name = '69书吧';
        this.icon = 'src/cn/69shu/icon.png';
        this.site = 'https://www.69shu.xyz';
        this.version = '0.2.2';
        this.filters = {
            rank: {
                label: '排行榜',
                value: 'allvisit',
                options: [
                    { label: '总排行榜', value: 'allvisit' },
                    { label: '月排行榜', value: 'monthvisit' },
                    { label: '周排行榜', value: 'weekvisit' },
                    { label: '日排行榜', value: 'dayvisit' },
                    { label: '收藏榜', value: 'goodnum' },
                    { label: '字数榜', value: 'words' },
                    { label: '推荐榜', value: 'allvote' },
                    { label: '新书榜', value: 'postdate' },
                    { label: '更新榜', value: 'lastupdate' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            sort: {
                label: '分类',
                value: 'none',
                options: [
                    { label: '无', value: 'none' },
                    { label: '全部', value: 'all' },
                    { label: '玄幻', value: 'xuanhuan' },
                    { label: '仙侠', value: 'xianxia' },
                    { label: '都市', value: 'dushi' },
                    { label: '历史', value: 'lishi' },
                    { label: '游戏', value: 'youxi' },
                    { label: '科幻', value: 'kehuan' },
                    { label: '灵异', value: 'kongbu' },
                    { label: '言情', value: 'nvsheng' },
                    { label: '其它', value: 'qita' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    Shu69.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var url, body, loadedCheerio, novels;
            var _this = this;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (showLatestNovels) {
                            url = "".concat(this.site, "/rank/lastupdate/").concat(pageNo, ".html");
                        }
                        else if (filters.sort.value === 'none') {
                            url = "".concat(this.site, "/rank/").concat(filters.rank.value, "/").concat(pageNo, ".html");
                        }
                        else {
                            url = "".concat(this.site, "/sort/").concat(filters.sort.value, "/").concat(pageNo, ".html");
                        }
                        return [4 /*yield*/, (0, fetch_1.fetchText)(url, this.fetchOptions)];
                    case 1:
                        body = _c.sent();
                        if (body === '')
                            throw Error('无法获取小说列表，请检查网络');
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio('div.book-coverlist').each(function (i, el) {
                            var url = loadedCheerio(el).find('a.cover').attr('href');
                            var novelName = loadedCheerio(el).find('h4.name').text().trim();
                            var novelCover = loadedCheerio(el).find('a.cover > img').attr('src');
                            if (!url)
                                return;
                            var novel = {
                                name: novelName,
                                cover: novelCover,
                                path: url.replace(_this.site, ''),
                            };
                            novels.push(novel);
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    Shu69.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, body, loadedCheerio, novel, bookInfo, chapters, allUrl, currentChaptersUrl, hasMorePages, _loop_1, this_1, uniqueChapters;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + novelPath;
                        return [4 /*yield*/, (0, fetch_1.fetchText)(url, this.fetchOptions)];
                    case 1:
                        body = _a.sent();
                        if (body === '')
                            throw Error('无法获取小说内容，请检查网络');
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelPath,
                            chapters: [],
                            name: loadedCheerio('h1').text().trim(),
                        };
                        novel.cover = loadedCheerio('div.cover > img').attr('src');
                        novel.summary = loadedCheerio('#bookIntro').text().trim();
                        bookInfo = loadedCheerio('div.caption-bookinfo > p');
                        novel.author = bookInfo.find('a').attr('title');
                        novel.artist = undefined;
                        novel.status = bookInfo.text().includes('连载')
                            ? novelStatus_1.NovelStatus.Ongoing
                            : novelStatus_1.NovelStatus.Completed;
                        novel.genres = '';
                        chapters = [];
                        allUrl = loadedCheerio('dd.all > a').attr('href');
                        if (!allUrl) return [3 /*break*/, 5];
                        currentChaptersUrl = new URL(allUrl, this.site).toString();
                        hasMorePages = true;
                        _loop_1 = function () {
                            var chaptersBody, chaptersLoadedCheerio, nextPageLinkElement, nextPageLink, absoluteNextPageUrl;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, (0, fetch_1.fetchText)(currentChaptersUrl, this_1.fetchOptions)];
                                    case 1:
                                        chaptersBody = _b.sent();
                                        chaptersLoadedCheerio = (0, cheerio_1.load)(chaptersBody);
                                        // Extract chapters from the current page
                                        chaptersLoadedCheerio('dl.panel-chapterlist dd').each(function (i, el) {
                                            var chapterUrl = chaptersLoadedCheerio(el).find('a').attr('href');
                                            var chapterName = chaptersLoadedCheerio(el).find('a').text().trim();
                                            if (chapterUrl) {
                                                // Ensure relative path, handle both absolute/relative cases
                                                var relativeChapterUrl_1 = chapterUrl.startsWith('http')
                                                    ? chapterUrl.replace(_this.site, '')
                                                    : chapterUrl;
                                                // Avoid duplicates if the same chapter appears on multiple pages (unlikely but safe)
                                                if (!chapters.some(function (chap) { return chap.path === relativeChapterUrl_1; })) {
                                                    chapters.push({
                                                        name: chapterName,
                                                        path: relativeChapterUrl_1,
                                                    });
                                                }
                                            }
                                        });
                                        nextPageLinkElement = chaptersLoadedCheerio('div.listpage a.onclick').filter(function (i, el) {
                                            return chaptersLoadedCheerio(el).text().includes('下一页');
                                        });
                                        nextPageLink = nextPageLinkElement.attr('href');
                                        if (nextPageLink && nextPageLink !== 'javascript:void(0);') {
                                            // Check if it's a valid relative or absolute URL before creating the URL object
                                            try {
                                                absoluteNextPageUrl = new URL(nextPageLink, this_1.site).toString();
                                                if (absoluteNextPageUrl === currentChaptersUrl) {
                                                    // Break if the next page URL is the same as the current one (prevents infinite loops)
                                                    hasMorePages = false;
                                                }
                                                else {
                                                    currentChaptersUrl = absoluteNextPageUrl;
                                                }
                                            }
                                            catch (e) {
                                                // Handle cases where the link might be invalid or unexpected
                                                console.warn("Invalid next page link found: ".concat(nextPageLink));
                                                hasMorePages = false;
                                            }
                                        }
                                        else {
                                            hasMorePages = false;
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _a.label = 2;
                    case 2:
                        if (!hasMorePages) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        // Fallback if no "all chapters" link is found
                        loadedCheerio('div.panel.hidden-xs > dl.panel-chapterlist:nth-child(2) > dd').each(function (i, el) {
                            var chapterUrl = loadedCheerio(el).find('a').attr('href');
                            var chapterName = loadedCheerio(el).find('a').text().trim();
                            if (chapterUrl) {
                                var relativeChapterUrl = chapterUrl.startsWith('http')
                                    ? chapterUrl.replace(_this.site, '')
                                    : chapterUrl;
                                chapters.push({
                                    name: chapterName,
                                    path: relativeChapterUrl,
                                });
                            }
                        });
                        _a.label = 6;
                    case 6:
                        uniqueChapters = chapters.filter(function (chapter, index, self) {
                            return index === self.findIndex(function (c) { return c.path === chapter.path; });
                        });
                        novel.chapters = uniqueChapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    Shu69.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var chapterUrl, body, loadedCheerio, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chapterUrl = new URL(chapterPath, this.site).toString();
                        return [4 /*yield*/, (0, fetch_1.fetchText)(chapterUrl, this.fetchOptions)];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        chapterText = loadedCheerio('#chaptercontent p')
                            .map(function (i, el) { return loadedCheerio(el).text(); })
                            .get()
                            // remove empty lines and 69shu ads
                            .map(function (line) { return line.trim(); })
                            .filter(function (line) { return line !== '' && !line.includes('69书吧'); })
                            .map(function (line) { return "<p>".concat(line, "</p>"); })
                            .join('\n');
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    Shu69.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var searchUrl, formData, searchOptions, body, loadedCheerio, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        searchUrl = "".concat(this.site, "/search");
                        formData = new FormData();
                        formData.append('searchkey', searchTerm);
                        searchOptions = __assign(__assign({}, this.fetchOptions), { method: 'post', body: formData, headers: __assign({}, this.fetchOptions.headers) });
                        return [4 /*yield*/, (0, fetch_1.fetchText)(searchUrl, searchOptions)];
                    case 1:
                        body = _a.sent();
                        if (body === '')
                            throw Error('无法获取搜索结果，请检查网络');
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio('div.book-coverlist').each(function (i, el) {
                            var url = loadedCheerio(el).find('a.cover').attr('href');
                            var novelName = loadedCheerio(el).find('h4.name').text().trim();
                            var novelCover = loadedCheerio(el).find('a.cover > img').attr('src');
                            if (!url)
                                return;
                            var novel = {
                                name: novelName,
                                cover: novelCover,
                                path: url.replace(_this.site, ''),
                            };
                            novels.push(novel);
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return Shu69;
}());
exports.default = new Shu69();
