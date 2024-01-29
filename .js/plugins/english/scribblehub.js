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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = require("cheerio");
var fetch_1 = require("@libs/fetch");
var filterInputs_1 = require("@libs/filterInputs");
var dayjs_1 = __importDefault(require("dayjs"));
var ScribbleHubPlugin = /** @class */ (function () {
    function ScribbleHubPlugin() {
        this.id = "scribblehub";
        this.name = "ScribbleHub";
        this.icon = "src/en/scribblehub/icon.png";
        this.site = "https://www.scribblehub.com/";
        this.version = "1.0.0";
        this.filters = {
            sort: {
                label: "Sort Results By",
                value: "ratings",
                options: [
                    { label: "Chapters", value: "chapters" },
                    { label: "Chapters per week", value: "frequency" },
                    { label: "Date Added", value: "dateadded" },
                    { label: "Favorites", value: "favorites" },
                    { label: "Last Updated", value: "lastchdate" },
                    { label: "Number of Ratings", value: "numofrate" },
                    { label: "Pages", value: "pages" },
                    { label: "Pageviews", value: "pageviews" },
                    { label: "Ratings", value: "ratings" },
                    { label: "Readers", value: "readers" },
                    { label: "Reviews", value: "reviews" },
                    { label: "Total Words", value: "totalwords" },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            order: {
                label: "Order by",
                value: "desc",
                options: [
                    { label: "Descending", value: "desc" },
                    { label: "Ascending", value: "asc" },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            storyStatus: {
                label: "Story Status (Translation)",
                value: "",
                options: [
                    { label: "All", value: "all" },
                    { label: "Completed", value: "completed" },
                    { label: "Ongoing", value: "ongoing" },
                    { label: "Hiatus", value: "hiatus" },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genres: {
                label: 'Genres',
                value: {
                    include: [],
                    exclude: [],
                },
                options: [
                    { label: 'Action', value: '9' },
                    { label: 'Adult', value: '902' },
                    { label: 'Adventure', value: '8' },
                    { label: 'Boys Love', value: '891' },
                    { label: 'Comedy', value: '7' },
                    { label: 'Drama', value: '903' },
                    { label: 'Ecchi', value: '904' },
                    { label: 'Fanfiction', value: '38' },
                    { label: 'Fantasy', value: '19' },
                    { label: 'Gender Bender', value: '905' },
                    { label: 'Girls Love', value: '892' },
                    { label: 'Harem', value: '1015' },
                    { label: 'Historical', value: '21' },
                    { label: 'Horror', value: '22' },
                    { label: 'Isekai', value: '37' },
                    { label: 'Josei', value: '906' },
                    { label: 'LitRPG', value: '1180' },
                    { label: 'Martial Arts', value: '907' },
                    { label: 'Mature', value: '20' },
                    { label: 'Mecha', value: '908' },
                    { label: 'Mystery', value: '909' },
                    { label: 'Psychological', value: '910' },
                    { label: 'Romance', value: '6' },
                    { label: 'School Life', value: '911' },
                    { label: 'Sci-fi', value: '912' },
                    { label: 'Seinen', value: '913' },
                    { label: 'Slice of Life', value: '914' },
                    { label: 'Smut', value: '915' },
                    { label: 'Sports', value: '916' },
                    { label: 'Supernatural', value: '5' },
                    { label: 'Tragedy', value: '901' },
                ],
                type: filterInputs_1.FilterTypes.ExcludableCheckboxGroup,
            },
            genre_operator: {
                value: 'and',
                label: 'Genre And/Or',
                options: [
                    { label: 'OR', value: 'or' },
                    { label: 'AND', value: 'and' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            content_warning: {
                value: {
                    include: [],
                    exclude: [],
                },
                label: "Mature Content",
                options: [
                    { label: 'Gore', value: '48' },
                    { label: 'Sexual Content', value: '50' },
                    { label: 'Strong Language', value: '49' },
                ],
                type: filterInputs_1.FilterTypes.ExcludableCheckboxGroup
            },
            content_warning_operator: {
                value: 'and',
                label: 'Mature Content And/Or',
                options: [
                    { label: 'OR', value: 'or' },
                    { label: 'AND', value: 'and' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    ScribbleHubPlugin.prototype.parseNovels = function (loadedCheerio) {
        var novels = [];
        loadedCheerio('.search_main_box').each(function () {
            var novelName = loadedCheerio(this).find('.search_title > a').text();
            var novelCover = loadedCheerio(this).find('.search_img > img').attr('src');
            var novelUrl = loadedCheerio(this).find('.search_title > a').attr('href');
            if (!novelUrl)
                return;
            var novel = {
                name: novelName,
                cover: novelCover,
                url: novelUrl,
            };
            novels.push(novel);
        });
        return novels;
    };
    ScribbleHubPlugin.prototype.popularNovels = function (page, _a) {
        var _b, _c, _d, _e, _f, _g, _h, _j;
        var showLatestNovels = _a.showLatestNovels, filters = _a.filters;
        return __awaiter(this, void 0, void 0, function () {
            var link, body, loadedCheerio;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        link = "".concat(this.site);
                        if (showLatestNovels)
                            link += "latest-series/";
                        else // if (filters.genres.value.include?.length ||
                            // filters.genres.value.exclude?.length)
                            link += "series-finder/?sf=1";
                        // else
                        // link += "series-ranking/";
                        // TODO, series-ranking filters when hideOnSelect come out
                        if ((_b = filters.genres.value.include) === null || _b === void 0 ? void 0 : _b.length)
                            link += '&gi=' + filters.genres.value.include.join(',');
                        if ((_c = filters.genres.value.exclude) === null || _c === void 0 ? void 0 : _c.length)
                            link += '&ge=' + filters.genres.value.exclude.join(',');
                        if (((_d = filters.genres.value.include) === null || _d === void 0 ? void 0 : _d.length) || ((_e = filters.genres.value.exclude) === null || _e === void 0 ? void 0 : _e.length))
                            link += '&mgi=' + filters.genre_operator.value;
                        if ((_f = filters.content_warning.value.include) === null || _f === void 0 ? void 0 : _f.length)
                            link += '&cti=' + filters.content_warning.value.include.join(',');
                        if ((_g = filters.content_warning.value.exclude) === null || _g === void 0 ? void 0 : _g.length)
                            link += '&cte=' + filters.content_warning.value.exclude.join(',');
                        if (((_h = filters.content_warning.value.include) === null || _h === void 0 ? void 0 : _h.length) ||
                            ((_j = filters.content_warning.value.exclude) === null || _j === void 0 ? void 0 : _j.length))
                            link += '&mct' + filters.content_warning_operator.value;
                        link += '&sort=' + filters.sort.value;
                        link += '&order=' + filters.order.value;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(link).then(function (result) {
                                return result.text();
                            })];
                    case 1:
                        body = _k.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, this.parseNovels(loadedCheerio)];
                }
            });
        });
    };
    ScribbleHubPlugin.prototype.parseNovelAndChapters = function (novelUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, novel, formData, data, text, chapter, parseISODate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = novelUrl;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            url: url,
                            chapters: [],
                        };
                        novel.name = loadedCheerio('.fic_title').text();
                        novel.cover = loadedCheerio('.fic_image > img').attr('src');
                        novel.summary = loadedCheerio('.wi_fic_desc').text();
                        novel.genres = loadedCheerio('.fic_genre')
                            .map(function (i, el) { return loadedCheerio(el).text(); })
                            .toArray()
                            .join(",");
                        novel.status = loadedCheerio('.rnd_stats')
                            .next()
                            .text()
                            .includes('Ongoing')
                            ? 'Ongoing'
                            : 'Completed';
                        novel.author = loadedCheerio('.auth_name_fic').text();
                        formData = new FormData();
                        formData.append('action', 'wi_getreleases_pagination');
                        formData.append('pagenum', '-1');
                        formData.append('mypostid', novelUrl.split('/')[4]);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "wp-admin/admin-ajax.php"), {
                                method: 'POST',
                                body: formData,
                            })];
                    case 3:
                        data = _a.sent();
                        return [4 /*yield*/, data.text()];
                    case 4:
                        text = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(text);
                        chapter = [];
                        parseISODate = function (date) {
                            var _a;
                            if (date.includes("ago")) {
                                var dayJSDate = (0, dayjs_1.default)(new Date()); // today
                                var timeAgo = ((_a = date.match(/\d+/)) === null || _a === void 0 ? void 0 : _a[0]) || "";
                                var timeAgoInt = parseInt(timeAgo, 10);
                                if (!timeAgo)
                                    return date; // there is no number!
                                if (date.includes("hours ago") || date.includes("hour ago")) {
                                    dayJSDate.subtract(timeAgoInt, "hours"); // go back N hours
                                }
                                if (date.includes("days ago") || date.includes("day ago")) {
                                    dayJSDate.subtract(timeAgoInt, "days"); // go back N days
                                }
                                if (date.includes("months ago") || date.includes("month ago")) {
                                    dayJSDate.subtract(timeAgoInt, "months"); // go back N months
                                }
                                return dayJSDate.toISOString();
                            }
                            return null;
                        };
                        loadedCheerio('.toc_w').each(function () {
                            var chapterName = loadedCheerio(this).find('.toc_a').text();
                            var releaseDate = loadedCheerio(this).find('.fic_date_pub').text();
                            var chapterUrl = loadedCheerio(this).find('a').attr('href');
                            if (!chapterUrl)
                                return;
                            chapter.push({
                                name: chapterName,
                                releaseTime: parseISODate(releaseDate),
                                url: chapterUrl,
                            });
                        });
                        novel.chapters = chapter.reverse();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    ScribbleHubPlugin.prototype.parseChapter = function (chapterUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var result, body, loadedCheerio, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(chapterUrl)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        chapterText = loadedCheerio('div.chp_raw').html() || '';
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    ScribbleHubPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "?s=").concat(searchTerm, "&post_type=fictionposts");
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
    ScribbleHubPlugin.prototype.fetchImage = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchFile)(url)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return ScribbleHubPlugin;
}());
exports.default = new ScribbleHubPlugin();
