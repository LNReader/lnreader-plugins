const express = require("express");
const boxNovelScraper = require("./BoxNovelScraper");

const router = express.Router();

router.get("/novels/:pageNo", boxNovelScraper.novelsScraper);

router.get("/novel/:novelUrl", boxNovelScraper.novelScraper);

router.get("/novel/:novelUrl/:chapterUrl", boxNovelScraper.chapterScraper);

router.get("/search/", boxNovelScraper.searchScraper);

module.exports = router;
