import { load as parseHTML } from "cheerio";
import { fetchApi, fetchFile } from "@libs/fetch";
import { Plugin } from "@typings/plugin";
import { Filters, FilterTypes } from "@libs/filterInputs";
import dayjs from "dayjs";
import { defaultCover } from "@libs/defaultCover";
import { NovelStatus } from "@libs/novelStatus";

class ChireadsPlugin implements Plugin.PluginBase {
    id: string;
    name: string;
    icon: string;
    site: string;
    version: string;
    filters: Filters;

    constructor() {
        this.id = "chireads.com";
        this.name = "Chireads";
        this.icon = "src/fr/chireads/icon.png";
        this.site = "https://chireads.com";
        this.version = "1.0.1";
        this.filters = {
            tag: {
                type: FilterTypes.Picker,
                label: "Tag",
                value: "all",
                options: [
                    { label: "Tous", value: "all" },
                    { label: "Arts martiaux", value: "arts-martiaux" },
                    { label: "De faible à fort", value: "de-faible-a-fort" },
                    { label: "Adapté en manhua", value: "adapte-en-manhua" },
                    { label: "Cultivation", value: "cultivation" },
                    { label: "Action", value: "action" },
                    { label: "Aventure", value: "aventure" },
                    { label: "Monstres", value: "monstres" },
                    { label: "Xuanhuan", value: "xuanhuan" },
                    { label: "Fantastique", value: "fantastique" },
                    { label: "Adapté en Animé", value: "adapte-en-anime" },
                    { label: "Alchimie", value: "alchimie" },
                    { label: "Éléments de jeux", value: "elements-de-jeux" },
                    { label: "Calme Protagoniste", value: "calme-protagoniste" },
                    { label: "Protagoniste intelligent", value: "protagoniste-intelligent" },
                    { label: "Polygamie", value: "polygamie" },
                    { label: "Belle femelle Lea", value: "belle-femelle-lea" },
                    { label: "Personnages arrogants", value: "personnages-arrogants" },
                    { label: "Système de niveau", value: "systeme-de-niveau" },
                    { label: "Cheat", value: "cheat" },
                    { label: "Protagoniste génie", value: "protagoniste-genie" },
                    { label: "Comédie", value: "comedie" },
                    { label: "Gamer", value: "gamer" },
                    { label: "Mariage", value: "mariage" },
                    { label: "seeking Protag", value: "seeking-protag" },
                    { label: "Romance précoce", value: "romance-precoce" },
                    { label: "Croissance accélérée", value: "croissance-acceleree" },
                    { label: "Artefacts", value: "artefacts" },
                    { label: "Intelligence artificielle", value: "intelligence-artificielle" },
                    { label: "Mariage arrangé", value: "mariage-arrange" },
                    { label: "Mature", value: "mature" },
                    { label: "Adulte", value: "adulte" },
                    { label: "Administrateur de système", value: "administrateur-de-systeme" },
                    { label: "Beau protagoniste", value: "beau-protagoniste" },
                    { label: "Protagoniste charismatique", value: "protagoniste-charismatique" },
                    { label: "Protagoniste masculin", value: "protagoniste-masculin" },
                    { label: "Démons", value: "demons" },
                    { label: "Reincarnation", value: "reincarnation" },
                    { label: "Académie", value: "academie" },
                    { label: "Cacher les vraies capacités", value: "cacher-les-vraies-capacites" },
                    { label: "Protagoniste surpuissant", value: "protagoniste-surpuissant" },
                    { label: "Joueur", value: "joueur" },
                    { label: "Protagoniste fort dès le départ", value: "protagoniste-fort-des-le-depart" },
                    { label: "Immortels", value: "immortels" },
                    { label: "Cultivation rapide", value: "cultivation-rapide" },
                    { label: "Harem", value: "harem" },
                    { label: "Assasins", value: "assasins" },
                    { label: "De pauvre à riche", value: "de-pauvre-a-riche" },
                    { label: "Système de classement de jeux", value: "systeme-de-classement-de-jeux" },
                    { label: "Capacités spéciales", value: "capacites-speciales" },
                    { label: "Vengeance", value: "vengeance" },
                ],
            }
        } satisfies Filters;
    }
    async popularNovels(page: number, { filters, showLatestNovels }: Plugin.PopularNovelsOptions): Promise<Plugin.NovelItem[]> {
        let url = this.site;
        let tag: string = "all";
        if (showLatestNovels)
            url += "/category/translatedtales/page/" + page;
        else {
            if (filters && typeof filters.tag.value === "string" && filters.tag.value !== "all") 
                tag = filters.tag.value;
            if (tag !== "all")
                url += "/tag/" + tag + "/page/" + page;
            else if (page > 1)
                return [];
        }
        const result = await fetchApi(url);
        const body = await result.text();
        let loadedCheerio = parseHTML(body);

        let novels: Plugin.NovelItem[] = [];

        if (showLatestNovels || tag !== "all") {
            let loop = 1;
            if (showLatestNovels)
                loop = 2;
            for (let i = 0; i < loop; i++) {
                if (i === 1)
                    loadedCheerio = parseHTML(await (await fetchApi(this.site + "/category/original/page/" + page)).text());
                let romans = loadedCheerio(".romans-content li");
                if (!romans.length)
                    romans = loadedCheerio("#content li");
                romans.each(function () {
                    const novelName = loadedCheerio(this).contents().find("div").first().text().trim();
                    const novelCover = loadedCheerio(this).find("div").first().find("img").attr("src");
                    const novelUrl = loadedCheerio(this).find("div").first().find("a").attr("href")
    
                    if (novelUrl){
                        const novel = { name: novelName, cover: novelCover, url: novelUrl };
                        novels.push(novel);
                    }    
                });
            }
        }
        else {
            const populaire = loadedCheerio(":contains(\"Populaire\")").last().parent().next().find("li > div")
            if (populaire.length === 12) // pc
            {
                let novelCover : string | undefined;
                let novelName : string | undefined;
                let novelUrl : string | undefined;
                populaire.each(function (i, elem) {
                    if (i % 2 === 0)
                        novelCover = loadedCheerio(this).find("img").attr("src");
                    else {
                        novelName = loadedCheerio(this).text().trim();
                        novelUrl = loadedCheerio(this).find("a").attr("href");
                        
                        if (!novelUrl) return;
                        
                        const novel = { name: novelName, cover: novelCover || defaultCover, url: novelUrl };
                        
                        novels.push(novel);
                    }
                });
            }
            else // mobile
            {
                const imgs = populaire.find("div.popular-list-img img");
                const txts = populaire.find("div.popular-list-name");

                txts.each(function (i, elem) {
                    const novelName = loadedCheerio(elem).text().trim();
                    const novelCover = loadedCheerio(imgs[i]).attr("src");
                    const novelUrl = loadedCheerio(elem).find("a").attr("href");
                
                    if (novelUrl){
                        const novel = { name: novelName, cover: novelCover, url: novelUrl };
                        novels.push(novel);
                    }
                });
            }
        }

        return novels;
    };

    async parseNovelAndChapters(novelUrl: string): Promise<Plugin.SourceNovel> {
        const url = novelUrl;
        const novel: Plugin.SourceNovel = { url };
        const result = await fetchApi(url);
        const body = await result.text();

        let loadedCheerio = parseHTML(body);

        novel.name = loadedCheerio(".inform-product-txt").first().text().trim() || loadedCheerio(".inform-title").text().trim();
        novel.cover = loadedCheerio(".inform-product img").attr("src") || loadedCheerio(".inform-product-img img").attr("src") || defaultCover;
        console.log(novel.cover);
        novel.summary = loadedCheerio(".inform-inform-txt").text().trim() || loadedCheerio(".inform-intr-txt").text().trim();

        let infos = loadedCheerio("div.inform-product-txt > div.inform-intr-col").text().trim() || loadedCheerio("div.inform-inform-data > h6").text().trim();
        if (infos.includes("Auteur : "))
            novel.author = infos.substring(infos.indexOf("Auteur : ") + 9, infos.indexOf("Statut de Parution : ")).trim();
        else if (infos.includes("Fantrad : "))
            novel.author = infos.substring(infos.indexOf("Fantrad : ") + 10, infos.indexOf("Statut de Parution : ")).trim();
        else
            novel.author = "Inconnu";
        switch (infos.substring(infos.indexOf("Statut de Parution : ") + 21).toLowerCase()) {
            case "en pause":
                novel.status = NovelStatus.OnHiatus;
                break;
            case "complet":
                novel.status = NovelStatus.Completed;
                break;
            default:
                novel.status = NovelStatus.Ongoing;
                break;
        }

        let chapters: Plugin.ChapterItem[] = [];

        let chapterList = loadedCheerio(".chapitre-table a");
        if (!chapterList.length)
        {
            loadedCheerio("div.inform-annexe-list").first().remove();
            chapterList = loadedCheerio(".inform-annexe-list").find("a");
        }
        chapterList.each(function () {
            const chapterName = loadedCheerio(this).text().trim();
            const chapterUrl = loadedCheerio(this).attr("href");
            const releaseDate = dayjs(chapterUrl?.substring(chapterUrl.length - 11, chapterUrl.length - 1)).format("DD MMMM YYYY");

            if (chapterUrl){
                chapters.push({
                    name: chapterName,
                    releaseTime: releaseDate,
                    url: chapterUrl,
                });
            }
        });

        novel.chapters = chapters;

        return novel;
    };

    async parseChapter(chapterUrl: string): Promise<string> {
        const result = await fetchApi(chapterUrl);
        const body = await result.text();

        let loadedCheerio = parseHTML(body);

        const chapterText = loadedCheerio("#content").html() || "";

        return chapterText;
    };

    async searchNovels(searchTerm: string, num: number): Promise<Plugin.NovelItem[]> {
        if (num !== 1)
            return [];
        const url = `${this.site}/search?x=0&y=0&name=${searchTerm}`;
        const result = await fetchApi(url);
        const body = await result.text();
        let loadedCheerio = parseHTML(body);

        let novels: Plugin.NovelItem[] = [];

        let romans = loadedCheerio(".romans-content li");
        if (!romans.length)
            romans = loadedCheerio("#content li");
        romans.each(function () {
            const novelName = loadedCheerio(this).contents().find("div").first().text().trim();
            const novelCover = loadedCheerio(this).find("div").first().find("img").attr("src");
            const novelUrl = loadedCheerio(this).find("div").first().find("a").attr("href")

            if (novelUrl){
                const novel = { name: novelName, cover: novelCover, url: novelUrl };
                novels.push(novel);
            }
        });
        return novels;
    };
    async fetchImage(url: string): Promise<string | undefined>{
        return await fetchFile(url);
    }
};

export default new ChireadsPlugin();