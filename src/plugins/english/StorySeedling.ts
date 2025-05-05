import { CheerioAPI, load } from 'cheerio';
import { Plugin } from '@typings/plugin';
import { fetchApi } from '@libs/fetch';
import { NovelStatus } from '@libs/novelStatus';
import { defaultCover } from '@libs/defaultCover';

class StorySeedlingPlugin implements Plugin.PluginBase {
  id = 'storyseedling';
  name = 'StorySeedling';
  icon = 'src/en/storyseedling/icon.png';
  site = 'https://storyseedling.com/';
  version = '1.0.3';

  async getCheerio(url: string, search: boolean): Promise<CheerioAPI> {
    const r = await fetchApi(url);
    if (!r.ok && search != true)
      throw new Error(
        'Could not reach site (' + r.status + ') try to open in webview.',
      );
    const $ = load(await r.text());

    return $;
  }

  async popularNovels(pageNo: number): Promise<Plugin.NovelItem[]> {
    const novels: Plugin.NovelItem[] = [];
    const body = await fetchApi(this.site + 'browse').then(r => r.text());
    const loadedCheerio = load(body);

    const postValue = loadedCheerio('div[ax-load][x-data]')
      .attr('x-data')
      ?.replace("browse('", '')
      .replace("')", '') as string;

    const data = new FormData();
    data.append('search', '');
    data.append('orderBy', 'recent');
    data.append('curpage', pageNo.toString());
    data.append('post', postValue);
    data.append('action', 'fetch_browse');

    const response: any = await fetchApi(this.site + 'ajax', {
      body: data,
      method: 'POST',
    }).then(res => res.json());

    response.data.posts.forEach((element: any) =>
      novels.push({
        name: element.title,
        cover: element.thumbnail,
        path: element.permalink.replace(this.site, ''),
      }),
    );

    return novels;
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const $ = await this.getCheerio(this.site + novelPath, false);
    const baseUrl = this.site;

    const novel: Partial<Plugin.SourceNovel> = {
      path: novelPath,
    };

    novel.name = $('h1').text().trim();
    const coverUrl = $('img[x-ref="art"].w-full.rounded.shadow-md').attr('src');

    if (coverUrl) {
      novel.cover = new URL(coverUrl, baseUrl).href;
    }

    const genres: string[] = [];
    $(
      'section[x-data="{ tab: location.hash.substr(1) || \'chapters\' }"].relative > div > div > div.flex.flex-wrap > a',
    ).each(function () {
      genres.push($(this).text().trim());
    });
    novel.genres = genres.join(', ');

    novel.author = $('div.mb-1 a').text().trim();

    const rawStatus = $('div.gap-2 span.text-sm').text().trim();
    const map: Record<string, string> = {
      ongoing: NovelStatus.Ongoing,
      hiatus: NovelStatus.OnHiatus,
      dropped: NovelStatus.Cancelled,
      cancelled: NovelStatus.Cancelled,
      completed: NovelStatus.Completed,
    };
    novel.status = map[rawStatus.toLowerCase()] ?? NovelStatus.Unknown;

    const summaryDiv = $('div.mb-4.order-2:not(.lg\\:grid-in-buttons)');
    const pTagSummary = summaryDiv.find('p');
    novel.summary =
      pTagSummary.length > 0
        ? pTagSummary
            .map((_, el) => $(el).text().trim())
            .get()
            .join('\n\n')
        : summaryDiv.text().trim(); // --- Else (no <p> tags) ---

    const chapters: Plugin.ChapterItem[] = [];

    const xdata = $('.bg-accent div[ax-load][x-data]').attr('x-data');
    // expected data format: toc('000000', 'xxxxxxxxxx') (6 numbers, 10 hex)
    if (xdata) {
      const listXdata = xdata?.split("'");
      const dataNovelId = listXdata[1];
      const dataNovelN = listXdata[3];
      const idMatch = novelPath.match(/\d+/); // Error checking in case of extraneous slashes
      const novelId = dataNovelId || (idMatch ? idMatch[0] : null);

      if (novelId) {
        const chapterListing = 'ajax'; // Currently URL is only ajax

        const formData = new FormData();
        formData.append('post', dataNovelN);
        formData.append('id', dataNovelId);
        formData.append('action', 'series_toc');

        const chaptersUrl = `${this.site}${chapterListing}`;
        const refererUrl = `${this.site}${novel.path}`;

        let results = await fetchApi(chaptersUrl, {
          method: 'POST',
          referrer: refererUrl,
          referrerPolicy: 'origin',
          body: formData,
        })
          .then(r => r.json())
          .catch(
            e =>
              (novel.summary =
                'Chapter Parse Error: ' + e + '\n\n' + novel.summary),
          );

        if (results.data) {
          results = results.data;
          results.forEach(function (chap: any) {
            if (chap.url == null) {
              return;
            }
            const name = chap.title;
            const url = chap.url as string;
            const releaseTime = chap.date;
            const chapterNumber = chap.slug;

            chapters.push({
              name: name,
              path: url.replace(baseUrl, ''),
              releaseTime,
              chapterNumber: parseInt(chapterNumber),
            });
          });
        }
      }
    }

    novel.chapters = chapters;

    return novel as Plugin.SourceNovel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const $ = await this.getCheerio(this.site + chapterPath, false);

    const xdata = $('div[ax-load][x-data]').attr('x-data');

    const t = $('div.justify-center > div.mb-4');
    let chapterText = t.html() || '';

    if (xdata) {
      chapterText =
        chapterText +
        "\n\n Error parsing chapter: Turnstile detected. Advise just reading in web view until there's a fix.";
      //   const listXdata = xdata?.split("'");
      //   const dataNovelId = listXdata[1];
      //   const dataNovelN = listXdata[3];
    }

    return chapterText;
  }

  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    const novels: Plugin.NovelItem[] = [];

    const body = await fetchApi(this.site + 'browse').then(r => r.text());
    const loadedCheerio = load(body);

    const postValue = loadedCheerio('div[ax-load][x-data]')
      .attr('x-data')
      ?.replace("browse('", '')
      .replace("')", '') as string;

    const data = new FormData();
    data.append('search', searchTerm);
    data.append('orderBy', 'recent');
    data.append('curpage', pageNo.toString());
    data.append('post', postValue);
    data.append('action', 'fetch_browse');

    const response: any = await fetchApi(this.site + 'ajax', {
      body: data,
      method: 'POST',
    }).then(res => res.json());

    response.data.posts.forEach((element: any) =>
      novels.push({
        name: element.title,
        cover: element.thumbnail,
        path: element.permalink.replace(this.site, ''),
      }),
    );

    return novels;
  }
}

export default new StorySeedlingPlugin();
