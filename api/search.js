const express = require("express");
const cheerio = require("cheerio");
const request = require("request");

const router = express.Router();

const baseUrl = "https://boxnovel.com/";

router.get("/search/", (req, res) => {
    searchTerm = req.query.s;
    orderBy = req.query.o;

    url =
        baseUrl +
        "?s=" +
        searchTerm +
        "&post_type=wp-manga&m_orderby=" +
        orderBy;
    request(url, (err, response, body) => {
        if (err) throw err;

        $ = cheerio.load(body);

        let novels = [];

        $(".c-tabs-item__content").each(function (result) {
            novelName = $(this).find("h4 > a").text();

            let novelDetails = {};

            $(this)
                .find(".post-content_item")
                .each(function (result) {
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

            novelCover = $(this).find("img").attr("src");

            novelUrl = $(this)
                .find("h4 > a")
                .attr("href")
                .replace(baseUrl + "novel/", "");

            novels.push({ novelName, novelCover, novelUrl, novelDetails });
        });

        res.json(novels);
    });
});

module.exports = router;
