const express = require("express");
const cheerio = require("cheerio");
const request = require("request");

const router = express.Router();

const baseUrl = "https://boxnovel.com/";

router.get("/latest", (req, res) => {
    let novels = [];

    request(baseUrl, (err, response, body) => {
        if (err) throw err;

        $ = cheerio.load(body);

        $(".page-item-detail").each(function (result) {
            let novelName = null;

            novelName = $(this).find("h5 > a").text();
            novelCover = $(this).find("img").attr("src");
            novelUrl = $(this)
                .find("h5 > a")
                .attr("href")
                .replace(baseUrl + "novel/", "");
            novel = {
                novelName: novelName,
                novelCover: novelCover,
                novelUrl: novelUrl,
            };

            novels.push(novel);
        });

        res.json(novels);
    });
});

module.exports = router;
