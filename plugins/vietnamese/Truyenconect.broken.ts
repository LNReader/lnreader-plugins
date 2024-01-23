
import { CheerioAPI, load as parseHTML } from "cheerio";
import { fetchApi, fetchFile } from "@libs/fetch";
import { Plugin } from "@typings/plugin";
import { FilterTypes, Filters } from "@libs/filterInputs";

class TruyenConect implements Plugin.PluginBase {
    id = "truyenconect";
    name = "Truyen Conect";
    icon = "src/vi/truyenconect/icon.png";
    site = "https://truyenconect.com";
    version = "1.0.0";
    parseNovels(loadedCheerio: CheerioAPI, selector: string){
        const novels: Plugin.NovelItem[] = [];
        loadedCheerio(selector).each(function () {
            const url = loadedCheerio(this).find('a').attr('href');
            if(url){
                novels.push({
                    name: loadedCheerio(this).find('img').attr('alt') || '',
                    url,
                    cover: loadedCheerio(this).find('img').attr('data-src'),
                })
            }
        });
        return novels;
    }
    async popularNovels(pageNo: number, {filters, showLatestNovels}: Plugin.PopularNovelsOptions<typeof this.filters>): Promise<Plugin.NovelItem[]> {
        let link = this.site;
        let selector = '.c-page__content > .grid9.block .item-thumb.c-image-hover';
        
        if(showLatestNovels){
            selector = '.c-page__content .page-content-listing.item-big_thumbnail .item-thumb.c-image-hover';
        }

        if(filters.category.value){
            link += '/' + filters.category.value;
            selector = 'table.manga-shortcodes.manga-chapters-listing td[width="10%"]';
            if(filters.category.value === 'the-loai'){
                selector = '.item-thumb.hover-details.c-image-hover'
                link += '/' + filters.genre.value;
            }
            link += '?page=' + pageNo;
        }

        const body = await fetch(link).then(r => r.text());
        const loadedCheerio = parseHTML(body);
        return this.parseNovels(loadedCheerio, selector);
    }
    async parseNovelAndChapters(novelUrl: string): Promise<Plugin.SourceNovel> {
        const url = novelUrl;
        const result = await fetchApi(url);
        const body = await result.text();

        let loadedCheerio = parseHTML(body);

        const novel: Plugin.SourceNovel = {
            url,
            chapters: [],
        };

        novel.name = loadedCheerio(".post-title > h1").text().trim();

        novel.cover = loadedCheerio(".summary_image > a > img").attr(
            "data-src"
        );

        loadedCheerio(".post-content_item").each(function () {
            const detailName = loadedCheerio(this)
                .find(".summary-heading > h5")
                .text()
                .trim();
            const detail = loadedCheerio(this).find(".summary-content").html();

            if (!detail) return;

            switch (detailName) {
                case "Genre":
                    novel.genres = loadedCheerio(detail)
                        .children("a")
                        .map((i, el) => loadedCheerio(el).text())
                        .toArray()
                        .join(",");
                    break;
                case "Author":
                    novel.author = loadedCheerio(detail)
                        .children("a")
                        .map((i, el) => loadedCheerio(el).text())
                        .toArray()
                        .join(", ");
                    break;
                case "Novel":
                    novel.status = detail?.trim().replace(/G/g, "g");
                    break;
            }
        });

        loadedCheerio(
            ".description-summary > div.summary__content > div"
        ).remove();

        novel.summary = loadedCheerio(
            ".description-summary > div.summary__content"
        )
            .text()
            .trim();

        let chapter: Plugin.ChapterItem[] = [];
        loadedCheerio(".wp-manga-chapter").each(function () {
            const chapterName = loadedCheerio(this)
                .find("a")
                .text()
                .replace(/[\t\n]/g, "")
                .trim();
            const releaseDate = loadedCheerio(this).find("span").text().trim();
            const chapterUrl = loadedCheerio(this).find("a").attr("href");

            if (!chapterUrl) return;

            chapter.push({
                name: chapterName,
                releaseTime: releaseDate,
                url: chapterUrl,
            });
        });

        novel.chapters = chapter.reverse();

        return novel;
    }
    async parseChapter(chapterUrl: string): Promise<string> {
        const result = await fetchApi(chapterUrl);
            const body = await result.text();

            const loadedCheerio = parseHTML(body);

            loadedCheerio("img").removeAttr("srcset");
            let chapterText = loadedCheerio(".reading-content").html() || '';

            return chapterText;
    }
    async searchNovels(searchTerm: string, pageNo: number): Promise<Plugin.NovelItem[]> {
        const url = `${this.site}?s=${searchTerm}&post_type=wp-manga`;
        const result = await fetchApi(url);
        const body = await result.text();

        const loadedCheerio = parseHTML(body);

        const novels: Plugin.NovelItem[] = [];

        loadedCheerio(".c-tabs-item__content").each(function () {
            const novelName = loadedCheerio(this).find(".h4 > a").text();
            const novelCover = loadedCheerio(this).find("img").attr("data-src");
            const novelUrl = loadedCheerio(this).find(".h4 > a").attr("href");

            if (!novelUrl) return;

            novels.push({
                name: novelName,
                url: novelUrl,
                cover: novelCover,
            });
        });

        return novels;
    }
    async fetchImage(url: string): Promise<string | undefined> {
        return fetchFile(url);
    }
    filters = {
        category: {
            label: "Lọc theo",
            value: '',
            type: FilterTypes.Picker,
            options: [
                {label: '', value: ''},
                {label: 'Thể loại', value: 'the-loai'},
                {label: 'Truyện dịch', value: 'truyen-dich'},
                {label: 'Truyện convert', value: 'convert'}
            ]
        },
        genre: {
            label: 'Thể loại',
            value: 'action',
            type: FilterTypes.Picker,
            options: [
                {label: 'Action', value: 'action'},
                {label: 'Adult', value: 'adult'},
                {label: 'Adventure', value: 'adventure'},
                {label: 'Chinese novel', value: 'chinese-novel'},
                {label: 'Chuyển Sinh', value: 'chuyen-sinh'},
                {label: 'English Novel', value: 'english-novel'},
                {label: 'Harem', value: 'harem'},
                {label: 'Ecchi', value: 'ecchi'},
                {label: 'Fantasy', value: 'fantasy'},
                {label: 'Drama', value: 'drama'},
                {label: 'Game', value: 'game'},
                {label: 'Tiên hiệp', value: 'tien-hiep'},
                {label: 'Kiếm Hiệp', value: 'kiem-hiep'},
                {label: 'Ngôn Tình', value: 'ngon-tinh'},
                {label: 'Isekai', value: 'isekai'},
                {label: 'Lịch Sử', value: 'lich-su'},
                {label: 'Web Novel', value: 'web-novel'},
                {label: 'Xuyên không', value: 'xuyen-khong'},
                {label: 'Trọng sinh', value: 'trong-sinh'},
                {label: 'Trinh thám', value: 'trinh-tham'},
                {label: 'Dị giới', value: 'di-gioi'},
                {label: 'Huyền ảo', value: 'huyen-ao'},
                {label: 'Sắc Hiệp', value: 'sac-hiep'},
                {label: 'Dị năng', value: 'di-nang'},
                {label: 'Linh dị', value: 'linh-di'},
                {label: 'Đô thị', value: 'do-thi'},
                {label: 'Comedy', value: 'comedy'},
                {label: 'School Life', value: 'school-life'},
                {label: 'Romance', value: 'romance'},
                {label: 'Martial-arts', value: 'martial-arts'},
                {label: 'Light Novel', value: 'light-novel'},
                {label: 'Huyền huyễn', value: 'huyen-huyen'},
                {label: 'Kỳ Huyễn', value: 'ky-huyen'},
                {label: 'Khoa Huyễn', value: 'khoa-huyen'},
                {label: 'Võng Du', value: 'vong-du'},
                {label: 'Đồng Nhân', value: 'dong-nhan'},

            ]
        }
    } satisfies Filters;
}

export default new TruyenConect();
