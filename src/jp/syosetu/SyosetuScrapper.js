const { scraper } = require("../../helper");
const cheerio = require("cheerio");

const baseUrl = "syosetu.com";

const novelsScraper = async (req, res) => {
    const body = await scraper(`https://yomou.${baseUrl}/search.php?order=hyoka`);
    const jQuery = cheerio.load(body, { decodeEntities: false });

    let novels = [];

    jQuery(".searchkekka_box").each(function (i, e) {
        novels.push({
            novelName: jQuery(this).find(".novel_h").text(),
            novelUrl: "",
            extensionId: 36,
            novelCover: ""
        });
    });

    return novels;
}

const novelScraper = (req, res) => {

}

let chapterScraper = (req, res) => {

}

let searchScraper = (req, res) => {

}

module.exports = mtlNovelScraper = {
    novelsScraper,
    novelScraper,
    chapterScraper,
    searchScraper,
};
