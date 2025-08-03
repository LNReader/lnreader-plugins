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
var fetch_1 = require("@libs/fetch");
var filterInputs_1 = require("@libs/filterInputs");
var cheerio_1 = require("cheerio");
var defaultCover_1 = require("@libs/defaultCover");
var novelStatus_1 = require("@libs/novelStatus");
var KakuyomuPlugin = /** @class */ (function () {
    function KakuyomuPlugin() {
        this.id = 'kakuyomu';
        this.name = 'kakuyomu';
        this.icon = 'src/jp/kakuyomu/icon.png';
        this.site = 'https://kakuyomu.jp';
        this.version = '1.0.0';
        this.filters = {
            genre: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Genre',
                options: [
                    { label: '総合', value: 'all' },
                    { label: '異世界ファンタジー', value: 'fantasy' },
                    { label: '現代ファンタジー', value: 'action' },
                    { label: 'SF', value: 'sf' },
                    { label: '恋愛', value: 'love_story' },
                    { label: 'ラブコメ', value: 'romance' },
                    { label: '現代ドラマ', value: 'drama' },
                    { label: 'ホラー', value: 'horror' },
                    { label: 'ミステリー', value: 'mystery' },
                    { label: 'エッセイ・ノンフィクション', value: 'nonfiction' },
                    { label: '歴史・時代・伝奇', value: 'history' },
                    { label: '創作論・評論', value: 'criticism' },
                    { label: '詩・童話・その他', value: 'others' },
                ],
                value: 'all',
            },
            period: {
                type: filterInputs_1.FilterTypes.Picker,
                label: 'Period',
                options: [
                    { label: '累計', value: 'entire' },
                    { label: '日間', value: 'daily' },
                    { label: '週間', value: 'weekly' },
                    { label: '月間', value: 'monthly' },
                    { label: '年間', value: 'yearly' },
                ],
                value: 'entire',
            },
        };
        this.imageRequestInit = undefined;
    }
    KakuyomuPlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var url, html, $, novels;
            var filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        url = new URL("/rankings/".concat(filters.genre.value, "/").concat(filters.period.value), this.site);
                        if (pageNo > 1) {
                            url.searchParams.set('page', pageNo.toString());
                        }
                        return [4 /*yield*/, (0, fetch_1.fetchText)(url.toString())];
                    case 1:
                        html = _c.sent();
                        $ = (0, cheerio_1.load)(html);
                        novels = [];
                        $('.widget-media-genresWorkList-right > .widget-work').each(function (_, elem) {
                            var anchor = $(elem).find('a.widget-workCard-titleLabel');
                            var path = anchor.attr('href');
                            if (!path)
                                return;
                            var name = anchor.text();
                            novels.push({
                                name: name,
                                path: path,
                                cover: defaultCover_1.defaultCover,
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    KakuyomuPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, html, $, json, apolloState, work, author, chapters, tableOfContentsChapter, episodes, joinChapters, novel;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        url = new URL(novelPath, this.site);
                        return [4 /*yield*/, (0, fetch_1.fetchText)(url.toString())];
                    case 1:
                        html = _f.sent();
                        $ = (0, cheerio_1.load)(html);
                        json = JSON.parse($('script#__NEXT_DATA__[type="application/json"]').html() || '{}');
                        apolloState = (_c = (_b = (_a = json === null || json === void 0 ? void 0 : json.props) === null || _a === void 0 ? void 0 : _a.pageProps) === null || _b === void 0 ? void 0 : _b.__APOLLO_STATE__) !== null && _c !== void 0 ? _c : {};
                        work = Object.values(apolloState).find(function (v) {
                            return typeof v === 'object' &&
                                v !== null &&
                                '__typename' in v &&
                                v.__typename === 'Work' &&
                                'id' in v &&
                                v.id === novelPath.replace('/works/', '');
                        });
                        author = Object.values(apolloState).find(function (v) {
                            return typeof v === 'object' &&
                                v !== null &&
                                '__typename' in v &&
                                v.__typename === 'UserAccount' &&
                                'id' in v &&
                                v.id === work.author.__ref.replace('UserAccount:', '');
                        });
                        chapters = Object.values(apolloState).filter(function (v) {
                            if (typeof v === 'object' &&
                                v !== null &&
                                '__typename' in v &&
                                v.__typename === 'Chapter') {
                                return true;
                            }
                        });
                        tableOfContentsChapter = Object.values(apolloState).filter(function (v) {
                            if (typeof v === 'object' &&
                                v !== null &&
                                '__typename' in v &&
                                v.__typename === 'TableOfContentsChapter') {
                                return true;
                            }
                        });
                        episodes = Object.values(apolloState).filter(function (v) {
                            if (typeof v === 'object' &&
                                v !== null &&
                                '__typename' in v &&
                                v.__typename === 'Episode') {
                                return true;
                            }
                        });
                        joinChapters = episodes.map(function (v) {
                            var _a;
                            var chapter = (_a = tableOfContentsChapter.find(function (c) {
                                return c.episodeUnions.some(function (e) { return e.__ref === "Episode:".concat(v.id); });
                            })) === null || _a === void 0 ? void 0 : _a.chapter;
                            return {
                                chapter: chapters.find(function (c) { return c.id === (chapter === null || chapter === void 0 ? void 0 : chapter.__ref.replace('Chapter:', '')); }),
                                episode: v,
                            };
                        });
                        novel = {
                            path: novelPath,
                            name: work.title,
                            cover: (_d = work.adminCoverImageUrl) !== null && _d !== void 0 ? _d : defaultCover_1.defaultCover,
                            genres: ((_e = work === null || work === void 0 ? void 0 : work.tagLabels) !== null && _e !== void 0 ? _e : []).join(','),
                            author: author === null || author === void 0 ? void 0 : author.activityName,
                            status: work.serialStatus === 'COMPLETED'
                                ? novelStatus_1.NovelStatus.Completed
                                : novelStatus_1.NovelStatus.Ongoing,
                            summary: work.introduction,
                            chapters: joinChapters.map(function (v) {
                                var _a, _b, _c, _d, _e, _f, _g, _h;
                                return {
                                    name: ((_a = v.chapter) === null || _a === void 0 ? void 0 : _a.title)
                                        ? "".concat((_b = v.chapter) === null || _b === void 0 ? void 0 : _b.title, " - ").concat((_c = v.episode) === null || _c === void 0 ? void 0 : _c.title)
                                        : (_e = (_d = v.episode) === null || _d === void 0 ? void 0 : _d.title) !== null && _e !== void 0 ? _e : '',
                                    path: "".concat(novelPath, "/episodes/").concat((_f = v.episode) === null || _f === void 0 ? void 0 : _f.id),
                                    releaseTime: new Date((_h = (_g = v.episode) === null || _g === void 0 ? void 0 : _g.publishedAt) !== null && _h !== void 0 ? _h : 0).toISOString(),
                                };
                            }),
                        };
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    KakuyomuPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, html, $, chapterTitle, episodeTitle, episodeBody, chapterText;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        url = new URL(chapterPath, this.site);
                        return [4 /*yield*/, (0, fetch_1.fetchText)(url.toString())];
                    case 1:
                        html = _d.sent();
                        $ = (0, cheerio_1.load)(html);
                        chapterTitle = (_a = $('.chapterTitle').text()) !== null && _a !== void 0 ? _a : '';
                        episodeTitle = (_b = $('.widget-episodeTitle').html()) !== null && _b !== void 0 ? _b : '';
                        episodeBody = (_c = $('.widget-episodeBody').html()) !== null && _c !== void 0 ? _c : '';
                        chapterText = "\n    <div>\n      ".concat(chapterTitle ? "<h1>".concat(chapterTitle, "</h1>") : '', "\n      <h2>").concat(episodeTitle, "</h2>\n    </div>\n    <p><br><br></p>\n    ").concat(episodeBody);
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    KakuyomuPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, html, $, json, works, novels;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        url = new URL('/search', this.site);
                        url.searchParams.set('q', searchTerm);
                        if (pageNo > 1) {
                            url.searchParams.set('page', pageNo.toString());
                        }
                        return [4 /*yield*/, (0, fetch_1.fetchText)(url.toString())];
                    case 1:
                        html = _d.sent();
                        $ = (0, cheerio_1.load)(html);
                        json = JSON.parse($('script#__NEXT_DATA__[type="application/json"]').html() || '{}');
                        works = Object.values((_c = (_b = (_a = json === null || json === void 0 ? void 0 : json.props) === null || _a === void 0 ? void 0 : _a.pageProps) === null || _b === void 0 ? void 0 : _b.__APOLLO_STATE__) !== null && _c !== void 0 ? _c : {}).filter(function (v) {
                            if (typeof v === 'object' &&
                                v !== null &&
                                '__typename' in v &&
                                v.__typename === 'Work') {
                                return true;
                            }
                        });
                        novels = works.map(function (v) {
                            var _a, _b;
                            return ({
                                name: (_a = v.title) !== null && _a !== void 0 ? _a : '',
                                path: "/works/".concat(v.id),
                                cover: (_b = v.adminCoverImageUrl) !== null && _b !== void 0 ? _b : defaultCover_1.defaultCover,
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return KakuyomuPlugin;
}());
exports.default = new KakuyomuPlugin();
