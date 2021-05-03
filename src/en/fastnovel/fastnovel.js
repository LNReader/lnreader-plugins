const express = require("express");
const fastNovelScraper = require("./FastNovelScraper");

const router = express.Router();

router.get("/novels/", fastNovelScraper.novelsScraper);

router.get("/novel/:novelUrl", fastNovelScraper.novelScraper);

router.get("/novel/:novelUrl/:chapterUrl", fastNovelScraper.chapterScraper);

router.get("/search/", fastNovelScraper.searchScraper);

module.exports = router;
