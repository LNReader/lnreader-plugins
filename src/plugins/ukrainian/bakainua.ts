import { CheerioAPI, load as parseHTML } from 'cheerio';
import { fetchApi } from '@libs/fetch';
import { Plugin } from '@typings/plugin';

class BakaInUa implements Plugin.PluginBase {
  id = 'bakainua';
  name = 'BakaInUA';
  icon = 'src/uk/bakainua/icon.png';
  site = 'https://baka.in.ua';
  version = '1.0.1';

  async popularNovels(): Promise<Plugin.NovelItem[]> {
    const novels: Plugin.NovelItem[] = [];

    const result = await fetchApi(this.site + '/fictions/alphabetical');
    const body = await result.text();
    const $ = parseHTML(body);

    $('#fiction-list > ol > li > div > div').each((index, elem) => {
      novels.push({
        path: $(elem).find('a').attr('href'),
        name: $(elem).find('a>h2').text(),
        cover: this.site + $(elem).find('a>div>div>div>img').attr('src'),
      });
    });
    return novels;
  }
  async parseNovel(novelUrl: string): Promise<Plugin.SourceNovel> {
    const result = await fetchApi(this.site + '/' + novelUrl);
    const body = await result.text();
    const $ = parseHTML(body);

    const novel: Plugin.SourceNovel = {
      path: novelUrl,
      name: $('h2.text-xl.font-bold.text-stone-800.mb-2').text(),
      author: $('button#fictions-author-search').text(),
      cover:
        this.site +
        $('div.from-stone-50.to-stone-100>div.relative>img').attr('src'),
      summary: $('p.text-sm.leading-relaxed').text(),
      status: $('div.bg-stone-100:nth-child(3)>p:nth-child(2)').text(),
    };

    let chapters: Plugin.ChapterItem[] = [];
    $('li.group')
      .find('a')
      .each((index, elem) => {
        const chapter: Plugin.ChapterItem = {
          name: $(elem).find('div>div>span:nth-child(2)').text().trim(),
          path: $(elem).attr('href'),
          chapterNumber: index + 1,
        };
        chapters.push(chapter);
      });

    novel.chapters = chapters.reverse();
    return novel;
  }

  async parseChapter(chapterUrl: string): Promise<string> {
    const result = await fetchApi(this.site + '/' + chapterUrl);
    const body = await result.text();
    const $ = parseHTML(body);
    return $('section.w-full').html();
  }

  async searchNovels(searchTerm: string): Promise<Plugin.NovelItem[]> {
    let novels: Plugin.NovelItem[] = [];

    const result = await fetchApi(
      this.site + '/search?search%5B%5D=' + searchTerm,
    );
    const body = await result.text();
    const $ = parseHTML(body);
    $('ul>section>div>div').each((index, elem) => {
      novels.push({
        path: $(elem).find('div:nth-child(2)>a').attr('href'),
        name: $(elem).find('div:nth-child(2)>a').text().trim(),
        cover: this.site + $(elem).find('div:nth-child(1)>img').attr('src'),
      });
    });
    return novels;
  }
}

export default new BakaInUa();
