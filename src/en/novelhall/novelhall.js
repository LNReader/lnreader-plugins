const express = require("express");
const novelhallScraper = require("./NovelhallScraper");

const router = express.Router();

router.get("/novels/", novelhallScraper.novelsScraper);

router.get("/novel/:novelUrl", novelhallScraper.novelScraper);

router.get("/novel/:novelUrl/:chapterUrl", novelhallScraper.chapterScraper);

router.get("/search/", novelhallScraper.searchScraper);

module.exports = router;
