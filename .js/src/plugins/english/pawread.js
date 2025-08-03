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
var htmlparser2_1 = require("htmlparser2");
var fetch_1 = require("@libs/fetch");
var filterInputs_1 = require("@libs/filterInputs");
var PawRead = /** @class */ (function () {
    function PawRead() {
        this.id = 'pawread';
        this.name = 'PawRead';
        this.version = '2.1.0';
        this.icon = 'src/en/pawread/icon.png';
        this.site = 'https://m.pawread.com/';
        this.filters = {
            status: {
                value: '',
                label: 'Status',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Completed', value: 'wanjie' },
                    { label: 'Ongoing', value: 'lianzai' },
                    { label: 'Hiatus', value: 'hiatus' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            lang: {
                value: '',
                label: 'Languages',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Chinese', value: 'chinese' },
                    { label: 'Korean', value: 'korean' },
                    { label: 'Japanese', value: 'japanese' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genre: {
                value: '',
                label: 'Genres',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Fantasy', value: 'Fantasy' },
                    { label: 'Action', value: 'Action' },
                    { label: 'Xuanhuan', value: 'Xuanhuan' },
                    { label: 'Romance', value: 'Romance' },
                    { label: 'Comedy', value: 'Comedy' },
                    { label: 'Mystery', value: 'Mystery' },
                    { label: 'Mature', value: 'Mature' },
                    { label: 'Harem', value: 'Harem' },
                    { label: 'Wuxia', value: 'Wuxia' },
                    { label: 'Xianxia', value: 'Xianxia' },
                    { label: 'Tragedy', value: 'Tragedy' },
                    { label: 'Sci-fi', value: 'Scifi' },
                    { label: 'Historical', value: 'Historical' },
                    { label: 'Ecchi', value: 'Ecchi' },
                    { label: 'Adventure', value: 'Adventure' },
                    { label: 'Adult', value: 'Adult' },
                    { label: 'Supernatural', value: 'Supernatural' },
                    { label: 'Psychological', value: 'Psychological' },
                    { label: 'Drama', value: 'Drama' },
                    { label: 'Horror', value: 'Horror' },
                    { label: 'Josei', value: 'Josei' },
                    { label: 'Mecha', value: 'Mecha' },
                    { label: 'Seinen', value: 'Seinen' },
                    { label: 'Shoujo', value: 'Shoujo' },
                    { label: 'Shounen', value: 'Shounen' },
                    { label: 'Smut', value: 'Smut' },
                    { label: 'Yaoi', value: 'Yaoi' },
                    { label: 'Yuri', value: 'Yuri' },
                    { label: 'Martial Arts', value: 'MartialArts' },
                    { label: 'School Life', value: 'SchoolLife' },
                    { label: 'Shoujo Ai', value: 'ShoujoAi' },
                    { label: 'Shounen Ai', value: 'ShounenAi' },
                    { label: 'Slice of Life', value: 'SliceofLife' },
                    { label: 'Gender Bender', value: 'GenderBender' },
                    { label: 'Sports', value: 'Sports' },
                    { label: 'Urban', value: 'Urban' },
                    { label: 'Adventurer', value: 'Adventurer' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            sort: {
                value: 'click',
                label: 'Sort By',
                options: [
                    { label: 'Time Updated', value: 'update' },
                    { label: 'Time Posted', value: 'post' },
                    { label: 'Clicks', value: 'click' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            order: {
                value: false,
                label: 'Order ↑ ↓',
                type: filterInputs_1.FilterTypes.Switch,
            },
        };
    }
    PawRead.prototype.parseNovels = function (html) {
        var novels = [];
        var tempNovel = {};
        var state = ParsingState.Idle;
        var parser = new htmlparser2_1.Parser({
            onopentag: function (name, attribs) {
                if (attribs.class &&
                    (attribs.class.includes('list-comic') ||
                        attribs.class.includes('itemBox'))) {
                    state = ParsingState.Novel;
                }
                if (state !== ParsingState.Novel)
                    return;
                switch (name) {
                    case 'a':
                        if (attribs.class === 'txtA' || attribs.class === 'title') {
                            tempNovel.path = attribs.href.split('/').slice(1, 3).join('/');
                            state = ParsingState.NovelName;
                        }
                        break;
                    case 'img':
                        tempNovel.cover = attribs.src;
                        break;
                }
            },
            ontext: function (text) {
                if (state === ParsingState.NovelName) {
                    tempNovel.name = (tempNovel.name || '') + text;
                }
            },
            onclosetag: function (name) {
                if (name === 'a') {
                    if (tempNovel.name && tempNovel.cover) {
                        novels.push(tempNovel);
                        tempNovel = {};
                        state = ParsingState.Idle;
                    }
                }
            },
        });
        parser.write(html);
        parser.end();
        return novels;
    };
    PawRead.prototype.popularNovels = function (page_1, _a) {
        return __awaiter(this, arguments, void 0, function (page, _b) {
            var link, filterValues, body;
            var filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        link = "".concat(this.site, "list/");
                        filterValues = [
                            filters.genre.value,
                            filters.status.value,
                            filters.lang.value,
                        ].filter(function (value) { return value !== ''; });
                        if (filterValues.length > 0) {
                            link += filterValues.join('-') + '/';
                        }
                        link += (filters.order.value ? '-' : '') + filters.sort.value;
                        link += "/?page=".concat(page);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(link).then(function (r) { return r.text(); })];
                    case 1:
                        body = _c.sent();
                        return [2 /*return*/, this.parseNovels(body)];
                }
            });
        });
    };
    PawRead.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var slash, result, body, novel, depth, state, tempChapter, chapter, summaryParts, genreArray, parser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        slash = novelPath.endsWith('/') ? '' : '/';
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath + slash)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        novel = {
                            path: novelPath,
                        };
                        depth = 0;
                        state = ParsingState.Idle;
                        tempChapter = {};
                        chapter = [];
                        summaryParts = [];
                        genreArray = [];
                        parser = new htmlparser2_1.Parser({
                            onopentag: function (name, attribs) {
                                var _a, _b;
                                switch (name) {
                                    case 'div':
                                        if (attribs.id === 'Cover') {
                                            state = ParsingState.Cover;
                                        }
                                        if ((_a = attribs.class) === null || _a === void 0 ? void 0 : _a.includes('item-box')) {
                                            state = ParsingState.Chapter;
                                            var path = attribs.onclick.match(/\d+/)[0];
                                            tempChapter.path = "".concat(novelPath).concat(slash).concat(path, ".html");
                                            return;
                                        }
                                        if (state === ParsingState.Chapter)
                                            depth++;
                                        break;
                                    case 'img':
                                        if (state === ParsingState.Cover) {
                                            novel.name = attribs.title;
                                            novel.cover = attribs.src;
                                        }
                                        break;
                                    case 'p':
                                        if (attribs.class === 'txtItme') {
                                            if (!novel.status) {
                                                state = ParsingState.Status;
                                            }
                                            else if (!novel.author) {
                                                state = ParsingState.Author;
                                            }
                                        }
                                        else if (attribs.id === 'full-des') {
                                            state = ParsingState.Summary;
                                        }
                                        break;
                                    case 'br':
                                        summaryParts.push('\n');
                                        break;
                                    case 'a':
                                        if ((_b = attribs.class) === null || _b === void 0 ? void 0 : _b.includes('btn-default')) {
                                            state = ParsingState.Genres;
                                        }
                                        break;
                                    case 'span':
                                        if (state === ParsingState.Chapter)
                                            depth++;
                                        if (depth === 2) {
                                            state = ParsingState.ChapterName;
                                        }
                                        else if (depth === 1) {
                                            state = ParsingState.ChapterTime;
                                        }
                                        break;
                                }
                            },
                            ontext: function (text) {
                                switch (state) {
                                    case ParsingState.Status:
                                        novel.status = (novel.status || '') + text.trim();
                                        break;
                                    case ParsingState.Author:
                                        novel.author = (novel.author || '') + text.trim();
                                        break;
                                    case ParsingState.Genres:
                                        genreArray.push(text.trim());
                                        break;
                                    case ParsingState.Summary:
                                        summaryParts.push(text);
                                        break;
                                    case ParsingState.ChapterName:
                                        tempChapter.name = (tempChapter.name || '') + text.trim();
                                        break;
                                    case ParsingState.ChapterTime:
                                        if (text === null || text === void 0 ? void 0 : text.includes('Advanced'))
                                            return;
                                        var releaseDate = text.split('.').map(function (x) { return Number(x); });
                                        if (releaseDate.length === 3) {
                                            tempChapter.releaseTime = new Date(releaseDate[0], releaseDate[1] - 1, releaseDate[2]).toISOString();
                                        }
                                        break;
                                }
                            },
                            onclosetag: function (name) {
                                switch (name) {
                                    case 'div':
                                        if (state === ParsingState.Cover) {
                                            state = ParsingState.Idle;
                                        }
                                        if (state === ParsingState.Chapter) {
                                            depth--;
                                            if (depth < 0) {
                                                if (tempChapter.path &&
                                                    tempChapter.name &&
                                                    tempChapter.releaseTime) {
                                                    chapter.push(tempChapter);
                                                }
                                                tempChapter = {};
                                                depth = 0;
                                                state = ParsingState.Idle;
                                            }
                                        }
                                        break;
                                    case 'p':
                                        if (state === ParsingState.Status ||
                                            state === ParsingState.Author ||
                                            state === ParsingState.Summary) {
                                            state = ParsingState.Idle;
                                        }
                                        break;
                                    case 'a':
                                        if (state === ParsingState.Genres) {
                                            state = ParsingState.Idle;
                                        }
                                        break;
                                    case 'span':
                                        if (state === ParsingState.ChapterName ||
                                            state === ParsingState.ChapterTime) {
                                            state = ParsingState.Chapter;
                                            depth--;
                                        }
                                        break;
                                }
                            },
                            onend: function () {
                                novel.genres = genreArray.join(', ');
                                novel.summary = summaryParts.join('');
                                novel.chapters = chapter;
                            },
                        });
                        parser.write(body);
                        parser.end();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    PawRead.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var html, depth, state, chapterHtml, escapeRegex, escapeMap, escapeHtml, parser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath).then(function (r) { return r.text(); })];
                    case 1:
                        html = _a.sent();
                        depth = 0;
                        state = ParsingState.Idle;
                        chapterHtml = [];
                        escapeRegex = /[&<>"' ]/g;
                        escapeMap = {
                            '&': '&amp;',
                            '<': '&lt;',
                            '>': '&gt;',
                            '"': '&quot;',
                            "'": '&#39;',
                            ' ': '&nbsp;',
                        };
                        escapeHtml = function (text) {
                            return text.replace(escapeRegex, function (char) { return escapeMap[char]; });
                        };
                        parser = new htmlparser2_1.Parser({
                            onopentag: function (name, attribs) {
                                switch (state) {
                                    case ParsingState.Idle:
                                        if (name === 'div' && attribs.class === 'main') {
                                            state = ParsingState.Chapter;
                                            depth++;
                                        }
                                        break;
                                    case ParsingState.Chapter:
                                        if (name === 'div')
                                            depth++;
                                        break;
                                    default:
                                        return;
                                }
                                if (state === ParsingState.Chapter) {
                                    var attr = Object.keys(attribs).map(function (key) {
                                        var value = attribs[key].replace(/"/g, '&quot;');
                                        return " ".concat(key, "=\"").concat(value, "\"");
                                    });
                                    chapterHtml.push("<".concat(name).concat(attr.join(''), ">"));
                                }
                            },
                            ontext: function (data) {
                                if (state === ParsingState.Chapter) {
                                    var text_1 = escapeHtml(data);
                                    var icontains = ['pawread', 'tinyurl', 'bit.ly'];
                                    if (icontains.some(function (pattern) { return text_1 === null || text_1 === void 0 ? void 0 : text_1.includes(pattern); })) {
                                        state = ParsingState.Hidden;
                                        chapterHtml.pop();
                                    }
                                    else {
                                        chapterHtml.push(text_1);
                                    }
                                }
                            },
                            onclosetag: function (name) {
                                switch (state) {
                                    case ParsingState.Chapter:
                                        if (!parser['isVoidElement'](name)) {
                                            chapterHtml.push("</".concat(name, ">"));
                                        }
                                        if (name === 'div')
                                            depth--;
                                        if (depth === 0) {
                                            state = ParsingState.Stopped;
                                        }
                                        break;
                                    case ParsingState.Hidden:
                                        state = ParsingState.Chapter;
                                        break;
                                }
                            },
                        });
                        parser.write(html);
                        parser.end();
                        return [2 /*return*/, chapterHtml.join('')];
                }
            });
        });
    };
    PawRead.prototype.searchNovels = function (searchTerm, page) {
        return __awaiter(this, void 0, void 0, function () {
            var params, result, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams({
                            keywords: searchTerm,
                            page: page.toString(),
                        });
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "search/?").concat(params.toString()))];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        return [2 /*return*/, this.parseNovels(body)];
                }
            });
        });
    };
    return PawRead;
}());
exports.default = new PawRead();
var ParsingState;
(function (ParsingState) {
    ParsingState[ParsingState["Idle"] = 0] = "Idle";
    ParsingState[ParsingState["Cover"] = 1] = "Cover";
    ParsingState[ParsingState["Genres"] = 2] = "Genres";
    ParsingState[ParsingState["Author"] = 3] = "Author";
    ParsingState[ParsingState["Status"] = 4] = "Status";
    ParsingState[ParsingState["Hidden"] = 5] = "Hidden";
    ParsingState[ParsingState["Summary"] = 6] = "Summary";
    ParsingState[ParsingState["Stopped"] = 7] = "Stopped";
    ParsingState[ParsingState["Chapter"] = 8] = "Chapter";
    ParsingState[ParsingState["ChapterName"] = 9] = "ChapterName";
    ParsingState[ParsingState["ChapterTime"] = 10] = "ChapterTime";
    ParsingState[ParsingState["NovelName"] = 11] = "NovelName";
    ParsingState[ParsingState["Novel"] = 12] = "Novel";
})(ParsingState || (ParsingState = {}));
