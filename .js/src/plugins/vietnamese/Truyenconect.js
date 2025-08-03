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
var fetch_1 = require("@libs/fetch");
var filterInputs_1 = require("@libs/filterInputs");
var novelStatus_1 = require("@libs/novelStatus");
var TruyenConect = /** @class */ (function () {
    function TruyenConect() {
        this.id = 'truyenconect';
        this.name = 'Truyen Conect';
        this.icon = 'src/vi/truyenconect/icon.png';
        this.customJS = 'src/vi/truyenconect/test.js';
        this.site = 'https://truyenconect.com';
        this.version = '1.0.0';
        this.filters = {
            category: {
                label: 'Lọc theo',
                value: '',
                type: filterInputs_1.FilterTypes.Picker,
                options: [
                    { label: '', value: '' },
                    { label: 'Thể loại', value: 'the-loai' },
                    { label: 'Truyện dịch', value: 'truyen-dich' },
                    { label: 'Truyện convert', value: 'convert' },
                ],
            },
            genre: {
                label: 'Thể loại',
                value: 'action',
                type: filterInputs_1.FilterTypes.Picker,
                options: [
                    { label: 'Action', value: 'action' },
                    { label: 'Adult', value: 'adult' },
                    { label: 'Adventure', value: 'adventure' },
                    { label: 'Chinese novel', value: 'chinese-novel' },
                    { label: 'Chuyển Sinh', value: 'chuyen-sinh' },
                    { label: 'English Novel', value: 'english-novel' },
                    { label: 'Harem', value: 'harem' },
                    { label: 'Ecchi', value: 'ecchi' },
                    { label: 'Fantasy', value: 'fantasy' },
                    { label: 'Drama', value: 'drama' },
                    { label: 'Game', value: 'game' },
                    { label: 'Tiên hiệp', value: 'tien-hiep' },
                    { label: 'Kiếm Hiệp', value: 'kiem-hiep' },
                    { label: 'Ngôn Tình', value: 'ngon-tinh' },
                    { label: 'Isekai', value: 'isekai' },
                    { label: 'Lịch Sử', value: 'lich-su' },
                    { label: 'Web Novel', value: 'web-novel' },
                    { label: 'Xuyên không', value: 'xuyen-khong' },
                    { label: 'Trọng sinh', value: 'trong-sinh' },
                    { label: 'Trinh thám', value: 'trinh-tham' },
                    { label: 'Dị giới', value: 'di-gioi' },
                    { label: 'Huyền ảo', value: 'huyen-ao' },
                    { label: 'Sắc Hiệp', value: 'sac-hiep' },
                    { label: 'Dị năng', value: 'di-nang' },
                    { label: 'Linh dị', value: 'linh-di' },
                    { label: 'Đô thị', value: 'do-thi' },
                    { label: 'Comedy', value: 'comedy' },
                    { label: 'School Life', value: 'school-life' },
                    { label: 'Romance', value: 'romance' },
                    { label: 'Martial-arts', value: 'martial-arts' },
                    { label: 'Light Novel', value: 'light-novel' },
                    { label: 'Huyền huyễn', value: 'huyen-huyen' },
                    { label: 'Kỳ Huyễn', value: 'ky-huyen' },
                    { label: 'Khoa Huyễn', value: 'khoa-huyen' },
                    { label: 'Võng Du', value: 'vong-du' },
                    { label: 'Đồng Nhân', value: 'dong-nhan' },
                ],
            },
        };
    }
    TruyenConect.prototype.sleep = function (ms) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
            });
        });
    };
    TruyenConect.prototype.parseNovels = function (loadedCheerio, selector) {
        var _this = this;
        var novels = [];
        loadedCheerio(selector).each(function (idx, ele) {
            var url = loadedCheerio(ele).find('a').attr('href');
            if (url) {
                novels.push({
                    name: loadedCheerio(ele).find('img').attr('alt') || '',
                    path: url.replace(_this.site, ''),
                    cover: loadedCheerio(ele).find('img').attr('data-src'),
                });
            }
        });
        return novels;
    };
    TruyenConect.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var link, selector, body, loadedCheerio;
            var filters = _b.filters, showLatestNovels = _b.showLatestNovels;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        link = this.site;
                        selector = '.c-page__content > .grid9.block .item-thumb.c-image-hover';
                        if (showLatestNovels) {
                            selector =
                                '.c-page__content .page-content-listing.item-big_thumbnail .item-thumb.c-image-hover';
                        }
                        else if (filters === null || filters === void 0 ? void 0 : filters.category.value) {
                            link += '/' + filters.category.value;
                            selector =
                                'table.manga-shortcodes.manga-chapters-listing td[width="10%"]';
                            if (filters.category.value === 'the-loai') {
                                selector = '.item-thumb.hover-details.c-image-hover';
                                link += '/' + filters.genre.value;
                            }
                            link += '?page=' + pageNo;
                        }
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(link).then(function (r) { return r.text(); })];
                    case 1:
                        body = _c.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, this.parseNovels(loadedCheerio, selector)];
                }
            });
        });
    };
    TruyenConect.prototype.parseChapters = function (loadedCheerio) {
        var _this = this;
        var chapters = [];
        loadedCheerio('option').each(function (idx, ele) {
            var _a, _b;
            var url = ele.attribs['value'];
            if (!url)
                return;
            var chapterId = (_a = url.match(/\/(\d+)-/)) === null || _a === void 0 ? void 0 : _a[1];
            if (chapterId) {
                url = url.replace(chapterId + '-', '') + '-' + chapterId;
            }
            var num = (_b = url.match(/chuong-(\d+)/)) === null || _b === void 0 ? void 0 : _b[1];
            chapters.push({
                path: url.replace(_this.site, ''),
                name: loadedCheerio(ele).text().trim(),
                chapterNumber: Number(num) || undefined,
            });
        });
        return chapters.reverse();
    };
    TruyenConect.prototype.parseVolumes = function (loadedCheerio) {
        var volumes = [];
        loadedCheerio('option').each(function (idx, ele) {
            volumes.push({
                story: ele.attribs['data-story'],
                navigation: ele.attribs['data-navigation'],
                value: ele.attribs['value'],
            });
        });
        return volumes;
    };
    TruyenConect.prototype.getVolumes = function (firstChapterUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var chapterId, url, data, volumeList;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        chapterId = (_a = firstChapterUrl.match(/-(\d+)$/)) === null || _a === void 0 ? void 0 : _a[1];
                        if (!chapterId)
                            throw new Error('Không tìm thấy chương');
                        url = this.site + '/truyen/get-chap-selector?chap=' + chapterId;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.json(); })];
                    case 1:
                        data = _b.sent();
                        volumeList = {
                            chapters: this.parseChapters((0, cheerio_1.load)(data.chap_selector)),
                        };
                        if (data.eps_selector) {
                            volumeList.volumes = this.parseVolumes((0, cheerio_1.load)(data.eps_selector));
                        }
                        return [2 /*return*/, volumeList];
                }
            });
        });
    };
    TruyenConect.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, novel, firstChapLink, volumeList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + novelPath;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            name: loadedCheerio('.post-title > h1').text().trim(),
                            path: novelPath,
                            chapters: [],
                            totalPages: 1,
                        };
                        novel.cover = loadedCheerio('.summary_image > a > img').attr('data-src');
                        loadedCheerio('.post-content_item').each(function () {
                            var detailName = loadedCheerio(this)
                                .find('.summary-heading > h5')
                                .text()
                                .trim();
                            var detail = loadedCheerio(this).find('.summary-content').html();
                            if (!detail)
                                return;
                            switch (detailName) {
                                case 'Thể loại':
                                    novel.genres = loadedCheerio(detail)
                                        .children('a')
                                        .map(function (i, el) { return loadedCheerio(el).text(); })
                                        .toArray()
                                        .join(',');
                                    break;
                                case 'Tác giả':
                                    novel.author = loadedCheerio(detail).text().trim();
                                    break;
                                case 'Hoạ sĩ':
                                    novel.artist = loadedCheerio(detail).text().trim();
                                    break;
                                case 'Trạng thái':
                                    switch (detail.trim()) {
                                        case 'Full':
                                            novel.status = novelStatus_1.NovelStatus.Completed;
                                            break;
                                        case 'Tạm ngưng':
                                            novel.status = novelStatus_1.NovelStatus.OnHiatus;
                                            break;
                                        case 'Đang tiến hành':
                                            novel.status = novelStatus_1.NovelStatus.Ongoing;
                                            break;
                                        default:
                                            novel.status = novelStatus_1.NovelStatus.Unknown;
                                            break;
                                    }
                            }
                        });
                        loadedCheerio('.description-summary > div.summary__content > div').remove();
                        novel.summary = loadedCheerio('.description-summary > div.summary__content')
                            .text()
                            .trim();
                        firstChapLink = loadedCheerio('#init-links > a').first().attr('href');
                        if (!firstChapLink)
                            throw new Error('Không tìm thấy truyện');
                        return [4 /*yield*/, this.sleep(1000)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.getVolumes(firstChapLink)];
                    case 4:
                        volumeList = _a.sent();
                        if (volumeList.volumes) {
                            novel.totalPages = volumeList.volumes.length;
                            novel.chapters = volumeList.chapters;
                        }
                        else {
                            novel.totalPages = 1;
                            novel.chapters = volumeList.chapters;
                        }
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    TruyenConect.prototype.parsePage = function (novelPath, page) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, firstChapLink, volumeList, volumeIndex, volume, query, chaptersUrl, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + novelPath;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        firstChapLink = loadedCheerio('#init-links > a').first().attr('href');
                        if (!firstChapLink)
                            throw new Error('Không tìm thấy truyện');
                        return [4 /*yield*/, this.sleep(1000)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.getVolumes(firstChapLink)];
                    case 4:
                        volumeList = _a.sent();
                        volumeIndex = Number(page) - 1;
                        if (!volumeList.volumes)
                            throw new Error('Không tìm thấy truyện');
                        if (volumeIndex >= volumeList.volumes.length)
                            throw new Error('Không tìm thấy volume');
                        volume = volumeList.volumes[volumeIndex];
                        query = "dataEpisodes=".concat(volume.value, "&datastory=").concat(volume.story, "&dataNavigation=").concat(encodeURIComponent(volume.navigation));
                        chaptersUrl = "".concat(this.site, "/truyen/getreadingchapAction?").concat(query);
                        return [4 /*yield*/, this.sleep(1000)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(chaptersUrl).then(function (r) { return r.json(); })];
                    case 6:
                        res = _a.sent();
                        if (res.err)
                            throw new Error(res.html);
                        return [2 /*return*/, {
                                chapters: this.parseChapters((0, cheerio_1.load)(res.html)),
                            }];
                }
            });
        });
    };
    TruyenConect.prototype.parseChapter = function (chapterPath) {
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
                        chapterText = loadedCheerio('.reading-content').html() || '';
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    TruyenConect.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "?key=").concat(searchTerm, "&page=").concat(pageNo);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio('.tab-thumb.c-image-hover > a').each(function (idx, ele) {
                            var novelName = ele.attribs['title'];
                            var novelCover = loadedCheerio(ele).find('img').first().attr('src');
                            var novelUrl = ele.attribs['href'];
                            if (!novelUrl)
                                return;
                            novels.push({
                                name: novelName,
                                path: novelUrl.replace(_this.site, ''),
                                cover: novelCover,
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return TruyenConect;
}());
exports.default = new TruyenConect();
