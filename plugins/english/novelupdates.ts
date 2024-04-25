import { CheerioAPI, load as parseHTML } from 'cheerio';
import { fetchApi, fetchFile } from '@libs/fetch';
import { Filters, FilterTypes } from '@libs/filterInputs';
import { Plugin } from '@typings/plugin';

class NovelUpdates implements Plugin.PluginBase {
  id = 'novelupdates';
  name = 'Novel Updates';
  version = '0.5.3';
  icon = 'src/en/novelupdates/icon.png';
  site = 'https://www.novelupdates.com/';

  parseNovels(loadedCheerio: CheerioAPI) {
    const novels: Plugin.NovelItem[] = [];

    loadedCheerio('div.search_main_box_nu').each((idx, ele) => {
      const novelCover = loadedCheerio(ele).find('img').attr('src');
      const novelName = loadedCheerio(ele).find('.search_title > a').text();
      const novelUrl = loadedCheerio(ele)
        .find('.search_title > a')
        .attr('href');

      if (!novelUrl) return;

      const novel = {
        name: novelName,
        cover: novelCover,
        path: novelUrl.replace(this.site, ''),
      };

      novels.push(novel);
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
    let link = `${this.site}`;
    if (
      filters.language.value.length ||
      filters.novelType.value.length ||
      filters.genres.value.include?.length ||
      filters.genres.value.exclude?.length ||
      filters.storyStatus.value !== ''
    ) {
      link += 'series-finder/?sf=1';
    } else if (showLatestNovels) {
      link += 'latest-series/?st=1';
    } else {
      link += 'series-ranking/?rank=week';
    }

    if (filters.language.value.length)
      link += '&org=' + filters.language.value.join(',');

    if (filters.novelType.value.length)
      link += '&nt=' + filters.novelType.value.join(',');

    if (filters.genres.value.include?.length)
      link += '&gi=' + filters.genres.value.include.join(',');

    if (filters.genres.value.exclude?.length)
      link += '&ge=' + filters.genres.value.exclude.join(',');

    if (
      filters.genres.value.include?.length ||
      filters.genres.value.exclude?.length
    )
      link += '&mgi=' + filters.genre_operator.value;

    if (filters.storyStatus.value.length)
      link += '&ss=' + filters.storyStatus.value;

    link += '&sort=' + filters.sort.value;

    link += '&order=' + filters.order.value;

    link += '&pg=' + page;

    const body = await fetchApi(link).then(result => result.text());

    const loadedCheerio = parseHTML(body);
    return this.parseNovels(loadedCheerio);
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const url = this.site + novelPath;
    const result = await fetchApi(url);
    const body = await result.text();

    let loadedCheerio = parseHTML(body);

    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: loadedCheerio('.seriestitlenu').text() || 'Untitled',
      cover: loadedCheerio('.wpb_wrapper img').attr('src'),
      chapters: [],
    };

    novel.author = loadedCheerio('#authtag')
      .map((i, el) => loadedCheerio(el).text().trim())
      .toArray()
      .join(', ');

    novel.genres = loadedCheerio('#seriesgenre')
      .children('a')
      .map((i, el) => loadedCheerio(el).text())
      .toArray()
      .join(',');

    novel.status = loadedCheerio('#editstatus').text().includes('Ongoing')
      ? 'Ongoing'
      : 'Completed';

    const type = loadedCheerio('#showtype').text().trim();

    const summary = loadedCheerio('#editdescription').text().trim();

    novel.summary = summary + `\n\nType: ${type}`;

    const chapter: Plugin.ChapterItem[] = [];

    const novelId = loadedCheerio('input#mypostid').attr('value')!;

    const formData = new FormData();
    formData.append('action', 'nd_getchapters');
    formData.append('mygrr', '0');
    formData.append('mypostid', novelId);

    const link = `${this.site}wp-admin/admin-ajax.php`;

    const text = await fetchApi(link, {
      method: 'POST',
      body: formData,
    }).then(data => data.text());

    loadedCheerio = parseHTML(text);

    loadedCheerio('li.sp_li_chp').each((i, el) => {
      const chapterName = loadedCheerio(el).text().trim();
      const chapterUrl =
        'https:' + loadedCheerio(el).find('a').first().next().attr('href');

      chapter.push({
        name: chapterName,
        path: chapterUrl.replace(this.site, ''),
      });
    });

    novel.chapters = chapter.reverse();

    return novel;
  }

  getLocation(href: string) {
    var match = href.match(
      /^(https?:)\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/,
    );
    return match && `${match[1]}//${match[3]}`;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    let chapterText = '';

    const result = await fetchApi(this.site + chapterPath);
    const url = result.url.toLowerCase();
    const body = await result.text();

    // console.log(result.url);

    // console.log('Redirected URL: ', result.chapterUrl);

    const loadedCheerio = parseHTML(body);

    let isWordPressStr =
      loadedCheerio('meta[name="generator"]').attr('content') ||
      loadedCheerio('footer').text();
    let isWordPress = false;
    if (isWordPressStr) {
      isWordPress =
        isWordPressStr.toLowerCase().includes('wordpress') ||
        isWordPressStr.includes('Site Kit by Google') ||
        loadedCheerio('.powered-by').text().toLowerCase().includes('wordpress');
    }

    switch (true) {
      case url.includes('anotivereads'):
        chapterText = loadedCheerio('#comic').html()!;
        break;
      case url.includes('blogspot'):
        loadedCheerio('.post-share-buttons').remove();
        chapterText =
          loadedCheerio('.entry-content').html() ||
          loadedCheerio('.post-body').html()!;
        break;
      case url.includes('blossomtranslation'):
        chapterText = loadedCheerio('.manga-child-content').html()!;
        break;
      case url.includes('gemnovels'):
        chapterText = loadedCheerio('.prevent-select').html()!;
        break;
      case url.includes('hostednovel'):
        chapterText = loadedCheerio('.chapter').html()!;
        break;
      case url.includes('inoveltranslation'):
        const link_inovel = 'https://api.' + result.url.slice(8);
        const json_inovel = await fetchApi(link_inovel).then(r => r.json());
        chapterText = json_inovel.content.replace(/\n/g, '<br>');
        if (json_inovel.notes) {
          chapterText +=
            '<br><hr><br>TL Notes:<br>' +
            json_inovel.notes.replace(/\n/g, '<br>');
        }
        break;
      case url.includes('ko-fi'):
        chapterText = loadedCheerio('script:contains("shadowDom.innerHTML")')
          .html()
          ?.match(/shadowDom\.innerHTML \+= '(<div.*?)';/)![1]!;
        break;
      case url.includes('lightnovelstranslations'):
        chapterText = loadedCheerio('.text_story').html()!;
        break;
      case url.includes('raeitranslations'):
        const parts = result.url.split('/');
        const link_raei = `${parts[0]}//api.${parts[2]}/api/chapters/?id=${parts[3]}&num=${parts[4]}`;
        const json_raei = await fetchApi(link_raei).then(r => r.json());
        chapterText =
          json_raei.currentChapter.head +
          `<br><hr><br>` +
          json_raei.currentChapter.body +
          `<br><hr><br>Translator's Note:<br>` +
          json_raei.currentChapter.note;
        chapterText = chapterText.replace(/\n/g, '<br>');
        break;
      case url.includes('rainofsnow'):
        chapterText = loadedCheerio('div.content').html()!;
        break;
      case url.includes('scribblehub'):
        chapterText = loadedCheerio('div.chp_raw').html()!;
        break;
      case url.includes('stabbingwithasyringe'):
        /**
         * Get the chapter link from the main page
         */
        const link_syringe = loadedCheerio('.entry-content a').attr('href')!;
        const result_syringe = await fetchApi(link_syringe);
        const body_syringe = await result_syringe.text();
        const loadedCheerio_syringe = parseHTML(body_syringe);
        chapterText = loadedCheerio_syringe('.entry-content').html()!;
        break;
      case url.includes('travistranslations'):
        chapterText = loadedCheerio('.reader-content').html()!;
        break;
      case url.includes('tumblr'):
        chapterText = loadedCheerio('.post').html()!;
        break;
      case url.includes('wattpad'):
        chapterText = loadedCheerio('.container  pre').html()!;
        break;
      case url.includes('webnovel'):
        chapterText = loadedCheerio('.cha-words').html()!;
        if (!chapterText) {
          chapterText = loadedCheerio('._content').html()!;
        }
        break;
      case isWordPress:
        /**
         * Remove wordpress bloat tags
         */
        const bloatClasses = [
          '.c-ads',
          '#madara-comments',
          '#comments',
          '.content-comments',
          '.sharedaddy',
          '.wp-dark-mode-switcher',
          '.wp-next-post-navi',
          '.wp-block-buttons',
          '.wp-block-columns',
          '.post-cats',
          '.sidebar',
          '.author-avatar',
          '.ezoic-ad',
        ];
        bloatClasses.map(tag => loadedCheerio(tag).remove());
        chapterText =
          loadedCheerio('.entry-content').html() ||
          loadedCheerio('.single_post').html() ||
          loadedCheerio('.post-entry').html() ||
          loadedCheerio('.main-content').html() ||
          loadedCheerio('article.post').html() ||
          loadedCheerio('.content').html() ||
          loadedCheerio('#content').html() ||
          loadedCheerio('.page-body').html() ||
          loadedCheerio('.td-page-content').html()!;
        break;
      case url.includes('wuxiaworld'):
        chapterText = loadedCheerio('#chapter-content').html()!;
        break;
      default:
        /**
         * Remove unnecessary tags
         */
        const tags = ['nav', 'header', 'footer', '.hidden'];

        tags.map(tag => loadedCheerio(tag).remove());

        chapterText = loadedCheerio('body').html()!;
        break;
    }

    if (chapterText) {
      /**
       * Convert relative urls to absolute
       */
      chapterText = chapterText.replace(
        /href="\//g,
        `href="${this.getLocation(result.url)}/`,
      );
    }

    return chapterText;
  }

  async searchNovels(
    searchTerm: string,
    page: number,
  ): Promise<Plugin.NovelItem[]> {
    const url =
      this.site +
      '?s=' +
      searchTerm.replace(/\s+/g, '+') +
      '&post_type=seriesplans';
    const result = await fetchApi(url);
    const body = await result.text();
    const loadedCheerio = parseHTML(body);
    return this.parseNovels(loadedCheerio);
  }

  fetchImage(url: string): Promise<string | undefined> {
    return fetchFile(url);
  }

  filters = {
    sort: {
      label: 'Sort Results By',
      value: 'sdate',
      options: [
        { label: 'Last Updated', value: 'sdate' },
        { label: 'Rating', value: 'srate' },
        { label: 'Rank', value: 'srank' },
        { label: 'Reviews', value: 'sreview' },
        { label: 'Chapters', value: 'srel' },
        { label: 'Title', value: 'abc' },
        { label: 'Readers', value: 'sread' },
        { label: 'Frequency', value: 'sfrel' },
      ],
      type: FilterTypes.Picker,
    },
    order: {
      label: 'Order',
      value: 'desc',
      options: [
        { label: 'Descending', value: 'desc' },
        { label: 'Ascending', value: 'asc' },
      ],
      type: FilterTypes.Picker,
    },
    storyStatus: {
      label: 'Story Status (Translation)',
      value: '',
      options: [
        { label: 'All', value: '' },
        { label: 'Completed', value: '2' },
        { label: 'Ongoing', value: '3' },
        { label: 'Hiatus', value: '4' },
      ],
      type: FilterTypes.Picker,
    },
    language: {
      label: 'Language',
      value: [],
      options: [
        { label: 'Chinese', value: '495' },
        { label: 'Filipino', value: '9181' },
        { label: 'Indonesian', value: '9179' },
        { label: 'Japanese', value: '496' },
        { label: 'Khmer', value: '18657' },
        { label: 'Korean', value: '497' },
        { label: 'Malaysian', value: '9183' },
        { label: 'Thai', value: '9954' },
        { label: 'Vietnamese', value: '9177' },
      ],
      type: FilterTypes.CheckboxGroup,
    },
    novelType: {
      label: 'Novel Type',
      value: [],
      options: [
        { label: 'Light Novel', value: '2443' },
        { label: 'Published Novel', value: '26874' },
        { label: 'Web Novel', value: '2444' },
      ],
      type: FilterTypes.CheckboxGroup,
    },
    genres: {
      label: 'Genres',
      type: FilterTypes.ExcludableCheckboxGroup,
      value: {
        include: [],
        exclude: [],
      },
      options: [
        { label: 'Action', value: '8' },
        { label: 'Adult', value: '280' },
        { label: 'Adventure', value: '13' },
        { label: 'Comedy', value: '17' },
        { label: 'Drama', value: '9' },
        { label: 'Ecchi', value: '292' },
        { label: 'Fantasy', value: '5' },
        { label: 'Gender Bender', value: '168' },
        { label: 'Harem', value: '3' },
        { label: 'Historical', value: '330' },
        { label: 'Horror', value: '343' },
        { label: 'Josei', value: '324' },
        { label: 'Martial Arts', value: '14' },
        { label: 'Mature', value: '4' },
        { label: 'Mecha', value: '10' },
        { label: 'Mystery', value: '245' },
        { label: 'Psychoical', value: '486' },
        { label: 'Romance', value: '15' },
        { label: 'School Life', value: '6' },
        { label: 'Sci-fi', value: '11' },
        { label: 'Seinen', value: '18' },
        { label: 'Shoujo', value: '157' },
        { label: 'Shoujo Ai', value: '851' },
        { label: 'Shounen', value: '12' },
        { label: 'Shounen Ai', value: '1692' },
        { label: 'Slice of Life', value: '7' },
        { label: 'Smut', value: '281' },
        { label: 'Sports', value: '1357' },
        { label: 'Supernatural', value: '16' },
        { label: 'Tragedy', value: '132' },
        { label: 'Wuxia', value: '479' },
        { label: 'Xianxia', value: '480' },
        { label: 'Xuanhuan', value: '3954' },
        { label: 'Yaoi', value: '560' },
        { label: 'Yuri', value: '922' },
      ],
    },
    genre_operator: {
      label: 'Genre (AND/OR)',
      value: 'and',
      options: [
        { label: 'AND', value: 'and' },
        { label: 'OR', value: 'or' },
      ],
      type: FilterTypes.Picker,
    },
  } satisfies Filters;
}

export default new NovelUpdates();
