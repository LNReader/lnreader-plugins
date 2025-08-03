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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = require("cheerio");
var fetch_1 = require("@libs/fetch");
var defaultCover_1 = require("@libs/defaultCover");
var dayjs_1 = __importDefault(require("dayjs"));
var filterInputs_1 = require("@libs/filterInputs");
var TsundokuPlugin = /** @class */ (function () {
    function TsundokuPlugin() {
        this.id = 'tsundoku';
        this.name = 'Tsundoku Traduções';
        this.version = '1.0.1';
        this.icon = 'src/pt-br/tsundoku/icon.png';
        this.site = 'https://tsundoku.com.br';
        this.filters = {
            order: {
                label: 'Ordenar por',
                value: '',
                options: [
                    { label: 'Padrão', value: '' },
                    { label: 'A-Z', value: 'title' },
                    { label: 'Z-A', value: 'titlereverse' },
                    { label: 'Atualizar', value: 'update' },
                    { label: 'Adicionar', value: 'latest' },
                    { label: 'Popular', value: 'popular' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genre: {
                label: 'Gênero',
                value: [],
                options: [
                    { label: 'Ação', value: '328' },
                    { label: 'Adult', value: '343' },
                    { label: 'Anatomia', value: '408' },
                    { label: 'Artes Marciais', value: '340' },
                    { label: 'Aventura', value: '315' },
                    { label: 'Ciência', value: '398' },
                    { label: 'Comédia', value: '322' },
                    { label: 'Comédia Romântica', value: '378' },
                    { label: 'Cotidiano', value: '399' },
                    { label: 'Drama', value: '311' },
                    { label: 'Ecchi', value: '329' },
                    { label: 'Fantasia', value: '316' },
                    { label: 'Feminismo', value: '362' },
                    { label: 'Gender Bender', value: '417' },
                    { label: 'Guerra', value: '368' },
                    { label: 'Harém', value: '350' },
                    { label: 'Hentai', value: '344' },
                    { label: 'História', value: '400' },
                    { label: 'Histórico', value: '380' },
                    { label: 'Horror', value: '317' },
                    { label: 'Humor Negro', value: '363' },
                    { label: 'Isekai', value: '318' },
                    { label: 'Josei', value: '356' },
                    { label: 'Joshikousei', value: '364' },
                    { label: 'LitRPG', value: '387' },
                    { label: 'Maduro', value: '351' },
                    { label: 'Mágia', value: '372' },
                    { label: 'Mecha', value: '335' },
                    { label: 'Militar', value: '414' },
                    { label: 'Mistério', value: '319' },
                    { label: 'Otaku', value: '365' },
                    { label: 'Psicológico', value: '320' },
                    { label: 'Reencarnação', value: '358' },
                    { label: 'Romance', value: '312' },
                    { label: 'RPG', value: '366' },
                    { label: 'Sátira', value: '367' },
                    { label: 'Sci-fi', value: '371' },
                    { label: 'Seinen', value: '326' },
                    { label: 'Sexo Explícito', value: '345' },
                    { label: 'Shoujo', value: '323' },
                    { label: 'Shounen', value: '341' },
                    { label: 'Slice-of-Life', value: '324' },
                    { label: 'Sobrenatural', value: '359' },
                    { label: 'Supernatural', value: '401' },
                    { label: 'Suspense', value: '407' },
                    { label: 'Thriller', value: '410' },
                    { label: 'Tragédia', value: '352' },
                    { label: 'Vida Escolar', value: '331' },
                    { label: 'Webtoon', value: '381' },
                    { label: 'Xianxia', value: '357' },
                    { label: 'Xuanhuan', value: '395' },
                    { label: 'Yuri', value: '313' },
                ],
                type: filterInputs_1.FilterTypes.CheckboxGroup,
            },
        };
    }
    TsundokuPlugin.prototype.parseDate = function (date) {
        var monthMapping = {
            janeiro: 1,
            fevereiro: 2,
            marco: 3,
            abril: 4,
            maio: 5,
            junho: 6,
            julho: 7,
            agosto: 8,
            setembro: 9,
            outubro: 10,
            novembro: 11,
            dezembro: 12,
        };
        var _a = date.split(/,?\s+/), month = _a[0], day = _a[1], year = _a[2];
        return (0, dayjs_1.default)("".concat(year, "-").concat(monthMapping[month.normalize('NFD').replace(/[\u0300-\u036f]/g, '')], "-").concat(day)).toISOString();
    };
    TsundokuPlugin.prototype.parseNovels = function (loadedCheerio) {
        var _this = this;
        var novels = [];
        loadedCheerio('.listupd .bsx').each(function (idx, ele) {
            var novelName = loadedCheerio(ele).find('.tt').text().trim();
            var novelUrl = loadedCheerio(ele).find('a').attr('href');
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
        return novels;
    };
    TsundokuPlugin.prototype.popularNovels = function (page_1, _a) {
        return __awaiter(this, arguments, void 0, function (page, _b) {
            var params, url, body, loadedCheerio;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        params = new URLSearchParams();
                        if (page > 1) {
                            params.append('page', "".concat(page));
                        }
                        params.append('type', 'novel');
                        if (showLatestNovels) {
                            params.append('order', 'latest');
                        }
                        else if (filters) {
                            if (filters.genre.value.length) {
                                filters.genre.value.forEach(function (value) {
                                    params.append('genre[]', value);
                                });
                            }
                            params.append('order', filters.order.value);
                        }
                        url = "".concat(this.site, "/manga/?") + params.toString();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (result) { return result.text(); })];
                    case 1:
                        body = _c.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, this.parseNovels(loadedCheerio)];
                }
            });
        });
    };
    TsundokuPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, novel, chapters;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('h1.entry-title').text() || 'Untitled',
                            cover: loadedCheerio('.main-info .thumb img').attr('src'),
                            summary: loadedCheerio('.entry-content.entry-content-single div:eq(0)')
                                .text()
                                .trim(),
                            chapters: [],
                        };
                        novel.author = loadedCheerio('.tsinfo .imptdt:contains("Autor")')
                            .text()
                            .replace('Autor ', '')
                            .trim();
                        novel.artist = loadedCheerio('.tsinfo .imptdt:contains("Artista")')
                            .text()
                            .replace('Artista ', '')
                            .trim();
                        novel.status = loadedCheerio('.tsinfo .imptdt:contains("Status")')
                            .text()
                            .replace('Status ', '')
                            .trim();
                        novel.genres = loadedCheerio('.mgen a')
                            .map(function (_, ex) { return loadedCheerio(ex).text(); })
                            .toArray()
                            .join(',');
                        chapters = [];
                        loadedCheerio('#chapterlist ul > li').each(function (idx, ele) {
                            var chapterName = loadedCheerio(ele).find('.chapternum').text().trim();
                            var chapterUrl = loadedCheerio(ele).find('a').attr('href');
                            var releaseDate = loadedCheerio(ele).find('.chapterdate').text();
                            if (!chapterUrl)
                                return;
                            chapters.push({
                                name: chapterName,
                                path: chapterUrl.replace(_this.site, ''),
                                releaseTime: _this.parseDate(releaseDate),
                            });
                        });
                        novel.chapters = chapters.reverse().map(function (c, i) { return (__assign(__assign({}, c), { name: c.name + " - Ch. ".concat(i + 1), chapterNumber: i + 1 })); });
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    TsundokuPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var params, url, body, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams();
                        if (pageNo > 1) {
                            params.append('page', "".concat(pageNo));
                        }
                        params.append('type', 'novel');
                        params.append('title', searchTerm);
                        url = "".concat(this.site, "/manga/?") + params.toString();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (result) { return result.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, this.parseNovels(loadedCheerio)];
                }
            });
        });
    };
    TsundokuPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, chapterTitle, novelTitle, title, spoilerContent, $readerarea, chapterText, parts, lastPart;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        chapterTitle = loadedCheerio('.headpost .entry-title').text();
                        novelTitle = loadedCheerio('.headpost a').text();
                        title = chapterTitle
                            .replace(novelTitle, '')
                            .replace(/^\W+/, '')
                            .trim();
                        spoilerContent = loadedCheerio('#readerarea .collapseomatic_content').html();
                        if (spoilerContent) {
                            return [2 /*return*/, "<h1>".concat(title, "</h1>\n").concat(spoilerContent)];
                        }
                        $readerarea = loadedCheerio('#readerarea');
                        $readerarea.find('img.wp-image-15656').remove(); // Remove logo messages
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
                        chapterText = $readerarea.html() || '';
                        parts = chapterText.split(/<hr ?\/?>/);
                        lastPart = parts[parts.length - 1];
                        if (parts.length > 1 && lastPart.includes('https://discord')) {
                            parts.pop();
                        }
                        return [2 /*return*/, "<h1>".concat(title, "</h1>\n").concat(parts.join('<hr />'))];
                }
            });
        });
    };
    return TsundokuPlugin;
}());
exports.default = new TsundokuPlugin();
