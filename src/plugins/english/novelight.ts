import { load as parseHTML } from 'cheerio';
import { fetchApi } from '@libs/fetch';
import { Plugin } from '@typings/plugin';
import { defaultCover } from '@libs/defaultCover';
import dayjs from 'dayjs';

class Novelight implements Plugin.PluginBase {
  id = 'novelight';
  name = 'Novelight';
  version = '1.0.9';
  icon = 'src/en/novelight/icon.png';
  site = 'https://novelight.net/';

  async popularNovels(page: number): Promise<Plugin.NovelItem[]> {
    const url = `${this.site}catalog/?ordering=popularity&page=${page}`;

    const body = await fetchApi(url).then(r => r.text());

    const loadedCheerio = parseHTML(body);

    const novels: Plugin.NovelItem[] = [];

    loadedCheerio('a.item').each((idx, ele) => {
      const novelName = loadedCheerio(ele).find('div.title').text().trim();
      const novelUrl = ele.attribs.href;
      const bareNovelCover = loadedCheerio(ele).find('img').attr('src');
      const novelCover = bareNovelCover
        ? this.site + bareNovelCover
        : defaultCover;
      if (!novelUrl) return;

      const novel = {
        name: novelName,
        cover: novelCover ?? defaultCover,
        path: novelUrl,
      };

      novels.push(novel);
    });

    return novels;
  }
  async parseNovel(
    novelPath: string,
  ): Promise<Plugin.SourceNovel & { totalPages: number }> {
    const body = await fetchApi(this.site + novelPath).then(r => r.text());

    const loadedCheerio = parseHTML(body);

    const novel: Plugin.SourceNovel & { totalPages: number } = {
      path: novelPath,
      name: loadedCheerio('h1').text() || 'Untitled',
      cover: this.site + loadedCheerio('.poster > img').attr('src'),
      summary: loadedCheerio('section.text-info.section > p').text(),
      totalPages: loadedCheerio('#select-pagination-chapter > option').length,
      chapters: [],
    };

    const info = loadedCheerio('div.mini-info').children();

    novel.author = loadedCheerio(info[5].children[3]).text().trim();
    novel.status = loadedCheerio(info[0].children[3]).text().trim();
    novel.genres = loadedCheerio(info[6])
      .map((a, ex) => loadedCheerio(ex).text())
      .toArray()
      .join(',');

    return novel;
  }

  async parsePage(novelPath: string, page: string): Promise<Plugin.SourcePage> {
    const rawBody = await fetchApi(this.site + novelPath).then(r => r.text());
    const csrftoken = rawBody?.match(/window\.CSRF_TOKEN = \"([^"]+)\"/)?.[1];
    const bookId = rawBody?.match(/const OBJECT_BY_COMMENT = ([0-9]+)/)?.[1];
    const totalPages = parseInt(
      rawBody
        ?.match(/<option value="([0-9]+)"/g)
        ?.at(-1)
        ?.match(/([0-9]+)/)?.[1] ?? '1',
    );

    const chaptersRaw = await fetchApi(
      `${this.site}/book/ajax/chapter-pagination?book_id=${bookId}&page=${totalPages - parseInt(page) + 1}`,
      {
        headers: {
          'Host': this.site.replace('https://', ''),
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0',
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Referer': this.site + novelPath,
          'X-Requested-With': 'XMLHttpRequest',
          'Sec-GPC': '1',
          'Connection': 'keep-alive',
          'Content-Type': 'application/json',
          'Cookie': `csrftoken=${csrftoken}`,
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          'Priority': 'u=0',
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache',
        },
      },
    )
      .then(r => r.json())
      .then(r => r.html);
    // console.log(parseHTML('<html>' + chaptersRaw + '</html>')('a'));
    console.log(chaptersRaw);

    const chapter: Plugin.ChapterItem[] = [];

    parseHTML('<html>' + chaptersRaw + '</html>')('a').each((idx, ele) => {
      const title = parseHTML(ele)('.title').text().trim();
      // console.log(ele);

      let date;

      try {
        date = dayjs(
          parseHTML(ele)('.date').text().trim(),
          'DD.MM.YYYY',
        ).toISOString();
      } catch (error) {}

      const chapterName = title;
      const chapterUrl = ele.attribs.href;
      chapter.push({
        name: chapterName,
        path: chapterUrl,
        page: page,
        releaseTime: date,
        chapterNumber: parseInt(title.split('-')[0].replace(/[^0-9]/g, '')),
      });
    });

    const chapters = chapter.reverse();
    return { chapters };
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const body = await fetchApi(this.site + chapterPath).then(r => r.text());
    const loadedCheerio = parseHTML(body);
    const chapterText = loadedCheerio('.chapter-content').html() || '';
    console.log(body);

    return chapterText.replace(
      /class="advertisment"/g,
      'style="display:none;"',
    );
  }

  async searchNovels(searchTerm: string): Promise<Plugin.NovelItem[]> {
    const url = `${this.site}catalog/?search=${searchTerm}`;
    const body = await fetchApi(url).then(r => r.text());
    const loadedCheerio = parseHTML(body);

    const novels: Plugin.NovelItem[] = [];

    loadedCheerio('a.item').each((idx, ele) => {
      const novelName = loadedCheerio(ele).find('div.title').text().trim();
      const novelUrl = ele.attribs.href;
      const bareNovelCover = loadedCheerio(ele).find('img').attr('src');
      const novelCover = bareNovelCover
        ? this.site + bareNovelCover
        : defaultCover;
      if (!novelUrl) return;

      const novel = {
        name: novelName,
        cover: novelCover ?? defaultCover,
        path: novelUrl,
      };

      novels.push(novel);
    });

    return novels;
  }
}

export default new Novelight();
