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
var dayjs_1 = __importDefault(require("dayjs"));
var novelOvh = /** @class */ (function () {
    function novelOvh() {
        var _this = this;
        this.id = 'novelovh';
        this.name = 'НовелОВХ';
        this.site = 'https://novel.ovh';
        this.apiSite = 'https://api.novel.ovh/v2/';
        this.version = '1.0.3';
        this.icon = 'src/ru/novelovh/icon.png';
        this.jsonToHtml = function (json, image, html) {
            if (html === void 0) { html = ''; }
            json.forEach(function (element) {
                var _a, _b;
                switch (element.type) {
                    case 'image':
                        if ((_b = (_a = element.attrs) === null || _a === void 0 ? void 0 : _a.pages) === null || _b === void 0 ? void 0 : _b[0]) {
                            html += "<img src=\"".concat(image[element.attrs.pages[0]], "\"/>");
                        }
                        break;
                    case 'hardBreak':
                        html += '<br>';
                        break;
                    case 'horizontalRule':
                    case 'delimiter':
                        html += '<h2 style="text-align: center">***</h2>';
                        break;
                    case 'paragraph':
                        html +=
                            '<p>' +
                                (element.content
                                    ? _this.jsonToHtml(element.content, image)
                                    : '<br>') +
                                '</p>';
                        break;
                    case 'orderedList':
                        html +=
                            '<ol>' +
                                (element.content
                                    ? _this.jsonToHtml(element.content, image)
                                    : '<br>') +
                                '</ol>';
                        break;
                    case 'listItem':
                        html +=
                            '<li>' +
                                (element.content
                                    ? _this.jsonToHtml(element.content, image)
                                    : '<br>') +
                                '</li>';
                        break;
                    case 'blockquote':
                        html +=
                            '<blockquote>' +
                                (element.content
                                    ? _this.jsonToHtml(element.content, image)
                                    : '<br>') +
                                '</blockquote>';
                        break;
                    case 'italic':
                        html +=
                            '<i>' +
                                (element.content
                                    ? _this.jsonToHtml(element.content, image)
                                    : '<br>') +
                                '</i>';
                        break;
                    case 'bold':
                        html +=
                            '<b>' +
                                (element.content
                                    ? _this.jsonToHtml(element.content, image)
                                    : '<br>') +
                                '</b>';
                        break;
                    case 'underline':
                        html +=
                            '<u>' +
                                (element.content
                                    ? _this.jsonToHtml(element.content, image)
                                    : '<br>') +
                                '</u>';
                        break;
                    case 'heading':
                        html +=
                            '<h2>' +
                                (element.content
                                    ? _this.jsonToHtml(element.content, image)
                                    : '<br>') +
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
        };
        this.resolveUrl = function (path) { return _this.site + '/content/' + path; };
        this.filters = {
            sort: {
                label: 'Сортировка',
                value: 'averageRating',
                options: [
                    { label: 'Кол-во просмотров', value: 'viewsCount' },
                    { label: 'Кол-во лайков', value: 'likesCount' },
                    { label: 'Кол-во глав', value: 'chaptersCount' },
                    { label: 'Кол-во закладок', value: 'bookmarksCount' },
                    { label: 'Рейтингу', value: 'averageRating' },
                    { label: 'Дате создания', value: 'createdAt' },
                    { label: 'Дате обновления', value: 'updatedAt' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    novelOvh.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var url, books, novels;
            var _c;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        url = this.apiSite + 'books?page=' + (pageNo - 1);
                        url +=
                            '&sort=' +
                                (showLatestNovels
                                    ? 'updatedAt'
                                    : ((_c = filters === null || filters === void 0 ? void 0 : filters.sort) === null || _c === void 0 ? void 0 : _c.value) || 'averageRating') +
                                ',desc';
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (res) { return res.json(); })];
                    case 1:
                        books = _d.sent();
                        novels = [];
                        books.forEach(function (novel) {
                            return novels.push({
                                name: novel.name.ru,
                                cover: novel.poster,
                                path: novel.slug,
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    novelOvh.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, book, branches, chapters, novel, branch_name, chaptersRes;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site +
                            '/content/' +
                            novelPath +
                            '?_data=routes/reader/book/$slug/index').then(function (res) { return res.json(); })];
                    case 1:
                        _a = _e.sent(), book = _a.book, branches = _a.branches, chapters = _a.chapters;
                        novel = {
                            path: novelPath,
                            name: book.name.ru,
                            cover: book.poster,
                            genres: (_c = (_b = book.labels) === null || _b === void 0 ? void 0 : _b.map) === null || _c === void 0 ? void 0 : _c.call(_b, function (label) { return label.name; }).join(','),
                            summary: book.description,
                            status: book.status == 'ONGOING' ? novelStatus_1.NovelStatus.Ongoing : novelStatus_1.NovelStatus.Completed,
                        };
                        (_d = book.relations) === null || _d === void 0 ? void 0 : _d.forEach(function (person) {
                            switch (person.type) {
                                case 'AUTHOR':
                                    novel.author = person.publisher.name;
                                    break;
                                case 'ARTIST':
                                    novel.artist = person.publisher.name;
                                    break;
                            }
                        });
                        branch_name = {};
                        if (branches.length) {
                            branches.forEach(function (_a) {
                                var id = _a.id, publishers = _a.publishers;
                                if (id && (publishers === null || publishers === void 0 ? void 0 : publishers.length))
                                    branch_name[id] = publishers[0].name || 'Неизвестный';
                            });
                        }
                        chaptersRes = [];
                        chapters.forEach(function (chapter, chapterIndex) {
                            return chaptersRes.push({
                                name: chapter.title ||
                                    'Том ' +
                                        (chapter.volume || 0) +
                                        ' ' +
                                        (chapter.name ||
                                            'Глава ' + (chapter.number || chapters.length - chapterIndex)),
                                path: novelPath + '/' + chapter.id,
                                releaseTime: (0, dayjs_1.default)(chapter.createdAt).format('LLL'),
                                chapterNumber: chapters.length - chapterIndex,
                                page: branch_name[chapter.branchId] || 'Главная страница',
                            });
                        });
                        novel.chapters = chaptersRes.reverse();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    novelOvh.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var book, image, chapterText;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.apiSite + 'chapters/' + chapterPath.split('/')[1]).then(function (res) { return res.json(); })];
                    case 1:
                        book = _b.sent();
                        image = Object.fromEntries(((_a = book === null || book === void 0 ? void 0 : book.pages) === null || _a === void 0 ? void 0 : _a.map(function (_a) {
                            var id = _a.id, image = _a.image;
                            return [id, image];
                        })) || []);
                        chapterText = this.jsonToHtml(book.content.content || [], image);
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    novelOvh.prototype.searchNovels = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var url, books, novels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.apiSite + 'books?type=NOVEL&search=' + searchTerm;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (res) { return res.json(); })];
                    case 1:
                        books = _a.sent();
                        novels = [];
                        books.forEach(function (novel) {
                            return novels.push({
                                name: novel.name.ru,
                                cover: novel.poster,
                                path: novel.slug,
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return novelOvh;
}());
exports.default = new novelOvh();
