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
var filterInputs_1 = require("@libs/filterInputs");
var NovelRingan = /** @class */ (function () {
    function NovelRingan() {
        this.id = 'novelringan.com';
        this.name = 'NovelRingan';
        this.icon = 'src/id/novelringan/icon.png';
        this.site = 'https://novelringan.com/';
        this.version = '1.0.0';
        this.coverUriPrefix = 'https://i0.wp.com/novelringan.com/wp-content/uploads/';
        this.filters = {
            status: {
                value: '',
                label: 'Status',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Ongoing', value: 'Ongoing' },
                    { label: 'Completed', value: 'Completed' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            sort: {
                value: 'popular',
                label: 'Urutkan',
                options: [
                    { label: 'A-Z', value: 'title' },
                    { label: 'Z-A', value: 'titlereverse' },
                    { label: 'Terbarui', value: 'update' },
                    { label: 'Ditambahkan', value: 'latest' },
                    { label: 'Terpopuler', value: 'popular' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            type: {
                value: [],
                label: 'Tipe',
                options: [
                    { label: 'Chinese Novel', value: 'chinese-novel' },
                    { label: 'Chinese Web Novel', value: 'chinese-web-novel' },
                    { label: 'Filipino Novel', value: 'filipino-novel' },
                    { label: 'Indonesia Novel', value: 'indonesia-novel' },
                    { label: 'Korean Novel', value: 'korean-novel' },
                    { label: 'Light Novel', value: 'light-novel' },
                    { label: 'Light Novel (CN)', value: 'light-novel-cn' },
                    { label: 'Light Novel (JP)', value: 'light-novel-jp' },
                    { label: 'Light Novel (KR)', value: 'light-novel-kr' },
                    { label: 'Malaysian Novel', value: 'malaysian-novel' },
                    { label: 'Published Novel (CN)', value: 'published-novel-cn' },
                    { label: 'Published Novel (JP)', value: 'published-novel-jp' },
                    { label: 'Published Novel (KR)', value: 'published-novel-kr' },
                    { label: 'Published Novel (TH)', value: 'published-novel-th' },
                    { label: 'Thai Novel', value: 'thai-novel' },
                    { label: 'Vietnamese Novel', value: 'vietnamese-novel' },
                    { label: 'Web Novel', value: 'web-novel' },
                    { label: 'Webnovel', value: 'webnovel' },
                ],
                type: filterInputs_1.FilterTypes.CheckboxGroup,
            },
            genre: {
                value: [],
                label: 'Genres',
                options: [
                    { label: 'Action', value: 'action' },
                    { label: 'Adult', value: 'adult' },
                    { label: 'Adventure', value: 'adventure' },
                    { label: 'Celebrity', value: 'celebrity' },
                    { label: 'Comedy', value: 'comedy' },
                    { label: 'ction', value: 'ction' },
                    { label: 'Drama', value: 'drama' },
                    { label: 'Eastern', value: 'eastern' },
                    { label: 'Ecchi', value: 'ecchi' },
                    { label: 'Fantasy', value: 'fantasy' },
                    { label: 'Game', value: 'game' },
                    { label: 'Games', value: 'games' },
                    { label: 'Gender Bender', value: 'gender-bender' },
                    { label: 'Harem', value: 'harem' },
                    { label: 'Historical', value: 'historical' },
                    { label: 'Horror', value: 'horror' },
                    { label: 'Isekai', value: 'isekai' },
                    { label: 'Josei', value: 'josei' },
                    { label: 'Life', value: 'life' },
                    { label: 'LitRPG', value: 'litrpg' },
                    { label: 'Magical Realism', value: 'magical-realism' },
                    { label: 'Martial Arts', value: 'martial-arts' },
                    { label: 'Mature', value: 'mature' },
                    { label: 'Mecha', value: 'mecha' },
                    { label: 'Mystery', value: 'mystery' },
                    { label: 'Psychologic', value: 'psychologic' },
                    { label: 'Psychological', value: 'psychological' },
                    { label: 'Recarnation', value: 'recarnation' },
                    { label: 'Reincarnation', value: 'reincarnation' },
                    { label: 'Romance', value: 'romance' },
                    { label: 'School', value: 'school' },
                    { label: 'School Life', value: 'school-life' },
                    { label: 'Sci-fi', value: 'sci-fi' },
                    { label: 'Seinen', value: 'seinen' },
                    { label: 'Shotacon', value: 'shotacon' },
                    { label: 'Shoujo', value: 'shoujo' },
                    { label: 'Shoujo Ai', value: 'shoujo-ai' },
                    { label: 'Shounen', value: 'shounen' },
                    { label: 'Shounen Ai', value: 'shounen-ai' },
                    { label: 'Slice of Life', value: 'slice-of-life' },
                    { label: 'Smut', value: 'smut' },
                    { label: 'Sports', value: 'sports' },
                    { label: 'Supernatural', value: 'supernatural' },
                    { label: 'Tragedy', value: 'tragedy' },
                    { label: 'Urban', value: 'urban' },
                    { label: 'Urban Life', value: 'urban-life' },
                    {
                        label: 've names:N/A Genre:Romance',
                        value: 've-namesn-a-genreromance',
                    },
                    { label: 'Wuxia', value: 'wuxia' },
                    { label: 'Xianxia', value: 'xianxia' },
                    { label: 'Xuanhuan', value: 'xuanhuan' },
                    { label: 'Yaoi', value: 'yaoi' },
                    { label: 'Yuri', value: 'yuri' },
                ],
                type: filterInputs_1.FilterTypes.CheckboxGroup,
            },
        };
    }
    NovelRingan.prototype.parseNovels = function (loadedCheerio) {
        var _this = this;
        var novels = [];
        loadedCheerio('article.post').each(function (idx, ele) {
            var _a;
            var novelName = (_a = loadedCheerio(ele).find('.entry-title').text()) === null || _a === void 0 ? void 0 : _a.trim();
            var novelCover = _this.coverUriPrefix + loadedCheerio(ele).find('img').attr('data-sxrx');
            var novelUrl = loadedCheerio(ele).find('h2 > a').attr('href');
            if (!novelUrl)
                return;
            var novel = {
                name: novelName,
                cover: novelCover,
                path: novelUrl.replace(_this.site, ''),
            };
            novels.push(novel);
        });
        return novels;
    };
    NovelRingan.prototype.popularNovels = function (page_1, _a) {
        return __awaiter(this, arguments, void 0, function (page, _b) {
            var link, result, body, loadedCheerio;
            var filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        link = "".concat(this.site, "advanced-search/page/").concat(page, "/?title");
                        link += "&status=".concat(filters.status.value);
                        link += "&order=".concat(filters.sort.value);
                        if (filters.type.value.length)
                            link += filters.type.value.map(function (i) { return "&type[]=".concat(i); }).join('');
                        if (filters.genre.value.length)
                            link += filters.genre.value.map(function (i) { return "&genre[]=".concat(i); }).join('');
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(link)];
                    case 1:
                        result = _c.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _c.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, this.parseNovels(loadedCheerio)];
                }
            });
        });
    };
    NovelRingan.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var result, body, loadedCheerio, styletag, novel, chapter;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath)];
                    case 1:
                        result = _b.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _b.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        styletag = Array.from(((_a = loadedCheerio('meta[name=msapplication-TileImage] + style')
                            .html()) === null || _a === void 0 ? void 0 : _a.matchAll(/"(.*?)"/g)) || [], function (m) { return m[1]; });
                        novel = {
                            path: novelPath,
                            name: styletag[0] || loadedCheerio('.entry-title').text() || 'Untitled',
                            author: styletag[1],
                            summary: loadedCheerio('.maininfo span p').text(),
                            chapters: [],
                        };
                        novel.cover =
                            this.coverUriPrefix +
                                loadedCheerio('img.ts-post-image').attr('data-sxrx');
                        loadedCheerio('.maininfo li').each(function () {
                            var detailName = loadedCheerio(this).find('b').text().trim();
                            var detail = loadedCheerio(this).find('b').remove().end().text().trim();
                            switch (detailName) {
                                case 'Status:':
                                    novel.status = detail;
                                    break;
                                case 'Genre:':
                                    novel.genres = detail;
                                    break;
                            }
                        });
                        chapter = [];
                        loadedCheerio('.bxcl > ul > li').each(function (i, el) {
                            var chapterName = loadedCheerio(el).find('a').text();
                            var chapterUrl = loadedCheerio(el).find('a').attr('href');
                            if (!chapterUrl)
                                return;
                            chapter.push({
                                name: chapterName,
                                path: chapterUrl.replace(_this.site, ''),
                            });
                        });
                        novel.chapters = chapter.reverse();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    NovelRingan.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + chapterPath;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        loadedCheerio('.entry-content div[style="display:none"]').remove();
                        chapterText = loadedCheerio('.entry-content').html() || '';
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    NovelRingan.prototype.searchNovels = function (searchTerm, page) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + 'page/' + page + '/?s=' + searchTerm;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, this.parseNovels(loadedCheerio)];
                }
            });
        });
    };
    return NovelRingan;
}());
exports.default = new NovelRingan();
