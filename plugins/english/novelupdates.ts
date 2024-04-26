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
    const body = await result.text();
    const url = result.url.toLowerCase();

    // console.log(result.url);

    // console.log('Redirected URL: ', result.chapterUrl);

    const loadedCheerio = parseHTML(body);

    let isAnomalously = url.includes('anotivereads');

    let isBlogspot = url.includes('blogspot');

    let isBlossomTranslation = url.includes('blossomtranslation');

    let isGemNovels = url.includes('gemnovels');

    let isHostedNovel = url.includes('hostednovel');

    let isIppoTranslations = url.includes('ippotranslations');

    let isINovelTranslation = url.includes('inoveltranslation');

    let isLightNovelsTls = url.includes('lightnovelstranslations');

    let isRaeiTranslation = url.includes('raeitranslations');

    let isRainOfSnow = url.includes('rainofsnow');

    let isScribbleHub = url.includes('scribblehub');

    let isShanghaiFantasy = url.includes('shanghaifantasy');

    let isStabbingWithASyringe = url.includes('stabbingwithasyringe');

    let isTravisTranslation = url.includes('travistranslations');

    let isTumblr = url.includes('tumblr');

    let isWattpad = url.includes('wattpad');

    let isWebNovel = url.includes('webnovel');

    let isWordPressStr =
      loadedCheerio('meta[name="generator"]').attr('content') ||
      loadedCheerio('footer').text();

    let isWuxiaWorld = url.includes('wuxiaworld');

    let isKofi = url.includes('ko-fi');

    let isWordPress = false;
    if (isWordPressStr) {
      isWordPress =
        isWordPressStr.toLowerCase().includes('wordpress') ||
        isWordPressStr.includes('Site Kit by Google') ||
        loadedCheerio('.powered-by').text().toLowerCase().includes('wordpress');
      console.log('isWordPress: ', isWordPress);
    }

    if (isAnomalously) {
      chapterText = loadedCheerio('#comic').html()!;
    } else if (isBlogspot) {
      loadedCheerio('.post-share-buttons').remove();
      chapterText =
        loadedCheerio('.entry-content').html() ||
        loadedCheerio('.post-body').html()!;
    } else if (isBlossomTranslation) {
      chapterText = loadedCheerio('.manga-child-content').html()!;
    } else if (isGemNovels) {
      chapterText = loadedCheerio('.prevent-select').html()!;
    } else if (isHostedNovel) {
      chapterText = loadedCheerio('.chapter').html()!;
    } else if (isIppoTranslations) {
      chapterText = loadedCheerio('.entry-content').html()!;
    } else if (isINovelTranslation) {
      const link = 'https://api.' + result.url.slice(8);
      const json = await fetchApi(link).then(r => r.json());
      chapterText = json.content.replace(/\n/g, '<br>');
      if (json.notes) {
        chapterText +=
          '<br><hr><br>TL Notes:<br>' + json.notes.replace(/\n/g, '<br>');
      }
    } else if (isKofi) {
      chapterText = loadedCheerio('script:contains("shadowDom.innerHTML")')
        .html()
        ?.match(/shadowDom\.innerHTML \+= '(<div.*?)';/)![1]!;
    } else if (isLightNovelsTls) {
      chapterText = loadedCheerio('.text_story').html()!;
    } else if (isRaeiTranslation) {
      const parts = result.url.split('/');
      const link = `${parts[0]}//api.${parts[2]}/api/chapters/?id=${parts[3]}&num=${parts[4]}`;
      const json = await fetchApi(link).then(r => r.json());
      chapterText =
        json.currentChapter.head +
        `<br><hr><br>` +
        json.currentChapter.body +
        `<br><hr><br>Translator's Note:<br>` +
        json.currentChapter.note;
      chapterText = chapterText.replace(/\n/g, '<br>');
    } else if (isRainOfSnow) {
      chapterText = loadedCheerio('div.content').html()!;
    } else if (isScribbleHub) {
      chapterText = loadedCheerio('div.chp_raw').html()!;
    } else if (isStabbingWithASyringe) {
      /**
       * Get the chapter link from the main page
       */
      const link = loadedCheerio('.entry-content a').attr('href')!;
      const result = await fetchApi(link);
      const body = await result.text();
      const loadedCheerio_syringe = parseHTML(body);
      chapterText = loadedCheerio_syringe('.entry-content').html()!;
    } else if (isShanghaiFantasy) {
      chapterText = loadedCheerio('.contenta').html()!;
    } else if (isTravisTranslation) {
      chapterText = loadedCheerio('.reader-content').html()!;
    } else if (isTumblr) {
      chapterText = loadedCheerio('.post').html()!;
    } else if (isWattpad) {
      chapterText = loadedCheerio('.container  pre').html()!;
    } else if (isWebNovel) {
      chapterText = loadedCheerio('.cha-words').html()!;
      if (!chapterText) {
        chapterText = loadedCheerio('._content').html()!;
      }
    } else if (isWordPress) {
      const bloatClasses = [
        '#madara-comments',
        '#comments',
        '.author-avatar',
        '.c-ads',
        '.content-comments',
        '.ezoic-ad',
        '.post-cats',
        '.sharedaddy',
        '.sidebar',
        '.wp-block-buttons',
        '.wp-dark-mode-switcher',
        '.wp-next-post-navi',
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
    } else if (isWuxiaWorld) {
      chapterText = loadedCheerio('#chapter-content').html()!;
    } else {
      const tags = ['nav', 'header', 'footer', '.hidden'];
      tags.map(tag => loadedCheerio(tag).remove());
      chapterText = loadedCheerio('body').html()!;
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
