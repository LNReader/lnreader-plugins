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
const pluginId = 'foxaholic';
const baseUrl = 'https://www.foxaholic.com/';
function popularNovels(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const link = `${baseUrl}novel/page/${page}/?m_orderby=rating`;
        const result = yield fetchApi(link, {}, pluginId);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        const novels = [];
        loadedCheerio('.page-item-detail').each(function () {
            const novelName = loadedCheerio(this).find('.h5 > a').text();
            const novelCover = loadedCheerio(this).find('img').attr('data-src');
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
        const result = yield fetchApi(url, {}, pluginId);
        const body = yield result.text();
        let loadedCheerio = cheerio.load(body);
        const novel = {
            url,
            chapters: [],
        };
        novel.name = loadedCheerio('.post-title > h1').text().trim();
        novel.cover = loadedCheerio('.summary_image > a > img').attr('data-src');
        loadedCheerio('.post-content_item').each(function () {
            const detailName = loadedCheerio(this)
                .find('.summary-heading > h5')
                .text()
                .trim();
            const detail = loadedCheerio(this).find('.summary-content').html();
            switch (detailName) {
                case 'Genre':
                    novel.genres = loadedCheerio(detail)
                        .children('a')
                        .map((i, el) => loadedCheerio(el).text())
                        .toArray()
                        .join(',');
                    break;
                case 'Author':
                    novel.author = loadedCheerio(detail)
                        .children('a')
                        .map((i, el) => loadedCheerio(el).text())
                        .toArray()
                        .join(', ');
                    break;
                case 'Novel':
                    novel.status = detail.trim().replace(/G/g, 'g');
                    break;
            }
        });
        loadedCheerio('.description-summary > div.summary__content > div').remove();
        novel.summary = loadedCheerio('.description-summary > div.summary__content')
            .text()
            .trim();
        let chapter = [];
        loadedCheerio('.wp-manga-chapter').each(function () {
            const chapterName = loadedCheerio(this)
                .find('a')
                .text()
                .replace(/[\t\n]/g, '')
                .trim();
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
        const result = yield fetchApi(chapterUrl, {}, pluginId);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        loadedCheerio('img').removeAttr('srcset');
        let chapterText = loadedCheerio('.reading-content').html();
        return chapterText;
    });
}
function searchNovels(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${baseUrl}?s=${searchTerm}&post_type=wp-manga`;
        const result = yield fetchApi(url, {}, pluginId);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        const novels = [];
        loadedCheerio('.c-tabs-item__content').each(function () {
            const novelName = loadedCheerio(this).find('.h4 > a').text();
            const novelCover = loadedCheerio(this).find('img').attr('data-src');
            const novelUrl = loadedCheerio(this).find('.h4 > a').attr('href');
            novels.push({
                name: novelName,
                url: novelUrl,
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
    name: 'Foxaholic',
    version: '1.0.0',
    icon: 'src/en/foxaholic/icon.png',
    site: baseUrl,
    protected: false,
    fetchImage,
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
};
