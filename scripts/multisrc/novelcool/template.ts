import { fetchApi } from '@libs/fetch';
import { Plugin } from '@typings/plugin';
import { NovelStatus } from '@libs/novelStatus';
import { Filters } from '@libs/filterInputs';
import dayjs from 'dayjs';

type NovelCoolOptions = {
  lang?: string;
  langCode?: string;
  app: Record<string, string>;
};

export type MTLNovelMetadata = {
  id: string;
  sourceSite: string;
  sourceName: string;
  options: NovelCoolOptions;
  filters?: any;
};

class NovelCoolPlugin implements Plugin.PluginBase {
  id: string;
  name: string;
  icon: string;
  site: string;
  mainUrl: string;
  version: string;
  options: NovelCoolOptions;
  filters?: Filters;

  constructor(metadata: MTLNovelMetadata) {
    this.id = metadata.id;
    this.name = metadata.sourceName;
    this.icon = 'multisrc/novelcool/novelcool/icon.png';
    this.site = metadata.sourceSite;
    this.mainUrl = 'https://api.novelcool.com';
    this.version = '1.0.0';
    this.options = metadata.options ?? ({} as NovelCoolOptions);
    this.filters = metadata.filters satisfies Filters;
  }

  async popularNovels(
    page: number,
    {
      filters,
      showLatestNovels,
    }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    const data: any = await fetchApi(this.mainUrl + '/elite/latest/', {
      headers: {
        'User-Agent': this.options.app.userAgent,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'post',
      body: new URLSearchParams({
        appId: this.options?.app.appId,
        secret: this.options?.app.secret,
        package_name: this.options?.app.package_name,
        lc_type: 'novel',
        lang: this.options.langCode || 'en',
        page: page.toString(),
        page_size: '60',
      }).toString(),
    }).then(res => res.json());
    console.log(data);
    const novels: Plugin.NovelItem[] = [];

    data.list.forEach(novel =>
      novels.push({
        name: novel.name,
        cover: novel.cover,
        path: novel.visit_path + '?id=' + novel.id,
      }),
    );

    return novels;
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const book_id = novelPath.split('?id=')[1];
    const { info }: any = await fetchApi(this.mainUrl + '/book/info/', {
      headers: {
        'User-Agent': this.options.app.userAgent,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'post',
      body: new URLSearchParams({
        book_id,
        appId: this.options?.app.appId,
        secret: this.options?.app.secret,
        package_name: this.options?.app.package_name,
        lang: this.options.langCode || 'en',
      }).toString(),
    }).then(res => res.json());

    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: info.name,
      cover: info.cover,
      genres: info.category_list.join(','),
      summary: info.intro,
      author: info.author,
      artist: info.artist,
      status:
        info.completed === 'NO' ? NovelStatus.Completed : NovelStatus.Ongoing,
      rating: (info.rate_star && parseFloat(info.rate_star)) || undefined,
    };
    const chapters: Plugin.ChapterItem[] = [];

    const { list }: any = await fetchApi(this.mainUrl + '/chapter/book_list/', {
      headers: {
        'User-Agent': this.options.app.userAgent,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'post',
      body: new URLSearchParams({
        book_id,
        appId: this.options?.app.appId,
        secret: this.options?.app.secret,
        package_name: this.options?.app.package_name,
        lang: this.options.langCode || 'en',
      }).toString(),
    }).then(res => res.json());

    list.forEach(chapter => {
      if (!chapter.is_locked) {
        chapters.push({
          name: chapter.title,
          path: chapter.book_id + '/' + chapter.id,
          releaseTime: dayjs(parseInt(chapter.last_modify, 10) * 1000).format(
            'LLL',
          ),
          chapterNumber: parseInt(chapter.order_id, 10),
        });
      }
    });

    novel.chapters = chapters.reverse();
    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const [, chapter_id] = chapterPath.split('/');
    const { info }: any = await fetchApi(this.mainUrl + '/chapter/info/', {
      headers: {
        'User-Agent': this.options.app.userAgent,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'post',
      body: new URLSearchParams({
        chapter_id,
        appId: this.options?.app.appId,
        secret: this.options?.app.secret,
        package_name: this.options?.app.package_name,
        lang: this.options.langCode || 'en',
      }).toString(),
    }).then(res => res.json());

    return info.content;
  }

  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    const data: any = await fetchApi(this.mainUrl + '/book/search/', {
      headers: {
        'User-Agent': this.options.app.userAgent,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'post',
      body: new URLSearchParams({
        appId: this.options?.app.appId,
        secret: this.options?.app.secret,
        package_name: this.options?.app.package_name,
        keyword: searchTerm,
        lc_type: 'novel',
        lang: this.options.langCode || 'en',
        page: pageNo.toString(),
        page_size: '20',
      }).toString(),
    }).then(res => res.json());
    const novels: Plugin.NovelItem[] = [];

    data.list.forEach(novel =>
      novels.push({
        name: novel.name,
        cover: novel.cover,
        path: novel.visit_path + '?id=' + novel.id,
      }),
    );

    return novels;
  }

  resolveUrl = (path: string, isNovel?: boolean) =>
    this.site + (isNovel ? '/novel/' : '/chapter/') + path.split('?id=')[0];
}
