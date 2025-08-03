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
var defaultCover_1 = require("@libs/defaultCover");
var fetch_1 = require("@libs/fetch");
var novelStatus_1 = require("@libs/novelStatus");
var filterInputs_1 = require("@libs/filterInputs");
var BLN = /** @class */ (function () {
    function BLN() {
        this.id = 'BLN';
        this.name = 'BestLightNovel';
        this.icon = 'src/en/bestlightnovel/icon.png';
        this.site = 'https://bestlightnovel.com/';
        this.version = '1.0.1';
        this.filters = {
            status: {
                label: 'Status',
                value: 'all',
                options: [
                    { label: 'ALL', value: 'all' },
                    { label: 'Completed', value: 'completed' },
                    { label: 'Ongoing', value: 'ongoing' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            type: {
                value: 'topview',
                label: 'Type',
                options: [
                    { label: 'Recently updated', value: 'latest' },
                    { label: 'Newest', value: 'newest' },
                    { label: 'Top view', value: 'topview' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            category: {
                label: 'Category',
                value: 'all',
                options: [
                    { label: 'ALL', value: 'all' },
                    { label: 'Action', value: '1' },
                    { label: 'Adventure', value: '2' },
                    { label: 'Animals', value: '65' },
                    { label: 'Arts', value: '40' },
                    { label: 'Biographies', value: '41' },
                    { label: 'Business', value: '42' },
                    { label: 'Chinese', value: '3' },
                    { label: 'Comedy', value: '4' },
                    { label: 'Computers', value: '43' },
                    { label: 'Crafts, Hobbies', value: '45' },
                    { label: 'Drama', value: '5' },
                    { label: 'Education', value: '46' },
                    { label: 'English', value: '6' },
                    { label: 'Entertainment', value: '47' },
                    { label: 'Fantasy', value: '7' },
                    { label: 'Fiction', value: '48' },
                    { label: 'Gender Bender', value: '8' },
                    { label: 'Harem', value: '9' },
                    { label: 'Historical', value: '10' },
                    { label: 'History', value: '49' },
                    { label: 'Home', value: '50' },
                    { label: 'Horror', value: '11' },
                    { label: 'Humor', value: '51' },
                    { label: 'Investing', value: '52' },
                    { label: 'Josei', value: '12' },
                    { label: 'Korean', value: '13' },
                    { label: 'Literature', value: '53' },
                    { label: 'Lolicon', value: '14' },
                    { label: 'Martial Arts', value: '15' },
                    { label: 'Mature', value: '16' },
                    { label: 'Mecha', value: '17' },
                    { label: 'Memoirs', value: '54' },
                    { label: 'Mystery', value: '18' },
                    { label: 'Original', value: '19' },
                    { label: 'Other Books', value: '66' },
                    { label: 'Philosophy', value: '55' },
                    { label: 'Photography', value: '56' },
                    { label: 'Politics', value: '57' },
                    { label: 'Professional', value: '58' },
                    { label: 'Psychological', value: '20' },
                    { label: 'Reference', value: '59' },
                    { label: 'Reincarnation', value: '21' },
                    { label: 'Religion', value: '60' },
                    { label: 'Romance', value: '22' },
                    { label: 'School Life', value: '23' },
                    { label: 'School Stories', value: '67' },
                    { label: 'Sci-Fi', value: '24' },
                    { label: 'Seinen', value: '25' },
                    { label: 'Short Stories', value: '68' },
                    { label: 'Shotacon', value: '26' },
                    { label: 'Shoujo', value: '27' },
                    { label: 'Shoujo Ai', value: '28' },
                    { label: 'Shounen', value: '29' },
                    { label: 'Shounen Ai', value: '30' },
                    { label: 'Slice Of Life', value: '31' },
                    { label: 'Smut', value: '32' },
                    { label: 'Social Science', value: '61' },
                    { label: 'Spirituality', value: '62' },
                    { label: 'Sports', value: '33' },
                    { label: 'Supernatural', value: '34' },
                    { label: 'Teaser', value: '69' },
                    { label: 'Technical', value: '63' },
                    { label: 'Technology', value: '64' },
                    { label: 'Tragedy', value: '35' },
                    { label: 'Virtual Reality', value: '36' },
                    { label: 'Wuxia', value: '37' },
                    { label: 'Xianxia', value: '38' },
                    { label: 'Xuanhuan', value: '39' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    BLN.prototype.parseNovels = function (loadedCheerio) {
        var _this = this;
        var novels = [];
        loadedCheerio('.update_item.list_category').each(function (i, el) {
            var novelUrl = loadedCheerio(el).find('h3 > a').attr('href');
            if (!novelUrl) {
                // TODO: Handle error
                console.error('No novel url!');
                return;
            }
            var novelName = loadedCheerio(el).find('h3 > a').text();
            var novelCover = loadedCheerio(el).find('img').attr('src');
            var novel = {
                name: novelName,
                path: novelUrl.replace(_this.site, ''),
                cover: novelCover,
            };
            novels.push(novel);
        });
        return novels;
    };
    BLN.prototype.popularNovels = function (page_1, _a) {
        return __awaiter(this, arguments, void 0, function (page, _b) {
            var link, result, _c, _d, body, loadedCheerio;
            var filters = _b.filters;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        link = this.site + 'novel_list?';
                        link += 'type=' + filters.type.value;
                        link += '&category=' + filters.category.value;
                        link += '&state=' + filters.status.value;
                        link += '&page=' + page;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(link)];
                    case 1:
                        result = _e.sent();
                        if (!!result.ok) return [3 /*break*/, 3];
                        _d = (_c = console).error;
                        return [4 /*yield*/, result.text()];
                    case 2:
                        _d.apply(_c, [_e.sent()]);
                        // TODO: Cloudflare protection or other error
                        return [2 /*return*/, []];
                    case 3: return [4 /*yield*/, result.text()];
                    case 4:
                        body = _e.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, this.parseNovels(loadedCheerio)];
                }
            });
        });
    };
    BLN.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var result, body, loadedCheerio, novel, chapter;
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
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('.truyen_info_right  h1').text().trim() || '',
                            cover: loadedCheerio('.info_image img').attr('src') || defaultCover_1.defaultCover,
                            summary: ((_a = loadedCheerio('#noidungm').text()) === null || _a === void 0 ? void 0 : _a.trim()) || '',
                            chapters: [],
                        };
                        loadedCheerio('ul.truyen_info_right > li').each(function () {
                            var detailName = loadedCheerio(this).find('span').text();
                            var detail = loadedCheerio(this)
                                .find('a')
                                .map(function (a, ex) { return loadedCheerio(ex).text(); })
                                .toArray()
                                .join(', ');
                            switch (detailName) {
                                case 'Author(s): ':
                                    novel.author = detail;
                                    break;
                                case 'GENRES: ':
                                    novel.genres = detail;
                                    break;
                                case 'STATUS : ':
                                    novel.status =
                                        detail === 'Ongoing'
                                            ? novelStatus_1.NovelStatus.Ongoing
                                            : detail === 'Completed'
                                                ? novelStatus_1.NovelStatus.Completed
                                                : novelStatus_1.NovelStatus.Unknown;
                            }
                        });
                        chapter = [];
                        loadedCheerio('.chapter-list div.row').each(function (i, el) {
                            var chapterName = loadedCheerio(el).find('a').text().trim();
                            var releaseDate = loadedCheerio(el).find('span:last').text().trim();
                            var months = [
                                'jan',
                                'feb',
                                'mar',
                                'apr',
                                'may',
                                'jun',
                                'jul',
                                'aug',
                                'sep',
                                'oct',
                                'nov',
                                'dec',
                            ].join('|');
                            var rx = new RegExp("(".concat(months, ")-(\\d{1,2})-(\\d{2})"), 'i').exec(releaseDate);
                            if (!rx)
                                return;
                            var year = 2000 + +rx[3];
                            var month = months.indexOf(rx[1].toLowerCase());
                            var day = +rx[2];
                            var chapterUrl = loadedCheerio(el).find('a').attr('href');
                            if (!chapterUrl) {
                                // TODO: Handle error
                                console.error('No chapter url!');
                                return;
                            }
                            chapter.push({
                                name: chapterName,
                                releaseTime: new Date(year, month, day).toISOString(),
                                path: chapterUrl.replace(_this.site, ''),
                            });
                        });
                        novel.chapters = chapter.reverse();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    BLN.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var result, body, loadedCheerio, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        chapterText = loadedCheerio('#vung_doc').html() || '';
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    BLN.prototype.searchNovels = function (searchTerm, page) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "search_novels/").concat(encodeURIComponent(searchTerm), "?page=").concat(page);
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
    return BLN;
}());
exports.default = new BLN();
