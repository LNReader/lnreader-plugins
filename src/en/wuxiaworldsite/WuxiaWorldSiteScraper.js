const cheerio = require("cheerio");
const fetch = require("node-fetch");
const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer")

const baseUrl = "https://wuxiaworldsite.co/";
const searchUrl = "https://wuxiaworldsite.co/search/";

const novelsScraper = async (req, res) => {
    const url = `${baseUrl}/power-ranking`;

    const result = await fetch(url);
    const body = await result.text();

    $ = cheerio.load(body);

    let novels = [];

    $(".a_item").each( (i, el) => {
        const novelName = $(el).find("a").attr("title");
        const novelCover = baseUrl + $(el).find("a > img").attr("src"); 
        const novelUrl = $(el).find(".name_views > a").attr("href");

        const novel = {
            extensionId: 12,
            novelName,
            novelCover,
            novelUrl,
        };

        novels.push(novel);
    });

    res.json(novels);
}

const novelScraper = async (req, res) => {
    const novelUrl = req.params.novelUrl;
    const url = `${baseUrl}${novelUrl}`;

    // Puppeteer used for mouse click event to load the full list
    const scraper = async () => {
        const browser = await puppeteer.launch({
            args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: true,
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();
        await page.goto(url);
        await page.click(".show-more-list");
        await page.waitFor(1000);
        return await page.content();
    };

    const body = await scraper(url);

    $ = cheerio.load(body);

    $(".category_list").remove();

    let novel = {};

    novel.extensionId = 12;

    novel.sourceName = "WuxiaWorldSite";

    novel.sourceUrl = url;

    novel.novelUrl = novelUrl + "/";

    novel.novelName = $(".content-reading > h1").text();

    novel.novelCover = baseUrl + $(".img-read> img").attr("src");

    novel.novelSummary = $(".story-introduction-content").text();

    novel["Author(s)"] = $(".content-reading > p").text();

    novel["Artist(s)"] = null;

    novel["Genre(s)"] = "";

    $(".a_tag_item").each((i, el) => {
        novel["Genre(s)"] += $(el).text() + ",";
    });

    novel["Genre(s)"] = novel["Genre(s)"].split(",");
    novel["Genre(s)"].pop();

    novel.Status = novel["Genre(s)"].pop();

    novel["Genre(s)"] = novel["Genre(s)"].join(",");    

    let novelChapters = [];

    $(".new-update-content").each((i, el) => {
        let chapterName = $(el).text().split(/\t+/);
        const releaseDate = chapterName.pop();
        chapterName = chapterName[0];
        let chapterUrl = $(el).attr("href");   
        chapterUrl = chapterUrl.split("/").pop();

        const novel = {
            chapterName,
            releaseDate,
            chapterUrl,
        };

        novelChapters.push(novel);
    });

    novel.novelChapters = novelChapters.slice(3);

    res.json(novel);
};

const chapterScraper = async (req, res) => {
    let novelUrl = req.params.novelUrl;
    let chapterUrl = req.params.chapterUrl;

    const url = `${baseUrl}/${novelUrl}/${chapterUrl}`;

    const result = await fetch(url);
    const body = await result.text();

    $ = cheerio.load(body);

    let chapterText = $("#content").html() || "";
    let chapterName = "";
    if (chapterText) {
        chapterText = chapterText.split("<br>");
        chapterName = chapterText.shift();
    } else {
        $("p").each((i, el) => {
            if ($(el).css("display") !== "none") {
                chapterText += $(el).text() + "\n";
            }
        });
        chapterText = chapterText.split("\n");
        chapterName = chapterText.shift();
    }

    chapterText = chapterText.join("\n");

    const prevChapter = $(".pre").attr("href") 
        ? $(".pre").attr("href").split("/").pop() 
        : null;

    const nextChapter = $(".next_sesction > a").attr("href") 
        ? $(".next_sesction > a").attr("href").split("/").pop() 
        : null;


    novelUrl += "/";
    chapterUrl += "/";

    const chapter = {
        extensionId: 12,
        novelUrl,
        chapterUrl,
        chapterName,
        chapterText,
        nextChapter,
        prevChapter,
    };

    res.json(chapter);
};

const searchScraper = async (req, res) => {
    const searchTerm = req.query.s;

    const url = `${searchUrl}${searchTerm}`;

    const result = await fetch(url);
    const body = await result.text();
    
    $ = cheerio.load(body);

    let novels = [];

    $(".a_item").each( (i, el) => {
        const novelName = $(el).find(".name_views > a").attr("title");
        const novelCover = baseUrl + $(el).find("a > img").attr("src");
        const novelUrl = $(el).find(".name_views > a").attr("href");
    
        const novel = {
            extensionId: 12,
            novelName,
            novelCover,
            novelUrl,
        };

        novels.push(novel);
    });

    res.json(novels)
};


module.exports = WuxiaWorldSiteScraper = {
    novelsScraper,
    novelScraper,
    chapterScraper,
    searchScraper,
};
