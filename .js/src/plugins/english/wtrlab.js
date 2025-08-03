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
var WTRLAB = /** @class */ (function () {
    function WTRLAB() {
        this.id = 'WTRLAB';
        this.name = 'WTR-LAB';
        this.site = 'https://wtr-lab.com/';
        this.version = '1.0.1';
        this.icon = 'src/en/wtrlab/icon.png';
        this.sourceLang = 'en/';
        this.filters = {
            order: {
                value: 'chapter',
                label: 'Order by',
                options: [
                    { label: 'View', value: 'view' },
                    { label: 'Name', value: 'name' },
                    { label: 'Addition Date', value: 'date' },
                    { label: 'Reader', value: 'reader' },
                    { label: 'Chapter', value: 'chapter' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            sort: {
                value: 'desc',
                label: 'Sort by',
                options: [
                    { label: 'Descending', value: 'desc' },
                    { label: 'Ascending', value: 'asc' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            storyStatus: {
                value: 'all',
                label: 'Status',
                options: [
                    { label: 'All', value: 'all' },
                    { label: 'Ongoing', value: 'ongoing' },
                    { label: 'Completed', value: 'completed' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    WTRLAB.prototype.popularNovels = function (page_1, _a) {
        return __awaiter(this, arguments, void 0, function (page, _b) {
            var link, response, recentNovel, novels, body, loadedCheerio_1, novels;
            var _this = this;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        link = this.site + this.sourceLang + 'novel-list?';
                        link += "orderBy=".concat(filters.order.value);
                        link += "&order=".concat(filters.sort.value);
                        link += "&filter=".concat(filters.storyStatus.value);
                        link += "&page=".concat(page); //TODO Genre & Advance Searching Filter. Ez to implement, too much manual work, too lazy.
                        if (!showLatestNovels) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + 'api/home/recent', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ page: page }),
                            })];
                    case 1:
                        response = _c.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        recentNovel = _c.sent();
                        novels = recentNovel.data.map(function (datum) { return ({
                            name: datum.serie.data.title || '',
                            cover: datum.serie.data.image,
                            path: _this.sourceLang +
                                'serie-' +
                                datum.serie.raw_id +
                                '/' +
                                datum.serie.slug || '',
                        }); });
                        return [2 /*return*/, novels];
                    case 3: return [4 /*yield*/, (0, fetch_1.fetchApi)(link).then(function (res) { return res.text(); })];
                    case 4:
                        body = _c.sent();
                        loadedCheerio_1 = (0, cheerio_1.load)(body);
                        novels = loadedCheerio_1('.serie-item')
                            .map(function (index, element) { return ({
                            name: loadedCheerio_1(element)
                                .find('.title-wrap > a')
                                .text()
                                .replace(loadedCheerio_1(element).find('.rawtitle').text(), '') ||
                                '',
                            cover: loadedCheerio_1(element).find('img').attr('src'),
                            path: loadedCheerio_1(element).find('a').attr('href') || '',
                        }); })
                            .get()
                            .filter(function (novel) { return novel.name && novel.path; });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    WTRLAB.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, novel, chapterJson, jsonData, chapters;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath).then(function (res) { return res.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('h1.text-uppercase').text(),
                            cover: loadedCheerio('.img-wrap > img').attr('src'),
                            summary: loadedCheerio('.lead').text().trim(),
                        };
                        novel.genres = loadedCheerio('td:contains("Genre")')
                            .next()
                            .find('a')
                            .map(function (i, el) { return loadedCheerio(el).text(); })
                            .toArray()
                            .join(',');
                        novel.author = loadedCheerio('td:contains("Author")')
                            .next()
                            .text()
                            .replace(/[\t\n]/g, '');
                        novel.status = loadedCheerio('td:contains("Status")')
                            .next()
                            .text()
                            .replace(/[\t\n]/g, '');
                        chapterJson = loadedCheerio('#__NEXT_DATA__').html() + '';
                        jsonData = JSON.parse(chapterJson);
                        chapters = jsonData.props.pageProps.serie.chapters.map(function (jsonChapter, chapterIndex) {
                            var _a;
                            return ({
                                name: jsonChapter.title,
                                path: _this.sourceLang +
                                    'serie-' +
                                    jsonData.props.pageProps.serie.serie_data.raw_id +
                                    '/' +
                                    jsonData.props.pageProps.serie.serie_data.slug +
                                    '/chapter-' +
                                    jsonChapter.order, // Assuming 'slug' is the intended path
                                releaseTime: (_a = ((jsonChapter === null || jsonChapter === void 0 ? void 0 : jsonChapter.created_at) || (jsonChapter === null || jsonChapter === void 0 ? void 0 : jsonChapter.updated_at))) === null || _a === void 0 ? void 0 : _a.substring(0, 10),
                                chapterNumber: chapterIndex + 1,
                            });
                        });
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    WTRLAB.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, chapterJson, jsonData, chapterContent, parsedArray, htmlString, _i, parsedArray_1, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath).then(function (res) {
                            return res.text();
                        })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        chapterJson = loadedCheerio('#__NEXT_DATA__').html() + '';
                        jsonData = JSON.parse(chapterJson);
                        chapterContent = JSON.stringify(jsonData.props.pageProps.serie.chapter_data.data.body);
                        parsedArray = JSON.parse(chapterContent);
                        htmlString = '';
                        for (_i = 0, parsedArray_1 = parsedArray; _i < parsedArray_1.length; _i++) {
                            text = parsedArray_1[_i];
                            htmlString += "<p>".concat(text, "</p>");
                        }
                        return [2 /*return*/, htmlString];
                }
            });
        });
    };
    WTRLAB.prototype.searchNovels = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var response, recentNovel, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + 'api/search', {
                            headers: {
                                'Content-Type': 'application/json',
                                Referer: this.site + this.sourceLang,
                                Origin: this.site,
                            },
                            method: 'POST',
                            body: JSON.stringify({ text: searchTerm }),
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        recentNovel = _a.sent();
                        novels = recentNovel.data.map(function (datum) { return ({
                            name: datum.data.title || '',
                            cover: datum.data.image,
                            path: _this.sourceLang + 'serie-' + datum.raw_id + '/' + datum.slug || '',
                        }); });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return WTRLAB;
}());
exports.default = new WTRLAB();
