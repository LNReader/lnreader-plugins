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
var MTLReader = /** @class */ (function () {
    function MTLReader() {
        this.id = 'mtlreader';
        this.name = 'MTL Reader';
        this.version = '1.0.1';
        this.icon = 'src/en/mtlreader/icon.png';
        this.site = 'https://mtlreader.com/';
    }
    MTLReader.prototype.parseNovels = function (loadedCheerio) {
        var _this = this;
        var novels = [];
        loadedCheerio('.col-md-4').each(function (i, el) {
            var novelName = loadedCheerio(el).find('h5').text();
            var novelCover = loadedCheerio(el).find('img').attr('src');
            var novelUrl = loadedCheerio(el).find('h5 > a').attr('href');
            if (!novelUrl)
                return;
            var novel = {
                name: novelName,
                cover: novelCover,
                path: novelUrl.replace(_this.site, ''),
            };
            novels.push(novel);
        });
        return novels;
    };
    MTLReader.prototype.popularNovels = function (pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, body, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "novels?page=").concat(pageNo);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        return [2 /*return*/, this.parseNovels(loadedCheerio)];
                }
            });
        });
    };
    MTLReader.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, novel, chapter;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('.agent-title').text().trim() || 'Untitled',
                            cover: loadedCheerio('.agent-p-img > img').attr('src'),
                            summary: loadedCheerio('#editdescription').text().trim(),
                            chapters: [],
                        };
                        novel.author = loadedCheerio('i.fa-user')
                            .parent()
                            .text()
                            .replace('Author: ', '')
                            .trim();
                        chapter = [];
                        loadedCheerio('tr.spaceUnder').each(function (i, el) {
                            var chapterName = loadedCheerio(el).find('a').text().trim();
                            var chapterUrl = loadedCheerio(el).find('a').attr('href');
                            if (!chapterUrl)
                                return;
                            chapter.push({
                                name: chapterName,
                                path: chapterUrl.replace(_this.site, ''),
                            });
                        });
                        novel.chapters = chapter;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    MTLReader.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        loadedCheerio('.container ins,script,p.mtlreader').remove();
                        chapterText = loadedCheerio('.container').html() || '';
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    MTLReader.prototype.searchNovels = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var body, tokenCheerio, token, searchUrl, seacrhBody, loadedCheerio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        tokenCheerio = (0, cheerio_1.load)(body);
                        token = tokenCheerio('input[name="_token"]').attr('value');
                        searchUrl = "".concat(this.site, "search?_token=").concat(token, "&input=").concat(encodeURIComponent(searchTerm));
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(searchUrl).then(function (r) { return r.text(); })];
                    case 2:
                        seacrhBody = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(seacrhBody);
                        return [2 /*return*/, this.parseNovels(loadedCheerio)];
                }
            });
        });
    };
    return MTLReader;
}());
exports.default = new MTLReader();
