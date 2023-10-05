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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchImage = exports.filters = exports.searchNovels = exports.parseChapter = exports.parseNovelAndChapters = exports.popularNovels = exports.icon = exports.version = exports.site = exports.name = exports.id = void 0;
const filterInputs_1 = require("@libs/filterInputs");
const fetch_1 = require("@libs/fetch");
const novelStatus_1 = require("@libs/novelStatus");
const cheerio_1 = require("cheerio");
const defaultCover_1 = require("@libs/defaultCover");
exports.id = "ficbook";
exports.name = "ficbook";
exports.site = "https://ficbook.net";
exports.version = "1.0.0";
exports.icon = "src/ru/ficbook/icon.png";
const popularNovels = function (page, { showLatestNovels, filters }) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = exports.site;
        if (filters === null || filters === void 0 ? void 0 : filters.directions) {
            url += "/popular/" + filters.directions;
        }
        else {
            url += "/" + ((filters === null || filters === void 0 ? void 0 : filters.sort) || "fanfiction") + "?p=" + page;
        }
        const result = yield fetch(url);
        const body = yield result.text();
        const loadedCheerio = (0, cheerio_1.load)(body);
        const novels = [];
        loadedCheerio("article.fanfic-inline").each(function () {
            const name = loadedCheerio(this).find("h3 > a").text().trim();
            let cover = loadedCheerio(this).find("picture > img").attr("src");
            const url = loadedCheerio(this).find("h3 > a").attr("href");
            cover = cover
                ? cover.replace(/covers\/m_|covers\/d_/g, "covers/")
                : defaultCover_1.defaultCover;
            if (!name || !url)
                return;
            novels.push({ name, cover, url: exports.site + url.replace(/\?.*/g, "") });
        });
        return novels;
    });
};
exports.popularNovels = popularNovels;
const parseNovelAndChapters = function (novelUrl) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield fetch(novelUrl);
        const body = yield result.text();
        const loadedCheerio = (0, cheerio_1.load)(body);
        const novel = {
            url: novelUrl,
        };
        novel.name = (loadedCheerio('h1[itemprop="headline"]').text() ||
            loadedCheerio('h1[itemprop="name"]').text()).trim();
        novel.cover = loadedCheerio('meta[property="og:image"]').attr("content");
        novel.summary = loadedCheerio('div[itemprop="description"]').text().trim();
        novel.author = loadedCheerio('a[itemprop="author"]').text();
        novel.status =
            loadedCheerio("div.fanfic-main-info > section:nth-child(3) > div:nth-child(3) > span:nth-child(2)").text() === "В процессе"
                ? novelStatus_1.NovelStatus.Ongoing
                : novelStatus_1.NovelStatus.Completed;
        const tags = loadedCheerio('div[class="tags"] > a')
            .map((index, element) => loadedCheerio(element).text())
            .get();
        if (tags) {
            novel.genres = tags.join(",");
        }
        if (!novel.cover || ((_a = novel.cover) === null || _a === void 0 ? void 0 : _a.includes("/design/"))) {
            novel.cover = defaultCover_1.defaultCover;
        }
        else {
            novel.cover = novel.cover.replace(/covers\/m_|covers\/d_/g, "covers/");
        }
        const chapters = [];
        if (loadedCheerio("#content").length == 1) {
            const name = loadedCheerio(".title-area > h2").text();
            const releaseTime = loadedCheerio(".part-date > span").attr("title");
            if (name)
                chapters.push({ name, releaseTime, url: novelUrl });
        }
        else {
            loadedCheerio("li.part").each(function () {
                const name = loadedCheerio(this).find("h3").text();
                const releaseTime = loadedCheerio(this)
                    .find("div > span")
                    .attr("title");
                const url = loadedCheerio(this).find("a:nth-child(1)").attr("href");
                if (!name || !url)
                    return;
                chapters.push({ name, releaseTime, url: exports.site + url });
            });
        }
        novel.chapters = chapters;
        return novel;
    });
};
exports.parseNovelAndChapters = parseNovelAndChapters;
const parseChapter = function (chapterUrl) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield fetch(chapterUrl);
        const body = yield result.text();
        const loadedCheerio = (0, cheerio_1.load)(body);
        let chapterText = "";
        (_b = (_a = loadedCheerio("#content").text()) === null || _a === void 0 ? void 0 : _a.split("\n")) === null || _b === void 0 ? void 0 : _b.forEach((line) => {
            if (line.trim()) {
                chapterText += "<p>" + line + "</p>";
            }
            else {
                chapterText += "<br>";
            }
        });
        return chapterText;
    });
};
exports.parseChapter = parseChapter;
const searchNovels = function (searchTerm) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const formData = new FormData();
        formData.append("term", searchTerm);
        formData.append("page", "1");
        const result = yield fetch(exports.site + "/search/fanfic", {
            method: "POST",
            body: formData,
        });
        const json = (yield result.json());
        const novels = [];
        (_b = (_a = json.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.forEach((novel) => {
            const name = novel.title.trim();
            const url = exports.site + "/readfic/" + novel.slug;
            const cover = novel.cover
                ? "https://images.ficbook.net/fanfic-covers/" + novel.cover
                : defaultCover_1.defaultCover;
            novels.push({ name, cover, url });
        });
        return novels;
    });
};
exports.searchNovels = searchNovels;
exports.filters = [
    {
        key: "sort",
        label: "Сортировка",
        values: [
            { label: "Горячие работы", value: "fanfiction" },
            { label: "Популярные ", value: "popular" },
        ],
        inputType: filterInputs_1.FilterInputs.Picker,
    },
    {
        key: "directions",
        label: "Направление",
        values: [
            { label: "Гет", value: "het" },
            { label: "Джен", value: "gen" },
            { label: "Другие виды отношений", value: "other" },
            { label: "Слэш", value: "slash-fanfics" },
            { label: "Смешанная", value: "mixed" },
            { label: "Статья", value: "article" },
            { label: "Фемслэш", value: "femslash-fanfics" },
        ],
        inputType: filterInputs_1.FilterInputs.Picker,
    },
];
exports.fetchImage = fetch_1.fetchFile;
