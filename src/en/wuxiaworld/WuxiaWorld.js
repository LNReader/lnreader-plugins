const express = require("express");
const wuxiaWorldScraper = require("./WuxiaWorldScraper");

const router = express.Router();

router.get("/novels/", wuxiaWorldScraper.novelsScraper);

router.get("/novel/:novelUrl", wuxiaWorldScraper.novelScraper);

router.get("/novel/:novelUrl/:chapterUrl", wuxiaWorldScraper.chapterScraper);

router.get("/search/", wuxiaWorldScraper.searchScraper);

module.exports = router;
