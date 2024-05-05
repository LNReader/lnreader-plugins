import { fetchFile, fetchApi } from '@libs/fetch';
import { Plugin } from '@typings/plugin';
import { FilterTypes, Filters } from '@libs/filterInputs';
import { load as loadCheerio } from 'cheerio';
import { defaultCover } from '@libs/defaultCover';
import { NovelStatus } from '@libs/novelStatus';
// import { isUrlAbsolute } from "@libs/isAbsoluteUrl";
// import { parseMadaraDate } from "@libs/parseMadaraDate";

class TemplatePlugin implements Plugin.PluginBase {
  id = 'lncrwaler';
  name = 'Lncrawler';
  icon = 'src/en/lncrawler/logo.png';
  site = 'https://ln.camerongreen.ca';
  version = '0.1.0';
  filters = {
    order: {
      label: 'Order',
      options: [
        { label: 'All time', value: 'rank' },
        { label: 'Rating', value: 'rating' },
        { label: 'Weekly', value: 'weekly_views' },
      ],
      type: FilterTypes.Picker,
      value: '',
    },
  } satisfies Filters;

  async popularNovels(
    pageNo: number,
    {
      showLatestNovels,
      filters,
    }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    const novels: Plugin.NovelItem[] = [];

    let url = '';

    if (showLatestNovels) {
      url =
        this.site +
        `/api/sources?page=${pageNo - 1}&sort=last_updated&number=10`;
    } else {
      url =
        this.site +
        `/api/novels?page=${pageNo - 1}&sort=${filters.order.value}&number=10`;
    }

    const popNovels = await fetchApi(url).then(r => r.json());

    for (let i = 1; i < 10; i++) {
      if (`${i}` in popNovels.content) {
        novels.push({
          name: popNovels.content[`${i}`].title,
          path:
            this.site +
            `/api/novel?novel=${popNovels.content[`${i}`].slug}&source=${popNovels.content[`${i}`].prefered_source}`,
          cover: this.site + '/api/image/' + popNovels.content[`${i}`].cover,
        });
      }
    }

    return novels;
  }
  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: 'Untitled',
    };

    // get data from the site
    const json = await fetchApi(novelPath).then(r => r.json());

    novel.name = json.title;
    novel.artist = '';
    novel.author = json.author;
    novel.cover = this.site + '/api/image/' + json.cover;
    novel.genres = json.tags.toString();
    novel.status = NovelStatus.Ongoing;
    novel.summary = json.summary;

    let chapters: Plugin.ChapterItem[] = [];

    // parse the chapter list

    let url = `/api/chapterlist/?novel=${json.novel.slug}&source=${json.novel.prefered_source}&page=1`;

    const chapterList = await fetchApi(this.site + url).then(r => r.json());

    let numPages = chapterList.total_pages;

    chapterList.content.forEach((chap: { title: string; id: number }) => {
      const chapter: Plugin.ChapterItem = {
        name: chap.title,
        path:
          this.site +
          `/api/chapter/?novel=${json.novel.slug}&source=${json.novel.prefered_source}&chapter=${chap.id}`,
        chapterNumber: chap.id,
      };

      chapters.push(chapter);
    });

    if (numPages > 1) {
      for (let i = 2; i < numPages; i++) {
        let pageUrl = `/api/chapterlist/?novel=${json.novel.slug}&source=${json.novel.prefered_source}&page=${i}`;
        const chapterPage = await fetchApi(this.site + pageUrl).then(r =>
          r.json(),
        );

        chapterPage.content.forEach((chap: { title: string; id: number }) => {
          const chapter: Plugin.ChapterItem = {
            name: chap.title,
            path:
              this.site +
              `/api/chapter/?novel=${json.novel.slug}&source=${json.novel.prefered_source}&chapter=${chap.id}`,
            chapterNumber: chap.id,
          };

          chapters.push(chapter);
        });
      }
    }

    novel.chapters = chapters;
    return novel;
  }
  async parseChapter(chapterPath: string): Promise<string> {
    // parse chapter text here
    const chapter = await fetchApi(chapterPath).then(r => r.json());

    const chapterText = chapter.content.body;

    return chapterText;
  }
  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    let novels: Plugin.NovelItem[] = [];

    const search = await fetchApi(
      this.site + `/api/search?query=${searchTerm}`,
    ).then(r => r.json());

    search.content.forEach(
      (novel: {
        title: string;
        slug: string;
        prefered_source: string;
        cover: string;
      }) => {
        novels.push({
          name: novel.title,
          path:
            this.site +
            `/api/novel?novel=${novel.slug}&source=${novel.prefered_source}`,
          cover: this.site + '/api/image/' + novel.cover,
        });
      },
    );

    // get novels using the search term

    return novels;
  }
  async fetchImage(url: string): Promise<string | undefined> {
    // if your plugin has images and they won't load
    // this is the function to fiddle with
    return fetchFile(url);
  }
}

export default new TemplatePlugin();
