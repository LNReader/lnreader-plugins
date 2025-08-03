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
var filterInputs_1 = require("@libs/filterInputs");
/**
 * Example for novel API:
 * https://genesistudio.com/novels/dlh/__data.json?x-sveltekit-invalidated=001
 * -> to view novel remove '__data.json?x-sveltekit-invalidated=001'
 *
 * Example for chapter API:
 * https://genesistudio.com/viewer/2443/__data.json?x-sveltekit-invalidated=001
 * -> to view chapter remove '__data.json?x-sveltekit-invalidated=001'
 */
var Genesis = /** @class */ (function () {
    function Genesis() {
        this.id = 'genesistudio';
        this.name = 'Genesis';
        this.icon = 'src/en/genesis/icon.png';
        this.customCSS = 'src/en/genesis/customCSS.css';
        this.site = 'https://genesistudio.com';
        this.version = '1.1.2';
        this.imageRequestInit = {
            headers: {
                'referrer': this.site,
            },
        };
        this.filters = {
            sort: {
                label: 'Sort Results By',
                value: 'Popular',
                options: [
                    { label: 'Popular', value: 'Popular' },
                    { label: 'Recent', value: 'Recent' },
                    { label: 'Views', value: 'Views' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            storyStatus: {
                label: 'Status',
                value: 'All',
                options: [
                    { label: 'All', value: 'All' },
                    { label: 'Ongoing', value: 'Ongoing' },
                    { label: 'Completed', value: 'Completed' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
            genres: {
                label: 'Genres',
                value: [],
                options: [
                    { label: 'Action', value: 'Action' },
                    { label: 'Comedy', value: 'Comedy' },
                    { label: 'Drama', value: 'Drama' },
                    { label: 'Fantasy', value: 'Fantasy' },
                    { label: 'Harem', value: 'Harem' },
                    { label: 'Martial Arts', value: 'Martial Arts' },
                    { label: 'Modern', value: 'Modern' },
                    { label: 'Mystery', value: 'Mystery' },
                    { label: 'Psychological', value: 'Psychological' },
                    { label: 'Romance', value: 'Romance' },
                    { label: 'Slice of life', value: 'Slice of Life' },
                    { label: 'Tragedy', value: 'Tragedy' },
                ],
                type: filterInputs_1.FilterTypes.CheckboxGroup,
            },
        };
    }
    Genesis.prototype.parseNovels = function (json) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, json.map(function (novel) { return ({
                        name: novel.novel_title,
                        path: "/novels/".concat(novel.abbreviation),
                        cover: novel.cover,
                    }); })];
            });
        });
    };
    Genesis.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var link, json;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (pageNo !== 1)
                            return [2 /*return*/, []];
                        link = "".concat(this.site, "/api/novels/search?");
                        if (showLatestNovels) {
                            link += 'serialization=All&sort=Recent';
                        }
                        else {
                            if (filters === null || filters === void 0 ? void 0 : filters.genres.value.length) {
                                link += 'genres=' + filters.genres.value.join('&genres=') + '&';
                            }
                            if (filters === null || filters === void 0 ? void 0 : filters.storyStatus.value) {
                                link += 'serialization=' + "".concat(filters.storyStatus.value) + '&';
                            }
                            if (filters === null || filters === void 0 ? void 0 : filters.sort.value) {
                                link += 'sort=' + "".concat(filters.sort.value);
                            }
                        }
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(link).then(function (r) { return r.json(); })];
                    case 1:
                        json = _c.sent();
                        return [2 /*return*/, this.parseNovels(json)];
                }
            });
        });
    };
    // Helper function to extract novel data from nodes
    Genesis.prototype.extractData = function (nodes) {
        return nodes
            .filter(function (node) { return node.type === 'data'; })
            .map(function (node) { return node.data; })[0];
    };
    Genesis.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, json, nodes, data, novel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site).concat(novelPath, "/__data.json?x-sveltekit-invalidated=001");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.json(); })];
                    case 1:
                        json = _a.sent();
                        nodes = json.nodes;
                        data = this.extractData(nodes);
                        novel = {
                            path: novelPath,
                            name: '',
                            cover: '',
                            summary: '',
                            author: '',
                            status: 'Unknown',
                            chapters: [],
                        };
                        // Parse and assign novel metadata (title, cover, summary, author, etc.)
                        this.populateNovelMetadata(novel, data);
                        // Parse the chapters if available and assign them to the novel object
                        novel.chapters = this.extractChapters(data);
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    // Helper function to populate novel metadata
    Genesis.prototype.populateNovelMetadata = function (novel, data) {
        for (var key in data) {
            var value = data[key];
            if (typeof value === 'object' &&
                value !== null &&
                'novel_title' in value) {
                novel.name = data[value.novel_title] || 'Unknown Title';
                novel.cover = data[value.cover] || '';
                novel.summary = data[value.synopsis] || '';
                novel.author = data[value.author] || 'Unknown Author';
                novel.genres =
                    data[value.genres]
                        .map(function (genreId) { return data[genreId]; })
                        .join(', ') || 'Unknown Genre';
                novel.status = value.release_days ? 'Ongoing' : 'Completed';
                break; // Break the loop once metadata is found
            }
        }
    };
    // Helper function to extract and format chapters
    Genesis.prototype.extractChapters = function (data) {
        var _this = this;
        var chapterKey = 'chapters';
        var chapters = [];
        // Iterate over each property in data to find chapter containers
        for (var key in data) {
            var value = data[key];
            // Look for an object with a 'chapters' key
            if (value && typeof value === 'object' && chapterKey in value) {
                var chaptersIndexKey = value[chapterKey];
                var chapterData = data[chaptersIndexKey];
                if (!chapterData || typeof chapterData !== 'object')
                    continue;
                // Dynamically get chapter indices from every category (free, premium, etc.)
                var allChapterIndices = [];
                for (var _i = 0, _a = Object.keys(chapterData); _i < _a.length; _i++) {
                    var category = _a[_i];
                    var chapterIndices = data[chapterData[category]];
                    if (Array.isArray(chapterIndices)) {
                        allChapterIndices = allChapterIndices.concat(chapterIndices);
                    }
                }
                // Format each chapter and add only valid ones
                var formattedChapters = allChapterIndices
                    .map(function (index) { return data[index]; })
                    .map(function (chapter) { return _this.formatChapter(chapter, data); })
                    .filter(function (chapter) { return chapter !== null; });
                chapters.push.apply(chapters, formattedChapters);
            }
        }
        return chapters;
    };
    // Helper function to format an individual chapter
    Genesis.prototype.formatChapter = function (chapter, data) {
        var id = chapter.id, chapter_title = chapter.chapter_title, chapter_number = chapter.chapter_number, required_tier = chapter.required_tier, date_created = chapter.date_created;
        // Destructure from data using computed property names based on chapter keys
        var _a = data, _b = id, chapterId = _a[_b], _c = chapter_title, chapterTitle = _a[_c], _d = chapter_number, chapterNumberVal = _a[_d], _e = required_tier, requiredTierVal = _a[_e], _f = date_created, dateCreated = _a[_f];
        // Validate required fields
        if (chapterId &&
            chapterTitle &&
            chapterNumberVal >= 0 &&
            requiredTierVal !== null &&
            dateCreated) {
            var chapterNumber = parseInt(String(chapterNumberVal), 10) || 0;
            var requiredTier = parseInt(String(requiredTierVal), 10) || 0;
            // Only process chapters that do not require a premium tier
            if (requiredTier === 0) {
                return {
                    name: "Chapter ".concat(chapterNumber, " - ").concat(chapterTitle),
                    path: "/viewer/".concat(chapterId),
                    releaseTime: dateCreated,
                    chapterNumber: chapterNumber,
                };
            }
        }
        return null;
    };
    // // Helper function to extract and format chapters
    // extractChapters(data: any): Plugin.ChapterItem[] {
    //   for (const key in data) {
    //     const value = data[key];
    //
    //     // Change string here if the chapters are stored under a different key
    //     const chapterKey = 'chapters';
    //     if (typeof value === 'object' && value !== null && chapterKey in value) {
    //       const chapterData = this.decodeData(data[value[chapterKey]]);
    //
    //       // Object.values will give us an array of arrays (any[][])
    //       const chapterArrays: any[][] = Object.values(chapterData);
    //
    //       // Flatten and format the chapters
    //       return chapterArrays.flatMap((chapters: any[]) => {
    //         return chapters
    //           .map((chapter: any) => this.formatChapter(chapter))
    //           .filter(
    //             (chapter): chapter is Plugin.ChapterItem => chapter !== null,
    //           );
    //       });
    //     }
    //   }
    //
    //   return [];
    // }
    //
    // // Helper function to format an individual chapter
    // formatChapter(chapter: any): Plugin.ChapterItem | null {
    //   const { id, chapter_title, chapter_number, required_tier, date_created } =
    //     chapter;
    //
    //   // Ensure required fields are present and valid
    //   if (
    //     id &&
    //     chapter_title &&
    //     chapter_number >= 0 &&
    //     required_tier !== null &&
    //     date_created
    //   ) {
    //     const number = parseInt(chapter_number, 10) || 0;
    //     const requiredTier = parseInt(required_tier, 10) || 0;
    //
    //     // Only process chapters with a 'requiredTier' of 0
    //     if (requiredTier === 0) {
    //       return {
    //         name: `Chapter ${number}: ${chapter_title}`,
    //         path: `/viewer/${id}`,
    //         releaseTime: date_created,
    //         chapterNumber: number,
    //       };
    //     }
    //   }
    //
    //   return null;
    // }
    //
    // decodeData(code: any) {
    //   const offset = this.getOffsetIndex(code);
    //   const params = this.getDecodeParams(code);
    //   const constant = this.getConstant(code);
    //   const data = this.getStringsArrayRaw(code);
    //
    //   const getDataAt = (x: number) => data[x - offset];
    //
    //   //reshuffle data array
    //   // eslint-disable-next-line no-constant-condition
    //   while (true) {
    //     try {
    //       const some_number = this.applyDecodeParams(params, getDataAt);
    //       if (some_number === constant) break;
    //       else data.push(data.shift());
    //     } catch (err) {
    //       data.push(data.shift());
    //     }
    //   }
    //
    //   return this.getChapterData(code, getDataAt);
    // }
    //
    // getOffsetIndex(code: string) {
    //   // @ts-ignore
    //   const string = /{(\w+)=\1-0x(?<offset>[0-9a-f]+);/.exec(code).groups.offset;
    //   return parseInt(string, 16);
    // }
    //
    // /**
    //  * @returns {string[]}
    //  */
    // getStringsArrayRaw(code: string) {
    //   // @ts-ignore
    //   let json = /function \w+\(\){var \w+=(?<array>\['.+']);/.exec(code).groups
    //     .array;
    //
    //   //replace string single quotes with double quotes and add escaped chars
    //   json = json.replace(/'(.+?)'([,\]])/g, (match, p1, p2) => {
    //     return `"${p1.replace(/\\x([0-9a-z]{2})/g, (match: any, p1: string) => {
    //       //hexadecimal unicode escape chars
    //       return String.fromCharCode(parseInt(p1, 16));
    //     })}"${p2}`;
    //   });
    //
    //   return JSON.parse(json);
    // }
    //
    // /**
    //  * @returns {{offset: number, divider: number, negated: boolean}[][]}
    //  */
    // getDecodeParams(code: string) {
    //   // @ts-ignore
    //   const jsDecodeInt = /while\(!!\[]\){try{var \w+=(?<code>.+?);/.exec(code)
    //     .groups.code;
    //   const decodeSections = jsDecodeInt.split('+');
    //   const params = [];
    //   for (const section of decodeSections) {
    //     params.push(this.decodeParamSection(section));
    //   }
    //   return params;
    // }
    //
    // /**
    //  * @param {string} section
    //  * @returns {{offset: number, divider: number, negated: boolean}[]}
    //  */
    // decodeParamSection(section: string) {
    //   const sections = section.split('*');
    //   const params = [];
    //   for (const section of sections) {
    //     // @ts-ignore
    //     const offsetStr = /parseInt\(\w+\(0x(?<offset>[0-9a-f]+)\)\)/.exec(
    //       section,
    //     ).groups.offset;
    //     const offset = parseInt(offsetStr, 16);
    //     // @ts-ignore
    //     const dividerStr = /\/0x(?<divider>[0-9a-f]+)/.exec(section).groups
    //       .divider;
    //     const divider = parseInt(dividerStr, 16);
    //     const negated = section.includes('-');
    //     params.push({ offset, divider, negated });
    //   }
    //   return params;
    // }
    //
    // getConstant(code: string) {
    //   // @ts-ignore
    //   const constantStr = /}}}\(\w+,0x(?<constant>[0-9a-f]+)\),/.exec(code).groups
    //     .constant;
    //   return parseInt(constantStr, 16);
    // }
    //
    // getChapterData(
    //   code: string,
    //   getDataAt: { (x: number): any; (arg0: number): any },
    // ) {
    //   let chapterDataStr =
    //     // @ts-ignore
    //     /\),\(function\(\){var \w+=\w+;return(?<data>{.+?});/.exec(code).groups
    //       .data;
    //
    //   //replace hex with decimal
    //   chapterDataStr = chapterDataStr.replace(/:0x([0-9a-f]+)/g, (match, p1) => {
    //     const hex = parseInt(p1, 16);
    //     return `: ${hex}`;
    //   });
    //
    //   //replace ![] with false and !![] with true
    //   chapterDataStr = chapterDataStr
    //     .replace(/:!!\[]/g, ':true')
    //     .replace(/:!\[]/g, ':false');
    //
    //   //replace string single quotes with double quotes and add escaped chars
    //   chapterDataStr = chapterDataStr.replace(
    //     /'(.+?)'([,\]}:])/g,
    //     (match, p1, p2) => {
    //       return `"${p1.replace(/\\x([0-9a-z]{2})/g, (match: any, p1: string) => {
    //         //hexadecimal unicode escape chars
    //         return String.fromCharCode(parseInt(p1, 16));
    //       })}"${p2}`;
    //     },
    //   );
    //
    //   //parse the data getting methods
    //   chapterDataStr = chapterDataStr.replace(
    //     // @ts-ignore
    //     /:\w+\(0x(?<offset>[0-9a-f]+)\)/g,
    //     (match, p1) => {
    //       const offset = parseInt(p1, 16);
    //       return `:${JSON.stringify(getDataAt(offset))}`;
    //     },
    //   );
    //
    //   return JSON.parse(chapterDataStr);
    // }
    //
    // /**
    //  * @param {{offset: number, divider: number, negated: boolean}[][]} params
    //  * @param {function(number): string} getDataAt
    //  */
    // applyDecodeParams(
    //   params: { offset: number; divider: number; negated: boolean }[][],
    //   getDataAt: { (x: number): any; (arg0: any): string },
    // ) {
    //   let res = 0;
    //   for (const paramAdd of params) {
    //     let resInner = 1;
    //     for (const paramMul of paramAdd) {
    //       resInner *= parseInt(getDataAt(paramMul.offset)) / paramMul.divider;
    //       if (paramMul.negated) resInner *= -1;
    //     }
    //     res += resInner;
    //   }
    //   return res;
    // }
    Genesis.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, json, nodes, data, contentKey, notesKey, footnotesKey, key, mapping, content, notes, footnotes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.site).concat(chapterPath, "/__data.json?x-sveltekit-invalidated=001");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.json(); })];
                    case 1:
                        json = _a.sent();
                        nodes = json.nodes;
                        data = this.extractData(nodes);
                        contentKey = 'content';
                        notesKey = 'notes';
                        footnotesKey = 'footnotes';
                        // Iterate over each property in data to find chapter containers
                        for (key in data) {
                            mapping = data[key];
                            // Check container for keys that match the required fields
                            if (mapping &&
                                typeof mapping === 'object' &&
                                contentKey in mapping &&
                                notesKey in mapping &&
                                footnotesKey in mapping) {
                                content = data[mapping[contentKey]];
                                notes = data[mapping[notesKey]];
                                footnotes = data[mapping[footnotesKey]];
                                // Return the combined parts with appropriate formatting
                                return [2 /*return*/, (content +
                                        (notes ? "<h2>Notes</h2><br>".concat(notes) : '') +
                                        (footnotes !== null && footnotes !== void 0 ? footnotes : ''))];
                            }
                        }
                        // If no mapping object was found, return an empty string or handle appropriately.
                        return [2 /*return*/, ''];
                }
            });
        });
    };
    Genesis.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo !== 1)
                            return [2 /*return*/, []];
                        url = "".concat(this.site, "/api/novels/search?serialization=All&sort=Popular&title=").concat(encodeURIComponent(searchTerm));
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.json(); })];
                    case 1:
                        json = _a.sent();
                        return [2 /*return*/, this.parseNovels(json)];
                }
            });
        });
    };
    return Genesis;
}());
exports.default = new Genesis();
