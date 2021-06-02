const express = require("express");
const NovelasLigeraScraper = require("./NovelasLigeraScraper");

const router = express.Router();

router.get("/novels/", NovelasLigeraScraper.novelsScraper);

router.get("/novel/:novelUrl", NovelasLigeraScraper.novelScraper);

router.get(
    "/novel/:novelUrl/:volumeUrl?/:chapterUrl",
    NovelasLigeraScraper.chapterScraper
);

router.get("/search/", NovelasLigeraScraper.searchScraper);

module.exports = router;
