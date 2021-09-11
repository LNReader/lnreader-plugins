const express = require("express");
const WNMTLScraper = require("./WNMTLScraper");

const router = express.Router();

router.get("/novels/", WNMTLScraper.novelsScraper);

router.get("/novel/:novelUrl", WNMTLScraper.novelScraper);

router.get("/novel/:novelUrl/:chapterUrl", WNMTLScraper.chapterScraper);

router.get("/search/", WNMTLScraper.searchScraper);

module.exports = router;
