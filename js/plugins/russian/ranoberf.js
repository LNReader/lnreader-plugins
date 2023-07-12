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
const cheerio = require("cheerio");
const dayjs = require("dayjs");
const fetchApi = require("@libs/fetchApi").default;
const fetchFile = require("@libs/fetchFile").default;
const Status = require("@libs/novelStatus").default;
const FilterInputs = require("@libs/filterInputs").default;
const defaultCoverUri = "https://github.com/LNReader/lnreader-sources/blob/main/icons/src/coverNotAvailable.jpg?raw=true";
const pluginId = "RNRF";
const sourceName = "РанобэРФ";
const baseUrl = "https://ранобэ.рф";
function popularNovels(page, { showLatestNovels, filters }) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = baseUrl + "/books?order=";
        url += showLatestNovels ? "lastPublishedChapter" : (filters === null || filters === void 0 ? void 0 : filters.sort) || "popular";
        url += "&page=" + page;
        const result = yield fetchApi(url);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        let json = loadedCheerio("#__NEXT_DATA__").html();
        json = JSON.parse(json);
        let novels = [];
        json.props.pageProps.totalData.items.forEach((novel) => {
            var _a;
            return novels.push({
                name: novel.title,
                cover: ((_a = novel === null || novel === void 0 ? void 0 : novel.verticalImage) === null || _a === void 0 ? void 0 : _a.url)
                    ? baseUrl + novel.verticalImage.url
                    : defaultCoverUri,
                url: baseUrl + "/" + novel.slug,
            });
        });
        return novels;
    });
}
function parseNovelAndChapters(novelUrl) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield fetchApi(novelUrl);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        const json = loadedCheerio("#__NEXT_DATA__").html();
        const book = JSON.parse(json).props.pageProps.book;
        let novel = {
            url: novelUrl,
            name: book.title,
            cover: ((_a = book === null || book === void 0 ? void 0 : book.verticalImage) === null || _a === void 0 ? void 0 : _a.url)
                ? baseUrl + book.verticalImage.url
                : defaultCoverUri,
            summary: book.description,
            author: (book === null || book === void 0 ? void 0 : book.author) || "",
            genres: book.genres.map((item) => item.title).join(", "),
            status: book.additionalInfo.includes("Активен")
                ? Status.Ongoing
                : Status.Completed,
        };
        let chapters = [];
        book.chapters.forEach((chapter) => {
            if (!chapter.isDonate || chapter.isUserPaid) {
                chapters.push({
                    name: chapter.title,
                    releaseTime: dayjs(chapter.publishedAt).format("LLL"),
                    url: baseUrl + chapter.url,
                });
            }
        });
        novel.chapters = chapters.reverse();
        return novel;
    });
}
function parseChapter(chapterUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield fetchApi(chapterUrl);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        let json = loadedCheerio("#__NEXT_DATA__").html();
        json = JSON.parse(json);
        let temp = cheerio.load(json.props.pageProps.chapter.content.text);
        temp("img").each(function () {
            var _a;
            if (!((_a = loadedCheerio(this).attr("src")) === null || _a === void 0 ? void 0 : _a.startsWith("http"))) {
                const src = loadedCheerio(this).attr("src");
                loadedCheerio(this).attr("src", baseUrl + src);
            }
        });
        const chapterText = temp.html();
        return chapterText;
    });
}
function searchNovels(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${baseUrl}/v3/books?filter[or][0][title][like]=${searchTerm}&filter[or][1][titleEn][like]=${searchTerm}&filter[or][2][fullTitle][like]=${searchTerm}&filter[status][]=active&filter[status][]=abandoned&filter[status][]=completed&expand=verticalImage`;
        const result = yield fetchApi(url);
        const body = yield result.json();
        let novels = [];
        body.items.forEach((novel) => {
            var _a;
            return novels.push({
                name: novel.title,
                cover: ((_a = novel === null || novel === void 0 ? void 0 : novel.verticalImage) === null || _a === void 0 ? void 0 : _a.url)
                    ? baseUrl + novel.verticalImage.url
                    : defaultCoverUri,
                url: baseUrl + "/" + novel.slug,
            });
        });
        return novels;
    });
}
const filters = [
    {
        key: "sort",
        label: "Сортировка",
        values: [
            { label: "Рейтинг", value: "popular" },
            { label: "Дате добавления", value: "new" },
            { label: "Дате обновления", value: "lastPublishedChapter" },
            { label: "Законченные", value: "completed" },
        ],
        inputType: FilterInputs.Picker,
    },
];
module.exports = {
    id: pluginId,
    name: sourceName,
    site: baseUrl,
    version: "1.0.0",
    icon: "src/ru/ranoberf/icon.png",
    filters,
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};
