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
var NovelkiPL = /** @class */ (function () {
    function NovelkiPL() {
        this.id = 'novelki.pl';
        this.name = 'Novelki';
        this.icon = 'src/pl/novelki/icon.png';
        this.site = 'https://novelki.pl';
        this.version = '1.0.3';
        this.filters = {
            genres: {
                value: '',
                label: 'Genre',
                options: [
                    { label: 'Wybierz gatunek', value: '' },
                    { label: 'Adaptacja do anime', value: '35' },
                    { label: 'Adaptacja do dramy', value: '40' },
                    { label: 'Adaptacja do mangi', value: '36' },
                    { label: 'Akcja', value: '1' },
                    { label: 'Boys Love', value: '22' },
                    { label: 'Bromans', value: '33' },
                    { label: 'Dojrzały', value: '11' },
                    { label: 'Dramat', value: '10' },
                    { label: 'Ecchi', value: '29' },
                    { label: 'Fantasy', value: '2' },
                    { label: 'Gender Bender', value: '28' },
                    { label: 'Girls Love', value: '23' },
                    { label: 'Harem', value: '8' },
                    { label: 'Hentai', value: '43' },
                    { label: 'Historyczny', value: '30' },
                    { label: 'Horror', value: '15' },
                    { label: 'Isekai', value: '44' },
                    { label: 'Josei', value: '27' },
                    { label: 'Komedia', value: '3' },
                    { label: 'Mecha', value: '16' },
                    { label: 'Nadprzyrodzone', value: '9' },
                    { label: 'Okruchy życia', value: '18' },
                    { label: 'Oneshot', value: '41' },
                    { label: 'Parodia', value: '19' },
                    { label: 'Przygodowy', value: '4' },
                    { label: 'Psychologiczny', value: '12' },
                    { label: 'Reinkarnacja', value: '42' },
                    { label: 'Romans', value: '7' },
                    { label: 'RPG', value: '17' },
                    { label: 'Sci-fi', value: '21' },
                    { label: 'Seinen', value: '26' },
                    { label: 'Shoujo', value: '25' },
                    { label: 'Shounen', value: '24' },
                    { label: 'Smut', value: '31' },
                    { label: 'Sport', value: '32' },
                    { label: 'Świat gry', value: '5' },
                    { label: 'Szkolne życie', value: '20' },
                    { label: 'Sztuki walki', value: '6' },
                    { label: 'Tajemnica', value: '14' },
                    { label: 'Tragedia', value: '13' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            status: {
                label: 'Status',
                value: '',
                options: [
                    { label: 'Wybierz status', value: '' },
                    { label: 'Zakończony', value: '0' },
                    { label: 'Aktywny', value: '1' },
                    { label: 'Porzucony', value: '2' },
                    { label: 'Wstrzymany', value: '3' },
                    { label: 'Zlicencjonowany', value: '4' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            type: {
                label: 'Type',
                value: '',
                options: [
                    { label: 'Wybierz typ', value: '' },
                    { label: 'Nie zdefiniowano', value: '0' },
                    { label: 'Light Novel', value: '1' },
                    { label: 'Wuxia', value: '2' },
                    { label: 'Xianxia', value: '3' },
                    { label: 'Web Novel', value: '4' },
                    { label: 'Autorska', value: '5' },
                    { label: 'Inne', value: '6' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    NovelkiPL.prototype.popularNovels = function (page_1, _a) {
        return __awaiter(this, arguments, void 0, function (page, _b) {
            var link, body, loadedCheerio, load, novels;
            var _this = this;
            var filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        link = this.site + '/projekty?filter=t';
                        link += '&genre=' + (filters === null || filters === void 0 ? void 0 : filters.genres.value);
                        link += '&status=' + (filters === null || filters === void 0 ? void 0 : filters.status.value);
                        link += '&type=' + (filters === null || filters === void 0 ? void 0 : filters.type.value);
                        link += '&page=' + page;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(link).then(function (res) {
                                if (res.url == "".concat(_this.site, "/guest"))
                                    throw new Error('Failed to load novels (open in web view and login)');
                                return res.text();
                            })];
                    case 1:
                        body = _c.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        load = loadedCheerio('#projects > div');
                        novels = load
                            .map(function (index, element) { return ({
                            name: loadedCheerio(element)
                                .find('.card-title')
                                .attr('title'),
                            cover: _this.site + loadedCheerio(element).find('.card-img-top').attr('src'),
                            path: loadedCheerio(element).find('a').attr('href') || '',
                        }); })
                            .get()
                            .filter(function (novel) { return novel.name && novel.path; });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    NovelkiPL.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, novel, chapters, chaptersList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelPath,
                            name: '',
                        };
                        loadedCheerio('p.h5').each(function (i, e) {
                            var text = loadedCheerio(e).text().trim();
                            if (text.includes('Autor:'))
                                novel.author = text.split(':')[1].trim();
                            if (text.includes('Status projektu:')) {
                                switch ("".concat(text.split(':')[1].trim()).toLowerCase()) {
                                    case 'wstrzymany':
                                        novel.status = novelStatus_1.NovelStatus.OnHiatus;
                                        break;
                                    case 'zakończony':
                                        novel.status = novelStatus_1.NovelStatus.Completed;
                                        break;
                                    case 'aktywny':
                                        novel.status = novelStatus_1.NovelStatus.Ongoing;
                                        break;
                                    case 'porzucony':
                                        novel.status = novelStatus_1.NovelStatus.Cancelled;
                                        break;
                                    case 'zlicencjonowany':
                                        novel.status = novelStatus_1.NovelStatus.Licensed;
                                        break;
                                    default:
                                        novel.status = novelStatus_1.NovelStatus.Unknown;
                                        break;
                                }
                            }
                        });
                        novel.name = loadedCheerio('div.col-sm-12.col-md-6.col-lg-8.mb-5')
                            .find('h3')
                            .text()
                            .trim();
                        novel.cover = this.site + loadedCheerio('.img-fluid').attr('src'); // TODO: return not only undefined
                        novel.genres = loadedCheerio('span.badge')
                            .map(function (i, e) { return loadedCheerio(e).text(); })
                            .get()
                            .join(', ');
                        novel.summary = loadedCheerio('.h5:contains("Opis:")')
                            .next('p')
                            .next('p')
                            .text()
                            .trim();
                        chapters = [];
                        chaptersList = loadedCheerio('.chapters > .col-md-3 > div').get();
                        chaptersList.forEach(function (e, i) {
                            var _a;
                            var urlChapters = loadedCheerio(e).find('a').attr('href') || '';
                            var chapter = {
                                name: (_a = loadedCheerio(e).find('a')) === null || _a === void 0 ? void 0 : _a.text().trim(),
                                path: urlChapters,
                                releaseTime: loadedCheerio(e)
                                    .find('.card-footer > span')
                                    .text()
                                    .trim()
                                    .split('-')
                                    .reverse()
                                    .join('-'),
                                chapterNumber: chaptersList.length - i,
                            };
                            chapters.push(chapter);
                        });
                        novel.chapters = chapters.reverse();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    NovelkiPL.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var pattern, codeChapter, body, chapterText;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pattern = /\/projekty\/([^/]+)\/([^/]+)/;
                        codeChapter = pattern.exec(chapterPath) || '';
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "/api/reader/chapters/").concat(codeChapter[2])).then(function (res) {
                                if (res.url == "".concat(_this.site, "/guest"))
                                    throw new Error('Failed to load chapter (open in web view and login)');
                                return res.json();
                            })];
                    case 1:
                        body = _a.sent();
                        chapterText = body.data.content;
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    NovelkiPL.prototype.searchNovels = function (searchTerm, page) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "/projekty?filter=t&title=").concat(searchTerm, "+&page=").concat(page)).then(function (res) {
                            if (res.url == "".concat(_this.site, "/guest"))
                                throw new Error('Failed to search novels (open in web view and login)');
                            return res.text();
                        })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = loadedCheerio('#projects > div')
                            .map(function (index, element) { return ({
                            name: loadedCheerio(element)
                                .find('.card-title')
                                .attr('title'),
                            cover: _this.site + loadedCheerio(element).find('.card-img-top').attr('src'),
                            path: loadedCheerio(element).find('a').attr('href') || '',
                        }); })
                            .get()
                            .filter(function (novel) { return novel.name && novel.path; });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return NovelkiPL;
}());
exports.default = new NovelkiPL();
