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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.icon = exports.version = exports.site = exports.name = exports.id = void 0;
var cheerio_1 = require("cheerio");
var fetch_1 = require("@libs/fetch");
exports.id = "agit.xyz";
exports.name = "Agitoon";
exports.site = "https://agit501.xyz/";
exports.version = "1.0.0";
exports.icon = "src/kr/agitoon/agit.png";
var baseUrl = exports.site;
var Agitoon = /** @class */ (function () {
    function Agitoon() {
        this.id = "agit.xyz";
        this.name = "Agitoon";
        this.icon = "src/kr/agitoon/agit.png";
        this.site = "https://agit501.xyz/";
        this.version = "1.0.0";
    }
    Agitoon.prototype.popularNovels = function (pageNo, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var list_limit, day, res, resJson, novels;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        list_limit = 20 * (pageNo - 1);
                        day = new Date().getDay();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(baseUrl + "novel/index.update.php", {
                                headers: {
                                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                                },
                                body: "mode=get_data_novel_list_p&novel_menu=3&np_day=".concat(day, "&np_rank=1&np_distributor=0&np_genre=00&np_order=1&np_genre_ex_1=00&np_genre_ex_2=00&list_limit=").concat(list_limit, "&is_query_first=true"),
                                method: "POST",
                            })];
                    case 1:
                        res = _b.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        resJson = _b.sent();
                        novels = [];
                        (_a = resJson === null || resJson === void 0 ? void 0 : resJson.list) === null || _a === void 0 ? void 0 : _a.forEach(function (novel) {
                            novels.push({
                                url: baseUrl + "novel/list/" + novel.wr_id,
                                name: novel.wr_subject,
                                cover: baseUrl + novel.np_dir + "/thumbnail/" + novel.np_thumbnail,
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    Agitoon.prototype.parseNovelAndChapters = function (novelUrl) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var novelId, result, body, loadedCheerio, name, summary, author, cover, genresTag, genres, chapters, res, resJson, novel;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        novelId = novelUrl.split("/").reverse()[0];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(novelUrl)];
                    case 1:
                        result = _b.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _b.sent();
                        loadedCheerio = (0, cheerio_1.load)(body, { decodeEntities: false });
                        name = loadedCheerio("h5.pt-2").text();
                        summary = loadedCheerio(".pt-1.mt-1.pb-1.mb-1").text();
                        author = loadedCheerio(".post-item-list-cate-v")
                            .first()
                            .text()
                            .split(" : ")
                            .reverse()[0];
                        cover = baseUrl.slice(0, baseUrl.length - 1) +
                            loadedCheerio("div.col-5.pr-0.pl-0 img").attr("src");
                        genresTag = loadedCheerio(".col-7 > .post-item-list-cate > span");
                        genres = "";
                        genresTag.each(function (_, element) {
                            genres += loadedCheerio(element).text();
                            genres += ", ";
                        });
                        genres = genres.slice(0, genres.length - 2);
                        chapters = [];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(baseUrl + "novel/list.update.php", {
                                headers: {
                                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                                },
                                body: "mode=get_data_novel_list_c&wr_id_p=".concat(novelId, "&page_no=1&cnt_list=10000&order_type=Asc"),
                                method: "POST",
                            })];
                    case 3:
                        res = _b.sent();
                        return [4 /*yield*/, res.json()];
                    case 4:
                        resJson = _b.sent();
                        (_a = resJson === null || resJson === void 0 ? void 0 : resJson.list) === null || _a === void 0 ? void 0 : _a.forEach(function (chapter) {
                            chapters.push({
                                name: chapter.wr_subject,
                                url: baseUrl + "novel/view/".concat(chapter.wr_id, "/2"),
                                releaseTime: chapter.wr_datetime,
                            });
                        });
                        novel = {
                            url: novelUrl,
                            name: name,
                            cover: cover,
                            summary: summary,
                            author: author,
                            status: "",
                            genres: genres,
                            chapters: chapters,
                        };
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    Agitoon.prototype.parseChapter = function (chapterUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var result, body, loadedCheerio, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(chapterUrl)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        content = loadedCheerio("#id_wr_content").html() || '';
                        // gets rid of the popup thingy
                        content = content.replace("팝업메뉴는 빈공간을 더치하거나 스크룰시 사라집니다", "");
                        return [2 /*return*/, content];
                }
            });
        });
    };
    Agitoon.prototype.searchNovels = function (searchTerm, pageNo) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var rawResults, resJson, novels;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)("https://agit501.xyz/novel/search.php", {
                            headers: {
                                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                            },
                            body: "mode=get_data_novel_list_p_sch&search_novel=".concat(searchTerm, "&list_limit=0"),
                            method: "POST",
                        })];
                    case 1:
                        rawResults = _b.sent();
                        return [4 /*yield*/, rawResults.json()];
                    case 2:
                        resJson = _b.sent();
                        novels = [];
                        (_a = resJson === null || resJson === void 0 ? void 0 : resJson.list) === null || _a === void 0 ? void 0 : _a.forEach(function (novel) {
                            novels.push({
                                url: baseUrl + "novel/list/" + novel.wr_id,
                                name: novel.wr_subject,
                                cover: baseUrl + novel.np_dir + "/thumbnail/" + novel.np_thumbnail,
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    Agitoon.prototype.fetchImage = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, fetch_1.fetchFile)(url)];
            });
        });
    };
    return Agitoon;
}());
exports.default = new Agitoon();
