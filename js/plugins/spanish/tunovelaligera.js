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
const fetchApi = require('@libs/fetchApi');
const fetchFile = require('@libs/fetchFile');
const cheerio = require('cheerio');
const Status = require('@libs/novelStatus');
const defaultCoverUri = 'https://github.com/LNReader/lnreader-sources/blob/main/icons/src/coverNotAvailable.jpg?raw=true';
const pluginId = "TNL.com";
const sourceName = 'TuNovelaLigera';
const baseUrl = 'https://tunovelaligera.com/';
function popularNovels(page) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = baseUrl + 'novelas/page/' + page + '/?m_orderby=rating';
        const result = yield fetchApi(url);
        const body = yield result.text();
        let loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('.page-item-detail').each(function () {
            const novelName = loadedCheerio(this).find('.h5 > a').text();
            const novelCover = loadedCheerio(this).find('img').attr('src');
            let novelUrl = loadedCheerio(this)
                .find('.h5 > a')
                .attr('href');
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
;
function parseNovelAndChapters(novelUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = novelUrl;
        const result = yield fetchApi(url);
        const body = yield result.text();
        let loadedCheerio = cheerio.load(body);
        let novel = {
            url,
        };
        loadedCheerio('.manga-title-badges').remove();
        novel.name = loadedCheerio('.post-title > h1').text().trim();
        let novelCover = loadedCheerio('.summary_image > a > img');
        novel.cover =
            novelCover.attr('data-src') || novelCover.attr('src') || defaultCoverUri;
        loadedCheerio('.post-content_item').each(function () {
            const detailName = loadedCheerio(this)
                .find('.summary-heading > h5')
                .text()
                .trim();
            const detail = loadedCheerio(this).find('.summary-content').text().trim();
            switch (detailName) {
                case 'Generos':
                    novel.genres = detail.replace(/, /g, ',');
                    break;
                case 'Autores':
                    novel.author = detail;
                    break;
                case 'Estado':
                    novel.status =
                        detail.includes('OnGoing') || detail.includes('Updating')
                            ? Status.Ongoing
                            : Status.Completed;
                    break;
            }
        });
        novel.summary = loadedCheerio('div.summary__content > p').text().trim();
        let novelChapters = [];
        loadedCheerio('.lcp_catlist li').each(function () {
            const chapterName = loadedCheerio(this)
                .find('a')
                .text()
                .replace(/[\t\n]/g, '')
                .trim();
            const releaseDate = loadedCheerio(this).find('span').text().trim();
            let chapterUrl = loadedCheerio(this).find('a').attr('href');
            novelChapters.push({ name: chapterName, releaseTime: releaseDate, url: chapterUrl });
        });
        novel.chapters = novelChapters.reverse();
        return novel;
    });
}
;
function parseChapter(chapterUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = chapterUrl;
        const result = yield fetchApi(url);
        const body = yield result.text();
        let loadedCheerio = cheerio.load(body);
        let chapterText = loadedCheerio('#hola_siguiente').next().text();
        return chapterText;
    });
}
;
function searchNovels(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${baseUrl}?s=${searchTerm}&post_type=wp-manga`;
        const result = yield fetchApi(url);
        const body = yield result.text();
        let loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('.c-tabs-item__content').each(function () {
            const novelName = loadedCheerio(this).find('.h4 > a').text();
            const novelCover = loadedCheerio(this).find('img').attr('src');
            let novelUrl = loadedCheerio(this).find('.h4 > a').attr('href');
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
;
module.exports = {
    id: pluginId,
    name: sourceName,
    site: baseUrl,
    version: '1.0.0',
    icon: 'src/es/tunovelaligera/icon.png',
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};
