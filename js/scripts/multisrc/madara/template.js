"use strict";
module.exports = function generator(sourceJson) {
    const { baseUrl, sourceName, options } = sourceJson;
    const lang = (options === null || options === void 0 ? void 0 : options.lang) || 'English';
    const path = (options === null || options === void 0 ? void 0 : options.path) || {
        novels: 'novel',
        novel: 'novel',
        chapter: 'novel',
    };
    const useNewChapterEndpoint = (options === null || options === void 0 ? void 0 : options.useNewChapterEndpoint) || false;
    const pluginScript = `
        import dayjs from 'dayjs';
        import * as cheerio from 'cheerio';
        import fetchApi from "@libs/fetchApi";
        import fetchFile from "@libs/fetchFile";
        
        const pluginId = ${sourceName.replace(/\s+/g, '')};
        export async function popularNovels(page, {showLatestNovels}){
            const sortOrder = showLatestNovels
            ? '?m_orderby=latest'
            : '/?m_orderby=rating';
      
            let url = ${baseUrl} + ${path.novels} + '/page/' + page + sortOrder;
      
            const body = await fetchApi({ url, sourceId });
      
            const loadedCheerio = cheerio.load(body);
      
            let novels = [];
      
            loadedCheerio('.manga-title-badges').remove();
      
            loadedCheerio('.page-item-detail').each(function () {
                const novelName = loadedCheerio(this).find('.post-title').text().trim();
                let image = loadedCheerio(this).find('img');
                const novelCover = image.attr('data-src') || image.attr('src');
        
                let novelUrl = loadedCheerio(this)
                .find('.post-title')
                .find('a')
                .attr('href')
                .split('/')[4];
        
                const novel = {
                    name: novelName,
                    cover: novelCover,
                    url: novelUrl,
                };
        
                novels.push(novel);
            });
        
            return novels;
        }
    `;
    return {
        name: sourceName,
        pluginScript,
    };
};
