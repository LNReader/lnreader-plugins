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
var XiaowazPlugin = /** @class */ (function () {
    function XiaowazPlugin() {
        this.id = 'xiaowaz';
        this.name = 'Xiaowaz';
        this.icon = 'src/fr/xiaowaz/icon.png';
        this.site = 'https://xiaowaz.fr';
        this.version = '1.0.1';
    }
    XiaowazPlugin.prototype.getCheerio = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var retries, returnError, r, body, $, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        retries = 5;
                        _a.label = 1;
                    case 1:
                        if (!(retries > 0)) return [3 /*break*/, 8];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 7]);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 3:
                        r = _a.sent();
                        return [4 /*yield*/, r.text()];
                    case 4:
                        body = _a.sent();
                        $ = (0, cheerio_1.load)(body);
                        return [2 /*return*/, $];
                    case 5:
                        error_1 = _a.sent();
                        console.error(error_1);
                        returnError = error_1;
                        retries--;
                        // wait 1 second before retrying
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 6:
                        // wait 1 second before retrying
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 7: return [3 /*break*/, 1];
                    case 8: throw new Error(returnError ? returnError : 'Error fetching the page');
                }
            });
        });
    };
    XiaowazPlugin.prototype.getAllNovels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var novels, novel, $, categories;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        novels = [];
                        return [4 /*yield*/, this.getCheerio(this.site)];
                    case 1:
                        $ = _a.sent();
                        categories = [
                            $('li.page_item').find('a:contains("Séries")').parent(),
                            $('li.page_item').find('a:contains("Créations")').parent(),
                            $('li.page_item').find('a:contains("†")').parent(),
                        ];
                        categories.forEach(function (cheerio) {
                            cheerio.find('ul.children li').each(function (i, elem) {
                                var novelName = $(elem).first().text().trim().replace('✔', '');
                                var novelUrl = $(elem).find('a').attr('href');
                                // Douluo Dalu is no good
                                if (novelUrl && novelName && novelName !== 'Douluo Dalu') {
                                    novel = {
                                        name: novelName,
                                        path: novelUrl.replace(_this.site, ''),
                                    };
                                    novels.push(novel);
                                }
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    XiaowazPlugin.prototype.getNovelsCovers = function (novels) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(novels.map(function (novel) { return __awaiter(_this, void 0, void 0, function () {
                            var $novel;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.getCheerio(this.site + novel.path)];
                                    case 1:
                                        $novel = _a.sent();
                                        novel.cover =
                                            $novel('img[fetchpriority = "high"]').first().attr('src') ||
                                                $novel('img.aligncenter').first().attr('src') ||
                                                defaultCover_1.defaultCover;
                                        return [2 /*return*/];
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
    XiaowazPlugin.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var PAGE_SIZE, _a, novels, totalPages;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        PAGE_SIZE = 5;
                        if (!!XiaowazPlugin.novels) return [3 /*break*/, 2];
                        _a = XiaowazPlugin;
                        return [4 /*yield*/, this.getAllNovels()];
                    case 1:
                        _a.novels = _b.sent();
                        _b.label = 2;
                    case 2:
                        novels = XiaowazPlugin.novels;
                        totalPages = Math.ceil(novels.length / PAGE_SIZE);
                        if (pageNo > totalPages)
                            return [2 /*return*/, []];
                        // splitting novel list to make fewer requests for getting images
                        novels = novels.slice(PAGE_SIZE * (pageNo - 1), PAGE_SIZE * pageNo);
                        return [4 /*yield*/, this.getNovelsCovers(novels)];
                    case 3: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    XiaowazPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var novel, $, entryContentText, listeParagraphe, PARAGRAPH_EXCLUDE_LIST, pathChapter, chapters;
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
                        novel.name = $('.card_title').text().trim();
                        novel.cover =
                            $('img[fetchpriority = "high"]').first().attr('src') ||
                                $('img.aligncenter').first().attr('src') ||
                                defaultCover_1.defaultCover;
                        novel.status = novelStatus_1.NovelStatus.Ongoing;
                        if (novel.name.charAt(novel.name.length - 1) === '✔') {
                            novel.status = novelStatus_1.NovelStatus.Completed;
                            novel.name = novel.name.slice(0, -1);
                        }
                        else if (novelPath.startsWith('/series-abandonnees')) {
                            novel.status = novelStatus_1.NovelStatus.Cancelled;
                        }
                        entryContentText = $('.entry-content').text();
                        novel.author = this.getAuthor(entryContentText);
                        novel.genres = this.getGenres(entryContentText);
                        if (novelPath.startsWith('/oeuvres-originales')) {
                            novel.genres += novel.genres ? ', Oeuvre originale' : 'Oeuvre originale';
                        }
                        listeParagraphe = [];
                        PARAGRAPH_EXCLUDE_LIST = [
                            'Écrit par',
                            'Ecrit par',
                            'Sorties régulières',
                            'Auteur\u00A0:',
                            'Statut VO\u00A0:',
                            'Nom utilisé\u00A0:',
                            'Auteur original\u00A0:',
                            'Auteur original de l’oeuvre',
                            '851 chapitres en',
                            'Index\u00A0:',
                        ];
                        $('.entry-content > p').each(function (index, element) {
                            var balise = $(element);
                            // remove chapter links
                            if (balise.find('a[href*="xiaowaz.fr/articles"]').length !== 0)
                                return false;
                            var textbalise = balise.text();
                            if (PARAGRAPH_EXCLUDE_LIST.some(function (keyword) { return textbalise.includes(keyword); }))
                                return false;
                            if (!textbalise.includes('Genre') &&
                                !textbalise.includes('Synopsis') &&
                                //Managing the novel 'Rebirth of The Thief Who Roamed The World' to remove these three fields.
                                !textbalise.includes('重生之賊行天下') &&
                                !textbalise.includes('Rebirth of The Thief Who Roamed The World') &&
                                !textbalise.includes('Romance, Comédie, Action, VRMMO, Réincarnation, Futuriste'))
                                listeParagraphe.push(textbalise);
                        });
                        novel.summary = listeParagraphe.join('\n').trim();
                        pathChapter = $('.entry-content ul li a');
                        if (pathChapter.length === 0) {
                            pathChapter = $('.entry-content p a');
                        }
                        chapters = [];
                        pathChapter.each(function (i, elem) {
                            var chapterName = $(elem).text().trim();
                            var chapterUrl = $(elem).attr('href');
                            if (chapterUrl && chapterUrl.includes(_this.site) && chapterName) {
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
    XiaowazPlugin.prototype.getAuthor = function (text) {
        var regexAuthors = [
            /Écrit par([^\n]*). Traduction/i,
            /Écrit par([^\n]*)./i,
            /Auteur original de l’œuvre\u00A0:([^\n]*)VO/i,
            /Auteur\u00A0:([^\n]*)sur/,
            /Auteur\u00A0:([^\n]*)/,
            /Auteure\u00A0:\u00A0([^\n]*)/,
            /Auteur original de l’oeuvre\u00A0:([^\n]*)/i,
            /Auteur original\u00A0:([^\n]*)/i,
        ];
        for (var _i = 0, regexAuthors_1 = regexAuthors; _i < regexAuthors_1.length; _i++) {
            var regex = regexAuthors_1[_i];
            var match = regex.exec(text);
            if (match !== null) {
                return match[1].trim();
            }
        }
        return '';
    };
    XiaowazPlugin.prototype.getGenres = function (text) {
        // We handle several cases where there are multiple spellings for the word 'genre'. Genre, Genre :, Genres, Genres:
        var regex = /Genre((?:.*?\n)*?)\s*Synopsis\s*/;
        var match = regex.exec(text);
        var genre = '';
        if (match !== null) {
            genre = match[1]
                .replace('\u00A0', ' ')
                .replace('s :', '')
                .replace(':', '')
                .trim();
            if (genre.startsWith('s\n')) {
                genre = genre.replace(/^./, '').trim();
            }
        }
        return genre;
    };
    XiaowazPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var $, startTag, endTag, elementsBetweenTags, footnotesElement, currentElement, htmlCurrentElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCheerio(this.site + chapterPath)];
                    case 1:
                        $ = _a.sent();
                        startTag = $('.wp-post-navigation');
                        endTag = $('.abh_box.abh_box_down.abh_box_business');
                        elementsBetweenTags = [];
                        footnotesElement = null;
                        if (startTag.length > 0 && endTag.length > 0) {
                            currentElement = startTag.next();
                            while (currentElement.length > 0 && !currentElement.is(endTag)) {
                                if (currentElement.find('p > a[href="https://ko-fi.com/wazouille"]')
                                    .length > 0) {
                                    break;
                                }
                                if (currentElement.hasClass('footnote_container_prepare')) {
                                    footnotesElement = $.html(currentElement);
                                }
                                else {
                                    htmlCurrentElement = $.html(currentElement);
                                    htmlCurrentElement =
                                        htmlCurrentElement === '<p>&nbsp;</p>'
                                            ? '<p/>'
                                            : htmlCurrentElement;
                                    elementsBetweenTags.push(htmlCurrentElement);
                                }
                                currentElement = currentElement.next();
                            }
                        }
                        // Place footnotes at the end of the chapter, not at the beginning
                        if (footnotesElement) {
                            elementsBetweenTags.push(footnotesElement);
                        }
                        return [2 /*return*/, elementsBetweenTags.join('\n').trim()];
                }
            });
        });
    };
    XiaowazPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, popularNovels, novels;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (pageNo !== 1)
                            return [2 /*return*/, []];
                        if (!!XiaowazPlugin.novels) return [3 /*break*/, 2];
                        _a = XiaowazPlugin;
                        return [4 /*yield*/, this.getAllNovels()];
                    case 1:
                        _a.novels = _b.sent();
                        _b.label = 2;
                    case 2:
                        popularNovels = XiaowazPlugin.novels;
                        novels = popularNovels.filter(function (novel) {
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
                        return [4 /*yield*/, this.getNovelsCovers(novels)];
                    case 3: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    return XiaowazPlugin;
}());
exports.default = new XiaowazPlugin();
