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
var cheerio_1 = require("cheerio");
var fetch_1 = require("@libs/fetch");
var filterInputs_1 = require("@libs/filterInputs");
var LnMTLPlugin = /** @class */ (function () {
    function LnMTLPlugin() {
        this.id = "lnmtl";
        this.name = "LnMTL";
        this.icon = "src/en/lnmtl/icon.png";
        this.site = "https://lnmtl.com/";
        this.version = "1.0.0";
        this.filters = {
            order: {
                value: "favourites",
                label: "Order by",
                options: [
                    { label: "Favourites", value: "favourites" },
                    { label: "Name", value: "name" },
                    { label: "Addition Date", value: "date" },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            sort: {
                value: "desc",
                label: "Sort by",
                options: [
                    { label: "Descending", value: "desc" },
                    { label: "Ascending", value: "asc" },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            storyStatus: {
                value: "all",
                label: "Status",
                options: [
                    { label: "All", value: "all" },
                    { label: "Ongoing", value: "ongoing" },
                    { label: "Finished", value: "finished" },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    LnMTLPlugin.prototype.popularNovels = function (page, _a) {
        var filters = _a.filters;
        return __awaiter(this, void 0, void 0, function () {
            var link, headers, body, loadedCheerio, novels;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        link = this.site + "novel?";
                        link += "orderBy=".concat(filters.order.value);
                        link += "&order=".concat(filters.sort.value);
                        link += "&filter=".concat(filters.storyStatus.value);
                        link += "&page=".concat(page);
                        headers = new Headers();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(link, { headers: headers }).then(function (result) {
                                return result.text();
                            })];
                    case 1:
                        body = _b.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio(".media").each(function () {
                            var novelName = loadedCheerio(this).find("h4").text();
                            var novelCover = loadedCheerio(this).find("img").attr("src");
                            var novelUrl = loadedCheerio(this).find("h4 > a").attr("href");
                            if (!novelUrl)
                                return;
                            var novel = {
                                name: novelName,
                                cover: novelCover,
                                url: novelUrl,
                            };
                            novels.push(novel);
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    ;
    LnMTLPlugin.prototype.parseNovelAndChapters = function (novelUrl) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var url, headers, result, body, loadedCheerio, novel, volumes, chapter, _i, volumes_1, volume, volumeData, volumePage, i, chapterData, chapterInfo, chapterDetails;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        url = novelUrl;
                        headers = new Headers();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url, { headers: headers })];
                    case 1:
                        result = _c.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _c.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            url: url,
                            chapters: [],
                        };
                        novel.name = loadedCheerio(".novel-name").text();
                        novel.cover = loadedCheerio("div.novel").find("img").attr("src");
                        novel.summary = loadedCheerio("div.description").text().trim();
                        loadedCheerio(".panel-body > dl").each(function () {
                            var detailName = loadedCheerio(this).find("dt").text().trim();
                            var detail = loadedCheerio(this).find("dd").text().trim();
                            switch (detailName) {
                                case "Authors":
                                    novel.author = detail;
                                    break;
                                case "Current status":
                                    novel.status = detail;
                                    break;
                            }
                        });
                        novel.genres = loadedCheerio('.panel-heading:contains(" Genres ")')
                            .next()
                            .text()
                            .trim()
                            .replace(/\s\s/g, ",");
                        volumes = JSON.parse(((_b = (_a = loadedCheerio("main")
                            .next()
                            .html()) === null || _a === void 0 ? void 0 : _a.match(/lnmtl.volumes = \[(.*?)\]/)[0]) === null || _b === void 0 ? void 0 : _b.replace("lnmtl.volumes = ", "")) || "");
                        chapter = [];
                        volumes = volumes.map(function (volume) { return volume.id; });
                        _i = 0, volumes_1 = volumes;
                        _c.label = 3;
                    case 3:
                        if (!(_i < volumes_1.length)) return [3 /*break*/, 11];
                        volume = volumes_1[_i];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "chapter?page=1&volumeId=").concat(volume))];
                    case 4:
                        volumeData = _c.sent();
                        return [4 /*yield*/, volumeData.json()];
                    case 5:
                        volumePage = _c.sent();
                        i = 1;
                        _c.label = 6;
                    case 6:
                        if (!(i <= volumePage.last_page)) return [3 /*break*/, 10];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "chapter?page=").concat(i, "&volumeId=").concat(volume))];
                    case 7:
                        chapterData = _c.sent();
                        return [4 /*yield*/, chapterData.json()];
                    case 8:
                        chapterInfo = _c.sent();
                        chapterDetails = chapterInfo.data.map(function (chapter) { return ({
                            name: "#".concat(chapter.number, " ").concat(chapter.title),
                            url: "".concat(_this.site, "chapter/").concat(chapter.slug),
                            releaseTime: chapter.created_at,
                        }); });
                        chapter.push.apply(chapter, chapterDetails);
                        _c.label = 9;
                    case 9:
                        i++;
                        return [3 /*break*/, 6];
                    case 10:
                        _i++;
                        return [3 /*break*/, 3];
                    case 11:
                        novel.chapters = chapter;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    ;
    LnMTLPlugin.prototype.parseChapter = function (chapterUrl) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var headers, result, body, loadedCheerio, chapterText;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        headers = new Headers();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(chapterUrl, { headers: headers })];
                    case 1:
                        result = _b.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _b.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        loadedCheerio('.original, script').remove();
                        loadedCheerio('sentence.translated').wrap('<p></p>');
                        chapterText = (_a = loadedCheerio('.chapter-body').html()) === null || _a === void 0 ? void 0 : _a.replace(/„/g, '“');
                        if (!chapterText) {
                            chapterText = loadedCheerio(".alert.alert-warning").text();
                        }
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    ;
    LnMTLPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, list, search, data, nov, novels;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site).then(function (r) { return r.text(); })];
                    case 1:
                        body = _b.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        list = (_a = loadedCheerio('footer')
                            .next()
                            .next()
                            .html()) === null || _a === void 0 ? void 0 : _a.match(/prefetch: '\/(.*json)/)[1];
                        return [4 /*yield*/, fetch("".concat(this.site).concat(list))];
                    case 2:
                        search = _b.sent();
                        return [4 /*yield*/, search.json()];
                    case 3:
                        data = _b.sent();
                        nov = data.filter(function (res) {
                            return res.name.toLowerCase().includes(searchTerm.toLowerCase());
                        });
                        novels = [];
                        nov.map(function (res) {
                            var novelName = res.name;
                            var novelUrl = "".concat(_this.site, "novel/").concat(res.slug);
                            var novelCover = res.image;
                            var novel = {
                                url: novelUrl,
                                name: novelName,
                                cover: novelCover,
                            };
                            novels.push(novel);
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    ;
    LnMTLPlugin.prototype.fetchImage = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchFile)(url)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return LnMTLPlugin;
}());
exports.default = new LnMTLPlugin();
