const express = require("express");
const cheerio = require("cheerio");
const request = require("request");

const router = express.Router();

const baseUrl = "https://novelfull.com";

// Top novels

router.get("/novels/", (req, res) => {
    let url = `${baseUrl}/most-popular`;

    console.log(url);

    request(url, (err, response, body) => {
        if (err) throw err;

        let novels = [];

        $ = cheerio.load(body);

        $("div.col-truyen-main > div.list-truyen > .row").each(function (
            result
        ) {
            let novelUrl = $(this)
                .find("h3.truyen-title > a")
                .attr("href")
                .replace(".html", "")
                .substring(1);
            novelUrl = `${novelUrl}/`;
            let novelName = $(this).find("h3.truyen-title > a").text();
            let novelCover = $(this).find("img").attr("src");
            novelCover = baseUrl + novelCover;

            novel = {
                extensionId: 8,
                novelUrl,
                novelName,
                novelCover,
            };

            novels.push(novel);
        });

        res.json(novels);
    });
});

router.get("/novel/:novelUrl", (req, res) => {
    let novelUrl = req.params.novelUrl;
    url = `${baseUrl}/${novelUrl}.html`;

    request(url, (err, response, body) => {
        $ = cheerio.load(body);

        let novel = {};

        novel.extensionId = 8;

        novel.sourceName = "NovelFull";

        novel.sourceUrl = url;

        novel.novelUrl = `${novelUrl}/`;

        novel.novelName = $("div.book > img").attr("alt");

        novel.novelCover = baseUrl + $("div.book > img").attr("src");

        novel.novelSummary = $("div.desc-text").text();

        novel["Author(s)"] = $("div.info > div > h3")
            .filter(function () {
                return $(this).text().trim() === "Author:";
            })
            .siblings()
            .text();

        novel["Genre(s)"] = $("div.info > div")
            .filter(function () {
                return $(this).find("h3").text().trim() === "Genre:";
            })
            .text()
            .replace("Genre:", "");

        novel["Artist(s)"] = null;

        novel.Status = $("div.info > div > h3")
            .filter(function () {
                return $(this).text().trim() === "Status:";
            })
            .next()
            .text();

        const novelId = $("#rating").attr("data-novel-id");
        console.log(novelId);

        const chapterListUrl =
            baseUrl + "/ajax/chapter-option?novelId=" + novelId;

        function callback(res) {
            console.log(res);
            novel.novelChapters = res;
        }

        request(chapterListUrl, (err, response, body) => {
            $ = cheerio.load(body);
            let novelChapters = [];

            $("select > option").each(function (result) {
                let chapterName = $(this).text();
                let releaseDate = null;
                let chapterUrl = $(this).attr("value");
                chapterUrl = chapterUrl.replace(`/${novelUrl}/`, "");

                novelChapters.push({
                    chapterName,
                    releaseDate,
                    chapterUrl,
                });
            });
            callback(novelChapters);

            res.json(novel);
        });
    });
});

router.get("/novel/:novelUrl/:chapterUrl", (req, res) => {
    let novelUrl = req.params.novelUrl.replace(".html/", "");
    url = `${baseUrl}/${novelUrl}/${req.params.chapterUrl}`;

    request(url, (err, response, body) => {
        if (err) throw err;

        $ = cheerio.load(body);

        let chapterName = $(".chapter-title").attr("title");

        let chapterText = $("#chapter-content").text();

        let nextChapter = null;
        if ($("a#next_chap").attr("href")) {
            nextChapter = $("a#next_chap")
                .attr("href")
                .replace(`/${novelUrl}/`, "");
        }

        let prevChapter = null;
        if ($("a#prev_chap").attr("href")) {
            prevChapter = $("a#prev_chap")
                .attr("href")
                .replace(`/${novelUrl}/`, "");
        }

        chapter = {
            extensionId: 8,
            novelUrl: `${req.params.novelUrl}`,
            chapterUrl: `${req.params.chapterUrl}`,
            chapterName,
            chapterText,
            nextChapter,
            prevChapter,
        };

        res.json(chapter);
    });
});

router.get("/search/", (req, res) => {
    let searchTerm = req.query.s;
    searchUrl = `https://novelfull.com/search?keyword=`;

    url = `${searchUrl}${searchTerm}`;

    request(url, (err, response, body) => {
        if (err) throw err;

        $ = cheerio.load(body);

        let novels = [];

        $("div.col-truyen-main > div.list-truyen > .row").each(function (
            result
        ) {
            let novelUrl = $(this)
                .find("h3.truyen-title > a")
                .attr("href")
                .replace(".html", "")
                .substring(1);
            novelUrl = `${novelUrl}/`;
            let novelName = $(this).find("h3.truyen-title > a").text();
            let novelCover = $(this).find("img").attr("src");

            novel = {
                extensionId: 8,
                novelUrl,
                novelName,
                novelCover,
            };

            novels.push(novel);
        });

        res.json(novels);
    });
});

module.exports = router;
