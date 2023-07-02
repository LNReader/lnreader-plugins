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
const baseUrl = 'https://www.skynovels.net/';
function popularNovels(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = 'https://api.skynovels.net/api/novels?&q';
        const result = yield fetchApi(url);
        const body = yield result.json();
        const novels = [];
        body.novels.map(res => {
            const novelName = res.nvl_title;
            const novelCover = 'https://api.skynovels.net/api/get-image/' + res.image + '/novels/false';
            const novelUrl = baseUrl + 'novelas/' + res.id + '/' + res.nvl_name + '/';
            const novel = { name: novelName, url: novelUrl, cover: novelCover };
            novels.push(novel);
        });
        return novels;
    });
}
;
function parseNovelAndChapters(novUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        let novelId = novUrl.substring().split('/')[4];
        const url = 'https://api.skynovels.net/api/novel/' + novelId + '/reading?&q';
        const result = yield fetchApi(url);
        const body = yield result.json();
        const item = body.novel[0];
        let novel = {};
        novel.url = novUrl;
        novel.name = item.nvl_title;
        novel.cover =
            'https://api.skynovels.net/api/get-image/' + item.image + '/novels/false';
        let genres = [];
        item.genres.map(genre => genres.push(genre.genre_name));
        novel.genres = genres.join(',');
        novel.author = item.nvl_writer;
        novel.summary = item.nvl_content;
        novel.status = item.nvl_status;
        let novelChapters = [];
        item.volumes.map(volume => {
            volume.chapters.map(chapter => {
                const chapterName = chapter.chp_index_title;
                const releaseDate = new Date(chapter.createdAt).toDateString();
                const chapterUrl = novUrl + chapter.id + '/' + chapter.chp_name;
                const chap = { name: chapterName, releaseTime: releaseDate, url: chapterUrl };
                novelChapters.push(chap);
            });
        });
        novel.chapters = novelChapters;
        return novel;
    });
}
;
function parseChapter(chapUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        let chapterId = chapUrl.split('/')[6];
        const url = `https://api.skynovels.net/api/novel-chapter/${chapterId}`;
        const result = yield fetchApi(url);
        const body = yield result.json();
        const item = body.chapter[0];
        let chapterText = item.chp_content;
        return chapterText;
    });
}
;
function searchNovels(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        searchTerm = searchTerm.toLowerCase();
        const url = 'https://api.skynovels.net/api/novels?&q';
        const result = yield fetchApi(url);
        const body = yield result.json();
        let results = body.novels.filter(novel => novel.nvl_title.toLowerCase().includes(searchTerm));
        const novels = [];
        results.map(res => {
            const novelName = res.nvl_title;
            const novelCover = 'https://api.skynovels.net/api/get-image/' + res.image + '/novels/false';
            const novelUrl = baseUrl + 'novelas/' + res.id + '/' + res.nvl_name + '/';
            const novel = { name: novelName, url: novelUrl, cover: novelCover };
            novels.push(novel);
        });
        return novels;
    });
}
;
module.exports = {
    id: 'skynovels.net',
    name: "SkyNovels",
    site: baseUrl,
    version: '1.0.0',
    icon: 'src/es/skynovels/icon.png',
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};
