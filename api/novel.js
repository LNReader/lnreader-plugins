const express = require("express");
const cheerio = require("cheerio");
const request = require("request");

const router = express.Router();

const baseUrl = "https://boxnovel.com/";

router.get("/novel/:novelUrl", (req, res) => {
    novelUrl = req.params.novelUrl;
    url = baseUrl + "novel/" + novelUrl;

    request(url, (err, response, body) => {
        if (err) throw err;

        $ = cheerio.load(body);

        $(".post-title > h3 > span").remove();

        novelName = $(".post-title > h3")
            .text()
            .replace(/[\t\n]/g, "")
            .trim();

        novelCover = $(".summary_image > a > img").attr("src");

        let novelDetails = {};

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

            novelDetails[detailName] = detail;
        });

        novelSummary = $(".c_000").text();

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

            chapterUrl = $(this).find("a").attr("href").replace(baseUrl, "");

            novelChapters.push({ chapterName, releaseDate, chapterUrl });
        });

        novel = {
            novelName,
            novelUrl,
            novelCover,
            novelSummary,
            novelDetails,
            novelChapters,
        };

        res.json(novel);
    });
});

module.exports = router;
