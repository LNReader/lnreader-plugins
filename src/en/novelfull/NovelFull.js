const express = require("express");
const novelFullScraper = require("./NovelFullScraper");
const router = express.Router();

router.get("/novels/", novelFullScraper.novelsScraper);

router.get("/novel/:novelUrl", novelFullScraper.novelScraper);

router.get("/novel/:novelUrl/:chapterUrl", novelFullScraper.chapterScraper);

router.get("/search/", novelFullScraper.searchScraper);

module.exports = router;
