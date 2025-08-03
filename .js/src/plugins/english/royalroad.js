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
var htmlparser2_1 = require("htmlparser2");
var fetch_1 = require("@libs/fetch");
var filterInputs_1 = require("@libs/filterInputs");
var novelStatus_1 = require("@libs/novelStatus");
var isAbsoluteUrl_1 = require("@libs/isAbsoluteUrl");
var RoyalRoad = /** @class */ (function () {
    function RoyalRoad() {
        this.id = 'royalroad';
        this.name = 'Royal Road';
        this.version = '2.2.3';
        this.icon = 'src/en/royalroad/icon.png';
        this.site = 'https://www.royalroad.com/';
        this.filters = {
            'keyword': {
                'type': filterInputs_1.FilterTypes.TextInput,
                'label': 'Keyword (title or description)',
                'value': '',
            },
            'author': {
                'type': filterInputs_1.FilterTypes.TextInput,
                'label': 'Author',
                'value': '',
            },
            'genres': {
                'type': filterInputs_1.FilterTypes.ExcludableCheckboxGroup,
                'label': 'Genres',
                'value': {
                    'include': [],
                    'exclude': [],
                },
                'options': [
                    {
                        'label': 'Action',
                        'value': 'action',
                    },
                    {
                        'label': 'Adventure',
                        'value': 'adventure',
                    },
                    {
                        'label': 'Comedy',
                        'value': 'comedy',
                    },
                    {
                        'label': 'Contemporary',
                        'value': 'contemporary',
                    },
                    {
                        'label': 'Drama',
                        'value': 'drama',
                    },
                    {
                        'label': 'Fantasy',
                        'value': 'fantasy',
                    },
                    {
                        'label': 'Historical',
                        'value': 'historical',
                    },
                    {
                        'label': 'Horror',
                        'value': 'horror',
                    },
                    {
                        'label': 'Mystery',
                        'value': 'mystery',
                    },
                    {
                        'label': 'Psychological',
                        'value': 'psychological',
                    },
                    {
                        'label': 'Romance',
                        'value': 'romance',
                    },
                    {
                        'label': 'Satire',
                        'value': 'satire',
                    },
                    {
                        'label': 'Sci-fi',
                        'value': 'sci_fi',
                    },
                    {
                        'label': 'Short Story',
                        'value': 'one_shot',
                    },
                    {
                        'label': 'Tragedy',
                        'value': 'tragedy',
                    },
                ],
            },
            'tags': {
                'type': filterInputs_1.FilterTypes.ExcludableCheckboxGroup,
                'label': 'Tags',
                'value': {
                    'include': [],
                    'exclude': [],
                },
                'options': [
                    {
                        'label': 'Anti-Hero Lead',
                        'value': 'anti-hero_lead',
                    },
                    {
                        'label': 'Artificial Intelligence',
                        'value': 'artificial_intelligence',
                    },
                    {
                        'label': 'Attractive Lead',
                        'value': 'attractive_lead',
                    },
                    {
                        'label': 'Cyberpunk',
                        'value': 'cyberpunk',
                    },
                    {
                        'label': 'Dungeon',
                        'value': 'dungeon',
                    },
                    {
                        'label': 'Dystopia',
                        'value': 'dystopia',
                    },
                    {
                        'label': 'Female Lead',
                        'value': 'female_lead',
                    },
                    {
                        'label': 'First Contact',
                        'value': 'first_contact',
                    },
                    {
                        'label': 'GameLit',
                        'value': 'gamelit',
                    },
                    {
                        'label': 'Gender Bender',
                        'value': 'gender_bender',
                    },
                    {
                        'label': 'Genetically Engineered',
                        'value': 'genetically_engineered ',
                    },
                    {
                        'label': 'Grimdark',
                        'value': 'grimdark',
                    },
                    {
                        'label': 'Hard Sci-fi',
                        'value': 'hard_sci-fi',
                    },
                    {
                        'label': 'Harem',
                        'value': 'harem',
                    },
                    {
                        'label': 'High Fantasy',
                        'value': 'high_fantasy',
                    },
                    {
                        'label': 'LitRPG',
                        'value': 'litrpg',
                    },
                    {
                        'label': 'Low Fantasy',
                        'value': 'low_fantasy',
                    },
                    {
                        'label': 'Magic',
                        'value': 'magic',
                    },
                    {
                        'label': 'Male Lead',
                        'value': 'male_lead',
                    },
                    {
                        'label': 'Martial Arts',
                        'value': 'martial_arts',
                    },
                    {
                        'label': 'Multiple Lead Characters',
                        'value': 'multiple_lead',
                    },
                    {
                        'label': 'Mythos',
                        'value': 'mythos',
                    },
                    {
                        'label': 'Non-Human Lead',
                        'value': 'non-human_lead',
                    },
                    {
                        'label': 'Portal Fantasy / Isekai',
                        'value': 'summoned_hero',
                    },
                    {
                        'label': 'Post Apocalyptic',
                        'value': 'post_apocalyptic',
                    },
                    {
                        'label': 'Progression',
                        'value': 'progression',
                    },
                    {
                        'label': 'Reader Interactive',
                        'value': 'reader_interactive',
                    },
                    {
                        'label': 'Reincarnation',
                        'value': 'reincarnation',
                    },
                    {
                        'label': 'Ruling Class',
                        'value': 'ruling_class',
                    },
                    {
                        'label': 'School Life',
                        'value': 'school_life',
                    },
                    {
                        'label': 'Secret Identity',
                        'value': 'secret_identity',
                    },
                    {
                        'label': 'Slice of Life',
                        'value': 'slice_of_life',
                    },
                    {
                        'label': 'Soft Sci-fi',
                        'value': 'soft_sci-fi',
                    },
                    {
                        'label': 'Space Opera',
                        'value': 'space_opera',
                    },
                    {
                        'label': 'Sports',
                        'value': 'sports',
                    },
                    {
                        'label': 'Steampunk',
                        'value': 'steampunk',
                    },
                    {
                        'label': 'Strategy',
                        'value': 'strategy',
                    },
                    {
                        'label': 'Strong Lead',
                        'value': 'strong_lead',
                    },
                    {
                        'label': 'Super Heroes',
                        'value': 'super_heroes',
                    },
                    {
                        'label': 'Supernatural',
                        'value': 'supernatural',
                    },
                    {
                        'label': 'Technologically Engineered',
                        'value': 'technologically_engineered',
                    },
                    {
                        'label': 'Time Loop',
                        'value': 'loop',
                    },
                    {
                        'label': 'Time Travel',
                        'value': 'time_travel',
                    },
                    {
                        'label': 'Urban Fantasy',
                        'value': 'urban_fantasy',
                    },
                    {
                        'label': 'Villainous Lead',
                        'value': 'villainous_lead',
                    },
                    {
                        'label': 'Virtual Reality',
                        'value': 'virtual_reality',
                    },
                    {
                        'label': 'War and Military',
                        'value': 'war_and_military',
                    },
                    {
                        'label': 'Wuxia',
                        'value': 'wuxia',
                    },
                    {
                        'label': 'Xianxia',
                        'value': 'xianxia',
                    },
                ],
            },
            'content_warnings': {
                'type': filterInputs_1.FilterTypes.ExcludableCheckboxGroup,
                'label': 'Content Warnings',
                'value': {
                    'include': [],
                    'exclude': [],
                },
                'options': [
                    {
                        'label': 'Profanity',
                        'value': 'profanity',
                    },
                    {
                        'label': 'Sexual Content',
                        'value': 'sexuality',
                    },
                    {
                        'label': 'Graphic Violence',
                        'value': 'graphic_violence',
                    },
                    {
                        'label': 'Sensitive Content',
                        'value': 'sensitive',
                    },
                    {
                        'label': 'AI-Assisted Content',
                        'value': 'ai_assisted',
                    },
                    {
                        'label': 'AI-Generated Content',
                        'value': 'ai_generated',
                    },
                ],
            },
            'minPages': {
                'type': filterInputs_1.FilterTypes.TextInput,
                'label': 'Min Pages',
                'value': '0',
            },
            'maxPages': {
                'type': filterInputs_1.FilterTypes.TextInput,
                'label': 'Max Pages',
                'value': '20000',
            },
            'minRating': {
                'type': filterInputs_1.FilterTypes.TextInput,
                'label': 'Min Rating (0.0 - 5.0)',
                'value': '0.0',
            },
            'maxRating': {
                'type': filterInputs_1.FilterTypes.TextInput,
                'label': 'Max Rating (0.0 - 5.0)',
                'value': '5.0',
            },
            'status': {
                'type': filterInputs_1.FilterTypes.Picker,
                'label': 'Status',
                'value': 'ALL',
                'options': [
                    {
                        'label': 'All',
                        'value': 'ALL',
                    },
                    {
                        'label': 'Completed',
                        'value': 'COMPLETED',
                    },
                    {
                        'label': 'Dropped',
                        'value': 'DROPPED',
                    },
                    {
                        'label': 'Ongoing',
                        'value': 'ONGOING',
                    },
                    {
                        'label': 'Hiatus',
                        'value': 'HIATUS',
                    },
                    {
                        'label': 'Stub',
                        'value': 'STUB',
                    },
                ],
            },
            'orderBy': {
                'type': filterInputs_1.FilterTypes.Picker,
                'label': 'Order by',
                'value': 'relevance',
                'options': [
                    {
                        'label': 'Relevance',
                        'value': 'relevance',
                    },
                    {
                        'label': 'Popularity',
                        'value': 'popularity',
                    },
                    {
                        'label': 'Average Rating',
                        'value': 'rating',
                    },
                    {
                        'label': 'Last Update',
                        'value': 'last_update',
                    },
                    {
                        'label': 'Release Date',
                        'value': 'release_date',
                    },
                    {
                        'label': 'Followers',
                        'value': 'followers',
                    },
                    {
                        'label': 'Number of Pages',
                        'value': 'length',
                    },
                    {
                        'label': 'Views',
                        'value': 'views',
                    },
                    {
                        'label': 'Title',
                        'value': 'title',
                    },
                    {
                        'label': 'Author',
                        'value': 'author',
                    },
                ],
            },
            'dir': {
                'type': filterInputs_1.FilterTypes.Picker,
                'label': 'Direction',
                'value': 'desc',
                'options': [
                    {
                        'label': 'Ascending',
                        'value': 'asc',
                    },
                    {
                        'label': 'Descending',
                        'value': 'desc',
                    },
                ],
            },
            'type': {
                'type': filterInputs_1.FilterTypes.Picker,
                'label': 'Type',
                'value': 'ALL',
                'options': [
                    {
                        'label': 'All',
                        'value': 'ALL',
                    },
                    {
                        'label': 'Fan Fiction',
                        'value': 'fanfiction',
                    },
                    {
                        'label': 'Original',
                        'value': 'original',
                    },
                ],
            },
        };
    }
    RoyalRoad.prototype.parseNovels = function (html) {
        var baseUrl = this.site;
        var novels = [];
        var tempNovel = {};
        var state = ParsingState.Idle;
        var parser = new htmlparser2_1.Parser({
            onopentag: function (name, attribs) {
                var _a;
                if ((_a = attribs['class']) === null || _a === void 0 ? void 0 : _a.includes('fiction-list-item')) {
                    state = ParsingState.Novel;
                }
                if (state !== ParsingState.Novel)
                    return;
                switch (name) {
                    case 'a':
                        if (attribs['href']) {
                            tempNovel.path = attribs['href'].split('/').slice(1, 3).join('/');
                        }
                        break;
                    case 'img':
                        if (attribs['src']) {
                            tempNovel.name = attribs['alt'] || '';
                            tempNovel.cover = !(0, isAbsoluteUrl_1.isUrlAbsolute)(attribs['src'])
                                ? baseUrl + attribs['src'].slice(1)
                                : attribs['src'];
                        }
                        break;
                }
            },
            onclosetag: function (name) {
                if (name === 'figure') {
                    if (tempNovel.path && tempNovel.name) {
                        novels.push(tempNovel);
                        tempNovel = {};
                    }
                    state = ParsingState.Idle;
                }
            },
        });
        parser.write(html);
        parser.end();
        return novels;
    };
    RoyalRoad.prototype.popularNovels = function (page_1, _a) {
        return __awaiter(this, arguments, void 0, function (page, _b) {
            var params, key, _i, _c, include, _d, _e, exclude, link, body;
            var filters = _b.filters, showLatestNovels = _b.showLatestNovels;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        params = new URLSearchParams({
                            page: page.toString(),
                        });
                        if (showLatestNovels) {
                            params.append('orderBy', 'last_update');
                        }
                        if (!filters)
                            filters = this.filters || {};
                        for (key in filters) {
                            if (filters[key].value === '')
                                continue;
                            if (key === 'genres' || key === 'tags' || key === 'content_warnings') {
                                if (filters[key].value.include) {
                                    for (_i = 0, _c = filters[key].value.include; _i < _c.length; _i++) {
                                        include = _c[_i];
                                        params.append('tagsAdd', include);
                                    }
                                }
                                if (filters[key].value.exclude) {
                                    for (_d = 0, _e = filters[key].value.exclude; _d < _e.length; _d++) {
                                        exclude = _e[_d];
                                        params.append('tagsRemove', exclude);
                                    }
                                }
                            }
                            else {
                                params.append(key, String(filters[key].value));
                            }
                        }
                        link = "".concat(this.site, "fictions/search?").concat(params.toString());
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(link).then(function (r) { return r.text(); })];
                    case 1:
                        body = _f.sent();
                        return [2 /*return*/, this.parseNovels(body)];
                }
            });
        });
    };
    RoyalRoad.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var result, html, novel, baseUrl, state, statusText, statusSpanCounter, nameParts, summaryParts, scriptContentParts, genreArray, chapterJson, volumeJson, parser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + novelPath)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        html = _a.sent();
                        novel = {
                            path: novelPath,
                        };
                        baseUrl = this.site;
                        state = ParsingState.Idle;
                        statusText = '';
                        statusSpanCounter = 0;
                        nameParts = [];
                        summaryParts = [];
                        scriptContentParts = [];
                        genreArray = [];
                        chapterJson = [];
                        volumeJson = [];
                        parser = new htmlparser2_1.Parser({
                            onopentag: function (name, attribs) {
                                var _a, _b, _c, _d;
                                switch (name) {
                                    case 'h1':
                                        state = ParsingState.InTitle;
                                        break;
                                    case 'a':
                                        if (((_a = attribs['href']) === null || _a === void 0 ? void 0 : _a.startsWith('/profile/')) && !novel.author) {
                                            state = ParsingState.InAuthor;
                                        }
                                        else if (state === ParsingState.InTags) {
                                            state = ParsingState.InTagLink;
                                        }
                                        break;
                                    case 'div':
                                        if (attribs['class'] === 'description') {
                                            state = ParsingState.InDescription;
                                        }
                                        break;
                                    case 'hr':
                                        if (state === ParsingState.InDescription) {
                                            summaryParts.push('\n\n---\n\n');
                                        }
                                        break;
                                    case 'br':
                                        if (state === ParsingState.InDescription) {
                                            summaryParts.push('\n\n');
                                        }
                                        break;
                                    case 'span':
                                        if ((_b = attribs['class']) === null || _b === void 0 ? void 0 : _b.includes('tags')) {
                                            state = ParsingState.InTags;
                                        }
                                        else if ((_c = attribs['class']) === null || _c === void 0 ? void 0 : _c.includes('label-sm')) {
                                            statusSpanCounter++;
                                            if (statusSpanCounter === 2) {
                                                state = ParsingState.InStatusSpan;
                                                statusText = '';
                                            }
                                        }
                                        break;
                                    case 'img':
                                        if ((_d = attribs['class']) === null || _d === void 0 ? void 0 : _d.includes('thumbnail')) {
                                            novel.cover = attribs['src'];
                                            if (novel.cover && !(0, isAbsoluteUrl_1.isUrlAbsolute)(novel.cover)) {
                                                novel.cover = baseUrl + novel.cover.slice(1);
                                            }
                                        }
                                        break;
                                    case 'script':
                                        state = ParsingState.InScript;
                                        break;
                                }
                            },
                            ontext: function (text) {
                                var trimmedText = text.trim();
                                if (!trimmedText && state !== ParsingState.InScript)
                                    return;
                                switch (state) {
                                    case ParsingState.InTitle:
                                        nameParts.push(text);
                                        break;
                                    case ParsingState.InAuthor:
                                        novel.author = trimmedText;
                                        break;
                                    case ParsingState.InDescription:
                                        summaryParts.push(text);
                                        break;
                                    case ParsingState.InStatusSpan:
                                        statusText = trimmedText;
                                        break;
                                    case ParsingState.InTagLink:
                                        genreArray.push(trimmedText);
                                        break;
                                    case ParsingState.InScript:
                                        scriptContentParts.push(text);
                                        break;
                                }
                            },
                            onclosetag: function (name) {
                                switch (name) {
                                    case 'h1':
                                        if (state === ParsingState.InTitle) {
                                            novel.name = nameParts.join('').trim();
                                            state = ParsingState.Idle;
                                        }
                                        break;
                                    case 'a':
                                        if (state === ParsingState.InTagLink) {
                                            state = ParsingState.InTags;
                                        }
                                        else if (state === ParsingState.InAuthor) {
                                            state = ParsingState.Idle;
                                        }
                                        break;
                                    case 'p':
                                        if (state === ParsingState.InDescription) {
                                            summaryParts.push('\n\n');
                                        }
                                        break;
                                    case 'div':
                                        if (state === ParsingState.InDescription) {
                                            novel.summary = summaryParts
                                                .join('')
                                                .replace(/&nbsp;/g, ' ')
                                                .replace(/\n{3,}/g, '\n\n')
                                                .trim();
                                            summaryParts.length = 0;
                                            state = ParsingState.Idle;
                                        }
                                        break;
                                    case 'span':
                                        if (state === ParsingState.InTags) {
                                            novel.genres = genreArray.join(', ');
                                            state = ParsingState.Idle;
                                        }
                                        else if (state === ParsingState.InStatusSpan) {
                                            state = ParsingState.Idle;
                                        }
                                        break;
                                    case 'script':
                                        if (state === ParsingState.InScript) {
                                            state = ParsingState.Idle;
                                            var scriptContent = scriptContentParts.join('');
                                            var chapterMatch = scriptContent.match(/window\.chapters\s*=\s*(\[.*?\]);/);
                                            var volumeMatch = scriptContent.match(/window\.volumes\s*=\s*(\[.*?\]);/);
                                            if (chapterMatch === null || chapterMatch === void 0 ? void 0 : chapterMatch[1]) {
                                                chapterJson = JSON.parse(chapterMatch[1]);
                                            }
                                            if (volumeMatch === null || volumeMatch === void 0 ? void 0 : volumeMatch[1]) {
                                                volumeJson = JSON.parse(volumeMatch[1]);
                                            }
                                        }
                                        break;
                                }
                            },
                            onend: function () {
                                switch (statusText) {
                                    case 'ONGOING':
                                        novel.status = novelStatus_1.NovelStatus.Ongoing;
                                        break;
                                    case 'HIATUS':
                                        novel.status = novelStatus_1.NovelStatus.OnHiatus;
                                        break;
                                    case 'COMPLETED':
                                        novel.status = novelStatus_1.NovelStatus.Completed;
                                        break;
                                    default:
                                        novel.status = novelStatus_1.NovelStatus.Unknown;
                                }
                                novel.chapters = chapterJson.map(function (chapter) {
                                    var matchingVolume = volumeJson.find(function (volume) { return volume.id === chapter.volumeId; });
                                    return {
                                        name: chapter.title,
                                        path: (function () {
                                            var parts = chapter.url.split('/');
                                            return "".concat(parts[1], "/").concat(parts[2], "/").concat(parts[4], "/").concat(parts[5]);
                                        })(),
                                        releaseTime: chapter.date,
                                        chapterNumber: chapter === null || chapter === void 0 ? void 0 : chapter.order,
                                        page: matchingVolume === null || matchingVolume === void 0 ? void 0 : matchingVolume.title,
                                    };
                                });
                            },
                        });
                        parser.write(html);
                        parser.end();
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    RoyalRoad.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var result, html, state, stateDepth, depth, chapterHtmlParts, notesHtmlParts, beforeNotesParts, afterNotesParts, isBeforeChapter, match, hiddenClass, stateBeforeHidden, escapeRegex, escapeMap, escapeHtml, parser;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.fetchApi)(this.site + chapterPath)];
                    case 1:
                        result = _b.sent();
                        return [4 /*yield*/, result.text()];
                    case 2:
                        html = _b.sent();
                        state = ParsingState.Idle;
                        stateDepth = 0;
                        depth = 0;
                        chapterHtmlParts = [];
                        notesHtmlParts = [];
                        beforeNotesParts = [];
                        afterNotesParts = [];
                        isBeforeChapter = true;
                        match = html.match(/<style>\n\s+.(.+?){[^{]+?display: none;/);
                        hiddenClass = (_a = match === null || match === void 0 ? void 0 : match[1]) === null || _a === void 0 ? void 0 : _a.trim();
                        stateBeforeHidden = null;
                        escapeRegex = /[&<>"']/g;
                        escapeMap = {
                            '&': '&amp;',
                            '<': '&lt;',
                            '>': '&gt;',
                            '"': '&quot;',
                            "'": '&#39;',
                        };
                        escapeHtml = function (text) {
                            return escapeRegex.test(text)
                                ? ((escapeRegex.lastIndex = 0),
                                    text.replace(escapeRegex, function (char) { return escapeMap[char]; }))
                                : text;
                        };
                        parser = new htmlparser2_1.Parser({
                            onopentag: function (name, attribs) {
                                depth++;
                                var classes = attribs['class'] || '';
                                if (state !== ParsingState.InHidden &&
                                    hiddenClass &&
                                    classes.includes(hiddenClass)) {
                                    stateBeforeHidden = { state: state, depth: stateDepth };
                                    state = ParsingState.InHidden;
                                    stateDepth = depth;
                                    return;
                                }
                                switch (state) {
                                    case ParsingState.Idle:
                                        if (classes.includes('chapter-content')) {
                                            state = ParsingState.InChapter;
                                            stateDepth = depth;
                                            isBeforeChapter = false;
                                        }
                                        else if (classes.includes('author-note-portlet')) {
                                            state = ParsingState.InNote;
                                            stateDepth = depth;
                                        }
                                        break;
                                    case ParsingState.InHidden:
                                        return;
                                }
                                if (state === ParsingState.InChapter || state === ParsingState.InNote) {
                                    var tag = "<".concat(name);
                                    for (var attr in attribs) {
                                        var value = attribs[attr].replace(/"/g, '&quot;');
                                        tag += " ".concat(attr, "=\"").concat(value, "\"");
                                    }
                                    tag += '>';
                                    if (state === ParsingState.InChapter) {
                                        chapterHtmlParts.push(tag);
                                    }
                                    else {
                                        notesHtmlParts.push(tag);
                                    }
                                }
                            },
                            ontext: function (text) {
                                switch (state) {
                                    case ParsingState.InChapter:
                                        chapterHtmlParts.push(escapeHtml(text));
                                        break;
                                    case ParsingState.InNote:
                                        notesHtmlParts.push(escapeHtml(text));
                                        break;
                                }
                            },
                            onclosetag: function (name) {
                                if (depth === stateDepth) {
                                    switch (state) {
                                        case ParsingState.InHidden:
                                            if (!stateBeforeHidden) {
                                                state = ParsingState.Idle; // Attempt recovery
                                                stateDepth = 0;
                                            }
                                            else {
                                                state = stateBeforeHidden.state;
                                                stateDepth = stateBeforeHidden.depth;
                                                stateBeforeHidden = null;
                                            }
                                            depth--;
                                            return;
                                        case ParsingState.InChapter:
                                            chapterHtmlParts.push("</div>");
                                            state = ParsingState.Idle;
                                            stateDepth = 0;
                                            depth--;
                                            return;
                                        case ParsingState.InNote:
                                            var noteClass = "author-note-".concat(isBeforeChapter ? 'before' : 'after');
                                            var notesHtml = notesHtmlParts.join('').trim();
                                            var fullNote = "<div class=\"".concat(noteClass, "\">").concat(notesHtml, "</div>");
                                            if (isBeforeChapter) {
                                                beforeNotesParts.push(fullNote);
                                            }
                                            else {
                                                afterNotesParts.push(fullNote);
                                            }
                                            notesHtmlParts.length = 0;
                                            state = ParsingState.Idle;
                                            stateDepth = 0;
                                            depth--;
                                            return;
                                    }
                                }
                                else if (state === ParsingState.InChapter ||
                                    state === ParsingState.InNote) {
                                    if (!parser['isVoidElement'](name)) {
                                        var closingTag = "</".concat(name, ">");
                                        if (state === ParsingState.InChapter) {
                                            chapterHtmlParts.push(closingTag);
                                        }
                                        else {
                                            notesHtmlParts.push(closingTag);
                                        }
                                    }
                                }
                                depth--;
                            },
                        });
                        parser.write(html);
                        parser.end();
                        return [2 /*return*/, [
                                beforeNotesParts.length > 0 ? beforeNotesParts.join('') : null,
                                chapterHtmlParts.length > 0 ? chapterHtmlParts.join('').trim() : null,
                                afterNotesParts.length > 0 ? afterNotesParts.join('') : null,
                            ]
                                .filter(Boolean)
                                .join('\n<hr class="notes-separator">\n')];
                }
            });
        });
    };
    RoyalRoad.prototype.searchNovels = function (searchTerm, page) {
        return __awaiter(this, void 0, void 0, function () {
            var params, searchUrl, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams({
                            page: page.toString(),
                            title: searchTerm,
                            globalFilters: 'true',
                        });
                        searchUrl = "".concat(this.site, "fictions/search?").concat(params.toString());
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(searchUrl).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        return [2 /*return*/, this.parseNovels(body)];
                }
            });
        });
    };
    return RoyalRoad;
}());
exports.default = new RoyalRoad();
var ParsingState;
(function (ParsingState) {
    ParsingState[ParsingState["Idle"] = 0] = "Idle";
    ParsingState[ParsingState["InTitle"] = 1] = "InTitle";
    ParsingState[ParsingState["InAuthor"] = 2] = "InAuthor";
    ParsingState[ParsingState["InDescription"] = 3] = "InDescription";
    ParsingState[ParsingState["InTags"] = 4] = "InTags";
    ParsingState[ParsingState["InTagLink"] = 5] = "InTagLink";
    ParsingState[ParsingState["InStatusSpan"] = 6] = "InStatusSpan";
    ParsingState[ParsingState["InScript"] = 7] = "InScript";
    ParsingState[ParsingState["InNote"] = 8] = "InNote";
    ParsingState[ParsingState["InChapter"] = 9] = "InChapter";
    ParsingState[ParsingState["InHidden"] = 10] = "InHidden";
    ParsingState[ParsingState["Novel"] = 11] = "Novel";
})(ParsingState || (ParsingState = {}));
