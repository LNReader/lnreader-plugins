const express = require("express");
const RoyalRoadScraper = require("./RoyalRoadScraper");

const router = express.Router();

router.get("/novels/", RoyalRoadScraper.novelsScraper);

router.get("/novel/:novelId/:novelUrl", RoyalRoadScraper.novelScraper);

router.get(
    "/novel/:novelId/:novelUrl/:chapterId/:chapterUrl",
    RoyalRoadScraper.chapterScraper
);

router.get("/search/", RoyalRoadScraper.searchScraper);

module.exports = router;
