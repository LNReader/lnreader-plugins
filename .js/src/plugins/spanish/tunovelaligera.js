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
var filterInputs_1 = require("@libs/filterInputs");
var defaultCover_1 = require("@libs/defaultCover");
var novelStatus_1 = require("@libs/novelStatus");
var TuNovelaLigera = /** @class */ (function () {
    function TuNovelaLigera() {
        this.id = 'tunovelaligera';
        this.name = 'TuNovelaLigera';
        this.icon = 'src/es/tunovelaligera/icon.png';
        this.site = 'https://tunovelaligera.com';
        this.version = '1.1.0';
        this.filters = {
            order: {
                value: 'rating',
                label: 'Ordenado por',
                options: [
                    { label: 'Lo mas reciente', value: 'latest' },
                    { label: 'A-Z', value: 'alphabet' },
                    { label: 'Clasificación', value: 'rating' },
                    { label: 'Trending', value: 'trending' },
                    { label: 'Mas visto', value: 'views' },
                    { label: 'Nuevo', value: 'new-manga' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genres: {
                value: '',
                label: 'Generos',
                options: [
                    { label: 'None', value: '' },
                    { label: 'Acción', value: 'accion' },
                    { label: 'Adulto', value: 'adulto' },
                    { label: 'Artes Marciales', value: 'artes-marciales' },
                    { label: 'Aventura', value: 'aventura' },
                    { label: 'Ciencia Ficción', value: 'ciencia-ficcion' },
                    { label: 'Comedia', value: 'comedia' },
                    { label: 'Deportes', value: 'deportes' },
                    { label: 'Drama', value: 'drama' },
                    { label: 'Eastern Fantasy', value: 'eastern-fantasy' },
                    { label: 'Ecchi', value: 'ecchi' },
                    { label: 'FanFiction', value: 'fan-fiction' },
                    { label: 'Fantasía', value: 'fantasia' },
                    { label: 'Fantasía oriental', value: 'fantasia-oriental' },
                    { label: 'Ficción Romántica', value: 'ficcion-romantica' },
                    { label: 'Gender Bender', value: 'gender-bender' },
                    { label: 'Harem', value: 'harem' },
                    { label: 'Histórico', value: 'historico' },
                    { label: 'Horror', value: 'horror' },
                    { label: 'Josei', value: 'josei' },
                    { label: 'Maduro', value: 'maduro' },
                    { label: 'Mecha', value: 'mecha' },
                    { label: 'Misterio', value: 'misterio' },
                    { label: 'Novela China', value: 'novela-china' },
                    { label: 'Novela FanFiction', value: 'novela-fanfiction' },
                    { label: 'Novela Japonesa', value: 'novela-japonesa' },
                    { label: 'Novela Koreana', value: 'novela-koreana' },
                    { label: 'Novela ligera', value: 'novela-ligera' },
                    { label: 'Novela original', value: 'novela-original' },
                    { label: 'Novela Web', value: 'web-novel' },
                    { label: 'Psicológico', value: 'psicologico' },
                    { label: 'Realismo Mágico', value: 'realismo-magico' },
                    { label: 'Recuento de vida', value: 'recuento-de-vida' },
                    { label: 'Romance', value: 'romance' },
                    { label: 'Romance contemporáneo', value: 'romance-contemporaneo' },
                    { label: 'Romance Moderno', value: 'romance-moderno' },
                    { label: 'Seinen', value: 'seinen' },
                    { label: 'Shoujo', value: 'shoujo' },
                    { label: 'Shounen', value: 'shounen' },
                    { label: 'Sobrenatural', value: 'sobrenatural' },
                    { label: 'Tragedia', value: 'tragedia' },
                    { label: 'Vampiros', value: 'vampiros' },
                    { label: 'Vida Escolar', value: 'vida-escolar' },
                    { label: 'Western Fantasy', value: 'western-fantasy' },
                    { label: 'Wuxia', value: 'wuxia' },
                    { label: 'Xianxia', value: 'xianxia' },
                    { label: 'Xuanhuan', value: 'xuanhuan' },
                    { label: 'Yaoi', value: 'yaoi' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    TuNovelaLigera.prototype.sleep = function (ms) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
            });
        });
    };
    TuNovelaLigera.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var link, result, loadedCheerio, novels;
            var _this = this;
            var _c, _d;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        link = this.site;
                        link += ((_c = filters === null || filters === void 0 ? void 0 : filters.genres) === null || _c === void 0 ? void 0 : _c.value)
                            ? '/genero' + filters.genres.value
                            : '/novelas';
                        link += "/page/".concat(pageNo, "?m_orderby=");
                        link += showLatestNovels ? 'latest' : ((_d = filters === null || filters === void 0 ? void 0 : filters.order) === null || _d === void 0 ? void 0 : _d.value) || 'rating';
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(link).then(function (res) { return res.text(); })];
                    case 1:
                        result = _e.sent();
                        loadedCheerio = (0, cheerio_1.load)(result);
                        novels = [];
                        loadedCheerio('.page-item-detail').each(function (i, el) {
                            var name = loadedCheerio(el).find('.h5 > a').text();
                            var cover = loadedCheerio(el).find('img').attr('src');
                            var url = loadedCheerio(el).find('.h5 > a').attr('href');
                            if (!url)
                                return;
                            novels.push({ name: name, cover: cover, path: url.replace(_this.site, '') });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    TuNovelaLigera.prototype.parseChapters = function (loadedCheerio) {
        var _this = this;
        var chapters = [];
        loadedCheerio('#lcp_instance_0 li').each(function (i, el) {
            var chapterName = loadedCheerio(el)
                .find('a')
                .text()
                .replace(/[\t\n]/g, '')
                .trim();
            var chapterUrl = loadedCheerio(el).find('a').attr('href');
            if (!chapterUrl)
                return;
            chapters.push({
                name: chapterName,
                path: chapterUrl.replace(_this.site, ''),
            });
        });
        return chapters;
    };
    TuNovelaLigera.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var novelUrl, result, body, loadedCheerio, lastPage, novel, novelCover, latestChapterEle, latestChapterUrl, latestChapterName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        novelUrl = this.site + novelPath;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(novelUrl)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        lastPage = 1;
                        loadedCheerio('ul.lcp_paginator > li > a').each(function () {
                            var page = Number(this.attribs['title']);
                            if (page && page > lastPage)
                                lastPage = page;
                        });
                        novel = {
                            path: novelPath,
                            chapters: [],
                            totalPages: lastPage,
                            name: loadedCheerio('.post-title > h1').text().trim(),
                        };
                        loadedCheerio('.manga-title-badges').remove();
                        novelCover = loadedCheerio('.summary_image > a > img');
                        novel.cover =
                            novelCover.attr('data-src') ||
                                novelCover.attr('src') ||
                                novelCover.attr('data-cfsrc') ||
                                defaultCover_1.defaultCover;
                        loadedCheerio('.post-content_item').each(function () {
                            var detailName = loadedCheerio(this)
                                .find('.summary-heading > h5')
                                .text()
                                .trim();
                            var detail = loadedCheerio(this).find('.summary-content').text().trim();
                            switch (detailName) {
                                case 'Género(s)':
                                    novel.genres = detail.replace(/, /g, ',');
                                    break;
                                case 'Autor(es)':
                                    novel.author = detail;
                                    break;
                                case 'Estado':
                                    novel.status =
                                        detail.includes('OnGoing') || detail.includes('Updating')
                                            ? novelStatus_1.NovelStatus.Ongoing
                                            : novelStatus_1.NovelStatus.Completed;
                                    break;
                            }
                        });
                        novel.summary = loadedCheerio('div.summary__content > p').text().trim();
                        novel.chapters = this.parseChapters(loadedCheerio);
                        latestChapterEle = loadedCheerio('#lcp_instance_0 li').first();
                        latestChapterUrl = loadedCheerio(latestChapterEle)
                            .find('a')
                            .attr('href');
                        latestChapterName = loadedCheerio(latestChapterEle)
                            .find('a')
                            .text()
                            .replace(/[\t\n]/g, '')
                            .trim();
                        novel.latestChapter = latestChapterUrl
                            ? {
                                path: latestChapterUrl.replace(this.site, ''),
                                name: latestChapterName,
                            }
                            : undefined;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    TuNovelaLigera.prototype.parsePage = function (novelPath, page) {
        return __awaiter(this, void 0, void 0, function () {
            var pageUrl, pageText, chapters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pageUrl = this.site + novelPath + '?lcp_page0=' + page;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(pageUrl).then(function (res) { return res.text(); })];
                    case 1:
                        pageText = _a.sent();
                        chapters = this.parseChapters((0, cheerio_1.load)(pageText));
                        return [2 /*return*/, {
                                chapters: chapters,
                            }];
                }
            });
        });
    };
    TuNovelaLigera.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var result, body, loadedCheerio, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        chapterText = loadedCheerio('.c-blog-post.post').html() || '';
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    TuNovelaLigera.prototype.searchNovels = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "/?s=").concat(searchTerm, "&post_type=wp-manga");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio('.c-tabs-item__content').each(function (i, el) {
                            var name = loadedCheerio(el).find('.h4 > a').text();
                            var cover = loadedCheerio(el).find('img').attr('src');
                            var url = loadedCheerio(el).find('.h4 > a').attr('href');
                            if (!url)
                                return;
                            novels.push({ name: name, cover: cover, path: url.replace(_this.site, '') });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return TuNovelaLigera;
}());
exports.default = new TuNovelaLigera();
