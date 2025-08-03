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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = require("cheerio");
var fetch_1 = require("@libs/fetch");
var novelStatus_1 = require("@libs/novelStatus");
var filterInputs_1 = require("@libs/filterInputs");
var defaultCover_1 = require("@libs/defaultCover");
var dayjs_1 = __importDefault(require("dayjs"));
var NovelDeGlacePlugin = /** @class */ (function () {
    function NovelDeGlacePlugin() {
        this.id = 'noveldeglace';
        this.name = 'NovelDeGlace';
        this.icon = 'src/fr/noveldeglace/icon.png';
        this.site = 'https://noveldeglace.com/';
        this.version = '1.0.3';
        this.filters = {
            categorie_genre: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Catégorie/Genre',
                value: 'all',
                options: [
                    { label: 'Tous', value: 'all' },
                    { label: '═══CATÉGORIES═══', value: 'categorie_roman' },
                    { label: 'Seinen', value: 'c_seinen' },
                    { label: 'Shonen', value: 'c_shonen' },
                    { label: 'Original', value: 'c_original' },
                    { label: 'Yuri', value: 'c_yuri' },
                    { label: 'Autre', value: 'c_autre' },
                    { label: 'Fille', value: 'c_fille' },
                    { label: 'Roman pour Adulte', value: 'c_roman-pour-adulte' },
                    { label: 'Xuanhuan', value: 'c_xuanhuan' },
                    { label: 'Yaoi', value: 'c_yaoi' },
                    { label: '═══GENRES═══', value: 'genre' },
                    { label: 'Action', value: 'g_action' },
                    { label: 'Aventure', value: 'g_aventure' },
                    { label: 'Comédie', value: 'g_comedie' },
                    { label: 'Drame', value: 'g_drame' },
                    { label: 'Fantastique', value: 'g_fantastique' },
                    { label: 'Harem', value: 'g_harem' },
                    { label: 'Psychologique', value: 'g_psychologique' },
                    { label: 'Romance', value: 'g_romance' },
                    { label: 'Ecchi', value: 'g_ecchi' },
                    { label: 'Mature', value: 'g_mature' },
                    { label: 'Surnaturel', value: 'g_surnaturel' },
                    { label: 'Vie scolaire', value: 'g_vie-scolaire' },
                    { label: 'Adulte', value: 'g_adulte' },
                    { label: 'Tragédie', value: 'g_tragedie' },
                    { label: 'Arts Martiaux', value: 'g_arts-martiaux' },
                    { label: 'Pas de harem', value: 'g_pas-de-harem' },
                    { label: 'Tranche de vie', value: 'g_tranche-de-vie' },
                    { label: 'Mecha', value: 'g_mecha' },
                    { label: 'Sci-fi', value: 'g_sci-fi' },
                    { label: 'Science-Fiction', value: 'g_science-fiction' },
                    { label: 'Anti-Héros', value: 'g_anti-heros' },
                    { label: 'Horreur', value: 'g_horreur' },
                    { label: 'Insectes', value: 'g_insectes' },
                    { label: 'Mystère', value: 'g_mystere' },
                    { label: 'Lolicon', value: 'g_lolicon' },
                    { label: 'Shoujo Ai', value: 'g_shoujo-ai' },
                    { label: 'Smut', value: 'g_smut' },
                    { label: 'Xuanhuan', value: 'g_xuanhuan' },
                    { label: 'Shotacon', value: 'g_shotacon' },
                ],
            },
        };
    }
    NovelDeGlacePlugin.prototype.getCheerio = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var r, body, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url, {
                            headers: { 'Accept-Encoding': 'deflate' },
                        })];
                    case 1:
                        r = _a.sent();
                        if (!r.ok)
                            return [2 /*return*/, undefined];
                        return [4 /*yield*/, r.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, loadedCheerio];
                }
            });
        });
    };
    NovelDeGlacePlugin.prototype.parseDate = function (date) {
        var monthMapping = {
            janvier: 1,
            fevrier: 2,
            mars: 3,
            avril: 4,
            mai: 5,
            juin: 6,
            juillet: 7,
            aout: 8,
            septembre: 9,
            octobre: 10,
            novembre: 11,
            decembre: 12,
        };
        var _a = date.split(' '), day = _a[0], month = _a[1], year = _a[2];
        return (0, dayjs_1.default)("".concat(day, " ").concat(monthMapping[month.normalize('NFD').replace(/[\u0300-\u036f]/g, '')], " ").concat(year), 'D MMMM YYYY').format('DD MMMM YYYY');
    };
    NovelDeGlacePlugin.prototype.parseNovels = function ($, showLatestNovels) {
        var _this = this;
        var novels = [];
        $('article').each(function (i, el) {
            var cheerio = $(el);
            var novelName = cheerio.find('h2').text().trim();
            var novelCover = cheerio.find('img').attr('src');
            var novelUrl;
            if (showLatestNovels)
                novelUrl = cheerio.find('span.Roman > a').attr('href');
            else
                novelUrl = cheerio.find('h2 > a').attr('href');
            if (novelUrl) {
                var novel = {
                    name: novelName,
                    path: novelUrl.replace(_this.site, ''),
                    cover: novelCover,
                };
                novels.push(novel);
            }
        });
        return novels;
    };
    NovelDeGlacePlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var url, cat_gen, $;
            var filters = _b.filters, showLatestNovels = _b.showLatestNovels;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        url = this.site;
                        if (showLatestNovels)
                            url += 'chapitre';
                        else {
                            cat_gen = 'all';
                            if (filters && typeof filters.categorie_genre.value == 'string')
                                cat_gen = filters.categorie_genre.value;
                            if (cat_gen != 'all' &&
                                cat_gen != 'categorie_roman' &&
                                cat_gen != 'genre') {
                                if (cat_gen[0] == 'c')
                                    url += 'categorie_roman/' + cat_gen.substring(2);
                                else if (cat_gen[0] == 'g')
                                    url += 'genre/' + cat_gen.substring(2);
                            }
                            else if (pageNo > 1)
                                return [2 /*return*/, []]; // when asking for all novels, there is only 1 page
                            else
                                url += 'roman';
                        }
                        url += '/page/' + pageNo;
                        return [4 /*yield*/, this.getCheerio(url)];
                    case 1:
                        $ = _c.sent();
                        if (!$)
                            return [2 /*return*/, []];
                        return [2 /*return*/, this.parseNovels($, showLatestNovels)];
                }
            });
        });
    };
    NovelDeGlacePlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var $, novel, novelInfos, categorie, genres, status, novelChapters, volumes, hasMultipleVolumes, chapterName, site;
            var _this = this;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getCheerio(this.site + novelPath)];
                    case 1:
                        $ = _c.sent();
                        if (!$)
                            throw new Error('Failed to load page (open in web view)');
                        novel = { path: novelPath, name: 'Untitled' };
                        novel.name =
                            ((_b = (_a = $('div.entry-content > div > strong')[0].nextSibling) === null || _a === void 0 ? void 0 : _a.nodeValue) === null || _b === void 0 ? void 0 : _b.trim()) || 'Untitled';
                        novel.cover = $('.su-row > div > div > img').attr('src') || defaultCover_1.defaultCover;
                        novelInfos = $('div[data-title=Tomes] >').toArray();
                        novelInfos.pop();
                        novelInfos.shift();
                        novel.summary =
                            $('div[data-title=Synopsis]').text().trim() +
                                '\n\n' +
                                novelInfos
                                    .map(function (el) { return $(el).text(); })
                                    .join('\n')
                                    .trim();
                        novel.author = $("strong:contains('Auteur :')")
                            .parent()
                            .text()
                            .replace('Auteur : ', '')
                            .trim();
                        novel.artist = $("strong:contains('Illustrateur :')")
                            .parent()
                            .text()
                            .replace('Illustrateur :', '')
                            .trim();
                        categorie = $('.categorie').text().replace('Catégorie :', '').trim();
                        genres = $('.genre')
                            .text()
                            .replace('Genre :', '')
                            .replace(/, /g, ',')
                            .trim();
                        if (categorie && categorie != 'Autre')
                            novel.genres = categorie;
                        if (genres)
                            novel.genres = novel.genres ? novel.genres + ',' + genres : genres;
                        status = $("strong:contains('Statut :')").parent().attr('class');
                        switch (status) {
                            case 'type etat0':
                            case 'type etat1':
                                novel.status = novelStatus_1.NovelStatus.Ongoing;
                                break;
                            case 'type etat4':
                                novel.status = novelStatus_1.NovelStatus.OnHiatus;
                                break;
                            case 'type etat5':
                                novel.status = novelStatus_1.NovelStatus.Completed;
                                break;
                            case 'type etat6':
                                novel.status = novelStatus_1.NovelStatus.Cancelled;
                                break;
                            default:
                                novel.status = novelStatus_1.NovelStatus.Unknown;
                                break;
                        }
                        novelChapters = [];
                        volumes = $('div[data-title=Tomes] > div').last().contents();
                        hasMultipleVolumes = volumes.length > 1;
                        chapterName = '';
                        site = this.site;
                        volumes.each(function (volumeIndex, el) {
                            if (hasMultipleVolumes)
                                chapterName = 'T.' + (volumeIndex + 1) + ' ';
                            $(el)
                                .find('.chpt')
                                .each(function (chapterIndex, el) {
                                var _a, _b, _c;
                                var cheerio = $(el);
                                var newChapterName = chapterName + cheerio.find('a').first().text().trim() || '';
                                if (!cheerio.find('i.fa').length) {
                                    // no parts
                                    var dateHtml = ((_a = cheerio.html()) === null || _a === void 0 ? void 0 : _a.substring(((_b = cheerio.html()) === null || _b === void 0 ? void 0 : _b.indexOf('</a>')) || 0)) ||
                                        '';
                                    var releaseDate = (dateHtml === null || dateHtml === void 0 ? void 0 : dateHtml.substring(dateHtml.indexOf('(') + 1, dateHtml.indexOf(')'))) || undefined;
                                    var chapterUrl = cheerio.find('a').attr('href');
                                    if (chapterUrl) {
                                        var chapter = {
                                            name: newChapterName,
                                            releaseTime: _this.parseDate(releaseDate),
                                            path: chapterUrl.replace(site, ''),
                                            chapterNumber: chapterIndex,
                                        };
                                        novelChapters.push(chapter);
                                    }
                                } // has parts that needs to be added individually
                                else {
                                    var items = ((_c = cheerio.find('i').parent().next().html()) === null || _c === void 0 ? void 0 : _c.split('</a>')) || [];
                                    items === null || items === void 0 ? void 0 : items.shift();
                                    var dates_1 = [];
                                    items === null || items === void 0 ? void 0 : items.forEach(function (item) {
                                        // there is a date on every publish parts
                                        dates_1.push(item.substring(item.indexOf('(') + 1, item.indexOf(')')));
                                    });
                                    var hrefs_1 = [];
                                    cheerio
                                        .find('i')
                                        .parent()
                                        .next()
                                        .find('a')
                                        .each(function () {
                                        hrefs_1.push(this['attribs']['href']);
                                    });
                                    if (dates_1.length == hrefs_1.length)
                                        dates_1.forEach(function (date, index) {
                                            var chapter = {
                                                name: newChapterName + ' (' + (index + 1) + ')',
                                                releaseTime: _this.parseDate(date),
                                                path: hrefs_1[index].replace(site, ''),
                                                chapterNumber: chapterIndex + (index + 1) / 1000,
                                            };
                                            novelChapters.push(chapter);
                                        });
                                }
                            });
                        });
                        novel.chapters = novelChapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    NovelDeGlacePlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var $, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCheerio(this.site + chapterPath)];
                    case 1:
                        $ = _a.sent();
                        if (!$)
                            throw new Error('Failed to load page (open in web view)');
                        $('.mistape_caption').remove();
                        chapterText = $('.chapter-content').html() || $('.entry-content').html() || '';
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    NovelDeGlacePlugin.prototype.searchNovels = function (searchTerm, num) {
        return __awaiter(this, void 0, void 0, function () {
            var url, $, novels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (num !== 1)
                            return [2 /*return*/, []]; // only 1 page of results
                        url = this.site + 'roman';
                        return [4 /*yield*/, this.getCheerio(url)];
                    case 1:
                        $ = _a.sent();
                        if (!$)
                            throw new Error('Failed to load page (open in web view)');
                        novels = this.parseNovels($, false);
                        novels = novels.filter(function (novel) {
                            return novel.name
                                .toLowerCase()
                                .normalize('NFD')
                                .replace(/[\u0300-\u036f]/g, '')
                                .trim()
                                .includes(searchTerm
                                .toLowerCase()
                                .normalize('NFD')
                                .replace(/[\u0300-\u036f]/g, '')
                                .trim());
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return NovelDeGlacePlugin;
}());
exports.default = new NovelDeGlacePlugin();
