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
var NovelHall = /** @class */ (function () {
    function NovelHall() {
        this.id = 'novelhall';
        this.name = 'Novel Hall';
        this.version = '1.0.2';
        this.icon = 'src/en/novelhall/icon.png';
        this.site = 'https://novelhall.com/';
    }
    NovelHall.prototype.popularNovels = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var url, body, loadedCheerio, novels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "all2022-").concat(page, ".html");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio('li.btm').each(function (idx, ele) {
                            var novelName = loadedCheerio(ele).text().trim();
                            var novelUrl = loadedCheerio(ele).find('a').attr('href');
                            if (!novelUrl)
                                return;
                            var novel = {
                                name: novelName,
                                cover: defaultCover_1.defaultCover,
                                path: novelUrl,
                            };
                            novels.push(novel);
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    NovelHall.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, novel, chapter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('.book-info > h1').text() || 'Untitled',
                            cover: loadedCheerio('meta[property="og:image"]').attr('content'),
                            summary: loadedCheerio('.intro').text().trim(),
                            chapters: [],
                        };
                        loadedCheerio('.total').find('p').remove();
                        novel.author = loadedCheerio('.total span:contains("Author")')
                            .text()
                            .replace('Author：', '')
                            .trim();
                        novel.status = loadedCheerio('.total span:contains("Status")')
                            .text()
                            .replace('Status：', '')
                            .replace('Active', 'Ongoing')
                            .trim();
                        novel.genres = loadedCheerio('.total a')
                            .map(function (a, ex) { return loadedCheerio(ex).text(); })
                            .toArray()
                            .join(',');
                        chapter = [];
                        loadedCheerio('#morelist ul > li').each(function (idx, ele) {
                            var chapterName = loadedCheerio(ele).find('a').text().trim();
                            var chapterUrl = loadedCheerio(ele).find('a').attr('href');
                            if (!chapterUrl)
                                return;
                            chapter.push({
                                name: chapterName,
                                path: chapterUrl,
                            });
                        });
                        novel.chapters = chapter;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    NovelHall.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        chapterText = loadedCheerio('.content').html() || '';
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    NovelHall.prototype.searchNovels = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var url, body, loadedCheerio, novels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "index.php?s=so&module=book&keyword=").concat(encodeURIComponent(searchTerm));
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio('table tr').each(function (idx, ele) {
                            var novelName = loadedCheerio(ele)
                                .find('td:nth-child(2)')
                                .text()
                                .replace(/\t+/g, '')
                                .replace(/\n/g, ' ');
                            var novelUrl = loadedCheerio(ele)
                                .find('td:nth-child(2) a')
                                .attr('href');
                            if (!novelUrl)
                                return;
                            var novel = {
                                name: novelName,
                                cover: defaultCover_1.defaultCover,
                                path: novelUrl,
                            };
                            novels.push(novel);
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return NovelHall;
}());
exports.default = new NovelHall();
