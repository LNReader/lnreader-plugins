import { Plugin } from '@typings/plugin';
import { fetchApi } from '@libs/fetch';
import { load as parseHTML } from 'cheerio';
import { defaultCover } from '@libs/defaultCover';

class StorySeedlingPlugin implements Plugin.PluginBase {
  id = 'storyseedling';
  name = 'StorySeedling';
  icon = 'src/en/storyseedling/icon.png';
  site = 'https://storyseedling.com/';
  version = '1.0.2';

  async popularNovels(pageNo: number): Promise<Plugin.NovelItem[]> {
    let novels: Plugin.NovelItem[] = [];
    const body = await fetchApi(postUrl + 'browse').then(r => r.text());
    const loadedCheerio = parseHTML(body);

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

    const response: any = await fetchApi(url + 'ajax', {
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
    var site = this.site;
    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: '',
    };

    const body = await fetchApi(this.site + novelPath).then(r => r.text());
    const loadedCheerio = parseHTML(body);

    novel.name = loadedCheerio('h1').text().trim();

    //novel.artist = "";
    //novel.author = "";
    novel.cover = loadedCheerio(
      'img[x-ref="art"].w-full.rounded.shadow-md',
    ).attr('src');
    if (!novel.cover) {
      novel.cover = defaultCover;
    }

    let genres: string[] = [];
    loadedCheerio(
      'section[x-data="{ tab: location.hash.substr(1) || \'chapters\' }"].relative > div > div > div.flex.flex-wrap > a',
    ).each(function () {
      genres.push(loadedCheerio(this).text().trim());
    });
    novel.genres = genres.join(', ');
    // novel.status = NovelStatus.Completed;
    novel.summary = loadedCheerio('div.mb-4.order-2:not(.lg\\:grid-in-buttons)')
      .text()
      .trim()
      .replace(/(\r\n|\n|\r)/gm, '');

    let chapters: Plugin.ChapterItem[] = [];

    loadedCheerio(
      'div.grid.w-full.grid-cols-1.gap-4.md\\:grid-cols-2 > a',
    ).each(function () {
      if (loadedCheerio(this).find('> div').length == 2) {
        return;
      }
      const name = loadedCheerio(this).find('.truncate').text().trim();
      const url = loadedCheerio(this).attr('href') as string;
      const releaseTime = loadedCheerio(this)
        .find('div > div > small')
        .text()
        .trim();
      const chapterNumber = name.split('-')[0].trim().split(' ')[1];

      chapters.push({
        name: name,
        path: url.replace(site, ''),
        releaseTime,
        chapterNumber: parseInt(chapterNumber),
      });
    });
    novel.chapters = chapters;
    return novel;
  }
  async parseChapter(chapterPath: string): Promise<string> {
    const body = await fetchApi(this.site + chapterPath).then(r => r.text());

    const loadedCheerio = parseHTML(body);
    const t = loadedCheerio('div.justify-center > div.mb-4');
    const chapterText = t.html() || '';

    return chapterText;
  }

  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    let novels: Plugin.NovelItem[] = [];

    const body = await fetchApi(this.site + 'browse').then(r => r.text());
    const loadedCheerio = parseHTML(body);

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
