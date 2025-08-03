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
var UA_RANOBE_ID = 'uaranobeclub';
var UA_RANOBE_URL = 'https://uaranobe.club/';
var UaRanobeClubApi = /** @class */ (function () {
    function UaRanobeClubApi() {
    }
    UaRanobeClubApi.fetch = function (query, variables) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)("".concat(UA_RANOBE_URL, "graphql"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                query: query,
                                variables: variables,
                            }),
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    UaRanobeClubApi.fetchChapter = function (slug, writingSlug) {
        return __awaiter(this, void 0, void 0, function () {
            var query, variables, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n            query EpisodeBySlug($slug: String!, $writingSlug: String!) {\n                episodeBySlug(slug: $slug, writingSlug: $writingSlug) {\n                    text\n                }\n            }\n        ";
                        variables = {
                            slug: slug,
                            writingSlug: writingSlug,
                        };
                        return [4 /*yield*/, UaRanobeClubApi.fetch(query, variables)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.episodeBySlug.text];
                }
            });
        });
    };
    UaRanobeClubApi.fetchNovel = function (slug) {
        return __awaiter(this, void 0, void 0, function () {
            var query, variables, response;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        query = "\n        query Writing($slug: String!) {\n          writingBySlug(slug: $slug) {\n            id\n            title\n            originalTitle\n            image\n            slug\n            description\n            scanlators {\n              scanlator {\n                scanlatorName\n                username\n                episodes(oldestFirst: false, slug: $slug) {\n                  id\n                  subId\n                  seqTitle\n                  title\n                  slug\n                  __typename\n                }\n                __typename\n              }\n              __typename\n            }\n            genres {\n              genreId\n              genre {\n                id\n                name\n                __typename\n              }\n              __typename\n            }\n            __typename\n          }\n        }\n      ";
                        variables = { slug: slug };
                        return [4 /*yield*/, UaRanobeClubApi.fetch(query, variables)];
                    case 1:
                        response = _c.sent();
                        return [2 /*return*/, (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.writingBySlug) !== null && _b !== void 0 ? _b : ''];
                }
            });
        });
    };
    UaRanobeClubApi.fetchListWithNovel = function () {
        return __awaiter(this, arguments, void 0, function (skip, search) {
            var query, variables, response;
            if (skip === void 0) { skip = 0; }
            if (search === void 0) { search = ''; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n        query Writings($skip: Int!, $search: String) {\n          writingsCount(search: $search)\n          writings(skip: $skip, search: $search) {\n            id\n            title\n            image\n            slug\n            __typename\n          }\n        }\n      ";
                        variables = {
                            skip: skip,
                            search: search,
                        };
                        return [4 /*yield*/, UaRanobeClubApi.fetch(query, variables)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    return UaRanobeClubApi;
}());
var UaRanobeClub = /** @class */ (function () {
    function UaRanobeClub() {
        this.id = UA_RANOBE_ID;
        this.name = 'UA Ranobe Club';
        this.site = UA_RANOBE_URL;
        this.version = '1.1.4';
        this.icon = "src/uk/".concat(this.id, "/icon.png");
    }
    UaRanobeClub.prototype.popularNovels = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var skip, data, novelItems;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        skip = (page - 1) * 10;
                        return [4 /*yield*/, UaRanobeClubApi.fetchListWithNovel(skip, '')];
                    case 1:
                        data = _b.sent();
                        novelItems = ((_a = data === null || data === void 0 ? void 0 : data.writings) !== null && _a !== void 0 ? _a : []).map(function (_a) {
                            var title = _a.title, image = _a.image, slug = _a.slug;
                            return ({
                                name: title,
                                cover: image,
                                path: slug,
                            });
                        });
                        return [2 /*return*/, novelItems];
                }
            });
        });
    };
    UaRanobeClub.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var slug, data, chapters, sourceNovel;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        slug = novelPath.split(UA_RANOBE_URL).join('');
                        return [4 /*yield*/, UaRanobeClubApi.fetchNovel(slug)];
                    case 1:
                        data = _f.sent();
                        chapters = ((_d = (_c = (_b = (_a = data.scanlators) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.scanlator) === null || _c === void 0 ? void 0 : _c.episodes) === null || _d === void 0 ? void 0 : _d.map(function (_a) {
                            var title = _a.title, seqTitle = _a.seqTitle, chapterSlug = _a.slug, subId = _a.subId;
                            return ({
                                name: "".concat(seqTitle, ". ").concat(title),
                                path: chapterSlug + "#".concat(slug),
                                chapterNumber: parseInt(subId, 10), // Предполагаем, что subId это число
                            });
                        })) || [];
                        sourceNovel = {
                            genres: ((_e = data.genres) === null || _e === void 0 ? void 0 : _e.map(function (_a) {
                                var genre = _a.genre;
                                return genre.name;
                            }).join(',')) || '',
                            chapters: chapters,
                            name: data.title,
                            path: data.slug,
                            summary: data.description,
                            cover: data.image,
                        };
                        return [2 /*return*/, sourceNovel];
                }
            });
        });
    };
    UaRanobeClub.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, slug, writingSlug, chapterText;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = chapterPath
                            .split(UA_RANOBE_URL)
                            .join('')
                            .split('#'), slug = _a[0], writingSlug = _a[1];
                        return [4 /*yield*/, UaRanobeClubApi.fetchChapter(slug, writingSlug)];
                    case 1:
                        chapterText = _b.sent();
                        return [2 /*return*/, chapterText];
                }
            });
        });
    };
    UaRanobeClub.prototype.searchNovels = function (searchTerm, page) {
        return __awaiter(this, void 0, void 0, function () {
            var skip, data, novelItems;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        skip = (page - 1) * 10;
                        return [4 /*yield*/, UaRanobeClubApi.fetchListWithNovel(skip, searchTerm)];
                    case 1:
                        data = _b.sent();
                        novelItems = ((_a = data === null || data === void 0 ? void 0 : data.writings) !== null && _a !== void 0 ? _a : []).map(function (_a) {
                            var title = _a.title, image = _a.image, slug = _a.slug;
                            return ({
                                name: title,
                                cover: image,
                                path: slug,
                            });
                        });
                        return [2 /*return*/, novelItems];
                }
            });
        });
    };
    return UaRanobeClub;
}());
exports.default = new UaRanobeClub();
