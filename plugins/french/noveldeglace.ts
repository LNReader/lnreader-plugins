import { load } from "cheerio";
import { fetchApi, fetchFile } from "@libs/fetch";
import { Plugin } from "@typings/plugin";
import { NovelStatus } from "@libs/novelStatus";
import { Filters, FilterTypes } from "@libs/filterInputs";
import { defaultCover } from "@libs/defaultCover";

class NovelDeGlacePlugin implements Plugin.PluginBase{
    id: string;
    name: string;
    icon: string;
    site: string;
    version: string;
    filters?: Filters;

    constructor() {
        this.id = "noveldeglace.com";
        this.name = "NovelDeGlace";
        this.icon = "src/fr/noveldeglace/icon.png";
        this.site = "https://noveldeglace.com/";
        this.version = "1.0.1";
        this.filters = {
            categorie_genre: {
                type: FilterTypes.Picker,
                label: "Catégorie/Genre",
                value: "all",
                options: [
                    { label: "Tous", value: "all" },
                    { label: "═══CATÉGORIES═══", value: "categorie_roman" },
                    { label: "Seinen", value: "c_seinen" },
                    { label: "Shonen", value: "c_shonen" },
                    { label: "Original", value: "c_original" },
                    { label: "Yuri", value: "c_yuri" },
                    { label: "Autre", value: "c_autre" },
                    { label: "Fille", value: "c_fille" },
                    { label: "Roman pour Adulte", value: "c_roman-pour-adulte" },
                    { label: "Xuanhuan", value: "c_xuanhuan" },
                    { label: "Yaoi", value: "c_yaoi" },
                    { label: "═══GENRES═══", value: "genre" },
                    { label: "Action", value: "g_action" },
                    { label: "Aventure", value: "g_aventure" },
                    { label: "Comédie", value: "g_comedie" },
                    { label: "Drame", value: "g_drame" },
                    { label: "Fantastique", value: "g_fantastique" },
                    { label: "Harem", value: "g_harem" },
                    { label: "Psychologique", value: "g_psychologique" },
                    { label: "Romance", value: "g_romance" },
                    { label: "Ecchi", value: "g_ecchi" },
                    { label: "Mature", value: "g_mature" },
                    { label: "Surnaturel", value: "g_surnaturel" },
                    { label: "Vie scolaire", value: "g_vie-scolaire" },
                    { label: "Adulte", value: "g_adulte" },
                    { label: "Tragédie", value: "g_tragedie" },
                    { label: "Arts Martiaux", value: "g_arts-martiaux" },
                    { label: "Pas de harem", value: "g_pas-de-harem" },
                    { label: "Tranche de vie", value: "g_tranche-de-vie" },
                    { label: "Mecha", value: "g_mecha" },
                    { label: "Sci-fi", value: "g_sci-fi" },
                    { label: "Science-Fiction", value: "g_science-fiction" },
                    { label: "Anti-Héros", value: "g_anti-heros" },
                    { label: "Horreur", value: "g_horreur" },
                    { label: "Insectes", value: "g_insectes" },
                    { label: "Mystère", value: "g_mystere" },
                    { label: "Lolicon", value: "g_lolicon" },
                    { label: "Shoujo Ai", value: "g_shoujo-ai" },
                    { label: "Smut", value: "g_smut" },
                    { label: "Xuanhuan", value: "g_xuanhuan" },
                    { label: "Shotacon", value: "g_shotacon" },
                ],
            },
        } satisfies Filters;
    }

    async popularNovels(page: number, { filters, showLatestNovels }: Plugin.PopularNovelsOptions<typeof this.filters>): Promise<Plugin.NovelItem[]> {
        let url = this.site;
        if (showLatestNovels)
            url += "chapitre"
        else
        {
            let cat_gen: string = "all";
            if (filters && typeof filters.categorie_genre.value == "string")
                cat_gen = filters.categorie_genre.value;
            if (cat_gen != "all" && cat_gen != "categorie_roman" && cat_gen != "genre")
            {
                if (cat_gen[0] == "c")
                    url += "categorie_roman/" + cat_gen.substring(2);
                else if (cat_gen[0] == "g")
                    url += "genre/" + cat_gen.substring(2);
            }
            else if (page > 1)
                return ([]); // when asking for all novels, there is only 1 page
            else
                url += "roman";
        }
        url += "/page/" + page;

        const result = await fetchApi(url, {headers: { 'Accept-Encoding': 'deflate' },});
        const body = await result.text();
        let loadedCheerio = load(body);
    
        let novels: Plugin.NovelItem[] = [];
    
        loadedCheerio("article").each(function () {
            const novelName = loadedCheerio(this).find("h2").text().trim();
            const novelCover = loadedCheerio(this).find("img").attr("src");
            let novelUrl;
            if (showLatestNovels)
                novelUrl = loadedCheerio(this).find("span.Roman > a").attr("href");
            else
                novelUrl = loadedCheerio(this).find("h2 > a").attr("href");
    
            if (!novelUrl) return;
    
            const novel:Plugin.NovelItem = {
                name: novelName,
                cover: novelCover,
                url: novelUrl,
            };
    
            novels.push(novel);
        });
    
        return novels;
    };
    
    async parseNovelAndChapters(novelUrl: string): Promise<Plugin.SourceNovel> {
        const url = novelUrl;
        const result = await fetchApi(url, {headers: { 'Accept-Encoding': 'deflate' }});
        const body = await result.text();

        let loadedCheerio = load(body);

        let novel: Plugin.SourceNovel = { url };

        novel.name = (loadedCheerio("div.entry-content > div > strong")[0]
            .nextSibling as Text | null)
            ?.nodeValue
            ?.trim() || '';  

        novel.cover = loadedCheerio(".su-row > div > div > img")
            .attr("src") || defaultCover;
        
        let novelInfos = loadedCheerio("div[data-title=Tomes] >")
            .toArray();
        novelInfos.pop();
        novelInfos.shift();
        novel.summary = loadedCheerio("div[data-title=Synopsis]")
        .text()
         + "\n\n" + novelInfos.map((el) => loadedCheerio(el).text()).join("\n").trim();

        novel.author = loadedCheerio("strong:contains('Auteur :')")
            .parent()
            .text()
            .replace("Auteur : ", "")
            .trim();

        novel.artist = loadedCheerio("strong:contains('Illustrateur :')")
            .parent()
            .text()
            .replace("Illustrateur :", "")
            .trim();

        const categorie = loadedCheerio(".categorie")
            .text()
            .replace("Catégorie :", "")
            .trim();
        const genres = loadedCheerio(".genre")
            .text()
            .replace("Genre :", "")
            .replace(/, /g, ",")
            .trim();
        if (categorie && categorie != "Autre")
            novel.genres = categorie;
        if (genres)
            novel.genres = novel.genres ? novel.genres + "," + genres : genres;

        let status = loadedCheerio("strong:contains('Statut :')")
            .parent()
            .attr("class");
        switch (status) {
            case "type etat0":
                novel.status = NovelStatus.Ongoing;
                break;
            case "type etat1":
                novel.status = NovelStatus.Ongoing;
                break;
            case "type etat4":
                novel.status = NovelStatus.OnHiatus;
                break;
            case "type etat5":
                novel.status = NovelStatus.Completed;
                break;
            case "type etat6":
                novel.status = NovelStatus.Cancelled;
                break;
            default:
                novel.status = NovelStatus.Unknown;
                break;
        }

        let novelChapters: Plugin.ChapterItem[] = [];

        const volumes = loadedCheerio("div[data-title=Tomes] > div")
            .last()
            .contents();
        const hasMultipleVolumes = volumes.length > 1;
    
        let chapterName = ""
        volumes.each(function (i, el) {
            if (hasMultipleVolumes)
                chapterName = "T." + (i + 1) + " ";
            loadedCheerio(this)
                .find(".chpt")
                .each(function (i, el) {
                    const cheerio = loadedCheerio(this);
                    const newChapterName = chapterName + cheerio
                        .find("a")
                        .first()
                        .text().trim();
                    if (!cheerio.find("i.fa").length) // no parts
                    {
                        const dateHtml = cheerio.html()?.substring(cheerio.html()?.indexOf("</a>") || 0) || "";
                        const releaseDate = dateHtml?.substring(dateHtml.indexOf("(") + 1, dateHtml.indexOf(")")) || undefined;
                        const chapterUrl = cheerio.find("a").attr("href");
                        if (chapterUrl)
                        {   
                            const chapter: Plugin.ChapterItem = {
                                name: newChapterName,
                                releaseTime: releaseDate,
                                url: chapterUrl,
                                chapterNumber: i,
                            };
                            
                            novelChapters.push(chapter);
                        }
                    }
                    else // has parts that needs to be added individually
                    {
                        const items = cheerio
                            .find("i")
                            .parent()
                            .next()
                            .html()
                            ?.split("</a>") || [];
                        items?.shift();
                        const dates: string[] = [];
                        items?.forEach((item) => {
                            dates.push(item.substring(item.indexOf("(") + 1, item.indexOf(")")));
                        });
                        const hrefs: string[] = [];
                        cheerio
                            .find("i")
                            .parent()
                            .next()
                            .find("a")
                            .each(function () {
                                hrefs.push(this["attribs"]["href"]);
                        });
                        if (dates.length == hrefs.length)
                            dates.forEach((date, index) => {
                                const chapter = {
                                    name: newChapterName + " (" + (index + 1) + ")",
                                    releaseTime: date,
                                    url: hrefs[index],
                                    chapterNumber: i + index / 100,
                                };
                                novelChapters.push(chapter);
                            }
                        );
                    }
                });
        });

        novel.chapters = novelChapters;

        return novel;
    };
    
    async parseChapter(chapterUrl: string): Promise<string> {
        const url = chapterUrl;
        const result = await fetchApi(url, {headers: { 'Accept-Encoding': 'deflate' }});
        const body = await result.text();
    
        let loadedCheerio = load(body);
    
        loadedCheerio(".mistape_caption")
            .remove();
        let chapterText = loadedCheerio(".chapter-content").html()
            || loadedCheerio(".entry-content").html()
            || "Chapitre introuvable";
        return chapterText;
    };
    
    async searchNovels(searchTerm: string, num: number): Promise<Plugin.NovelItem[]> {
        if (num !== 1) return ([]); // only 1 page of results
        let url = this.site + "roman";
        const result = await fetchApi(url, {headers: { 'Accept-Encoding': 'deflate' }});
        const body = await result.text();
    
        let loadedCheerio = load(body);
    
        let novels: Plugin.NovelItem[] = [];
    
        loadedCheerio("article").each(function () {
            const novelName = loadedCheerio(this)
                .find("h2")
                .text().trim();
            const novelCover = loadedCheerio(this)
                .find("img")
                .attr("src");
            const novelUrl = loadedCheerio(this)
                .find("h2 > a")
                .attr("href");
    
            if (!novelUrl) return;
    
            const novel = {
                name: novelName,
                cover: novelCover,
                url: novelUrl,
            };
    
            novels.push(novel);
        });
    
        novels = novels.filter((novel) =>
            novel.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
        );
    
        return novels;
    };
    async fetchImage(url: string): Promise<string | undefined>{
        return await fetchFile(url);
    }
}

export default new NovelDeGlacePlugin();