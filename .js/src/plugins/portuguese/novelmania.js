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
var defaultCover_1 = require("@libs/defaultCover");
var novelStatus_1 = require("@libs/novelStatus");
var NovelMania = /** @class */ (function () {
    function NovelMania() {
        var _this = this;
        this.id = 'novelmania.com.br';
        this.name = 'Novel Mania';
        this.icon = 'src/pt-br/novelmania/icon.png';
        this.site = 'https://novelmania.com.br';
        this.version = '1.0.0';
        this.imageRequestInit = undefined;
        this.resolveUrl = function (path, isNovel) {
            return _this.site + (isNovel ? '/book/' : '/chapter/') + path;
        };
        this.filters = {
            genres: {
                value: '',
                label: 'Gêneros',
                options: [
                    { label: 'Todos', value: '' },
                    { label: 'Ação', value: '01' },
                    { label: 'Adulto', value: '02' },
                    { label: 'Artes Marciais', value: '07' },
                    { label: 'Aventura', value: '03' },
                    { label: 'Comédia', value: '04' },
                    { label: 'Cotidiano', value: '16' },
                    { label: 'Drama', value: '23' },
                    { label: 'Ecchi', value: '27' },
                    { label: 'Erótico', value: '22' },
                    { label: 'Escolar', value: '13' },
                    { label: 'Fantasia', value: '05' },
                    { label: 'Harém', value: '21' },
                    { label: 'Isekai', value: '30' },
                    { label: 'Magia', value: '26' },
                    { label: 'Mecha', value: '08' },
                    { label: 'Medieval', value: '31' },
                    { label: 'Militar', value: '24' },
                    { label: 'Mistério', value: '09' },
                    { label: 'Mitologia', value: '10' },
                    { label: 'Psicológico', value: '11' },
                    { label: 'Realidade Virtual', value: '36' },
                    { label: 'Romance', value: '12' },
                    { label: 'Sci-fi', value: '14' },
                    { label: 'Sistema de Jogo', value: '15' },
                    { label: 'Sobrenatural', value: '17' },
                    { label: 'Suspense', value: '29' },
                    { label: 'Terror', value: '06' },
                    { label: 'Wuxia', value: '18' },
                    { label: 'Xianxia', value: '19' },
                    { label: 'Xuanhuan', value: '20' },
                    { label: 'Yaoi', value: '35' },
                    { label: 'Yuri', value: '37' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            status: {
                label: 'Status',
                value: '',
                options: [
                    { label: 'Todos', value: '' },
                    { label: 'Ativo', value: 'ativo' },
                    { label: 'Completo', value: 'Completo' },
                    { label: 'Pausado', value: 'pausado' },
                    { label: 'Parado', value: 'Parado' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            type: {
                label: 'Type',
                value: '',
                options: [
                    { label: 'Todas', value: '' },
                    { label: 'Americana', value: 'americana' },
                    { label: 'Angolana', value: 'angolana' },
                    { label: 'Brasileira', value: 'brasileira' },
                    { label: 'Chinesa', value: 'chinesa' },
                    { label: 'Coreana', value: 'coreana' },
                    { label: 'Japonesa', value: 'japonesa' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            ordem: {
                label: 'Ordenar',
                value: '',
                options: [
                    { label: 'Qualquer ordem', value: '' },
                    { label: 'Ordem alfabética', value: '1' },
                    { label: 'Nº de Capítulos', value: '2' },
                    { label: 'Popularidade', value: '3' },
                    { label: 'Novidades', value: '4' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    NovelMania.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var url, body, loadedCheerio, load, novels;
            var filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        url = "".concat(this.site, "/novels?titulo=");
                        url += "&categoria=".concat(filters === null || filters === void 0 ? void 0 : filters.genres.value);
                        url += "&status=".concat(filters === null || filters === void 0 ? void 0 : filters.status.value);
                        url += "&nacionalidade=".concat(filters === null || filters === void 0 ? void 0 : filters.type.value);
                        url += "&ordem=".concat(filters === null || filters === void 0 ? void 0 : filters.ordem.value);
                        url += "&page=".concat(pageNo);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (res) { return res.text(); })];
                    case 1:
                        body = _c.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        load = loadedCheerio('div.top-novels.dark.col-6 > div.row.mb-2');
                        novels = load
                            .map(function (index, element) { return ({
                            name: loadedCheerio(element).find('a.novel-title > h5').text(),
                            cover: loadedCheerio(element)
                                .find('a > div.card.c-size-1.border > img.card-image')
                                .attr('src'),
                            path: loadedCheerio(element).find('a.novel-title').attr('href') || '',
                        }); })
                            .get()
                            .filter(function (novel) { return novel.name && novel.path; });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    NovelMania.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, novel, status, chapters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('div.col-md-8 > div.novel-info > div.d-flex.flex-row.align-items-center > h1')
                                .text()
                                .trim() || 'Sem título',
                        };
                        loadedCheerio('b').remove();
                        novel.name =
                            loadedCheerio('div.col-md-8 > div.novel-info > div.d-flex.flex-row.align-items-center > h1')
                                .text()
                                .trim() || 'Sem título';
                        novel.summary =
                            loadedCheerio('div.tab-pane.fade.show.active > div.text > p')
                                .text()
                                .trim() || '';
                        novel.cover =
                            loadedCheerio('div.novel-img > img.img-responsive').attr('src') ||
                                defaultCover_1.defaultCover;
                        novel.author = loadedCheerio('div.novel-info > span.authors.mb-1')
                            .text()
                            .trim();
                        novel.genres = loadedCheerio('div.tags > ul.list-tags.mb-0 > li > a')
                            .map(function (i, el) { return loadedCheerio(el).text(); })
                            .toArray()
                            .join(',');
                        status = loadedCheerio('div.novel-info > span.authors.mb-3')
                            .text()
                            .trim();
                        switch (status) {
                            case 'Ativo':
                                novel.status = novelStatus_1.NovelStatus.Ongoing;
                                break;
                            case 'Pausado':
                                novel.status = novelStatus_1.NovelStatus.OnHiatus;
                                break;
                            case 'Completo':
                                novel.status = novelStatus_1.NovelStatus.Completed;
                                break;
                            default:
                                novel.status = novelStatus_1.NovelStatus.Unknown;
                        }
                        chapters = [];
                        loadedCheerio('div.accordion.capitulo > div.card > div.collapse > div.card-body.p-0 > ol > li').each(function (i, el) {
                            var chapterName = "".concat(loadedCheerio(el).find('a > span.sub-vol').text().trim(), " - ").concat(loadedCheerio(el).find('a > strong').text().trim());
                            var chapterPath = loadedCheerio(el).find('a').attr('href');
                            if (chapterPath)
                                chapters.push({ name: chapterName, path: chapterPath });
                        });
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    NovelMania.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var response, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site).concat(chapterPath)).then(function (res) {
                            return res.text();
                        })];
                    case 1:
                        response = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(response);
                        return [2 /*return*/, loadedCheerio('div#chapter-content').html() || ''];
                }
            });
        });
    };
    NovelMania.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, body, loadedCheerio, load, novels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "/novels?titulo=").concat(searchTerm, "&page=").concat(pageNo);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (res) { return res.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        load = loadedCheerio('div.top-novels.dark.col-6 > div.row.mb-2');
                        novels = load
                            .map(function (index, element) { return ({
                            name: loadedCheerio(element).find('a.novel-title > h5').text(),
                            cover: loadedCheerio(element)
                                .find('a > div.card.c-size-1.border > img.card-image')
                                .attr('src'),
                            path: loadedCheerio(element).find('a.novel-title').attr('href') || '',
                        }); })
                            .get()
                            .filter(function (novel) { return novel.name && novel.path; });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return NovelMania;
}());
exports.default = new NovelMania();
