const express = require("express");
const NovelPassionScraper = require("./NovelPassionScraper");

const router = express.Router();

router.get("/novels/", NovelPassionScraper.novelsScraper);

router.get("/novel/:novelUrl", NovelPassionScraper.novelScraper);

router.get("/novel/:novelUrl/:chapterUrl", NovelPassionScraper.chapterScraper);

router.get("/search/", NovelPassionScraper.searchScraper);

module.exports = router;
