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
var isAbsoluteUrl_1 = require("@libs/isAbsoluteUrl");
var novelStatus_1 = require("@libs/novelStatus");
var filterInputs_1 = require("@libs/filterInputs");
var HakoPlugin = /** @class */ (function () {
    function HakoPlugin() {
        this.id = "ln.hako";
        this.name = "Hako";
        this.icon = "src/vi/hakolightnovel/icon.png";
        this.site = "https://ln.hako.vn";
        this.version = "1.0.1";
        this.filters = {
            alphabet: {
                type: filterInputs_1.FilterTypes.Picker,
                value: "",
                label: "Chữ cái",
                options: [
                    { label: 'Tất cả', value: '' },
                    { label: 'Khác', value: 'khac' },
                    { label: 'A', value: 'a' },
                    { label: 'B', value: 'b' },
                    { label: 'C', value: 'c' },
                    { label: 'D', value: 'd' },
                    { label: 'E', value: 'e' },
                    { label: 'F', value: 'f' },
                    { label: 'G', value: 'g' },
                    { label: 'H', value: 'h' },
                    { label: 'I', value: 'i' },
                    { label: 'J', value: 'j' },
                    { label: 'K', value: 'k' },
                    { label: 'L', value: 'l' },
                    { label: 'M', value: 'm' },
                    { label: 'N', value: 'n' },
                    { label: 'O', value: 'o' },
                    { label: 'P', value: 'p' },
                    { label: 'Q', value: 'q' },
                    { label: 'R', value: 'r' },
                    { label: 'S', value: 's' },
                    { label: 'T', value: 't' },
                    { label: 'U', value: 'u' },
                    { label: 'V', value: 'v' },
                    { label: 'W', value: 'w' },
                    { label: 'X', value: 'x' },
                    { label: 'Y', value: 'y' },
                    { label: 'Z', value: 'z' },
                ]
            },
            type: {
                type: filterInputs_1.FilterTypes.CheckboxGroup,
                label: "Phân loại",
                value: [],
                options: [
                    { label: "Truyện dịch", value: "truyendich" },
                    { label: "Truyện sáng tác", value: "sangtac" },
                    { label: "Convert", value: "convert" }
                ]
            },
            status: {
                type: filterInputs_1.FilterTypes.CheckboxGroup,
                label: "Tình trạng",
                value: [],
                options: [
                    { label: "Đang tiến hành", value: "dangtienhanh" },
                    { label: "Tạm ngưng", value: "tamngung" },
                    { label: "Đã hoàn thành", value: "hoanthanh" }
                ]
            },
            sort: {
                type: filterInputs_1.FilterTypes.Picker,
                label: "Sắp xếp",
                value: "top",
                options: [
                    { label: "A-Z", value: "tentruyen" },
                    { label: "Z-A", value: "tentruyenza" },
                    { label: "Mới cập nhật", value: "capnhat" },
                    { label: "Truyện mới", value: "truyenmoi" },
                    { label: "Theo dõi", value: "theodoi" },
                    { label: "Top toàn thời gian", value: "top" },
                    { label: "Top tháng", value: "topthang" },
                    { label: "Số từ", value: "sotu" },
                ]
            }
        };
    }
    HakoPlugin.prototype.parseNovels = function (loadedCheerio) {
        var _this = this;
        var novels = [];
        loadedCheerio("#mainpart .row .thumb-item-flow").each(function (index, ele) {
            var url = loadedCheerio(ele)
                .find("div.thumb_attr.series-title > a")
                .attr("href");
            if (url && !(0, isAbsoluteUrl_1.isUrlAbsolute)(url)) {
                url = _this.site + url;
            }
            if (url) {
                var name_1 = loadedCheerio(ele)
                    .find(".series-title")
                    .text()
                    .trim();
                var cover = loadedCheerio(ele)
                    .find(".img-in-ratio")
                    .attr("data-bg");
                if (cover && !(0, isAbsoluteUrl_1.isUrlAbsolute)(cover)) {
                    cover = _this.site + cover;
                }
                var novel = { name: name_1, url: url, cover: cover };
                novels.push(novel);
            }
        });
        return novels;
    };
    HakoPlugin.prototype.popularNovels = function (pageNo, _a) {
        var showLatestNovels = _a.showLatestNovels, filters = _a.filters;
        return __awaiter(this, void 0, void 0, function () {
            var link, params, _i, _b, novelType, _c, _d, status_1, result, body, loadedCheerio;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        link = this.site + "/danh-sach";
                        if (filters.alphabet.value) {
                            link += "/" + filters.alphabet.value;
                        }
                        params = new URLSearchParams();
                        for (_i = 0, _b = filters.type.value; _i < _b.length; _i++) {
                            novelType = _b[_i];
                            params.append(novelType, "1");
                        }
                        for (_c = 0, _d = filters.status.value; _c < _d.length; _c++) {
                            status_1 = _d[_c];
                            params.append(status_1, "1");
                        }
                        params.append("sapxep", filters.sort.value);
                        link += '?' + params.toString() + '&page=' + pageNo;
                        return [4 /*yield*/, fetch(link)];
                    case 1:
                        result = _e.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _e.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, this.parseNovels(loadedCheerio)];
                }
            });
        });
    };
    HakoPlugin.prototype.parseNovelAndChapters = function (novelUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var novel, result, body, loadedCheerio, background, novelCover, num, part, chapters;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        novel = {
                            url: novelUrl,
                        };
                        return [4 /*yield*/, fetch(novelUrl)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel.name = loadedCheerio(".series-name").text().trim();
                        background = loadedCheerio(".series-cover > .a6-ratio > div").attr("style") ||
                            "";
                        novelCover = background.substring(background.indexOf("http"), background.length - 2);
                        novel.cover = novelCover
                            ? (0, isAbsoluteUrl_1.isUrlAbsolute)(novelCover)
                                ? novelCover
                                : this.site + novelCover
                            : "";
                        novel.summary = loadedCheerio(".summary-content").text().trim();
                        novel.genres = loadedCheerio(".series-information > div:nth-child(1)")
                            .text()
                            .trim()
                            .split(/\n[\s\n]*/).join(',');
                        novel.author = loadedCheerio('.series-information > div:nth-child(2) > .info-value')
                            .text()
                            .trim();
                        novel.artist = loadedCheerio('.series-information > div:nth-child(3) > .info-value')
                            .text()
                            .trim();
                        novel.status = loadedCheerio('.series-information > div:nth-child(4) > .info-value')
                            .text()
                            .trim();
                        switch (novel.status) {
                            case 'Đang tiến hành':
                                novel.status = novelStatus_1.NovelStatus.Ongoing;
                                break;
                            case 'Tạm ngưng':
                                novel.status = novelStatus_1.NovelStatus.OnHiatus;
                                break;
                            case 'Completed':
                                novel.status = novelStatus_1.NovelStatus.Completed;
                                break;
                            default:
                                novel.status = novelStatus_1.NovelStatus.Unknown;
                        }
                        num = 0, part = 1;
                        chapters = loadedCheerio('.list-chapters li').toArray().map(function (ele) {
                            var _a;
                            var chapterUrl = _this.site + loadedCheerio(ele).find("a").attr("href");
                            var chapterName = loadedCheerio(ele)
                                .find(".chapter-name")
                                .text()
                                .trim();
                            var chapterNumber = Number((_a = chapterName.match(/Chương\s*(\d+)/i)) === null || _a === void 0 ? void 0 : _a[1]);
                            if (chapterNumber) {
                                num = chapterNumber;
                                part = 1;
                            }
                            else {
                                chapterNumber = num + part / 10;
                                part++;
                            }
                            var chapterTime = loadedCheerio(ele)
                                .find(".chapter-time")
                                .text()
                                .split('/')
                                .map(function (x) { return Number(x); });
                            return {
                                url: chapterUrl || '',
                                name: chapterName,
                                releaseTime: new Date(chapterTime[2], chapterTime[1], chapterTime[0]).toISOString(),
                                chapterNumber: chapterNumber,
                            };
                        }).filter(function (c) { return c.url; });
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    HakoPlugin.prototype.parseChapter = function (chapterUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var result, body, loadedCheerio, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(chapterUrl)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        chapterText = loadedCheerio("#chapter-content").html() || "";
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    HakoPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + "/tim-kiem?keywords=" + searchTerm + '&page=' + pageNo;
                        return [4 /*yield*/, fetch(url)];
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
    HakoPlugin.prototype.fetchImage = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var headers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        headers = {
                            Referer: "https://ln.hako.vn",
                        };
                        return [4 /*yield*/, (0, fetch_1.fetchFile)(url, { headers: headers })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return HakoPlugin;
}());
exports.default = new HakoPlugin();
