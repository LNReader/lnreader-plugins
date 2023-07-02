module.exports = function generator(sourceJson){
    const { baseUrl, sourceName, options } = sourceJson;
    const lang = options?.lang || 'English';
    const path = options?.path || {
        novels: 'novel',
        novel: 'novel',
        chapter: 'novel',
    };
    const useNewChapterEndpoint = options?.useNewChapterEndpoint || false;
    const iconFileName = sourceName.replace(/\s+/g, '').toLowerCase();

    const pluginScript = `
import * as cheerio from "cheerio";
import fetchApi from "@libs/fetchApi";
import fetchFile from "@libs/fetchFile";
import { Novel, Plugin, Chapter } from "@typings/plugin";
import defaultCover from "@libs/defaultCover";
import novelStatus from "@libs/novelStatus"
import { parseMadaraDate } from "@libs/parseDate";
import dayjs from "dayjs";

export const id = "${baseUrl.replace(/http|https/g, '').replace(/[\:\/]/g, '')}";
export const name = "${sourceName}_madara";
export const icon = "icon/multisrc/madara/icons/${iconFileName}";
export const version = "1.0.0";
export const site = "${baseUrl}";
const baseUrl = site;

export const popularNovels: Plugin.popularNovels = async (pageNo, {showLatestNovels}) => {
    const novels: Novel.Item[] = [];
    const sortOrder = showLatestNovels
    ? '?m_orderby=latest'
    : '/?m_orderby=rating';

    let url = site + "${path.novels}" + '/page/' + pageNo + sortOrder;

    const body = await fetchApi(url).then(res => res.text());

    const loadedCheerio = cheerio.load(body);


    loadedCheerio('.manga-title-badges').remove();

    loadedCheerio('.page-item-detail').each(function () {
    const novelName = loadedCheerio(this).find('.post-title').text().trim();
    let image = loadedCheerio(this).find('img');
    const novelCover = image.attr('data-src') || image.attr('src');

    let novelUrl = loadedCheerio(this).find('.post-title')
        .find('a')
        .attr('href')
        ?.split('/')[4] || '';

    const novel: Novel.Item = {
        name: novelName,
        cover: novelCover,
        url: novelUrl,
    };

    novels.push(novel);
    });

    return novels;
};

export const parseNovelAndChapters: Plugin.parseNovelAndChapters = async (
    novelUrl
) => {
    const novel: Novel.instance = {
        url: novelUrl,
    };

    const body = await fetchApi(novelUrl).then(res => res.text());

    let loadedCheerio = cheerio.load(body);

    loadedCheerio('.manga-title-badges').remove();

    novel.name = loadedCheerio('.post-title h1').text().trim();

    novel.cover =
    loadedCheerio('.summary_image > a > img').attr('data-src') ||
    loadedCheerio('.summary_image > a > img').attr('src') ||
    defaultCover;

    loadedCheerio('.post-content_item', '.post-content').each(function () {
    const detailName = loadedCheerio(this).find('h5').text().trim();
    const detail = loadedCheerio(this).find('.summary-content').text().trim();

    switch (detailName) {
        case 'Genre(s)':
        case 'التصنيفات':
            novel.genres = detail.replace(/[\\t\\n]/g, ',');
            break;
        case 'Author(s)':
        case 'المؤلف':
            novel.author = detail;
            break;
        case 'Status':
        case 'الحالة':
            novel.status =
                detail.includes('OnGoing') || detail.includes('مستمرة')
                ? novelStatus.Ongoing
                : novelStatus.Completed;
            break;
    }
    });

    loadedCheerio('div.summary__content .code-block').remove();
    novel.summary = loadedCheerio('div.summary__content').text().trim();


    let html;

    if (${useNewChapterEndpoint}) {
        const novelId =
            loadedCheerio('.rating-post-id').attr('value') ||
            loadedCheerio('#manga-chapters-holder').attr('data-id') || '';

        let formData = new FormData();
        formData.append('action', 'manga_get_chapters');
        formData.append('manga', novelId);

        html = await fetchApi(
            baseUrl + 'wp-admin/admin-ajax.php',
            {
            method: 'POST',
            body: formData,
            })
            .then(res => res.text());
    } else {
        html = await fetchApi(
        baseUrl + 'ajax/chapters/',
        { method: 'POST' })
        .then(res => res.text());
    }

    if (html !== '0') {
        loadedCheerio = cheerio.load(html);
    }

    const chapters: Chapter.Item[] = [];
    loadedCheerio('.wp-manga-chapter').each(function () {
        const chapterName = loadedCheerio(this).find('a').text().trim();

        let releaseDate = null;
        releaseDate = loadedCheerio(this)
            .find('span.chapter-release-date')
            .text()
            .trim();

        if (releaseDate) {
            releaseDate = parseMadaraDate(releaseDate);
        } else {
            /**
             * Insert current date
             */

            releaseDate = dayjs().format('LL');
        }

        let chapterUrl = loadedCheerio(this).find('a').attr('href')?.split('/') || '';

        chapterUrl[6]
            ? (chapterUrl = chapterUrl[5] + '/' + chapterUrl[6])
            : (chapterUrl = chapterUrl[5]);

        chapters.push({ name: chapterName, releaseTime: releaseDate, url: chapterUrl });
    });

    novel.chapters = chapters.reverse();
    return novel;
};

export const parseChapter: Plugin.parseChapter = async (chapterUrl) => {
    const url = baseUrl + "/" + "${path.chapter}" + "/" + chapterUrl;

    const body = await fetchApi(chapterUrl).then(res => res.text());

    const loadedCheerio = cheerio.load(body);
    const chapterText =
    loadedCheerio('.text-left').html() ||
    loadedCheerio('.text-right').html() ||
    loadedCheerio('.entry-content').html();

    return chapterText;
};

export const searchNovels: Plugin.searchNovels = async (searchTerm) => {
    const novels: Novel.Item[] = [];
    const url = baseUrl + "?s=" + searchTerm + "&post_type=wp-manga";

    const body = await fetchApi(url).then(res => res.text());

    const loadedCheerio = cheerio.load(body);


    loadedCheerio('.c-tabs-item__content').each(function () {
    const novelName = loadedCheerio(this).find('.post-title').text().trim();

    let image = loadedCheerio(this).find('img');
    const novelCover = image.attr('data-src') || image.attr('src');

    let novelUrl = loadedCheerio(this)
        .find('.post-title')
        .find('a')
        .attr('href')
        ?.split('/')[4] || '';

    const novel = {
        name: novelName,
        cover: novelCover,
        url: novelUrl,
    };

    novels.push(novel);
    });
    return novels;
};

export const fetchImage: Plugin.fetchImage = async (url) => {
    return await fetchFile(url);
};
    `

    return { 
        lang,
        sourceName,
        pluginScript,
    };
};
