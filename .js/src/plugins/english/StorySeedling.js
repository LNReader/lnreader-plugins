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
var StorySeedlingPlugin = /** @class */ (function () {
    function StorySeedlingPlugin() {
        this.id = 'storyseedling';
        this.name = 'StorySeedling';
        this.icon = 'src/en/storyseedling/icon.png';
        this.site = 'https://storyseedling.com/';
        this.version = '1.0.3';
    }
    StorySeedlingPlugin.prototype.getCheerio = function (url, search) {
        return __awaiter(this, void 0, void 0, function () {
            var r, $, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        r = _b.sent();
                        if (!r.ok && search != true)
                            throw new Error('Could not reach site (' + r.status + ') try to open in webview.');
                        _a = cheerio_1.load;
                        return [4 /*yield*/, r.text()];
                    case 2:
                        $ = _a.apply(void 0, [_b.sent()]);
                        return [2 /*return*/, $];
                }
            });
        });
    };
    StorySeedlingPlugin.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var novels, body, loadedCheerio, postValue, data, response;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        novels = [];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + 'browse').then(function (r) { return r.text(); })];
                    case 1:
                        body = _b.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        postValue = (_a = loadedCheerio('div[ax-load][x-data]')
                            .attr('x-data')) === null || _a === void 0 ? void 0 : _a.replace("browse('", '').replace("')", '');
                        data = new FormData();
                        data.append('search', '');
                        data.append('orderBy', 'recent');
                        data.append('curpage', pageNo.toString());
                        data.append('post', postValue);
                        data.append('action', 'fetch_browse');
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + 'ajax', {
                                body: data,
                                method: 'POST',
                            }).then(function (res) { return res.json(); })];
                    case 2:
                        response = _b.sent();
                        response.data.posts.forEach(function (element) {
                            return novels.push({
                                name: element.title,
                                cover: element.thumbnail,
                                path: element.permalink.replace(_this.site, ''),
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    StorySeedlingPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var $, baseUrl, novel, coverUrl, genres, rawStatus, map, summaryDiv, pTagSummary, chapters, xdata, listXdata, dataNovelId, dataNovelN, idMatch, novelId, chapterListing, formData, chaptersUrl, refererUrl, results;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getCheerio(this.site + novelPath, false)];
                    case 1:
                        $ = _b.sent();
                        baseUrl = this.site;
                        novel = {
                            path: novelPath,
                        };
                        novel.name = $('h1').text().trim();
                        coverUrl = $('img[x-ref="art"].w-full.rounded.shadow-md').attr('src');
                        if (coverUrl) {
                            novel.cover = new URL(coverUrl, baseUrl).href;
                        }
                        genres = [];
                        $('section[x-data="{ tab: location.hash.substr(1) || \'chapters\' }"].relative > div > div > div.flex.flex-wrap > a').each(function () {
                            genres.push($(this).text().trim());
                        });
                        novel.genres = genres.join(', ');
                        novel.author = $('div.mb-1 a').text().trim();
                        rawStatus = $('div.gap-2 span.text-sm').text().trim();
                        map = {
                            ongoing: novelStatus_1.NovelStatus.Ongoing,
                            hiatus: novelStatus_1.NovelStatus.OnHiatus,
                            dropped: novelStatus_1.NovelStatus.Cancelled,
                            cancelled: novelStatus_1.NovelStatus.Cancelled,
                            completed: novelStatus_1.NovelStatus.Completed,
                        };
                        novel.status = (_a = map[rawStatus.toLowerCase()]) !== null && _a !== void 0 ? _a : novelStatus_1.NovelStatus.Unknown;
                        summaryDiv = $('div.mb-4.order-2:not(.lg\\:grid-in-buttons)');
                        pTagSummary = summaryDiv.find('p');
                        novel.summary =
                            pTagSummary.length > 0
                                ? pTagSummary
                                    .map(function (_, el) { return $(el).text().trim(); })
                                    .get()
                                    .join('\n\n')
                                : summaryDiv.text().trim(); // --- Else (no <p> tags) ---
                        chapters = [];
                        xdata = $('.bg-accent div[ax-load][x-data]').attr('x-data');
                        if (!xdata) return [3 /*break*/, 3];
                        listXdata = xdata === null || xdata === void 0 ? void 0 : xdata.split("'");
                        dataNovelId = listXdata[1];
                        dataNovelN = listXdata[3];
                        idMatch = novelPath.match(/\d+/);
                        novelId = dataNovelId || (idMatch ? idMatch[0] : null);
                        if (!novelId) return [3 /*break*/, 3];
                        chapterListing = 'ajax';
                        formData = new FormData();
                        formData.append('post', dataNovelN);
                        formData.append('id', dataNovelId);
                        formData.append('action', 'series_toc');
                        chaptersUrl = "".concat(this.site).concat(chapterListing);
                        refererUrl = "".concat(this.site).concat(novel.path);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(chaptersUrl, {
                                method: 'POST',
                                referrer: refererUrl,
                                referrerPolicy: 'origin',
                                body: formData,
                            })
                                .then(function (r) { return r.json(); })
                                .catch(function (e) {
                                return (novel.summary =
                                    'Chapter Parse Error: ' + e + '\n\n' + novel.summary);
                            })];
                    case 2:
                        results = _b.sent();
                        if (results.data) {
                            results = results.data;
                            results.forEach(function (chap) {
                                if (chap.url == null) {
                                    return;
                                }
                                var name = chap.title;
                                var url = chap.url;
                                var releaseTime = chap.date;
                                var chapterNumber = chap.slug;
                                chapters.push({
                                    name: name,
                                    path: url.replace(baseUrl, ''),
                                    releaseTime: releaseTime,
                                    chapterNumber: parseInt(chapterNumber),
                                });
                            });
                        }
                        _b.label = 3;
                    case 3:
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    StorySeedlingPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var $, xdata, t, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCheerio(this.site + chapterPath, false)];
                    case 1:
                        $ = _a.sent();
                        xdata = $('div[ax-load][x-data]').attr('x-data');
                        t = $('div.justify-center > div.mb-4');
                        chapterText = t.html() || '';
                        if (xdata) {
                            chapterText =
                                chapterText +
                                    "\n\n Error parsing chapter: Turnstile detected. Advise just reading in web view until there's a fix.";
                            //   const listXdata = xdata?.split("'");
                            //   const dataNovelId = listXdata[1];
                            //   const dataNovelN = listXdata[3];
                        }
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    StorySeedlingPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var novels, body, loadedCheerio, postValue, data, response;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        novels = [];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + 'browse').then(function (r) { return r.text(); })];
                    case 1:
                        body = _b.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        postValue = (_a = loadedCheerio('div[ax-load][x-data]')
                            .attr('x-data')) === null || _a === void 0 ? void 0 : _a.replace("browse('", '').replace("')", '');
                        data = new FormData();
                        data.append('search', searchTerm);
                        data.append('orderBy', 'recent');
                        data.append('curpage', pageNo.toString());
                        data.append('post', postValue);
                        data.append('action', 'fetch_browse');
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + 'ajax', {
                                body: data,
                                method: 'POST',
                            }).then(function (res) { return res.json(); })];
                    case 2:
                        response = _b.sent();
                        response.data.posts.forEach(function (element) {
                            return novels.push({
                                name: element.title,
                                cover: element.thumbnail,
                                path: element.permalink.replace(_this.site, ''),
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return StorySeedlingPlugin;
}());
exports.default = new StorySeedlingPlugin();
