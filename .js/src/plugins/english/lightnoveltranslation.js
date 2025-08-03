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
var LNTPlugin = /** @class */ (function () {
    function LNTPlugin() {
        var _this = this;
        this.id = 'lightnoveltranslations';
        this.name = 'Light Novel Translations';
        this.icon = 'src/en/lightnoveltranslations/icon.png';
        this.site = 'https://lightnovelstranslations.com/';
        this.version = '1.0.0';
        this.filters = undefined;
        this.imageRequestInit = undefined;
        this.resolveUrl = function (path, isNovel) {
            return _this.site + (isNovel ? '/book/' : '/chapter/') + path;
        };
    }
    LNTPlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var link, body, html, loadedCheerio, baseUrl, novels;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        link = this.site + 'read/';
                        link += "page/".concat(pageNo);
                        link += "?sortby=".concat(showLatestNovels ? 'most-recent' : 'most-liked');
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(link)];
                    case 1:
                        body = _c.sent();
                        return [4 /*yield*/, body.text()];
                    case 2:
                        html = _c.sent();
                        loadedCheerio = (0, cheerio_1.load)(html);
                        baseUrl = this.site;
                        novels = [];
                        loadedCheerio('div.read_list-story-item').each(function (i, el) {
                            var tempNovel = {};
                            var img = loadedCheerio(el)
                                .find('.item_thumb')
                                .find('img')
                                .first()
                                .attr('src');
                            var path = loadedCheerio(el)
                                .find('.item_thumb')
                                .find('a')
                                .first()
                                .attr('href');
                            path = path ? path.slice(baseUrl.length) : '';
                            var title = loadedCheerio(el)
                                .find('.item_thumb')
                                .find('a')
                                .first()
                                .attr('title');
                            tempNovel.name = title ? title : '';
                            tempNovel.path = path;
                            tempNovel.cover = img;
                            novels.push(tempNovel);
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    LNTPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, body, html, novel, loadedCheerio, body2, html2, loadedCheerio2, baseUrl, chapters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + novelPath;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        body = _a.sent();
                        return [4 /*yield*/, body.text().then(function (r) { return r.replace(/>\s+</g, '><'); })];
                    case 2:
                        html = _a.sent();
                        novel = {
                            path: novelPath,
                            name: '',
                            totalPages: 1,
                            summary: '',
                            author: '',
                            status: '',
                            chapters: [],
                        };
                        loadedCheerio = (0, cheerio_1.load)(html);
                        novel.cover = loadedCheerio('div.novel-image').find('img').attr('src');
                        novel.status = loadedCheerio('div.novel_status').text().trim();
                        switch (novel.status) {
                            case 'Ongoing':
                                novel.status = novelStatus_1.NovelStatus.Ongoing;
                                break;
                            case 'Hiatus':
                                novel.status = novelStatus_1.NovelStatus.OnHiatus;
                                break;
                            case 'Completed':
                                novel.status = novelStatus_1.NovelStatus.Completed;
                                break;
                            default:
                                novel.status = novelStatus_1.NovelStatus.Unknown;
                        }
                        novel.name = loadedCheerio('div.novel_title')
                            .find('h3')
                            .first()
                            .text()
                            .trim();
                        novel.author = loadedCheerio('div.novel_detail_info')
                            .find('li')
                            .filter(function () {
                            return loadedCheerio(this).text().includes('Author');
                        })
                            .first()
                            .text()
                            .trim();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url.replace('?tab=table_contents', ''))];
                    case 3:
                        body2 = _a.sent();
                        return [4 /*yield*/, body2.text().then(function (r) { return r.replace(/>\s+</g, '><'); })];
                    case 4:
                        html2 = _a.sent();
                        loadedCheerio2 = (0, cheerio_1.load)(html2);
                        novel.summary = loadedCheerio2('div.novel_text')
                            .find('p')
                            .first()
                            .text()
                            .trim();
                        baseUrl = this.site;
                        chapters = [];
                        loadedCheerio('li.chapter-item.unlock').each(function (i, el) {
                            var chapterName = loadedCheerio(el).find('a').text().trim();
                            var chapterPath = loadedCheerio(el).find('a').attr('href');
                            if (chapterPath) {
                                var chapter = {
                                    name: chapterName,
                                    path: chapterPath.slice(baseUrl.length),
                                };
                                chapters.push(chapter);
                            }
                        });
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    LNTPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, html, loadedCheerio, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath)];
                    case 1:
                        body = _a.sent();
                        return [4 /*yield*/, body.text().then(function (r) { return r.replace(/>\s+</g, '><'); })];
                    case 2:
                        html = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(html);
                        chapterText = loadedCheerio('div.text_story');
                        chapterText.find('div.ads_content').remove();
                        return [2 /*return*/, chapterText.html() || ''];
                }
            });
        });
    };
    LNTPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var searchUrl, formData, results, body, loadedCheerio, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // get novels using the search term
                        if (pageNo !== 1)
                            return [2 /*return*/, []];
                        searchUrl = this.site + '/read';
                        formData = new FormData();
                        formData.append('field-search', searchTerm);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(searchUrl, {
                                method: 'POST',
                                body: formData,
                            })];
                    case 1:
                        results = _a.sent();
                        return [4 /*yield*/, results.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio('div.read_list-story-item').each(function (i, el) {
                            var tempNovel = {};
                            var img = loadedCheerio(el)
                                .find('.item_thumb')
                                .find('img')
                                .first()
                                .attr('src');
                            var path = loadedCheerio(el)
                                .find('.item_thumb')
                                .find('a')
                                .first()
                                .attr('href');
                            path = path ? path.slice(_this.site.length) : '';
                            var title = loadedCheerio(el)
                                .find('.item_thumb')
                                .find('a')
                                .first()
                                .attr('title');
                            tempNovel.name = title ? title : '';
                            tempNovel.path = path;
                            tempNovel.cover = img;
                            novels.push(tempNovel);
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return LNTPlugin;
}());
exports.default = new LNTPlugin();
