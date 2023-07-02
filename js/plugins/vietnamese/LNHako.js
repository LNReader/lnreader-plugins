"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchImage = exports.searchNovels = exports.parseChapter = exports.parseNovelAndChapters = exports.popularNovels = exports.site = exports.version = exports.icon = exports.name = exports.id = void 0;
const cheerio = __importStar(require("cheerio"));
const fetchApi_1 = __importDefault(require("@libs/fetchApi"));
const fetchFile_1 = __importDefault(require("@libs/fetchFile"));
// const dayjs = require('dayjs');
// const FilterInputs = require('@libs/filterInputs');
// const novelStatus = require('@libs/novelStatus');
const isAbsoluteUrl_1 = require("@libs/isAbsoluteUrl");
// const parseDate = require('@libs/parseDate');
const pluginId = 'ln.hako';
const baseUrl = 'https://ln.hako.vn';
exports.id = pluginId; // string and must be unique
exports.name = "Hako";
exports.icon = "src/vi/hakolightnovel/icon.png"; // The relative path to the icon without @icons . For example: 'src/vi/hakolightnovel/icon.png'
exports.version = "1.0.0"; // xx.xx.xx
exports.site = baseUrl; // the link to the site
exports["protected"] = true;
const popularNovels = (pageNo) => __awaiter(void 0, void 0, void 0, function* () {
    const novels = [];
    const link = baseUrl + '/danh-sach?truyendich=1&sapxep=topthang&page=' + pageNo;
    const result = yield (0, fetchApi_1.default)(link);
    const body = yield result.text();
    const loadedCheerio = cheerio.load(body);
    loadedCheerio('main.row > .thumb-item-flow').each(function () {
        let url = loadedCheerio(this)
            .find('div.thumb_attr.series-title > a')
            .attr('href');
        if (url && !(0, isAbsoluteUrl_1.isUrlAbsolute)(url)) {
            url = baseUrl + url;
        }
        if (url) {
            const name = loadedCheerio(this).find('.series-title').text().trim();
            let cover = loadedCheerio(this)
                .find('.img-in-ratio')
                .attr('data-bg');
            if (cover && !(0, isAbsoluteUrl_1.isUrlAbsolute)(cover)) {
                cover = baseUrl + cover;
            }
            const novel = {
                name,
                url,
                cover,
            };
            novels.push(novel);
        }
    });
    return novels;
});
exports.popularNovels = popularNovels;
const parseNovelAndChapters = (novelUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const novel = {
        url: novelUrl,
    };
    const result = yield (0, fetchApi_1.default)(novelUrl);
    const body = yield result.text();
    let loadedCheerio = cheerio.load(body);
    novel.name = loadedCheerio('.series-name').text();
    const background = loadedCheerio('.series-cover > .a6-ratio > div').attr('style') || '';
    const novelCover = background.substring(background.indexOf('http'), background.length - 2);
    novel.cover = novelCover
        ? (0, isAbsoluteUrl_1.isUrlAbsolute)(novelCover)
            ? novelCover
            : baseUrl + novelCover
        : '';
    novel.summary = loadedCheerio('.summary-content').text().trim();
    novel.author = loadedCheerio('#mainpart > div:nth-child(2) > div > div:nth-child(1) > section > main > div.top-part > div > div.col-12.col-md-9 > div.series-information > div:nth-child(2) > span.info-value > a')
        .text()
        .trim();
    novel.genres = loadedCheerio('.series-gernes')
        .text()
        .trim()
        .replace(/ +/g, " ")
        .split('\n')
        .filter(e => e.trim())
        .join(', ');
    novel.status = loadedCheerio('#mainpart > div:nth-child(2) > div > div:nth-child(1) > section > main > div.top-part > div > div.col-12.col-md-9 > div.series-information > div:nth-child(4) > span.info-value > a')
        .text()
        .trim();
    const chapters = [];
    loadedCheerio('.list-chapters li').each(function () {
        let chapterUrl = loadedCheerio(this).find('a').attr('href');
        if (chapterUrl && !(0, isAbsoluteUrl_1.isUrlAbsolute)(chapterUrl)) {
            chapterUrl = baseUrl + chapterUrl;
        }
        if (chapterUrl) {
            const chapterName = loadedCheerio(this)
                .find('.chapter-name')
                .text()
                .trim();
            const releaseTime = loadedCheerio(this).find('.chapter-time').text();
            const chapter = {
                name: chapterName,
                releaseTime: releaseTime,
                url: chapterUrl,
            };
            chapters.push(chapter);
        }
    });
    novel.chapters = chapters;
    return novel;
});
exports.parseNovelAndChapters = parseNovelAndChapters;
const parseChapter = (chapterUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, fetchApi_1.default)(chapterUrl);
    const body = yield result.text();
    const loadedCheerio = cheerio.load(body);
    const chapterText = loadedCheerio('#chapter-content').html() || '';
    return chapterText;
});
exports.parseChapter = parseChapter;
const searchNovels = (searchTerm) => __awaiter(void 0, void 0, void 0, function* () {
    const novels = [];
    const url = baseUrl + '/tim-kiem?keywords=' + searchTerm;
    const result = yield (0, fetchApi_1.default)(url);
    const body = yield result.text();
    const loadedCheerio = cheerio.load(body);
    loadedCheerio('div.row > .thumb-item-flow').each(function () {
        let novelUrl = loadedCheerio(this)
            .find('div.thumb_attr.series-title > a')
            .attr('href');
        if (novelUrl && !(0, isAbsoluteUrl_1.isUrlAbsolute)(novelUrl)) {
            novelUrl = baseUrl + novelUrl;
        }
        if (novelUrl) {
            const novelName = loadedCheerio(this).find('.series-title').text();
            let novelCover = loadedCheerio(this)
                .find('.img-in-ratio')
                .attr('data-bg');
            if (novelCover && !(0, isAbsoluteUrl_1.isUrlAbsolute)(novelCover)) {
                novelCover = baseUrl + novelCover;
            }
            novels.push({
                name: novelName,
                url: novelUrl,
                cover: novelCover,
            });
        }
    });
    return novels;
});
exports.searchNovels = searchNovels;
const fetchImage = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const headers = {
        Referer: 'https://ln.hako.vn',
    };
    return yield (0, fetchFile_1.default)(url, { headers: headers });
});
exports.fetchImage = fetchImage;
