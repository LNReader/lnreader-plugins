const cheerio = require("cheerio");
const fetch = require("node-fetch");
const { htmlToText } = require("html-to-text");
const { parseHtml } = require("../../helper");

const baseUrl = "https://www.royalroad.com/";

const novelsScraper = async (req, res) => {
    let url = baseUrl + "fictions/best-rated?page=1";

    const result = await fetch(url);
    const body = await result.text();

    $ = cheerio.load(body);

    let novels = [];

    $("div.fiction-list-item.row").each(function (result) {
        const novelName = $(this).find("h2.fiction-title").text().trim();
        const novelCover = $(this).find("img").attr("src");

        let novelUrl = $(this)
            .find("h2.fiction-title > a")
            .attr("href")
            .replace("/fiction/", "");

        const novel = {
            extensionId: 34,
            novelName,
            novelCover,
            novelUrl,
        };

        novels.push(novel);
    });

    res.json(novels);
};

const novelScraper = async (req, res) => {
    const novelId = req.params.novelId;
    const novelUrl = req.params.novelUrl;
    const url = baseUrl + "fiction/" + +novelId + "/" + novelUrl;

    const result = await fetch(url);
    const body = await result.text();

    $ = cheerio.load(body);

    let novel = {};

    novel.extensionId = 34;

    novel.sourceName = "Royal Road";

    novel.sourceUrl = url;

    novel.novelUrl = novelUrl;

    novelName = $("h1").text();
    novel.novelName = novelName;

    novel.novelCover = $("#thumbnail > img").attr("src");

    novel.novelSummary = $("div.description").text().trim();

    novel["Genre(s)"] = $("span.tags").text().trim().replace(/\n\s+/g, ",");
    novel.Status = $(
        "div.fiction-info > div.portlet > .col-md-8 > .margin-bottom-10 > span"
    )
        .first()
        .next()
        .text()
        .trim();

    let novelChapters = [];

    $("table#chapters > tbody")
        .find("tr")
        .each(function (result) {
            const chapterName = $(this).find("td").first().text().trim();
            const releaseDate = $(this).find("td").first().next().text().trim();

            const chapterUrl = $(this)
                .find("td")
                .first()
                .find("a")
                .attr("href")
                .replace(
                    "/fiction/" + +novelId + "/" + novelUrl + "/chapter/",
                    ""
                );

            novelChapters.push({
                chapterName,
                releaseDate,
                chapterUrl,
            });
        });

    novel.novelChapters = novelChapters;

    res.json(novel);
};

const chapterScraper = async (req, res) => {
    let novelUrl = req.params.novelUrl;
    let chapterUrl = req.params.chapterUrl;

    const url = `${baseUrl}fiction/${req.params.novelId}/${novelUrl}/chapter/${req.params.chapterId}/${req.params.chapterUrl}`;

    console.log(url);

    const result = await fetch(url);
    const body = await result.text();

    $ = cheerio.load(body);

    let chapterName = $("div.chapter-content").find("strong").text();

    let chapterText = $("div.chapter-content").html();
    chapterText = parseHtml(chapterText);

    let nextChapter = null;
    let prevChapter = null;

    const chapter = {
        extensionId: 34,
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

    const url = baseUrl + "fictions/search?title=" + searchTerm;

    console.log(url);

    const result = await fetch(url);
    const body = await result.text();

    $ = cheerio.load(body);

    let novels = [];

    $("div.fiction-list-item.row").each(function (result) {
        const novelName = $(this).find("h2.fiction-title").text().trim();
        let novelCover = $(this).find("img").attr("src");

        if (novelCover.includes("Content")) {
            novelCover = baseUrl + novelCover;
        }

        let novelUrl = $(this)
            .find("h2.fiction-title > a")
            .attr("href")
            .replace("/fiction/", "");

        const novel = {
            extensionId: 34,
            novelName,
            novelCover,
            novelUrl,
        };

        novels.push(novel);
    });

    res.json(novels);
};

module.exports = RoyalRoadScraper = {
    novelsScraper,
    novelScraper,
    chapterScraper,
    searchScraper,
};
