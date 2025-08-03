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
var fetch_1 = require("@libs/fetch");
var cheerio_1 = require("cheerio");
var defaultCover_1 = require("@libs/defaultCover");
// Shamelessly stolen from 'https://raw.githubusercontent.com/wouterrutgers/fuzzy-search/master/src/FuzzySearch.mjs'
// I did modify the code a fair bit, but the algorithm is still the same under the hood.
// The original code is under ISC, which stipluate that it needs to retain the copyright notice, so here it is.
//
// It only applies to the code in the FuzzySearch Class, even though I did modify it a fair bit
/*
Copyright (c) 2016, Wouter Rutgers

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
var FuzzySearch = /** @class */ (function () {
    function FuzzySearch(getItems, options) {
        this.haystack = [];
        this.options = Object.assign({
            caseSensitive: false,
            sort: false,
        }, options);
        this.getItems = getItems;
    }
    FuzzySearch.prototype.getOptions = function () {
        return this.options;
    };
    FuzzySearch.prototype.setOptions = function (options) {
        this.options = Object.assign(this.options, options);
    };
    FuzzySearch.prototype.setHaystack = function (items) {
        this.haystack = items;
    };
    FuzzySearch.prototype.getHaystack = function () {
        return this.haystack;
    };
    FuzzySearch.prototype.search = function (query) {
        if (query.length === 0) {
            return this.haystack;
        }
        var results = [];
        for (var _a = 0, _b = this.haystack; _a < _b.length; _a++) {
            var item = _b[_a];
            for (var _c = 0, _d = this.getItems(item); _c < _d.length; _c++) {
                var value = _d[_c];
                var score = this.isMatch(value, query);
                if (score !== undefined) {
                    results.push({ item: item, score: score });
                    /// We don't want to have multiple occurence of the same item, so only take one if it is found
                    break;
                }
            }
        }
        if (this.options.sort) {
            results.sort(function (a, b) { return a.score - b.score; });
        }
        return results.map(function (result) { return result.item; });
    };
    FuzzySearch.prototype.isMatch = function (item, query) {
        if (!this.options.caseSensitive) {
            item = item.toLocaleLowerCase();
            query = query.toLocaleLowerCase();
        }
        var indexes = this.nearestIndexesFor(item, query);
        if (indexes === undefined) {
            return;
        }
        // Exact matches should be first.
        if (item === query) {
            return 1;
        }
        // If we have more than 2 letters, matches close to each other should be first.
        if (indexes.length > 1) {
            return 2 + (indexes[indexes.length - 1] - indexes[0]);
        }
        // Matches closest to the start of the string should be first.
        return 2 + indexes[0];
    };
    FuzzySearch.prototype.nearestIndexesFor = function (item, query) {
        var letters = query.split('');
        var indexes = [];
        var idxFL = this.idxFirstLetter(item, query);
        for (var _a = 0, idxFL_1 = idxFL; _a < idxFL_1.length; _a++) {
            var idx = idxFL_1[_a];
            indexes.push([idx]);
            for (var i = 1; i < letters.length; i++) {
                var letter = letters[i];
                var index = item.indexOf(letter, idx + 1);
                if (index === -1) {
                    indexes.pop();
                    break;
                }
                indexes[indexes.length - 1].push(index);
                index++;
            }
        }
        if (indexes.length === 0) {
            return;
        }
        return indexes.sort(function (a, b) {
            if (a.length === 1) {
                return a[0] - b[0];
            }
            var res_a = a[a.length - 1] - a[0];
            var res_b = b[b.length - 1] - b[0];
            return res_a - res_b;
        })[0];
    };
    FuzzySearch.prototype.idxFirstLetter = function (item, query) {
        var match = query[0];
        return item
            .split('')
            .map(function (letter, index) {
            if (letter !== match) {
                return;
            }
            return index;
        })
            .filter(function (index) { return index !== undefined; });
    };
    return FuzzySearch;
}());
var ReLibraryPlugin = /** @class */ (function () {
    function ReLibraryPlugin() {
        this.id = 'ReLib';
        this.name = 'Re:Library';
        this.icon = 'src/en/relibrary/icon.png';
        this.site = 'https://re-library.com';
        this.version = '1.0.0';
        this.searchFunc = new FuzzySearch(function (item) { return [item.name]; }, {
            sort: true,
            caseSensitive: false,
        });
    }
    ReLibraryPlugin.prototype.popularNovelsInner = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var novels, result, body, loadedCheerio;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        novels = [];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        loadedCheerio('.entry-content > ol > li').each(function (_i, el) {
                            var novel = {};
                            novel.name = loadedCheerio(el).find('h3 > a').text();
                            novel.path = loadedCheerio(el)
                                .find('table > tbody > tr > td > a')
                                .attr('href');
                            if (novel.name === undefined || novel.path === undefined)
                                return;
                            novel.cover =
                                loadedCheerio(el)
                                    .find('table > tbody > tr > td > a > img')
                                    .attr('src') || defaultCover_1.defaultCover;
                            if (novel.path.startsWith(_this.site)) {
                                novel.path = novel.path.slice(_this.site.length);
                            }
                            novels.push(novel);
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    ReLibraryPlugin.prototype.lastestNovelsInner = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var novels, result, body, loadedCheerio;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        novels = [];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        loadedCheerio('article.type-page.page').each(function (_i, el) {
                            var novel = {};
                            novel.name = loadedCheerio(el).find('.entry-title').text();
                            novel.path = loadedCheerio(el).find('.entry-title a').attr('href');
                            if (novel.path === undefined || novel.name === undefined)
                                return;
                            novel.cover =
                                loadedCheerio(el)
                                    .find('.entry-content > table > tbody > tr > td > img')
                                    .attr('src') || defaultCover_1.defaultCover;
                            if (novel.path.startsWith(_this.site)) {
                                novel.path = novel.path.slice(_this.site.length);
                            }
                            novels.push(novel);
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    ReLibraryPlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var showLatestNovels = _b.showLatestNovels;
            return __generator(this, function (_c) {
                // The most-popular page only has a single page, so we return an empty array in case you ask for the impossible
                // the lastest page do have paginated result, so we support that.
                if (showLatestNovels)
                    return [2 /*return*/, this.lastestNovelsInner("".concat(this.site, "/tag/translations/page/").concat(pageNo))];
                else if (pageNo === 1)
                    return [2 /*return*/, this.popularNovelsInner("".concat(this.site, "/translations/most-popular/"))];
                else
                    return [2 /*return*/, []];
                return [2 /*return*/];
            });
        });
    };
    ReLibraryPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var novel, result, body, loadedCheerio, chapters, chapter_idx;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        novel = {
                            path: novelPath,
                        };
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "/").concat(novelPath))];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        // If it doesn't find the name I should just throw an error (or early return) since the scraping is broken
                        novel.name = loadedCheerio('header.entry-header > .entry-title')
                            .text()
                            .trim();
                        if (novel.name === undefined || novel.name === '404 – Page not found')
                            throw new Error("Invalid novel for url ".concat(novelPath));
                        // Find the cover
                        novel.cover =
                            loadedCheerio('.entry-content > table > tbody > tr > td > img').attr('src') || defaultCover_1.defaultCover;
                        // Genres in comma separated "list"
                        novel.genres = (function () {
                            var genres = [];
                            loadedCheerio('.entry-content > table > tbody > tr > td > p > span > a').each(function (_i, el) {
                                genres.push(loadedCheerio(el).text().trim());
                            });
                            return genres.join(', ');
                        })();
                        // Handle the novel status
                        // Sadly some novels just state the status inside the summary...
                        // I don't even know if the snippet here works for *most* of the novels preset, or only for a few
                        loadedCheerio('.entry-content > table > tbody > tr > td > p').each(function (_i, el) {
                            if (loadedCheerio(el)
                                .find('strong')
                                .text()
                                .toLowerCase()
                                .trim()
                                .startsWith('status')) {
                                loadedCheerio(el).find('strong').remove();
                                novel.status = loadedCheerio(el).text();
                            }
                        });
                        novel.summary = loadedCheerio('.entry-content > div.su-box > div.su-box-content').text();
                        chapters = [];
                        chapter_idx = 0;
                        loadedCheerio('.entry-content > div.su-accordion').each(function (_i1, el) {
                            loadedCheerio(el)
                                .find('li.page_item > a')
                                .each(function (_i2, chap_el) {
                                var _a;
                                chapter_idx += 1;
                                var chap_path = (_a = loadedCheerio(chap_el).attr('href')) === null || _a === void 0 ? void 0 : _a.trim();
                                if (loadedCheerio(chap_el).text() === undefined ||
                                    chap_path === undefined)
                                    return;
                                if (chap_path.startsWith(_this.site)) {
                                    chap_path = chap_path.slice(_this.site.length);
                                }
                                chapters.push({
                                    name: loadedCheerio(chap_el).text(),
                                    path: chap_path,
                                    chapterNumber: chapter_idx,
                                    // we KNOW that we can't get the released time (at least without any additional fetches), so set it to null purposfully
                                    releaseTime: null,
                                });
                            });
                        });
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    ReLibraryPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var result, body, loadedCheerio, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "/").concat(chapterPath))];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        text = [];
                        loadedCheerio('.entry-content > p')
                            .slice(1)
                            .each(function (_i, el) {
                            loadedCheerio(el).find('span').remove();
                            var t = loadedCheerio(el).html();
                            if (t === undefined)
                                return;
                            text.push("<p>".concat(t, "</p>"));
                        });
                        if (text.length == 0)
                            throw new Error("Invalid Parsing of chapter, couldn't find any text for url \"".concat(this.site, "/").concat(chapterPath, "\""));
                        return [2 /*return*/, text.join('')];
                }
            });
        });
    };
    ReLibraryPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var novels, req, body, loadedCheerio;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // We only want to serve a single "page" since we do the search client side.
                        if (pageNo !== 1)
                            return [2 /*return*/, []];
                        novels = [];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "/translations/"))];
                    case 1:
                        req = _a.sent();
                        return [4 /*yield*/, req.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        loadedCheerio('.entry-content table a').each(function (_i, el) {
                            var e = loadedCheerio(el);
                            if (e && e.attr('href') && e.text()) {
                                var path = e.attr('href');
                                if (path.startsWith(_this.site)) {
                                    path = path.slice(_this.site.length);
                                }
                                novels.push({ name: e.text(), path: path, cover: defaultCover_1.defaultCover });
                            }
                        });
                        this.searchFunc.setHaystack(novels);
                        return [2 /*return*/, this.searchFunc.search(searchTerm)];
                }
            });
        });
    };
    return ReLibraryPlugin;
}());
exports.default = new ReLibraryPlugin();
