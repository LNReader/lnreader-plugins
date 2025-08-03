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
var filterInputs_1 = require("@libs/filterInputs");
var dayjs_1 = __importDefault(require("dayjs"));
var defaultCover_1 = require("@libs/defaultCover");
var novelStatus_1 = require("@libs/novelStatus");
var ChireadsPlugin = /** @class */ (function () {
    function ChireadsPlugin() {
        this.id = 'chireads';
        this.name = 'Chireads';
        this.icon = 'src/fr/chireads/icon.png';
        this.site = 'https://chireads.com';
        this.version = '1.0.2';
        this.filters = {
            tag: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Tag',
                value: 'all',
                options: [
                    { label: 'Tous', value: 'all' },
                    { label: 'Arts martiaux', value: 'arts-martiaux' },
                    { label: 'De faible à fort', value: 'de-faible-a-fort' },
                    { label: 'Adapté en manhua', value: 'adapte-en-manhua' },
                    { label: 'Cultivation', value: 'cultivation' },
                    { label: 'Action', value: 'action' },
                    { label: 'Aventure', value: 'aventure' },
                    { label: 'Monstres', value: 'monstres' },
                    { label: 'Xuanhuan', value: 'xuanhuan' },
                    { label: 'Fantastique', value: 'fantastique' },
                    { label: 'Adapté en Animé', value: 'adapte-en-anime' },
                    { label: 'Alchimie', value: 'alchimie' },
                    { label: 'Éléments de jeux', value: 'elements-de-jeux' },
                    { label: 'Calme Protagoniste', value: 'calme-protagoniste' },
                    {
                        label: 'Protagoniste intelligent',
                        value: 'protagoniste-intelligent',
                    },
                    { label: 'Polygamie', value: 'polygamie' },
                    { label: 'Belle femelle Lea', value: 'belle-femelle-lea' },
                    { label: 'Personnages arrogants', value: 'personnages-arrogants' },
                    { label: 'Système de niveau', value: 'systeme-de-niveau' },
                    { label: 'Cheat', value: 'cheat' },
                    { label: 'Protagoniste génie', value: 'protagoniste-genie' },
                    { label: 'Comédie', value: 'comedie' },
                    { label: 'Gamer', value: 'gamer' },
                    { label: 'Mariage', value: 'mariage' },
                    { label: 'seeking Protag', value: 'seeking-protag' },
                    { label: 'Romance précoce', value: 'romance-precoce' },
                    { label: 'Croissance accélérée', value: 'croissance-acceleree' },
                    { label: 'Artefacts', value: 'artefacts' },
                    {
                        label: 'Intelligence artificielle',
                        value: 'intelligence-artificielle',
                    },
                    { label: 'Mariage arrangé', value: 'mariage-arrange' },
                    { label: 'Mature', value: 'mature' },
                    { label: 'Adulte', value: 'adulte' },
                    {
                        label: 'Administrateur de système',
                        value: 'administrateur-de-systeme',
                    },
                    { label: 'Beau protagoniste', value: 'beau-protagoniste' },
                    {
                        label: 'Protagoniste charismatique',
                        value: 'protagoniste-charismatique',
                    },
                    { label: 'Protagoniste masculin', value: 'protagoniste-masculin' },
                    { label: 'Démons', value: 'demons' },
                    { label: 'Reincarnation', value: 'reincarnation' },
                    { label: 'Académie', value: 'academie' },
                    {
                        label: 'Cacher les vraies capacités',
                        value: 'cacher-les-vraies-capacites',
                    },
                    {
                        label: 'Protagoniste surpuissant',
                        value: 'protagoniste-surpuissant',
                    },
                    { label: 'Joueur', value: 'joueur' },
                    {
                        label: 'Protagoniste fort dès le départ',
                        value: 'protagoniste-fort-des-le-depart',
                    },
                    { label: 'Immortels', value: 'immortels' },
                    { label: 'Cultivation rapide', value: 'cultivation-rapide' },
                    { label: 'Harem', value: 'harem' },
                    { label: 'Assasins', value: 'assasins' },
                    { label: 'De pauvre à riche', value: 'de-pauvre-a-riche' },
                    {
                        label: 'Système de classement de jeux',
                        value: 'systeme-de-classement-de-jeux',
                    },
                    { label: 'Capacités spéciales', value: 'capacites-speciales' },
                    { label: 'Vengeance', value: 'vengeance' },
                ],
            },
        };
    }
    ChireadsPlugin.prototype.getCheerio = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var r, body, $;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url, {
                            headers: { 'Accept-Encoding': 'deflate' },
                        })];
                    case 1:
                        r = _a.sent();
                        return [4 /*yield*/, r.text()];
                    case 2:
                        body = _a.sent();
                        $ = (0, cheerio_1.load)(body);
                        return [2 /*return*/, $];
                }
            });
        });
    };
    ChireadsPlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var url, tag, $, novels, novel, loop, i, romans, populaire, novelCover_1, novelName_1, novelUrl_1, imgs_1, txts;
            var _this = this;
            var filters = _b.filters, showLatestNovels = _b.showLatestNovels;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        url = this.site;
                        tag = 'all';
                        if (showLatestNovels)
                            url += '/category/translatedtales/page/' + pageNo;
                        else {
                            if (filters &&
                                typeof filters.tag.value === 'string' &&
                                filters.tag.value !== 'all')
                                tag = filters.tag.value;
                            if (tag !== 'all')
                                url += '/tag/' + tag + '/page/' + pageNo;
                            else if (pageNo > 1)
                                return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, this.getCheerio(url)];
                    case 1:
                        $ = _c.sent();
                        novels = [];
                        if (!(showLatestNovels || tag !== 'all')) return [3 /*break*/, 7];
                        loop = 1;
                        if (showLatestNovels)
                            loop = 2;
                        i = 0;
                        _c.label = 2;
                    case 2:
                        if (!(i < loop)) return [3 /*break*/, 6];
                        if (!(i === 1)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getCheerio(this.site + '/category/original/page/' + pageNo)];
                    case 3:
                        $ = _c.sent();
                        _c.label = 4;
                    case 4:
                        romans = $('.romans-content li');
                        if (!romans.length)
                            romans = $('#content li');
                        romans.each(function (i, elem) {
                            var novelName = $(elem)
                                .contents()
                                .find('div')
                                .first()
                                .text()
                                .trim();
                            var novelCover = $(elem)
                                .find('div')
                                .first()
                                .find('img')
                                .attr('src');
                            var novelUrl = $(elem).find('div').first().find('a').attr('href');
                            if (novelUrl) {
                                novel = {
                                    name: novelName,
                                    cover: novelCover,
                                    path: novelUrl.replace(_this.site, ''),
                                };
                                novels.push(novel);
                            }
                        });
                        _c.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 2];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        populaire = $(':contains("Populaire")')
                            .last()
                            .parent()
                            .next()
                            .find('li > div');
                        if (populaire.length === 12) {
                            populaire.each(function (i, elem) {
                                if (i % 2 === 0)
                                    novelCover_1 = $(elem).find('img').attr('src');
                                else {
                                    novelName_1 = $(elem).text().trim();
                                    novelUrl_1 = $(elem).find('a').attr('href');
                                    if (!novelUrl_1)
                                        return;
                                    novel = {
                                        name: novelName_1,
                                        cover: novelCover_1 || defaultCover_1.defaultCover,
                                        path: novelUrl_1.replace(_this.site, ''),
                                    };
                                    novels.push(novel);
                                }
                            });
                        } // mobile
                        else {
                            imgs_1 = populaire.find('div.popular-list-img img');
                            txts = populaire.find('div.popular-list-name');
                            txts.each(function (i, elem) {
                                var novelName = $(elem).text().trim();
                                var novelCover = $(imgs_1[i]).attr('src');
                                var novelUrl = $(elem).find('a').attr('href');
                                if (novelUrl) {
                                    novel = {
                                        name: novelName,
                                        cover: novelCover,
                                        path: novelUrl.replace(_this.site, ''),
                                    };
                                    novels.push(novel);
                                }
                            });
                        }
                        _c.label = 8;
                    case 8: return [2 /*return*/, novels];
                }
            });
        });
    };
    ChireadsPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var novel, $, infos, chapters, chapterList;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        novel = { path: novelPath, name: 'Sans titre' };
                        return [4 /*yield*/, this.getCheerio(this.site + novelPath)];
                    case 1:
                        $ = _a.sent();
                        novel.name =
                            $('.inform-product-txt').first().text().trim() ||
                                $('.inform-title').text().trim();
                        novel.cover =
                            $('.inform-product img').attr('src') ||
                                $('.inform-product-img img').attr('src') ||
                                defaultCover_1.defaultCover;
                        novel.summary =
                            $('.inform-inform-txt').text().trim() ||
                                $('.inform-intr-txt').text().trim();
                        infos = $('div.inform-product-txt > div.inform-intr-col').text().trim() ||
                            $('div.inform-inform-data > h6').text().trim();
                        if (infos.includes('Auteur : '))
                            novel.author = infos
                                .substring(infos.indexOf('Auteur : ') + 9, infos.indexOf('Statut de Parution : '))
                                .trim();
                        else if (infos.includes('Fantrad : '))
                            novel.author = infos
                                .substring(infos.indexOf('Fantrad : ') + 10, infos.indexOf('Statut de Parution : '))
                                .trim();
                        else
                            novel.author = 'Inconnu';
                        switch (infos.substring(infos.indexOf('Statut de Parution : ') + 21).toLowerCase()) {
                            case 'en pause':
                                novel.status = novelStatus_1.NovelStatus.OnHiatus;
                                break;
                            case 'complet':
                                novel.status = novelStatus_1.NovelStatus.Completed;
                                break;
                            default:
                                novel.status = novelStatus_1.NovelStatus.Ongoing;
                                break;
                        }
                        chapters = [];
                        chapterList = $('.chapitre-table a');
                        if (!chapterList.length) {
                            $('div.inform-annexe-list').first().remove();
                            chapterList = $('.inform-annexe-list').find('a');
                        }
                        chapterList.each(function (i, elem) {
                            var chapterName = $(elem).text().trim();
                            var chapterUrl = $(elem).attr('href');
                            var releaseDate = (0, dayjs_1.default)(chapterUrl === null || chapterUrl === void 0 ? void 0 : chapterUrl.substring(chapterUrl.length - 11, chapterUrl.length - 1)).format('DD MMMM YYYY');
                            if (chapterUrl) {
                                chapters.push({
                                    name: chapterName,
                                    releaseTime: releaseDate,
                                    path: chapterUrl.replace(_this.site, ''),
                                });
                            }
                        });
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    ChireadsPlugin.prototype.parseChapter = function (chapterUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var $, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCheerio(this.site + chapterUrl)];
                    case 1:
                        $ = _a.sent();
                        chapterText = $('#content').html() || '';
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    ChireadsPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var novels, i, finised;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo !== 1)
                            return [2 /*return*/, []];
                        novels = [];
                        i = 1;
                        finised = false;
                        _a.label = 1;
                    case 1:
                        if (!!finised) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.popularNovels(i, {
                                showLatestNovels: true,
                                filters: undefined,
                            }).then(function (res) {
                                if (res.length === 0)
                                    finised = true;
                                novels.push.apply(novels, res);
                            })];
                    case 2:
                        _a.sent();
                        i++;
                        return [3 /*break*/, 1];
                    case 3:
                        novels = novels.filter(function (novel) {
                            return novel.name
                                .toLowerCase()
                                .normalize('NFD')
                                .replace(/[\u0300-\u036f]/g, '')
                                .includes(searchTerm
                                .toLowerCase()
                                .normalize('NFD')
                                .replace(/[\u0300-\u036f]/g, ''));
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return ChireadsPlugin;
}());
exports.default = new ChireadsPlugin();
