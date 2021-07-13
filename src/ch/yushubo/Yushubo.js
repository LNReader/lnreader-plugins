const express = require("express");
const YushuboScraper = require("./YushuboScraper");

const router = express.Router();

router.get("/novels/", YushuboScraper.novelsScraper);

router.get("/novel/:novelUrl", YushuboScraper.novelScraper);

router.get("/novel/:novelUrl/:chapterUrl", YushuboScraper.chapterScraper);

router.get("/search/", YushuboScraper.searchScraper);

module.exports = router;
