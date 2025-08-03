"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = require("cheerio");
var fetch_1 = require("@libs/fetch");
var filterInputs_1 = require("@libs/filterInputs");
var MangaTR = /** @class */ (function () {
    function MangaTR() {
        this.id = 'mangatr';
        this.name = 'MangaTR';
        this.icon = 'src/tr/mangatr/icon.png';
        this.site = 'https://manga-tr.com/';
        this.version = '1.0.0';
        this.opts = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-requested-with': 'XMLHttpRequest',
            },
        };
        this.filters = {
            sort: {
                value: 'views',
                label: 'Sırala',
                options: [
                    { label: 'Adı', value: 'name' },
                    { label: 'Popülarite', value: 'views' },
                    { label: 'Son Güncelleme', value: 'last_update' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            sort_type: {
                value: 'DESC',
                label: 'Sırala Türü',
                options: [
                    { label: 'ASC', value: 'ASC' },
                    { label: 'DESC', value: 'DESC' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            status: {
                value: '',
                label: 'Durum',
                options: [
                    { label: 'Hepsi', value: '' },
                    { label: 'Yayınlanması Tamamlanan', value: '1' },
                    { label: 'Devam Eden', value: '2' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            translation: {
                value: '',
                label: 'Çeviri Durumu',
                options: [
                    { label: 'Hepsi', value: '' },
                    { label: 'Çevirisi Tamamlanan', value: '1' },
                    { label: 'Devam Eden', value: '4' },
                    { label: 'Bırakılan', value: '2' },
                    { label: 'Olmayan', value: '3' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            age: {
                value: '',
                label: 'Yas',
                options: [
                    { label: 'Hepsi', value: '' },
                    { label: '+16', value: '16' },
                    { label: '+18', value: '18' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genre: {
                value: '',
                label: 'Tür',
                options: [
                    { label: 'Hepsi', value: '' },
                    { label: '4 Koma', value: '4_Koma' },
                    { label: 'Action', value: 'Action' },
                    { label: 'Adventure', value: 'Adventure' },
                    { label: 'Aliens', value: 'Aliens' },
                    { label: 'Art', value: 'Art' },
                    { label: 'Biography', value: 'Biography' },
                    { label: 'Bishoujo', value: 'Bishoujo' },
                    { label: 'Bishounen', value: 'Bishounen' },
                    { label: 'Comedy', value: 'Comedy' },
                    { label: 'Crime', value: 'Crime' },
                    { label: 'Demons', value: 'Demons' },
                    { label: 'Doujinshi', value: 'Doujinshi' },
                    { label: 'Drama', value: 'Drama' },
                    { label: 'Ecchi', value: 'Ecchi' },
                    { label: 'Fantasy', value: 'Fantasy' },
                    { label: 'Gore', value: 'Gore' },
                    { label: 'Harem', value: 'Harem' },
                    { label: 'History', value: 'History' },
                    { label: 'Horror', value: 'Horror' },
                    { label: 'Isekai', value: 'Isekai' },
                    { label: 'Josei', value: 'Josei' },
                    { label: 'Magic', value: 'Magic' },
                    { label: 'Manhua', value: 'Manhua' },
                    { label: 'Manhwa', value: 'Manhwa' },
                    { label: 'Martial', value: 'Martial' },
                    { label: 'Mecha', value: 'Mecha' },
                    { label: 'Military', value: 'Military' },
                    { label: 'Miscellaneous', value: 'Miscellaneous' },
                    { label: 'Monster', value: 'Monster' },
                    { label: 'Musical', value: 'Musical' },
                    { label: 'Mystery', value: 'Mystery' },
                    { label: 'Novel', value: 'Novel' },
                    { label: 'Nudity', value: 'Nudity' },
                    { label: 'One Shot', value: 'One_Shot' },
                    { label: 'Romance', value: 'Romance' },
                    { label: 'Psychological', value: 'Psychological' },
                    { label: 'Seinen', value: 'Seinen' },
                    { label: 'School', value: 'School' },
                    { label: 'Sci fi', value: 'Sci_fi' },
                    { label: 'Short', value: 'Short' },
                    { label: 'Shoujo', value: 'Shoujo' },
                    { label: 'Shoujo Ai', value: 'Shoujo_Ai' },
                    { label: 'Shounen', value: 'Shounen' },
                    { label: 'Shounen Ai', value: 'Shounen_Ai' },
                    { label: 'Slice of life', value: 'Slice of life' },
                    { label: 'Supernatural', value: 'Supernatural' },
                    { label: 'Space', value: 'Space' },
                    { label: 'Sports', value: 'Sports' },
                    { label: 'Thriller', value: 'Thriller' },
                    { label: 'Tragedy', value: 'Tragedy' },
                    { label: 'Türkçe Novel', value: 'Türkçe Novel' },
                    { label: 'Vampires', value: 'Vampires' },
                    { label: 'Violence', value: 'Violence' },
                    { label: 'War', value: 'War' },
                    { label: 'Webtoon', value: 'Webtoon' },
                    { label: 'Western', value: 'Western' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    /**
     * @param novelPath
     * @returns novel metadata and its first page
     */
    MangaTR.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, novel, summary, chapters, title, url, response, page1, _a, firstPage, lastPage, pageDatas, novelTitle, _loop_1, _i, pageDatas_1, page;
            var _this = this;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath).then(function (r) { return r.text(); })];
                    case 1:
                        body = _c.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('#tables').text(),
                            cover: loadedCheerio('#myCarousel > div.container > div.col-lg-4.col-sm-4 > img').attr('src'),
                            status: loadedCheerio('#tab1 > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-last-child(2) > a').text(),
                            chapters: [],
                            author: loadedCheerio('#tab1 > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(1) > a')
                                .map(function (i, el) { return loadedCheerio(el).text(); })
                                .get()
                                .join(','),
                            artist: loadedCheerio('#tab1 > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2) > a')
                                .map(function (i, el) { return loadedCheerio(el).text(); })
                                .get()
                                .join(','),
                            genres: loadedCheerio('#tab1 > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(3) > a')
                                .map(function (i, el) { return loadedCheerio(el).text(); })
                                .get()
                                .join(','),
                        };
                        summary = loadedCheerio('#tab1 > div.well');
                        // remove h3 and div from children
                        summary.children().remove('h3, div');
                        novel.summary = summary.text().trim();
                        chapters = [];
                        title = novelPath.split('.html')[0].slice(6);
                        url = "".concat(this.site, "cek/fetch_pages_manga.php?manga_cek=").concat(title);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url, __assign(__assign({}, this.opts), { body: 'page=1' }))];
                    case 2:
                        response = _c.sent();
                        _a = cheerio_1.load;
                        return [4 /*yield*/, response.text()];
                    case 3:
                        page1 = _a.apply(void 0, [_c.sent()]);
                        firstPage = 1;
                        lastPage = parseInt((_b = page1('a[title="Last"]').first().attr('data-page')) !== null && _b !== void 0 ? _b : '1');
                        return [4 /*yield*/, Promise.all(Array.from({ length: lastPage - firstPage }, function (_, i) {
                                return (0, fetch_1.fetchApi)(url, __assign(__assign({}, _this.opts), { body: "page=".concat(firstPage + i + 1) })).then(function (r) { return r.text(); });
                            })).then(function (pages) { return pages.map(function (p) { return (0, cheerio_1.load)(p); }); })];
                    case 4:
                        pageDatas = _c.sent();
                        pageDatas = __spreadArray([page1], pageDatas, true);
                        novelTitle = novel.name
                            .toLocaleLowerCase()
                            .replace(/\([0-9]+\)/g, '')
                            .trim();
                        _loop_1 = function (page) {
                            // For each chapter
                            page('body > ul > table > tbody > tr').each(function (_, el) {
                                var _a;
                                var chap = page(el);
                                var chapTitle1 = chap.find('td:nth-child(1) > a').text();
                                var updatedChapTitle1 = chapTitle1
                                    .toLocaleLowerCase()
                                    .replace(novelTitle, 'Ch')
                                    .trim();
                                var chapTitle2 = chap.find('td:nth-child(1) > div').text();
                                var chapPath = (_a = chap.find('td:nth-child(1) > a').attr('href')) !== null && _a !== void 0 ? _a : '';
                                if (chapPath === '')
                                    return;
                                chapters.push({
                                    name: chapTitle2 !== ''
                                        ? "".concat(updatedChapTitle1, ": ").concat(chapTitle2)
                                        : updatedChapTitle1,
                                    path: chapPath,
                                    chapterNumber: parseFloat(chapTitle1.replace(/[^0-9.]/g, '')),
                                });
                            });
                        };
                        // Go through each page and get the chapters
                        for (_i = 0, pageDatas_1 = pageDatas; _i < pageDatas_1.length; _i++) {
                            page = pageDatas_1[_i];
                            _loop_1(page);
                        }
                        if (chapters.length > 0) {
                            novel.chapters = chapters.reverse();
                        }
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    MangaTR.prototype.popularNovels = function (pageNo, _a) {
        var showLatestNovels = _a.showLatestNovels, filters = _a.filters;
        var params = new URLSearchParams();
        params.append('page', pageNo.toString());
        if (showLatestNovels == true) {
            params.append('sort', 'last_update');
            params.append('sort_type', 'DESC');
        }
        else {
            params.append('durum', filters.status.value.toString()); // status
            params.append('ceviri', ''); // translation status
            params.append('yas', filters.age.value.toString()); // age
            params.append('icerik', '2'); // content type -> always novel (2)
            params.append('tur', filters.genre.value.toString()); // genre (only 1)
            params.append('sort', filters.sort.value.toString());
            params.append('sort_type', filters.sort_type.value.toString());
        }
        var url = "".concat(this.site, "manga-list-sayfala.html?").concat(params.toString());
        var parseNovels = function (loadedCheerio) {
            return loadedCheerio('#myCarousel > div.container > div:nth-child(3) > div.col-lg-9.col-md-8 > div.col-md-12')
                .map(function (_, el) {
                var _a, _b;
                var novel = loadedCheerio(el);
                return {
                    name: novel.find('#tables').text(),
                    path: (_a = novel.find('#tables > a').attr('href')) !== null && _a !== void 0 ? _a : '',
                    cover: (_b = novel.find('img.img-thumb').first().attr('src')) !== null && _b !== void 0 ? _b : '',
                };
            })
                .toArray();
        };
        return (0, fetch_1.fetchApi)(url)
            .then(function (r) { return r.text(); })
            .then(function (body) {
            var loadedCheerio = (0, cheerio_1.load)(body);
            return parseNovels(loadedCheerio);
        });
    };
    MangaTR.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, content;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath).then(function (r) { return r.text(); })];
                    case 1:
                        body = _b.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        content = loadedCheerio('#well');
                        return [2 /*return*/, (_a = content.html()) !== null && _a !== void 0 ? _a : ''];
                }
            });
        });
    };
    MangaTR.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var ITEMS_PER_PAGE, params, url, parseNovels;
            var _this = this;
            return __generator(this, function (_a) {
                ITEMS_PER_PAGE = 50;
                params = new URLSearchParams();
                params.append('icerik', searchTerm);
                url = "".concat(this.site, "arama.html?").concat(params.toString());
                parseNovels = function (loadedCheerio) { return __awaiter(_this, void 0, void 0, function () {
                    var novels, curr, _i, _a, el, novelCheerio, mangaSlug;
                    var _this = this;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                novels = [];
                                curr = 0;
                                for (_i = 0, _a = loadedCheerio('div.char > a + span').toArray(); _i < _a.length; _i++) {
                                    el = _a[_i];
                                    // Done!
                                    if (novels.length === ITEMS_PER_PAGE)
                                        break;
                                    // Skip if not a novel
                                    if (loadedCheerio(el).text().trim().toLowerCase() != 'novel' &&
                                        loadedCheerio(el).next().text().trim().toLowerCase() != 'novel') {
                                        continue;
                                    }
                                    // Skip for pagination
                                    if ((pageNo - 1) * ITEMS_PER_PAGE > curr) {
                                        curr++;
                                        continue;
                                    }
                                    novelCheerio = loadedCheerio(el).prev();
                                    mangaSlug = (_b = novelCheerio.attr('manga-slug')) !== null && _b !== void 0 ? _b : '';
                                    novels.push({
                                        name: novelCheerio.text(),
                                        path: (_c = novelCheerio.attr('href')) !== null && _c !== void 0 ? _c : '',
                                        cover: mangaSlug, // NOTE: This slug gets replaced with the actual cover image later (see below)
                                    });
                                }
                                return [4 /*yield*/, Promise.all(novels.map(function (novel) { return __awaiter(_this, void 0, void 0, function () {
                                        var url, response, body, imgCheerio, img;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    url = "".concat(this.site, "app/manga/controllers/cont.pop.php");
                                                    return [4 /*yield*/, (0, fetch_1.fetchApi)(url, __assign(__assign({}, this.opts), { body: "slug=".concat(novel.cover) }))];
                                                case 1:
                                                    response = _a.sent();
                                                    return [4 /*yield*/, response.text()];
                                                case 2:
                                                    body = _a.sent();
                                                    imgCheerio = (0, cheerio_1.load)(body);
                                                    img = imgCheerio('img').first().attr('src');
                                                    novel.cover = img;
                                                    return [2 /*return*/, novel];
                                            }
                                        });
                                    }); }))];
                            case 1: 
                            // Get all cover images in parallel
                            return [2 /*return*/, _d.sent()];
                        }
                    });
                }); };
                return [2 /*return*/, (0, fetch_1.fetchApi)(url)
                        .then(function (r) { return r.text(); })
                        .then(function (body) {
                        var loadedCheerio = (0, cheerio_1.load)(body);
                        return parseNovels(loadedCheerio);
                    })];
            });
        });
    };
    MangaTR.prototype.resolveUrl = function (path, isNovel) {
        return this.site + path;
    };
    return MangaTR;
}());
exports.default = new MangaTR();
