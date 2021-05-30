const express = require("express");
const WoopReadScraper = require("./WoopReadScraper");

const router = express.Router();

router.get("/novels/", WoopReadScraper.novelsScraper);

router.get("/novel/:novelUrl", WoopReadScraper.novelScraper);

router.get(
    "/novel/:novelUrl/:volumeUrl?/:chapterUrl",
    WoopReadScraper.chapterScraper
);

router.get("/search/", WoopReadScraper.searchScraper);

module.exports = router;
