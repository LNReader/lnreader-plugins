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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchImage = exports.searchNovels = exports.parseChapter = exports.parseNovelAndChapters = exports.popularNovels = exports.icon = exports.version = exports.site = exports.name = exports.id = void 0;
const cheerio_1 = require("cheerio");
const fetchApi_1 = __importDefault(require("@libs/fetchApi"));
const defaultCover_1 = __importDefault(require("@libs/defaultCover"));
const fetchFile_1 = __importDefault(require("@libs/fetchFile"));
const novelStatus_1 = __importDefault(require("@libs/novelStatus"));
exports.id = "BLN.com";
exports.name = "BestLightNovel";
exports.site = "https://bestlightnovel.com/";
exports.version = "1.0.0";
exports.icon = "src/en/bestlightnovel/icon.png";
const popularNovels = function (page) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = exports.site + "novel_list?type=topview&category=all&state=all&page=1" + page;
        const result = yield (0, fetchApi_1.default)(url);
        if (!result.ok) {
            console.error(yield result.text());
            // TODO: Cloudflare protection or other error
            return [];
        }
        const body = yield result.text();
        const loadedCheerio = (0, cheerio_1.load)(body);
        let novels = [];
        loadedCheerio(".update_item.list_category").each(function () {
            const novelName = loadedCheerio(this).find("h3 > a").text();
            const novelCover = loadedCheerio(this).find("img").attr("src");
            const novelUrl = loadedCheerio(this).find("h3 > a").attr("href");
            if (!novelUrl) {
                // TODO: Handle error
                console.error("No novel url!");
                return;
            }
            const novel = {
                name: novelName,
                url: novelUrl,
                cover: novelCover,
            };
            novels.push(novel);
        });
        return novels;
    });
};
exports.popularNovels = popularNovels;
const parseNovelAndChapters = function (novelUrl) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const url = novelUrl;
        const result = yield (0, fetchApi_1.default)(url);
        if (!result.ok) {
            console.error(yield result.text());
            // TODO: Cloudflare protection
            return { url, chapters: [] };
        }
        const body = yield result.text();
        let loadedCheerio = (0, cheerio_1.load)(body);
        let novel = {
            url,
            name: "",
            cover: "",
            author: "",
            status: novelStatus_1.default.Unknown,
            genres: "",
            summary: "",
            chapters: [],
        };
        novel.name = loadedCheerio(".truyen_info_right  h1").text().trim();
        novel.cover =
            loadedCheerio(".info_image img").attr("src") || defaultCover_1.default;
        novel.summary = (_a = loadedCheerio("#noidungm").text()) === null || _a === void 0 ? void 0 : _a.trim();
        novel.author = (_b = loadedCheerio("#main_body > div.cotgiua > div.truyen_info_wrapper > div.truyen_info > div.entry-header > div.truyen_if_wrap > ul > li:nth-child(2) > a")
            .text()) === null || _b === void 0 ? void 0 : _b.trim();
        let status = (_c = loadedCheerio("#main_body > div.cotgiua > div.truyen_info_wrapper > div.truyen_info > div.entry-header > div.truyen_if_wrap > ul > li:nth-child(4) > a")
            .text()) === null || _c === void 0 ? void 0 : _c.trim();
        novel.status =
            status === "ONGOING"
                ? novelStatus_1.default.Ongoing
                : status === "COMPLETED"
                    ? novelStatus_1.default.Completed
                    : novelStatus_1.default.Unknown;
        let novelChapters = [];
        loadedCheerio(".chapter-list div.row").each(function () {
            const chapterName = loadedCheerio(this).find("a").text().trim();
            const releaseDate = loadedCheerio(this)
                .find("span:nth-child(2)")
                .text()
                .trim();
            const chapterUrl = loadedCheerio(this).find("a").attr("href");
            if (!chapterUrl) {
                // TODO: Handle error
                console.error("No chapter url!");
                return;
            }
            novelChapters.push({
                name: chapterName,
                releaseTime: releaseDate,
                url: chapterUrl,
            });
        });
        novel.chapters = novelChapters.reverse();
        return novel;
    });
};
exports.parseNovelAndChapters = parseNovelAndChapters;
const parseChapter = function (chapterUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = chapterUrl;
        const result = yield (0, fetchApi_1.default)(url);
        const body = yield result.text();
        let loadedCheerio = (0, cheerio_1.load)(body);
        const chapterText = loadedCheerio("#vung_doc").html();
        return chapterText;
    });
};
exports.parseChapter = parseChapter;
const searchNovels = function (searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${exports.site}search_novels/${searchTerm}`;
        const result = yield (0, fetchApi_1.default)(url);
        const body = yield result.text();
        let loadedCheerio = (0, cheerio_1.load)(body);
        let novels = [];
        loadedCheerio(".update_item.list_category").each(function () {
            const novelName = loadedCheerio(this).find("h3 > a").text();
            const novelCover = loadedCheerio(this).find("img").attr("src");
            const novelUrl = loadedCheerio(this).find("h3 > a").attr("href");
            if (!novelUrl) {
                // TODO: Handle error
                console.error("No novel url!");
                return;
            }
            const novel = { name: novelName, cover: novelCover, url: novelUrl };
            novels.push(novel);
        });
        return novels;
    });
};
exports.searchNovels = searchNovels;
const fetchImage = (...args) => (0, fetchFile_1.default)(...args);
exports.fetchImage = fetchImage;
exports.protected = false;
