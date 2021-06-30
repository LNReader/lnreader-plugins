const express = require("express");
const ScribbleHubScraper = require("./ScribbleHubScraper");

const router = express.Router();

router.get("/novels/", ScribbleHubScraper.novelsScraper);

router.get("/novel/:novelUrl", ScribbleHubScraper.novelScraper);

router.get("/novel/:novelUrl/:chapterUrl", ScribbleHubScraper.chapterScraper);

router.get("/search/", ScribbleHubScraper.searchScraper);

module.exports = router;
