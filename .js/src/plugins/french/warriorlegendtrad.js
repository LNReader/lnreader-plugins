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
var defaultCover_1 = require("@libs/defaultCover");
var novelStatus_1 = require("@libs/novelStatus");
var dayjs_1 = __importDefault(require("dayjs"));
var WarriorLegendTradPlugin = /** @class */ (function () {
    function WarriorLegendTradPlugin() {
        this.id = 'warriorlegendtrad';
        this.name = 'Warrior Legend Trad';
        this.icon = 'src/fr/warriorlegendtrad/icon.png';
        this.site = 'https://warriorlegendtrad.wordpress.com';
        this.version = '1.0.1';
        this.regexAuthors = [/Auteur\u00A0:([^\n]*)/];
        this.regexGenres = [/Genre :([^\n]*)/];
        this.regexSummary = [/Synopsis\u00A0:([\s\S]*)index chapitre :/i];
    }
    WarriorLegendTradPlugin.prototype.getCheerio = function (url) {
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
    WarriorLegendTradPlugin.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var novels, novel, url, $;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo > 2)
                            return [2 /*return*/, []];
                        novels = [];
                        // light novel
                        if (pageNo === 1) {
                            url = this.site + '/light-novel';
                        }
                        // Original creation
                        else {
                            url = this.site + '/crea';
                        }
                        return [4 /*yield*/, this.getCheerio(url)];
                    case 1:
                        $ = _a.sent();
                        $('div div div article').each(function (i, elem) {
                            var novelName = $(elem).find('.entry-wrapper h2').first().text().trim();
                            var novelUrl = $(elem).find('.entry-wrapper h2 a').attr('href');
                            var novelCover = $(elem).find('figure a img').attr('src') || defaultCover_1.defaultCover;
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
    WarriorLegendTradPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var novel, $, entryContentText, chapters;
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
                        novel.name = $('.site-main article header h1').text().trim();
                        novel.cover =
                            $('.site-main article figure img').first().attr('src') || defaultCover_1.defaultCover;
                        entryContentText = $('.entry-content').text();
                        novel.author = this.extractInfo(entryContentText, this.regexAuthors);
                        novel.genres = this.extractInfo(entryContentText, this.regexGenres);
                        novel.summary = this.extractInfo(entryContentText, this.regexSummary);
                        novel.status = this.getStatus(entryContentText);
                        chapters = [];
                        $('div div article div')
                            .find('h2 a, h3 a')
                            .each(function (i, elem) {
                            var chapterName = $(elem).text().trim();
                            var chapterUrl = $(elem).attr('href');
                            var releaseDate = (0, dayjs_1.default)(chapterUrl === null || chapterUrl === void 0 ? void 0 : chapterUrl.substring(_this.site.length + 1, _this.site.length + 11)).format('DD MMMM YYYY');
                            if (chapterUrl && chapterUrl.includes(_this.site) && chapterName) {
                                chapters.push({
                                    name: chapterName,
                                    path: chapterUrl.replace(_this.site, ''),
                                    releaseTime: releaseDate,
                                });
                            }
                        });
                        //We sort by date because the elements are not in a fixed order,
                        //and then by name because there are chapters with the same dates.
                        novel.chapters = chapters.sort(function (a, b) {
                            if (!a.releaseTime)
                                return 1;
                            if (!b.releaseTime)
                                return -1;
                            var dateA = new Date(a.releaseTime).getTime();
                            var dateB = new Date(b.releaseTime).getTime();
                            var dateComparison = dateA - dateB;
                            if (dateComparison === 0) {
                                return a.name.localeCompare(b.name);
                            }
                            return dateComparison;
                        });
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    WarriorLegendTradPlugin.prototype.extractInfo = function (text, regexes) {
        for (var _i = 0, regexes_1 = regexes; _i < regexes_1.length; _i++) {
            var regex = regexes_1[_i];
            var match = regex.exec(text);
            if (match !== null) {
                return match[1].trim();
            }
        }
        return '';
    };
    WarriorLegendTradPlugin.prototype.getStatus = function (text) {
        var regexSummary = [
            /État sur le site :([^\n]*)/i,
            /état sur le site:([^\n]*)/i,
        ];
        var status = this.extractInfo(text, regexSummary);
        if (status.includes('en cours')) {
            return novelStatus_1.NovelStatus.Ongoing;
        }
        else if (status.includes('en pause')) {
            return novelStatus_1.NovelStatus.OnHiatus;
        }
        else if (status.includes('terminé')) {
            return novelStatus_1.NovelStatus.Completed;
        }
        else if (status.includes('abandonné')) {
            return novelStatus_1.NovelStatus.Cancelled;
        }
        return novelStatus_1.NovelStatus.Ongoing;
    };
    WarriorLegendTradPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var $, contenuHtml;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCheerio(this.site + chapterPath)];
                    case 1:
                        $ = _a.sent();
                        contenuHtml = '';
                        $('.entry-content')
                            .contents()
                            .each(function () {
                            var _a, _b, _c;
                            if (!((_a = $.html(this)) === null || _a === void 0 ? void 0 : _a.startsWith('<div')) &&
                                !((_b = $.html(this)) === null || _b === void 0 ? void 0 : _b.startsWith('<hr')) &&
                                !((_c = $.html(this)) === null || _c === void 0 ? void 0 : _c.includes('<script'))) {
                                contenuHtml += $.html(this);
                            }
                        });
                        return [2 /*return*/, contenuHtml];
                }
            });
        });
    };
    WarriorLegendTradPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
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
    return WarriorLegendTradPlugin;
}());
exports.default = new WarriorLegendTradPlugin();
