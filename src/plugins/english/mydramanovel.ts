import { CheerioAPI, load as parseHTML } from 'cheerio';
import { fetchApi } from '@libs/fetch';
import { Plugin } from '@typings/plugin';
import { defaultCover } from '@libs/defaultCover';

class MyDramaNovel implements Plugin.PluginBase {
  id = 'mydramanovel';
  name = 'My Drama Novel';
  version = '0.0.1';
  icon = 'src/en/mydramanovel/icon.png';
  site = 'https://mydramanovel.com/';

  parseNovels(loadedCheerio: CheerioAPI) {
    const novels: Plugin.NovelItem[] = [];

    loadedCheerio('.td-ct-item').each((i, el) => {
      const novelName = loadedCheerio(el).find('.td-ct-item-name').text();
      const novelUrl = loadedCheerio(el).attr('href');

      if (!novelUrl) return;

      const novel = {
        name: novelName,
        cover: defaultCover,
        path: novelUrl.replace(this.site, ''),
      };

      novels.push(novel);
    });

    return novels;
  }

  async popularNovels(pageNo: number): Promise<Plugin.NovelItem[]> {
    const url = `${this.site}novels`;

    const body = await fetchApi(url).then(r => r.text());

    const loadedCheerio = parseHTML(body);
    return this.parseNovels(loadedCheerio);
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const body = await fetchApi(this.site + novelPath).then(r => r.text());

    const loadedCheerio = parseHTML(body);

    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: loadedCheerio('.tdb-title-text').text().trim() || 'Untitled',
      cover: defaultCover,
      summary: '',
      chapters: [],
    };

    novel.author = '';

    const chapter: Plugin.ChapterItem[] = [];

    loadedCheerio('.td-mc1-wrap').remove();

    loadedCheerio('.td_block_inner')
      .find('a')
      .filter('.td-image-wrap')
      .each((i, el) => {
        const chapterName = loadedCheerio(el).attr('title')?.trim() || '';
        const chapterUrl = loadedCheerio(el).attr('href');

        if (!chapterUrl) return;

        chapter.push({
          name: chapterName,
          path: chapterUrl.replace(this.site, ''),
        });
      });

    loadedCheerio('.tdb_module_loop_2').each((i, el) => {
      const chapterName =
        loadedCheerio(el).find('a').attr('title')?.trim() || '';
      const chapterUrl = loadedCheerio(el).find('a').attr('href');

      if (!chapterUrl) return;

      chapter.push({
        name: chapterName,
        path: chapterUrl.replace(this.site, ''),
      });
    });

    novel.chapters = chapter;

    return novel;
  }
  async parseChapter(chapterPath: string): Promise<string> {
    const body = await fetchApi(this.site + chapterPath).then(r => r.text());

    const loadedCheerio = parseHTML(body);

    loadedCheerio('.tdb_single_content .tdb-block-inner div').remove();

    const chapterText =
      loadedCheerio('.tdb_single_content .tdb-block-inner').html() || '';

    return chapterText;
  }
}
export default new MyDramaNovel();
