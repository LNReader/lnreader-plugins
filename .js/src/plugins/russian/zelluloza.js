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
var Zelluloza = /** @class */ (function () {
    function Zelluloza() {
        var _this = this;
        this.id = 'zelluloza';
        this.name = 'Целлюлоза';
        this.site = 'https://zelluloza.ru';
        this.version = '1.0.3';
        this.icon = 'src/ru/zelluloza/icon.png';
        this.parseDate = function (dateString) {
            if (dateString === void 0) { dateString = ''; }
            var _a = dateString.match(/(\d{2})\.(\d{2})\.(\d{4})г (\d{2}):(\d{2})/) || [], day = _a[1], month = _a[2], year = _a[3], hour = _a[4], minute = _a[5];
            if (day && month && year && hour && minute) {
                return (0, dayjs_1.default)(year + '-' + month + '-' + day + ' ' + hour + ':' + minute).format('LLL');
            }
            return null;
        };
        this.resolveUrl = function (path) { return _this.site + '/books/' + path; };
        this.filters = {
            sort: {
                label: 'Сортировка',
                value: '3',
                options: [
                    { label: 'По рейтингу', value: '3' },
                    { label: 'По изменению', value: '0' },
                    { label: 'По длительности чтения', value: '1' },
                    { label: 'По количеству читателей', value: '2' },
                    { label: 'По популярности', value: '4' },
                    { label: 'Самые продаваемые', value: '5' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genres: {
                label: 'Жанры',
                value: '',
                options: [
                    { label: 'Все', value: '' },
                    { label: '16+', value: '204' },
                    { label: '18+', value: '100' },
                    { label: 'Авантюра', value: '347' },
                    { label: 'Альтернативная история', value: '55' },
                    { label: 'Ангст', value: '463' },
                    { label: 'Аниме', value: '405' },
                    { label: 'Антиутопия', value: '21' },
                    { label: 'Апокалипсис', value: '368' },
                    { label: 'Аудиокнига', value: '391' },
                    { label: 'Байки', value: '435' },
                    { label: 'Бизнес-книги', value: '522' },
                    { label: 'Биография', value: '52' },
                    { label: 'Биопанк', value: '379' },
                    { label: 'Боевая фантастика', value: '512' },
                    { label: 'Боевик', value: '61' },
                    { label: 'Боевые искусства', value: '142' },
                    { label: 'Бояръ-аниме', value: '433' },
                    { label: 'Вбоквелл', value: '372' },
                    { label: 'Вестерн', value: '96' },
                    { label: 'Война миров', value: '137' },
                    { label: 'Восточное фэнтези', value: '505' },
                    { label: 'Городское фентези', value: '63' },
                    { label: 'Городское фэнтези', value: '520' },
                    { label: 'Готика', value: '83' },
                    { label: 'Детективы', value: '4' },
                    { label: 'Детские книги', value: '8' },
                    { label: 'Документальные книги', value: '351' },
                    { label: 'Дом и дача', value: '534' },
                    { label: 'Дорожные истории', value: '41' },
                    { label: 'Драма', value: '47' },
                    { label: 'Древняя литература', value: '529' },
                    { label: 'Женский психологический роман', value: '186' },
                    { label: 'Женский роман', value: '141' },
                    { label: 'Зарубежная классика', value: '524' },
                    { label: 'Здоровье и красота', value: '533' },
                    { label: 'Изучение языков', value: '537' },
                    { label: 'Иронический детектив', value: '85' },
                    { label: 'Исследования', value: '156' },
                    { label: 'Историческая литература', value: '3' },
                    { label: 'Исторический любовный роман', value: '518' },
                    { label: 'Историческое фэнтези', value: '90' },
                    { label: 'Киберпанк', value: '7' },
                    { label: 'Классическая литература', value: '9' },
                    { label: 'Книга-игра', value: '371' },
                    { label: 'Книги для родителей', value: '535' },
                    { label: 'Комедия', value: '80' },
                    { label: 'Конкурсные сборники', value: '349' },
                    { label: 'Короткий любовный роман', value: '517' },
                    { label: 'Космическая фантастика', value: '513' },
                    { label: 'Космоопера', value: '58' },
                    { label: 'Криминальная проза', value: '35' },
                    { label: 'Криптоистория', value: '400' },
                    { label: 'Ксенофантастика', value: '102' },
                    { label: 'Культура и искусство', value: '536' },
                    { label: 'Легенды', value: '161' },
                    { label: 'Лирика', value: '49' },
                    { label: 'ЛитРПГ', value: '62' },
                    { label: 'Любовная фантастика', value: '516' },
                    { label: 'Любовное фэнтези', value: '515' },
                    { label: 'Любовный роман', value: '46' },
                    { label: 'Магический реализм', value: '42' },
                    { label: 'Матриархат', value: '385' },
                    { label: 'Медицина', value: '57' },
                    { label: 'Мелодрама', value: '45' },
                    { label: 'Мемуары', value: '532' },
                    { label: 'Метафизика', value: '430' },
                    { label: 'Милитари', value: '126' },
                    { label: 'Мистика', value: '22' },
                    { label: 'Морские приключения', value: '211' },
                    { label: 'Мотивация', value: '135' },
                    { label: 'Научная фантастика', value: '122' },
                    { label: 'Научно-популярная', value: '43' },
                    { label: 'Ненаучная фантастика', value: '387' },
                    { label: 'Новелла', value: '498' },
                    { label: 'Нон-фикшн', value: '507' },
                    { label: 'Нуар', value: '121' },
                    { label: 'О войне', value: '136' },
                    { label: 'Оккультизм', value: '424' },
                    { label: 'Параллельные миры', value: '438' },
                    { label: 'Пародия', value: '108' },
                    { label: 'Подростковая фантастика', value: '27' },
                    { label: 'Подростковый роман', value: '388' },
                    { label: 'Подростковый ужастик', value: '110' },
                    { label: 'Постапокалипсис', value: '82' },
                    { label: 'Постапокалиптика', value: '67' },
                    { label: 'Поэзия', value: '44' },
                    { label: 'Превращение', value: '170' },
                    { label: 'Приключение', value: '497' },
                    { label: 'Приключения', value: '5' },
                    { label: 'Природа и животные', value: '538' },
                    { label: 'Проза', value: '95' },
                    { label: 'Производственный роман', value: '148' },
                    { label: 'Психология', value: '31' },
                    { label: 'Путешествия', value: '383' },
                    { label: 'Рассказы', value: '101' },
                    { label: 'Реализм', value: '422' },
                    { label: 'РеалРПГ', value: '442' },
                    { label: 'Религия', value: '188' },
                    { label: 'Робинзонада', value: '434' },
                    { label: 'Романтика', value: '130' },
                    { label: 'Романтическая фантастика', value: '501' },
                    { label: 'Русская классика', value: '523' },
                    { label: 'Рыцарский роман', value: '112' },
                    { label: 'Символизм', value: '439' },
                    { label: 'Сказки', value: '93' },
                    { label: 'Славянское фэнтези', value: '508' },
                    { label: 'Сновидения', value: '428' },
                    { label: 'Современный любовный роман', value: '519' },
                    { label: 'Социально-психологическая фантастика', value: '98' },
                    { label: 'Спорт', value: '147' },
                    { label: 'Справочники', value: '528' },
                    { label: 'Стимпанк', value: '56' },
                    { label: 'Субкультура', value: '209' },
                    { label: 'Сюрреализм', value: '26' },
                    { label: 'Тёмное фэнтези', value: '437' },
                    { label: 'Техномагия', value: '159' },
                    { label: 'Триллер', value: '6' },
                    { label: 'Трэш', value: '162' },
                    { label: 'Ужасы', value: '531' },
                    { label: 'Утопия', value: '191' },
                    { label: 'Учебник', value: '411' },
                    { label: 'Фантастика', value: '1' },
                    { label: 'Фантастический боевик', value: '38' },
                    { label: 'Фанфик', value: '111' },
                    { label: 'Философия', value: '461' },
                    { label: 'Фурри', value: '394' },
                    { label: 'Фэнтези', value: '2' },
                    { label: 'Хентай', value: '441' },
                    { label: 'Хобби и досуг', value: '530' },
                    { label: 'Хоррор', value: '86' },
                    { label: 'Чёрный юмор', value: '73' },
                    { label: 'Эзотерика', value: '30' },
                    { label: 'Экшн', value: '94' },
                    { label: 'Эпическое фэнтези', value: '499' },
                    { label: 'Эротика', value: '19' },
                    { label: 'Эссе', value: '353' },
                    { label: 'ЭТТИ', value: '502' },
                    { label: 'Юмористическая литература', value: '20' },
                    { label: 'Юмористическая фантастика', value: '514' },
                    { label: 'Юмористическое фэнтези', value: '521' },
                    { label: 'EVE - Миры Содружества', value: '99' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    Zelluloza.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var sort, genres, body, loadedCheerio, novels;
            var _this = this;
            var _c, _d;
            var filters = _b.filters, showLatestNovels = _b.showLatestNovels;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        sort = showLatestNovels ? '0' : ((_c = filters === null || filters === void 0 ? void 0 : filters.sort) === null || _c === void 0 ? void 0 : _c.value) || '3';
                        genres = ((_d = filters === null || filters === void 0 ? void 0 : filters.genres) === null || _d === void 0 ? void 0 : _d.value) || '0';
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/ajaxcall/', {
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    Referer: this.site + '/search/done/#result',
                                    Origin: this.site,
                                },
                                method: 'POST',
                                body: new URLSearchParams({
                                    op: 'morebooks',
                                    par1: '',
                                    par2: "206:0:".concat(genres, ":0.").concat(sort, ".0.0.0.0.0.0.0.0.0.0.0..0..:").concat(pageNo),
                                    par4: '',
                                }).toString(),
                            }).then(function (res) { return res.text(); })];
                    case 1:
                        body = _e.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio('div[style="display: flex;"]').each(function (index, element) {
                            novels.push({
                                name: loadedCheerio(element).find('a[class="txt"]').attr('title') || '',
                                cover: _this.site +
                                    loadedCheerio(element).find('img[class="shadow"]').attr('src'),
                                path: (loadedCheerio(element).find('a[class="txt"]').attr('href') || '').replace(/\D/g, ''),
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    Zelluloza.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, novel, chapters;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.resolveUrl(novelPath)).then(function (res) {
                            return res.text();
                        })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelPath,
                            name: loadedCheerio('h2[class="bookname"]').text().trim(),
                            cover: this.site + loadedCheerio('img[class="shadow"]').attr('src'),
                            genres: loadedCheerio('.gnres span[itemprop="genre"]')
                                .map(function (index, element) { return loadedCheerio(element).text(); })
                                .get()
                                .join(','),
                            summary: loadedCheerio('#bann_full').text() ||
                                loadedCheerio('#bann_short').text(),
                            author: loadedCheerio('.author_link').text(),
                            status: loadedCheerio('.tech_decription').text().includes('Пишется')
                                ? novelStatus_1.NovelStatus.Ongoing
                                : novelStatus_1.NovelStatus.Completed,
                        };
                        chapters = [];
                        loadedCheerio('ul[class="g0"] div[class="w800_m"]').each(function (chapterIndex, element) {
                            var isFree = loadedCheerio(element).find('div[class="chaptfree"]').length;
                            if (isFree) {
                                var chapter = loadedCheerio(element).find('a[class="chptitle"]');
                                var releaseDate = loadedCheerio(element)
                                    .find('div[class="stat"]')
                                    .text();
                                chapters.push({
                                    name: chapter.text().trim(),
                                    path: (chapter.attr('href') || '').split('/').slice(2, 4).join('/'),
                                    releaseTime: _this.parseDate(releaseDate),
                                    chapterNumber: chapterIndex + 1,
                                });
                            }
                        });
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    Zelluloza.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, bookID, chapterID, body, encrypted, decrypted, chapterText;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = chapterPath.split('/'), bookID = _a[0], chapterID = _a[1];
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/ajaxcall/', {
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    Referer: this.resolveUrl(chapterPath),
                                    Origin: this.site,
                                },
                                method: 'POST',
                                body: new URLSearchParams({
                                    op: 'getbook',
                                    par1: bookID,
                                    par2: chapterID,
                                }).toString(),
                            }).then(function (res) { return res.text(); })];
                    case 1:
                        body = _b.sent();
                        encrypted = body.split('<END>')[0].split('\n');
                        decrypted = encrypted
                            .map(function (str) { return decrypt(str); })
                            .join('')
                            .replace(/\r/g, '')
                            .trim();
                        chapterText = decrypted //cosmetic filters
                            .replace(/\[\*]([\s\S]*?)\[\/]/g, '<b>$1</b>')
                            .replace(/\[_]([\s\S]*?)\[\/]/g, '<u>$1</u>')
                            .replace(/\[-]([\s\S]*?)\[\/]/g, '<s>$1</s>')
                            .replace(/\[~]([\s\S]*?)\[\/]/g, '<i>$1</i>');
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    Zelluloza.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var body, loadedCheerio, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/ajaxcall/', {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                Referer: this.site + '/search/done/#result',
                                Origin: this.site,
                            },
                            method: 'POST',
                            body: new URLSearchParams({
                                op: 'morebooks',
                                par1: searchTerm || '',
                                par2: '206:0:0:0.0.0.0.0.0.0.10.0.0.0.0.0..0..:' + pageNo,
                                par4: '',
                            }).toString(),
                        }).then(function (res) { return res.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio = (0, cheerio_1.load)(body);
                        novels = [];
                        loadedCheerio('div[style="display: flex;"]').each(function (index, element) {
                            novels.push({
                                name: loadedCheerio(element).find('a[class="txt"]').attr('title') || '',
                                cover: _this.site +
                                    loadedCheerio(element).find('img[class="shadow"]').attr('src'),
                                path: (loadedCheerio(element).find('a[class="txt"]').attr('href') || '').replace(/\D/g, ''),
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return Zelluloza;
}());
var alphabet = {
    '~': '0',
    'H': '1',
    '^': '2',
    '@': '3',
    'f': '4',
    '0': '5',
    '5': '6',
    'n': '7',
    'r': '8',
    '=': '9',
    'W': 'a',
    'L': 'b',
    '7': 'c',
    ' ': 'd',
    'u': 'e',
    'c': 'f',
};
function decrypt(encrypt) {
    if (!encrypt)
        return '';
    var hexArray = [];
    for (var j = 0; j < encrypt.length; j += 2) {
        var firstChar = encrypt.substring(j, j + 1);
        var secondChar = encrypt.substring(j + 1, j + 2);
        hexArray.push(alphabet[firstChar] + alphabet[secondChar]);
    }
    return '<p>' + decodeURIComponent('%' + hexArray.join('%')) + '</p>';
}
exports.default = new Zelluloza();
