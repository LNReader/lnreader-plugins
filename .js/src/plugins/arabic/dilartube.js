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
var dilartube = /** @class */ (function () {
    function dilartube() {
        this.id = 'dilartube';
        this.name = 'dilar tube';
        this.version = '1.0.1';
        this.icon = 'src/ar/dilartube/icon.png';
        this.site = 'https://golden.rest/';
        // filters = {
        //   types: {
        //   value: [],
        //   label: 'الأنواع',
        //   options: [
        //     { label: 'يابانية', value: '1' }, // Japanese
        //     { label: 'كورية', value: '2' }, // Korean
        //     { label: 'صينية', value: '3' }, // Chinese
        //     { label: 'عربية', value: '4' }, // Arabic
        //     { label: 'كوميك', value: '5' }, // Comic
        //     { label: 'هواة', value: '6' }, // Amateur
        //     { label: 'إندونيسية', value: '7' }, // Indonesian
        //     { label: 'روسية', value: '8' }, // Russian
        //   ],
        //   type: FilterTypes.CheckboxGroup,
        // },
        // status: {
        //   value: '',
        //   label: 'الحالة',
        //   options: [
        //     { label: 'مستمرة', value: '2' }, // Ongoing
        //     { label: 'منتهية', value: '3' }, // Completed
        //   ],
        //   type: FilterTypes.CheckboxGroup,
        // },
        // translation: {
        //   value: [],
        //   label: 'الترجمة',
        //   options: [
        //     { label: 'منتهية', value: '0' }, // Completed
        //     { label: 'مستمرة', value: '1' }, // Ongoing
        //     { label: 'متوقفة', value: '2' }, // Paused
        //     { label: 'غير مترجمة', value: '3' }, // Not Translated
        //   ],
        //   type: FilterTypes.CheckboxGroup,
        // },
        // } satisfies Filters;
    }
    dilartube.prototype.parseNovels = function (data) {
        var _this = this;
        var novels = [];
        var seenTitles = new Set();
        if (data.data && data.data.length > 0) {
            data.data
                .filter(function (dataItem) { return dataItem.is_novel; })
                .forEach(function (dataItem) {
                var manga = dataItem;
                if (!seenTitles.has(dataItem.title)) {
                    seenTitles.add(manga.title);
                    novels.push({
                        name: dataItem.title || 'novel',
                        path: "mangas/".concat(manga.id),
                        cover: manga.cover
                            ? "".concat(_this.site, "uploads/manga/cover/").concat(manga.id, "/").concat(manga.cover)
                            : defaultCover_1.defaultCover,
                    });
                }
            });
        }
        if (data.releases && data.releases.length > 0) {
            data.releases
                .filter(function (release) { return release.manga.is_novel; })
                .forEach(function (release) {
                var manga = release.manga;
                if (!seenTitles.has(manga.title)) {
                    seenTitles.add(manga.title);
                    novels.push({
                        name: manga.title || 'novel',
                        path: "mangas/".concat(manga.id),
                        cover: manga.cover
                            ? "".concat(_this.site, "uploads/manga/cover/").concat(manga.id, "/").concat(manga.cover)
                            : defaultCover_1.defaultCover,
                    });
                }
            });
        }
        return novels;
    };
    dilartube.prototype.popularNovels = function (page_1, _a) {
        return __awaiter(this, arguments, void 0, function (page, _b) {
            var link, response;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        link = "".concat(this.site, "api/releases?page=").concat(page);
                        if (showLatestNovels) {
                            link = "".concat(this.site, "api/releases?page=").concat(page);
                        }
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(link).then(function (r) { return r.json(); })];
                    case 1:
                        response = _c.sent();
                        return [2 /*return*/, this.parseNovels(response)];
                }
            });
        });
    };
    dilartube.prototype.parseNovel = function (novelUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var chapterItems, fullUrl, chapterUrl, manga, chapters, mangaData, chapterData, novel, translationStatusId, translationText, statusWords, mainGenres, statusId, statusText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chapterItems = [];
                        fullUrl = this.site + 'api/' + novelUrl;
                        chapterUrl = this.site + 'api/' + novelUrl + '/releases';
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(fullUrl).then(function (r) { return r.json(); })];
                    case 1:
                        manga = _a.sent();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(chapterUrl).then(function (r) { return r.json(); })];
                    case 2:
                        chapters = _a.sent();
                        mangaData = manga.mangaData;
                        chapterData = chapters.releases;
                        novel = {
                            path: novelUrl,
                            name: mangaData.arabic_title || 'Untitled',
                            author: (mangaData.authors.length > 0 ? mangaData.authors[0].name : '') ||
                                'Unknown',
                            summary: mangaData.summary || '',
                            cover: "".concat(this.site, "uploads/manga/cover/").concat(mangaData.id, "/").concat(mangaData.cover),
                            chapters: [],
                        };
                        translationStatusId = mangaData.translation_status;
                        translationText = {
                            '1': 'مستمره',
                            '0': 'منتهية',
                            '2': 'متوقفة',
                            '3': 'غير مترجمه',
                        }[translationStatusId] || 'غير معروف';
                        statusWords = new Set(['مكتمل', 'جديد', 'مستمر']);
                        mainGenres = mangaData.categories
                            .map(function (category) { return category.name; })
                            .join(',');
                        novel.genres = "".concat(translationText, ",").concat(mainGenres);
                        statusId = mangaData.story_status;
                        statusText = {
                            '2': 'Ongoing',
                            '3': 'Completed',
                        }[statusId] || 'Unknown';
                        novel.status = statusText;
                        chapterData.map(function (item) {
                            chapterItems.push({
                                name: item.title,
                                releaseTime: new Date(item.created_at).toISOString(),
                                path: "".concat(novelUrl, "/").concat(mangaData.title.replace(' ', '-'), "/").concat(item.chapter),
                                chapterNumber: item.chapter,
                            });
                        });
                        novel.chapters = chapterItems.reverse();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    dilartube.prototype.parseChapter = function (chapterUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var result, body, loadedCheerio, jsonData, parsedData, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(new URL(chapterUrl, this.site).toString())];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        jsonData = loadedCheerio('script.js-react-on-rails-component').html();
                        parsedData = JSON.parse(jsonData);
                        chapterText = parsedData.readerDataAction.readerData.release.content;
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    dilartube.prototype.searchNovels = function (searchTerm, page) {
        return __awaiter(this, void 0, void 0, function () {
            var formData, response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        formData = new FormData();
                        formData.append('query', searchTerm);
                        formData.append('includes', '["Manga","Team","Member"]');
                        return [4 /*yield*/, (0, fetch_1.fetchApi)('https://dilar.tube/api/quick_search', {
                                method: 'POST',
                                body: formData,
                            }).then(function (r) { return r.json(); })];
                    case 1:
                        response = _a.sent();
                        data = response[0];
                        return [2 /*return*/, this.parseNovels(data)];
                }
            });
        });
    };
    return dilartube;
}());
exports.default = new dilartube();
