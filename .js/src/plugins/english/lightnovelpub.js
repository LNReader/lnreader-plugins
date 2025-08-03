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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var htmlparser2_1 = require("htmlparser2");
var fetch_1 = require("@libs/fetch");
var filterInputs_1 = require("@libs/filterInputs");
var dayjs_1 = __importDefault(require("dayjs"));
var LightNovelPub = /** @class */ (function () {
    function LightNovelPub() {
        this.id = 'lightnovelpub';
        this.name = 'LightNovelPub';
        this.version = '2.2.0';
        this.icon = 'src/en/lightnovelpub/icon.png';
        this.site = 'https://www.lightnovelpub.com/';
        this.headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        this.filters = {
            order: {
                value: 'popular',
                label: 'Order by',
                options: [
                    { label: 'New', value: 'new' },
                    { label: 'Popular', value: 'popular' },
                    { label: 'Updates', value: 'updated' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            status: {
                value: 'all',
                label: 'Status',
                options: [
                    { label: 'All', value: 'all' },
                    { label: 'Completed', value: 'completed' },
                    { label: 'Ongoing', value: 'ongoing' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genres: {
                value: 'all',
                label: 'Genre',
                options: [
                    { label: 'All', value: 'all' },
                    { label: 'Action', value: 'action' },
                    { label: 'Adventure', value: 'adventure' },
                    { label: 'Drama', value: 'drama' },
                    { label: 'Fantasy', value: 'fantasy' },
                    { label: 'Harem', value: 'harem' },
                    { label: 'Martial Arts', value: 'martial-arts' },
                    { label: 'Mature', value: 'mature' },
                    { label: 'Romance', value: 'romance' },
                    { label: 'Tragedy', value: 'tragedy' },
                    { label: 'Xuanhuan', value: 'xuanhuan' },
                    { label: 'Ecchi', value: 'ecchi' },
                    { label: 'Comedy', value: 'comedy' },
                    { label: 'Slice of Life', value: 'slice-of-life' },
                    { label: 'Mystery', value: 'mystery' },
                    { label: 'Supernatural', value: 'supernatural' },
                    { label: 'Psychological', value: 'psychological' },
                    { label: 'Sci-fi', value: 'sci-fi' },
                    { label: 'Xianxia', value: 'xianxia' },
                    { label: 'School Life', value: 'school-life' },
                    { label: 'Josei', value: 'josei' },
                    { label: 'Wuxia', value: 'wuxia' },
                    { label: 'Shounen', value: 'shounen' },
                    { label: 'Horror', value: 'horror' },
                    { label: 'Mecha', value: 'mecha' },
                    { label: 'Historical', value: 'historical' },
                    { label: 'Shoujo', value: 'shoujo' },
                    { label: 'Adult', value: 'adult' },
                    { label: 'Seinen', value: 'seinen' },
                    { label: 'Sports', value: 'sports' },
                    { label: 'Lolicon', value: 'lolicon' },
                    { label: 'Gender Bender', value: 'gender-bender' },
                    { label: 'Shounen Ai', value: 'shounen-ai' },
                    { label: 'Yaoi', value: 'yaoi' },
                    { label: 'Video Games', value: 'video-games' },
                    { label: 'Smut', value: 'smut' },
                    { label: 'Magical Realism', value: 'magical-realism' },
                    { label: 'Eastern Fantasy', value: 'eastern-fantasy' },
                    { label: 'Contemporary Romance', value: 'contemporary-romance' },
                    { label: 'Fantasy Romance', value: 'fantasy-romance' },
                    { label: 'Shoujo Ai', value: 'shoujo-ai' },
                    { label: 'Yuri', value: 'yuri' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    LightNovelPub.prototype.parseNovels = function (html) {
        var novels = [];
        var tempNovel = {};
        var state = ParsingState.Idle;
        var parser = new htmlparser2_1.Parser({
            onopentag: function (name, attribs) {
                if (attribs['class'] === 'novel-item') {
                    state = ParsingState.Novel;
                }
                if (state !== ParsingState.Novel)
                    return;
                switch (name) {
                    case 'a':
                        tempNovel.path = attribs['href'].slice(1);
                        tempNovel.name = attribs['title'];
                        break;
                    case 'img':
                        tempNovel.cover = attribs['data-src'] || attribs['src'];
                        break;
                }
            },
            onclosetag: function (name) {
                if (name === 'li') {
                    if (tempNovel.path && tempNovel.cover) {
                        novels.push(tempNovel);
                        tempNovel = {};
                    }
                    state = ParsingState.Idle;
                }
            },
        });
        parser.write(html);
        parser.end();
        return novels;
    };
    LightNovelPub.prototype.popularNovels = function (page_1, _a) {
        return __awaiter(this, arguments, void 0, function (page, _b) {
            var linkParts, body;
            var filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        linkParts = [
                            this.site + 'browse',
                            filters.genres.value,
                            filters.order.value,
                            filters.status.value,
                            page.toString(),
                        ];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(linkParts.join('/')).then(function (r) { return r.text(); })];
                    case 1:
                        body = _c.sent();
                        return [2 /*return*/, this.parseNovels(body)];
                }
            });
        });
    };
    LightNovelPub.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, novel, state, summaryParts, genreArray, parser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        novel = {
                            path: novelPath,
                            chapters: [],
                        };
                        state = ParsingState.Idle;
                        summaryParts = [];
                        genreArray = [];
                        parser = new htmlparser2_1.Parser({
                            onopentag: function (name, attribs) {
                                var _a, _b;
                                switch (name) {
                                    case 'h1':
                                        if ((_a = attribs['class']) === null || _a === void 0 ? void 0 : _a.includes('novel-title')) {
                                            state = ParsingState.NovelName;
                                        }
                                        break;
                                    case 'figure':
                                        if (attribs['class'] === 'cover') {
                                            state = ParsingState.Cover;
                                        }
                                        break;
                                    case 'img':
                                        if (state === ParsingState.Cover) {
                                            novel.cover = attribs['data-src'] || attribs['src'];
                                        }
                                        break;
                                    case 'strong':
                                        if (state === ParsingState.HeaderStats) {
                                            if (attribs['class']) {
                                                state = ParsingState.Status;
                                            }
                                            else {
                                                state = ParsingState.TotalChapters;
                                            }
                                        }
                                        break;
                                    case 'br':
                                        if (state === ParsingState.Summary) {
                                            summaryParts.push('<LINE_BREAK>');
                                        }
                                        break;
                                    case 'a':
                                        if (state === ParsingState.Genres) {
                                            state = ParsingState.Tags;
                                        }
                                        break;
                                    case 'div':
                                        if (attribs['class']) {
                                            if (attribs['class'].includes('content')) {
                                                state = ParsingState.Summary;
                                            }
                                            else {
                                                var map = {
                                                    'categories': ParsingState.Genres,
                                                    'header-stats': ParsingState.HeaderStats,
                                                    'expand': ParsingState.Idle,
                                                };
                                                state = (_b = map[attribs['class']]) !== null && _b !== void 0 ? _b : state;
                                            }
                                        }
                                        break;
                                    default:
                                        if (attribs['itemprop'] === 'author') {
                                            state = ParsingState.AuthorName;
                                        }
                                        break;
                                }
                            },
                            ontext: function (data) {
                                switch (state) {
                                    case ParsingState.TotalChapters:
                                        if (!novel.totalPages) {
                                            novel.totalPages = Math.ceil(parseInt(data, 10) / 100);
                                        }
                                        break;
                                    case ParsingState.Status:
                                        novel.status = data.trim();
                                        break;
                                    case ParsingState.NovelName:
                                        novel.name = (novel.name || '') + data.trim();
                                        break;
                                    case ParsingState.AuthorName:
                                        novel.author = data;
                                        break;
                                    case ParsingState.Summary:
                                        summaryParts.push(data);
                                        break;
                                    case ParsingState.Tags:
                                        genreArray.push(data);
                                        break;
                                }
                            },
                            onclosetag: function (name) {
                                switch (name) {
                                    case 'strong':
                                        if (state === ParsingState.TotalChapters) {
                                            state = ParsingState.HeaderStats;
                                        }
                                        else if (state === ParsingState.Status) {
                                            state = ParsingState.Idle;
                                        }
                                        break;
                                    case 'i':
                                        if (state === ParsingState.Status) {
                                            state = ParsingState.Idle;
                                        }
                                        break;
                                    case 'h1':
                                        if (state === ParsingState.NovelName) {
                                            state = ParsingState.Idle;
                                        }
                                        break;
                                    case 'span':
                                        if (state === ParsingState.AuthorName) {
                                            state = ParsingState.Idle;
                                        }
                                        break;
                                    case 'div':
                                        if (state === ParsingState.Summary ||
                                            state === ParsingState.Genres) {
                                            state = ParsingState.Idle;
                                        }
                                        break;
                                    case 'a':
                                        if (state === ParsingState.Tags) {
                                            state = ParsingState.Genres;
                                        }
                                        break;
                                    case 'figure':
                                        if (state === ParsingState.Cover) {
                                            state = ParsingState.Idle;
                                        }
                                        break;
                                    case 'p':
                                        if (state === ParsingState.Summary) {
                                            summaryParts.push('<PARAGRAPH_BREAK>');
                                        }
                                        break;
                                }
                            },
                            onend: function () {
                                var text = summaryParts
                                    .join('')
                                    .replace(/<PARAGRAPH_BREAK>/g, '\n\n')
                                    .replace(/<LINE_BREAK>/g, '\n')
                                    .replace(/\r\n/g, '\n')
                                    .replace(/&nbsp;/g, ' ');
                                var paragraphs = text
                                    .split('\n\n')
                                    .map(function (p) { return p.trim().replace(/[ \t]+/g, ' '); })
                                    .filter(function (p) { return p.length > 0; });
                                novel.summary = paragraphs.join('\n\n');
                                summaryParts.length = 0;
                                novel.genres = genreArray.join(', ');
                            },
                        });
                        parser.write(body);
                        parser.end();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    LightNovelPub.prototype.parsePage = function (novelPath, page) {
        return __awaiter(this, void 0, void 0, function () {
            var url, body, chapters, tempChapter, state, parser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + novelPath + '/chapters/page-' + page;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (res) { return res.text(); })];
                    case 1:
                        body = _a.sent();
                        chapters = [];
                        tempChapter = {};
                        state = ParsingState.Idle;
                        parser = new htmlparser2_1.Parser({
                            onopentag: function (name, attribs) {
                                var _a;
                                if (attribs['class'] === 'chapter-list') {
                                    state = ParsingState.ChapterList;
                                    return;
                                }
                                switch (state) {
                                    case ParsingState.ChapterList:
                                        if (name === 'li') {
                                            state = ParsingState.ChapterItem;
                                            tempChapter = {
                                                chapterNumber: Number(attribs['data-orderno'] || 0),
                                            };
                                        }
                                        break;
                                    case ParsingState.ChapterItem:
                                        switch (name) {
                                            case 'a':
                                                tempChapter.name = attribs['title'];
                                                tempChapter.path = (_a = attribs['href']) === null || _a === void 0 ? void 0 : _a.slice(1);
                                                break;
                                            case 'time':
                                                tempChapter.releaseTime = (0, dayjs_1.default)(attribs['datetime']).toISOString();
                                                break;
                                        }
                                        break;
                                }
                            },
                            onclosetag: function (name) {
                                switch (state) {
                                    case ParsingState.ChapterItem:
                                        if (name === 'li') {
                                            if (tempChapter.chapterNumber !== undefined &&
                                                tempChapter.path &&
                                                tempChapter.releaseTime) {
                                                chapters.push(tempChapter);
                                            }
                                            state = ParsingState.ChapterList;
                                        }
                                        break;
                                    case ParsingState.ChapterList:
                                        if (name === 'ul') {
                                            state = ParsingState.Idle;
                                        }
                                        break;
                                }
                            },
                        });
                        parser.write(body);
                        parser.end();
                        return [2 /*return*/, { chapters: chapters }];
                }
            });
        });
    };
    LightNovelPub.prototype.parseChapter = function (chapterPath) {
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
                        escapeRegex = /[&<>"']/g;
                        escapeMap = {
                            '&': '&amp;',
                            '<': '&lt;',
                            '>': '&gt;',
                            '"': '&quot;',
                            "'": '&#39;',
                        };
                        escapeHtml = function (text) {
                            return text.replace(escapeRegex, function (char) { return escapeMap[char]; });
                        };
                        parser = new htmlparser2_1.Parser({
                            onopentag: function (name, attribs) {
                                switch (state) {
                                    case ParsingState.Idle:
                                        if (name === 'div' && attribs['id'] === 'chapter-container') {
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
                            ontext: function (text) {
                                if (state === ParsingState.Chapter) {
                                    chapterHtml.push(escapeHtml(text));
                                }
                            },
                            onclosetag: function (name) {
                                if (state === ParsingState.Chapter) {
                                    if (!parser['isVoidElement'](name)) {
                                        chapterHtml.push("</".concat(name, ">"));
                                    }
                                    if (name === 'div')
                                        depth--;
                                    if (depth === 0) {
                                        state = ParsingState.Stopped;
                                    }
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
    LightNovelPub.prototype.searchNovels = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var url, link, response, verifytoken, parser, formData, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "lnsearchlive");
                        link = "".concat(this.site, "search");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(link).then(function (r) { return r.text(); })];
                    case 1:
                        response = _a.sent();
                        verifytoken = '';
                        parser = new htmlparser2_1.Parser({
                            onopentag: function (name, attribs) {
                                var _a;
                                if (name === 'input' &&
                                    ((_a = attribs['name']) === null || _a === void 0 ? void 0 : _a.includes('LNRequestVerifyToken'))) {
                                    verifytoken = attribs['value'];
                                }
                            },
                        });
                        parser.write(response);
                        parser.end();
                        formData = new FormData();
                        formData.append('inputContent', searchTerm);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url, {
                                method: 'POST',
                                headers: { LNRequestVerifyToken: verifytoken },
                                body: formData,
                            }).then(function (r) { return r.json(); })];
                    case 2:
                        body = _a.sent();
                        return [2 /*return*/, this.parseNovels(body.resultview)];
                }
            });
        });
    };
    return LightNovelPub;
}());
exports.default = new LightNovelPub();
var ParsingState;
(function (ParsingState) {
    ParsingState[ParsingState["Idle"] = 0] = "Idle";
    ParsingState[ParsingState["Novel"] = 1] = "Novel";
    ParsingState[ParsingState["HeaderStats"] = 2] = "HeaderStats";
    ParsingState[ParsingState["Status"] = 3] = "Status";
    ParsingState[ParsingState["Stopped"] = 4] = "Stopped";
    ParsingState[ParsingState["Chapter"] = 5] = "Chapter";
    ParsingState[ParsingState["ChapterItem"] = 6] = "ChapterItem";
    ParsingState[ParsingState["ChapterList"] = 7] = "ChapterList";
    ParsingState[ParsingState["TotalChapters"] = 8] = "TotalChapters";
    ParsingState[ParsingState["NovelName"] = 9] = "NovelName";
    ParsingState[ParsingState["AuthorName"] = 10] = "AuthorName";
    ParsingState[ParsingState["Summary"] = 11] = "Summary";
    ParsingState[ParsingState["Genres"] = 12] = "Genres";
    ParsingState[ParsingState["Tags"] = 13] = "Tags";
    ParsingState[ParsingState["Cover"] = 14] = "Cover";
})(ParsingState || (ParsingState = {}));
