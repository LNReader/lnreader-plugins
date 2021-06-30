const cheerio = require("cheerio");
const fetch = require("node-fetch");
const { htmlToText } = require("html-to-text");
const { parseHtml } = require("../../helper");

const baseUrl = "https://www.novelpassion.com/";

const novelsScraper = async (req, res) => {
    let url = baseUrl + "category/all?p=1&s=1&f=4";

    const result = await fetch(url);
    const body = await result.text();

    $ = cheerio.load(body);

    let novels = [];

    $("div.j_bookList.lis-mn.ddc")
        .find("li")
        .each(function (result) {
            const novelName = $(this).find("h3").text();
            const novelCover =
                "https://www.novelpassion.com" +
                $(this).find("img").attr("src");

            let novelUrl = $(this).find("div.pr > a").attr("href");
            novelUrl = novelUrl.replace("/novel/", "");

            const novel = {
                extensionId: 33,
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
    const url = baseUrl + "novel/" + novelUrl;

    const result = await fetch(url);
    const body = await result.text();

    $ = cheerio.load(body);

    let novel = {};

    novel.extensionId = 33;

    novel.sourceName = "NovelPassion";

    novel.sourceUrl = url;

    novel.novelUrl = novelUrl;

    novelName = $("h2.mh").text();
    novel.novelName = novelName;

    novel.novelCover = baseUrl + $("i.g_thumb > img").attr("src");

    let novelSummary = $("div.j_synopsis").html();
    novel.novelSummary = htmlToText(novelSummary);

    $("address.lh20.m14.pr").each(function (result) {
        detailName = $(this).find("p.ell.dib.vam").text().trim();

        detail = $(this).find("div.dns").text().trim();

        switch (detailName) {
            case "Categories:":
                novel["Genre(s)"] = detail.trim().replace(/ -  /g, ",");
                break;
            case "Author:":
                novel["Author(s)"] = detail.trim().replace(/ -  /g, ", ");
                break;
        }

        if (detailName.includes("Status:")) {
            novel.Status = detailName.replace("Status:", "").trim();
        }
    });

    let novelChapters = [];

    $(".content-list")
        .find("li")
        .each(function (result) {
            const chapterName = $(this).find("span.sp1").text();

            const releaseDate = $(this).find("i.sp2").text();

            const chapterUrl = $(this)
                .find("a")
                .attr("href")
                .replace("/novel/" + novelUrl + "/", "");

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

    const url = `${baseUrl}novel/${novelUrl}/${chapterUrl}`;

    const result = await fetch(url);
    const body = await result.text();

    $ = cheerio.load(body);

    let chapterName = $("div.cha-content").find("strong").text();

    let chapterText = $("div.cha-content").html();
    chapterText = parseHtml(chapterText);

    let nextChapter = null;
    let prevChapter = null;

    const chapter = {
        extensionId: 33,
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

    const url = baseUrl + "search?keyword=" + searchTerm;

    const result = await fetch(url);
    const body = await result.text();

    $ = cheerio.load(body);

    let novels = [];

    $("div.j_bookList.lis-mn.ddc")
        .find("li")
        .each(function (result) {
            const novelName = $(this).find("h3").text();
            const novelCover =
                "https://www.novelpassion.com" +
                $(this).find("img").attr("src");

            let novelUrl = $(this).find("div.pr > a").attr("href");
            novelUrl = novelUrl.replace("/novel/", "");

            const novel = {
                extensionId: 33,
                novelName,
                novelCover,
                novelUrl,
            };

            novels.push(novel);
        });

    res.json(novels);
};

module.exports = vipNovelScraper = {
    novelsScraper,
    novelScraper,
    chapterScraper,
    searchScraper,
};
