const cheerio = require("cheerio");
const fetch = require("node-fetch");
const UserAgent = require("user-agents");

const baseUrl = "https://fastnovel.net";
const searchUrl = `https://fastnovel.net/search/`;

const novelsScraper = async (req, res) => {
    const url = `${baseUrl}/list/most-popular.html`;

    const userAgent = new UserAgent();

    const result = await fetch(url, { headers: { "user-agent": userAgent } });
    const body = await result.text();

    $ = cheerio.load(body);

    let novels = [];

    $(".film-item").each(function (result) {
        const novelName = $(this).find(".name").text();
        const novelCover = $(this).find(".img").attr("data-original");
        const novelUrl = $(this).find("a").attr("href").substring(1);

        const novel = {
            extensionId: 3,
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
    const url = `${baseUrl}/${novelUrl}/`;

    const userAgent = new UserAgent();

    const result = await fetch(url, { headers: { "user-agent": userAgent } });
    const body = await result.text();

    $ = cheerio.load(body);

    let novel = {};

    novel.extensionId = 3;

    novel.sourceName = "FastNovel";

    novel.sourceUrl = url;

    novel.novelUrl = novelUrl + "/";

    novel.novelName = $("h1").text();

    novel.novelCover = $(".book-cover").attr("data-original");

    novel.novelSummary = $("div.film-content > p").text();

    novel["Author(s)"] = $("li > label")
        .filter(function () {
            return $(this).text().trim() === "Author:";
        })
        .next()
        .text();

    novel["Genre(s)"] = $("li")
        .filter(function () {
            return $(this).find("label").text().trim() === "Genre:";
        })
        .text()
        .replace("Genre:", "");

    novel["Artist(s)"] = null;

    novel.Status = null;

    let novelChapters = [];

    $(".chapter").each(function (result) {
        const chapterName = $(this).text();
        const releaseDate = null;
        let chapterUrl = $(this).attr("href");
        chapterUrl = chapterUrl.replace(`/${novelUrl}/`, "");

        const novel = {
            chapterName,
            releaseDate,
            chapterUrl,
        };

        novelChapters.push(novel);
    });

    novel.novelChapters = novelChapters;

    res.json(novel);
};

const chapterScraper = async (req, res) => {
    let novelUrl = req.params.novelUrl;
    let chapterUrl = req.params.chapterUrl;

    const url = `${baseUrl}/${novelUrl}/${chapterUrl}`;

    const userAgent = new UserAgent();

    const result = await fetch(url, { headers: { "user-agent": userAgent } });
    const body = await result.text();

    $ = cheerio.load(body);

    const chapterName = $(".episode-name").text();
    const chapterText = $("#chapter-body").text();

    let nextChapter = null;

    nextChapter = $("div.btn-group > a")
        .filter(function () {
            return $(this).text().trim() === "Next Chapter";
        })
        .attr("href")
        .replace("/", "");

    let prevChapter = null;

    prevChapter = $("div.btn-group > a")
        .filter(function () {
            return $(this).text().trim() === "Prev Chapter";
        })
        .attr("href")
        .replace("/", "");

    novelUrl = novelUrl + "/";
    chapterUrl = chapterUrl + "/";

    const chapter = {
        extensionId: 3,
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

    const url = `${searchUrl}${searchTerm}`;

    const userAgent = new UserAgent();

    const result = await fetch(url, { headers: { "user-agent": userAgent } });
    const body = await result.text();

    $ = cheerio.load(body);

    let novels = [];

    $(".film-item").each(function (result) {
        const novelName = $(this).find("div.title > p.name").text();
        const novelCover = $(this).find(".img").attr("data-original");
        const novelUrl = $(this).find("a").attr("href").substring(1);

        const novel = {
            extensionId: 3,
            novelName,
            novelCover,
            novelUrl,
        };

        novels.push(novel);
    });

    res.json(novels);
};

module.exports = fastNovelScraper = {
    novelsScraper,
    novelScraper,
    chapterScraper,
    searchScraper,
};
