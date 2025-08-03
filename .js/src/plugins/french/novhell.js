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
var NovhellPlugin = /** @class */ (function () {
    function NovhellPlugin() {
        this.id = 'novhell';
        this.name = 'Novhell';
        this.icon = 'src/fr/novhell/icon.png';
        this.site = 'https://novhell.org';
        this.version = '1.0.1';
    }
    NovhellPlugin.prototype.getCheerio = function (url) {
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
    NovhellPlugin.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var novels, novel, url, $;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        novels = [];
                        url = this.site;
                        return [4 /*yield*/, this.getCheerio(url)];
                    case 1:
                        $ = _a.sent();
                        $('article div div div figure').each(function (i, elem) {
                            var novelName = $(elem)
                                .find('figcaption span strong')
                                .first()
                                .text()
                                .trim();
                            if (!novelName || novelName.trim() === '') {
                                novelName = $(elem).find('figcaption a strong').first().text().trim();
                            }
                            var novelCover = $(elem).find('a img').attr('src');
                            var novelUrl = $(elem).find('a').attr('href');
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
    NovhellPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var novel, $, chapters;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        novel = {
                            path: novelPath,
                            name: 'Sans titre',
                        };
                        return [4 /*yield*/, this.getCheerio(this.site + novelPath)];
                    case 1:
                        $ = _b.sent();
                        novel.name =
                            ((_a = $('meta[property="og:title"]')
                                .attr('content')) === null || _a === void 0 ? void 0 : _a.replace('- NovHell', '')) || '';
                        novel.cover =
                            $('section div div div div div img').first().attr('src') || defaultCover_1.defaultCover;
                        novel.status = novelStatus_1.NovelStatus.Ongoing;
                        novel.author = $("strong:contains('Ecrit par ')")
                            .parent()
                            .text()
                            .replace('Ecrit par ', '')
                            .trim();
                        if (!novel.author) {
                            novel.author = $("div p:contains('Auteur')")
                                .text()
                                .replace('Auteur', '')
                                .replace(':', '')
                                .trim();
                        }
                        if (!novel.author) {
                            novel.author = $("div p:contains('Ecrit par :')")
                                .text()
                                .replace('Ecrit par :', '')
                                .trim();
                        }
                        novel.genres = $("strong:contains('Genre')")
                            .parent()
                            .text()
                            .replace('Genre', '')
                            .replace(':', '')
                            .trim();
                        if (!novel.genres) {
                            novel.genres = $("div p:contains('Genre')")
                                .text()
                                .replace('Genre', '')
                                .replace(':', '')
                                .trim();
                        }
                        novel.summary = $("strong:contains('Synopsis')")
                            .parent()
                            .parent()
                            .text()
                            .replace('Synopsis', '')
                            .replace('Synopsis', '')
                            .replace(':', '')
                            .trim();
                        chapters = [];
                        $('main div article div div section div div div div div p a').each(function (i, elem) {
                            // Replace non-breaking spaces with a 'normal' space.
                            var chapterName = $(elem)
                                .text()
                                .replace(/\u00A0/g, ' ')
                                .trim();
                            var chapterUrl = $(elem).attr('href');
                            // Check if the chapter URL exists and contains the site name.
                            if (chapterUrl && chapterUrl.includes(_this.site)) {
                                var regex = /Chapitre (\d+)/g;
                                var chapterNumber = 0;
                                var match = void 0;
                                while ((match = regex.exec(chapterName)) !== null) {
                                    var number = parseInt(match[1]);
                                    chapterNumber += number;
                                }
                                chapters.push({
                                    name: chapterName,
                                    path: chapterUrl.replace(_this.site, ''),
                                    chapterNumber: chapterNumber,
                                });
                            }
                        });
                        // Sort the chapters array based on the chapter numbers.
                        // We retrieve the chapters in the order 1-6-11-16-21-......
                        novel.chapters = chapters.sort(function (chapterA, chapterB) {
                            if (chapterA.chapterNumber !== undefined &&
                                chapterB.chapterNumber !== undefined) {
                                return chapterA.chapterNumber - chapterB.chapterNumber;
                            }
                            if (chapterA.chapterNumber === undefined) {
                                return 1;
                            }
                            else {
                                return -1;
                            }
                        });
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    NovhellPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var $, sections, numberOfSection, title, positionChapter, i, chapter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCheerio(this.site + chapterPath)];
                    case 1:
                        $ = _a.sent();
                        sections = $('main article div div section');
                        if (sections) {
                            numberOfSection = sections.length;
                            title = void 0;
                            positionChapter = 2;
                            for (i = 3; i <= 5; i++) {
                                title = sections.eq(numberOfSection - i);
                                if (title.find('h4').length !== 0) {
                                    positionChapter = i - 1;
                                    break;
                                }
                            }
                            chapter = sections.eq(numberOfSection - positionChapter);
                            if (title && chapter) {
                                return [2 /*return*/, (title.html() || '') + (chapter.html() || '')];
                            }
                        }
                        return [2 /*return*/, ''];
                }
            });
        });
    };
    NovhellPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
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
    return NovhellPlugin;
}());
exports.default = new NovhellPlugin();
