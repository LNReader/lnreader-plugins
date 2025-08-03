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
var novelStatus_1 = require("@libs/novelStatus");
var KissWoodPlugin = /** @class */ (function () {
    function KissWoodPlugin() {
        this.id = 'kisswood';
        this.name = 'KissWood';
        this.icon = 'src/fr/kisswood/icon.png';
        this.site = 'https://kisswood.eu';
        this.version = '1.0.0';
        this.regexAuthors = [/Auteur :([^\n]*)/, /Auteur\u00A0:([^\n]*)/];
    }
    KissWoodPlugin.prototype.getCheerio = function (url) {
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
    KissWoodPlugin.prototype.getNovelsCovers = function (novels, listUrlCover) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(novels.map(function (novel, index) { return __awaiter(_this, void 0, void 0, function () {
                            var urlCover, _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        urlCover = listUrlCover[index];
                                        if (!urlCover) return [3 /*break*/, 2];
                                        _a = novel;
                                        _b = this.findCoverImage;
                                        return [4 /*yield*/, this.getCheerio(urlCover)];
                                    case 1:
                                        _a.cover = _b.apply(this, [_c.sent()]);
                                        _c.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    KissWoodPlugin.prototype.getNovelInfo = function (novel, url) {
        return __awaiter(this, void 0, void 0, function () {
            var $, textArray, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCheerio(url)];
                    case 1:
                        $ = _a.sent();
                        textArray = $('.entry-content p')
                            .map(function (_, element) { return $(element).text().trim(); })
                            .get()
                            .join('\n')
                            .split('\n');
                        index = textArray.findIndex(function (element) {
                            return [
                                'Traducteur Anglais- Français',
                                'Titre en français',
                                '———',
                                'Titre :',
                                'Lien vers le premier chapitre',
                                '____________',
                                'Auteur : ',
                            ].some(function (marker) { return element.includes(marker); });
                        });
                        novel.summary = (index !== -1 ? textArray.slice(0, index) : textArray)
                            .join('\n')
                            .replace('Synopsis :', '');
                        novel.author = this.extractInfo(textArray.join('\n'), this.regexAuthors);
                        novel.cover = this.findCoverImage($);
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    KissWoodPlugin.prototype.findCoverImage = function ($) {
        return ($('div p img').first().attr('src') ||
            $('figure a img').first().attr('src') ||
            $('figure img').first().attr('src') ||
            defaultCover_1.defaultCover);
    };
    KissWoodPlugin.prototype.extractInfo = function (text, regexes) {
        for (var _i = 0, regexes_1 = regexes; _i < regexes_1.length; _i++) {
            var regex = regexes_1[_i];
            var match = regex.exec(text);
            if (match !== null) {
                return match[1].trim();
            }
        }
        return '';
    };
    KissWoodPlugin.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var novels, $, listUrlCover;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        novels = [];
                        return [4 /*yield*/, this.getCheerio(this.site)];
                    case 1:
                        $ = _a.sent();
                        listUrlCover = [];
                        $('nav div div ul li ul li').each(function (i, elem) {
                            if ($(elem).text().trim() === 'Sommaire') {
                                var novelName = $(elem)
                                    .closest('ul')
                                    .siblings('a')
                                    .first()
                                    .text()
                                    .trim();
                                var novelUrl = $(elem).find('a').attr('href');
                                if (novelUrl && novelName) {
                                    var urlCover = $(elem).parent().find('a').attr('href');
                                    if (urlCover) {
                                        listUrlCover.push(urlCover);
                                    }
                                    else {
                                        listUrlCover.push('');
                                    }
                                    var novel = {
                                        name: novelName,
                                        path: novelUrl.replace(_this.site, ''),
                                        cover: defaultCover_1.defaultCover,
                                    };
                                    novels.push(novel);
                                }
                            }
                        });
                        return [4 /*yield*/, this.getNovelsCovers(novels, listUrlCover)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    KissWoodPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var novel, $, novelUrl, chapterSelectors, chapters;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        novel = {
                            path: novelPath,
                            name: 'Sans titre',
                            status: novelStatus_1.NovelStatus.Ongoing,
                        };
                        return [4 /*yield*/, this.getCheerio(this.site + novelPath)];
                    case 1:
                        $ = _a.sent();
                        novelUrl = null;
                        $('nav div div ul li ul li').each(function (i, elem) {
                            if ($(elem).find('a').attr('href') === _this.site + novelPath) {
                                novelUrl = $(elem).parent().find('a').first().attr('href');
                                novel.name = $(elem).closest('ul').siblings('a').first().text().trim();
                                return;
                            }
                        });
                        if (!novelUrl) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getNovelInfo(novel, novelUrl)];
                    case 2:
                        novel = _a.sent();
                        _a.label = 3;
                    case 3:
                        chapterSelectors = [
                            '.entry-content ul li a',
                            '.entry-content ul li ul li a',
                            '.entry-content p a',
                            '.entry-content li a',
                            '.entry-content blockquote a',
                        ].join(', ');
                        chapters = [];
                        $(chapterSelectors).each(function (i, elem) {
                            var _a;
                            var chapterName = $(elem).text().trim();
                            var chapterUrl = (_a = $(elem).attr('href')) === null || _a === void 0 ? void 0 : _a.replace('http://', 'https://');
                            if (chapterUrl &&
                                chapterName &&
                                chapterUrl.includes(_this.site) &&
                                // We remove the unnecessary links to Facebook, X, and the homepage from the chapters.
                                !chapterUrl.includes('share=facebook') &&
                                !chapterUrl.includes('share=x') &&
                                !chapterUrl.includes('/category/traductions/') &&
                                !chapterUrl.includes('/category/tour-des-mondes/') &&
                                // Removal of duplicates
                                !chapters.some(function (chapter) { return _this.site + chapter.path === chapterUrl; })) {
                                chapters.push({
                                    name: chapterName,
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
    KissWoodPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var $, elements, hrIndexes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCheerio(this.site + chapterPath)];
                    case 1:
                        $ = _a.sent();
                        elements = $('.entry-content')
                            .contents()
                            .map(function (_, el) { return $.html(el); })
                            .get();
                        hrIndexes = elements
                            .map(function (elem, index) { return (elem.includes('<hr>') ? index : -1); })
                            .filter(function (index) { return index !== -1; });
                        if (hrIndexes.length === 0) {
                            hrIndexes = [
                                0,
                                elements.findIndex(function (element) {
                                    return element.includes('https://fr.tipeee.com/kisswood/') ||
                                        element.includes('>Sommaire</a>') ||
                                        element.includes('>Chapitre Suivant</a>') ||
                                        element.includes('———————————————————————————-') ||
                                        element.includes('share=facebook');
                                }),
                            ];
                        }
                        else if (hrIndexes.length === 1) {
                            hrIndexes.unshift(0);
                        }
                        else {
                            hrIndexes[0] += 1;
                        }
                        return [2 /*return*/, elements.slice(hrIndexes[0], hrIndexes[1]).join('\n')];
                }
            });
        });
    };
    KissWoodPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var popularNovels, novels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo !== 1)
                            return [2 /*return*/, []];
                        popularNovels = this.popularNovels(1);
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
    return KissWoodPlugin;
}());
exports.default = new KissWoodPlugin();
