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
var defaultCover_1 = require("@libs/defaultCover");
var novelStatus_1 = require("@libs/novelStatus");
var dayjs_1 = __importDefault(require("dayjs"));
var PhenixScansTradPlugin = /** @class */ (function () {
    function PhenixScansTradPlugin() {
        this.id = 'phenixscans';
        this.name = 'PhenixScans';
        this.icon = 'src/fr/phenixscans/icon.png';
        this.site = 'https://phenixscans.fr';
        this.version = '1.0.1';
        this.filters = {
            genre: {
                type: filterInputs_1.FilterTypes.CheckboxGroup,
                label: 'Genre',
                value: [],
                options: [
                    { label: 'Action', value: 'action' },
                    {
                        label: 'Action Adventure Fantaisie Psychologique',
                        value: 'action-adventure-fantaisie-psychologique',
                    },
                    {
                        label: 'Action Arts martiaux Aventure Fantastique Surnaturel',
                        value: 'action-arts-martiaux-aventure-fantastique-surnaturel',
                    },
                    {
                        label: 'Action Aventure Fantastique',
                        value: 'action-aventure-fantastique',
                    },
                    { label: 'Action Drame Shônen', value: 'action-drame-shonen' },
                    { label: 'Adult', value: 'adult' },
                    { label: 'Adventure', value: 'adventure' },
                    { label: 'amitié', value: 'amitie' },
                    { label: 'amour', value: 'amour' },
                    { label: 'Art-martiaux', value: 'art-martiaux' },
                    { label: 'Arts-martiaux', value: 'arts-martiaux' },
                    { label: 'Aventure', value: 'aventure' },
                    { label: 'Combat', value: 'combat' },
                    { label: 'Comedie', value: 'comedie' },
                    { label: 'Comedy', value: 'comedy' },
                    { label: 'Demons', value: 'demons' },
                    { label: 'Dragon', value: 'dragon' },
                    { label: 'Drama', value: 'drama' },
                    { label: 'Drame', value: 'drame' },
                    { label: 'Ecchi', value: 'ecchi' },
                    { label: 'Fantaisie', value: 'fantaisie' },
                    { label: 'fantastique', value: 'fantastique' },
                    { label: 'Fantasy', value: 'fantasy' },
                    { label: 'Ghosts', value: 'ghosts' },
                    { label: 'Harem', value: 'harem' },
                    { label: 'Historical', value: 'historical' },
                    { label: 'Historique', value: 'historique' },
                    { label: 'Horreur', value: 'horreur' },
                    { label: 'Horror', value: 'horror' },
                    { label: 'Isekai', value: 'isekai' },
                    { label: 'Josei', value: 'josei' },
                    { label: 'longstrip art', value: 'longstrip-art' },
                    { label: 'Magic', value: 'magic' },
                    { label: 'Magie', value: 'magie' },
                    { label: 'Male Protagonist', value: 'male-protagonist' },
                    { label: 'manga', value: 'manga' },
                    { label: 'Manhwa', value: 'manhwa' },
                    { label: 'Manhwa Player', value: 'manhwa-player' },
                    { label: 'Manwha', value: 'manwha' },
                    { label: 'Martial Arts', value: 'martial-arts' },
                    { label: 'Mature', value: 'mature' },
                    { label: 'Monstre', value: 'monstre' },
                    { label: 'Murim', value: 'murim' },
                    { label: 'mystère', value: 'mystere' },
                    { label: 'Mystery', value: 'mystery' },
                    { label: 'Necromancien', value: 'necromancien' },
                    { label: 'necromencer', value: 'necromencer' },
                    { label: 'Novel', value: 'novel' },
                    { label: 'One Shot', value: 'one-shot' },
                    { label: 'Over Power MC', value: 'over-power-mc' },
                    { label: 'Partenaire', value: 'partenaire' },
                    { label: 'Player', value: 'player' },
                    { label: 'Player Manhwa', value: 'player-manhwa' },
                    { label: 'Portail', value: 'portail' },
                    { label: 'Psychological', value: 'psychological' },
                    { label: 'Psychologique', value: 'psychologique' },
                    { label: 'regresseur', value: 'regresseur' },
                    { label: 'régression', value: 'regression' },
                    { label: 'Réincarnation', value: 'reincarnation' },
                    { label: 'Returner', value: 'returner' },
                    { label: 'Romance', value: 'romance' },
                    { label: 'School Life', value: 'school-life' },
                    { label: 'Sci-fi', value: 'sci-fi' },
                    { label: 'Seinen', value: 'seinen' },
                    { label: 'Shôjo', value: 'shojo' },
                    { label: 'Shônen', value: 'shonen' },
                    { label: 'Shotacon', value: 'shotacon' },
                    { label: 'Shoujo', value: 'shoujo' },
                    { label: 'Shounen', value: 'shounen' },
                    { label: 'Slice of Life', value: 'slice-of-life' },
                    { label: 'Slide of Life', value: 'slide-of-life' },
                    { label: 'Smut', value: 'smut' },
                    { label: 'Sports', value: 'sports' },
                    { label: 'Supernatural', value: 'supernatural' },
                    { label: 'Surnaturel', value: 'surnaturel' },
                    { label: 'Système', value: 'systeme' },
                    { label: 'Tragédie', value: 'tragedie' },
                    { label: 'Tragedy', value: 'tragedy' },
                    { label: 'Webtoons', value: 'webtoons' },
                ],
            },
        };
    }
    PhenixScansTradPlugin.prototype.getCheerio = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var r, body, $;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
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
    PhenixScansTradPlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var novels, novel, filter, key, _i, _c, value, order, url, $;
            var _this = this;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        novels = [];
                        filter = '';
                        for (key in filters) {
                            if (typeof filters[key].value === 'object') {
                                for (_i = 0, _c = filters[key].value; _i < _c.length; _i++) {
                                    value = _c[_i];
                                    filter += "&genre%5B%5D=".concat(value);
                                }
                            }
                        }
                        order = showLatestNovels ? 'update' : 'popular';
                        url = "".concat(this.site, "/manga/?page=").concat(pageNo).concat(filter, "&status=&type=novel&order=").concat(order);
                        return [4 /*yield*/, this.getCheerio(url)];
                    case 1:
                        $ = _d.sent();
                        $('div div div div a').each(function (i, elem) {
                            var _a;
                            var novelName = (_a = $(elem).attr('title')) === null || _a === void 0 ? void 0 : _a.trim();
                            var novelUrl = $(elem).attr('href');
                            var novelCover = $(elem).find('div img').attr('src') || defaultCover_1.defaultCover;
                            if (novelUrl && novelName) {
                                novel = {
                                    name: novelName,
                                    cover: novelCover,
                                    path: novelUrl.replace(_this.site, ''),
                                };
                                novels.push(novel);
                            }
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    PhenixScansTradPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var novel, $, chapters;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        novel = {
                            path: novelPath,
                            name: 'Sans titre',
                        };
                        return [4 /*yield*/, this.getCheerio(this.site + novelPath)];
                    case 1:
                        $ = _a.sent();
                        novel.name = $('h1[itemprop=name]').text().replace('– Novel', '').trim();
                        novel.cover =
                            $('div[itemprop=image] img').first().attr('src') || defaultCover_1.defaultCover;
                        novel.author = $('.fmed b:contains(Auteur)+span').text().trim();
                        novel.genres = $('.mgen a')
                            .map(function () {
                            return $(this).text();
                        })
                            .get()
                            .join(', ');
                        novel.summary = $('.entry-content[itemprop=description]').text().trim();
                        novel.status = this.getStatus($('.tsinfo .imptdt:contains(Statut)').text().replace('Statut', '').trim());
                        chapters = [];
                        $('ul li:has(div.chbox):has(div.eph-num)').each(function (i, elem) {
                            var chapterName = $(elem).find('a .chapternum').text().trim();
                            var chapterUrl = $(elem).find('a').attr('href');
                            var releaseDate = _this.parseDate($(elem).find('a .chapterdate').text());
                            if (chapterUrl && chapterUrl.includes(_this.site) && chapterName) {
                                chapters.push({
                                    name: chapterName,
                                    path: chapterUrl.replace(_this.site, ''),
                                    releaseTime: releaseDate,
                                });
                            }
                        });
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    PhenixScansTradPlugin.prototype.parseDate = function (date) {
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
    PhenixScansTradPlugin.prototype.getStatus = function (status) {
        var lowerCaseStatus = status.toLowerCase();
        var ongoing = ['en cours', 'en cours de publication'];
        var onhiatus = ['en pause', 'en attente'];
        var completed = ['complété', 'fini', 'achevé', 'terminé'];
        var cancelled = ['abandonné'];
        if (ongoing.includes(lowerCaseStatus)) {
            return novelStatus_1.NovelStatus.Ongoing;
        }
        else if (onhiatus.includes(lowerCaseStatus)) {
            return novelStatus_1.NovelStatus.OnHiatus;
        }
        else if (completed.includes(lowerCaseStatus)) {
            return novelStatus_1.NovelStatus.Completed;
        }
        else if (cancelled.includes(lowerCaseStatus)) {
            return novelStatus_1.NovelStatus.Cancelled;
        }
        return novelStatus_1.NovelStatus.Unknown;
    };
    PhenixScansTradPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var $;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCheerio(this.site + chapterPath)];
                    case 1:
                        $ = _a.sent();
                        return [2 /*return*/, $('#readerarea').html() || ''];
                }
            });
        });
    };
    PhenixScansTradPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var popularNovels, novels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo !== 1)
                            return [2 /*return*/, []];
                        popularNovels = this.popularNovels(1, {
                            showLatestNovels: true,
                            filters: undefined,
                        });
                        return [4 /*yield*/, popularNovels];
                    case 1:
                        novels = (_a.sent()).filter(function (novel) {
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
    return PhenixScansTradPlugin;
}());
exports.default = new PhenixScansTradPlugin();
