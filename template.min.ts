import * as cheerio from "cheerio";
import fetchApi from "@libs/fetchApi";
import fetchFile from "@libs/fetchFile";
import { Filter } from "@libs/filterInputs";
import { Novel, Plugin } from "@typings/plugin";
// const dayjs = require('dayjs');
// const FilterInputs = require('@libs/filterInputs');
// const novelStatus = require('@libs/novelStatus');
// const isUrlAbsolute = require('@libs/isAbsoluteUrl');
// const parseDate = require('@libs/parseDate');

export const id = ""; // string and must be unique
export const name = "Source name";
export const icon = ""; // The relative path to the icon without @icons . For example: 'src/vi/hakolightnovel/icon.png'
export const version = "0.0.0"; // xx.xx.xx
export const site = ""; // the link to the site
// export const filters: Filter[] = [];
exports["protected"] = false; // true if this site protect its resources (images) and you have to define headers or smt to bypass

export const popularNovels: Plugin.popularNovels = async (pageNo) => {
    const novels: Novel.Item[] = [];

    return novels;
};

export const parseNovelAndChapters: Plugin.parseNovelAndChapters = async (
    novelUrl
) => {
    const novel: Novel.instance = {
        url: novelUrl,
        chapters: [],
    };

    return novel;
};

export const parseChapter: Plugin.parseChapter = async (chapterUrl) => {
    const chapterText = "";

    return chapterText;
};

export const searchNovels: Plugin.searchNovels = async (searchTerm) => {
    const novels: Novel.Item[] = [];

    return novels;
};

export const fetchImage: Plugin.fetchImage = async (url) => {
    return await fetchFile(url, {});
};
