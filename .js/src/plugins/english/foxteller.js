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
var filterInputs_1 = require("@libs/filterInputs");
var defaultCover_1 = require("@libs/defaultCover");
var fetch_1 = require("@libs/fetch");
var novelStatus_1 = require("@libs/novelStatus");
var Foxteller = /** @class */ (function () {
    function Foxteller() {
        var _this = this;
        this.id = 'foxteller';
        this.name = 'Foxteller';
        this.site = 'https://www.foxteller.com';
        this.version = '1.0.2';
        this.icon = 'src/en/foxteller/icon.png';
        this.resolveUrl = function (path) { return _this.site + '/novel/' + path; };
        this.filters = {
            order: {
                value: 'popularity',
                label: 'Order by',
                options: [
                    { label: 'Popular Novels', value: 'popularity' },
                    { label: 'New Novels', value: 'newest' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    Foxteller.prototype.safeFecth = function (url_1) {
        return __awaiter(this, arguments, void 0, function (url, init) {
            var r, data, title;
            var _a, _b;
            if (init === void 0) { init = {}; }
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url, init)];
                    case 1:
                        r = _c.sent();
                        if (!r.ok)
                            throw new Error('Could not reach site (' + r.status + ') try to open in webview.');
                        return [4 /*yield*/, r.text()];
                    case 2:
                        data = _c.sent();
                        title = (_b = (_a = data.match(/<title>(.*?)<\/title>/)) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.trim();
                        if (title &&
                            (title == 'Bot Verification' ||
                                title == 'You are being redirected...' ||
                                title == 'Un instant...' ||
                                title == 'Just a moment...' ||
                                title == 'Redirecting...'))
                            throw new Error('Captcha error, please open in webview');
                        return [2 /*return*/, data];
                }
            });
        });
    };
    Foxteller.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var url, body, novels, div;
            var _c;
            var filters = _b.filters;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        url = this.site + '/library?sort=' + ((_c = filters === null || filters === void 0 ? void 0 : filters.order) === null || _c === void 0 ? void 0 : _c.value) || 'popularity';
                        return [4 /*yield*/, this.safeFecth(url)];
                    case 1:
                        body = _d.sent();
                        novels = [];
                        div = body.match(/<div class="col-md-6">([\s\S]*?)<\/div>/g) || [];
                        div.forEach(function (elements) {
                            var _a = elements.match(/<a href="(.*?)" title="(.*?)">/) || [], novelUrl = _a[1], novelName = _a[2];
                            if (novelName && novelUrl) {
                                var novelCover = elements.match(/<img class="img-fluid" src="(.*?)".*>/);
                                novels.push({
                                    name: novelName,
                                    cover: (novelCover === null || novelCover === void 0 ? void 0 : novelCover[1]) || defaultCover_1.defaultCover,
                                    path: novelUrl.split('/')[4],
                                });
                            }
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    Foxteller.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, novel, isParsingGenres, isReadingGenre, isReadingSummary, isParsingInfo, isReadingInfo, isParsingChapterList, isReadingChapter, isPaidChapter, chapters, tempChapter, parser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.safeFecth(this.resolveUrl(novelPath))];
                    case 1:
                        body = _a.sent();
                        novel = {
                            path: novelPath,
                            name: '',
                            genres: '',
                            summary: '',
                            status: '',
                            chapters: [],
                        };
                        isParsingGenres = false;
                        isReadingGenre = false;
                        isReadingSummary = false;
                        isParsingInfo = false;
                        isReadingInfo = false;
                        isParsingChapterList = false;
                        isReadingChapter = false;
                        isPaidChapter = false;
                        chapters = [];
                        tempChapter = {};
                        parser = new htmlparser2_1.Parser({
                            onopentag: function (name, attribs) {
                                var _a;
                                // name and cover
                                if (!novel.cover && attribs['class'] === 'img-fluid') {
                                    novel.name = attribs['alt'];
                                    novel.cover = attribs['src'] || defaultCover_1.defaultCover;
                                } // genres
                                else if (name === 'div' && attribs['class'] === 'novel-genres') {
                                    isParsingGenres = true;
                                }
                                else if (isParsingGenres && name === 'li') {
                                    isReadingGenre = true;
                                } // summary
                                else if (name === 'div' && attribs['class'] === 'novel-description') {
                                    isReadingSummary = true;
                                } // status
                                else if (name === 'div' && attribs['class'] === 'novel-tags') {
                                    isParsingInfo = true;
                                }
                                else if (isParsingInfo && name === 'li') {
                                    isReadingInfo = true;
                                }
                                // chapters
                                else if (name === 'div' && attribs['class'] === 'col-md-6') {
                                    isParsingChapterList = true;
                                }
                                else if (isParsingChapterList && name === 'a') {
                                    isReadingChapter = true;
                                    tempChapter.chapterNumber = chapters.length + 1;
                                    tempChapter.path = novelPath + '/' + attribs['href'].split('/')[5];
                                }
                                else if (isReadingChapter &&
                                    name === 'i' &&
                                    ((_a = attribs['class']) === null || _a === void 0 ? void 0 : _a.includes('lock'))) {
                                    isPaidChapter = true;
                                }
                            },
                            ontext: function (data) {
                                // genres
                                if (isParsingGenres) {
                                    if (isReadingGenre) {
                                        novel.genres += data + ', ';
                                    }
                                } // summary
                                else if (isReadingSummary) {
                                    novel.summary += data.trim();
                                } // status
                                else if (isParsingInfo) {
                                    if (isReadingInfo) {
                                        var detailName = data.toLowerCase().trim();
                                        switch (detailName) {
                                            case 'completed':
                                                novel.status = novelStatus_1.NovelStatus.Completed;
                                                break;
                                            case 'ongoing':
                                                novel.status = novelStatus_1.NovelStatus.Ongoing;
                                                break;
                                            case 'hiatus':
                                                novel.status = novelStatus_1.NovelStatus.OnHiatus;
                                                break;
                                            default:
                                                novel.status = novelStatus_1.NovelStatus.Unknown;
                                                break;
                                        }
                                    }
                                }
                                // chapters
                                else if (isParsingChapterList) {
                                    if (isReadingChapter) {
                                        tempChapter.name = (tempChapter.name || '') + data;
                                    }
                                }
                            },
                            onclosetag: function (name) {
                                var _a;
                                // genres
                                if (isParsingGenres) {
                                    if (isReadingGenre) {
                                        isReadingGenre = false; // stop reading genre
                                    }
                                    else {
                                        isParsingGenres = false; // stop parsing genres
                                        novel.genres = (_a = novel.genres) === null || _a === void 0 ? void 0 : _a.slice(0, -2); // remove trailing comma
                                    }
                                } // summary
                                else if (isReadingSummary) {
                                    if (name === 'hr' || name === 'p') {
                                        novel.summary += '\n';
                                    }
                                    else if (name === 'div') {
                                        isReadingSummary = false;
                                    }
                                } // status
                                else if (isParsingInfo) {
                                    if (name === 'li') {
                                        isReadingInfo = false;
                                    }
                                    else if (name === 'div') {
                                        isParsingInfo = false;
                                    }
                                } // chapters
                                else if (isParsingChapterList) {
                                    if (isReadingChapter) {
                                        if (name === 'li') {
                                            if (isPaidChapter) {
                                                isPaidChapter = false;
                                            }
                                            else {
                                                tempChapter.name = tempChapter.name.trim();
                                                chapters.push(tempChapter);
                                            }
                                            isReadingChapter = false;
                                            tempChapter = {};
                                        }
                                    }
                                    else if (name === 'ul') {
                                        isParsingChapterList = false;
                                    }
                                }
                            },
                        });
                        parser.write(body);
                        parser.end();
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    Foxteller.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var res, novelID, chapterID, aux, base64;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.safeFecth(this.resolveUrl(chapterPath))];
                    case 1:
                        res = _b.sent();
                        novelID = chapterPath.split('/')[0];
                        chapterID = (_a = res.match(/'chapter_id': '([\d]+)'/)) === null || _a === void 0 ? void 0 : _a[1];
                        if (!chapterID)
                            throw new Error('No chapter found');
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/aux_dem', {
                                method: 'post',
                                headers: {
                                    Accept: 'application/json, text/plain, */*',
                                    'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
                                    'Content-Type': 'application/json;charset=utf-8',
                                },
                                Referer: this.resolveUrl(chapterPath),
                                body: JSON.stringify({ 'x1': novelID, 'x2': chapterID }),
                            }).then(function (res) { return res.json(); })];
                    case 2:
                        aux = (_b.sent()).aux;
                        if (aux && typeof aux === 'string') {
                            base64 = aux.replace(/%R([a-f])&/g, function (match, code) {
                                switch (code) {
                                    case 'a':
                                        return 'A';
                                    case 'c':
                                        return 'B';
                                    case 'b':
                                        return 'C';
                                    case 'd':
                                        return 'D';
                                    case 'f':
                                        return 'E';
                                    case 'e':
                                        return 'F';
                                    default:
                                        return match;
                                }
                            });
                            return [2 /*return*/, decodeURIComponent(decodeBase64(base64))];
                        }
                        throw new Error('This chapter is closed');
                }
            });
        });
    };
    Foxteller.prototype.searchNovels = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var body, novels, items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.safeFecth(this.site + '/search', {
                            method: 'post',
                            headers: {
                                Accept: 'application/json, text/plain, */*',
                                'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
                                'Content-Type': 'application/json;charset=utf-8',
                            },
                            Referer: this.site,
                            body: JSON.stringify({ query: searchTerm }),
                        })];
                    case 1:
                        body = _a.sent();
                        novels = [];
                        items = body.match(/<a.*>([\s\S]*?)<\/a>/g) || [];
                        items.forEach(function (elements) {
                            var _a, _b, _c;
                            var novelUrl = ((_a = elements.match(/<a href="(.*?)"/)) === null || _a === void 0 ? void 0 : _a[1]) || '';
                            var path = novelUrl.split('/')[4];
                            var name = (_b = elements.match(/<span class="ellipsis-1">(.*?)<\/span>/)) === null || _b === void 0 ? void 0 : _b[1];
                            if (name && path) {
                                var cover = ((_c = elements.match(/<img src="(.*?)".*>/)) === null || _c === void 0 ? void 0 : _c[1]) || defaultCover_1.defaultCover;
                                novels.push({ name: name, cover: cover, path: path });
                            }
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return Foxteller;
}());
exports.default = new Foxteller();
var base64Characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
function decodeBase64(encodedString) {
    var hexcode = [];
    var i = 0;
    while (i < encodedString.length) {
        var enc1 = base64Characters.indexOf(encodedString.charAt(i++));
        var enc2 = base64Characters.indexOf(encodedString.charAt(i++));
        var enc3 = base64Characters.indexOf(encodedString.charAt(i++));
        var enc4 = base64Characters.indexOf(encodedString.charAt(i++));
        var chr1 = (enc1 << 2) | (enc2 >> 4);
        var chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        var chr3 = ((enc3 & 3) << 6) | enc4;
        hexcode.push(chr1.toString(16).padStart(2, '0'));
        if (enc3 !== 64) {
            hexcode.push(chr2.toString(16).padStart(2, '0'));
        }
        if (enc4 !== 64) {
            hexcode.push(chr3.toString(16).padStart(2, '0'));
        }
    }
    return '%' + hexcode.join('%');
}
