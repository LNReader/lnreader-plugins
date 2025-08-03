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
var fetch_1 = require("@libs/fetch");
var novelStatus_1 = require("@libs/novelStatus");
var cheerio_1 = require("cheerio");
var defaultCover_1 = require("@libs/defaultCover");
var getStandardNovelPath = function (url) {
    if (!url)
        return undefined;
    try {
        var parsedUrl = new URL(url);
        var match = parsedUrl.pathname.match(/^(\/amp)?(\/n\/[^\/]+\/)/);
        return match === null || match === void 0 ? void 0 : match[2];
    }
    catch (error) {
        return undefined;
    }
};
var getChapterFileName = function (url) {
    if (!url)
        return undefined;
    try {
        var parsedUrl = new URL(url);
        var pathParts = parsedUrl.pathname.split('/');
        var fileName = pathParts[pathParts.length - 1];
        if (fileName && /^\d+\.html$/.test(fileName)) {
            return fileName;
        }
        return undefined;
    }
    catch (error) {
        return undefined;
    }
};
var makeAbsolute = function (relativeUrl, baseUrl) {
    if (!relativeUrl)
        return undefined;
    try {
        if (relativeUrl.startsWith('//')) {
            return 'https:' + relativeUrl;
        }
        if (relativeUrl.startsWith('http://') ||
            relativeUrl.startsWith('https://')) {
            return relativeUrl;
        }
        return new URL(relativeUrl, baseUrl).href;
    }
    catch (e) {
        return undefined;
    }
};
var QuanbenPlugin = /** @class */ (function () {
    function QuanbenPlugin() {
        this.id = 'quanben';
        this.name = 'Quanben';
        this.site = 'https://www.quanben.io/';
        this.version = '1.0.0';
        this.icon = 'src/cn/quanben/icon.png';
        this.defaultCover = defaultCover_1.defaultCover;
        this.filters = {};
    }
    QuanbenPlugin.prototype.popularNovels = function (_pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, $, novels, processedAmpPaths;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + 'amp/';
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        if (!result.ok) {
                            throw new Error("[Quanben] Failed to fetch AMP popular novels page: ".concat(url, " - Status: ").concat(result.status));
                        }
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        $ = (0, cheerio_1.load)(body);
                        novels = [];
                        processedAmpPaths = new Set();
                        $('div.box').each(function (_i, box) {
                            var _a, _b;
                            var $box = $(box);
                            // 1. Process the featured novel (div.list2) if it exists
                            var $featured = $box.find('div.list2');
                            if ($featured.length > 0) {
                                var $link = $featured.find('h3 > a');
                                var ampPath = (_a = $link.attr('href')) === null || _a === void 0 ? void 0 : _a.trim();
                                var name_1 = $link.text().trim();
                                var rawCoverSrc = (_b = $featured.find('amp-img').attr('src')) === null || _b === void 0 ? void 0 : _b.trim();
                                var cover = makeAbsolute(rawCoverSrc, _this.site) || _this.defaultCover;
                                if (ampPath && name_1 && !processedAmpPaths.has(ampPath)) {
                                    novels.push({ name: name_1, path: ampPath, cover: cover });
                                    processedAmpPaths.add(ampPath);
                                }
                            }
                            // 2. Process novels in the list (ul.list)
                            $box.find('ul.list li').each(function (_j, listItem) {
                                var _a;
                                var $listItem = $(listItem);
                                var $link = $listItem.find('a');
                                var ampPath = (_a = $link.attr('href')) === null || _a === void 0 ? void 0 : _a.trim();
                                var name = $link.find('span').first().text().trim(); // Name is inside a span within the link
                                if (ampPath && name && !processedAmpPaths.has(ampPath)) {
                                    novels.push({ name: name, path: ampPath, cover: _this.defaultCover }); // Use default cover for list items
                                    processedAmpPaths.add(ampPath);
                                }
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    QuanbenPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var fullNovelUrl, novelPageResult, novelPageHtml, $, $infoBox, $descriptionBox, novel, statusText, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // ** Expects AMP path: /amp/n/novel-name/ **
                        if (!novelPath ||
                            !novelPath.startsWith('/amp/n/') ||
                            !novelPath.endsWith('/')) {
                            throw new Error("[Quanben parseNovel] Invalid novelPath received: \"".concat(novelPath, "\". Expected AMP format: \"/amp/n/novel-name/\""));
                        }
                        fullNovelUrl = makeAbsolute(novelPath, this.site);
                        if (!fullNovelUrl) {
                            throw new Error("[Quanben parseNovel] Could not construct full AMP novel URL from path: ".concat(novelPath));
                        }
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(fullNovelUrl)];
                    case 1:
                        novelPageResult = _b.sent();
                        if (!novelPageResult.ok) {
                            throw new Error("[Quanben parseNovel] Failed to fetch AMP novel page: ".concat(fullNovelUrl, " - Status: ").concat(novelPageResult.status));
                        }
                        return [4 /*yield*/, novelPageResult.text()];
                    case 2:
                        novelPageHtml = _b.sent();
                        $ = (0, cheerio_1.load)(novelPageHtml);
                        $infoBox = $('div.list2');
                        $descriptionBox = $('div.description');
                        novel = {
                            path: novelPath, // Use the input AMP path
                            name: $infoBox.find('h3').text().trim() || // **Use h3 inside list2**
                                $('h1[itemprop="name headline"]').text().trim() || // Fallback H1
                                'Unknown Novel Name',
                            cover: makeAbsolute($infoBox.find('amp-img').attr('src'), this.site) || // **amp-img inside list2**
                                this.defaultCover,
                            summary: $descriptionBox.find('p').text().trim() || // **Use p inside div.description**
                                $descriptionBox.text().trim() || // Fallback to div.description text
                                undefined,
                            // Use :contains() for more robust selection within the info box
                            author: $infoBox.find("p:contains('作者:') span").text().trim() || undefined,
                            status: novelStatus_1.NovelStatus.Unknown, // Parsed below
                            genres: $infoBox.find("p:contains('类别:') span").text().trim() || undefined,
                            chapters: [], // Parsed below
                        };
                        statusText = $infoBox.find("p:contains('状态:') span").text().trim() || // Try specific span first
                            $infoBox.text();
                        if (statusText.includes('完结') || statusText.includes('已完成')) {
                            novel.status = novelStatus_1.NovelStatus.Completed;
                        }
                        else if (statusText.includes('连载中') || statusText.includes('进行中')) {
                            novel.status = novelStatus_1.NovelStatus.Ongoing;
                        }
                        // 3. Fetch and Parse Chapter List
                        _a = novel;
                        return [4 /*yield*/, this.parseChapterList(novelPath)];
                    case 3:
                        // 3. Fetch and Parse Chapter List
                        _a.chapters = _b.sent();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    // Separate function to handle chapter list parsing - **Using AMP**
    QuanbenPlugin.prototype.parseChapterList = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var ampChapterListUrl, chapterListResult, chapterListHtml, $, chapters, standardNovelPathMatch, novelNameOnly, chapterMap, uniqueChapters;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // ** Expects AMP path: /amp/n/novel-name/ **
                        if (!novelPath ||
                            !novelPath.startsWith('/amp/n/') ||
                            !novelPath.endsWith('/')) {
                            return [2 /*return*/, []];
                        }
                        ampChapterListUrl = makeAbsolute(novelPath + 'list.html', this.site);
                        if (!ampChapterListUrl) {
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(ampChapterListUrl)];
                    case 1:
                        chapterListResult = _a.sent();
                        if (!chapterListResult.ok) {
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, chapterListResult.text()];
                    case 2:
                        chapterListHtml = _a.sent();
                        $ = (0, cheerio_1.load)(chapterListHtml);
                        chapters = [];
                        standardNovelPathMatch = novelPath.match(/(\/n\/[^\/]+\/)/);
                        if (!standardNovelPathMatch || !standardNovelPathMatch[1]) {
                            return [2 /*return*/, []];
                        }
                        novelNameOnly = standardNovelPathMatch[1].replace(/^\/n\/|\/$/g, '');
                        // 1. Parse chapters from ALL list3 uls in the AMP HTML
                        $('ul.list3 li a').each(function (_i, el) {
                            var $el = $(el);
                            var chapterName = $el.text().trim();
                            var chapterHref = $el.attr('href');
                            if (chapterName && chapterHref) {
                                // URLs in AMP page usually point to the standard chapter URLs
                                var absoluteUrl = makeAbsolute(chapterHref, _this.site); // Use base site URL
                                var chapterFileName = getChapterFileName(absoluteUrl);
                                if (chapterFileName) {
                                    // ** Store chapter path in standard format for parseChapter **
                                    var chapterPathForStorage = novelNameOnly + '/' + chapterFileName;
                                    chapters.push({
                                        name: chapterName,
                                        path: chapterPathForStorage,
                                        // chapterNumber assigned later
                                    });
                                }
                            }
                        });
                        chapterMap = new Map();
                        chapters.forEach(function (chapter) {
                            if (!chapterMap.has(chapter.path)) {
                                chapterMap.set(chapter.path, chapter);
                            }
                        });
                        uniqueChapters = Array.from(chapterMap.values());
                        // 3. Sort chapters numerically based on filename
                        uniqueChapters.sort(function (a, b) {
                            var _a, _b;
                            var numA = parseInt(((_a = a.path.match(/(\d+)\.html$/)) === null || _a === void 0 ? void 0 : _a[1]) || '0', 10);
                            var numB = parseInt(((_b = b.path.match(/(\d+)\.html$/)) === null || _b === void 0 ? void 0 : _b[1]) || '0', 10);
                            return numA - numB;
                        });
                        // 4. Assign chapter numbers
                        return [2 /*return*/, uniqueChapters.map(function (chapter, index) { return (__assign(__assign({}, chapter), { chapterNumber: index + 1 })); })];
                }
            });
        });
    };
    QuanbenPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var chapterUrl, result, redirectUrl, absoluteRedirectUrl, redirectResult, _a, body;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // ** Expects standard path: novel-name/chapterFileName.html **
                        if (!chapterPath ||
                            !chapterPath.includes('/') ||
                            chapterPath.endsWith('/')) {
                            throw new Error("[Quanben] Invalid chapterPath format received in parseChapter: \"".concat(chapterPath, "\". Expected format: \"novel-name/chapterFileName.html\""));
                        }
                        chapterUrl = "".concat(this.site, "n/").concat(chapterPath);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(chapterUrl)];
                    case 1:
                        result = _b.sent();
                        if (!!result.ok) return [3 /*break*/, 5];
                        if (!(result.status >= 300 && result.status < 400)) return [3 /*break*/, 4];
                        redirectUrl = result.headers.get('Location');
                        if (!redirectUrl) return [3 /*break*/, 4];
                        absoluteRedirectUrl = makeAbsolute(redirectUrl, chapterUrl);
                        if (!absoluteRedirectUrl) {
                            throw new Error("[Quanben] Failed to make redirected URL absolute: ".concat(redirectUrl));
                        }
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(absoluteRedirectUrl)];
                    case 2:
                        redirectResult = _b.sent();
                        if (!redirectResult.ok) {
                            throw new Error("[Quanben] Failed to fetch redirected chapter content: ".concat(absoluteRedirectUrl, " - Status: ").concat(redirectResult.status));
                        }
                        _a = this.extractChapterContent;
                        return [4 /*yield*/, redirectResult.text()];
                    case 3: return [2 /*return*/, _a.apply(this, [_b.sent(), absoluteRedirectUrl])];
                    case 4: throw new Error("[Quanben] Failed to fetch chapter content: ".concat(chapterUrl, " - Status: ").concat(result.status));
                    case 5: return [4 /*yield*/, result.text()];
                    case 6:
                        body = _b.sent();
                        return [2 /*return*/, this.extractChapterContent(body, chapterUrl)];
                }
            });
        });
    };
    // Helper function to extract and clean chapter content from HTML body
    QuanbenPlugin.prototype.extractChapterContent = function (body, urlForLog) {
        var $ = (0, cheerio_1.load)(body);
        var $content = $('#contentbody');
        if (!$content.length) {
            $content = $('#content');
        }
        if (!$content.length) {
            $content = $('.content');
        }
        if (!$content.length) {
            return 'Error: Could not find chapter content container.';
        }
        $content
            .find('script, style, ins, iframe, [class*="ads"], [id*="ads"], [class*="google"], [id*="google"], [class*="recommend"], div[align="center"]')
            .remove();
        $content.find('p').each(function (_i, el) {
            var _a;
            var $p = $(el);
            var pText = $p.text().trim();
            if (pText.includes('请记住本书首发域名') ||
                pText.includes('手机版阅读网址') ||
                pText.includes('quanben') ||
                pText.includes('最新网址') ||
                pText.includes('章节报错') ||
                pText.match(/app|APP|下载|客户端/) ||
                pText.length === 0 ||
                (((_a = $p
                    .html()) === null || _a === void 0 ? void 0 : _a.replace(/&nbsp;/g, '').trim()) === '' &&
                    $p.find('img').length === 0)) {
                $p.remove();
            }
        });
        $content
            .contents()
            .filter(function () {
            return this.type === 'comment';
        })
            .remove();
        var chapterText = $content.html();
        if (!chapterText) {
            return 'Error: Chapter content was empty after cleaning.';
        }
        chapterText = chapterText.replace(/<\s*p[^>]*>/gi, '\n\n');
        chapterText = chapterText.replace(/<\s*br[^>]*>/gi, '\n');
        chapterText = chapterText.replace(/<[^>]+>/g, '');
        chapterText = (0, cheerio_1.load)("<div>".concat(chapterText, "</div>")).text();
        chapterText = chapterText.replace(/[\t ]+/g, ' ');
        chapterText = chapterText.replace(/\n{3,}/g, '\n\n');
        chapterText = chapterText.trim();
        return chapterText;
    };
    QuanbenPlugin.prototype.searchNovels = function (searchTerm, _pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var searchUrl, result, body, $, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchUrl = "".concat(this.site, "index.php?c=book&a=search&keywords=").concat(encodeURIComponent(searchTerm));
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(searchUrl)];
                    case 1:
                        result = _a.sent();
                        if (!result.ok) {
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        $ = (0, cheerio_1.load)(body);
                        novels = [];
                        $('div.list2').each(function (_i, element) {
                            var $el = $(element);
                            var nameLink = $el.find('h3 > a').first();
                            var img = $el.find('img').first();
                            var novelName = nameLink.text().trim();
                            var novelHref = nameLink.attr('href');
                            var novelCover = img.attr('src') || img.attr('data-src');
                            if (novelHref && novelName) {
                                var absoluteUrl = makeAbsolute(novelHref, _this.site);
                                var standardPath = getStandardNovelPath(absoluteUrl);
                                if (standardPath) {
                                    // **Construct AMP Path for storage**
                                    var ampPath = '/amp' + standardPath;
                                    var absoluteCover = makeAbsolute(novelCover, _this.site);
                                    novels.push({
                                        name: novelName,
                                        path: ampPath, // **Store the AMP path**
                                        cover: absoluteCover || _this.defaultCover,
                                    });
                                }
                            }
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    // Use fetchApi for fetchImage as it handles potential errors and returns Response
    QuanbenPlugin.prototype.fetchImage = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, fetch_1.fetchApi)(url)];
            });
        });
    };
    return QuanbenPlugin;
}());
exports.default = new QuanbenPlugin();
