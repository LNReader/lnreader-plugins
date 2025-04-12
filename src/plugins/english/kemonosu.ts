import { Plugin } from '@typings/plugin';
import { fetchApi } from '@libs/fetch';
import { NovelStatus } from '@libs/novelStatus';
import dayjs from 'dayjs';
import { load } from 'cheerio';

class KemonoSu implements Plugin.PluginBase {
  id = 'kemonosu';
  name = 'kemono.su';
  version = '1.0.0';
  site = 'https://kemono.su/api/v1/';
  icon = 'src/en/kemonosu/icon.png';

  async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async searchNovels(
    searchTerm: string,
    page: number,
  ): Promise<Plugin.NovelItem[]> {
    const novels: Plugin.NovelItem[] = [];

    const path_of_ascension_novel = {
      name: 'The Path of Ascension',
      path: 'patreon/user/47400827',
      cover: '/static/src/en/kemonosu/cover.jpg',
    };

    novels.push(path_of_ascension_novel);

    return novels;
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const result = await fetchApi(this.site + novelPath + '/posts-legacy');
    const json_novel_data = await result.json();

    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: 'The Path of Ascension',
      cover: '/static/src/en/kemonosu/cover.jpg',
      summary: `The story follows Matt, a young man planning to delve the rifts responsible for the monsters that destroyed his city and killed his parents. His dreams are crushed when his Tier 1 Talent is rated as detrimental, and no guild or group will take him.
Working at a nearby inn, he meets a mysterious and powerful couple. They give him a chance to join The Path of Ascension, an empire wide race to ascend the Tiers and become living legends.
With their recommendation and a stolen skill, Matt begins his journey to the peak of power.`,
      chapters: [],
    };

    novel.status = NovelStatus.Ongoing;
    novel.author = 'C. Mantis';
    novel.genres = 'progression fantasy, action, adventure, fantasy, romance';

    const chapters: Plugin.ChapterItem[] = [];

    const total_chapter_count = json_novel_data.props.count;

    const page_count = Math.floor(total_chapter_count / 50);

    for (let i = 0; i <= page_count; i++) {
      const page_result = await fetchApi(
        this.site + novelPath + '?o=' + i * 50,
      );
      const json_page_data = await page_result.json();

      json_page_data.forEach((chapter: any) => {
        const chapterName = chapter.title;
        const releaseDate = dayjs(chapter.published).toISOString();
        const chapterPath = novelPath + '/post/' + chapter.id;

        chapters.push({
          name: chapterName,
          releaseTime: Date.parse(releaseDate).toString(),
          path: chapterPath,
        });
      });

      this.sleep(500);
    }

    novel.chapters = chapters.reverse();

    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const chapter_result = await fetchApi(this.site + chapterPath);
    const chapter_json = await chapter_result.json();

    return this.cleanHTMLContent(chapter_json.post.content);
  }

  cleanHTMLContent(html: string): string {
    const $ = load(html);

    // Replace <p> tags with newlines
    $('p').each((_, el) => {
      $(el).replaceWith(`\n${$(el).text().trim()}\n`);
    });

    // Replace <br> tags with newlines
    $('br').each((_, el) => {
      $(el).replaceWith('\n');
    });

    // Extract plain text
    return $.text().trim();
  }
}

export default new KemonoSu();
