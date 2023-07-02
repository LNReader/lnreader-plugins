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
const showToast = require('@libs/showToast');
const pluginId = 'lnmtl';
const baseUrl = 'https://lnmtl.com/';
function popularNovels(page) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = baseUrl + 'novel?page=' + page;
        const body = yield fetchApi(url, {}, pluginId).then(r => r.text());
        const loadedCheerio = cheerio.load(body);
        let novels = [];
        loadedCheerio('.media').each(function () {
            const novelName = loadedCheerio(this).find('h4').text();
            const novelCover = loadedCheerio(this).find('img').attr('src');
            const novelUrl = loadedCheerio(this).find('h4 > a').attr('href');
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
        showToast('LNMTL might take around 20-30 seconds.');
        const url = novelUrl;
        const body = yield fetchApi(url, {}, pluginId).then(r => r.text());
        const loadedCheerio = cheerio.load(body);
        const novel = {
            url,
            chapters: [],
        };
        novel.name = loadedCheerio('.novel-name').text();
        novel.cover = loadedCheerio('div.novel').find('img').attr('src');
        novel.summary = loadedCheerio('div.description').text().trim();
        loadedCheerio('.panel-body > dl').each(function () {
            let detailName = loadedCheerio(this).find('dt').text().trim();
            let detail = loadedCheerio(this).find('dd').text().trim();
            switch (detailName) {
                case 'Authors':
                    novel.author = detail;
                    break;
                case 'Current status':
                    novel.status = detail;
                    break;
            }
        });
        novel.genre = loadedCheerio('.panel-heading:contains(" Genres ")')
            .next()
            .text()
            .trim()
            .replace(/\s\s/g, ',');
        let volumes = JSON.parse(loadedCheerio('main')
            .next()
            .html()
            .match(/lnmtl.volumes = \[(.*?)\]/)[0]
            .replace('lnmtl.volumes = ', ''));
        let chapters = [];
        volumes = volumes.map(volume => volume.id);
        for (const volume of volumes) {
            let volumeData = yield fetchApi(`https://lnmtl.com/chapter?page=1&volumeId=${volume}`);
            volumeData = yield volumeData.json();
            // volumeData = volumeData.data.map((volume) => volume.slug);
            for (let i = 1; i <= volumeData.last_page; i++) {
                let chapterData = yield fetchApi(`https://lnmtl.com/chapter?page=${i}&volumeId=${volume}`);
                chapterData = yield chapterData.json();
                chapterData = chapterData.data.map(chapter => ({
                    name: `#${chapter.number} ${chapter.title}`,
                    url: `${baseUrl}chapter/${chapter.slug}`,
                    releaseTime: chapter.created_at,
                }));
                chapters.push(...chapterData);
            }
        }
        novel.chapters = chapters;
        return novel;
    });
}
function parseChapter(chapterUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = yield fetchApi(chapterUrl, {}, pluginId).then(r => r.text());
        const loadedCheerio = cheerio.load(body);
        loadedCheerio('.original').replaceWith('<br><br>');
        let chapterText = loadedCheerio('.chapter-body').html();
        if (!chapterText) {
            chapterText = loadedCheerio('.alert.alert-warning').text();
        }
        return chapterText;
    });
}
function searchNovels(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = 'https://lnmtl.com/term';
        const body = yield fetchApi(url, {}, pluginId).then(r => r.text());
        const loadedCheerio = cheerio.load(body);
        let novels = loadedCheerio('footer')
            .next()
            .next()
            .html()
            .match(/local: \[(.*?)\]/)[0]
            .replace('local: ', '');
        novels = JSON.parse(novels);
        novels = novels.filter(novel => novel.name.toLowerCase().includes(searchTerm.toLowerCase()));
        novels = novels.map(novel => ({
            name: novel.name,
            url: novel.slug,
            cover: novel.image,
        }));
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
    name: 'LNMTL',
    version: '1.0.0',
    icon: 'src/en/lnmtl/icon.png',
    site: baseUrl,
    protected: true,
    fetchImage,
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
};
