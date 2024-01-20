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
var fetch_1 = require("@libs/fetch");
var SkyNovels = /** @class */ (function () {
    function SkyNovels() {
        this.id = "skynovels.net";
        this.name = "SkyNovels";
        this.site = "https://www.skynovels.net/";
        this.version = "1.0.0";
        this.icon = "src/es/skynovels/icon.png";
        this.baseUrl = this.site;
    }
    SkyNovels.prototype.popularNovels = function (pageNo, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, novels;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = "https://api.skynovels.net/api/novels?&q";
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _b.sent();
                        return [4 /*yield*/, result.json()];
                    case 2:
                        body = _b.sent();
                        novels = [];
                        (_a = body.novels) === null || _a === void 0 ? void 0 : _a.forEach(function (res) {
                            var novelName = res.nvl_title;
                            var novelCover = "https://api.skynovels.net/api/get-image/" +
                                res.image +
                                "/novels/false";
                            var novelUrl = _this.baseUrl + "novelas/" + res.id + "/" + res.nvl_name + "/";
                            var novel = { name: novelName, url: novelUrl, cover: novelCover };
                            novels.push(novel);
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    SkyNovels.prototype.parseNovelAndChapters = function (novelUrl) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var novelId, url, result, body, item, novel, genres, novelChapters;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        novelId = novelUrl.split("/")[4];
                        url = "https://api.skynovels.net/api/novel/" + novelId + "/reading?&q";
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _d.sent();
                        return [4 /*yield*/, result.json()];
                    case 2:
                        body = _d.sent();
                        item = (_a = body === null || body === void 0 ? void 0 : body.novel) === null || _a === void 0 ? void 0 : _a[0];
                        novel = { url: novelUrl };
                        novel.name = item === null || item === void 0 ? void 0 : item.nvl_title;
                        novel.cover =
                            "https://api.skynovels.net/api/get-image/" +
                                (item === null || item === void 0 ? void 0 : item.image) +
                                "/novels/false";
                        genres = [];
                        (_b = item === null || item === void 0 ? void 0 : item.genres) === null || _b === void 0 ? void 0 : _b.forEach(function (genre) { return genres.push(genre.genre_name); });
                        novel.genres = genres.join(",");
                        novel.author = item === null || item === void 0 ? void 0 : item.nvl_writer;
                        novel.summary = item === null || item === void 0 ? void 0 : item.nvl_content;
                        novel.status = item === null || item === void 0 ? void 0 : item.nvl_status;
                        novelChapters = [];
                        (_c = item === null || item === void 0 ? void 0 : item.volumes) === null || _c === void 0 ? void 0 : _c.forEach(function (volume) {
                            var _a;
                            (_a = volume === null || volume === void 0 ? void 0 : volume.chapters) === null || _a === void 0 ? void 0 : _a.forEach(function (chapter) {
                                var chapterName = chapter.chp_index_title;
                                var releaseDate = new Date(chapter.createdAt).toDateString();
                                var chapterUrl = novelUrl + chapter.id + "/" + chapter.chp_name;
                                var chap = {
                                    name: chapterName,
                                    releaseTime: releaseDate,
                                    url: chapterUrl,
                                };
                                novelChapters.push(chap);
                            });
                        });
                        novel.chapters = novelChapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    SkyNovels.prototype.parseChapter = function (chapterUrl) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var chapterId, url, result, body, item, chapterText;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        chapterId = chapterUrl.split("/")[6];
                        url = "https://api.skynovels.net/api/novel-chapter/".concat(chapterId);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _b.sent();
                        return [4 /*yield*/, result.json()];
                    case 2:
                        body = _b.sent();
                        item = (_a = body === null || body === void 0 ? void 0 : body.chapter) === null || _a === void 0 ? void 0 : _a[0];
                        chapterText = (item === null || item === void 0 ? void 0 : item.chp_content) || '404';
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    SkyNovels.prototype.searchNovels = function (searchTerm, pageNo) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, results, novels;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        searchTerm = searchTerm.toLowerCase();
                        url = "https://api.skynovels.net/api/novels?&q";
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _b.sent();
                        return [4 /*yield*/, result.json()];
                    case 2:
                        body = _b.sent();
                        ;
                        results = (_a = body === null || body === void 0 ? void 0 : body.novels) === null || _a === void 0 ? void 0 : _a.filter(function (novel) {
                            return novel.nvl_title.toLowerCase().includes(searchTerm);
                        });
                        novels = [];
                        results === null || results === void 0 ? void 0 : results.forEach(function (res) {
                            var novelName = res.nvl_title;
                            var novelCover = "https://api.skynovels.net/api/get-image/" +
                                res.image +
                                "/novels/false";
                            var novelUrl = _this.baseUrl + "novelas/" + res.id + "/" + res.nvl_name + "/";
                            var novel = { name: novelName, url: novelUrl, cover: novelCover };
                            novels.push(novel);
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    SkyNovels.prototype.fetchImage = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, fetch_1.fetchFile)(url)];
            });
        });
    };
    return SkyNovels;
}());
exports.default = new SkyNovels();
