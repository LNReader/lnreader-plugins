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
var defaultCover_1 = require("@libs/defaultCover");
var BlogDoAnonNovelsPlugin = /** @class */ (function () {
    function BlogDoAnonNovelsPlugin() {
        this.id = 'blogdoamonnovels';
        this.name = 'Blog do Amon Novels';
        this.version = '1.0.0';
        this.icon = 'src/pt-br/blogdoamonnovels/icon.png';
        this.site = 'https://www.blogdoamonnovels.com';
        this.filters = {};
    }
    BlogDoAnonNovelsPlugin.prototype.parseNovels = function (json) {
        var _this = this;
        var novels = [];
        var result = JSON.parse(json);
        if (!('entry' in result.feed)) {
            return novels;
        }
        result.feed.entry.forEach(function (n) {
            var novelName = n.title.$t;
            var novelUrl = n.link.find(function (t) { return 'alternate' == t.rel; }).href;
            if (!novelUrl)
                return;
            var coverUrl = n.media$thumbnail.url.replace('/s72-c/', '/w340/');
            var novel = {
                name: novelName,
                cover: coverUrl || defaultCover_1.defaultCover,
                path: novelUrl.replace(_this.site, ''),
            };
            novels.push(novel);
        });
        return novels;
    };
    BlogDoAnonNovelsPlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var body, loadedCheerio, novels;
            var _this = this;
            var showLatestNovels = _b.showLatestNovels;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (showLatestNovels) {
                            return [2 /*return*/, this.searchNovels('', pageNo)];
                        }
                        if (pageNo > 1) {
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site).then(function (result) { return result.text(); })];
                    case 1:
                        body = _c.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio('.PopularPosts article').each(function (idx, ele) {
                            var novelName = loadedCheerio(ele).find('h3 a').text().trim();
                            var novelUrl = loadedCheerio(ele).find('h3 a').attr('href');
                            var coverUrl = loadedCheerio(ele).find('img').attr('src');
                            if (!novelUrl)
                                return;
                            var novel = {
                                name: novelName,
                                cover: coverUrl || defaultCover_1.defaultCover,
                                path: novelUrl.replace(_this.site, ''),
                            };
                            novels.push(novel);
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    BlogDoAnonNovelsPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, novel, cat, chapters_1, $summary, maxResults, startIndex, length, chapters, jsonUrl, bodyResponse, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('[itemprop="name"]').text() || 'Untitled',
                            cover: loadedCheerio('img[itemprop="image"]').attr('src'),
                            summary: loadedCheerio('#synopsis')
                                .find('br')
                                .replaceWith('\n')
                                .end()
                                .text()
                                .trim(),
                            chapters: [],
                        };
                        novel.author = loadedCheerio('#extra-info dl:contains("Autor") dd')
                            .text()
                            .trim();
                        novel.artist = loadedCheerio('#extra-info dl:contains("Artista") dd')
                            .text()
                            .trim();
                        novel.status = loadedCheerio('[data-status]').text().trim();
                        novel.genres = loadedCheerio('dt:contains("Gênero:")')
                            .parent()
                            .find('a')
                            .map(function (_, ex) { return loadedCheerio(ex).text().trim(); })
                            .toArray()
                            .join(',');
                        cat = loadedCheerio('#clwd').text().split("'")[1];
                        if (!cat) {
                            chapters_1 = [];
                            loadedCheerio('#chapters chapter').each(function (idx, ele) {
                                var chapterName = loadedCheerio(ele).find('a').text().trim();
                                var chapterUrl = loadedCheerio(ele).find('a').attr('href');
                                if (!chapterUrl)
                                    return;
                                chapters_1.push({
                                    name: chapterName,
                                    path: chapterUrl.replace(_this.site, ''),
                                });
                            });
                            novel.chapters = chapters_1.reverse().map(function (c, i) { return (__assign(__assign({}, c), { name: c.name + " - Ch. ".concat(i + 1), chapterNumber: i + 1 })); });
                            if (!novel.summary) {
                                $summary = loadedCheerio('#chapters');
                                $summary.find('h3').remove();
                                $summary.find('div.flex').remove();
                                $summary.find('div.separator').remove();
                                $summary.find('#custom-hero').remove();
                                $summary.find('[id=listItem]').remove();
                                novel.summary = $summary.text().trim();
                            }
                            return [2 /*return*/, novel];
                        }
                        maxResults = 150;
                        startIndex = 1;
                        length = 0;
                        chapters = [];
                        _a.label = 2;
                    case 2:
                        jsonUrl = "".concat(this.site, "/feeds/posts/default/-/").concat(cat, "?alt=json&start-index=").concat(startIndex, "&max-results=").concat(maxResults);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(jsonUrl).then(function (result) {
                                return result.text();
                            })];
                    case 3:
                        bodyResponse = _a.sent();
                        result = JSON.parse(bodyResponse);
                        if (!('entry' in result.feed)) {
                            return [3 /*break*/, 5];
                        }
                        result.feed.entry.forEach(function (n) {
                            var chapterName = n.title.$t;
                            // Skip self
                            if (chapterName === novel.name) {
                                return;
                            }
                            // const chapterNumber: number = parseFloat(chapterName.split(' ', 2)[1]);
                            var chapterUrl = n.link.find(function (t) { return 'alternate' == t.rel; }).href;
                            var releaseTime = new Date(n.updated.$t);
                            if (!chapterUrl)
                                return;
                            if (n.content && n.content.$t) {
                                try {
                                    var dom = (0, cheerio_1.load)(n.content.$t);
                                    chapterName = dom('.conteudo_teste center h1').text().trim();
                                }
                                catch (error) {
                                    /* empty */
                                }
                            }
                            chapters.push({
                                name: chapterName,
                                path: chapterUrl.replace(_this.site, ''),
                                releaseTime: releaseTime.toISOString(),
                                // chapterNumber: chapterNumber,
                            });
                        });
                        length = result.feed.entry.length;
                        startIndex += maxResults;
                        _a.label = 4;
                    case 4:
                        if (length >= maxResults) return [3 /*break*/, 2];
                        _a.label = 5;
                    case 5:
                        novel.chapters = chapters.reverse().map(function (c, i) { return (__assign(__assign({}, c), { name: c.name + " - Ch. ".concat(i + 1), chapterNumber: i + 1 })); });
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    BlogDoAnonNovelsPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var params, maxResults, jsonUrl, json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams();
                        maxResults = 10;
                        params.append('alt', 'json');
                        if (pageNo > 1) {
                            params.append('start-index', "".concat((pageNo - 1) * maxResults + 1));
                        }
                        params.append('max-results', "".concat(maxResults));
                        params.append('q', "label:Series ".concat(searchTerm).trim());
                        jsonUrl = "".concat(this.site, "/feeds/posts/summary?") + params.toString();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(jsonUrl).then(function (result) { return result.text(); })];
                    case 1:
                        json = _a.sent();
                        return [2 /*return*/, this.parseNovels(json)];
                }
            });
        });
    };
    BlogDoAnonNovelsPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, $readerarea;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        $readerarea = loadedCheerio('.conteudo_teste');
                        // Remove empty paragraphs
                        $readerarea.find('p').each(function (i, el) {
                            var _a, _b;
                            var $this = loadedCheerio(el);
                            var $imgs = $this.find('img');
                            var cleanContent = (_b = (_a = $this
                                .text()) === null || _a === void 0 ? void 0 : _a.replace(/\s|&nbsp;/g, '')) === null || _b === void 0 ? void 0 : _b.replace(_this.site, '');
                            // Without images and empty content
                            if (($imgs === null || $imgs === void 0 ? void 0 : $imgs.length) === 0 && (cleanContent === null || cleanContent === void 0 ? void 0 : cleanContent.length) === 0) {
                                $this.remove();
                            }
                        });
                        return [2 /*return*/, $readerarea.html() || ''];
                }
            });
        });
    };
    return BlogDoAnonNovelsPlugin;
}());
exports.default = new BlogDoAnonNovelsPlugin();
