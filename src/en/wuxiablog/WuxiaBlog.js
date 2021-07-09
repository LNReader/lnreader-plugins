const express = require("express");
const wuxiaBlogScraper = require("./WuxiaBlogScraper");

const router = express.Router();

router.get("/novels/", wuxiaBlogScraper.novelsScraper);

router.get("/novel/:novelUrl", wuxiaBlogScraper.novelScraper);

router.get(
    "/novel/:novelUrl/:chapterId/:chapterUrl",
    wuxiaBlogScraper.chapterScraper
);

router.get("/search/", wuxiaBlogScraper.searchScraper);

module.exports = router;
