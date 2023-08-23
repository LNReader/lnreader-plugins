import { Chapter, Novel, Plugin } from "@typings/plugin";
import { FilterInputs } from "@libs/filterInputs";
import { defaultCover } from "@libs/defaultCover";
import { fetchApi, fetchFile } from "@libs/fetch";
import { NovelStatus } from "@libs/novelStatus";
import { load as parseHTML } from "cheerio";
import dayjs from "dayjs";

export const id = "RNRF";
export const name = "РанобэРФ";
export const site = "https://ранобэ.рф";
export const version = "1.0.0";
export const icon = "src/ru/ranoberf/icon.png";

export const popularNovels: Plugin.popularNovels = async function (
  page,
  { showLatestNovels, filters }
) {
  let url = site + "/books?order=";
  url += showLatestNovels ? "lastPublishedChapter" : filters?.sort || "popular";
  url += "&page=" + page;

  const result = await fetchApi(url);
  const body = await result.text();

  const loadedCheerio = parseHTML(body);
  let json: any = loadedCheerio("#__NEXT_DATA__").html();
  json = JSON.parse(json);

  let novels: Novel.Item[] = [];
  json.props.pageProps.totalData.items.forEach((novel: any) =>
    novels.push({
      name: novel.title,
      cover: novel?.verticalImage?.url
        ? site + novel.verticalImage.url
        : defaultCover,
      url: site + "/" + novel.slug,
    })
  );

  return novels;
};

export const parseNovelAndChapters: Plugin.parseNovelAndChapters =
  async function (novelUrl) {
    const result = await fetchApi(novelUrl);
    const body = await result.text();

    const loadedCheerio = parseHTML(body);
    const json: any = loadedCheerio("#__NEXT_DATA__").html();
    const book = JSON.parse(json).props.pageProps.book;

    let novel: Novel.instance = {
      url: novelUrl,
      name: book.title,
      cover: book?.verticalImage?.url
        ? site + book.verticalImage.url
        : defaultCover,
      summary: book.description,
      author: book?.author || "",
      genres: book.genres.map((item: any) => item.title).join(", "),
      status: book.additionalInfo.includes("Активен")
        ? NovelStatus.Ongoing
        : NovelStatus.Completed,
    };

    let chapters: Chapter.Item[] = [];

    book.chapters.forEach((chapter: any) => {
      if (!chapter.isDonate || chapter.isUserPaid) {
        chapters.push({
          name: chapter.title,
          releaseTime: dayjs(chapter.publishedAt).format("LLL"),
          url: site + chapter.url,
        });
      }
    });

    novel.chapters = chapters.reverse();
    return novel;
  };

export const parseChapter: Plugin.parseChapter = async function (chapterUrl) {
  const result = await fetchApi(chapterUrl);
  const body = await result.text();

  let loadedCheerio = parseHTML(body);
  let json: any = loadedCheerio("#__NEXT_DATA__").html();
  json = JSON.parse(json);

  loadedCheerio = parseHTML(json.props.pageProps.chapter.content.text);
  loadedCheerio("img").each(function () {
    if (!loadedCheerio(this).attr("src")?.startsWith("http")) {
      const src = loadedCheerio(this).attr("src");
      loadedCheerio(this).attr("src", site + src);
    }
  });

  const chapterText = loadedCheerio.html();

  return chapterText;
};

export const searchNovels: Plugin.searchNovels = async function (searchTerm) {
  const url = `${site}/v3/books?filter[or][0][title][like]=${searchTerm}&filter[or][1][titleEn][like]=${searchTerm}&filter[or][2][fullTitle][like]=${searchTerm}&filter[status][]=active&filter[status][]=abandoned&filter[status][]=completed&expand=verticalImage`;
  const result = await fetchApi(url);
  const body: any = await result.json();
  let novels: Novel.Item[] = [];

  body.items.forEach((novel: any) =>
    novels.push({
      name: novel.title,
      cover: novel?.verticalImage?.url
        ? site + novel.verticalImage.url
        : defaultCover,
      url: site + "/" + novel.slug,
    })
  );

  return novels;
};

export const fetchImage: Plugin.fetchImage = fetchFile;

export const filters = [
  {
    key: "sort",
    label: "Сортировка",
    values: [
      { label: "Рейтинг", value: "popular" },
      { label: "Дате добавления", value: "new" },
      { label: "Дате обновления", value: "lastPublishedChapter" },
      { label: "Законченные", value: "completed" },
    ],
    inputType: FilterInputs.Picker,
  },
];
