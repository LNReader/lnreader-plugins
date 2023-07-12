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
const cheerio = require('cheerio');
const fetchApi = require('@libs/fetchApi').default;
const fetchFile = require('@libs/fetchFile').default;
const pluginId = 'nitroscans';
const baseUrl = 'https://nitroscans.com/';
function popularNovels(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = baseUrl + 'wp-admin/admin-ajax.php';
        let formData = new FormData();
        formData.append('action', 'madara_load_more');
        formData.append('page', Number(page - 1));
        formData.append('template', 'madara-core/content/content-archive');
        formData.append('vars[orderby]', 'meta_value_num');
        formData.append('vars[post_type]', 'wp-manga');
        formData.append('vars[meta_key]', '_wp_manga_views');
        formData.append('vars[wp-manga-genre]', 'novels');
        const body = yield fetchApi(url, {
            method: 'POST',
            body: formData,
        }).then(r => r.text());
        const loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('.page-item-detail').each(function () {
            const novelName = loadedCheerio(this).find('h3 > a').text();
            const novelCover = loadedCheerio(this).find('img').attr('data-src');
            const novelUrl = loadedCheerio(this).find('h3 > a').attr('href');
            const novel = {
                name: novelName,
                cover: novelCover,
                url: novelUrl,
            };
            novels.push(novel);
        });
        return novels;
    });
}
function parseNovelAndChapters(novelUrl) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const url = novelUrl;
        const body = yield fetchApi(url).then(r => r.text());
        let loadedCheerio = cheerio.load(body);
        const novel = {
            url,
            chapters: [],
        };
        loadedCheerio('.manga-title-badges.custom.novel').remove();
        novel.name = loadedCheerio('.post-title > h1').text().trim();
        novel.cover = loadedCheerio('.summary_image').find('img').attr('data-src');
        novel.summary = (_a = loadedCheerio('.summary__content').text()) === null || _a === void 0 ? void 0 : _a.trim();
        novel.genres = loadedCheerio('.genres-content')
            .children('a')
            .map((i, el) => loadedCheerio(el).text())
            .toArray()
            .join(',');
        loadedCheerio('.post-content_item').each(function () {
            const detailName = loadedCheerio(this)
                .find('.summary-heading')
                .text()
                .trim();
            const detail = loadedCheerio(this).find('.summary-content').text().trim();
            switch (detailName) {
                case 'Author(s)':
                    novel.author = detail;
                    break;
                case 'Status':
                    novel.status = detail.replace(/G/g, 'g');
                    break;
            }
        });
        let chapter = [];
        let chapterlisturl = novelUrl + 'ajax/chapters/';
        const data = yield fetchApi(chapterlisturl, { method: 'POST' });
        const text = yield data.text();
        loadedCheerio = cheerio.load(text);
        loadedCheerio('.wp-manga-chapter').each(function () {
            const chapterName = loadedCheerio(this).find('a').text().trim();
            const releaseDate = loadedCheerio(this).find('span').text().trim();
            const chapterUrl = loadedCheerio(this).find('a').attr('href');
            chapter.push({
                name: chapterName,
                releaseTime: releaseDate,
                url: chapterUrl,
            });
        });
        novel.chapters = chapter.reverse();
        return novel;
    });
}
function parseChapter(chapterUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = yield fetchApi(chapterUrl).then(r => r.text());
        let loadedCheerio = cheerio.load(body);
        const chapterText = loadedCheerio('.text-left').html();
        return chapterText;
    });
}
function searchNovels(page, searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = baseUrl + 'wp-admin/admin-ajax.php';
        let formData = new FormData();
        formData.append('action', 'madara_load_more');
        formData.append('page', Number(page - 1));
        formData.append('template', 'madara-core/content/content-search');
        formData.append('vars[s]', searchTerm);
        formData.append('vars[post_type]', 'wp-manga');
        formData.append('vars[wp-manga-genre]', 'novels');
        const body = yield fetchApi(url, {
            method: 'POST',
            body: formData,
        }).then(r => r.text());
        let loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('.c-tabs-item__content').each(function () {
            const novelName = loadedCheerio(this).find('h3 > a').text();
            const novelCover = loadedCheerio(this).find('img').attr('data-src');
            const novelUrl = loadedCheerio(this).find('h3 > a').attr('href');
            const novel = {
                name: novelName,
                cover: novelCover,
                url: novelUrl,
            };
            novels.push(novel);
        });
        return novels;
    });
}
function fetchImage(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const headers = {
            Referer: baseUrl,
        };
        return yield fetchFile(url, { headers: headers });
    });
}
module.exports = {
    id: pluginId,
    name: 'Nitroscans',
    version: '1.0.0',
    icon: 'src/en/nitroscans/icon.png',
    site: baseUrl,
    protected: false,
    fetchImage,
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
};
