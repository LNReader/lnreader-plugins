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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var filterInputs_1 = require("@libs/filterInputs");
var fetch_1 = require("@libs/fetch");
var novelStatus_1 = require("@libs/novelStatus");
var cheerio_1 = require("cheerio");
var dayjs_1 = __importDefault(require("dayjs"));
var Jaomix = /** @class */ (function () {
    function Jaomix() {
        this.id = 'jaomix.ru';
        this.name = 'Jaomix';
        this.site = 'https://jaomix.ru';
        this.version = '1.0.1';
        this.icon = 'src/ru/jaomix/icon.png';
        this.parseDate = function (dateString) {
            if (dateString === void 0) { dateString = ''; }
            var months = {
                Янв: 1,
                Фев: 2,
                Мар: 3,
                Апр: 4,
                Май: 5,
                Июн: 6,
                Июл: 7,
                Авг: 8,
                Сен: 9,
                Окт: 10,
                Ноя: 11,
                Дек: 12,
            };
            var _a = dateString.split(' '), time = _a[0], day = _a[1], month = _a[2], year = _a[3];
            if (time && day && months[month] && year) {
                return (0, dayjs_1.default)(year + '-' + months[month] + '-' + day + ' ' + time).format('LLL');
            }
            return dateString || null;
        };
        this.filters = {
            sortby: {
                label: 'Сортировка:',
                value: 'topweek',
                options: [
                    { label: 'Топ недели', value: 'topweek' },
                    { label: 'По алфавиту', value: 'alphabet' },
                    { label: 'По дате обновления', value: 'upd' },
                    { label: 'По дате создания', value: 'new' },
                    { label: 'По просмотрам', value: 'count' },
                    { label: 'Топ года', value: 'topyear' },
                    { label: 'Топ дня', value: 'topday' },
                    { label: 'Топ за все время', value: 'alltime' },
                    { label: 'Топ месяца', value: 'topmonth' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            sortdaycreate: {
                label: 'Дата добавления:',
                value: '1',
                options: [
                    { label: 'Любое', value: '1' },
                    { label: 'От 120 до 180 дней', value: '1218' },
                    { label: 'От 180 до 365 дней', value: '1836' },
                    { label: 'От 30 до 60 дней', value: '3060' },
                    { label: 'От 365 дней', value: '365' },
                    { label: 'От 60 до 90 дней', value: '6090' },
                    { label: 'От 90 до 120 дней', value: '9012' },
                    { label: 'Послед. 30 дней', value: '30' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            sortcountchapt: {
                label: 'Количество глав:',
                value: '1',
                options: [
                    { label: 'Любое кол-во глав', value: '1' },
                    { label: 'До 500', value: '500' },
                    { label: 'От 1000 до 2000', value: '1020' },
                    { label: 'От 2000 до 3000', value: '2030' },
                    { label: 'От 3000 до 4000', value: '3040' },
                    { label: 'От 4000', value: '400' },
                    { label: 'От 500 до 1000', value: '510' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genre: {
                label: 'Жанры:',
                value: { include: [], exclude: [] },
                options: [
                    { label: 'Боевые Искусства', value: 'Боевые Искусства' },
                    { label: 'Виртуальный Мир', value: 'Виртуальный Мир' },
                    { label: 'Гарем', value: 'Гарем' },
                    { label: 'Детектив', value: 'Детектив' },
                    { label: 'Драма', value: 'Драма' },
                    { label: 'Игра', value: 'Игра' },
                    { label: 'Истории из жизни', value: 'Истории из жизни' },
                    { label: 'Исторический', value: 'Исторический' },
                    { label: 'История', value: 'История' },
                    { label: 'Исэкай', value: 'Исэкай' },
                    { label: 'Комедия', value: 'Комедия' },
                    { label: 'Меха', value: 'Меха' },
                    { label: 'Мистика', value: 'Мистика' },
                    { label: 'Научная Фантастика', value: 'Научная Фантастика' },
                    { label: 'Повседневность', value: 'Повседневность' },
                    { label: 'Постапокалипсис', value: 'Постапокалипсис' },
                    { label: 'Приключения', value: 'Приключения' },
                    { label: 'Психология', value: 'Психология' },
                    { label: 'Романтика', value: 'Романтика' },
                    { label: 'Сверхъестественное', value: 'Сверхъестественное' },
                    { label: 'Сёнэн', value: 'Сёнэн' },
                    { label: 'Сёнэн-ай', value: 'Сёнэн-ай' },
                    { label: 'Спорт', value: 'Спорт' },
                    { label: 'Сэйнэн', value: 'Сэйнэн' },
                    { label: 'Сюаньхуа', value: 'Сюаньхуа' },
                    { label: 'Трагедия', value: 'Трагедия' },
                    { label: 'Триллер', value: 'Триллер' },
                    { label: 'Фантастика', value: 'Фантастика' },
                    { label: 'Фэнтези', value: 'Фэнтези' },
                    { label: 'Хоррор', value: 'Хоррор' },
                    { label: 'Школьная жизнь', value: 'Школьная жизнь' },
                    { label: 'Шоунен', value: 'Шоунен' },
                    { label: 'Экшн', value: 'Экшн' },
                    { label: 'Этти', value: 'Этти' },
                    { label: 'Юри', value: 'Юри' },
                    { label: 'Adult', value: 'Adult' },
                    { label: 'Ecchi', value: 'Ecchi' },
                    { label: 'Josei', value: 'Josei' },
                    { label: 'Lolicon', value: 'Lolicon' },
                    { label: 'Mature', value: 'Mature' },
                    { label: 'Shoujo', value: 'Shoujo' },
                    { label: 'Wuxia', value: 'Wuxia' },
                    { label: 'Xianxia', value: 'Xianxia' },
                    { label: 'Xuanhuan', value: 'Xuanhuan' },
                    { label: 'Yaoi', value: 'Yaoi' },
                ],
                type: filterInputs_1.FilterTypes.ExcludableCheckboxGroup,
            },
            lang: {
                label: 'Выбрать языки:',
                value: [],
                options: [
                    { label: 'Английский', value: 'Английский' },
                    { label: 'Китайский', value: 'Китайский' },
                    { label: 'Корейский', value: 'Корейский' },
                    { label: 'Японский', value: 'Японский' },
                ],
                type: filterInputs_1.FilterTypes.CheckboxGroup,
            },
        };
    }
    Jaomix.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var url, body, loadedCheerio, novels;
            var _this = this;
            var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_p) {
                switch (_p.label) {
                    case 0:
                        url = this.site + '/?searchrn';
                        if ((_d = (_c = filters === null || filters === void 0 ? void 0 : filters.lang) === null || _c === void 0 ? void 0 : _c.value) === null || _d === void 0 ? void 0 : _d.length) {
                            url += filters.lang.value
                                .map(function (lang, idx) { return "&lang[".concat(idx, "]=").concat(lang); })
                                .join('');
                        }
                        if ((_g = (_f = (_e = filters === null || filters === void 0 ? void 0 : filters.genre) === null || _e === void 0 ? void 0 : _e.value) === null || _f === void 0 ? void 0 : _f.include) === null || _g === void 0 ? void 0 : _g.length) {
                            url += filters.genre.value.include
                                .map(function (genre, idx) { return "&genre[".concat(idx, "]=").concat(genre); })
                                .join('');
                        }
                        if ((_k = (_j = (_h = filters === null || filters === void 0 ? void 0 : filters.genre) === null || _h === void 0 ? void 0 : _h.value) === null || _j === void 0 ? void 0 : _j.exclude) === null || _k === void 0 ? void 0 : _k.length) {
                            url += filters.genre.value.exclude
                                .map(function (genre, idx) { return "&delgenre[".concat(idx, "]=del ").concat(genre); })
                                .join('');
                        }
                        url += '&sortcountchapt=' + (((_l = filters === null || filters === void 0 ? void 0 : filters.sortcountchapt) === null || _l === void 0 ? void 0 : _l.value) || '1');
                        url += '&sortdaycreate=' + (((_m = filters === null || filters === void 0 ? void 0 : filters.sortdaycreate) === null || _m === void 0 ? void 0 : _m.value) || '1');
                        url +=
                            '&sortby=' +
                                (showLatestNovels ? 'upd' : ((_o = filters === null || filters === void 0 ? void 0 : filters.sortby) === null || _o === void 0 ? void 0 : _o.value) || 'topweek');
                        url += '&gpage=' + pageNo;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (res) { return res.text(); })];
                    case 1:
                        body = _p.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio('div[class="block-home"] > div[class="one"]').each(function (index, element) {
                            var _a;
                            var name = loadedCheerio(element)
                                .find('div[class="img-home"] > a')
                                .attr('title');
                            var cover = (_a = loadedCheerio(element)
                                .find('div[class="img-home"] > a > img')
                                .attr('src')) === null || _a === void 0 ? void 0 : _a.replace('-150x150', '');
                            var url = loadedCheerio(element)
                                .find('div[class="img-home"] > a')
                                .attr('href');
                            if (!name || !url)
                                return;
                            novels.push({ name: name, cover: cover, path: url.replace(_this.site, '') });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    Jaomix.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, novel, chapters, totalChapters;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath).then(function (res) { return res.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('div[class="desc-book"] > h1').text().trim(),
                            cover: loadedCheerio('div[class="img-book"] > img').attr('src'),
                            summary: loadedCheerio('div[id="desc-tab"]').text().trim(),
                        };
                        loadedCheerio('#info-book > p').each(function () {
                            var text = loadedCheerio(this).text().replace(/,/g, '').split(' ');
                            if (text[0] === 'Автор:') {
                                novel.author = text.splice(1).join(' ');
                            }
                            else if (text[0] === 'Жанры:') {
                                novel.genres = text.splice(1).join(',');
                            }
                            else if (text[0] === 'Статус:') {
                                novel.status = text.includes('продолжается')
                                    ? novelStatus_1.NovelStatus.Ongoing
                                    : novelStatus_1.NovelStatus.Completed;
                            }
                        });
                        chapters = [];
                        totalChapters = loadedCheerio('.download-chapter div.title').length;
                        loadedCheerio('.download-chapter div.title').each(function (chapterIndex, element) {
                            var name = loadedCheerio(element).find('a').attr('title');
                            var url = loadedCheerio(element).find('a').attr('href');
                            if (!name || !url)
                                return;
                            var releaseDate = loadedCheerio(element).find('time').text();
                            chapters.push({
                                name: name,
                                path: url.replace(_this.site, ''),
                                releaseTime: _this.parseDate(releaseDate),
                                chapterNumber: totalChapters - chapterIndex,
                            });
                        });
                        novel.chapters = chapters.reverse();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    Jaomix.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, chapterText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath).then(function (res) {
                            return res.text();
                        })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        loadedCheerio('div[class="adblock-service"]').remove();
                        chapterText = loadedCheerio('div[class="entry-content"]').html() || '';
                        return [2 /*return*/, chapterText.replace(/<a[^>]*>(.*?)<\/a>/gi, '$1')];
                }
            });
        });
    };
    Jaomix.prototype.searchNovels = function (searchTerm_1) {
        return __awaiter(this, arguments, void 0, function (searchTerm, pageNo) {
            var url, body, loadedCheerio, novels;
            var _this = this;
            if (pageNo === void 0) { pageNo = 1; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site +
                            '/?searchrn=' +
                            searchTerm +
                            '&but=Поиск по названию&sortby=upd&gpage=' +
                            pageNo;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (res) { return res.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio('div[class="block-home"] > div[class="one"]').each(function (index, element) {
                            var _a;
                            var name = loadedCheerio(element)
                                .find('div[class="img-home"] > a')
                                .attr('title');
                            var cover = (_a = loadedCheerio(element)
                                .find('div[class="img-home"] > a > img')
                                .attr('src')) === null || _a === void 0 ? void 0 : _a.replace('-150x150', '');
                            var url = loadedCheerio(element)
                                .find('div[class="img-home"] > a')
                                .attr('href');
                            if (!name || !url)
                                return;
                            novels.push({ name: name, cover: cover, path: url.replace(_this.site, '') });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return Jaomix;
}());
exports.default = new Jaomix();
