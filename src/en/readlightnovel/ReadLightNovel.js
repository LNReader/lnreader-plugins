const express = require("express");
const readLightNovelScraper = require("./ReadLightNovelScraper.js");

const router = express.Router();

router.get("/novels/", readLightNovelScraper.novelsScraper);

router.get("/novel/:novelUrl", readLightNovelScraper.novelScraper);

router.get(
    "/novel/:novelUrl/:chapterUrl/:volumeUrl?",
    readLightNovelScraper.chapterScraper
);

router.get("/search/", readLightNovelScraper.searchScraper);

module.exports = router;
