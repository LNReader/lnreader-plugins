const express = require("express");
const WuxiaWorldScraper = require("./WuxiaWorldSiteScraper");

const router = express.Router();

router.get("/novels/", WuxiaWorldSiteScraper.novelsScraper);

router.get("/novel/:novelID/:novelUrl", WuxiaWorldSiteScraper.novelScraper);

router.get("/novel/:novelID/:novelUrl/:chapterUrl", WuxiaWorldSiteScraper.chapterScraper);

router.get("/search/", WuxiaWorldSiteScraper.searchScraper);

module.exports = router;
