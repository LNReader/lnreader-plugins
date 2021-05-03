const express = require("express");
const cheerio = require("cheerio");
const request = require("request");
const mtlNovelScraper = require("./MTLNovelScraper");
const router = express.Router();

const baseUrl = "https://mtlnovel.com";

// Top novels

router.get("/novels/", mtlNovelScraper.novelsScraper);

router.get("/novel/:novelUrl", mtlNovelScraper.novelScraper);

router.get("/novel/:novelUrl/:chapterUrl", (req, res) => {
    let novelUrl = req.params.novelUrl;
    const url = `https://www.mtlnovel.com/${novelUrl}/${req.params.chapterUrl}/`;
    console.log(url);
    request(url, (err, response, body) => {
        if (err) throw err;

        $ = cheerio.load(body);

        let chapterName = $("h1.main-title").text();

        let chapterText = $("div.par").text();

        let nextChapter = null;
        if ($("a.next").attr("href")) {
            nextChapter = $("a.next").attr("href").replace(`/${novelUrl}/`, "");
        }

        let prevChapter = null;
        if ($("a.prev").attr("href")) {
            prevChapter = $("a.prev").attr("href").replace(`/${novelUrl}/`, "");
        }

        chapter = {
            extensionId: 5,
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
    searchTerm = req.query.s;

    const searchUrl = "https://www.mtlnovel.com";

    request.post(
        { url: searchUrl, form: { s: searchTerm } },
        (err, response, body) => {
            if (err) throw err;

            $ = cheerio.load(body);
            console.log(body);
            let novels = [];

            $("div.box").each(function (result) {
                let novelName = $(this).find("a.list-title").text();
                let novelCover = $(this).find("amp-img").attr("src");
                let novelUrl = $(this).find("a").attr("href");
                novelUrl = novelUrl.replace("https://www.mtlnovel.com/", "");

                novel = {
                    extensionId: 5,
                    novelUrl,
                    novelName,
                    novelCover,
                };

                novels.push(novel);
            });

            res.json(novels);
        }
    );
});

module.exports = router;
