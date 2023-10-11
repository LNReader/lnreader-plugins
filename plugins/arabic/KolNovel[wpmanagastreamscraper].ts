import cheerio from "cheerio";
import { fetchApi, fetchFile } from "@libs/fetch";
import { Chapter, Novel, Plugin } from "@typings/plugin";
import { NovelStatus } from "@libs/novelStatus";

export const id = "kolnovel.com";
export const name = "Kol Novel";
export const site = "https://kolnovel.com/";
export const version = "1.0.0";
export const icon = "src/Kol Novel/kol novel.png";
const pluginId = id;

const baseUrl = site;

export const popularNovels: Plugin.popularNovels = async function (
    page,
    { filters, showLatestNovels }
) {
	let url = baseUrl + 'series/?page=' + page + '&status=&order=popular';

	const body = await(await fetchApi(url, {})).text();

	const loadedCheerio = cheerio.load(body);

	let novels: Novel.Item[] = [];

	loadedCheerio('article.maindet').each(function () {
	  const novelName = loadedCheerio(this).find('h2').text();
	  let image = loadedCheerio(this).find('img');
	  const novelCover = image.attr('data-src') || image.attr('src');
	  const novelUrl = loadedCheerio(this).find('h2 a').attr('href');

	  if (!novelUrl) return;

	  const novel = {
		name: novelName,
		cover: novelCover,
		url: novelUrl,
	  };

	  novels.push(novel);
	});

	return novels;
  }

  export const parseNovelAndChapters: Plugin.parseNovelAndChapters = 
  async function (novelUrl) {
	const url = novelUrl;

	const body = await(await fetchApi(url, {})).text();

	let loadedCheerio = cheerio.load(body);

	const novel: Novel.instance = { url };

	novel.url = url;

	novel.name = loadedCheerio('h1.entry-title').text();

	novel.cover =
	  loadedCheerio('img.wp-post-image').attr('data-src') ||
	  loadedCheerio('img.wp-post-image').attr('src');

	novel.status = loadedCheerio('div.sertostat > span').attr('class');

	loadedCheerio('div.serl > span').each(function () {
		const detailName = loadedCheerio(this).text().trim();
		const detail = loadedCheerio(this).next().text().trim();
  
		switch (detailName) {
		  case 'الكاتب':
		  case 'Author':
		  case 'Auteur':
			novel.author = detail;
			break;
		}
	});

	novel.genres = loadedCheerio('.sertogenre')
	  .children('a')
	  .map((i, el) => loadedCheerio(el).text())
	  .toArray()
	  .join(',');

	  let summary = loadedCheerio('.sersys > p').siblings().remove("div").end();
	  novel.summary = ""
	  for (let i = 0; i < summary.length; i++) {
		  const p = summary[i];
		  novel.summary += loadedCheerio(p).text().trim() + "\n\n";
	  }

	let novelChapters: Chapter.Item[] = [];

	loadedCheerio('.eplister')
	  .find('li')
	  .each(function () {
		const chapterName =
		  loadedCheerio(this).find('.epl-num').text() +
		  ' - ' +
		  loadedCheerio(this).find('.epl-title').text();

		const releaseDate = loadedCheerio(this).find('.epl-date').text().trim();

		const chapterUrl = loadedCheerio(this).find('a').attr('href');

        if (!chapterUrl) return;

		const chapter = {
		  name: chapterName,
		  url: chapterUrl,
		  releaseDate,
		};

		novelChapters.push(chapter);
	  });

	novel.chapters = novelChapters;

	if (novel.chapters) novel.chapters.reverse()

	return novel;
}


export const parseChapter: Plugin.parseChapter = async function (chapterUrl) {
    const url = chapterUrl;

    const body = await(await fetchApi(url, {})).text();

    const loadedCheerio = cheerio.load(body);

    let chapterText = loadedCheerio('.epcontent').html();

    // if (sourceId === 53) {
    //   let ignore = loadedCheerio('article > style').text().trim().split(',');
    //   ignore.push(...ignore.pop().match(/^.w+/));
    //   ignore.map(tag => loadedCheerio(p${tag}).remove());
    //   chapterText = loadedCheerio('.epcontent').html();
    // }

	return chapterText;
};

export const searchNovels: Plugin.searchNovels = async function (searchTerm) {
    const url = baseUrl + "?s=" + searchTerm;

    const body = await(await fetchApi(url, {})).text();

    const loadedCheerio = cheerio.load(body);

    let novels: Novel.Item[] = [];

    loadedCheerio('article.maindet').each(function () {
      const novelName = loadedCheerio(this).find('h2').text();
      let image = loadedCheerio(this).find('img');
      const novelCover = image.attr('data-src') || image.attr('src');
      const novelUrl = loadedCheerio(this).find('h2 a').attr('href');

	  if (!novelUrl) return;

      const novel = {
        name: novelName,
		cover: novelCover,
		url: novelUrl,
      };

      novels.push(novel);
    });

    return novels;
};
export const fetchImage: Plugin.fetchImage = fetchFile;
	