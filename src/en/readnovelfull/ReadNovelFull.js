const express = require("express");
const readNovelFullScraper = require("./ReadNovelFullScraper");

const router = express.Router();

router.get("/novels/", readNovelFullScraper.novelsScraper);

router.get("/novel/:novelUrl", readNovelFullScraper.novelScraper);

router.get("/novel/:novelUrl/:chapterUrl", readNovelFullScraper.chapterScraper);

router.get("/search/", readNovelFullScraper.searchScraper);

module.exports = router;
