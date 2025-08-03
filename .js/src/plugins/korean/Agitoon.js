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
var cheerio_1 = require("cheerio");
var Agitoon = /** @class */ (function () {
    function Agitoon() {
        this.id = 'agit.xyz';
        this.name = 'Agitoon';
        this.icon = 'src/kr/agitoon/icon.png';
        this.site = 'https://agit664.xyz';
        this.version = '3.1.0';
    }
    Agitoon.prototype.checkUrl = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!Agitoon.url) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site)];
                    case 1:
                        res = _a.sent();
                        if (!res.ok)
                            Agitoon.url = this.site;
                        else
                            Agitoon.url = res.url.replace(/\/$/, '');
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    Agitoon.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var res, resJson, novels;
            var _c;
            var showLatestNovels = _b.showLatestNovels;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.checkUrl()];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(Agitoon.url + '/novel/index.update.php', {
                                headers: {
                                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                                },
                                method: 'POST',
                                body: new URLSearchParams({
                                    mode: 'get_data_novel_list_p',
                                    novel_menu: showLatestNovels ? '1' : '3',
                                    np_day: new Date().getDay(),
                                    np_rank: '1',
                                    np_distributor: '0',
                                    np_genre: '00',
                                    np_order: '1',
                                    np_genre_ex_1: '00',
                                    np_genre_ex_2: '00',
                                    list_limit: 20 * (pageNo - 1),
                                    is_query_first: pageNo == 1,
                                }).toString(),
                            })];
                    case 2:
                        res = _d.sent();
                        if (!res.ok) {
                            throw new Error("Failed to get popular novels: (".concat(res.status, ": ").concat(res.statusText, ") (try to open in webview)"));
                        }
                        return [4 /*yield*/, res.json()];
                    case 3:
                        resJson = (_d.sent());
                        novels = [];
                        (_c = resJson === null || resJson === void 0 ? void 0 : resJson.list) === null || _c === void 0 ? void 0 : _c.forEach(function (novel) {
                            return novels.push({
                                name: novel.wr_subject,
                                cover: Agitoon.url + novel.np_dir + '/thumbnail/' + novel.np_thumbnail,
                                path: novel.wr_id,
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    Agitoon.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var result, loadedCheerio, novel, genres, chapters, res, resJson;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.checkUrl()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.resolveUrl(novelPath, true)).then(function (res) {
                                return res.text();
                            })];
                    case 2:
                        result = _b.sent();
                        loadedCheerio = (0, cheerio_1.load)(result, { decodeEntities: false });
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('h5.pt-2').text(),
                            cover: loadedCheerio('div.col-5.pr-0.pl-0 img').attr('src'),
                            summary: loadedCheerio('.pt-1.mt-1.pb-1.mb-1').text(),
                        };
                        novel.author = loadedCheerio('.post-item-list-cate-v')
                            .first()
                            .text()
                            .split(' : ')[1];
                        genres = loadedCheerio('.col-7 > .post-item-list-cate > span')
                            .map(function (index, element) { return loadedCheerio(element).text().trim(); })
                            .get();
                        if (genres.length) {
                            novel.genres = genres.join(', ');
                        }
                        chapters = [];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(Agitoon.url + '/novel/list.update.php', {
                                headers: {
                                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                                },
                                method: 'POST',
                                body: new URLSearchParams({
                                    mode: 'get_data_novel_list_c',
                                    wr_id_p: novelPath,
                                    page_no: '1',
                                    cnt_list: '10000',
                                    order_type: 'Asc',
                                }).toString(),
                            })];
                    case 3:
                        res = _b.sent();
                        return [4 /*yield*/, res.json()];
                    case 4:
                        resJson = (_b.sent());
                        (_a = resJson === null || resJson === void 0 ? void 0 : resJson.list) === null || _a === void 0 ? void 0 : _a.forEach(function (chapter) {
                            return chapters.push({
                                name: chapter.wr_subject,
                                path: chapter.wr_id + '/2',
                                releaseTime: chapter.wr_datetime,
                            });
                        });
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    Agitoon.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var result, loadedCheerio, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkUrl()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.resolveUrl(chapterPath)).then(function (res) {
                                return res.text();
                            })];
                    case 2:
                        result = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(result);
                        content = loadedCheerio('#id_wr_content').html() || '';
                        // gets rid of the popup thingy
                        content = content
                            .replace('팝업메뉴는 빈공간을 더치하거나 스크룰시 사라집니다', '')
                            .trim();
                        return [2 /*return*/, content];
                }
            });
        });
    };
    Agitoon.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var rawResults, resJson, novels;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (pageNo !== 1)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, this.checkUrl()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(Agitoon.url + '/novel/search.php', {
                                headers: {
                                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                                },
                                method: 'POST',
                                body: new URLSearchParams({
                                    mode: 'get_data_novel_list_p_sch',
                                    search_novel: searchTerm,
                                    list_limit: 0,
                                }).toString(),
                            })];
                    case 2:
                        rawResults = _b.sent();
                        return [4 /*yield*/, rawResults.json()];
                    case 3:
                        resJson = (_b.sent());
                        novels = [];
                        (_a = resJson === null || resJson === void 0 ? void 0 : resJson.list) === null || _a === void 0 ? void 0 : _a.forEach(function (novel) {
                            return novels.push({
                                name: novel.wr_subject,
                                cover: Agitoon.url + '/' + novel.np_dir + '/thumbnail/' + novel.np_thumbnail,
                                path: novel.wr_id,
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    Agitoon.prototype.resolveUrl = function (path, isNovel) {
        if (!Agitoon.url)
            (0, fetch_1.fetchApi)(this.site).then(function (res) { return (Agitoon.url = res.url.replace(/\/$/, '')); });
        return ((Agitoon.url ? Agitoon.url : this.site) +
            (isNovel ? '/novel/list/' : '/novel/view/') +
            path);
    };
    return Agitoon;
}());
exports.default = new Agitoon();
