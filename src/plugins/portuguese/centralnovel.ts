import { fetchApi, fetchProto, fetchText } from '@libs/fetch';
import { Plugin } from '@typings/plugin';
import { Filters, FilterTypes } from '@libs/filterInputs';
import { load as parseHTML } from 'cheerio';
import { defaultCover } from '@libs/defaultCover';
import { NovelStatus } from '@libs/novelStatus';

// import { isUrlAbsolute } from '@libs/isAbsoluteUrl';
// import { storage, localStorage, sessionStorage } from '@libs/storage';
// import { encode, decode } from 'urlencode';
// import dayjs from 'dayjs';
// import { Parser } from 'htmlparser2';

class CentralNovel implements Plugin.PluginBase {
  id = 'centralnovel.com';
  name = 'Central Novel';
  icon = 'src/pt-br/centralnovel/icon.png';
  site = 'https://centralnovel.com/';
  version = '1.0.0';
  //   filters: Filters | undefined = undefined;
  imageRequestInit?: Plugin.ImageRequestInit | undefined = undefined;

  //flag indicates whether access to LocalStorage, SesesionStorage is required.
  webStorageUtilized?: boolean;

  async popularNovels(
    pageNo: number,
    { filters }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    let url = `${this.site}/series/`;
    url += `?genre[]=${filters?.genres.value}`;
    url += `&status=${filters?.status.value}`;
    url += `&type[]=${filters?.type.value}`;
    url += `&order=${filters?.ordem.value}`;
    url += `&page=${pageNo}`;

    const body = await fetchApi(url).then(res => res.text());

    const loadedCheerio = parseHTML(body);
    const load = loadedCheerio('div.listupd > article.maindet');

    const novels: Plugin.NovelItem[] = load
      .map((index, element) => ({
        name: loadedCheerio(element).find('div.mdinfo h2').text(),
        cover: loadedCheerio(element)
          .find('div.mdthumb img.size-post-thumbnail')
          .attr('src'),
        path:
          loadedCheerio(element).find('div.mdinfo > a.tip').attr('href') || '',
      }))
      .get()
      .filter(novel => novel.name && novel.path);
    return novels;
  }
  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const body = await fetchApi(this.site + novelPath).then(r => r.text());
    const loadedCheerio = parseHTML(body);

    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name:
        loadedCheerio('div.animefull > div.infox > h1.entry-title')
          .text()
          .trim() || 'Sem título',
    };

    novel.name =
      loadedCheerio('div.animefull div.infox h1.entry-title').text().trim() ||
      'Sem título';
    novel.summary =
      loadedCheerio('div.animefull div.infox div.ninfo div.desc')
        .text()
        .trim() || '';
    novel.cover =
      loadedCheerio(
        'div.animefull div.thumb img.attachment-post-thumbnail',
      ).attr('src') || defaultCover;
    novel.author = loadedCheerio(
      'div.animefull div.infox div.ninfo div.spe > span:nth-of-type(3) > a',
    )
      .map((i, el) => loadedCheerio(el).text())
      .toArray()
      .join(',');
    //   .text()
    //   .trim();
    novel.genres = loadedCheerio('div.animefull div.infox div.ninfo div.genxed')
      .map((i, el) => loadedCheerio(el).text())
      .toArray()
      .join('');

    const status = loadedCheerio(
      'div.animefull div.infox div.ninfo div.spe > span:nth-of-type(1)',
    )
      .remove('b')
      .text()
      .trim();

    switch (status) {
      case 'Em andamento':
        novel.status = NovelStatus.Ongoing;
        break;
      case 'Hiato':
        novel.status = NovelStatus.OnHiatus;
        break;
      case 'Completo':
        novel.status = NovelStatus.Completed;
        break;
      default:
        novel.status = NovelStatus.Unknown;
    }

    const chapters: Plugin.ChapterItem[] = [];

    loadedCheerio('div.epcheck li').each((i, el) => {
      const chapterName = `${loadedCheerio(el).find('a > div.epl-num').text().trim()} - ${loadedCheerio(el).find('a > div.epl-title').text().trim()}`;
      const chapterPath = loadedCheerio(el).find('a').attr('href');
      if (chapterPath) chapters.push({ name: chapterName, path: chapterPath });
    });
    novel.chapters = chapters;
    return novel;
  }
  async parseChapter(chapterPath: string): Promise<string> {
    const response = await fetchApi(`${chapterPath}`).then(res => res.text());
    const loadedCheerio = parseHTML(response);
    return loadedCheerio('div.epcontent').html() || '';
  }
  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    const url = `${this.site}/page/${pageNo}/?s=${searchTerm}`;
    const body = await fetchApi(url).then(res => res.text());
    const loadedCheerio = parseHTML(body);
    const load = loadedCheerio('div.listupd');

    const novels: Plugin.NovelItem[] = load
      .map((index, element) => ({
        name: loadedCheerio(element).find('article.maindet h2').text(),
        cover: loadedCheerio(element)
          .find('article.maindet img.attachment-post-thumbnail')
          .attr('src'),
        path:
          loadedCheerio(element).find('article.maindet a').attr('href') || '',
      }))
      .get()
      .filter(novel => novel.name && novel.path);
    return novels;
  }

  filters = {
    genres: {
      value: '',
      label: 'Gêneros',
      options: [
        { label: 'Todos', value: '' },
        { label: 'Ação', value: 'ação' },
        { label: 'Action', value: 'action' },
        { label: 'Adulto', value: 'adulto' },
        { label: 'Adventure', value: 'adventure' },
        { label: 'Artes Marciais', value: 'artes marciais' },
        { label: 'Aventura', value: 'aventura' },
        { label: 'Comédia', value: 'comédia' },
        { label: 'Cotidiano', value: 'cotidiano' },
        { label: 'Cultivo', value: 'cultivo' },
        { label: 'Drama', value: 'drama' },
        { label: 'Ecchi', value: 'ecchi' },
        { label: 'Escolar', value: 'escolar' },
        { label: 'Esportes', value: 'esportes' },
        { label: 'Evolução', value: 'evolução' },
        { label: 'Fantasia', value: 'fantasia' },
        { label: 'Fantasy', value: 'fantasy' },
        { label: 'Ficção Científica', value: 'ficção científica' },
        { label: 'Gender Bender', value: 'gender bender' },
        { label: 'Harém', value: 'harém' },
        { label: 'Histórico', value: 'histórico' },
        { label: 'Isekai', value: 'isekai' },
        { label: 'Josei', value: 'josei' },
        { label: 'Magia', value: 'magia' },
        { label: 'Mecha', value: 'mecha' },
        { label: 'Medieval', value: 'medieval' },
        { label: 'Mistério', value: 'mistério' },
        { label: 'Mitologia', value: 'mitologia' },
        { label: 'Monstros', value: 'monstros' },
        { label: 'Pet', value: 'pet' },
        { label: 'Protagonista Feminina', value: 'protagonista feminina' },
        { label: 'Protagonista Maligno', value: 'protagonista maligno' },
        { label: 'Psicológico', value: 'psicológico' },
        { label: 'Psychological', value: 'psychological' },
        { label: 'Reencarnação', value: 'reencarnação' },
        { label: 'Romance', value: 'romance' },
        { label: 'Seinen', value: 'seinen' },
        { label: 'Shoujo', value: 'shoujo' },
        { label: 'Shounen', value: 'shounen' },
        { label: 'Shounen BL', value: 'shounen bl' },
        { label: 'Sistema', value: 'sistema' },
        { label: 'Sistema de Jogo', value: 'sistema de jogo' },
        { label: 'Slice of Life', value: 'slice of life' },
        { label: 'Sobrenatural', value: 'sobrenatural' },
        { label: 'Supernatural', value: 'supernatural' },
        { label: 'Terror', value: 'terror' },
        { label: 'Tragédia', value: 'tragédia' },
        { label: 'Transmigração', value: 'transmigração' },
        { label: 'Vida Escolar', value: 'vida escolar' },
        { label: 'VRMMO', value: 'vrmmo' },
        { label: 'Wuxia', value: 'wuxia' },
        { label: 'Xianxia', value: 'xianxia' },
        { label: 'Xuanhuan', value: 'xuanhuan' },
      ],
      type: FilterTypes.Picker,
    },
    status: {
      label: 'Status',
      value: '',
      options: [
        { label: 'Todos', value: 'todos' },
        { label: 'Em andamento', value: 'em andamento' },
        { label: 'Hiato', value: 'hiato' },
        { label: 'Completo', value: 'completo' },
      ],
      type: FilterTypes.Picker,
    },
    type: {
      label: 'Type',
      value: '',
      options: [
        { label: 'Light Novel', value: 'light-novel' },
        { label: 'Novel Chinesa', value: 'novel-chinesa' },
        { label: 'Novel Coreana', value: 'novel-coreana' },
        { label: 'Novel Japonesa', value: 'novel-japonesa' },
        { label: 'Novel Ocidental', value: 'novel-ocidental' },
        { label: 'Webnovel', value: 'webnovel' },
      ],
      type: FilterTypes.Picker,
    },
    ordem: {
      label: 'Ordenar',
      value: '',
      options: [
        { label: 'Padrão', value: 'padrão' },
        { label: 'A-Z', value: 'a-z' },
        { label: 'Z-A', value: 'z-a' },
        { label: 'Últ. Att', value: 'últ. att' },
        { label: 'Últ. Add', value: 'últ. add' },
        { label: 'Populares', value: 'populares' },
        { label: 'Avaliação', value: 'avaliação' },
      ],
      type: FilterTypes.Picker,
    },
  } satisfies Filters;
}

export default new CentralNovel();
