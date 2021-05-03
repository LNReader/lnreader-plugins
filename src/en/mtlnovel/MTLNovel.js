const express = require("express");
const mtlNovelScraper = require("./MTLNovelScraper");

const router = express.Router();

router.get("/novels/", mtlNovelScraper.novelsScraper);

router.get("/novel/:novelUrl", mtlNovelScraper.novelScraper);

router.get("/novel/:novelUrl/:chapterUrl", mtlNovelScraper.chapterScraper);

router.get("/search/", mtlNovelScraper.searchScraper);

module.exports = router;
