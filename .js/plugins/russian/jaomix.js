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
Object.defineProperty(exports, "__esModule", { value: true });
var filterInputs_1 = require("@libs/filterInputs");
var fetch_1 = require("@libs/fetch");
var novelStatus_1 = require("@libs/novelStatus");
var cheerio_1 = require("cheerio");
var Jaomix = /** @class */ (function () {
    function Jaomix() {
        this.id = "jaomix.ru";
        this.name = "Jaomix";
        this.site = "https://jaomix.ru";
        this.version = "1.0.0";
        this.icon = "src/ru/jaomix/icon.png";
        this.userAgent = "";
        this.cookieString = "";
        this.fetchImage = fetch_1.fetchFile;
        this.filters = [
            {
                key: "sortby",
                label: "Сортировка:",
                values: [
                    { label: "Топ недели", value: "topweek" },
                    { label: "По алфавиту", value: "alphabet" },
                    { label: "По дате обновления", value: "upd" },
                    { label: "По дате создания", value: "new" },
                    { label: "По просмотрам", value: "count" },
                    { label: "Топ года", value: "topyear" },
                    { label: "Топ дня", value: "topday" },
                    { label: "Топ за все время", value: "alltime" },
                    { label: "Топ месяца", value: "topmonth" },
                ],
                inputType: filterInputs_1.FilterInputs.Picker,
            },
            {
                key: "sortdaycreate",
                label: "Дата добавления:",
                values: [
                    { label: "Любое", value: "1" },
                    { label: "От 120 до 180 дней", value: "1218" },
                    { label: "От 180 до 365 дней", value: "1836" },
                    { label: "От 30 до 60 дней", value: "3060" },
                    { label: "От 365 дней", value: "365" },
                    { label: "От 60 до 90 дней", value: "6090" },
                    { label: "От 90 до 120 дней", value: "9012" },
                    { label: "Послед. 30 дней", value: "30" },
                ],
                inputType: filterInputs_1.FilterInputs.Picker,
            },
            {
                key: "sortcountchapt",
                label: "Количество глав:",
                values: [
                    { label: "Любое кол-во глав", value: "1" },
                    { label: "До 500", value: "500" },
                    { label: "От 1000 до 2000", value: "1020" },
                    { label: "От 2000 до 3000", value: "2030" },
                    { label: "От 3000 до 4000", value: "3040" },
                    { label: "От 4000", value: "400" },
                    { label: "От 500 до 1000", value: "510" },
                ],
                inputType: filterInputs_1.FilterInputs.Picker,
            },
            {
                key: "genre",
                label: "Жанры:",
                values: [
                    { label: "Боевые Искусства", value: "Боевые Искусства" },
                    { label: "Виртуальный Мир", value: "Виртуальный Мир" },
                    { label: "Гарем", value: "Гарем" },
                    { label: "Детектив", value: "Детектив" },
                    { label: "Драма", value: "Драма" },
                    { label: "Игра", value: "Игра" },
                    { label: "Истории из жизни", value: "Истории из жизни" },
                    { label: "Исторический", value: "Исторический" },
                    { label: "История", value: "История" },
                    { label: "Исэкай", value: "Исэкай" },
                    { label: "Комедия", value: "Комедия" },
                    { label: "Меха", value: "Меха" },
                    { label: "Мистика", value: "Мистика" },
                    { label: "Научная Фантастика", value: "Научная Фантастика" },
                    { label: "Повседневность", value: "Повседневность" },
                    { label: "Постапокалипсис", value: "Постапокалипсис" },
                    { label: "Приключения", value: "Приключения" },
                    { label: "Психология", value: "Психология" },
                    { label: "Романтика", value: "Романтика" },
                    { label: "Сверхъестественное", value: "Сверхъестественное" },
                    { label: "Сёнэн", value: "Сёнэн" },
                    { label: "Сёнэн-ай", value: "Сёнэн-ай" },
                    { label: "Спорт", value: "Спорт" },
                    { label: "Сэйнэн", value: "Сэйнэн" },
                    { label: "Сюаньхуа", value: "Сюаньхуа" },
                    { label: "Трагедия", value: "Трагедия" },
                    { label: "Триллер", value: "Триллер" },
                    { label: "Фантастика", value: "Фантастика" },
                    { label: "Фэнтези", value: "Фэнтези" },
                    { label: "Хоррор", value: "Хоррор" },
                    { label: "Школьная жизнь", value: "Школьная жизнь" },
                    { label: "Шоунен", value: "Шоунен" },
                    { label: "Экшн", value: "Экшн" },
                    { label: "Этти", value: "Этти" },
                    { label: "Юри", value: "Юри" },
                    { label: "Adult", value: "Adult" },
                    { label: "Ecchi", value: "Ecchi" },
                    { label: "Josei", value: "Josei" },
                    { label: "Lolicon", value: "Lolicon" },
                    { label: "Mature", value: "Mature" },
                    { label: "Shoujo", value: "Shoujo" },
                    { label: "Wuxia", value: "Wuxia" },
                    { label: "Xianxia", value: "Xianxia" },
                    { label: "Xuanhuan", value: "Xuanhuan" },
                    { label: "Yaoi", value: "Yaoi" },
                ],
                inputType: filterInputs_1.FilterInputs.Checkbox,
            },
            {
                key: "delgenre",
                label: "Исключить жанры:",
                values: [
                    { label: "Боевые Искусства", value: "Боевые Искусства" },
                    { label: "Виртуальный Мир", value: "Виртуальный Мир" },
                    { label: "Гарем", value: "Гарем" },
                    { label: "Детектив", value: "Детектив" },
                    { label: "Драма", value: "Драма" },
                    { label: "Игра", value: "Игра" },
                    { label: "Истории из жизни", value: "Истории из жизни" },
                    { label: "Исторический", value: "Исторический" },
                    { label: "История", value: "История" },
                    { label: "Исэкай", value: "Исэкай" },
                    { label: "Комедия", value: "Комедия" },
                    { label: "Меха", value: "Меха" },
                    { label: "Мистика", value: "Мистика" },
                    { label: "Научная Фантастика", value: "Научная Фантастика" },
                    { label: "Повседневность", value: "Повседневность" },
                    { label: "Постапокалипсис", value: "Постапокалипсис" },
                    { label: "Приключения", value: "Приключения" },
                    { label: "Психология", value: "Психология" },
                    { label: "Романтика", value: "Романтика" },
                    { label: "Сверхъестественное", value: "Сверхъестественное" },
                    { label: "Сёнэн", value: "Сёнэн" },
                    { label: "Сёнэн-ай", value: "Сёнэн-ай" },
                    { label: "Спорт", value: "Спорт" },
                    { label: "Сэйнэн", value: "Сэйнэн" },
                    { label: "Сюаньхуа", value: "Сюаньхуа" },
                    { label: "Трагедия", value: "Трагедия" },
                    { label: "Триллер", value: "Триллер" },
                    { label: "Фантастика", value: "Фантастика" },
                    { label: "Фэнтези", value: "Фэнтези" },
                    { label: "Хоррор", value: "Хоррор" },
                    { label: "Школьная жизнь", value: "Школьная жизнь" },
                    { label: "Шоунен", value: "Шоунен" },
                    { label: "Экшн", value: "Экшн" },
                    { label: "Этти", value: "Этти" },
                    { label: "Юри", value: "Юри" },
                    { label: "Adult", value: "Adult" },
                    { label: "Ecchi", value: "Ecchi" },
                    { label: "Josei", value: "Josei" },
                    { label: "Lolicon", value: "Lolicon" },
                    { label: "Mature", value: "Mature" },
                    { label: "Shoujo", value: "Shoujo" },
                    { label: "Wuxia", value: "Wuxia" },
                    { label: "Xianxia", value: "Xianxia" },
                    { label: "Xuanhuan", value: "Xuanhuan" },
                    { label: "Yaoi", value: "Yaoi" },
                ],
                inputType: filterInputs_1.FilterInputs.Checkbox,
            },
            {
                key: "lang",
                label: "Выбрать языки:",
                values: [
                    { label: "Английский", value: "Английский" },
                    { label: "Китайский", value: "Китайский" },
                    { label: "Корейский", value: "Корейский" },
                    { label: "Японский", value: "Японский" },
                ],
                inputType: filterInputs_1.FilterInputs.Checkbox,
            },
        ];
    }
    Jaomix.prototype.popularNovels = function (pageNo, _a) {
        var showLatestNovels = _a.showLatestNovels, filters = _a.filters;
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, novels;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = this.site + "/?searchrn";
                        if ((filters === null || filters === void 0 ? void 0 : filters.lang) instanceof Array) {
                            url += filters.lang.map(function (lang, idx) { return "&lang[".concat(idx, "]=").concat(lang); }).join("");
                        }
                        if ((filters === null || filters === void 0 ? void 0 : filters.genre) instanceof Array) {
                            url += filters.genre
                                .map(function (genre, idx) { return "&genre[".concat(idx, "]=").concat(genre); })
                                .join("");
                        }
                        if ((filters === null || filters === void 0 ? void 0 : filters.delgenre) instanceof Array) {
                            url += filters.delgenre
                                .map(function (genre, idx) { return "&delgenre[".concat(idx, "]=del ").concat(genre); })
                                .join("");
                        }
                        url += "&sortcountchapt=" + ((filters === null || filters === void 0 ? void 0 : filters.sortcountchapt) || "1");
                        url += "&sortdaycreate=" + ((filters === null || filters === void 0 ? void 0 : filters.sortdaycreate) || "1");
                        url +=
                            "&sortby=" + (showLatestNovels ? "upd" : (filters === null || filters === void 0 ? void 0 : filters.sortby) || "topweek");
                        url += "&gpage=" + pageNo;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _b.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _b.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio('div[class="block-home"] > div[class="one"]').each(function () {
                            var _a;
                            var name = loadedCheerio(this)
                                .find('div[class="img-home"] > a')
                                .attr("title");
                            var cover = (_a = loadedCheerio(this)
                                .find('div[class="img-home"] > a > img')
                                .attr("src")) === null || _a === void 0 ? void 0 : _a.replace("-150x150", "");
                            var url = loadedCheerio(this)
                                .find('div[class="img-home"] > a')
                                .attr("href");
                            if (!name || !url)
                                return;
                            novels.push({ name: name, cover: cover, url: url });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    Jaomix.prototype.parseNovelAndChapters = function (novelUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var result, body, loadedCheerio, novel, chapters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(novelUrl)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            url: novelUrl,
                        };
                        novel.name = loadedCheerio('div[class="desc-book"] > h1').text().trim();
                        novel.cover = loadedCheerio('div[class="img-book"] > img').attr("src");
                        novel.summary = loadedCheerio('div[id="desc-tab"]').text().trim();
                        loadedCheerio("#info-book > p").each(function () {
                            var text = loadedCheerio(this).text().replace(/,/g, "").split(" ");
                            if (text[0] === "Автор:") {
                                novel.author = text.splice(1).join(" ");
                            }
                            else if (text[0] === "Жанры:") {
                                novel.genres = text.splice(1).join(",");
                            }
                            else if (text[0] === "Статус:") {
                                novel.status = text.includes("продолжается")
                                    ? novelStatus_1.NovelStatus.Ongoing
                                    : novelStatus_1.NovelStatus.Completed;
                            }
                        });
                        chapters = [];
                        loadedCheerio(".download-chapter div.title").each(function () {
                            var name = loadedCheerio(this).find("a").attr("title");
                            var releaseTime = loadedCheerio(this).find("time").text();
                            var url = loadedCheerio(this).find("a").attr("href");
                            if (!name || !url)
                                return;
                            chapters.push({ name: name, releaseTime: releaseTime, url: url });
                        });
                        novel.chapters = chapters.reverse();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    Jaomix.prototype.parseChapter = function (chapterUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var result, body, loadedCheerio, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(chapterUrl)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        loadedCheerio('div[class="adblock-service"]').remove();
                        chapterText = loadedCheerio('div[class="entry-content"]').html();
                        return [2 /*return*/, chapterText || ""];
                }
            });
        });
    };
    Jaomix.prototype.searchNovels = function (searchTerm, pageNo) {
        if (pageNo === void 0) { pageNo = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var url, result, body, loadedCheerio, novels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site, "/?searchrn=").concat(searchTerm, "&but=\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044E&sortby=upd&gpage=").concat(pageNo);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio('div[class="block-home"] > div[class="one"]').each(function () {
                            var _a;
                            var name = loadedCheerio(this)
                                .find('div[class="img-home"] > a')
                                .attr("title");
                            var cover = (_a = loadedCheerio(this)
                                .find('div[class="img-home"] > a > img')
                                .attr("src")) === null || _a === void 0 ? void 0 : _a.replace("-150x150", "");
                            var url = loadedCheerio(this)
                                .find('div[class="img-home"] > a')
                                .attr("href");
                            if (!name || !url)
                                return;
                            novels.push({ name: name, cover: cover, url: url });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return Jaomix;
}());
exports.default = new Jaomix();
