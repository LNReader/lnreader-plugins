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
const FilterInputs = require('@libs/filterInputs');
const pluginId = 'kolnovel';
const baseUrl = 'https://kolnovel.com/';
function popularNovels(page, { filters }) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let link = `${baseUrl}series/?page=${page}`;
        if ((_a = filters === null || filters === void 0 ? void 0 : filters.genres) === null || _a === void 0 ? void 0 : _a.length) {
            link += filters.genres.map(i => `&genre[]=${i}`).join('');
        }
        if ((_b = filters === null || filters === void 0 ? void 0 : filters.type) === null || _b === void 0 ? void 0 : _b.length) {
            link += filters.type.map(i => `&lang[]=${i}`).join('');
        }
        link += '&status=' + ((filters === null || filters === void 0 ? void 0 : filters.status) ? filters === null || filters === void 0 ? void 0 : filters.status : '');
        link += '&order=' + ((filters === null || filters === void 0 ? void 0 : filters.order) ? filters === null || filters === void 0 ? void 0 : filters.order : 'popular');
        const body = yield fetchApi(link, {}, pluginId).then(result => result.text());
        const loadedCheerio = cheerio.load(body);
        const novels = [];
        loadedCheerio('article.maindet').each(function () {
            const novelName = loadedCheerio(this).find('h2').text();
            let image = loadedCheerio(this).find('img');
            const novelCover = image.attr('data-src') || image.attr('src');
            const novelUrl = loadedCheerio(this).find('h2 a').attr('href');
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
        novel.name = loadedCheerio('h1.entry-title').text();
        novel.cover =
            loadedCheerio('img.wp-post-image').attr('data-src') ||
                loadedCheerio('img.wp-post-image').attr('src');
        loadedCheerio('div.serl:nth-child(3) > span').each(function () {
            const detailName = loadedCheerio(this).text().trim();
            const detail = loadedCheerio(this).next().text().trim();
            switch (detailName) {
                case 'الكاتب':
                case 'Author':
                    novel.author = detail;
                    break;
            }
        });
        novel.status = loadedCheerio('div.sertostat > span').attr('class');
        novel.genres = loadedCheerio('.sertogenre')
            .children('a')
            .map((i, el) => loadedCheerio(el).text())
            .toArray()
            .join(',');
        novel.summary = loadedCheerio('.sersys')
            .find('br')
            .replaceWith('\n')
            .end()
            .text();
        let chapter = [];
        loadedCheerio('.eplister')
            .find('li')
            .each(function () {
            const chapterName = loadedCheerio(this).find('.epl-num').text() +
                ' - ' +
                loadedCheerio(this).find('.epl-title').text();
            const releaseDate = loadedCheerio(this).find('.epl-date').text().trim();
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
        let ignore = loadedCheerio('.epcontent > p').next().attr('class');
        loadedCheerio(`p.${ignore}`).remove();
        let chapterText = loadedCheerio('.epcontent').html();
        return chapterText;
    });
}
function searchNovels(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${baseUrl}?s=${searchTerm}`;
        const result = yield fetchApi(url, {}, pluginId);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        const novels = [];
        loadedCheerio('article.maindet').each(function () {
            const novelName = loadedCheerio(this).find('h2').text();
            let image = loadedCheerio(this).find('img');
            const novelCover = image.attr('data-src') || image.attr('src');
            const novelUrl = loadedCheerio(this).find('h2 a').attr('href');
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
const filters = [
    {
        key: 'order',
        label: 'ترتيب حسب',
        values: [
            { label: 'الإعداد الأولي', value: '' },
            { label: 'A-Z', value: 'title' },
            { label: 'Z-A', value: 'titlereverse' },
            { label: 'أخر التحديثات', value: 'update' },
            { label: 'أخر ما تم إضافته', value: 'latest' },
            { label: 'الرائجة', value: 'popular' },
        ],
        inputType: FilterInputs.Picker,
    },
    {
        key: 'status',
        label: 'الحالة',
        values: [
            { label: 'All', value: '' },
            { label: 'Ongoing', value: 'ongoing' },
            { label: 'Hiatus', value: 'hiatus' },
            { label: 'Completed', value: 'completed' },
        ],
        inputType: FilterInputs.Picker,
    },
    {
        key: 'type',
        label: 'النوع',
        values: [
            { label: 'إنجليزية', value: 'english' },
            { label: 'روايةلايت', value: 'light-novel' },
            { label: 'روايةويب', value: 'web-novel' },
            { label: 'صينية', value: 'chinese' },
            { label: 'عربية', value: 'arabic' },
            { label: 'كورية', value: 'korean' },
            { label: 'يابانية', value: 'japanese' },
        ],
        inputType: FilterInputs.Checkbox,
    },
    {
        key: 'genres',
        label: 'تصنيف',
        values: [
            { label: 'Wuxia', value: 'wuxia' },
            { label: 'Xianxia', value: 'xianxia' },
            { label: 'XUANHUAN', value: 'xuanhuan' },
            { label: 'أكشن', value: 'action' },
            { label: 'إثارة', value: 'excitement' },
            { label: 'إنتقالالىعالمأخر', value: 'isekai' },
            { label: 'إيتشي', value: 'etchi' },
            { label: 'الخيالالعلمي', value: 'sci-fi' },
            { label: 'بوليسي', value: 'policy' },
            { label: 'تاريخي', value: 'historical' },
            { label: 'تحقيقات', value: '%d8%aa%d8%ad%d9%82%d9%8a%d9%82' },
            { label: 'تقمصشخصيات', value: 'rpg' },
            { label: 'جريمة', value: 'crime' },
            { label: 'جوسى', value: 'josei' },
            { label: 'حريم', value: 'harem' },
            { label: 'حياةمدرسية', value: 'school-life' },
            { label: 'خيالي(فانتازيا)', value: 'fantasy' },
            { label: 'دراما', value: 'drama' },
            { label: 'رعب', value: 'horror' },
            { label: 'رومانسي', value: 'romantic' },
            { label: 'سحر', value: 'magic' },
            { label: 'سينن', value: 'senen' },
            { label: 'شريحةمنالحياة', value: 'slice-of-life' },
            { label: 'شوجو', value: 'shojo' },
            { label: 'شونين', value: 'shonen' },
            { label: 'طبي', value: 'medical' },
            { label: 'ظواهرخارقةللطبيعة', value: 'supernatural' },
            { label: 'غموض', value: 'mysteries' },
            { label: 'فنونالقتال', value: 'martial-arts' },
            { label: 'قوىخارقة', value: 'superpower' },
            { label: 'كوميدي', value: 'comedy' },
            { label: 'مأساوي', value: 'tragedy' },
            { label: 'مابعدالكارثة', value: 'after-the-disaster' },
            { label: 'مغامرة', value: 'adventure' },
            { label: 'ميكا', value: 'mechanical' },
            { label: 'ناضج', value: 'mature' },
            { label: 'نفسي', value: 'psychological' },
        ],
        inputType: FilterInputs.Checkbox,
    },
];
module.exports = {
    id: pluginId,
    name: 'KolNovel',
    version: '1.0.0',
    icon: 'multisrc/wpmangastream/icons/kolnovel.png',
    site: baseUrl,
    protected: false,
    fetchImage,
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    filters,
};
