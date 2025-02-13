import { fetchApi, fetchProto, fetchText } from '@libs/fetch';
import { Plugin } from '@typings/plugin';
import { Filters } from '@libs/filterInputs';
import { load as loadCheerio } from 'cheerio';

class FenrirRealmPlugin implements Plugin.PluginBase {
  id = 'fenrir';
  name = 'Fenrir Realm';
  icon = 'src/en/fenrirrealm/icon.png';
  site = 'https://fenrirealm.com';
  version = '1.0.7';
  filters: Filters | undefined = undefined;
  imageRequestInit?: Plugin.ImageRequestInit | undefined = undefined;

  //flag indicates whether access to LocalStorage, SesesionStorage is required.
  webStorageUtilized?: boolean;

  async popularNovels(
    pageNo: number,
    {
      showLatestNovels,
      filters,
    }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    // let sort = "updated";
    let sort = 'popular';
    if (showLatestNovels) sort = 'latest';
    const res = await fetchApi(
      `${this.site}/api/novels/filter?page=${pageNo}&per_page=20&status=any&order=${sort}`,
    ).then(r => r.json());

    return res.data.map(r => this.parseNovelFromApi(r));
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const html = await fetchApi(`${this.site}/series/${novelPath}`).then(r =>
      r.text(),
    );
    const loadedCheerio = loadCheerio(html);

    loadedCheerio(
      'div.overflow-hidden.transition-all.max-h-\\[108px\\] > br',
    ).replaceWith('%%NEWLINE%%');
    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: loadedCheerio('h1.my-2').text(),
      summary: loadedCheerio(
        'div.overflow-hidden.transition-all.max-h-\\[108px\\]',
      )
        .text()
        .replaceAll('%%NEWLINE%%', '\n'),
    };
    // novel.artist = '';
    novel.author = loadedCheerio(
      'div.flex-1 > div.mb-3 > a.inline-flex',
    ).text();
    novel.cover =
      this.site +
      '/storage/' +
      html.match(/,cover:"storage\/(.+?)",cover_data_url/)[1];
    novel.genres = loadedCheerio('div.flex-1 > div.flex:not(.mb-3, .mt-5) > a')
      .map((i, el) => loadCheerio(el).text())
      .toArray()
      .join(',');
    novel.status = loadedCheerio('div.flex-1 > div.mb-3 > span.rounded-md')
      .first()
      .text();

    const chapters = await fetchApi(
      this.site + '/api/novels/chapter-list/' + novelPath,
    ).then(r => r.json());

    novel.chapters = chapters.map(c => ({
      name: c.title,
      path: novelPath + '/' + c.slug,
      releaseTime: c.created_at,
      chapterNumber: c.number,
    }));
    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const page = await fetchApi(this.site + '/series/' + chapterPath).then(r =>
      r.text(),
    );
    return loadCheerio(page)('#reader-area').html();
  }

  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    return await fetchApi(
      `${this.site}/api/novels/filter?page=${pageNo}&per_page=20&search=${encodeURIComponent(searchTerm)}`,
    )
      .then(r => r.json())
      .then(r => r.data.map(novel => this.parseNovelFromApi(novel)));
  }

  parseNovelFromApi(apiData) {
    return {
      name: apiData.title,
      path: apiData.slug,
      cover: this.site + '/' + apiData.cover,
      summary: apiData.description,
      status: apiData.status,
      genres: apiData.genres.map(g => g.name).join(','),
    };
  }

  resolveUrl = (path: string, isNovel?: boolean) =>
    this.site + '/series/' + path;
}

export default new FenrirRealmPlugin();
