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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchImage = exports.searchNovels = exports.parseChapter = exports.parseNovelAndChapters = exports.popularNovels = exports.icon = exports.version = exports.site = exports.name = exports.id = void 0;
var cheerio_1 = require("cheerio");
var fetch_1 = require("@libs/fetch");
var dayjs_1 = __importDefault(require("dayjs"));
exports.id = "comrademao";
exports.name = "Comrade Mao";
exports.site = "https://comrademao.com/";
exports.version = "1.0.0";
exports.icon = "src/en/comrademao/icon.png";
var popularNovels = function (page) {
    return __awaiter(this, void 0, void 0, function () {
        var url, result, body, loadedCheerio, novels;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = exports.site + "page/" + page + "/?post_type=novel";
                    return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, result.text()];
                case 2:
                    body = _a.sent();
                    loadedCheerio = (0, cheerio_1.load)(body);
                    novels = [];
                    loadedCheerio(".listupd")
                        .find("div.bs")
                        .each(function () {
                        var novelName = loadedCheerio(this).find(".tt").text().trim();
                        var novelCover = loadedCheerio(this).find("img").attr("src");
                        var novelUrl = loadedCheerio(this).find("a").attr("href");
                        if (!novelUrl) {
                            // TODO: Handle error
                            console.error("No novel url!");
                            return;
                        }
                        var novel = {
                            name: novelName,
                            cover: novelCover,
                            url: novelUrl,
                        };
                        novels.push(novel);
                    });
                    return [2 /*return*/, novels];
            }
        });
    });
};
exports.popularNovels = popularNovels;
var parseNovelAndChapters = function (novelUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var url, result, body, loadedCheerio, novel, novelChapters;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = novelUrl;
                    return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, result.text()];
                case 2:
                    body = _a.sent();
                    loadedCheerio = (0, cheerio_1.load)(body);
                    novel = { url: url };
                    novel.name = loadedCheerio(".entry-title").text().trim();
                    novel.cover = loadedCheerio("div.thumbook > div > img").attr("src");
                    novel.summary = loadedCheerio("div.infox > div:nth-child(6) > span > p")
                        .text()
                        .trim();
                    novel.genres = loadedCheerio("div.infox > div:nth-child(4) > span")
                        .text()
                        .replace(/\s/g, "");
                    novel.status = loadedCheerio("div.infox > div:nth-child(3) > span")
                        .text()
                        .trim();
                    novel.author = loadedCheerio("div.infox > div:nth-child(2) > span")
                        .text()
                        .trim();
                    novelChapters = [];
                    loadedCheerio("#chapterlist")
                        .find("li")
                        .each(function () {
                        var releaseDate = (0, dayjs_1.default)(loadedCheerio(this).find(".chapterdate").text()).format("LL");
                        var chapterName = loadedCheerio(this)
                            .find(".chapternum")
                            .text();
                        var chapterUrl = loadedCheerio(this).find("a").attr("href");
                        if (!chapterUrl) {
                            // TODO: Handle error
                            console.error("No chapter url!");
                            return;
                        }
                        novelChapters.push({
                            name: chapterName,
                            url: chapterUrl,
                            releaseTime: releaseDate,
                        });
                    });
                    novel.chapters = novelChapters.reverse();
                    return [2 /*return*/, novel];
            }
        });
    });
};
exports.parseNovelAndChapters = parseNovelAndChapters;
var parseChapter = function (chapterUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var url, result, err, body, loadedCheerio, chapterText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = chapterUrl;
                    return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                case 1:
                    result = _a.sent();
                    if (!!result.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, result.text()];
                case 2:
                    err = _a.sent();
                    console.error(err);
                    // TODO: Cloudflare protection or other error
                    return [2 /*return*/, "Error!" + err];
                case 3: return [4 /*yield*/, result.text()];
                case 4:
                    body = _a.sent();
                    loadedCheerio = (0, cheerio_1.load)(body);
                    chapterText = loadedCheerio("#chaptercontent").html();
                    return [2 /*return*/, chapterText];
            }
        });
    });
};
exports.parseChapter = parseChapter;
var searchNovels = function (searchTerm) {
    return __awaiter(this, void 0, void 0, function () {
        var url, result, body, loadedCheerio, novels;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = exports.site + "?s=" + searchTerm + "&post_type=novel";
                    return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, result.text()];
                case 2:
                    body = _a.sent();
                    loadedCheerio = (0, cheerio_1.load)(body);
                    novels = [];
                    loadedCheerio(".listupd")
                        .find("div.bs")
                        .each(function () {
                        var novelName = loadedCheerio(this).find(".tt").text().trim();
                        var novelCover = loadedCheerio(this).find("img").attr("src");
                        var novelUrl = loadedCheerio(this).find("a").attr("href");
                        if (!novelUrl) {
                            // TODO: Handle error
                            console.error("No novel url!");
                            return;
                        }
                        var novel = {
                            name: novelName,
                            cover: novelCover,
                            url: novelUrl,
                        };
                        novels.push(novel);
                    });
                    return [2 /*return*/, novels];
            }
        });
    });
};
exports.searchNovels = searchNovels;
var fetchImage = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return fetch_1.fetchFile.apply(void 0, args);
};
exports.fetchImage = fetchImage;
