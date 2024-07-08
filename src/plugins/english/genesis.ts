/* eslint-disable no-case-declarations */
import { load as parseHTML } from 'cheerio';
import { fetchApi } from '@libs/fetch';
import { Filters, FilterTypes } from '@libs/filterInputs';
import { Plugin } from '@typings/plugin';

class Genesis implements Plugin.PluginBase {
  id = 'genesistudio';
  name = 'Genesis';
  icon = 'src/en/genesis/icon.png';
  site = 'https://genesistudio.com';
  version = '1.0.0';
  imageRequestInit?: Plugin.ImageRequestInit | undefined = {
    headers: {
      'referrer': this.site,
    },
  };

  parseNovels(json: any[]) {
    const novels: Plugin.NovelItem[] = json.map((entry: any) => {
      return {
        name: entry.novel_title,
        path: `/novels/${entry.abbreviation}`,
        cover: `https://edit.genesistudio.com/assets/${entry.cover}?format=auto&quality=70&width=400&height=600`,
      };
    });

    return novels;
  }

  async popularNovels(
    page: number,
    {
      showLatestNovels,
      filters,
    }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    let link = `https://genesistudio.com/api/search?`;
    if (showLatestNovels) {
      link += 'sort=Recent';
    } else {
      if (filters!.genres.value.length) {
        link += filters!.genres.value.join('&');
      }
      link += `&${filters!.storyStatus.value}&${filters!.sort.value}`;
    }

    const json = await fetchApi(link).then(r => r.json());

    return this.parseNovels(json);
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const url = `${this.site}${novelPath}/__data.json?x-sveltekit-invalidated=001`;
    const json = await fetchApi(url).then(r => r.json());

    const nodes = json.nodes;
    const data = nodes
      .filter((node: { type: string }) => node.type === 'data')
      .map((node: { data: any }) => node.data)[0];
    const novelData = data[data[0].novel];

    const assets = 'https://edit.genesistudio.com/assets/';
    const format = '?format=auto&quality=70&width=400&height=600';

    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: data[novelData.novel_title],
      cover: `${assets}${data[novelData.cover]}${format}`,
      summary: data[novelData.synopsis],
      genres: data[novelData.genres]
        .map((index: number) => data[index])
        .join(','),
      author: data[novelData.author],
      status: data[novelData.serialization],
      chapters: [],
    };

    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const body = await fetchApi(this.site + chapterPath).then(r => r.text());

    const loadedCheerio = parseHTML(body);

    loadedCheerio('#chr-content > div,h6,p[style="display: none;"]').remove();
    const chapterText = loadedCheerio('#chr-content').html() || '';

    return chapterText;
  }

  async searchNovels(searchTerm: string): Promise<Plugin.NovelItem[]> {
    const url = `${this.site}/api/search?serialization=All&sort=Popular&title=${searchTerm}`;
    const json = await fetchApi(url).then(r => r.json());

    return this.parseNovels(json);
  }

  filters = {
    sort: {
      label: 'Sort Results By',
      value: 'sort=Popular',
      options: [
        { label: 'Popular', value: 'sort=Popular' },
        { label: 'Recent', value: 'sort=Recent' },
        { label: 'Views', value: 'sort=Views' },
      ],
      type: FilterTypes.Picker,
    },
    storyStatus: {
      label: 'Status',
      value: 'serialization=All',
      options: [
        { label: 'All', value: 'serialization=All' },
        { label: 'Ongoing', value: 'serialization=Ongoing' },
        { label: 'Completed', value: 'serialization=Completed' },
      ],
      type: FilterTypes.Picker,
    },
    genres: {
      label: 'Genres',
      value: [],
      options: [
        { label: 'None', value: '' },
        { label: 'Action', value: 'genres=Action' },
        { label: 'Comedy', value: 'genres=Comedy' },
        { label: 'Drama', value: 'genres=Drama' },
        { label: 'Fantasy', value: 'genres=Fantasy' },
        { label: 'Harem', value: 'genres=Harem' },
        { label: 'Martial Arts', value: 'genres=Martial+Arts' },
        { label: 'Modern', value: 'genres=Modern' },
        { label: 'Mystery', value: 'genres=Mystery' },
        { label: 'Psychological', value: 'genres=Psychological' },
        { label: 'Romance', value: 'genres=Romance' },
        { label: 'Slice of life', value: 'genres=Slice+of+Life' },
        { label: 'Tragedy', value: 'genres=Tragedy' },
      ],
      type: FilterTypes.CheckboxGroup,
    },
  } satisfies Filters;
}

export default new Genesis();
