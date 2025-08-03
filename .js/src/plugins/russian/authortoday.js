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
var defaultCover_1 = require("@libs/defaultCover");
var fetch_1 = require("@libs/fetch");
var novelStatus_1 = require("@libs/novelStatus");
var htmlparser2_1 = require("htmlparser2");
var dayjs_1 = __importDefault(require("dayjs"));
var AuthorToday = /** @class */ (function () {
    function AuthorToday() {
        var _this = this;
        this.id = 'AT';
        this.name = 'Автор Тудей';
        this.icon = 'src/ru/authortoday/icon.png';
        this.site = 'https://author.today';
        this.version = '1.2.0';
        this.userAgent = 'Mozilla/5.0 (Android 15; Mobile; rv:138.0) Gecko/138.0 Firefox/138.0';
        this.resolveUrl = function (path, isNovel) {
            return _this.site + (isNovel ? '/work/' : '/reader/') + path;
        };
        this.filters = {
            sort: {
                label: 'Сортировка',
                value: 'popular',
                options: [
                    { label: 'По популярности', value: 'popular' },
                    { label: 'По количеству лайков', value: 'likes' },
                    { label: 'По комментариям', value: 'comments' },
                    { label: 'По новизне', value: 'recent' },
                    { label: 'По просмотрам', value: 'views' },
                    { label: 'Набирающие популярность', value: 'trending' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genre: {
                label: 'Жанры',
                value: '',
                options: [
                    { label: 'Все', value: '' },
                    { label: 'Альтернативная история', value: 'sf-history' },
                    { label: 'Антиутопия', value: 'dystopia' },
                    { label: 'Бизнес-литература', value: 'biznes-literatura' },
                    { label: 'Боевая фантастика', value: 'sf-action' },
                    { label: 'Боевик', value: 'action' },
                    { label: 'Боевое фэнтези', value: 'fantasy-action' },
                    { label: 'Бояръ-Аниме', value: 'boyar-anime' },
                    { label: 'Героическая фантастика', value: 'sf-heroic' },
                    { label: 'Героическое фэнтези', value: 'heroic-fantasy' },
                    { label: 'Городское фэнтези', value: 'urban-fantasy' },
                    { label: 'Детектив', value: 'detective' },
                    { label: 'Детская литература', value: 'detskaya-literatura' },
                    { label: 'Документальная проза', value: 'non-fiction' },
                    { label: 'Историческая проза', value: 'historical-fiction' },
                    { label: 'Исторические приключения', value: 'historical-adventure' },
                    { label: 'Исторический детектив', value: 'historical-mystery' },
                    { label: 'Исторический любовный роман', value: 'historical-romance' },
                    { label: 'Историческое фэнтези', value: 'historical-fantasy' },
                    { label: 'Киберпанк', value: 'cyberpunk' },
                    { label: 'Короткий любовный роман', value: 'short-romance' },
                    { label: 'Космическая фантастика', value: 'sf-space' },
                    { label: 'ЛитРПГ', value: 'litrpg' },
                    { label: 'Любовное фэнтези', value: 'love-fantasy' },
                    { label: 'Любовные романы', value: 'romance' },
                    { label: 'Мистика', value: 'paranormal' },
                    { label: 'Назад в СССР', value: 'back-to-ussr' },
                    { label: 'Научная фантастика', value: 'science-fiction' },
                    { label: 'Подростковая проза', value: 'teen-prose' },
                    { label: 'Политический роман', value: 'political-fiction' },
                    { label: 'Попаданцы', value: 'popadantsy' },
                    { label: 'Попаданцы в космос', value: 'popadantsy-v-kosmos' },
                    {
                        label: 'Попаданцы в магические миры',
                        value: 'popadantsy-v-magicheskie-miry',
                    },
                    { label: 'Попаданцы во времени', value: 'popadantsy-vo-vremeni' },
                    { label: 'Постапокалипсис', value: 'postapocalyptic' },
                    { label: 'Поэзия', value: 'poetry' },
                    { label: 'Приключения', value: 'adventure' },
                    { label: 'Публицистика', value: 'publicism' },
                    { label: 'Развитие личности', value: 'razvitie-lichnosti' },
                    { label: 'Разное', value: 'other' },
                    { label: 'РеалРПГ', value: 'realrpg' },
                    { label: 'Романтическая эротика', value: 'romantic-erotika' },
                    { label: 'Сказка', value: 'fairy-tale' },
                    { label: 'Современная проза', value: 'modern-prose' },
                    { label: 'Современный любовный роман', value: 'contemporary-romance' },
                    { label: 'Социальная фантастика', value: 'sf-social' },
                    { label: 'Стимпанк', value: 'steampunk' },
                    { label: 'Темное фэнтези', value: 'dark-fantasy' },
                    { label: 'Триллер', value: 'thriller' },
                    { label: 'Ужасы', value: 'horror' },
                    { label: 'Фантастика', value: 'sci-fi' },
                    {
                        label: 'Фантастический детектив',
                        value: 'detective-science-fiction',
                    },
                    { label: 'Фанфик', value: 'fanfiction' },
                    { label: 'Фэнтези', value: 'fantasy' },
                    { label: 'Шпионский детектив', value: 'spy-mystery' },
                    { label: 'Эпическое фэнтези', value: 'epic-fantasy' },
                    { label: 'Эротика', value: 'erotica' },
                    { label: 'Эротическая фантастика', value: 'sf-erotika' },
                    { label: 'Эротический фанфик', value: 'fanfiction-erotika' },
                    { label: 'Эротическое фэнтези', value: 'fantasy-erotika' },
                    { label: 'Юмор', value: 'humor' },
                    { label: 'Юмористическая фантастика', value: 'sf-humor' },
                    { label: 'Юмористическое фэнтези', value: 'ironical-fantasy' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            form: {
                label: 'Форма произведения',
                value: '',
                options: [
                    { label: 'Любой', value: '' },
                    { label: 'Перевод', value: 'translation' },
                    { label: 'Повесть', value: 'tale' },
                    { label: 'Рассказ', value: 'story' },
                    { label: 'Роман', value: 'novel' },
                    { label: 'Сборник поэзии', value: 'poetry' },
                    { label: 'Сборник рассказов', value: 'story-book' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            state: {
                label: 'Статус произведения',
                value: '',
                options: [
                    { label: 'Любой статус', value: '' },
                    { label: 'В процессе', value: 'in-progress' },
                    { label: 'Завершено', value: 'finished' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            series: {
                label: 'Статус цикла',
                value: '',
                options: [
                    { label: 'Не важно', value: '' },
                    { label: 'Вне цикла', value: 'out' },
                    { label: 'Цикл завершен', value: 'finished' },
                    { label: 'Цикл не завершен', value: 'unfinished' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            access: {
                label: 'Тип доступа',
                value: '',
                options: [
                    { label: 'Любой', value: '' },
                    { label: 'Платный', value: 'paid' },
                    { label: 'Бесплатный', value: 'free' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            promo: {
                label: 'Промо-фрагмент',
                value: 'hide',
                options: [
                    { label: 'Скрывать', value: 'hide' },
                    { label: 'Показывать', value: 'show' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    AuthorToday.prototype.parseNovels = function (url) {
        return (0, fetch_1.fetchApi)(url, { headers: { 'User-Agent': this.userAgent } })
            .then(function (res) { return res.text(); })
            .then(function (html) {
            var novels = [];
            var tempNovel = {};
            var isParsingNovel = false;
            var isParsingName = false;
            var parser = new htmlparser2_1.Parser({
                onopentag: function (name, attribs) {
                    if (name === 'a' &&
                        attribs['class'] === 'work-row item-link item-content' &&
                        attribs['href']) {
                        tempNovel.path = attribs['href'].replace(/\D/g, '');
                        isParsingNovel = true;
                    }
                    if (isParsingNovel &&
                        name === 'h4' &&
                        attribs['class'] === 'work-title') {
                        isParsingName = true;
                    }
                    if (isParsingNovel &&
                        name === 'img' &&
                        attribs['alt'] === 'Обложка') {
                        tempNovel.cover = attribs['data-src'];
                    }
                },
                ontext: function (data) {
                    if (isParsingName) {
                        tempNovel.name = data.trim();
                    }
                },
                onclosetag: function (name) {
                    if (name === 'h4') {
                        isParsingName = false;
                    }
                    if (name === 'a' && isParsingNovel) {
                        if (!tempNovel.cover) {
                            tempNovel.cover = defaultCover_1.defaultCover;
                        }
                        novels.push(tempNovel);
                        tempNovel = {};
                        isParsingNovel = false;
                    }
                },
            });
            parser.write(html);
            parser.end();
            return novels;
        });
    };
    AuthorToday.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var url;
            var _c, _d, _e, _f, _g, _h, _j;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_k) {
                url = this.site + '/work/genre/' + (((_c = filters === null || filters === void 0 ? void 0 : filters.genre) === null || _c === void 0 ? void 0 : _c.value) || 'all');
                url +=
                    '?sorting=' +
                        (showLatestNovels ? 'recent' : ((_d = filters === null || filters === void 0 ? void 0 : filters.sort) === null || _d === void 0 ? void 0 : _d.value) || 'popular');
                if ((_e = filters === null || filters === void 0 ? void 0 : filters.form) === null || _e === void 0 ? void 0 : _e.value)
                    url += '&form=' + filters.form.value;
                if ((_f = filters === null || filters === void 0 ? void 0 : filters.state) === null || _f === void 0 ? void 0 : _f.value)
                    url += '&state=' + filters.state.value;
                if ((_g = filters === null || filters === void 0 ? void 0 : filters.series) === null || _g === void 0 ? void 0 : _g.value)
                    url += '&series=' + filters.series.value;
                if ((_h = filters === null || filters === void 0 ? void 0 : filters.access) === null || _h === void 0 ? void 0 : _h.value)
                    url += '&access=' + filters.access.value;
                if ((_j = filters === null || filters === void 0 ? void 0 : filters.promo) === null || _j === void 0 ? void 0 : _j.value)
                    url += '&promo=' + filters.promo.value;
                url += '&page=' + pageNo;
                return [2 /*return*/, this.parseNovels(url)];
            });
        });
    };
    AuthorToday.prototype.parseNovel = function (workID) {
        return __awaiter(this, void 0, void 0, function () {
            var html, novel, chapters, isParsingName, isParsingAuthor, isReadingSummary, isParsingGenres, isParsingStatus, isParsingChapter, isReadingChapterName, tempChapter, parser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.resolveUrl(workID, true), {
                            headers: { 'User-Agent': this.userAgent },
                        }).then(function (res) { return res.text(); })];
                    case 1:
                        html = _a.sent();
                        novel = {
                            path: workID,
                            name: '',
                            author: '',
                            summary: '',
                        };
                        chapters = [];
                        isParsingName = false;
                        isParsingAuthor = false;
                        isReadingSummary = false;
                        isParsingGenres = false;
                        isParsingStatus = false;
                        isParsingChapter = false;
                        isReadingChapterName = false;
                        tempChapter = {};
                        parser = new htmlparser2_1.Parser({
                            onopentag: function (name, attribs) {
                                if (name === 'h1' && attribs['class'] === 'card-title') {
                                    isParsingName = true;
                                }
                                if (name === 'img' && attribs['class'] === 'cover-image') {
                                    novel.cover = attribs['src'];
                                }
                                if (name === 'a' &&
                                    attribs['href'] &&
                                    attribs['href'].endsWith('/works')) {
                                    isParsingAuthor = true;
                                }
                                if (name === 'div' && attribs['class'] === 'rich-content') {
                                    isReadingSummary = true;
                                }
                                if (name === 'br' && isReadingSummary) {
                                    novel.summary += '\n';
                                }
                                if (name === 'noindex') {
                                    isParsingGenres = true;
                                    if (novel.genres)
                                        novel.genres = '';
                                }
                                if (name === 'label' && attribs['class'].includes('label')) {
                                    isParsingStatus = true;
                                }
                                if (name === 'li' && attribs['class'] === 'clearfix') {
                                    isParsingChapter = true;
                                }
                                if (name === 'a' && isParsingChapter && attribs['href']) {
                                    isReadingChapterName = true;
                                    tempChapter.path = attribs.href.replace('/reader/', '');
                                }
                                if (name === 'span' && attribs['data-time']) {
                                    tempChapter.releaseTime = (0, dayjs_1.default)(attribs['data-time']).format('LLL');
                                }
                            },
                            ontext: function (data) {
                                if (isParsingName) {
                                    novel.name = data.trim();
                                    isParsingName = false;
                                }
                                if (isParsingAuthor && data.trim()) {
                                    novel.author += data.trim() + ', ';
                                }
                                if (isReadingSummary) {
                                    novel.summary += data.trim();
                                }
                                if (isParsingGenres) {
                                    novel.genres += data;
                                }
                                if (isParsingStatus) {
                                    var status_1 = data.trim();
                                    switch (status_1) {
                                        case 'в процессе':
                                            novel.status = novelStatus_1.NovelStatus.Ongoing;
                                            break;
                                        case 'весь текст':
                                            novel.status = novelStatus_1.NovelStatus.Completed;
                                            break;
                                        default:
                                            novel.status = novelStatus_1.NovelStatus.Unknown;
                                            break;
                                    }
                                }
                                if (isReadingChapterName) {
                                    tempChapter.name = data.trim();
                                    isReadingChapterName = false;
                                }
                            },
                            onclosetag: function (name) {
                                var _a;
                                if (name === 'div' && isParsingAuthor) {
                                    isParsingAuthor = false;
                                    novel.author = (_a = novel.author) === null || _a === void 0 ? void 0 : _a.slice(0, -2);
                                }
                                if (name === 'div' && isReadingSummary) {
                                    isReadingSummary = false;
                                }
                                if (name === 'noindex') {
                                    isParsingGenres = false;
                                }
                                if (name === 'label') {
                                    isParsingStatus = false;
                                }
                                if (name === 'li' && isParsingChapter) {
                                    tempChapter.chapterNumber = chapters.length;
                                    if (tempChapter.path) {
                                        chapters === null || chapters === void 0 ? void 0 : chapters.push(tempChapter);
                                    }
                                    tempChapter = {};
                                    isParsingChapter = false;
                                }
                            },
                        });
                        parser.write(html);
                        parser.end();
                        if (!novel.cover) {
                            novel.cover = defaultCover_1.defaultCover;
                        }
                        if (!chapters.length) {
                            chapters.push({
                                name: 'Рассказ',
                                path: workID,
                            });
                        }
                        novel.chapters = chapters;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    AuthorToday.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var html, _a, workID, chapterID, userRaw, userId, chapter, chapterJson, key, chapterText;
            var _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.resolveUrl(chapterPath), {
                            headers: { 'User-Agent': this.userAgent },
                        }).then(function (res) { return res.text(); })];
                    case 1:
                        html = _f.sent();
                        _a = chapterPath.split('/'), workID = _a[0], chapterID = _a[1];
                        userRaw = (_c = (_b = html.match(/userId:(.*?),/)) === null || _b === void 0 ? void 0 : _b[1]) === null || _c === void 0 ? void 0 : _c.trim();
                        userId = userRaw === 'null' ? '' : userRaw;
                        if (!chapterID) {
                            chapterID = ((_e = (_d = html.match(/chapterId:(.*?),/)) === null || _d === void 0 ? void 0 : _d[1]) === null || _e === void 0 ? void 0 : _e.trim()) || '';
                        }
                        if (!chapterID)
                            throw new Error('Chapter ID not found');
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + '/reader/' + workID + '/chapter?id=' + chapterID, {
                                headers: { 'User-Agent': this.userAgent },
                            })];
                    case 2:
                        chapter = _f.sent();
                        return [4 /*yield*/, chapter.json()];
                    case 3:
                        chapterJson = _f.sent();
                        key = chapter.headers.get('reader-secret');
                        if (!key)
                            throw new Error('Failed to find the token\n' + chapterJson.messages);
                        chapterText = decrypt(chapterJson.data.text, key, userId);
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    AuthorToday.prototype.searchNovels = function (searchTerm_1) {
        return __awaiter(this, arguments, void 0, function (searchTerm, pageNo) {
            var url;
            if (pageNo === void 0) { pageNo = 1; }
            return __generator(this, function (_a) {
                url = this.site + '/search?category=works&q=' + searchTerm + '&page=' + pageNo;
                return [2 /*return*/, this.parseNovels(url)];
            });
        });
    };
    return AuthorToday;
}());
exports.default = new AuthorToday();
function decrypt(encrypt, encryptedKey, userId) {
    if (userId === void 0) { userId = ''; }
    var key = encryptedKey.split('').reverse().join('') + '@_@' + userId;
    var keyBytes = key.split('').map(function (char) { return char.charCodeAt(0); });
    var keyLength = keyBytes.length;
    var text = '';
    for (var i = 0; i < encrypt.length; i++) {
        text += String.fromCharCode(encrypt.charCodeAt(i) ^ keyBytes[i % keyLength]);
    }
    return text;
}
