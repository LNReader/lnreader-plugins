const express = require("express");
const ReadLightNovelCc = require("./ReadLightNovelCcScraper");

const router = express.Router();

router.get("/novels/", ReadLightNovelCc.novelsScraper);

router.get("/novel/:novelUrl", ReadLightNovelCc.novelScraper);

router.get("/novel/:novelUrl/:chapterUrl", ReadLightNovelCc.chapterScraper);

router.get("/search/", ReadLightNovelCc.searchScraper);

module.exports = router;
