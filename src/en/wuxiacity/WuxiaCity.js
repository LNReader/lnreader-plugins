const express = require("express");
const wuxiaCityScraper = require("./WuxiaCityScraper");

const router = express.Router();

router.get("/novels/", wuxiaCityScraper.novelsScraper);

router.get("/novel/:novelUrl", wuxiaCityScraper.novelScraper);

router.get("/novel/:novelUrl/:chapterUrl", wuxiaCityScraper.chapterScraper);

router.get("/search/", wuxiaCityScraper.searchScraper);

module.exports = router;
