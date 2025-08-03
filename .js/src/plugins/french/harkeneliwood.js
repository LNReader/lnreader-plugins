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
var HarkenEliwoodPlugin = /** @class */ (function () {
    function HarkenEliwoodPlugin() {
        this.id = 'harkeneliwood';
        this.name = 'HarkenEliwood';
        this.icon = 'src/fr/harkeneliwood/icon.png';
        this.site = 'https://harkeneliwood.wordpress.com';
        this.version = '1.0.0';
    }
    HarkenEliwoodPlugin.prototype.getCheerio = function (url) {
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
    HarkenEliwoodPlugin.prototype.popularNovels = function (pageNo) {
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
                        return [4 /*yield*/, this.getCheerio(url + '/projets/')];
                    case 1:
                        $ = _a.sent();
                        $('#content .entry-content [href]')
                            // We don't collect items for Facebook and Twitter.
                            .not('[rel="nofollow noopener noreferrer"]')
                            .each(function (i, elem) {
                            var novelName = $(elem).text().trim();
                            var novelUrl = $(elem).attr('href');
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
    HarkenEliwoodPlugin.prototype.parseNovel = function (novelPath) {
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
                        novel.name = $('#content h1.entry-title').text().trim();
                        novel.cover =
                            $('#content .entry-content p img').first().attr('src') || defaultCover_1.defaultCover;
                        novel.summary = this.getSummary($('#content .entry-content').text());
                        novel.author = this.getAuthor($('#content .entry-content').text());
                        novel.status = novelStatus_1.NovelStatus.Ongoing;
                        chapters = [];
                        $('#content .entry-content p a').each(function (i, elem) {
                            var chapterName = $(elem).text().trim();
                            var chapterUrl = $(elem).attr('href');
                            // Check if the chapter URL exists and contains the site name.
                            if (chapterUrl && chapterUrl.includes(_this.site) && chapterName) {
                                var releaseDate = (0, dayjs_1.default)(chapterUrl === null || chapterUrl === void 0 ? void 0 : chapterUrl.substring(_this.site.length + 1, _this.site.length + 11)).format('DD MMMM YYYY');
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
    HarkenEliwoodPlugin.prototype.getSummary = function (text) {
        var resume = '';
        var regexResume1 = /Synopsis :([\s\S]*)Traduction anglaise/i;
        var regexResume2 = /Synopsis :([\s\S]*)Raw :/i;
        var regexResume3 = /Synopsis 1 :([\s\S]*)Synopsis 2 :([\s\S]*)Raw :/i;
        var regexResume4 = /Synopsis :([\s\S]*)Prélude/i;
        var regexResume5 = /Synospis :([\s\S]*)Original /i;
        var regexResume6 = /([\s\S]*)Raw :/i;
        var match1 = regexResume1.exec(text);
        var match2 = regexResume2.exec(text);
        var match3 = regexResume3.exec(text);
        var match4 = regexResume4.exec(text);
        var match5 = regexResume5.exec(text);
        if (match1 !== null) {
            resume = match1[1];
        }
        else if (match2 !== null) {
            resume = match2[1];
        }
        else if (match3 !== null) {
            resume = match3[1] + match3[2];
        }
        else if (match4 !== null) {
            resume = match4[1];
        }
        else if (match5 !== null) {
            resume = match5[1];
        }
        else {
            resume = text;
        }
        if (regexResume6.test(resume)) {
            var match6 = regexResume6.exec(resume);
            if (match6 !== null) {
                resume = match6[1];
            }
        }
        return resume.trim();
    };
    HarkenEliwoodPlugin.prototype.getAuthor = function (text) {
        var regexAuteur = /Auteur\s*:\s*(.*?)\s*(?:\r?\n|$)/i;
        var match = regexAuteur.exec(text);
        if (match !== null && match[1].trim() !== '') {
            return match[1].trim();
        }
        return '';
    };
    HarkenEliwoodPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var $, title, chapter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCheerio(this.site + chapterPath)];
                    case 1:
                        $ = _a.sent();
                        title = $('h1.entry-title');
                        chapter = $('div.entry-content');
                        return [2 /*return*/, (title.html() || '') + (chapter.html() || '')];
                }
            });
        });
    };
    HarkenEliwoodPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
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
    return HarkenEliwoodPlugin;
}());
exports.default = new HarkenEliwoodPlugin();
