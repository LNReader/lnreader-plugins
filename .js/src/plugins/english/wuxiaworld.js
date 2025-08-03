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
var cheerio_1 = require("cheerio");
var fetch_1 = require("@libs/fetch");
var novelStatus_1 = require("@libs/novelStatus");
var NovelItem_Status;
(function (NovelItem_Status) {
    NovelItem_Status[NovelItem_Status["Finished"] = 0] = "Finished";
    NovelItem_Status[NovelItem_Status["Active"] = 1] = "Active";
    NovelItem_Status[NovelItem_Status["Hiatus"] = 2] = "Hiatus";
    NovelItem_Status[NovelItem_Status["All"] = -1] = "All";
})(NovelItem_Status || (NovelItem_Status = {}));
var WuxiaWorld = /** @class */ (function () {
    function WuxiaWorld() {
        this.id = 'wuxiaworld';
        this.name = 'Wuxia World';
        this.icon = 'src/en/wuxiaworld/icon.png';
        this.site = 'https://www.wuxiaworld.com/';
        this.apiSite = 'https://api2.wuxiaworld.com/wuxiaworld.api.v2.';
        this.version = '0.5.1';
        this.proto = "\n    syntax = \"proto3\";\n    option optimize_for = CODE_SIZE;\n    package wuxiaworld.api.v2;\n\n    import public \"google/protobuf/wrappers.proto\";\n    import public \"google/protobuf/timestamp.proto\";\n    \n    message StringValue {\n        // The string value.\n        string value = 1;\n    }\n    \n    message BoolValue {\n        // The bool value.\n        bool value = 1;\n    }\n    \n    message Int32Value {\n        // The int32 value.\n        int32 value = 1;\n    }\n    \n    message DecimalValue {\n        // Whole units part of the amount\n        int64 units = 1;\n        // Nano units of the amount (10^-9)\n        // Must be the same sign as units\n        sfixed32 nanos = 2;\n    }\n    \n    message Timestamp {\n        int64 seconds = 1;\n        int32 nanos = 2;\n    }\n\n    message RelatedChapterUserInfo {\n        optional BoolValue isChapterUnlocked = 1;\n        optional BoolValue isNovelUnlocked = 2;\n        optional BoolValue isChapterFavorite = 3;\n        optional BoolValue isNovelOwned = 4;\n        optional BoolValue isChapterOwned = 5;\n    }\n\n    message ChapterNovelInfo {\n        int32 id = 1;\n        string name = 2;\n        optional StringValue coverUrl = 3;\n        string slug = 4;\n    }\n    \n    message ChapterParagraph {\n        string id = 1;\n        int32 chapterId = 2;\n        int32 totalComments = 3;\n        optional StringValue content = 4;\n    }\n    \n    message ChapterItem {\n        int32 entityId = 1;\n        string name = 2;\n        string slug = 3;\n        optional DecimalValue number = 4;\n        optional StringValue content = 5;\n        int32 novelId = 6;\n        bool visible = 7;\n        bool isTeaser = 8;\n        optional Timestamp whenToPublish = 9;\n        bool spoilerTitle = 10;\n        bool allowComments = 11;\n        optional ChapterNovelInfo novelInfo = 14;\n        optional RelatedChapterUserInfo relatedUserInfo = 16;\n        int32 offset = 17;\n        optional Timestamp publishedAt = 18;\n        optional StringValue translatorThoughts = 19;\n        repeated ChapterParagraph paragraphs = 21;\n    }\n    \n    message ChapterGroupCounts {\n        int32 total = 1;\n        int32 advance = 2;\n        int32 normal = 3;\n    }\n    \n    message ChapterGroupItem {\n        int32 id = 1;\n        string title = 2;\n        int32 order = 3;\n        optional DecimalValue fromChapterNumber = 4;\n        optional DecimalValue toChapterNumber = 5;\n        repeated ChapterItem chapterList = 6;\n        optional ChapterGroupCounts counts = 7;\n    }\n    \n    message GetChapterListRequest {\n        int32 novelId = 1;\n        message BaseChapterInfo {\n            oneof chapterInfo {\n                int32 chapterId = 1;\n                string slug = 2;\n                int32 offset = 3;\n            }\n        }\n        message FilterChapters {\n            optional Int32Value chapterGroupId = 1;\n            optional BoolValue isAdvanceChapter = 2;\n            optional BaseChapterInfo baseChapter = 3;\n        }\n        optional FilterChapters filter = 2;\n        optional Int32Value count = 3;\n    }\n    \n    message GetChapterListResponse {\n        repeated ChapterGroupItem items = 1;\n        optional ChapterNovelInfo novelInfo = 2;\n    }\n\n    message GetChapterByProperty {\n        message ByNovelAndChapterSlug {\n            string novelSlug = 1;\n            string chapterSlug = 2;\n        }\n        oneof byProperty {\n            int32 chapterId = 1;\n            ByNovelAndChapterSlug slugs = 2;\n        }\n    }\n    \n    message GetChapterRequest {\n        optional GetChapterByProperty chapterProperty = 1;\n    }\n    \n    message GetChapterResponse {\n        optional ChapterItem item = 1;\n    }\n\n    message NovelKarmaInfo {\n        bool isActive = 1;\n        bool isFree = 2;\n        optional DecimalValue maxFreeChapter = 3;\n        bool canUnlockWithVip = 4;\n    }\n\n    message NovelItem {\n        int32 id = 1;\n        string name = 2;\n        string slug = 3;\n        enum Status {\n            Finished = 0;\n            Active = 1;\n            Hiatus = 2;\n            All = -1;\n        }\n        Status status = 4;\n        bool visible = 7;\n        optional StringValue description = 8;\n        optional StringValue synopsis = 9;\n        optional StringValue coverUrl = 10;\n        optional StringValue translatorName = 11;\n        optional StringValue authorName = 13;\n        optional NovelKarmaInfo karmaInfo = 14;\n        repeated string genres = 16;\n    }\n\n    message GetNovelRequest {\n        oneof selector {\n            int32 id = 1;\n            string slug = 2;\n        }\n    }\n    \n    message GetNovelResponse {\n        optional NovelItem item = 1;\n    }\n\n    service Chapters {\n        rpc GetChapterList(GetChapterListRequest) returns (GetChapterListResponse);\n        rpc GetChapter(GetChapterRequest) returns (GetChapterResponse);\n    }\n\n    service Novels {\n        rpc GetNovel(GetNovelRequest) returns (GetNovelResponse);\n    }\n    ";
    }
    WuxiaWorld.prototype.parseNovels = function (data) {
        var novels = [];
        data.items.map(function (novel) {
            var name = novel.name;
            var cover = novel.coverUrl;
            var path = "novel/".concat(novel.slug, "/");
            novels.push({
                name: name,
                cover: cover,
                path: path,
            });
        });
        return novels;
    };
    WuxiaWorld.prototype.popularNovels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var link, result, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        link = "".concat(this.site, "api/novels");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(link)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.json()];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, this.parseNovels(data)];
                }
            });
        });
    };
    WuxiaWorld.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var data, novel, status, list, freeChapter, chapter;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
            return __generator(this, function (_u) {
                switch (_u.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchProto)({
                            proto: this.proto,
                            requestType: 'GetNovelRequest',
                            responseType: 'GetNovelResponse',
                            requestData: { slug: novelPath.split('/')[1] },
                        }, this.apiSite + 'Novels/GetNovel', {
                            headers: {
                                'Content-Type': 'application/grpc-web+proto',
                            },
                        })];
                    case 1:
                        data = _u.sent();
                        novel = {
                            path: novelPath,
                            name: ((_a = data.item) === null || _a === void 0 ? void 0 : _a.name) || 'Untitled',
                            cover: (_c = (_b = data.item) === null || _b === void 0 ? void 0 : _b.coverUrl) === null || _c === void 0 ? void 0 : _c.value,
                            summary: (0, cheerio_1.load)(((_e = (_d = data.item) === null || _d === void 0 ? void 0 : _d.description) === null || _e === void 0 ? void 0 : _e.value) + '\n\n' + ((_g = (_f = data.item) === null || _f === void 0 ? void 0 : _f.synopsis) === null || _g === void 0 ? void 0 : _g.value)).text(),
                            author: (_j = (_h = data.item) === null || _h === void 0 ? void 0 : _h.authorName) === null || _j === void 0 ? void 0 : _j.value,
                            genres: (_k = data.item) === null || _k === void 0 ? void 0 : _k.genres.join(','),
                            chapters: [],
                        };
                        status = (_l = data.item) === null || _l === void 0 ? void 0 : _l.status;
                        switch (status) {
                            case NovelItem_Status.Active:
                                novel.status = novelStatus_1.NovelStatus.Ongoing;
                                break;
                            case NovelItem_Status.Hiatus:
                                novel.status = novelStatus_1.NovelStatus.OnHiatus;
                                break;
                            case NovelItem_Status.All:
                                novel.status = novelStatus_1.NovelStatus.Unknown;
                                break;
                            default:
                                novel.status = novelStatus_1.NovelStatus.Completed;
                        }
                        return [4 /*yield*/, (0, fetch_1.fetchProto)({
                                proto: this.proto,
                                requestType: 'GetChapterListRequest',
                                responseType: 'GetChapterListResponse',
                                requestData: { novelId: (_m = data.item) === null || _m === void 0 ? void 0 : _m.id },
                            }, this.apiSite + 'Chapters/GetChapterList', {
                                headers: {
                                    'Content-Type': 'application/grpc-web+proto',
                                },
                            })];
                    case 2:
                        list = _u.sent();
                        freeChapter = Number((_q = (_p = (_o = data.item) === null || _o === void 0 ? void 0 : _o.karmaInfo) === null || _p === void 0 ? void 0 : _p.maxFreeChapter) === null || _q === void 0 ? void 0 : _q.units) +
                            (((_t = (_s = (_r = data.item) === null || _r === void 0 ? void 0 : _r.karmaInfo) === null || _s === void 0 ? void 0 : _s.maxFreeChapter) === null || _t === void 0 ? void 0 : _t.nanos) || 0) / 1000000000 || 50;
                        chapter = list.items.flatMap(function (ChapterGroupItem) {
                            return ChapterGroupItem.chapterList.map(function (chapterItem) {
                                var _a, _b, _c, _d, _e, _f;
                                return ({
                                    page: ChapterGroupItem.title,
                                    name: chapterItem.name +
                                        (((_b = (_a = chapterItem.relatedUserInfo) === null || _a === void 0 ? void 0 : _a.isChapterUnlocked) === null || _b === void 0 ? void 0 : _b.value) === false ||
                                            (!chapterItem.relatedUserInfo &&
                                                Number((_c = chapterItem.number) === null || _c === void 0 ? void 0 : _c.units) +
                                                    (((_d = chapterItem.number) === null || _d === void 0 ? void 0 : _d.nanos) || 0) / 1000000000 >
                                                    freeChapter)
                                            ? ' 🔒'
                                            : ''),
                                    path: novelPath + chapterItem.slug,
                                    chapterNumber: chapterItem.offset,
                                    releaseTime: new Date((((_e = chapterItem.publishedAt) === null || _e === void 0 ? void 0 : _e.seconds) || 0) * 1000 +
                                        (((_f = chapterItem.publishedAt) === null || _f === void 0 ? void 0 : _f.nanos) || 0) / 1000000).toISOString(),
                                });
                            });
                        });
                        novel.chapters = chapter;
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    WuxiaWorld.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var paths, data, chapterText;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        paths = chapterPath.split('/');
                        return [4 /*yield*/, (0, fetch_1.fetchProto)({
                                proto: this.proto,
                                requestType: 'GetChapterRequest',
                                responseType: 'GetChapterResponse',
                                requestData: {
                                    chapterProperty: {
                                        slugs: {
                                            novelSlug: paths[1],
                                            chapterSlug: paths[2],
                                        },
                                    },
                                },
                            }, this.apiSite + 'Chapters/GetChapter', {
                                headers: {
                                    'Content-Type': 'application/grpc-web+proto',
                                },
                            })];
                    case 1:
                        data = _c.sent();
                        chapterText = ((_b = (_a = data.item) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.value) || '';
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    WuxiaWorld.prototype.searchNovels = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + 'api/novels/search?query=' + encodeURIComponent(searchTerm);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.json()];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, this.parseNovels(data)];
                }
            });
        });
    };
    return WuxiaWorld;
}());
exports.default = new WuxiaWorld();
