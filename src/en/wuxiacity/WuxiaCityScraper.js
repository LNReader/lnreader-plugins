const cheerio = require("cheerio");
const fetch = require("node-fetch");
const { parseHtml } = require("../../helper");

const extensionId = 49;

const sourceName = "wuxia.city";

const baseUrl = "https://wuxia.city/";

const novelsScraper = async (req, res) => {
    let url = `${baseUrl}genre/all`;

    const result = await fetch(url);
    const body = await result.text();

    $ = cheerio.load(body);

    let novels = [];

    $(".section-item.card").each(function () {
        const novelName = $(this).find(".book-name").text();
        const novelCover = $(this).find("img").attr("src");
        const novelUrl = $(this).find("a").attr("href").replace("/book/", "");

        const novel = {
            extensionId,
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

    const url = `${baseUrl}book/${novelUrl}`;

    const result = await fetch(url);
    const body = await result.text();

    let $ = cheerio.load(body);

    let novel = {
        extensionId,
        sourceName,
        sourceUrl: url,
        novelUrl,
    };

    novel.novelName = $("h1.book-name").text();

    novel.novelCover = $("div.book-img > img").attr("src");

    novel["Author(s)"] = $("dl.author > dd").text();

    novel["Genre(s)"] = $(".book-generes").text().trim();

    novel.novelSummary = $(".book-synopsis")
        .text()
        .replace("Synopsis", "")
        .trim();

    const chapterListUrl = `${baseUrl}book/${novelUrl}/chapter-list`;

    const chaptersHtml = await fetch(chapterListUrl);
    const chapterHtmlToString = await chaptersHtml.text();

    $ = cheerio.load(chapterHtmlToString);

    let novelChapters = [];

    $("ul.chapters > li").each(function () {
        const chapterName = $(this)
            .find(".chapter-name")
            .text()
            .trim()
            .replace(/\n/, " ");

        let releaseDate = new Date();

        let timeAgo = $(this).find(".chapter-time").text().match(/\d+/)[0];

        if (timeAgo.includes("months ago")) {
            releaseDate.setMonth(releaseDate.getMonth() - timeAgo);
        }

        if (timeAgo.includes("days ago")) {
            releaseDate.setDate(releaseDate.getDate() - timeAgo);
        }

        const chapterUrl = $(this).find("a").attr("href").split("/").pop();

        const chapter = {
            chapterName,
            releaseDate,
            chapterUrl,
        };

        novelChapters.push(chapter);
    });

    novel.novelChapters = novelChapters.reverse();

    res.json(novel);
};

const chapterScraper = async (req, res) => {
    let novelUrl = req.params.novelUrl;
    let chapterUrl = req.params.chapterUrl;

    const url = `${baseUrl}book/${novelUrl}/${chapterUrl}`;

    const result = await fetch(url);
    const body = await result.text();

    $ = cheerio.load(body);

    let chapterName = $(".chapter-name").text();

    let chapterText = $(".chapter-content").html();
    chapterText = parseHtml(chapterText);

    let nextChapter = null;
    let prevChapter = null;

    const chapter = {
        extensionId,
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

    const url = `${baseUrl}search?q=${searchTerm}`;

    const result = await fetch(url);
    const body = await result.text();

    $ = cheerio.load(body);

    let novels = [];

    $(".section-item").each(function () {
        const novelName = $(this).find(".book-name").text().trim();
        const novelCover = $(this).find("img").attr("src");

        let novelUrl = $(this).find("a").attr("href").replace("/book/", "");

        const novel = {
            extensionId,
            novelName,
            novelCover,
            novelUrl,
        };

        novels.push(novel);
    });

    res.json(novels);
};

module.exports = wuxiCityScraper = {
    novelsScraper,
    novelScraper,
    chapterScraper,
    searchScraper,
};
