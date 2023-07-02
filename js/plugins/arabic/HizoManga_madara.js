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
const defaultCover_1 = __importDefault(require("@libs/defaultCover"));
const novelStatus_1 = __importDefault(require("@libs/novelStatus"));
const parseDate_1 = __importDefault(require("@libs/parseDate"));
const dayjs_1 = __importDefault(require("dayjs"));
exports.id = "shizomanga.com";
exports.name = "HizoManga_madara";
exports.icon = "multisrc/madara/icons/hizomanga.png";
exports.version = "1.0.0";
exports.site = "https://hizomanga.com/";
const baseUrl = exports.site;
const popularNovels = (pageNo, { showLatestNovels }) => __awaiter(void 0, void 0, void 0, function* () {
    const novels = [];
    const sortOrder = showLatestNovels
        ? '?m_orderby=latest'
        : '/?m_orderby=rating';
    let url = exports.site + "serie" + '/page/' + pageNo + sortOrder;
    const body = yield (0, fetchApi_1.default)(url).then(res => res.text());
    const loadedCheerio = cheerio.load(body);
    loadedCheerio('.manga-title-badges').remove();
    loadedCheerio('.page-item-detail').each(function () {
        var _a;
        const novelName = loadedCheerio(this).find('.post-title').text().trim();
        let image = loadedCheerio(this).find('img');
        const novelCover = image.attr('data-src') || image.attr('src');
        let novelUrl = ((_a = loadedCheerio(this).find('.post-title')
            .find('a')
            .attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[4]) || '';
        const novel = {
            name: novelName,
            cover: novelCover,
            url: novelUrl,
        };
        novels.push(novel);
    });
    return novels;
});
exports.popularNovels = popularNovels;
const parseNovelAndChapters = (novelUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const novel = {
        url: novelUrl,
    };
    const body = yield (0, fetchApi_1.default)(novelUrl).then(res => res.text());
    let loadedCheerio = cheerio.load(body);
    loadedCheerio('.manga-title-badges').remove();
    novel.name = loadedCheerio('.post-title h1').text().trim();
    novel.cover =
        loadedCheerio('.summary_image > a > img').attr('data-src') ||
            loadedCheerio('.summary_image > a > img').attr('src') ||
            defaultCover_1.default;
    loadedCheerio('.post-content_item', '.post-content').each(function () {
        const detailName = loadedCheerio(this).find('h5').text().trim();
        const detail = loadedCheerio(this).find('.summary-content').text().trim();
        switch (detailName) {
            case 'Genre(s)':
            case 'التصنيفات':
                novel.genres = detail.replace(/[\t\n]/g, ',');
                break;
            case 'Author(s)':
            case 'المؤلف':
                novel.author = detail;
                break;
            case 'Status':
            case 'الحالة':
                novel.status =
                    detail.includes('OnGoing') || detail.includes('مستمرة')
                        ? novelStatus_1.default.Ongoing
                        : novelStatus_1.default.Completed;
                break;
        }
    });
    loadedCheerio('div.summary__content .code-block').remove();
    novel.summary = loadedCheerio('div.summary__content').text().trim();
    let html;
    if (true) {
        const novelId = loadedCheerio('.rating-post-id').attr('value') ||
            loadedCheerio('#manga-chapters-holder').attr('data-id') || '';
        let formData = new FormData();
        formData.append('action', 'manga_get_chapters');
        formData.append('manga', novelId);
        html = yield (0, fetchApi_1.default)(baseUrl + 'wp-admin/admin-ajax.php', {
            method: 'POST',
            body: formData,
        })
            .then(res => res.text());
    }
    else {
        html = yield (0, fetchApi_1.default)(baseUrl + 'ajax/chapters/', { method: 'POST' })
            .then(res => res.text());
    }
    if (html !== '0') {
        loadedCheerio = cheerio.load(html);
    }
    const chapters = [];
    loadedCheerio('.wp-manga-chapter').each(function () {
        var _a;
        const chapterName = loadedCheerio(this).find('a').text().trim();
        let releaseDate = null;
        releaseDate = loadedCheerio(this)
            .find('span.chapter-release-date')
            .text()
            .trim();
        if (releaseDate) {
            releaseDate = (0, parseDate_1.default)(releaseDate);
        }
        else {
            /**
             * Insert current date
             */
            releaseDate = (0, dayjs_1.default)().format('LL');
        }
        let chapterUrl = ((_a = loadedCheerio(this).find('a').attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')) || '';
        chapterUrl[6]
            ? (chapterUrl = chapterUrl[5] + '/' + chapterUrl[6])
            : (chapterUrl = chapterUrl[5]);
        chapters.push({ name: chapterName, releaseTime: releaseDate, url: chapterUrl });
    });
    novel.chapters = chapters.reverse();
    return novel;
});
exports.parseNovelAndChapters = parseNovelAndChapters;
const parseChapter = (chapterUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const url = baseUrl + "/" + "serie" + "/" + chapterUrl;
    const body = yield (0, fetchApi_1.default)(chapterUrl).then(res => res.text());
    const loadedCheerio = cheerio.load(body);
    const chapterText = loadedCheerio('.text-left').html() ||
        loadedCheerio('.text-right').html() ||
        loadedCheerio('.entry-content').html();
    return chapterText;
});
exports.parseChapter = parseChapter;
const searchNovels = (searchTerm) => __awaiter(void 0, void 0, void 0, function* () {
    const novels = [];
    const url = baseUrl + "?s=" + searchTerm + "&post_type=wp-manga";
    const body = yield (0, fetchApi_1.default)(url).then(res => res.text());
    const loadedCheerio = cheerio.load(body);
    loadedCheerio('.c-tabs-item__content').each(function () {
        var _a;
        const novelName = loadedCheerio(this).find('.post-title').text().trim();
        let image = loadedCheerio(this).find('img');
        const novelCover = image.attr('data-src') || image.attr('src');
        let novelUrl = ((_a = loadedCheerio(this)
            .find('.post-title')
            .find('a')
            .attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[4]) || '';
        const novel = {
            name: novelName,
            cover: novelCover,
            url: novelUrl,
        };
        novels.push(novel);
    });
    return novels;
});
exports.searchNovels = searchNovels;
const fetchImage = (url) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, fetchFile_1.default)(url);
});
exports.fetchImage = fetchImage;
