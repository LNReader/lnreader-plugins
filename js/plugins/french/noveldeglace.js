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
const cheerio_1 = __importDefault(require("cheerio"));
const fetch_1 = require("@libs/fetch");
const novelStatus_1 = require("@libs/novelStatus");
exports.id = "NDG.com";
exports.name = "NovelDeGlace";
exports.site = "https://noveldeglace.com/";
exports.version = "1.0.0";
exports.icon = "src/fr/noveldeglace/icon.png";
const pluginId = exports.id;
const baseUrl = exports.site;
const popularNovels = function (page) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = baseUrl + "roman";
        const result = yield (0, fetch_1.fetchApi)(url, {
            headers: { 'Accept-Encoding': 'deflate' },
        }, pluginId);
        const body = yield result.text();
        let loadedCheerio = cheerio_1.default.load(body);
        let novels = [];
        loadedCheerio("article").each(function () {
            const novelName = loadedCheerio(this).find("h2").text().trim();
            const novelCover = loadedCheerio(this).find("img").attr("src");
            const novelUrl = loadedCheerio(this).find("h2 > a").attr("href");
            if (!novelUrl)
                return;
            const novel = {
                name: novelName,
                cover: novelCover,
                url: novelUrl,
            };
            novels.push(novel);
        });
        return novels;
    });
};
exports.popularNovels = popularNovels;
const parseNovelAndChapters = function (novelUrl) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const url = novelUrl;
        const result = yield (0, fetch_1.fetchApi)(url, {
            headers: { 'Accept-Encoding': 'deflate' },
        }, pluginId);
        const body = yield result.text();
        let loadedCheerio = cheerio_1.default.load(body);
        let novel = { url };
        novel.name = ((_b = (_a = loadedCheerio("div.entry-content > div > strong")[0].nextSibling) === null || _a === void 0 ? void 0 : _a.nodeValue) === null || _b === void 0 ? void 0 : _b.trim()) || '';
        novel.cover = loadedCheerio(".su-row > div > div > img").attr("src");
        novel.summary = loadedCheerio("div[data-title=Synopsis]").text();
        novel.author = loadedCheerio("strong:contains('Auteur :')").parent().text().replace("Auteur : ", "").trim();
        // novel.artist = loadedCheerio("strong:contains('Illustrateur :')"
        // ).parent().text().replace("Illustrateur : ", "").trim();
        const categorie = loadedCheerio(".categorie")
            .text()
            .replace("Catégorie :", "")
            .trim();
        const genres = loadedCheerio(".genre")
            .text()
            .replace("Genre :", "")
            .replace(/, /g, ",")
            .trim();
        if (categorie && categorie != "Autre")
            novel.genres = categorie;
        if (genres)
            novel.genres = novel.genres ? novel.genres + "," + genres : genres;
        let status = loadedCheerio("strong:contains('Statut :')").parent().attr("class");
        switch (status) {
            case "type etat0":
                novel.status = novelStatus_1.NovelStatus.Ongoing;
                break;
            case "type etat1":
                novel.status = novelStatus_1.NovelStatus.Ongoing;
                break;
            case "type etat4":
                novel.status = novelStatus_1.NovelStatus.OnHiatus;
                break;
            case "type etat5":
                novel.status = novelStatus_1.NovelStatus.Completed;
                break;
            case "type etat6":
                novel.status = novelStatus_1.NovelStatus.Cancelled;
                break;
            default:
                novel.status = novelStatus_1.NovelStatus.Unknown;
                break;
        }
        let novelChapters = [];
        loadedCheerio(".chpt").each(function () {
            const chapterName = loadedCheerio(this).find("a").text().trim();
            const releaseDate = null;
            const chapterUrl = loadedCheerio(this).find("a").attr("href");
            if (!chapterUrl)
                return;
            const chapter = {
                name: chapterName,
                releaseTime: releaseDate,
                url: chapterUrl,
            };
            novelChapters.push(chapter);
        });
        novel.chapters = novelChapters;
        return novel;
    });
};
exports.parseNovelAndChapters = parseNovelAndChapters;
const parseChapter = function (chapterUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = chapterUrl;
        const result = yield (0, fetch_1.fetchApi)(url, {
            headers: { 'Accept-Encoding': 'deflate' },
        }, pluginId);
        const body = yield result.text();
        let loadedCheerio = cheerio_1.default.load(body);
        loadedCheerio(".mistape_caption").remove();
        let chapterText = loadedCheerio(".chapter-content").html();
        return chapterText;
    });
};
exports.parseChapter = parseChapter;
const searchNovels = function (searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = baseUrl + "roman";
        const result = yield (0, fetch_1.fetchApi)(url, {
            headers: { 'Accept-Encoding': 'deflate' },
        }, pluginId);
        const body = yield result.text();
        let loadedCheerio = cheerio_1.default.load(body);
        let novels = [];
        loadedCheerio("article").each(function () {
            const novelName = loadedCheerio(this).find("h2").text().trim();
            const novelCover = loadedCheerio(this).find("img").attr("src");
            const novelUrl = loadedCheerio(this).find("h2 > a").attr("href");
            if (!novelUrl)
                return;
            const novel = {
                name: novelName,
                cover: novelCover,
                url: novelUrl,
            };
            novels.push(novel);
        });
        novels = novels.filter((novel) => novel.name.toLowerCase().includes(searchTerm.toLowerCase()));
        return novels;
    });
};
exports.searchNovels = searchNovels;
exports.fetchImage = fetch_1.fetchFile;
