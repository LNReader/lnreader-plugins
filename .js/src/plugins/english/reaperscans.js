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
Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = require("@libs/fetch");
var API_BASE = 'https://api.reaperscans.com';
var MEDIA_BASE = 'https://media.reaperscans.com/file/4SRBHm/';
var ReaperScans = /** @class */ (function () {
    function ReaperScans() {
        this.id = 'reaperscans.com';
        this.name = 'Reaper Scans';
        this.version = '1.0.0';
        this.icon = 'src/en/reaperscans/icon.png';
        this.site = 'https://reaperscans.com';
    }
    ReaperScans.prototype.popularNovels = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.query(page)];
            });
        });
    };
    ReaperScans.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var novelResp, novel, chaptersResp, chapters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(API_BASE, "/series/").concat(novelPath))];
                    case 1:
                        novelResp = _a.sent();
                        return [4 /*yield*/, novelResp.json()];
                    case 2:
                        novel = _a.sent();
                        return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(API_BASE, "/chapters/").concat(novelPath, "?perPage=").concat(Number.MAX_SAFE_INTEGER))];
                    case 3:
                        chaptersResp = _a.sent();
                        return [4 /*yield*/, chaptersResp.json()];
                    case 4:
                        chapters = (_a.sent()).data;
                        return [2 /*return*/, {
                                name: novel.title,
                                cover: this.getCoverUrl(novel.thumbnail),
                                author: novel.author,
                                artist: novel.studio,
                                status: novel.status,
                                rating: novel.rating,
                                summary: novel.description,
                                genres: novel.tags.join(','),
                                path: novelPath,
                                chapters: chapters.reverse().map(function (chapter) { return ({
                                    path: "".concat(novelPath, "/").concat(chapter.chapter_slug),
                                    name: chapter.chapter_name,
                                    chapterNumber: Number.parseFloat(chapter.index),
                                    releaseTime: chapter.created_at.substring(0, 10),
                                }); }),
                            }];
                }
            });
        });
    };
    ReaperScans.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var result, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(this.site, "/series/").concat(chapterPath), {
                            headers: { RSC: '1' },
                        })];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        body = _a.sent();
                        return [2 /*return*/, this.extractChapterContent(body)];
                }
            });
        });
    };
    ReaperScans.prototype.extractChapterContent = function (chapter) {
        var lines = chapter.split('\n');
        var start = lines.findIndex(function (line) { return line.includes('<p'); });
        var prefix = lines[start].substring(0, lines[start].indexOf('<'));
        var commonPrefix = prefix.substring(prefix.indexOf(':'), prefix.indexOf(','));
        var end = lines.lastIndexOf(commonPrefix);
        var content = lines.slice(start, end).join('\n');
        var deduplicated = content.split(commonPrefix)[1];
        return deduplicated.substring(deduplicated.indexOf('<'), deduplicated.lastIndexOf('>') + 1);
    };
    ReaperScans.prototype.searchNovels = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.query(1, searchTerm)];
            });
        });
    };
    ReaperScans.prototype.query = function () {
        return __awaiter(this, arguments, void 0, function (page, search) {
            var link, result, json;
            if (page === void 0) { page = 1; }
            if (search === void 0) { search = ''; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        link = "".concat(API_BASE, "/query?page=").concat(page, "&perPage=20&series_type=Novel&query_string=").concat(search, "&order=desc&orderBy=created_at&adult=true&status=All&tags_ids=[]");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(link)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.json()];
                    case 2:
                        json = _a.sent();
                        return [2 /*return*/, json.data.map(function (novel) { return ({
                                name: novel.title,
                                cover: novel.thumbnail.startsWith('novels/')
                                    ? MEDIA_BASE + novel.thumbnail
                                    : novel.thumbnail,
                                path: novel.series_slug,
                            }); })];
                }
            });
        });
    };
    ReaperScans.prototype.getCoverUrl = function (thumbnail) {
        return thumbnail.startsWith('novels/') ? MEDIA_BASE + thumbnail : thumbnail;
    };
    return ReaperScans;
}());
exports.default = new ReaperScans();
