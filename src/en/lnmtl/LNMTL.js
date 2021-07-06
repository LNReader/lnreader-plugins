const express = require("express");
const lnmtlScraper = require("./LNMTLScraper");

const router = express.Router();

router.get("/novels/", lnmtlScraper.novelsScraper);
router.get("/novel/:novelUrl", lnmtlScraper.novelScraper);
router.get("/novel/:novelUrl/:chapterUrl", lnmtlScraper.chapterScraper);
router.get("/search/", lnmtlScraper.searchScraper);

module.exports = router;
