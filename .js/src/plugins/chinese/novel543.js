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
var defaultCover_1 = require("@libs/defaultCover");
var novelStatus_1 = require("@libs/novelStatus");
var makeAbsolute = function (relativeUrl, baseUrl) {
    if (!relativeUrl)
        return undefined;
    try {
        if (relativeUrl.startsWith('//')) {
            return new URL(baseUrl).protocol + relativeUrl;
        }
        if (relativeUrl.startsWith('http://') ||
            relativeUrl.startsWith('https://')) {
            return relativeUrl;
        }
        return new URL(relativeUrl, baseUrl).href;
    }
    catch (_a) {
        return undefined;
    }
};
var Novel543Plugin = /** @class */ (function () {
    function Novel543Plugin() {
        this.id = 'novel543';
        this.name = 'Novel543';
        this.site = 'https://www.novel543.com/';
        this.version = '1.0.0';
        this.icon = 'src/cn/novel543/icon.png';
        this.imageRequestInit = {
            headers: {
                Referer: this.site,
            },
        };
    }
    Novel543Plugin.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var result, $, _a, novels, processedPaths;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site)];
                    case 1:
                        result = _b.sent();
                        if (!result.ok)
                            return [2 /*return*/, []];
                        _a = cheerio_1.load;
                        return [4 /*yield*/, result.text()];
                    case 2:
                        $ = _a.apply(void 0, [_b.sent()]);
                        novels = [];
                        processedPaths = new Set();
                        $('ul.list > li.media, ul.list li > a[href^="/"][href$="/"]').each(function (_i, el) {
                            var _a, _b, _c, _d, _e;
                            var $el = $(el);
                            var novelPath;
                            var novelName;
                            var novelCover;
                            if ($el.is('li.media')) {
                                var $link = $el.find('.media-content h3 a');
                                novelPath = (_a = $link.attr('href')) === null || _a === void 0 ? void 0 : _a.trim();
                                novelName = $link.text().trim();
                                novelCover = (_b = $el.find('.media-left img').attr('src')) === null || _b === void 0 ? void 0 : _b.trim();
                            }
                            else if ($el.is('a')) {
                                novelPath = (_c = $el.attr('href')) === null || _c === void 0 ? void 0 : _c.trim();
                                novelName =
                                    $el.find('h3, b, span').first().text().trim() ||
                                        $el.parent().find('h3').text().trim() ||
                                        $el.text().trim();
                                novelCover =
                                    ((_d = $el.find('img').attr('src')) === null || _d === void 0 ? void 0 : _d.trim()) ||
                                        ((_e = $el.parent().find('img').attr('src')) === null || _e === void 0 ? void 0 : _e.trim());
                            }
                            if (novelPath &&
                                novelName &&
                                novelPath.match(/^\/\d+\/$/) &&
                                !processedPaths.has(novelPath)) {
                                novels.push({
                                    name: novelName,
                                    path: novelPath,
                                    cover: makeAbsolute(novelCover, _this.site) || defaultCover_1.defaultCover,
                                });
                                processedPaths.add(novelPath);
                            }
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    Novel543Plugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var novelUrl, result, $, _a, $infoSection, $modSection, novel, chapterListPath, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        novelUrl = makeAbsolute(novelPath, this.site);
                        if (!novelUrl)
                            throw new Error('Invalid novel URL');
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(novelUrl)];
                    case 1:
                        result = _c.sent();
                        if (!result.ok)
                            throw new Error('Failed to fetch novel');
                        _a = cheerio_1.load;
                        return [4 /*yield*/, result.text()];
                    case 2:
                        $ = _a.apply(void 0, [_c.sent()]);
                        $infoSection = $('section#detail div.media-content.info');
                        $modSection = $('section#detail div.mod');
                        novel = {
                            path: novelPath,
                            name: $infoSection.find('h1.title').text().trim() || 'Untitled',
                            cover: makeAbsolute($('section#detail div.cover img').attr('src'), this.site) || defaultCover_1.defaultCover,
                            summary: $modSection.find('div.intro').text().trim() || undefined,
                            author: $infoSection.find('p.meta span.author').text().trim() || undefined,
                            genres: $infoSection
                                .find('p.meta a[href*="/bookstack/"]')
                                .map(function (_i, el) { return $(el).text().trim(); })
                                .get()
                                .join(', ') || undefined,
                            status: novelStatus_1.NovelStatus.Unknown,
                            chapters: [],
                        };
                        chapterListPath = $modSection
                            .find('p.action.buttons a.button.is-info[href$="/dir"]')
                            .attr('href') ||
                            $infoSection.find('a.button.is-info[href$="/dir"]').attr('href');
                        if (!chapterListPath) return [3 /*break*/, 4];
                        _b = novel;
                        return [4 /*yield*/, this.parseChapterList(chapterListPath)];
                    case 3:
                        _b.chapters = _c.sent();
                        _c.label = 4;
                    case 4: return [2 /*return*/, novel];
                }
            });
        });
    };
    Novel543Plugin.prototype.parseChapterList = function (chapterListPath) {
        return __awaiter(this, void 0, void 0, function () {
            var chapterListUrl, result, $, _a, chapters, sortButtonText;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        chapterListUrl = makeAbsolute(chapterListPath, this.site);
                        if (!chapterListUrl)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(chapterListUrl)];
                    case 1:
                        result = _b.sent();
                        if (!result.ok)
                            return [2 /*return*/, []];
                        _a = cheerio_1.load;
                        return [4 /*yield*/, result.text()];
                    case 2:
                        $ = _a.apply(void 0, [_b.sent()]);
                        chapters = [];
                        $('div.chaplist ul.all li a').each(function (index, el) {
                            var _a;
                            var $el = $(el);
                            var chapterName = $el.text().trim();
                            var chapterUrl = (_a = $el.attr('href')) === null || _a === void 0 ? void 0 : _a.trim();
                            if (chapterName && chapterUrl) {
                                chapters.push({
                                    name: chapterName,
                                    path: chapterUrl,
                                    chapterNumber: index + 1,
                                });
                            }
                        });
                        sortButtonText = $('div.chaplist .header button.reverse span')
                            .last()
                            .text()
                            .trim();
                        if (sortButtonText === '倒序') {
                            chapters.reverse();
                            chapters.forEach(function (chap, index) { return (chap.chapterNumber = index + 1); });
                        }
                        return [2 /*return*/, chapters];
                }
            });
        });
    };
    Novel543Plugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var chapterUrl, result, $, _a, $content, chapterText;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        chapterUrl = makeAbsolute(chapterPath, this.site);
                        if (!chapterUrl)
                            throw new Error('Invalid chapter URL');
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(chapterUrl)];
                    case 1:
                        result = _b.sent();
                        if (!result.ok)
                            throw new Error('Failed to fetch chapter');
                        _a = cheerio_1.load;
                        return [4 /*yield*/, result.text()];
                    case 2:
                        $ = _a.apply(void 0, [_b.sent()]);
                        $content = $('div.content.py-5');
                        if (!$content.length)
                            return [2 /*return*/, 'Error: Could not find chapter content'];
                        $content
                            .find('script, style, ins, iframe, [class*="ads"], [id*="ads"], [class*="google"], [id*="google"], [class*="recommend"], div[align="center"], p:contains("推薦本書"), a[href*="javascript:"]')
                            .remove();
                        $content.find('p').each(function (_i, el) {
                            var _a;
                            var $p = $(el);
                            var pText = $p.text().trim();
                            if (pText.includes('請記住本站域名') ||
                                pText.includes('手機版閱讀網址') ||
                                pText.includes('novel543') ||
                                pText.includes('稷下書院') ||
                                pText.includes('最快更新') ||
                                pText.includes('最新章節') ||
                                pText.includes('章節報錯') ||
                                pText.match(/app|APP|下載|客户端|关注微信|公众号/i) ||
                                pText.length === 0 ||
                                (((_a = $p
                                    .html()) === null || _a === void 0 ? void 0 : _a.replace(/&nbsp;/g, '').trim()) === '' &&
                                    $p.find('img').length === 0) ||
                                pText.includes('溫馨提示')) {
                                $p.remove();
                            }
                        });
                        $content
                            .contents()
                            .filter(function () {
                            return this.type === 'comment';
                        })
                            .remove();
                        chapterText = $content.html();
                        if (!chapterText)
                            return [2 /*return*/, 'Error: Chapter content was empty'];
                        chapterText = chapterText
                            .replace(/<\s*p[^>]*>/gi, '\n\n')
                            .replace(/<\s*br[^>]*>/gi, '\n');
                        chapterText = (0, cheerio_1.load)("<div>".concat(chapterText, "</div>")).text();
                        return [2 /*return*/, chapterText
                                .replace(/[\t ]+/g, ' ')
                                .replace(/\n{3,}/g, '\n\n')
                                .trim()];
                }
            });
        });
    };
    Novel543Plugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var novelPath, novel, _a, searchUrl, body, result, $_1, pageTitle, error_1, $, novels;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        if (!/^\d+$/.test(searchTerm)) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        novelPath = "/".concat(searchTerm, "/");
                        return [4 /*yield*/, this.parseNovel(novelPath)];
                    case 2:
                        novel = _b.sent();
                        return [2 /*return*/, [
                                {
                                    name: novel.name,
                                    path: novelPath,
                                    cover: novel.cover,
                                },
                            ]];
                    case 3:
                        _a = _b.sent();
                        return [2 /*return*/, []];
                    case 4:
                        searchUrl = "".concat(this.site, "search/").concat(encodeURIComponent(searchTerm));
                        body = '';
                        _b.label = 5;
                    case 5:
                        _b.trys.push([5, 8, , 9]);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(searchUrl)];
                    case 6:
                        result = _b.sent();
                        if (!result.ok) {
                            if (result.status === 403 || result.status === 503) {
                                throw new Error('Cloudflare protection detected (HTTP error). Please try opening the plugin in WebView first to solve the challenge.');
                            }
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, result.text()];
                    case 7:
                        body = _b.sent();
                        $_1 = (0, cheerio_1.load)(body);
                        pageTitle = $_1('title').text().toLowerCase();
                        // Check for various Cloudflare challenge indicators
                        if (pageTitle.includes('attention required') ||
                            pageTitle.includes('just a moment') ||
                            pageTitle.includes('please wait') ||
                            pageTitle.includes('verifying') ||
                            body.includes('Verifying you are human') ||
                            body.includes('cf-browser-verification') ||
                            body.includes('cf_captcha_container')) {
                            throw new Error('Cloudflare protection detected. Please try opening the plugin in WebView first to solve the challenge.');
                        }
                        return [3 /*break*/, 9];
                    case 8:
                        error_1 = _b.sent();
                        if (error_1 instanceof Error) {
                            // If it's already our custom error, re-throw it
                            if (error_1.message.includes('Cloudflare protection detected')) {
                                throw error_1;
                            }
                            // For other errors, throw a generic error
                            throw new Error("Failed to fetch search results: ".concat(error_1.message));
                        }
                        throw error_1;
                    case 9:
                        $ = (0, cheerio_1.load)(body);
                        novels = [];
                        $('div.search-list ul.list > li.media').each(function (_i, el) {
                            var _a, _b;
                            var $el = $(el);
                            var $link = $el.find('.media-content h3 a');
                            var novelPath = (_a = $link.attr('href')) === null || _a === void 0 ? void 0 : _a.trim();
                            var novelName = $link.text().trim();
                            var novelCover = (_b = $el.find('.media-left img').attr('src')) === null || _b === void 0 ? void 0 : _b.trim();
                            if (novelPath && novelName && novelPath.match(/^\/\d+\/$/)) {
                                novels.push({
                                    name: novelName,
                                    path: novelPath,
                                    cover: makeAbsolute(novelCover, _this.site) || defaultCover_1.defaultCover,
                                });
                            }
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return Novel543Plugin;
}());
exports.default = new Novel543Plugin();
