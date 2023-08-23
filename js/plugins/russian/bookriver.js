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
exports.filters = exports.fetchImage = exports.searchNovels = exports.parseChapter = exports.parseNovelAndChapters = exports.popularNovels = exports.icon = exports.version = exports.site = exports.name = exports.id = void 0;
const filterInputs_1 = require("@libs/filterInputs");
const fetch_1 = require("@libs/fetch");
const novelStatus_1 = require("@libs/novelStatus");
const cheerio_1 = require("cheerio");
const dayjs_1 = __importDefault(require("dayjs"));
exports.id = "bookriver";
exports.name = "Bookriver";
exports.site = "https://bookriver.ru";
exports.version = "1.0.0";
exports.icon = "src/ru/bookriver/icon.png";
const baseUrl = exports.site;
const popularNovels = function (page, { showLatestNovels, filters }) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = baseUrl + `/genre?page=${page}&perPage=24&sortingType=`;
        url += showLatestNovels ? "last-update" : (filters === null || filters === void 0 ? void 0 : filters.sort) || "bestseller";
        if (filters) {
            if (Array.isArray(filters.genres) && filters.genres.length) {
                url += "&g=" + filters.genres.join(",");
            }
        }
        const result = yield (0, fetch_1.fetchApi)(url);
        const body = yield result.text();
        const loadedCheerio = (0, cheerio_1.load)(body);
        let json = loadedCheerio("#__NEXT_DATA__").html();
        json = JSON.parse(json);
        let novels = [];
        json.props.pageProps.state.pagesFilter.genre.books.forEach((novel) => novels.push({
            name: novel.name,
            cover: novel.coverImages[0].url,
            url: baseUrl + "/book/" + novel.slug,
        }));
        return novels;
    });
};
exports.popularNovels = popularNovels;
const parseNovelAndChapters = function (novelUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, fetch_1.fetchApi)(novelUrl);
        const body = yield result.text();
        const loadedCheerio = (0, cheerio_1.load)(body);
        const json = loadedCheerio("#__NEXT_DATA__").html();
        const book = JSON.parse(json).props.pageProps.state.book.bookPage;
        let novel = {
            url: novelUrl,
            name: book.name,
            cover: book.coverImages[0].url,
            summary: book.annotation,
            author: book.author.name,
            genres: book.tags.map((item) => item.name).join(", "),
            status: book.statusComplete === "writing"
                ? novelStatus_1.NovelStatus.Ongoing
                : novelStatus_1.NovelStatus.Completed,
        };
        let chapters = [];
        book.ebook.chapters.forEach((chapter) => {
            if (chapter.available) {
                chapters.push({
                    name: chapter.name,
                    releaseTime: (0, dayjs_1.default)((chapter === null || chapter === void 0 ? void 0 : chapter.firstPublishedAt) || chapter.createdAt).format("LLL"),
                    url: baseUrl + "/reader/" + book.slug + "/" + chapter.chapterId,
                });
            }
        });
        novel.chapters = chapters;
        return novel;
    });
};
exports.parseNovelAndChapters = parseNovelAndChapters;
const parseChapter = function (chapterUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = "https://api.bookriver.ru/api/v1/books/chapter/text/";
        const result = yield (0, fetch_1.fetchApi)(url + chapterUrl.split("/").pop());
        const json = (yield result.json());
        const chapterText = json.data.content;
        return chapterText;
    });
};
exports.parseChapter = parseChapter;
const searchNovels = function (searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${baseUrl}/search/books?keyword=${searchTerm}`;
        const result = yield (0, fetch_1.fetchApi)(url);
        const body = yield result.text();
        const loadedCheerio = (0, cheerio_1.load)(body);
        let json = loadedCheerio("#__NEXT_DATA__").html();
        json = JSON.parse(json);
        let novels = [];
        json.props.pageProps.state.catalog.books.books.forEach((novel) => novels.push({
            name: novel.name,
            cover: novel.coverImages[0].url,
            url: baseUrl + "/book/" + novel.slug,
        }));
        return novels;
    });
};
exports.searchNovels = searchNovels;
exports.fetchImage = fetch_1.fetchFile;
exports.filters = [
    {
        key: "sort",
        label: "Сортировка",
        values: [
            { label: "Бестселлеры", value: "bestseller" },
            { label: "Дате добавления", value: "newest" },
            { label: "Дате обновления", value: "last-update" },
        ],
        inputType: filterInputs_1.FilterInputs.Picker,
    },
    {
        key: "genres",
        label: "жанры",
        values: [
            {
                label: "Альтернативная история",
                value: "alternativnaya-istoriya",
            },
            { label: "Боевая фантастика", value: "boevaya-fantastika" },
            { label: "Боевое фэнтези", value: "boevoe-fentezi" },
            { label: "Бытовое фэнтези", value: "bytovoe-fentezi" },
            {
                label: "Героическая фантастика",
                value: "geroicheskaya-fantastika",
            },
            { label: "Героическое фэнтези", value: "geroicheskoe-fentezi" },
            { label: "Городское фэнтези", value: "gorodskoe-fentezi" },
            { label: "Детектив", value: "detektiv" },
            {
                label: "Детективная фантастика",
                value: "detektivnaya-fantastika",
            },
            { label: "Жёсткая эротика", value: "zhyostkaya-erotika" },
            { label: "Исторический детектив", value: "istoricheskii-detektiv" },
            {
                label: "Исторический любовный роман",
                value: "istoricheskii-lyubovnyi-roman",
            },
            { label: "Историческое фэнтези", value: "istoricheskoe-fentezi" },
            { label: "Киберпанк", value: "kiberpank" },
            { label: "Классический детектив", value: "klassicheskii-detektiv" },
            {
                label: "Короткий любовный роман",
                value: "korotkii-lyubovnyi-roman",
            },
            {
                label: "Космическая фантастика",
                value: "kosmicheskaya-fantastika",
            },
            { label: "Криминальный детектив", value: "kriminalnyi-detektiv" },
            { label: "ЛитРПГ", value: "litrpg" },
            { label: "Любовная фантастика", value: "lyubovnaya-fantastika" },
            { label: "Любовное фэнтези", value: "lyubovnoe-fentezi" },
            { label: "Любовный роман", value: "lyubovnyi-roman" },
            { label: "Мистика", value: "mistika" },
            { label: "Молодежная проза", value: "molodezhnaya-proza" },
            { label: "Научная фантастика", value: "nauchnaya-fantastika" },
            {
                label: "Остросюжетный любовный роман",
                value: "ostrosyuzhetnyi-lyubovnyi-roman",
            },
            { label: "Политический детектив", value: "politicheskii-detektiv" },
            { label: "Попаданцы", value: "popadantsy" },
            { label: "Постапокалипсис", value: "postapokalipsis" },
            {
                label: "Приключенческое фэнтези",
                value: "priklyuchencheskoe-fentezi",
            },
            {
                label: "Романтическая эротика",
                value: "romanticheskaya-erotika",
            },
            { label: "С элементами эротики", value: "s-elementami-erotiki" },
            { label: "Славянское фэнтези", value: "slavyanskoe-fentezi" },
            {
                label: "Современный любовный роман",
                value: "sovremennyi-lyubovnyi-roman",
            },
            { label: "Социальная фантастика", value: "sotsialnaya-fantastika" },
            { label: "Тёмное фэнтези", value: "temnoe-fentezi" },
            { label: "Фантастика", value: "fantastika" },
            { label: "Фэнтези", value: "fentezi" },
            { label: "Шпионский детектив", value: "shpionskii-detektiv" },
            { label: "Эпическое фэнтези", value: "epicheskoe-fentezi" },
            { label: "Эротика", value: "erotika" },
            {
                label: "Эротическая фантастика",
                value: "eroticheskaya-fantastika",
            },
            { label: "Эротический фанфик", value: "eroticheskii-fanfik" },
            { label: "Эротическое фэнтези", value: "eroticheskoe-fentezi" },
            {
                label: "Юмористический детектив",
                value: "yumoristicheskii-detektiv",
            },
            {
                label: "Юмористическое фэнтези",
                value: "yumoristicheskoe-fentezi",
            },
        ],
        inputType: filterInputs_1.FilterInputs.Checkbox,
    },
];
