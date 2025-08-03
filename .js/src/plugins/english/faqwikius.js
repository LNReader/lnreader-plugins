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
var novelStatus_1 = require("@libs/novelStatus");
var FaqWikiUs = /** @class */ (function () {
    function FaqWikiUs() {
        this.id = 'FWK.US';
        this.name = 'Faq Wiki';
        this.site = 'https://faqwiki.us/';
        this.version = '2.0.1';
        this.icon = 'src/en/faqwikius/icon.png';
    }
    FaqWikiUs.prototype.parseNovels = function (loadedCheerio, searchTerm) {
        var _this = this;
        var novels = [];
        loadedCheerio('.plt-page-item').each(function (index, element) {
            var _a, _b, _c;
            var name = loadedCheerio(element)
                .text()
                .replace('Novel – All Chapters', '')
                .trim();
            var cover = loadedCheerio(element).find('img').attr('data-ezsrc');
            // Remove the appended query string
            if (cover) {
                cover = cover.replace(/\?ezimgfmt=.*$/, ''); // Regular expression magic!
            }
            else {
                cover = loadedCheerio(element).find('img').attr('src');
            }
            var path = (_c = (_b = (_a = loadedCheerio(element)
                .find('a')
                .attr('href')) === null || _a === void 0 ? void 0 : _a.replace('tp:', 'tps:')) === null || _b === void 0 ? void 0 : _b.replace(_this.site, '')) === null || _c === void 0 ? void 0 : _c.replace(/\/+$/, '');
            if (!path)
                return;
            novels.push({ name: name, cover: cover, path: path });
        });
        if (searchTerm) {
            novels = novels.filter(function (novel) {
                return novel.name.toLowerCase().includes(searchTerm.toLowerCase());
            });
        }
        return novels;
    };
    FaqWikiUs.prototype.popularNovels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site).then(function (res) { return res.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, this.parseNovels(loadedCheerio)];
                }
            });
        });
    };
    FaqWikiUs.prototype.parseNovel = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, novel, img, cover, status, chapters;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + path).then(function (res) { return res.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: path,
                            name: '',
                        };
                        novel.name = loadedCheerio('.entry-title')
                            .text()
                            .replace('Novel – All Chapters', '')
                            .trim();
                        img = loadedCheerio('.wp-block-image img');
                        cover = img.attr('data-ezsrc') || img.attr('src');
                        novel.cover = cover === null || cover === void 0 ? void 0 : cover.replace(/\?ezimgfmt=.*$/, ''); // Regular expression magic!
                        status = loadedCheerio("#lcp_instance_0 +:icontains('complete')").text();
                        novel.status = status ? novelStatus_1.NovelStatus.Completed : novelStatus_1.NovelStatus.Ongoing;
                        loadedCheerio('.entry-content strong').each(function (i, el) {
                            var key = loadedCheerio(el).text().trim().toLowerCase();
                            var parent = loadedCheerio(el).parent();
                            var values = [parent.text().slice(key.length).trim()].concat(parent
                                .nextUntil('p:has(strong)')
                                .map(function (e, ax) { return loadedCheerio(ax).text().trim(); })
                                .get());
                            var genreText = values.join(' ').trim();
                            var multiWordGenres = [
                                //add more when found
                                'Slice of Life',
                                'School Life',
                            ];
                            multiWordGenres.forEach(function (genre) {
                                genreText = genreText.replace(new RegExp("\\b".concat(genre, "\\b"), 'g'), genre.replace(/ /g, '_'));
                            });
                            var genres = genreText
                                .split(/\s+/)
                                .map(function (word) { return word.replace(/_/g, ' '); })
                                .join(', ');
                            switch (key) {
                                case 'description:':
                                    novel.summary = values.join('\n');
                                    break;
                                case 'author(s):':
                                    novel.author = values[0];
                                    break;
                                case 'genre:':
                                    novel.genres = genres;
                            }
                        });
                        chapters = [];
                        loadedCheerio('.lcp_catlist li a').each(function (chapterIndex, element) {
                            var _a, _b;
                            var name = loadedCheerio(element)
                                .text()
                                .replace(novel.name + '', '')
                                .replace('Novel' + '', '')
                                .trim();
                            var path = (_b = (_a = loadedCheerio(element)
                                .attr('href')) === null || _a === void 0 ? void 0 : _a.replace(_this.site, '')) === null || _b === void 0 ? void 0 : _b.replace(/\/+$/, '');
                            var chapterNumber = chapterIndex + 1;
                            if (!path)
                                return;
                            chapters.push({
                                name: name,
                                path: path,
                                chapterNumber: chapterNumber,
                            });
                        });
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    FaqWikiUs.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, removal, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath).then(function (res) {
                            return res.text();
                        })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        removal = ['.entry-content span', '.entry-content div', 'script'];
                        removal.map(function (e) {
                            loadedCheerio(e).remove();
                        });
                        chapterText = loadedCheerio('.entry-content').html();
                        // const chapterParagraphs = loadedCheerio('.entry-content p');
                        // let chapterContent; // Save this code in case needed
                        // if (chapterParagraphs.length < 5) {
                        //   //some chapter in this site store their whole text in 1-4 <p>,
                        //   chapterContent = chapterParagraphs
                        //     .map((index, element) => {
                        //       const text = loadedCheerio(element).html();
                        //       return text;
                        //     })
                        //     .get()
                        //     .join('\n\n');
                        // } else {
                        //   // Multiple paragraphs case
                        //   chapterContent = chapterParagraphs
                        //     .map((index, element) => {
                        //       const text = loadedCheerio(element).text().trim();
                        //       return `<p>${text}</p>`;
                        //     })
                        //     .get()
                        //     .join('\n\n');
                        // }
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    FaqWikiUs.prototype.searchNovels = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site).then(function (res) { return res.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, this.parseNovels(loadedCheerio, searchTerm)];
                }
            });
        });
    };
    return FaqWikiUs;
}());
exports.default = new FaqWikiUs();
