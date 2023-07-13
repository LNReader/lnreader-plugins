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
const fetchApi = require('@libs/fetchApi');
const fetchFile = require('@libs/fetchFile');
const pluginId = 'LightNovelUpdates';
const baseUrl = 'https://www.lightnovelupdates.com/';
function popularNovels(page) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = `${baseUrl}novel/page/${page}/?m_orderby=rating`;
        const body = yield fetchApi(url, {}, pluginId).then(r => r.text());
        const loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('.page-item-detail').each(function () {
            const novelName = loadedCheerio(this).find('.h5 > a').text();
            const novelCover = loadedCheerio(this).find('img').attr('src');
            const novelUrl = loadedCheerio(this).find('.h5 > a').attr('href');
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
    return __awaiter(this, void 0, void 0, function* () {
        const url = novelUrl;
        const body = yield fetchApi(url, {}, pluginId).then(r => r.text());
        let loadedCheerio = cheerio.load(body);
        const novel = {
            url,
            chapters: [],
        };
        novel.name = loadedCheerio('.post-title > h1').text().trim();
        novel.cover =
            loadedCheerio('.summary_image > a > img').attr('src') || null;
        loadedCheerio('.post-content_item').each(function () {
            const detailName = loadedCheerio(this)
                .find('.summary-heading > h5')
                .text()
                .trim();
            const detail = loadedCheerio(this).find('.summary-content').text().trim();
            switch (detailName) {
                case 'Genre(s)':
                    novel.genres = detail.trim().replace(/[\t\n]/g, ',');
                    break;
                case 'Author(s)':
                    novel.author = detail.trim();
                    break;
                case 'Status':
                    novel.status = detail.replace(/G/g, 'g');
                    break;
            }
        });
        novel.summary = loadedCheerio('div.summary__content').text();
        let chapter = [];
        const novelId = loadedCheerio('.rating-post-id').attr('value');
        let formData = new FormData();
        formData.append('action', 'manga_get_chapters');
        formData.append('manga', novelId);
        const data = yield fetchApi('https://www.lightnovelupdates.com/wp-admin/admin-ajax.php', {
            method: 'POST',
            body: formData,
        }, pluginId);
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
        const chapterText = (yield NovelUpdatesScraper.parseChapter(chapterUrl))
            .chapterText;
        return chapterText;
    });
}
function searchNovels(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${baseUrl}?s=${searchTerm}&post_type=wp-manga&m_orderby=rating`;
        const body = yield fetchApi(url, {}, pluginId).then(r => r.text());
        const loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('.c-tabs-item__content').each(function () {
            const novelName = loadedCheerio(this).find('.h4 > a').text();
            const novelCover = loadedCheerio(this).find('img').attr('src');
            const novelUrl = loadedCheerio(this).find('.h4 > a').attr('href');
            novels.push({
                url: novelUrl,
                name: novelName,
                cover: novelCover,
            });
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
    name: 'Light Novel Updates',
    version: '1.0.0',
    icon: 'src/en/lightnovelupdates/icon.png',
    site: baseUrl,
    protected: false,
    fetchImage,
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
};
