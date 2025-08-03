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
var BakaInUa = /** @class */ (function () {
    function BakaInUa() {
        this.id = 'bakainua';
        this.name = 'BakaInUA';
        this.icon = 'src/uk/bakainua/icon.png';
        this.site = 'https://baka.in.ua';
        this.version = '1.0.1';
    }
    BakaInUa.prototype.popularNovels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var novels, result, body, $;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        novels = [];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/fictions/alphabetical')];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        $ = (0, cheerio_1.load)(body);
                        $('#fiction-list > ol > li > div > div').each(function (index, elem) {
                            novels.push({
                                path: $(elem).find('a').attr('href'),
                                name: $(elem).find('a>h2').text(),
                                cover: _this.site + $(elem).find('a>div>div>div>img').attr('src'),
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    BakaInUa.prototype.parseNovel = function (novelUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var result, body, $, novel, chapters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/' + novelUrl)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        $ = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelUrl,
                            name: $('h2.text-xl.font-bold.text-stone-800.mb-2').text(),
                            author: $('button#fictions-author-search').text(),
                            cover: this.site +
                                $('div.from-stone-50.to-stone-100>div.relative>img').attr('src'),
                            summary: $('p.text-sm.leading-relaxed').text(),
                            status: $('div.bg-stone-100:nth-child(3)>p:nth-child(2)').text(),
                        };
                        chapters = [];
                        $('li.group')
                            .find('a')
                            .each(function (index, elem) {
                            var chapter = {
                                name: $(elem).find('div>div>span:nth-child(2)').text().trim(),
                                path: $(elem).attr('href'),
                                chapterNumber: index + 1,
                            };
                            chapters.push(chapter);
                        });
                        novel.chapters = chapters.reverse();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    BakaInUa.prototype.parseChapter = function (chapterUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var result, body, $;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/' + chapterUrl)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        $ = (0, cheerio_1.load)(body);
                        return [2 /*return*/, $('#user-content').html()];
                }
            });
        });
    };
    BakaInUa.prototype.searchNovels = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var novels, result, body, $;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        novels = [];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/search?search%5B%5D=' + searchTerm)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        $ = (0, cheerio_1.load)(body);
                        $('ul>section>div>div').each(function (index, elem) {
                            novels.push({
                                path: $(elem).find('div:nth-child(2)>a').attr('href'),
                                name: $(elem).find('div:nth-child(2)>a').text().trim(),
                                cover: _this.site + $(elem).find('div:nth-child(1)>img').attr('src'),
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return BakaInUa;
}());
exports.default = new BakaInUa();
