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
var WuxialnscantradPlugin = /** @class */ (function () {
    function WuxialnscantradPlugin() {
        this.id = 'wuxialnscantrad';
        this.name = 'WuxiaLnScantrad';
        this.icon = 'src/fr/wuxialnscantrad/icon.png';
        this.site = 'https://wuxialnscantrad.wordpress.com';
        this.version = '1.0.0';
    }
    WuxialnscantradPlugin.prototype.getCheerio = function (url) {
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
    WuxialnscantradPlugin.prototype.popularNovels = function (pageNo) {
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
                        $('#menu-item-2210 ul li').each(function (i, elem) {
                            var novelName = $(elem).first().text().trim();
                            var novelUrl = $(elem).find('a').attr('href');
                            if (novelUrl && novelName) {
                                novel = {
                                    name: novelName,
                                    cover: defaultCover_1.defaultCover,
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
    WuxialnscantradPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var novel, $, entryContentText, pathChapter, chapters;
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
                        novel.name = $('.entry-title').text().trim();
                        novel.cover =
                            $('.entry-content p strong img').first().attr('src') ||
                                $('.entry-content p img').first().attr('src');
                        entryContentText = $('.entry-content').text();
                        novel.author = this.getAuthor(entryContentText);
                        novel.genres = this.getGenres(entryContentText);
                        novel.artist = this.getArtist(entryContentText);
                        novel.summary = this.getSummary(entryContentText);
                        novel.status = this.getStatus(entryContentText);
                        pathChapter = $('.entry-content ul').first().children('li');
                        chapters = [];
                        pathChapter.each(function (i, elem) {
                            var chapterName = $(elem).text().trim();
                            var chapterUrl = $(elem).find('a').attr('href');
                            if (chapterUrl && chapterUrl.includes(_this.site) && chapterName) {
                                var pathchapter_1 = chapterUrl.replace(_this.site, '');
                                // we do not take the paths already present
                                if (!chapters.some(function (chap) { return chap.path === pathchapter_1; })) {
                                    var releaseDate = (0, dayjs_1.default)(chapterUrl === null || chapterUrl === void 0 ? void 0 : chapterUrl.substring(_this.site.length + 1, _this.site.length + 11)).format('DD MMMM YYYY');
                                    chapters.push({
                                        name: chapterName,
                                        path: pathchapter_1,
                                        releaseTime: releaseDate,
                                    });
                                }
                            }
                        });
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    WuxialnscantradPlugin.prototype.getAuthor = function (text) {
        var regex = /Auteur\(s\):\s*(.*)/;
        var match = regex.exec(text);
        var author = '';
        if (match !== null) {
            author = match[1].trim();
        }
        return author;
    };
    WuxialnscantradPlugin.prototype.getGenres = function (text) {
        var regex = /Genres:\s*(.*)/;
        var match = regex.exec(text);
        var genre = '';
        if (match !== null) {
            genre = match[1].trim();
        }
        return genre;
    };
    WuxialnscantradPlugin.prototype.getArtist = function (text) {
        var regex = /Artiste\(s\):\s*(.*)Genres/;
        var match = regex.exec(text);
        var artist = '';
        if (match !== null) {
            artist = match[1].trim();
        }
        return artist;
    };
    WuxialnscantradPlugin.prototype.getSummary = function (text) {
        var regexAuthors = [
            /Synopsis :([\s\S]*)Chapitres disponibles/,
            /Sypnopsis([\s\S]*)Sypnopsis officiel/,
            /Synopsis([\s\S]*)Chapitres disponibles/,
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
    WuxialnscantradPlugin.prototype.getStatus = function (text) {
        var regex = /Statut:\s*(.*)/;
        var match = regex.exec(text);
        var status = '';
        if (match !== null) {
            status = match[1].trim();
        }
        switch (status) {
            case 'En cours':
                return novelStatus_1.NovelStatus.Ongoing;
            case 'Arrêté':
                return novelStatus_1.NovelStatus.Cancelled;
            case 'Terminé':
                return novelStatus_1.NovelStatus.Completed;
            default:
                return novelStatus_1.NovelStatus.Ongoing;
        }
    };
    WuxialnscantradPlugin.prototype.parseChapter = function (chapterPath) {
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
                            var _a, _b, _c, _d;
                            if ((_a = $(this).html()) === null || _a === void 0 ? void 0 : _a.includes('<script')) {
                                return false;
                            }
                            //Removing tags linked to navigation and unnecessary paragraphs.
                            if (!((_b = $(this).html()) === null || _b === void 0 ? void 0 : _b.includes('data-attachment-id="480')) &&
                                !((_c = $.html(this)) === null || _c === void 0 ? void 0 : _c.includes('<hr>')) &&
                                !((_d = $.html(this)) === null || _d === void 0 ? void 0 : _d.includes('<p>&nbsp;</p>'))) {
                                contenuHtml += $.html(this);
                            }
                        });
                        return [2 /*return*/, contenuHtml];
                }
            });
        });
    };
    WuxialnscantradPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
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
    return WuxialnscantradPlugin;
}());
exports.default = new WuxialnscantradPlugin();
