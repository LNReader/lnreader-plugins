const express = require("express");
const cheerio = require("cheerio");
const request = require("request");

const router = express.Router();

const baseUrl = "https://mtlnovel.com";

// Top novels

router.get("/novels/", (req, res) => {
    const url = `${baseUrl}/alltime-rank/`;

    request(url, (err, response, body) => {
        if (err) throw err;

        let novels = [];

        $ = cheerio.load(body);

        $("div.box.wide").each(function (result) {
            let novelUrl = $(this).find("a.list-title").attr("href");
            novelUrl = novelUrl.replace("https://www.mtlnovel.com/", "");

            let novelName = $(this).find("a.list-title").text().slice(4);
            let novelCover = $(this).find("amp-img").attr("src");

            novel = {
                extensionId: 5,
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
    const url = `${baseUrl}/${novelUrl}`;
    console.log(url);

    request(url, (err, response, body) => {
        $ = cheerio.load(body);

        let novel = {};

        novel.extensionId = 5;

        novel.sourceName = "MTLNovel";

        novel.sourceUrl = url;

        novel.novelUrl = `${novelUrl}/`;

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

        function callback(res) {
            console.log(res);
            novel.novelChapters = res;
        }

        request(`${url}/chapter-list/`, (err, response, body) => {
            $ = cheerio.load(body);
            console.log(`${url}/chapter-list/`);
            // console.log($("div.ch-list").find("a.ch-link").next().html());
            let novelChapters = [];

            $("div.ch-list")
                .find("a.ch-link")
                .each(function (result) {
                    let chapterName = $(this).text().replace("~ ", "");

                    let releaseDate = null;

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

            callback(novelChapters);

            return res.json(novel);
        });
    });
});

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
