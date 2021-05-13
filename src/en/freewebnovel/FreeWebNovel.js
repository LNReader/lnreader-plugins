const express = require("express");
const freeWebNovelScraper = require("./FreeWebNovelScraper");

const router = express.Router();

router.get("/novels/", freeWebNovelScraper.novelsScraper);

router.get("/novel/:novelUrl", freeWebNovelScraper.novelScraper);

router.get("/novel/:novelUrl/:chapterUrl", freeWebNovelScraper.chapterScraper);

router.get("/search/", freeWebNovelScraper.searchScraper);

module.exports = router;
