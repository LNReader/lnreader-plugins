const cheerio = require("cheerio");
const fetch = require("node-fetch");
const { htmlToText } = require("html-to-text");
const { parseHtml } = require("../../helper");
const FormData = require("form-data");

const baseUrl = "https://www.scribblehub.com/";

const novelsScraper = async (req, res) => {
    let url = baseUrl + "series-ranking/?sort=1&order=4&pg=1";

    const result = await fetch(url);
    const body = await result.text();

    $ = cheerio.load(body);

    let novels = [];

    $("div.search_main_box").each(function (result) {
        const novelName = $(this).find("div.search_title > a").text();
        const novelCover = $(this).find("div.search_img > img").attr("src");

        let novelUrl = $(this).find("div.search_title > a").attr("href");
        novelUrl = novelUrl.split("/");
        novelUrl = novelUrl[4] + "-" + novelUrl[5];

        const novel = {
            extensionId: 35,
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
    const url = baseUrl + "read/" + novelUrl;

    const result = await fetch(url);
    const body = await result.text();

    $ = cheerio.load(body);

    let novel = {};

    novel.extensionId = 35;

    novel.sourceName = "Scribble Hub";

    novel.sourceUrl = url;

    novel.novelUrl = novelUrl;

    novel.novelName = $("div.fic_title").text();

    novel.novelCover = $("div.fic_image > img").attr("src");

    novel.novelSummary = $("div.wi_fic_desc").text();

    novel["Genre(s)"] = "";
    $("span.wi_fic_genre")
        .find("span")
        .each(function (res) {
            novel["Genre(s)"] += $(this).text() + ",";
        });
    if (novel["Genre(s)"]) {
        novel["Genre(s)"] = novel["Genre(s)"].slice(0, -1);
    }

    novel["Author(s)"] = $("span.auth_name_fic").text();

    let formData = new FormData();
    formData.append("action", "wi_getreleases_pagination");
    formData.append("pagenum", "-1");
    formData.append("mypostid", novelUrl.split("-")[0]);

    const data = await fetch(
        "https://www.scribblehub.com/wp-admin/admin-ajax.php",
        {
            method: "POST",
            body: formData,
        }
    );
    const text = await data.text();

    $ = cheerio.load(text);

    let novelChapters = [];

    $(".toc_w").each(function (result) {
        const chapterName = $(this).find(".toc_a").text();
        const releaseDate = $(this).find(".fic_date_pub").text();

        const chapterUrl = $(this).find("a").attr("href").split("/")[6];
        // .replace("/novel/" + novelUrl + "/", "");

        novelChapters.push({
            chapterName,
            releaseDate,
            chapterUrl,
        });
    });

    novel.novelChapters = novelChapters.reverse();

    res.json(novel);
};

const chapterScraper = async (req, res) => {
    let novelUrl = req.params.novelUrl;
    let chapterUrl = req.params.chapterUrl;

    const url = `${baseUrl}read/${novelUrl}/chapter/${chapterUrl}`;

    const result = await fetch(url);
    const body = await result.text();

    $ = cheerio.load(body);

    let chapterName = $("div.chapter-title").text();

    let chapterText = $("div.chp_raw").html();
    chapterText = parseHtml(chapterText);

    let nextChapter = null;
    let prevChapter = null;

    const chapter = {
        extensionId: 35,
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

    const url =
        "https://www.scribblehub.com/?s=" +
        searchTerm +
        "&post_type=fictionposts";

    const result = await fetch(url);
    const body = await result.text();

    $ = cheerio.load(body);

    let novels = [];

    $("div.search_main_box").each(function (result) {
        const novelName = $(this).find("div.search_title > a").text();
        const novelCover = $(this).find("div.search_img > img").attr("src");

        let novelUrl = $(this).find("div.search_title > a").attr("href");
        novelUrl = novelUrl.split("/");
        novelUrl = novelUrl[4] + "-" + novelUrl[5];

        const novel = {
            extensionId: 35,
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
