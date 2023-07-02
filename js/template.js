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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchImage = exports.searchNovels = exports.parseChapter = exports.parseNovelAndChapters = exports.popularNovels = exports.filters = exports.site = exports.version = exports.icon = exports.name = exports.id = void 0;
const fetchFile_1 = __importDefault(require("@libs/fetchFile"));
// import dayjs from 'dayjs';
// import FilterInputs from '@libs/filterInputs';
// import novelStatus from '@libs/novelStatus';
// import isUrlAbsolute from '@libs/isAbsoluteUrl';
// import parseDate from '@libs/parseDate';
exports.id = ""; // string and must be unique
exports.name = "Source name";
exports.icon = ""; // The relative path to the icon without @icons . For example: 'src/vi/hakolightnovel/icon.png'
exports.version = "0.0.0"; // xx.xx.xx
exports.site = ""; // the link to the site
exports.filters = []; // optional
exports["protected"] = false; // true if this site protect its resources (images) and you have to define headers or smt to bypass
const popularNovels = function (page, { filters, showLatestNovels }) {
    return __awaiter(this, void 0, void 0, function* () {
        const novels = [];
        /*
        Do something....
        novel = {
          name: '',
          url: '',      must be absolute
          cover: '',
        }
        novels.push(novel);
      */
        return novels;
    });
};
exports.popularNovels = popularNovels;
const parseNovelAndChapters = function (novelUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const novel = {
            url: novelUrl,
            chapters: [],
        };
        /**
         * novel.name = '';
         * novel.cover = '';
         * novel.summary = '';
         * novel.author = '';
         * novel.artist = '';
         * novel.status = '';
         * novel.genres = '';   join by commas. For example: 'romcom, action, school'
         */
        /*
    Do something....
    chapter = {
      name: '',
      url: '',      must be absoulute
      releaseTime: '',
    }
    novel.chapters.push(chapter);
  */
        return novel;
    });
};
exports.parseNovelAndChapters = parseNovelAndChapters;
const parseChapter = function (chapterUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        // Do something...
        const chapterText = "";
        return chapterText;
    });
};
exports.parseChapter = parseChapter;
const searchNovels = function (searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const novels = [];
        /*
        Do something....
        novel = {
          name: '',
          url: '',      must be absolute
          cover: '',
        }
        novels.push(novel);
      */
        return novels;
    });
};
exports.searchNovels = searchNovels;
const fetchImage = function (url) {
    return __awaiter(this, void 0, void 0, function* () {
        // Some site cant fetch images normally (maybe need some headers)
        // Must return base64 of image
        return yield (0, fetchFile_1.default)(url, {});
    });
};
exports.fetchImage = fetchImage;
