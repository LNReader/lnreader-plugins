const express = require("express");
const cheerio = require("cheerio");
const request = require("request");

const router = express.Router();

const baseUrl = "https://boxnovel.com/novel/";

router.get("/novels/:pageNo/", (req, res) => {
    orderBy = req.query.o;
    pageNo = req.params.pageNo;
    let novels = [];

    url = `${baseUrl}/page/${pageNo}/?m_orderby=${orderBy}`;

    request(url, (err, response, body) => {
        if (err) throw err;

        $ = cheerio.load(body);

        $(".page-item-detail").each(function (result) {
            novelName = $(this).find("h5 > a").text();
            novelCover = $(this).find("img").attr("src");
            novelUrl = $(this).find("h5 > a").attr("href").replace(baseUrl, "");
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
