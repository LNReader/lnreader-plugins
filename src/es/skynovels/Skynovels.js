const express = require("express");
const skynovelsScraper = require("./SkynovelsScraper");

const router = express.Router();

router.get("/novels/", skynovelsScraper.novelsScraper);

router.get("/novel/:novelId/:novelUrl/", skynovelsScraper.novelScraper);

router.get(
    "/novel/:novelId/:novelUrl/:chapterId/:chapterUrl",
    skynovelsScraper.chapterScraper
);

router.get("/search/", skynovelsScraper.searchScraper);

module.exports = router;
