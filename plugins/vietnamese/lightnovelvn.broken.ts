import { load as parseHTML } from "cheerio";
import { fetchApi, fetchFile } from "@libs/fetch";
import { Plugin } from "@typings/plugin";
import { Filters } from "@libs/filterInputs";
import { NovelStatus } from "@libs/novelStatus";


class LightNovelVN implements Plugin.PluginBase {
    id = "lightnovel.vn";
    name = "Light Novel VN";
    version = "1.0.0";
    icon = "src/vi/lightnovelvn/icon.png";
    filters?: Filters | undefined;
    site = "https://lightnovel.vn/";
    baseUrl = this.site;
    headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
    };
    async popularNovels(pageNo: number, options: Plugin.PopularNovelsOptions<Filters>): Promise<Plugin.NovelItem[]> {
        const url = `${this.baseUrl}truyen-hot-ds?page=${pageNo}`;        
        const body = await fetch(url).then((r) => r.text());
    
        const loadedCheerio = parseHTML(body);
    
        const novels: Plugin.NovelItem[] = [];
        
        loadedCheerio(".flex.flex-col[itemtype='https://schema.org/Book']").each((idx, ele) => {
            const novelName = loadedCheerio(ele).find('h3[itemprop="name"] > a').text().trim();
            const img = loadedCheerio(ele).find('noscript').html();
            const novelCover = img?.match(/srcSet="([^\s]+)/)?.[1];
            const novelUrl = this.site + loadedCheerio(ele).find('h3[itemprop="name"] > a').attr('href')?.substring(1);
    
            const novel = {
                name: novelName,
                cover: novelCover,
                url: novelUrl,
            };
    
            novels.push(novel);
        });
    
        return novels;
    }
    async parseNovelAndChapters(novelUrl: string): Promise<Plugin.SourceNovel> {
        const url = novelUrl;
        const body = await fetch(url).then((r) => r.text());

        let loadedCheerio = parseHTML(body);

        const novel: Plugin.SourceNovel = {
            url,
            chapters: [],
        };

        novel.name = loadedCheerio('h1[itemprop="name"]').text().trim();

        novel.cover = loadedCheerio('header div:nth-child(2) img').attr('srcset')?.split(/\s+/)[0]

        const genres: string[] = [];
        loadedCheerio('a[itemprop="genre"]').each(function() {
            genres.push(loadedCheerio(this).text());
        })
        novel.genres = genres.join(',');
        
        novel.status = loadedCheerio('span.font-bold.text-size22:last').text();
        if(novel.status === 'Đang ra'){
            novel.status = NovelStatus.Ongoing;
        }else if(novel.status === 'Hoàn thành'){
            novel.status = NovelStatus.Completed;
        }else {
            novel.status = NovelStatus.Unknown;
        }
        novel.author = loadedCheerio('a[itemprop="author"] > span').text();

        novel.summary = loadedCheerio('#bookIntro').text().replace(/\s+/g, ' ');
        const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
        await delay(1000);
        const chapterListUrl = novelUrl + '/chapters?chorder=desc';

        const chapterListBody = await fetchApi(chapterListUrl).then(r => r.text());
        const loadedChapterList = parseHTML(chapterListBody);
        

        const lastNumber = parseInt(
            loadedChapterList('ul.chapter-list > li:nth-child(1)').attr('data-chapterno') ?? '0'
        );
        const lastChapterUrl = loadedChapterList('ul.chapter-list > li:nth-child(1) > a').attr('href');
        
        if(lastChapterUrl){
            const chapterUrlPrefix = this.baseUrl + lastChapterUrl.split('/').slice(1, -1).join('/');
            const chapters: Plugin.ChapterItem[] = [];
            for(let i = 1; i <= lastNumber; i++){
                chapters.push({
                    chapterNumber: i,
                    name: 'Chapter ' + i,
                    url: chapterUrlPrefix + '/chapter-' + i,
                })
            }
            novel.chapters = chapters;
        }
        return novel;
    }
    async parseChapter(chapterUrl: string): Promise<string> {
        const body = await fetchApi(chapterUrl).then((r) => r.text());

        const loadedCheerio = parseHTML(body);

        let chapterText = loadedCheerio("#chapter-container").html() || '';

        return chapterText;
    }
    async searchNovels(searchTerm: string, pageNo: number): Promise<Plugin.NovelItem[]> {
        const url = `${this.baseUrl}lnsearchlive`;
        const link = `${this.baseUrl}search`;
        const response = await fetchApi(link).then((r) => r.text());
        const token = parseHTML(response);
        let verifytoken = token("#novelSearchForm > input").attr("value");
    
        let formData = new FormData();
        formData.append("inputContent", searchTerm);
    
        const body = await fetchApi(
            url,
            {
                method: "POST",
                headers: { LNRequestVerifyToken: verifytoken! },
                body: formData,
            },
        ).then((r) => r.text());
    
        let loadedCheerio = parseHTML(body);
    
        let novels: Plugin.NovelItem[] = [];
    
        let results = JSON.parse(loadedCheerio("body").text());
    
        loadedCheerio = parseHTML(results.resultview);
    
        loadedCheerio(".novel-item").each((idx, ele) => {
            const novelName = loadedCheerio(ele)
                .find("h4.novel-title")
                .text()
                .trim();
            const novelCover = loadedCheerio(ele).find("img").attr("src");
            const novelUrl =
                this.baseUrl + loadedCheerio(ele).find("a").attr("href")?.substring(1);
    
            novels.push({
                name: novelName,
                url: novelUrl,
                cover: novelCover,
            });
        });
    
        return novels;
    }
    async fetchImage(url: string): Promise<string | undefined> {
        return fetchFile(url, {headers: this.headers});
    }

}

export default new LightNovelVN();