const express = require("express");
const cheerio = require("cheerio");
const request = require("request");

const router = express.Router();

const baseUrl = "https://boxnovel.com/";

router.get("/novel/:novelUrl", (req, res) => {
    url = baseUrl + "novel/" + req.params.novelUrl;
    request(url, (err, response, body) => {
        if (err) throw err;

        $ = cheerio.load(body);

        $(".post-title > h3 > span").remove();

        novelName = $(".post-title > h3")
            .text()
            .replace(/[\t\n]/g, "")
            .trim();

        // authorName = $(".author-content")
        //     .text()
        //     .replace(/[\t\n]/g, "")
        //     .trim();

        // artistName = $(".artist-content")
        //     .text()
        //     .replace(/[\t\n]/g, "")
        //     .trim();

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

            chapterUrl = $(this).find("a").attr("href");

            novelChapters.push({ chapterName, releaseDate, chapterUrl });
        });

        novel = {
            novelName,
            novelDetails,
            novelChapters,
        };

        res.json(novel);
    });
});

module.exports = router;
