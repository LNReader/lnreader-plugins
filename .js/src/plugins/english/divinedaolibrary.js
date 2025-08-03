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
var defaultCover_1 = require("@libs/defaultCover");
var fetch_1 = require("@libs/fetch");
var filterInputs_1 = require("@libs/filterInputs");
var cheerio_1 = require("cheerio");
//TODO: this looks similar to fictioneer source? maybe use multisrc someday
var DDLPlugin = /** @class */ (function () {
    function DDLPlugin() {
        this.id = 'DDL.com';
        this.name = 'Divine Dao Library';
        this.site = 'https://www.divinedaolibrary.com/';
        this.version = '1.1.1';
        this.icon = 'src/en/divinedaolibrary/icon.png';
        this.filters = {
            category: {
                type: filterInputs_1.FilterTypes.CheckboxGroup,
                label: 'State',
                value: ['Completed', 'Translating', 'Lost in Voting Poll', 'Dropped'],
                options: [
                    { label: 'Completed', value: 'Completed' },
                    { label: 'Translating', value: 'Translating' },
                    { label: 'Lost in Voting Poll', value: 'Lost in Voting Poll' },
                    { label: 'Dropped', value: 'Dropped' },
                    { label: 'Personally Written', value: 'Personally Written' },
                ],
            },
        };
        this.novelItemCache = new Map();
    }
    /**
     * Safely extract the pathname from any URL on {@link site}. Check the root
     * site as there are novels linking off-site (to Patreon).
     *
     * @private
     */
    DDLPlugin.prototype.getPath = function (url) {
        if (!url.startsWith(this.site)) {
            return undefined;
        }
        var trimmed = url.substring(this.site.length).replace(/(^\/+|\/+$)/g, '');
        if (trimmed.length === 0) {
            return undefined;
        }
        return trimmed;
    };
    /**
     * Map an array with an asynchronous function and only return the array items
     * that successfully were fulfilled with values other than undefined.
     *
     * @private
     */
    DDLPlugin.prototype.asyncMap = function (collection, callbackfn) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.allSettled(collection.map(callbackfn))];
                    case 1: return [2 /*return*/, (_a.sent())
                            .filter(function (p) {
                            return p.status === 'fulfilled' && p.value !== undefined;
                        })
                            .map(function (_a) {
                            var value = _a.value;
                            return value;
                        })];
                }
            });
        });
    };
    /**
     * DDL links to future (unpublished) chapters from its novel pages. To be
     * able to report updates correctly, try to figure out which chapter was the
     * actual latest one to be published.
     *
     * @private
     * @returns the path value of the latest published chapter (or undefined)
     */
    DDLPlugin.prototype.findLatestChapter = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var link, guessCategory, categoryId, chapterLink, lastChapter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        link = "".concat(this.site, "wp-json/wp/v2/categories?slug=").concat(novelPath);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(link).then(function (res) { return res.json(); })];
                    case 1:
                        guessCategory = _a.sent();
                        if (guessCategory.length !== 1) {
                            return [2 /*return*/, undefined];
                        }
                        categoryId = guessCategory[0].id;
                        chapterLink = "".concat(this.site, "wp-json/wp/v2/posts?categories=").concat(categoryId, "&per_page=1");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(chapterLink).then(function (res) { return res.json(); })];
                    case 2:
                        lastChapter = _a.sent();
                        if (lastChapter.length !== 1) {
                            return [2 /*return*/, undefined];
                        }
                        return [2 /*return*/, lastChapter[0].slug];
                }
            });
        });
    };
    /**
     * Based on the path, grab all the available information about a novel. Used
     * to seed the {@link novelItemCache} as well as to fetch the actual single
     * novel views with chapter list.
     *
     * @private
     */
    DDLPlugin.prototype.grabNovel = function (path_1) {
        return __awaiter(this, arguments, void 0, function (path, getChapters) {
            var link, data, content, excerpt, image, chapters, linkedChapters, lastChapterPath_1;
            var _this = this;
            var _a, _b;
            if (getChapters === void 0) { getChapters = false; }
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        link = "".concat(this.site, "wp-json/wp/v2/pages?slug=").concat(path);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(link).then(function (res) { return res.json(); })];
                    case 1:
                        data = _c.sent();
                        if (data.length !== 1) {
                            return [2 /*return*/, undefined];
                        }
                        content = (0, cheerio_1.load)(data[0].content.rendered);
                        excerpt = (0, cheerio_1.load)(data[0].excerpt.rendered);
                        image = content('img').first();
                        chapters = [];
                        if (!getChapters) return [3 /*break*/, 3];
                        linkedChapters = content('li > span > a')
                            .map(function (_, anchorEl) {
                            var chapterPath = _this.getPath(anchorEl.attribs['href']);
                            if (!chapterPath)
                                return;
                            return {
                                name: content(anchorEl).text(),
                                path: chapterPath,
                            };
                        })
                            .toArray();
                        return [4 /*yield*/, this.findLatestChapter(path)];
                    case 2:
                        lastChapterPath_1 = _c.sent();
                        if (lastChapterPath_1) {
                            chapters = linkedChapters.slice(0, 1 +
                                linkedChapters.findIndex(function (chapter) { return chapter.path === lastChapterPath_1; }));
                        }
                        else {
                            chapters = linkedChapters;
                        }
                        _c.label = 3;
                    case 3: return [2 /*return*/, {
                            name: data[0].title.rendered,
                            path: path,
                            cover: (_b = (_a = image.attr('data-lazy-src')) !== null && _a !== void 0 ? _a : image.attr('src')) !== null && _b !== void 0 ? _b : defaultCover_1.defaultCover,
                            author: content('h3')
                                .first()
                                .text()
                                .replace(/^Author:\s*/g, ''),
                            summary: excerpt('p')
                                .first()
                                .text()
                                .replace(/^.+Description\s*/g, ''),
                            chapters: chapters,
                        }];
                }
            });
        });
    };
    /**
     * Based on the path, grab the {@link Plugin.NovelItem} information from the
     * cache. If not available in the cache, it will fetch the information.
     *
     * @private
     */
    DDLPlugin.prototype.grabCachedNovel = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var fromCache, sourceNovel, novel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fromCache = this.novelItemCache.get(path);
                        if (fromCache) {
                            return [2 /*return*/, fromCache];
                        }
                        return [4 /*yield*/, this.grabNovel(path, false)];
                    case 1:
                        sourceNovel = _a.sent();
                        if (sourceNovel === undefined) {
                            return [2 /*return*/, undefined];
                        }
                        novel = {
                            name: sourceNovel.name,
                            path: sourceNovel.path,
                            cover: sourceNovel.cover,
                        };
                        this.novelItemCache.set(path, novel);
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    /**
     * Get the list of all novels listed on the novels page. Cache it so filters
     * do not have to refetch the same HTML again.
     *
     * @private
     */
    DDLPlugin.prototype.grabCachedNovels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.allNovelsCache) {
                            return [2 /*return*/, this.allNovelsCache];
                        }
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + 'novels').then(function (res) { return res.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = loadedCheerio('.entry-content ul')
                            .map(function (_, listEl) {
                            var list = loadedCheerio(listEl);
                            var category = list.prev().text();
                            return list
                                .find('a')
                                .map(function (_, anchorEl) {
                                var path = _this.getPath(anchorEl.attribs['href']);
                                if (!path)
                                    return;
                                var name = loadedCheerio(anchorEl).text();
                                return [[category, name, path]];
                            })
                                .toArray();
                        })
                            .toArray();
                        this.allNovelsCache = novels;
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    /**
     * Parse list of paths of recently updated novels from the homepage.
     *
     * @private
     */
    DDLPlugin.prototype.latestNovels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, novelPaths, uniqueNovelPaths;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site).then(function (res) { return res.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novelPaths = loadedCheerio('#main')
                            .find('a[rel="category tag"]')
                            .map(function (_, anchorEl) {
                            var path = _this.getPath(anchorEl.attribs['href']);
                            return path;
                        })
                            .toArray();
                        uniqueNovelPaths = new Set(novelPaths);
                        return [2 /*return*/, Array.from(uniqueNovelPaths)];
                }
            });
        });
    };
    /**
     * Parse list of paths from novels list, optionally filtered.
     *
     * @private
     */
    DDLPlugin.prototype.allNovels = function (categoryFilter) {
        return __awaiter(this, void 0, void 0, function () {
            var allNovels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.grabCachedNovels()];
                    case 1:
                        allNovels = _a.sent();
                        if (!allNovels)
                            return [2 /*return*/, []];
                        return [2 /*return*/, allNovels
                                .filter(function (_a) {
                                var category = _a[0];
                                return categoryFilter.value.includes(category);
                            })
                                .map(function (_a) {
                                var path = _a[2];
                                return path;
                            })];
                }
            });
        });
    };
    DDLPlugin.prototype.popularNovels = function (pageNo, options) {
        return __awaiter(this, void 0, void 0, function () {
            var novelsList, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (pageNo !== 1) {
                            return [2 /*return*/, []];
                        }
                        novelsList = options.showLatestNovels
                            ? this.latestNovels()
                            : this.allNovels(options.filters.category);
                        _a = this.asyncMap;
                        return [4 /*yield*/, novelsList];
                    case 1: return [4 /*yield*/, _a.apply(this, [_b.sent(), this.grabCachedNovel.bind(this)])];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    DDLPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var sourceNovel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.grabNovel(novelPath, true)];
                    case 1:
                        sourceNovel = _a.sent();
                        if (sourceNovel === undefined) {
                            throw new Error("The path \"".concat(novelPath, "\" could not be resolved."));
                        }
                        return [2 /*return*/, sourceNovel];
                }
            });
        });
    };
    DDLPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var chapterLink, chapter, title, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chapterLink = "".concat(this.site, "wp-json/wp/v2/posts?slug=").concat(chapterPath);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(chapterLink).then(function (res) { return res.json(); })];
                    case 1:
                        chapter = _a.sent();
                        if (chapter.length !== 1) {
                            return [2 /*return*/, ''];
                        }
                        title = "<h1>".concat(chapter[0].title.rendered, "</h1>");
                        content = chapter[0].content.rendered;
                        return [2 /*return*/, "".concat(title).concat(content)];
                }
            });
        });
    };
    DDLPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var allNovels, foundNovels, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (pageNo !== 1) {
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, this.grabCachedNovels()];
                    case 1:
                        allNovels = _b.sent();
                        if (!allNovels)
                            return [2 /*return*/, []];
                        foundNovels = allNovels
                            .filter(function (_a) {
                            var name = _a[1];
                            return name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase());
                        })
                            .map(function (_a) {
                            var path = _a[2];
                            return path;
                        });
                        _a = this.asyncMap;
                        return [4 /*yield*/, foundNovels];
                    case 2: return [4 /*yield*/, _a.apply(this, [_b.sent(), this.grabCachedNovel.bind(this)])];
                    case 3: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    return DDLPlugin;
}());
exports.default = new DDLPlugin();
