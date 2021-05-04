const cheerio = require("cheerio");
const fetch = require("node-fetch");
const { htmlToText } = require("html-to-text");

const baseUrl = "https://noveltrench.com/";

const novelsScraper = async (req, res) => {
    let url = baseUrl;

    const result = await fetch(url);
    const body = await result.text();

    $ = cheerio.load(body);

    let novels = [];

    $(".page-item-detail").each(function (result) {
        const novelName = $(this).find(".h5 > a").text();
        const novelCover = $(this).find("img").attr("data-src");

        let novelUrl = $(this).find(".h5 > a").attr("href");
        novelUrl = novelUrl.replace(`${baseUrl}manga/`, "");

        const novel = {
            extensionId: 9,
            novelName,
            novelCover,
            novelUrl,
        };

        novels.push(novel);
    });

    res.json(novels);
};

const novelScraper = async (req, res) => {
    const novelUrl = req.params.novelUrl;
    const url = `${baseUrl}manga/${novelUrl}/`;

    const result = await fetch(url);
    const body = await result.text();

    $ = cheerio.load(body);

    let novel = {};

    novel.extensionId = 9;

    novel.sourceName = "NovelTrench";

    novel.sourceUrl = url;

    novel.novelUrl = `${novelUrl}/`;

    novel.novelName = $(".post-title > h1")
        .text()
        .replace(/[\t\n]/g, "")
        .trim();

    novel.novelCover = $(".summary_image > a > img").attr("data-src");

    $(".post-content_item").each(function (result) {
        detailName = $(this)
            .find(".summary-heading > h5")
            .text()
            .replace(/[\t\n]/g, "")
            .trim();
        detail = $(this)
            .find(".summary-content")
            .text()
            .replace(/[\t\n]/g, "")
            .trim();

        novel[detailName] = detail;
    });

    $(".description-summary > div.summary__content").find("em").remove();

    novel.novelSummary = $(".description-summary > div.summary__content")
        .text()
        .replace(/[\t\n]/g, "");

    let novelChapters = [];

    $(".wp-manga-chapter").each(function (result) {
        chapterName = $(this)
            .find("a")
            .text()
            .replace(/[\t\n]/g, "")
            .trim();

        releaseDate = $(this)
            .find("span")
            .text()
            .replace(/[\t\n]/g, "")
            .trim();

        chapterUrl = $(this).find("a").attr("href").replace(url, "");

        novelChapters.push({ chapterName, releaseDate, chapterUrl });
    });

    novel.novelChapters = novelChapters.reverse();

    res.json(novel);
};

const chapterScraper = async (req, res) => {
    let novelUrl = req.params.novelUrl;
    let chapterUrl = req.params.chapterUrl;

    const url = `${baseUrl}manga/${novelUrl}/${chapterUrl}`;

    const result = await fetch(url);
    const body = await result.text();

    $ = cheerio.load(body);

    const chapterName = $("h1#chapter-heading").text();
    let chapterText = $(".reading-content").html();
    chapterText = htmlToText(chapterText);

    let nextChapter = null;

    if ($(".nav-next").length) {
        nextChapter = $(".nav-next")
            .find("a")
            .attr("href")
            .replace(baseUrl + "manga/" + novelUrl + "/", "");
    }

    let prevChapter = null;

    if ($(".nav-previous").length) {
        prevChapter = $(".nav-previous")
            .find("a")
            .attr("href")
            .replace(baseUrl + "manga/" + novelUrl + "/", "");
    }

    novelUrl = novelUrl + "/";
    chapterUrl = chapterUrl + "/";

    const chapter = {
        extensionId: 9,
        novelUrl,
        chapterUrl,
        chapterName,
        chapterText,
        nextChapter,
        prevChapter,
    };

    res.json(chapter);
};

const searchScraper = async (req, res) => {
    const searchTerm = req.query.s;

    const url = `${baseUrl}?s=${searchTerm}&post_type=wp-manga`;

    const result = await fetch(url);
    const body = await result.text();

    $ = cheerio.load(body);

    let novels = [];

    $(".c-tabs-item__content").each(function (result) {
        const novelName = $(this).find(".h4 > a").text();
        const novelCover = $(this).find("img").attr("data-src");

        let novelUrl = $(this).find(".h4 > a").attr("href");
        novelUrl = novelUrl.replace(`${baseUrl}manga/`, "");

        const novel = {
            extensionId: 9,
            novelName,
            novelCover,
            novelUrl,
        };

        novels.push(novel);
    });

    res.json(novels);
};

module.exports = novelTrenchScraper = {
    novelsScraper,
    novelScraper,
    chapterScraper,
    searchScraper,
};
