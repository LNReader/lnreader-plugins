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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = require("@libs/fetch");
var filterInputs_1 = require("@libs/filterInputs");
var novelStatus_1 = require("@libs/novelStatus");
var cheerio_1 = require("cheerio");
var storage_1 = require("@libs/storage");
var KomgaPlugin = /** @class */ (function () {
    function KomgaPlugin() {
        this.id = 'komga';
        this.name = 'Komga';
        this.icon = 'src/multi/komga/icon.png';
        this.version = '1.0.1';
        this.site = storage_1.storage.get('url');
        this.email = storage_1.storage.get('email');
        this.password = storage_1.storage.get('password');
        this.filters = {
            status: {
                value: '',
                label: 'Status',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Completed', value: novelStatus_1.NovelStatus.Completed },
                    { label: 'Ongoing', value: novelStatus_1.NovelStatus.Ongoing },
                    { label: 'Cancelled', value: novelStatus_1.NovelStatus.Cancelled },
                    { label: 'OnHiatus', value: novelStatus_1.NovelStatus.OnHiatus },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            read_status: {
                value: '',
                label: 'Read status',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Unread', value: 'UNREAD' },
                    { label: 'Read', value: 'READ' },
                    { label: 'In progress', value: 'IN_PROGRESS' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
        this.pluginSettings = {
            email: {
                value: '',
                label: 'Email',
                type: 'Text',
            },
            password: {
                value: '',
                label: 'Password',
            },
            url: {
                value: '',
                label: 'URL',
            },
        };
    }
    KomgaPlugin.prototype.makeRequest = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(url, {
                            headers: {
                                Accept: 'application/json, text/plain, */*',
                                'Content-Type': 'application/json;charset=utf-8',
                                'Authorization': "Basic ".concat(this.btoa(this.email + ':' + this.password)),
                            },
                            Referer: this.site,
                        }).then(function (res) { return res.text(); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    KomgaPlugin.prototype.btoa = function (input) {
        if (input === void 0) { input = ''; }
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var str = input;
        var output = '';
        for (var block = 0, charCode = void 0, i = 0, map = chars; str.charAt(i | 0) || ((map = '='), i % 1); output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))) {
            charCode = str.charCodeAt((i += 3 / 4));
            if (charCode > 0xff) {
                throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
            }
            block = (block << 8) | charCode;
        }
        return output;
    };
    KomgaPlugin.prototype.flattenArray = function (arr) {
        var _this = this;
        return arr.reduce(function (acc, obj) {
            var children = obj.children, rest = __rest(obj, ["children"]);
            acc.push(rest);
            if (children) {
                acc.push.apply(acc, _this.flattenArray(children));
            }
            return acc;
        }, []);
    };
    KomgaPlugin.prototype.getSeries = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var novels, response, series, _i, series_1, s;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        novels = [];
                        return [4 /*yield*/, this.makeRequest(url)];
                    case 1:
                        response = _a.sent();
                        series = JSON.parse(response).content;
                        for (_i = 0, series_1 = series; _i < series_1.length; _i++) {
                            s = series_1[_i];
                            novels.push({
                                name: s.name,
                                path: 'api/v1/series/' + s.id,
                                cover: this.site + "api/v1/series/".concat(s.id, "/thumbnail"),
                            });
                        }
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    KomgaPlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var read_status, status, sort, url;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        read_status = (filters === null || filters === void 0 ? void 0 : filters.read_status.value)
                            ? '&read_status=' + (filters === null || filters === void 0 ? void 0 : filters.read_status.value)
                            : '';
                        status = (filters === null || filters === void 0 ? void 0 : filters.status.value)
                            ? '&status=' + (filters === null || filters === void 0 ? void 0 : filters.status.value)
                            : '';
                        sort = showLatestNovels ? 'lastModified,desc' : 'name,asc';
                        url = "".concat(this.site, "api/v1/series?page=").concat(pageNo - 1).concat(read_status).concat(status, "&sort=").concat(sort);
                        return [4 /*yield*/, this.getSeries(url)];
                    case 1: return [2 /*return*/, _c.sent()];
                }
            });
        });
    };
    KomgaPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var novel, url, response, series, chapters, booksResponse, booksData, _i, booksData_1, book, bookManifestResponse, bookManifest, toc, i, _loop_1, _a, _b, page;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        novel = {
                            path: novelPath,
                            name: 'Untitled',
                        };
                        url = this.site + novelPath;
                        return [4 /*yield*/, this.makeRequest(url)];
                    case 1:
                        response = _d.sent();
                        series = JSON.parse(response);
                        novel.name = series.name;
                        novel.author = series.booksMetadata.authors
                            .filter(function (author) { return author.role === 'writer'; })
                            .reduce(function (accumulated, current) {
                            return accumulated + (accumulated !== '' ? ', ' : '') + current.name;
                        }, '');
                        novel.cover = this.site + "api/v1/series/".concat(series.id, "/thumbnail");
                        novel.genres = series.metadata.genres.join(', ');
                        switch (series.metadata.status) {
                            case 'ENDED':
                                novel.status = novelStatus_1.NovelStatus.Completed;
                                break;
                            case 'ONGOING':
                                novel.status = novelStatus_1.NovelStatus.Ongoing;
                                break;
                            case 'ABANDONED':
                                novel.status = novelStatus_1.NovelStatus.Cancelled;
                                break;
                            case 'HIATUS':
                                novel.status = novelStatus_1.NovelStatus.OnHiatus;
                                break;
                            default:
                                novel.status = novelStatus_1.NovelStatus.Unknown;
                        }
                        novel.summary = series.booksMetadata.summary;
                        chapters = [];
                        return [4 /*yield*/, this.makeRequest(this.site + "api/v1/series/".concat(series.id, "/books?unpaged=true"))];
                    case 2:
                        booksResponse = _d.sent();
                        booksData = JSON.parse(booksResponse).content;
                        _i = 0, booksData_1 = booksData;
                        _d.label = 3;
                    case 3:
                        if (!(_i < booksData_1.length)) return [3 /*break*/, 6];
                        book = booksData_1[_i];
                        return [4 /*yield*/, this.makeRequest(this.site + "opds/v2/books/".concat(book.id, "/manifest"))];
                    case 4:
                        bookManifestResponse = _d.sent();
                        bookManifest = JSON.parse(bookManifestResponse);
                        toc = this.flattenArray(bookManifest.toc);
                        i = 1;
                        _loop_1 = function (page) {
                            var tocItem = toc.find(function (v) { var _a; return ((_a = v.href) === null || _a === void 0 ? void 0 : _a.split('#')[0]) === page.href; });
                            var title = tocItem ? tocItem.title : null;
                            chapters.push({
                                name: "".concat(i, "/").concat(bookManifest.readingOrder.length, " - ").concat(book.metadata.title).concat(title ? ' - ' + title : ''),
                                path: 'opds/v2' + ((_c = page.href) === null || _c === void 0 ? void 0 : _c.split('opds/v2').pop()),
                            });
                            i++;
                        };
                        for (_a = 0, _b = bookManifest.readingOrder; _a < _b.length; _a++) {
                            page = _b[_a];
                            _loop_1(page);
                        }
                        _d.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    KomgaPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.makeRequest(this.site + chapterPath)];
                    case 1:
                        chapterText = _a.sent();
                        return [2 /*return*/, this.addUrlToImageHref(chapterText, this.site + chapterPath.split('/').slice(0, -1).join('/') + '/')];
                }
            });
        });
    };
    // Convert images to <img> tag and correct url
    KomgaPlugin.prototype.addUrlToImageHref = function (htmlString, baseUrl) {
        var $ = (0, cheerio_1.load)(htmlString, { xmlMode: true });
        // Convert SVG <image> elements to <img> and add baseUrl if necessary
        $('svg image').each(function (_, image) {
            var href = $(image).attr('href') || $(image).attr('xlink:href');
            var width = $(image).attr('width');
            var height = $(image).attr('height');
            if (href) {
                var img = $('<img />').attr({
                    src: href.startsWith('http') ? href : "".concat(baseUrl).concat(href),
                    width: width || undefined,
                    height: height || undefined,
                });
                $(image).closest('svg').replaceWith(img);
            }
        });
        // Update <img> elements to include the base URL if their src is relative
        $('img').each(function (_, img) {
            var src = $(img).attr('src');
            if (src && !src.startsWith('http')) {
                $(img).attr('src', "".concat(baseUrl).concat(src));
            }
        });
        // Replace <a> tags with the text inside so its not blue
        $('a').each(function (_, a) {
            $(a).replaceWith($(a).text());
        });
        return $.xml();
    };
    KomgaPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "api/v1/series?search=").concat(searchTerm, "&page=").concat(pageNo - 1);
                        return [4 /*yield*/, this.getSeries(url)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return KomgaPlugin;
}());
exports.default = new KomgaPlugin();
