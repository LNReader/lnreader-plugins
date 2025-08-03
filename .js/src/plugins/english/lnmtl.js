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
var LnMTLPlugin = /** @class */ (function () {
    function LnMTLPlugin() {
        this.id = 'lnmtl';
        this.name = 'LnMTL';
        this.icon = 'src/en/lnmtl/icon.png';
        this.site = 'https://lnmtl.com/';
        this.version = '2.1.0';
        this.filters = {
            order: {
                value: 'favourites',
                label: 'Order by',
                options: [
                    { label: 'Favourites', value: 'favourites' },
                    { label: 'Name', value: 'name' },
                    { label: 'Addition Date', value: 'date' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            sort: {
                value: 'desc',
                label: 'Sort by',
                options: [
                    { label: 'Descending', value: 'desc' },
                    { label: 'Ascending', value: 'asc' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            storyStatus: {
                value: 'all',
                label: 'Status',
                options: [
                    { label: 'All', value: 'all' },
                    { label: 'Ongoing', value: 'ongoing' },
                    { label: 'Finished', value: 'finished' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    LnMTLPlugin.prototype.sleep = function (ms) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
            });
        });
    };
    LnMTLPlugin.prototype.popularNovels = function (page_1, _a) {
        return __awaiter(this, arguments, void 0, function (page, _b) {
            var params, link, response, html, baseUrl, state, tempNovel, novels, parser;
            var filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        params = new URLSearchParams({
                            orderBy: filters.order.value,
                            order: filters.sort.value,
                            filter: filters.storyStatus.value,
                            page: page.toString(),
                        });
                        link = "".concat(this.site, "novel?").concat(params.toString());
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(link)];
                    case 1:
                        response = _c.sent();
                        return [4 /*yield*/, response.text()];
                    case 2:
                        html = _c.sent();
                        baseUrl = this.site;
                        state = ParsingState.Idle;
                        tempNovel = {};
                        novels = [];
                        parser = new htmlparser2_1.Parser({
                            onopentag: function (name, attribs) {
                                var _a;
                                if ((_a = attribs['class']) === null || _a === void 0 ? void 0 : _a.includes('media-left')) {
                                    state = ParsingState.Novel;
                                }
                                if (state !== ParsingState.Novel)
                                    return;
                                switch (name) {
                                    case 'a':
                                        tempNovel.path = attribs['href'].replace(baseUrl, '');
                                        break;
                                    case 'img':
                                        tempNovel.name = attribs['alt'];
                                        tempNovel.cover = attribs['src'];
                                        break;
                                }
                            },
                            onclosetag: function (name) {
                                if (name === 'div') {
                                    if (tempNovel.path && tempNovel.name) {
                                        novels.push(tempNovel);
                                        tempNovel = {};
                                    }
                                    state = ParsingState.Idle;
                                }
                            },
                        });
                        parser.write(html);
                        parser.end();
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    LnMTLPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, html, novel, state, panelValueCount, listCount, isAuthorKey, isStatusKey, summaryParts, genreArray, parser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath)];
                    case 1:
                        body = _a.sent();
                        return [4 /*yield*/, body.text().then(function (r) { return r.replace(/>\s+</g, '><'); })];
                    case 2:
                        html = _a.sent();
                        novel = {
                            path: novelPath,
                            totalPages: 1,
                            chapters: [],
                        };
                        state = ParsingState.Idle;
                        panelValueCount = 0;
                        listCount = 0;
                        isAuthorKey = false;
                        isStatusKey = false;
                        summaryParts = [];
                        genreArray = [];
                        parser = new htmlparser2_1.Parser({
                            onopentag: function (name, attribs) {
                                var _a, _b, _c;
                                switch (name) {
                                    case 'img':
                                        if ((_a = attribs['class']) === null || _a === void 0 ? void 0 : _a.includes('img-rounded')) {
                                            novel.name = attribs['title'];
                                            novel.cover = attribs['src'];
                                        }
                                        break;
                                    case 'dt':
                                        state = ParsingState.InPanelKey;
                                        break;
                                    case 'dd':
                                        state = ParsingState.InPanelValue;
                                        panelValueCount++;
                                        break;
                                    case 'ul':
                                        if ((_b = attribs['class']) === null || _b === void 0 ? void 0 : _b.includes('list-inline')) {
                                            listCount++;
                                        }
                                        break;
                                    case 'li':
                                        if (listCount === 1) {
                                            state = ParsingState.InGenres;
                                        }
                                        break;
                                    default:
                                        if (attribs['class']) {
                                            var map = {
                                                description: ParsingState.InDescription,
                                                source: ParsingState.InSource,
                                                progress: ParsingState.Idle,
                                            };
                                            state = (_c = map[attribs['class']]) !== null && _c !== void 0 ? _c : state;
                                        }
                                }
                            },
                            ontext: function (data) {
                                switch (state) {
                                    case ParsingState.InScript:
                                        var volume = JSON.parse(data.match(/lnmtl.volumes = (.+])(?=;)/)[1] || '');
                                        novel.totalPages = volume.length;
                                        break;
                                    case ParsingState.InDescription:
                                        summaryParts.push(data.trim());
                                        summaryParts.push('\n\n');
                                        break;
                                    case ParsingState.InSource:
                                        summaryParts.push(data);
                                        break;
                                    case ParsingState.InPanelKey:
                                        switch (data) {
                                            case 'Authors':
                                                isAuthorKey = true;
                                                break;
                                            case 'Current status':
                                                isStatusKey = true;
                                                break;
                                        }
                                        break;
                                    case ParsingState.InPanelValue:
                                        if (isAuthorKey && panelValueCount === 1) {
                                            novel.author = (novel.author || '') + data.trim();
                                            isAuthorKey = false;
                                        }
                                        else if (isStatusKey && panelValueCount === 2) {
                                            novel.status = (novel.status || '') + data.trim();
                                            isStatusKey = false;
                                        }
                                        break;
                                    case ParsingState.InGenres:
                                        genreArray.push(data.trim());
                                        break;
                                }
                            },
                            onclosetag: function (name) {
                                switch (name) {
                                    case 'ul':
                                        if (state === ParsingState.InGenres) {
                                            state = ParsingState.Idle;
                                        }
                                        break;
                                    case 'main':
                                        state = ParsingState.InScript;
                                        break;
                                    case 'script':
                                        if (state === ParsingState.InScript) {
                                            state = ParsingState.Idle;
                                        }
                                        break;
                                }
                            },
                            onend: function () {
                                novel.summary = summaryParts.join('');
                                novel.genres = genreArray.join(', ');
                            },
                        });
                        parser.write(html);
                        parser.end();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    LnMTLPlugin.prototype.parsePage = function (novelPath, page) {
        return __awaiter(this, void 0, void 0, function () {
            var result, html, state, volume, parser, chapter, volumeData, volumePage, firstPage, i, chapterData, chapterInfo, chapterDetails, chapters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text().then(function (r) { return r.replace(/>\s+</g, '><'); })];
                    case 2:
                        html = _a.sent();
                        state = ParsingState.Idle;
                        volume = {
                            id: '',
                            title: '',
                        };
                        parser = new htmlparser2_1.Parser({
                            ontext: function (data) {
                                if (state === ParsingState.InScript) {
                                    var volumes = JSON.parse(data.match(/lnmtl.volumes = (.+])(?=;)/)[1] || '');
                                    volume = volumes[+page - 1];
                                }
                            },
                            onclosetag: function (name) {
                                if (name === 'main') {
                                    state = ParsingState.InScript;
                                }
                                if (name === 'script') {
                                    state = ParsingState.Idle;
                                }
                            },
                        });
                        parser.write(html);
                        parser.end();
                        chapter = [];
                        return [4 /*yield*/, this.sleep(1000)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "chapter?volumeId=").concat(volume.id))];
                    case 4:
                        volumeData = _a.sent();
                        return [4 /*yield*/, volumeData.json()];
                    case 5:
                        volumePage = _a.sent();
                        firstPage = volumePage.data.map(function (chapter) { return ({
                            name: "#".concat(chapter.number, " - ").concat(chapter.title),
                            path: "chapter/".concat(chapter.slug),
                            releaseTime: new Date(chapter.created_at).toISOString(), //converts time obtained to UTC +0, TODO: Make it not convert
                        }); });
                        chapter.push.apply(chapter, firstPage);
                        i = 2;
                        _a.label = 6;
                    case 6:
                        if (!(i <= volumePage.last_page)) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.sleep(1000)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "chapter?page=").concat(i, "&volumeId=").concat(volume.id))];
                    case 8:
                        chapterData = _a.sent();
                        return [4 /*yield*/, chapterData.json()];
                    case 9:
                        chapterInfo = _a.sent();
                        chapterDetails = chapterInfo.data.map(function (chapter) { return ({
                            name: "#".concat(chapter.number, " ").concat(chapter.title),
                            path: "chapter/".concat(chapter.slug),
                            releaseTime: new Date(chapter.created_at).toISOString(), //converts time obtained to UTC +0, TODO: Make it not convert
                        }); });
                        chapter.push.apply(chapter, chapterDetails);
                        _a.label = 10;
                    case 10:
                        i++;
                        return [3 /*break*/, 6];
                    case 11:
                        chapters = chapter;
                        return [2 /*return*/, { chapters: chapters }];
                }
            });
        });
    };
    LnMTLPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var result, html, state, chapterTextParts, escapeRegex, escapeMap, escapeHtml, parser, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        html = _a.sent();
                        state = ParsingState.Idle;
                        chapterTextParts = [];
                        escapeRegex = /[&<>"']/g;
                        escapeMap = {
                            '&': '&amp;',
                            '<': '&lt;',
                            '>': '&gt;',
                            '"': '&quot;',
                            "'": '&#39;',
                        };
                        escapeHtml = function (text) {
                            return escapeRegex.test(text)
                                ? ((escapeRegex.lastIndex = 0),
                                    text.replace(escapeRegex, function (char) { return escapeMap[char]; }))
                                : text;
                        };
                        parser = new htmlparser2_1.Parser({
                            onopentag: function (name, attribs) {
                                var _a;
                                if (name === 'sentence' && ((_a = attribs['class']) === null || _a === void 0 ? void 0 : _a.includes('translated'))) {
                                    state = ParsingState.Chapter;
                                    chapterTextParts.push('<p>');
                                }
                            },
                            onopentagname: function (name) {
                                if (name === 'nav') {
                                    state = ParsingState.Idle;
                                }
                            },
                            ontext: function (data) {
                                if (state === ParsingState.Chapter) {
                                    chapterTextParts.push(escapeHtml(data));
                                }
                            },
                            onclosetag: function (name) {
                                if (name === 'sentence' && state === ParsingState.Chapter) {
                                    chapterTextParts.push('</p>');
                                    state = ParsingState.Idle;
                                }
                            },
                        });
                        parser.write(html);
                        parser.end();
                        chapterText = chapterTextParts.join('');
                        return [2 /*return*/, chapterText.replace(/„/g, '“')];
                }
            });
        });
    };
    LnMTLPlugin.prototype.searchNovels = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var html, state, listPart, parser, search, data, nov, novels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site)
                            .then(function (b) { return b.text(); })
                            .then(function (r) { return r.replace(/>\s+</g, '><'); })];
                    case 1:
                        html = _a.sent();
                        state = ParsingState.Idle;
                        listPart = new Set();
                        parser = new htmlparser2_1.Parser({
                            onopentag: function (name, attribs) {
                                var _a;
                                if (state === ParsingState.InFooter &&
                                    name === 'script' &&
                                    ((_a = attribs['type']) === null || _a === void 0 ? void 0 : _a.includes('application/javascript'))) {
                                    state = ParsingState.InScript;
                                }
                            },
                            ontext: function (data) {
                                if (state === ParsingState.InScript) {
                                    var match = data.match(/prefetch: '\/(.*?\.json)/);
                                    if (match) {
                                        listPart.add(match[1]);
                                    }
                                }
                            },
                            onclosetag: function (name) {
                                switch (name) {
                                    case 'footer':
                                        state = ParsingState.InFooter;
                                        break;
                                    case 'script':
                                        if (state === ParsingState.InScript) {
                                            state = ParsingState.Idle;
                                        }
                                        break;
                                }
                            },
                        });
                        parser.write(html);
                        parser.end();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site).concat(Array.from(listPart).join('')))];
                    case 2:
                        search = _a.sent();
                        return [4 /*yield*/, search.json()];
                    case 3:
                        data = _a.sent();
                        nov = data.filter(function (res) {
                            return res.name.toLowerCase().includes(searchTerm.toLowerCase());
                        });
                        novels = [];
                        nov.map(function (res) {
                            var novelName = res.name;
                            var novelUrl = "novel/".concat(res.slug);
                            var novelCover = res.image;
                            var novel = {
                                path: novelUrl,
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
    return LnMTLPlugin;
}());
exports.default = new LnMTLPlugin();
var ParsingState;
(function (ParsingState) {
    ParsingState[ParsingState["Idle"] = 0] = "Idle";
    ParsingState[ParsingState["InFooter"] = 1] = "InFooter";
    ParsingState[ParsingState["InScript"] = 2] = "InScript";
    ParsingState[ParsingState["InDescription"] = 3] = "InDescription";
    ParsingState[ParsingState["InSource"] = 4] = "InSource";
    ParsingState[ParsingState["InPanelKey"] = 5] = "InPanelKey";
    ParsingState[ParsingState["InPanelValue"] = 6] = "InPanelValue";
    ParsingState[ParsingState["InGenres"] = 7] = "InGenres";
    ParsingState[ParsingState["Novel"] = 8] = "Novel";
    ParsingState[ParsingState["Chapter"] = 9] = "Chapter";
})(ParsingState || (ParsingState = {}));
