const cheerio = require("cheerio");
const fetch = require("node-fetch");
const { scraper } = require("../../helper");

const baseUrl = "https://mtlnovel.com";

const novelsScraper = async (req, res) => {
    const url = `${baseUrl}/alltime-rank/`;

    const body = await scraper(url);

    $ = cheerio.load(body);

    let novels = [];

    $("div.box.wide").each(function (result) {
        const novelName = $(this).find("a.list-title").text().slice(4);
        const novelCover = $(this).find("amp-img").attr("src");

        let novelUrl = $(this).find("a.list-title").attr("href");
        novelUrl = novelUrl.replace("https://www.mtlnovel.com/", "");

        const novel = {
            extensionId: 5,
            novelUrl,
            novelName,
            novelCover,
        };

        novels.push(novel);
    });

    res.json(novels);
};

const novelScraper = async (req, res) => {
    const novelUrl = req.params.novelUrl;
    const url = `${baseUrl}/${novelUrl}`;

    const body = await scraper(url);

    $ = cheerio.load(body);

    let novel = {};

    novel.extensionId = 5;

    novel.sourceName = "MTLNovel";

    novel.sourceUrl = url;

    novel.novelUrl = novelUrl + "/";

    novel.novelName = $("h1.entry-title").text();

    novel.novelCover = $("amp-img").attr("src");

    novel.novelSummary = $("div.desc > h2").next().text();

    novel["Author(s)"] = $("tr > td")
        .filter(function () {
            return $(this).prev().text().trim() === "Author";
        })
        .next()
        .text()
        .replace("Auhtor:", "");

    novel.Status = $("tr > td")
        .filter(function () {
            return $(this).prev().text().trim() === "Status";
        })
        .next()
        .text()
        .replace("Status:", "");

    novel["Genre(s)"] = $("td")
        .filter(function () {
            return $(this).prev().text().trim() === "Genre";
        })
        .next()
        .text()
        .replace("Genre:", "");

    novel["Artist(s)"] = null;

    const chapterListUrl = url + "/chapter-list/";

    const getChapters = async () => {
        const body = await scraper(chapterListUrl);

        $ = cheerio.load(body);

        let novelChapters = [];

        $("div.ch-list")
            .find("a.ch-link")
            .each(function (result) {
                const chapterName = $(this).text().replace("~ ", "");
                const releaseDate = null;

                let chapterUrl = $(this).attr("href");
                chapterUrl = chapterUrl.replace(
                    `https://www.mtlnovel.com/${novelUrl}/`,
                    ""
                );

                novelChapters.push({
                    chapterUrl,
                    chapterName,
                    releaseDate,
                });
            });
        return novelChapters;
    };

    novel.novelChapters = await getChapters();

    res.json(novel);
};

const chapterScraper = async (req, res) => {
    let novelUrl = req.params.novelUrl;
    let chapterUrl = req.params.chapterUrl;

    const url = `${baseUrl}/${novelUrl}/${chapterUrl}`;

    const result = await fetch(url);
    const body = await result.text();

    $ = cheerio.load(body);

    const chapterName = $("div.text-left > h3").text();
    const chapterText = $(".reading-content").text();

    let nextChapter = null;

    if ($(".nav-next").length) {
        nextChapter = $(".nav-next")
            .find("a")
            .attr("href")
            .replace(baseUrl + "/" + novelUrl + "/", "");
    }

    let prevChapter = null;

    if ($(".nav-previous").length) {
        prevChapter = $(".nav-previous")
            .find("a")
            .attr("href")
            .replace(baseUrl + "/" + novelUrl + "/", "");
    }

    novelUrl = novelUrl + "/";
    chapterUrl = chapterUrl + "/";

    const chapter = {
        extensionId: 1,
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
    const orderBy = req.query.o;

    const url = `${searchUrl}?s=${searchTerm}&post_type=wp-manga&m_orderby=${orderBy}`;

    const result = await fetch(url);
    const body = await result.text();

    $ = cheerio.load(body);

    let novels = [];

    $(".c-tabs-item__content").each(function (result) {
        const novelName = $(this).find("h4 > a").text();
        const novelCover = $(this).find("img").attr("src");

        let novelUrl = $(this).find("h4 > a").attr("href");
        novelUrl = novelUrlreplace(`${baseUrl}/`, "");

        const novel = {
            extensionId: 1,
            novelName,
            novelCover,
            novelUrl,
        };

        novels.push(novel);
    });

    res.json(novels);
};

module.exports = mtlNovelScraper = {
    novelsScraper,
    novelScraper,
    chapterScraper,
    searchScraper,
};
