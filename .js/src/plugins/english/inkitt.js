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
var filterInputs_1 = require("@libs/filterInputs");
var cheerio_1 = require("cheerio");
var novelStatus_1 = require("@libs/novelStatus");
var InkittPlugin = /** @class */ (function () {
    function InkittPlugin() {
        var _this = this;
        this.id = 'inkitt';
        this.name = 'Inkitt';
        this.icon = 'src/en/inkitt/icon.png';
        this.site = 'https://www.inkitt.com';
        this.version = '1.0.1';
        this.imageRequestInit = undefined;
        this.resolveUrl = function (path, isNovel) {
            return _this.site + '/stories/' + path;
        };
        this.filters = {
            genres: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Genre',
                value: '',
                options: [
                    { 'label': 'Sci-Fi', 'value': 'scifi' },
                    { 'label': 'Fantasy', 'value': 'fantasy' },
                    { 'label': 'Adventure', 'value': 'adventure' },
                    { 'label': 'Mystery', 'value': 'mystery' },
                    { 'label': 'Action', 'value': 'action' },
                    { 'label': 'Horror', 'value': 'horror' },
                    { 'label': 'Humor', 'value': 'humor' },
                    { 'label': 'Erotica', 'value': 'erotica' },
                    { 'label': 'Poetry', 'value': 'poetry' },
                    { 'label': 'Other', 'value': 'other' },
                    { 'label': 'Thriller', 'value': 'thriller' },
                    { 'label': 'Romance', 'value': 'romance' },
                    { 'label': 'Children', 'value': 'children' },
                    { 'label': 'Drama', 'value': 'drama' },
                ],
            },
        };
    }
    InkittPlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var req, data, e_1;
            var _this = this;
            var _c;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!((_c = filters === null || filters === void 0 ? void 0 : filters.genres) === null || _c === void 0 ? void 0 : _c.value)) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site +
                                "/genre/".concat(filters.genres.value, "/").concat(pageNo, "?period=alltime&sort=popular"))];
                    case 1:
                        req = _d.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + "/trending_stories?page=".concat(pageNo, "&period=alltime"))];
                    case 3:
                        req = _d.sent();
                        _d.label = 4;
                    case 4:
                        _d.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, req.json()];
                    case 5:
                        data = _d.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        e_1 = _d.sent();
                        throw new Error('Failed to load novels, try opening in webview.');
                    case 7: return [2 /*return*/, data.stories.map(function (novel) {
                            return {
                                name: novel.title,
                                path: _this.getPath(novel),
                                cover: novel.vertical_cover.url ||
                                    novel.vertical_cover.iphone ||
                                    novel.cover.url,
                            };
                        })];
                }
            });
        });
    };
    InkittPlugin.prototype.getPath = function (novel) {
        return (novel.category_one || novel.genres[0]) + '/' + novel.id;
    };
    InkittPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var req, text, loadedCheerio, novel, status, apiReq, apiData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + "/stories/".concat(novelPath))];
                    case 1:
                        req = _a.sent();
                        return [4 /*yield*/, req.text()];
                    case 2:
                        text = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(text);
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('h1.story-title').text(),
                        };
                        novel.author = loadedCheerio('dl > dd > a.author-link').text();
                        novel.genres = loadedCheerio('dd.genres > a')
                            .map(function (i, el) { return loadedCheerio(el).text(); })
                            .toArray()
                            .join(', ');
                        status = loadedCheerio('div.dlc > dl:has(dt:contains("Status")) > dd')
                            .text()
                            .trim();
                        if (status === 'Complete')
                            novel.status = novelStatus_1.NovelStatus.Completed;
                        if (status === 'Ongoing')
                            novel.status = novelStatus_1.NovelStatus.Ongoing;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + "/api/stories/".concat(novelPath.split('/')[1]))];
                    case 3:
                        apiReq = _a.sent();
                        return [4 /*yield*/, apiReq.json()];
                    case 4:
                        apiData = _a.sent();
                        novel.cover = apiData.vertical_cover.url;
                        novel.summary = loadedCheerio('p.story-summary').text();
                        novel.chapters = apiData.chapters.map(function (c) {
                            return {
                                name: c.name,
                                path: novelPath + '/chapters/' + c.chapter_number,
                                chapterNumber: c.chapter_number,
                            };
                        });
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    InkittPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var req, text, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/stories/' + chapterPath)];
                    case 1:
                        req = _a.sent();
                        return [4 /*yield*/, req.text()];
                    case 2:
                        text = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(text);
                        return [2 /*return*/, loadedCheerio('div#chapterText').html() || ''];
                }
            });
        });
    };
    InkittPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var req, data, e_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site +
                            "/api/2/search/title?q=".concat(encodeURIComponent(searchTerm), "&page=").concat(pageNo))];
                    case 1:
                        req = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, req.json()];
                    case 3:
                        data = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _a.sent();
                        throw new Error('Failed to search novels, try opening in webview.');
                    case 5: return [2 /*return*/, data.stories.map(function (novel) {
                            return {
                                name: novel.title,
                                path: _this.getPath(novel),
                                cover: novel.vertical_cover.url ||
                                    novel.vertical_cover.iphone ||
                                    novel.cover.url,
                            };
                        })];
                }
            });
        });
    };
    return InkittPlugin;
}());
exports.default = new InkittPlugin();
