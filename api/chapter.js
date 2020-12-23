const express = require("express");
const cheerio = require("cheerio");
const request = require("request");

const router = express.Router();

const baseUrl = "https://boxnovel.com/";

router.get("/novel/:novelUrl/:chapterUrl", (req, res) => {
    url =
        baseUrl + "novel/" + req.params.novelUrl + "/" + req.params.chapterUrl;

    request(url, (err, response, body) => {
        if (err) throw err;

        $ = cheerio.load(body);

        chapterNameLower = req.params.chapterUrl.replace("-", " ");

        chapterName =
            chapterNameLower.charAt(0).toUpperCase() +
            chapterNameLower.slice(1);

        chapterText = $(".reading-content").text();

        let nextChapter = null;

        if ($(".nav-next").length) {
            nextChapter = $(".nav-next")
                .find("a")
                .attr("href")
                .replace(baseUrl, "");
        }

        let prevChapter = null;

        if ($(".nav-previous").length) {
            prevChapter = $(".nav-previous")
                .find("a")
                .attr("href")
                .replace(baseUrl, "");
        }

        chapter = {
            chapterUrl: url,
            chapterName,
            chapterText,
            nextChapter,
            prevChapter,
        };

        res.json(chapter);
    });
});

module.exports = router;
