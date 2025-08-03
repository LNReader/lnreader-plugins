"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var defaultCover_1 = require("@libs/defaultCover");
var fetch_1 = require("@libs/fetch");
var novelStatus_1 = require("@libs/novelStatus");
var storage_1 = require("@libs/storage");
var dayjs_1 = __importDefault(require("dayjs"));
var statusKey = {
    1: novelStatus_1.NovelStatus.Ongoing,
    2: novelStatus_1.NovelStatus.Completed,
    3: novelStatus_1.NovelStatus.OnHiatus,
    4: novelStatus_1.NovelStatus.Cancelled,
};
var RLIB = /** @class */ (function () {
    function RLIB() {
        var _this = this;
        this.id = 'RLIB';
        this.name = 'RanobeLib';
        this.site = 'https://ranobelib.me';
        this.apiSite = 'https://api.cdnlibs.org/api/manga/';
        this.version = '2.2.0';
        this.icon = 'src/ru/ranobelib/icon.png';
        this.webStorageUtilized = true;
        this.resolveUrl = function (path, isNovel) {
            var _a;
            var ui = ((_a = _this.user) === null || _a === void 0 ? void 0 : _a.ui) ? 'ui=' + _this.user.ui : '';
            if (isNovel)
                return _this.site + '/ru/book/' + path + (ui ? '?' + ui : '');
            var _b = path.split('/'), slug = _b[0], volume = _b[1], number = _b[2], branch_id = _b[3];
            var chapterPath = slug +
                '/read/v' +
                volume +
                '/c' +
                number +
                (branch_id ? '?bid=' + branch_id : '');
            return (_this.site +
                '/ru/' +
                chapterPath +
                (ui ? (branch_id ? '&' : '?') + ui : ''));
        };
        this.getUser = function () {
            var _a, _b;
            var user = storage_1.storage.get('user');
            if (user) {
                return { token: { Authorization: 'Bearer ' + user.token }, ui: user.id };
            }
            var dataRaw = (_a = storage_1.localStorage.get()) === null || _a === void 0 ? void 0 : _a.auth;
            if (!dataRaw) {
                return {};
            }
            var data = JSON.parse(dataRaw);
            if (!((_b = data === null || data === void 0 ? void 0 : data.token) === null || _b === void 0 ? void 0 : _b.access_token))
                return;
            storage_1.storage.set('user', {
                id: data.auth.id,
                token: data.token.access_token,
            }, data.token.timestamp + data.token.expires_in);
            return {
                token: { Authorization: 'Bearer ' + data.token.access_token },
                ui: data.auth.id,
            };
        };
        this.user = this.getUser(); //To change the account, you need to restart the application
        this.filters = {
            sort_by: {
                label: 'Сортировка',
                value: 'rating_score',
                options: [
                    { label: 'По рейтингу', value: 'rate_avg' },
                    { label: 'По популярности', value: 'rating_score' },
                    { label: 'По просмотрам', value: 'views' },
                    { label: 'Количеству глав', value: 'chap_count' },
                    { label: 'Дате обновления', value: 'last_chapter_at' },
                    { label: 'Дате добавления', value: 'created_at' },
                    { label: 'По названию (A-Z)', value: 'name' },
                    { label: 'По названию (А-Я)', value: 'rus_name' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            sort_type: {
                label: 'Порядок',
                value: 'desc',
                options: [
                    { label: 'По убыванию', value: 'desc' },
                    { label: 'По возрастанию', value: 'asc' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            types: {
                label: 'Тип',
                value: [],
                options: [
                    { label: 'Япония', value: '10' },
                    { label: 'Корея', value: '11' },
                    { label: 'Китай', value: '12' },
                    { label: 'Английский', value: '13' },
                    { label: 'Авторский', value: '14' },
                    { label: 'Фанфик', value: '15' },
                ],
                type: filterInputs_1.FilterTypes.CheckboxGroup,
            },
            scanlateStatus: {
                label: 'Статус перевода',
                value: [],
                options: [
                    { label: 'Продолжается', value: '1' },
                    { label: 'Завершен', value: '2' },
                    { label: 'Заморожен', value: '3' },
                    { label: 'Заброшен', value: '4' },
                ],
                type: filterInputs_1.FilterTypes.CheckboxGroup,
            },
            manga_status: {
                label: 'Статус тайтла',
                value: [],
                options: [
                    { label: 'Онгоинг', value: '1' },
                    { label: 'Завершён', value: '2' },
                    { label: 'Анонс', value: '3' },
                    { label: 'Приостановлен', value: '4' },
                    { label: 'Выпуск прекращён', value: '5' },
                ],
                type: filterInputs_1.FilterTypes.CheckboxGroup,
            },
            genres: {
                label: 'Жанры',
                value: { include: [], exclude: [] },
                options: [
                    { label: 'Арт', value: '32' },
                    { label: 'Безумие', value: '91' },
                    { label: 'Боевик', value: '34' },
                    { label: 'Боевые искусства', value: '35' },
                    { label: 'Вампиры', value: '36' },
                    { label: 'Военное', value: '89' },
                    { label: 'Гарем', value: '37' },
                    { label: 'Гендерная интрига', value: '38' },
                    { label: 'Героическое фэнтези', value: '39' },
                    { label: 'Демоны', value: '81' },
                    { label: 'Детектив', value: '40' },
                    { label: 'Детское', value: '88' },
                    { label: 'Дзёсэй', value: '41' },
                    { label: 'Драма', value: '43' },
                    { label: 'Игра', value: '44' },
                    { label: 'Исекай', value: '79' },
                    { label: 'История', value: '45' },
                    { label: 'Киберпанк', value: '46' },
                    { label: 'Кодомо', value: '76' },
                    { label: 'Комедия', value: '47' },
                    { label: 'Космос', value: '83' },
                    { label: 'Магия', value: '85' },
                    { label: 'Махо-сёдзё', value: '48' },
                    { label: 'Машины', value: '90' },
                    { label: 'Меха', value: '49' },
                    { label: 'Мистика', value: '50' },
                    { label: 'Музыка', value: '80' },
                    { label: 'Научная фантастика', value: '51' },
                    { label: 'Омегаверс', value: '77' },
                    { label: 'Пародия', value: '86' },
                    { label: 'Повседневность', value: '52' },
                    { label: 'Полиция', value: '82' },
                    { label: 'Постапокалиптика', value: '53' },
                    { label: 'Приключения', value: '54' },
                    { label: 'Психология', value: '55' },
                    { label: 'Романтика', value: '56' },
                    { label: 'Самурайский боевик', value: '57' },
                    { label: 'Сверхъестественное', value: '58' },
                    { label: 'Сёдзё', value: '59' },
                    { label: 'Сёдзё-ай', value: '60' },
                    { label: 'Сёнэн', value: '61' },
                    { label: 'Сёнэн-ай', value: '62' },
                    { label: 'Спорт', value: '63' },
                    { label: 'Супер сила', value: '87' },
                    { label: 'Сэйнэн', value: '64' },
                    { label: 'Трагедия', value: '65' },
                    { label: 'Триллер', value: '66' },
                    { label: 'Ужасы', value: '67' },
                    { label: 'Фантастика', value: '68' },
                    { label: 'Фэнтези', value: '69' },
                    { label: 'Хентай', value: '84' },
                    { label: 'Школа', value: '70' },
                    { label: 'Эротика', value: '71' },
                    { label: 'Этти', value: '72' },
                    { label: 'Юри', value: '73' },
                    { label: 'Яой', value: '74' },
                ],
                type: filterInputs_1.FilterTypes.ExcludableCheckboxGroup,
            },
            tags: {
                label: 'Теги',
                value: { include: [], exclude: [] },
                options: [
                    { label: 'Авантюристы', value: '328' },
                    { label: 'Антигерой', value: '175' },
                    { label: 'Бессмертные', value: '333' },
                    { label: 'Боги', value: '218' },
                    { label: 'Борьба за власть', value: '309' },
                    { label: 'Брат и сестра', value: '360' },
                    { label: 'Ведьма', value: '339' },
                    { label: 'Видеоигры', value: '204' },
                    { label: 'Виртуальная реальность', value: '214' },
                    { label: 'Владыка демонов', value: '349' },
                    { label: 'Военные', value: '198' },
                    { label: 'Воспоминания из другого мира', value: '310' },
                    { label: 'Выживание', value: '212' },
                    { label: 'ГГ женщина', value: '294' },
                    { label: 'ГГ имба', value: '292' },
                    { label: 'ГГ мужчина', value: '295' },
                    { label: 'ГГ не ояш', value: '325' },
                    { label: 'ГГ не человек', value: '331' },
                    { label: 'ГГ ояш', value: '326' },
                    { label: 'Главный герой бог', value: '324' },
                    { label: 'Глупый ГГ', value: '298' },
                    { label: 'Горничные', value: '171' },
                    { label: 'Гуро', value: '306' },
                    { label: 'Гяру', value: '197' },
                    { label: 'Демоны', value: '157' },
                    { label: 'Драконы', value: '313' },
                    { label: 'Древний мир', value: '317' },
                    { label: 'Зверолюди', value: '163' },
                    { label: 'Зомби', value: '155' },
                    { label: 'Исторические фигуры', value: '323' },
                    { label: 'Кулинария', value: '158' },
                    { label: 'Культивация', value: '161' },
                    { label: 'ЛГБТ', value: '344' },
                    { label: 'ЛитРПГ', value: '319' },
                    { label: 'Лоли', value: '206' },
                    { label: 'Магия', value: '170' },
                    { label: 'Машинный перевод', value: '345' },
                    { label: 'Медицина', value: '159' },
                    { label: 'Межгалактическая война', value: '330' },
                    { label: 'Монстр Девушки', value: '207' },
                    { label: 'Монстры', value: '208' },
                    { label: 'Мрачный мир', value: '316' },
                    { label: 'Музыка', value: '358' },
                    { label: 'Музыка', value: '209' },
                    { label: 'Ниндзя', value: '199' },
                    { label: 'Обратный Гарем', value: '210' },
                    { label: 'Офисные Работники', value: '200' },
                    { label: 'Пираты', value: '341' },
                    { label: 'Подземелья', value: '314' },
                    { label: 'Политика', value: '311' },
                    { label: 'Полиция', value: '201' },
                    { label: 'Преступники / Криминал', value: '205' },
                    { label: 'Призраки / Духи', value: '196' },
                    { label: 'Призыватели', value: '329' },
                    { label: 'Прыжки между мирами', value: '321' },
                    { label: 'Путешествие в другой мир', value: '318' },
                    { label: 'Путешествие во времени', value: '213' },
                    { label: 'Рабы', value: '355' },
                    { label: 'Ранги силы', value: '312' },
                    { label: 'Реинкарнация', value: '154' },
                    { label: 'Самураи', value: '202' },
                    { label: 'Скрытие личности', value: '315' },
                    { label: 'Средневековье', value: '174' },
                    { label: 'Традиционные игры', value: '203' },
                    { label: 'Умный ГГ', value: '303' },
                    { label: 'Характерный рост', value: '332' },
                    { label: 'Хикикомори', value: '167' },
                    { label: 'Эволюция', value: '322' },
                    { label: 'Элементы РПГ', value: '327' },
                    { label: 'Эльфы', value: '217' },
                    { label: 'Якудза', value: '165' },
                ],
                type: filterInputs_1.FilterTypes.ExcludableCheckboxGroup,
            },
            require_chapters: {
                label: 'Только проекты с главами',
                value: true,
                type: filterInputs_1.FilterTypes.Switch,
            },
        };
    }
    RLIB.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var url, result, novels;
            var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_w) {
                switch (_w.label) {
                    case 0:
                        url = this.apiSite + '?site_id[0]=3&page=' + pageNo;
                        url +=
                            '&sort_by=' +
                                (showLatestNovels
                                    ? 'last_chapter_at'
                                    : ((_c = filters === null || filters === void 0 ? void 0 : filters.sort_by) === null || _c === void 0 ? void 0 : _c.value) || 'rating_score');
                        url += '&sort_type=' + (((_d = filters === null || filters === void 0 ? void 0 : filters.sort_type) === null || _d === void 0 ? void 0 : _d.value) || 'desc');
                        if ((_e = filters === null || filters === void 0 ? void 0 : filters.require_chapters) === null || _e === void 0 ? void 0 : _e.value) {
                            url += '&chapters[min]=1';
                        }
                        if ((_g = (_f = filters === null || filters === void 0 ? void 0 : filters.types) === null || _f === void 0 ? void 0 : _f.value) === null || _g === void 0 ? void 0 : _g.length) {
                            url += '&types[]=' + filters.types.value.join('&types[]=');
                        }
                        if ((_j = (_h = filters === null || filters === void 0 ? void 0 : filters.scanlateStatus) === null || _h === void 0 ? void 0 : _h.value) === null || _j === void 0 ? void 0 : _j.length) {
                            url +=
                                '&scanlateStatus[]=' +
                                    filters.scanlateStatus.value.join('&scanlateStatus[]=');
                        }
                        if ((_l = (_k = filters === null || filters === void 0 ? void 0 : filters.manga_status) === null || _k === void 0 ? void 0 : _k.value) === null || _l === void 0 ? void 0 : _l.length) {
                            url +=
                                '&manga_status[]=' +
                                    filters.manga_status.value.join('&manga_status[]=');
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.genres) {
                            if ((_o = (_m = filters.genres.value) === null || _m === void 0 ? void 0 : _m.include) === null || _o === void 0 ? void 0 : _o.length) {
                                url += '&genres[]=' + filters.genres.value.include.join('&genres[]=');
                            }
                            if ((_q = (_p = filters.genres.value) === null || _p === void 0 ? void 0 : _p.exclude) === null || _q === void 0 ? void 0 : _q.length) {
                                url +=
                                    '&genres_exclude[]=' +
                                        filters.genres.value.exclude.join('&genres_exclude[]=');
                            }
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.tags) {
                            if ((_s = (_r = filters.tags.value) === null || _r === void 0 ? void 0 : _r.include) === null || _s === void 0 ? void 0 : _s.length) {
                                url += '&tags[]=' + filters.tags.value.include.join('&tags[]=');
                            }
                            if ((_u = (_t = filters.tags.value) === null || _t === void 0 ? void 0 : _t.exclude) === null || _u === void 0 ? void 0 : _u.length) {
                                url +=
                                    '&tags_exclude[]=' +
                                        filters.tags.value.exclude.join('&tags_exclude[]=');
                            }
                        }
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url, {
                                headers: (_v = this.user) === null || _v === void 0 ? void 0 : _v.token,
                            }).then(function (res) { return res.json(); })];
                    case 1:
                        result = _w.sent();
                        novels = [];
                        if (result.data instanceof Array) {
                            result.data.forEach(function (novel) {
                                var _a;
                                return novels.push({
                                    name: novel.rus_name || novel.eng_name || novel.name,
                                    cover: ((_a = novel.cover) === null || _a === void 0 ? void 0 : _a.default) || defaultCover_1.defaultCover,
                                    path: novel.slug_url || novel.id + '--' + novel.slug,
                                });
                            });
                        }
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    RLIB.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var data, novel, genres, branch_name, chaptersJSON, chapters, uniquePages;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.apiSite).concat(novelPath, "?fields[]=summary&fields[]=genres&fields[]=tags&fields[]=teams&fields[]=authors&fields[]=status_id&fields[]=artists"), { headers: (_a = this.user) === null || _a === void 0 ? void 0 : _a.token }).then(function (res) { return res.json(); })];
                    case 1:
                        data = (_l.sent()).data;
                        novel = {
                            path: novelPath,
                            name: data.rus_name || data.name,
                            cover: ((_b = data.cover) === null || _b === void 0 ? void 0 : _b.default) || defaultCover_1.defaultCover,
                            summary: (_c = data.summary) === null || _c === void 0 ? void 0 : _c.trim(),
                        };
                        if ((_d = data.status) === null || _d === void 0 ? void 0 : _d.id) {
                            novel.status = statusKey[data.status.id] || novelStatus_1.NovelStatus.Unknown;
                        }
                        if ((_e = data.authors) === null || _e === void 0 ? void 0 : _e.length) {
                            novel.author = data.authors[0].name;
                        }
                        if ((_f = data.artists) === null || _f === void 0 ? void 0 : _f.length) {
                            novel.artist = data.artists[0].name;
                        }
                        genres = [data.genres || [], data.tags || []]
                            .flat()
                            .map(function (genres) { return genres === null || genres === void 0 ? void 0 : genres.name; })
                            .filter(function (genres) { return genres; });
                        if (genres.length) {
                            novel.genres = genres.join(', ');
                        }
                        branch_name = ((_g = data.teams) === null || _g === void 0 ? void 0 : _g.reduce(function (acc, _a) {
                            var _b;
                            var name = _a.name, details = _a.details;
                            acc[String((_b = details === null || details === void 0 ? void 0 : details.branch_id) !== null && _b !== void 0 ? _b : '0')] = name;
                            return acc;
                        }, { '0': 'Главная страница' })) || { '0': 'Главная страница' };
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.apiSite).concat(novelPath, "/chapters"), { headers: (_h = this.user) === null || _h === void 0 ? void 0 : _h.token }).then(function (res) { return res.json(); })];
                    case 2:
                        chaptersJSON = _l.sent();
                        if ((_j = chaptersJSON.data) === null || _j === void 0 ? void 0 : _j.length) {
                            chapters = chaptersJSON.data.flatMap(function (chapter) {
                                return chapter.branches.map(function (_a) {
                                    var branch_id = _a.branch_id, created_at = _a.created_at;
                                    var bId = String(branch_id !== null && branch_id !== void 0 ? branch_id : '0');
                                    return {
                                        name: "\u0422\u043E\u043C ".concat(chapter.volume, " \u0413\u043B\u0430\u0432\u0430 ").concat(chapter.number).concat(chapter.name ? ' ' + chapter.name.trim() : ''),
                                        path: "".concat(novelPath, "/").concat(chapter.volume, "/").concat(chapter.number, "/").concat(bId),
                                        releaseTime: created_at ? (0, dayjs_1.default)(created_at).format('LLL') : null,
                                        chapterNumber: chapter.index,
                                        page: branch_name[bId] || 'Неизвестный',
                                    };
                                });
                            });
                            if (chapters.length) {
                                uniquePages = new Set(chapters.map(function (c) { return c.page; }));
                                if (uniquePages.size === 1) {
                                    // If only one unique page value, set page to undefined for all chapters
                                    // Need more investigation one app side for single page shenanigans
                                    chapters = chapters.map(function (chapter) { return (__assign(__assign({}, chapter), { page: undefined })); });
                                }
                                else if (((_k = data.teams) === null || _k === void 0 ? void 0 : _k.length) > 1) {
                                    // Original sorting logic for multiple pages, for reasons chapters overlap with one another
                                    chapters.sort(function (chapterA, chapterB) {
                                        if (chapterA.page &&
                                            chapterB.page &&
                                            chapterA.page !== chapterB.page) {
                                            return chapterA.page.localeCompare(chapterB.page);
                                        }
                                        return ((chapterA.chapterNumber || 0) - (chapterB.chapterNumber || 0));
                                    });
                                }
                                novel.chapters = chapters;
                            }
                        }
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    RLIB.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, slug, volume, number, branch_id, chapterText, result;
            var _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _a = chapterPath.split('/'), slug = _a[0], volume = _a[1], number = _a[2], branch_id = _a[3];
                        chapterText = '';
                        if (!(slug && volume && number)) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.apiSite +
                                slug +
                                '/chapter?' +
                                (branch_id ? 'branch_id=' + branch_id + '&' : '') +
                                'number=' +
                                number +
                                '&volume=' +
                                volume, { headers: (_b = this.user) === null || _b === void 0 ? void 0 : _b.token }).then(function (res) { return res.json(); })];
                    case 1:
                        result = _f.sent();
                        chapterText =
                            ((_d = (_c = result === null || result === void 0 ? void 0 : result.data) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.type) == 'doc'
                                ? jsonToHtml(result.data.content.content, result.data.attachments || [])
                                : (_e = result === null || result === void 0 ? void 0 : result.data) === null || _e === void 0 ? void 0 : _e.content;
                        _f.label = 2;
                    case 2: return [2 /*return*/, chapterText];
                }
            });
        });
    };
    RLIB.prototype.searchNovels = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, novels;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = this.apiSite + '?site_id[0]=3&q=' + searchTerm;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url, {
                                headers: (_a = this.user) === null || _a === void 0 ? void 0 : _a.token,
                            }).then(function (res) { return res.json(); })];
                    case 1:
                        result = _b.sent();
                        novels = [];
                        if (result.data instanceof Array) {
                            result.data.forEach(function (novel) {
                                var _a;
                                return novels.push({
                                    name: novel.rus_name || novel.eng_name || novel.name,
                                    cover: ((_a = novel.cover) === null || _a === void 0 ? void 0 : _a.default) || defaultCover_1.defaultCover,
                                    path: novel.slug_url || novel.id + '--' + novel.slug,
                                });
                            });
                        }
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return RLIB;
}());
exports.default = new RLIB();
function jsonToHtml(json, images, html) {
    if (html === void 0) { html = ''; }
    json.forEach(function (element) {
        var _a, _b;
        switch (element.type) {
            case 'hardBreak':
                html += '<br>';
                break;
            case 'horizontalRule':
                html += '<hr>';
                break;
            case 'image':
                if ((_b = (_a = element.attrs) === null || _a === void 0 ? void 0 : _a.images) === null || _b === void 0 ? void 0 : _b.length) {
                    element.attrs.images.forEach(function (_a) {
                        var image = _a.image;
                        var file = images.find(function (f) { return f.name == image || f.id == image; });
                        if (file) {
                            html += "<img src='".concat(file.url, "'>");
                        }
                    });
                }
                else if (element.attrs) {
                    var attrs = Object.entries(element.attrs)
                        .filter(function (attr) { return attr === null || attr === void 0 ? void 0 : attr[1]; })
                        .map(function (attr) { return "".concat(attr[0], "=\"").concat(attr[1], "\""); });
                    html += '<img ' + attrs.join('; ') + '>';
                }
                break;
            case 'paragraph':
                html +=
                    '<p>' +
                        (element.content ? jsonToHtml(element.content, images) : '<br>') +
                        '</p>';
                break;
            case 'orderedList':
                html +=
                    '<ol>' +
                        (element.content ? jsonToHtml(element.content, images) : '<br>') +
                        '</ol>';
                break;
            case 'listItem':
                html +=
                    '<li>' +
                        (element.content ? jsonToHtml(element.content, images) : '<br>') +
                        '</li>';
                break;
            case 'blockquote':
                html +=
                    '<blockquote>' +
                        (element.content ? jsonToHtml(element.content, images) : '<br>') +
                        '</blockquote>';
                break;
            case 'italic':
                html +=
                    '<i>' +
                        (element.content ? jsonToHtml(element.content, images) : '<br>') +
                        '</i>';
                break;
            case 'bold':
                html +=
                    '<b>' +
                        (element.content ? jsonToHtml(element.content, images) : '<br>') +
                        '</b>';
                break;
            case 'underline':
                html +=
                    '<u>' +
                        (element.content ? jsonToHtml(element.content, images) : '<br>') +
                        '</u>';
                break;
            case 'heading':
                html +=
                    '<h2>' +
                        (element.content ? jsonToHtml(element.content, images) : '<br>') +
                        '</h2>';
                break;
            case 'text':
                html += element.text;
                break;
            default:
                html += JSON.stringify(element, null, '\t'); //maybe I missed something.
                break;
        }
    });
    return html;
}
