const cheerio = require('cheerio');
const fetchApi = require('@libs/fetchApi').default;
const fetchFile = require('@libs/fetchFile').default;
const FilterInputs = require('@libs/filterInputs').default;

const pluginId = 'novelupdates';
const baseUrl = 'https://www.novelupdates.com/';

const headers = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
};

function getPopularNovelsUrl(page, { showLatestNovels, filters }) {
  let url = `${baseUrl}${
    filters
      ? 'series-finder'
      : showLatestNovels
      ? 'latest-series'
      : 'series-ranking'
  }/`;

  if (!filters) {
    url += '?rank=week';
  } else {
    url += '?sf=1';
  }

  if (filters?.novelType?.length) {
    url += '&nt=' + filters?.novelType.join(',');
  }

  if (filters?.genres?.length) {
    url += '&gi=' + filters?.genres.join(',') + '&mgi=and';
  }

  if (filters?.language?.length) {
    url += '&org=' + filters?.language.join(',');
  }

  if (filters?.storyStatus) {
    url += '&ss=' + filters?.storyStatus;
  }

  if (!filters?.sort) {
    url += '&sort=' + 'sdate';
  } else {
    url += '&sort=' + filters?.sort;
  }

  if (!filters?.order) {
    url += '&order=' + 'desc';
  } else {
    url += '&order=' + filters?.order;
  }

  return url;
}

async function popularNovels(page, { showLatestNovels, filters }) {
  const url = getPopularNovelsUrl(page, { showLatestNovels, filters });

  const result = await fetchApi(url, { headers: headers }, pluginId);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  const novels = [];

  loadedCheerio('div.search_main_box_nu').each(function (res) {
    const novelCover = loadedCheerio(this).find('img').attr('src');
    const novelName = loadedCheerio(this).find('.search_title > a').text();
    const novelUrl = loadedCheerio(this).find('.search_title > a').attr('href');

    const novel = {
      name: novelName,
      cover: novelCover,
      url: novelUrl,
    };

    novels.push(novel);
  });

  return novels;
}

async function parseNovelAndChapters(novelUrl) {
  const url = novelUrl;

  const result = await fetchApi(url, { headers: headers }, pluginId);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  const novel = {
    url,
    chapters: [],
  };

  novel.name = loadedCheerio('.seriestitlenu').text();

  novel.cover = loadedCheerio('.seriesimg > img').attr('src');

  novel.author = loadedCheerio('#showauthors').text().trim();

  novel.genres = loadedCheerio('#seriesgenre')
    .children('a')
    .map((i, el) => loadedCheerio(el).text())
    .toArray()
    .join(',');
  novel.status = loadedCheerio('#editstatus').text().includes('Ongoing')
    ? 'Ongoing'
    : 'Completed';

  let type = loadedCheerio('#showtype').text().trim();

  let summary = loadedCheerio('#editdescription').text().trim();

  novel.summary = summary + `\n\nType: ${type}`;

  let chapter = [];

  const novelId = loadedCheerio('input#mypostid').attr('value');

  let formData = new FormData();
  formData.append('action', 'nd_getchapters');
  formData.append('mygrr', 0);
  formData.append('mypostid', parseInt(novelId, 10));

  let link = 'https://www.novelupdates.com/wp-admin/admin-ajax.php';

  const text = await fetchApi(
    link,
    {
      method: 'POST',
      body: formData,
      headers: headers,
    },
    pluginId,
  ).then(data => data.text());

  loadedCheerio = cheerio.load(text);

  loadedCheerio('li.sp_li_chp').each(function () {
    const chapterName = loadedCheerio(this).text().trim();

    const releaseDate = null;

    const chapterUrl =
      'https:' + loadedCheerio(this).find('a').first().next().attr('href');

    chapter.push({
      name: chapterName,
      releaseTime: releaseDate,
      url: chapterUrl,
    });
  });

  novel.chapters = chapter.reverse();

  return novel;
}

function getLocation(href) {
  var match = href.match(
    /^(https?:)\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/,
  );
  return match && `${match[1]}//${match[3]}`;
}

async function parseChapter(chapterUrl) {
  // console.log('Original URL: ', chapterUrl);

  let result, body;

  let chapterText = '';

  result = await fetchApi(
    chapterUrl,
    {
      method: 'GET',
      headers: headers,
    },
    pluginId,
  );
  body = await result.text();

  // console.log(result.chapterUrl);

  // console.log('Redirected URL: ', result.chapterUrl);

  const loadedCheerio = cheerio.load(body);

  let isWuxiaWorld = result.chapterUrl.toLowerCase().includes('wuxiaworld');

  let isBlogspot = result.chapterUrl.toLowerCase().includes('blogspot');

  let isTumblr = result.chapterUrl.toLowerCase().includes('tumblr');

  let isWattpad = result.chapterUrl.toLowerCase().includes('wattpad');

  let isLightNovelsTls = result.chapterUrl
    .toLowerCase()
    .includes('lightnovelstranslations');

  let isiNovelTranslation = result.chapterUrl
    .toLowerCase()
    .includes('inoveltranslation');

  let isTravisTranslation = result.chapterUrl
    .toLowerCase()
    .includes('travistranslations');

  /**
   * Checks if its a wordpress site
   */
  let isWordPress =
    loadedCheerio('meta[name="generator"]').attr('content') ||
    loadedCheerio('footer').text();

  if (isWordPress) {
    isWordPress =
      isWordPress.toLowerCase().includes('wordpress') ||
      isWordPress.includes('Site Kit by Google') ||
      loadedCheerio('.powered-by').text().toLowerCase().includes('wordpress');
  }

  let isRainOfSnow = result.chapterUrl.toLowerCase().includes('rainofsnow');

  let isWebNovel = result.chapterUrl.toLowerCase().includes('webnovel');

  let isHostedNovel = result.chapterUrl.toLowerCase().includes('hostednovel');

  let isScribbleHub = result.chapterUrl.toLowerCase().includes('scribblehub');

  if (isWuxiaWorld) {
    chapterText = loadedCheerio('#chapter-content').html();
  } else if (isRainOfSnow) {
    chapterText = loadedCheerio('div.content').html();
  } else if (isTumblr) {
    chapterText = loadedCheerio('.post').html();
  } else if (isBlogspot) {
    loadedCheerio('.post-share-buttons').remove();
    chapterText = loadedCheerio('.entry-content').html();
  } else if (isHostedNovel) {
    chapterText = loadedCheerio('.chapter').html();
  } else if (isScribbleHub) {
    chapterText = loadedCheerio('div.chp_raw').html();
  } else if (isWattpad) {
    chapterText = loadedCheerio('.container  pre').html();
  } else if (isTravisTranslation) {
    chapterText = loadedCheerio('.reader-content').html();
  } else if (isLightNovelsTls) {
    chapterText = loadedCheerio('.text_story').html();
  } else if (isiNovelTranslation) {
    chapterText = loadedCheerio('.chakra-skeleton').html();
  } else if (isWordPress) {
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
      loadedCheerio('.td-page-content').html();
  } else if (isWebNovel) {
    chapterText = loadedCheerio('.cha-words').html();

    if (!chapterText) {
      chapterText = loadedCheerio('._content').html();
    }
  } else {
    /**
     * Remove unnecessary tags
     */
    const tags = ['nav', 'header', 'footer', '.hidden'];

    tags.map(tag => loadedCheerio(tag).remove());

    chapterText = loadedCheerio('body').html();
  }

  if (chapterText) {
    /**
     * Convert relative urls to absolute
     */
    chapterText = chapterText.replace(
      /href="\//g,
      `href="${getLocation(result.chapterUrl)}/`,
    );
  }

  return chapterText;
}

async function searchNovels(searchTerm) {
  const url =
    'https://www.novelupdates.com/?s=' + searchTerm + '&post_type=seriesplans';

  const result = await fetchApi(url, { headers: headers }, pluginId);
  const body = await result.text();

  const loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('div.search_main_box_nu').each(function () {
    const novelCover = loadedCheerio(this).find('img').attr('src');
    const novelName = loadedCheerio(this).find('.search_title > a').text();
    const novelUrl = loadedCheerio(this)
      .find('.search_title > a')
      .attr('href')
      .split('/')[4];

    novels.push({
      name: novelName,
      url: novelUrl,
      cover: novelCover,
    });
  });
  return novels;
}

async function fetchImage(url) {
  return await fetchFile(url, { headers: headers });
}

const filters = [
  {
    key: 'sort',
    label: 'Sort Results By',
    values: [
      { label: 'Last Updated', value: 'sdate' },
      { label: 'Rating', value: 'srate' },
      { label: 'Rank', value: 'srank' },
      { label: 'Reviews', value: 'sreview' },
      { label: 'Chapters', value: 'srel' },
      { label: 'Title', value: 'abc' },
      { label: 'Readers', value: 'sread' },
      { label: 'Frequency', value: 'sfrel' },
    ],
    inputType: FilterInputs.Picker,
  },
  {
    key: 'order',
    label: 'Order',
    values: [
      { label: 'Descending', value: 'desc' },
      { label: 'Ascending', value: 'asc' },
    ],
    inputType: FilterInputs.Picker,
  },
  {
    key: 'storyStatus',
    label: 'Story Status (Translation)',
    values: [
      { label: 'All', value: '' },
      { label: 'Completed', value: '2' },
      { label: 'Ongoing', value: '3' },
      { label: 'Hiatus', value: '4' },
    ],
    inputType: FilterInputs.Picker,
  },
  {
    key: 'language',
    label: 'Language',
    values: [
      { label: 'Chinese', value: 495 },
      { label: 'Filipino', value: 9181 },
      { label: 'Indonesian', value: 9179 },
      { label: 'Japanese', value: 496 },
      { label: 'Khmer', value: 18657 },
      { label: 'Korean', value: 497 },
      { label: 'Malaysian', value: 9183 },
      { label: 'Thai', value: 9954 },
      { label: 'Vietnamese', value: 9177 },
    ],
    inputType: FilterInputs.Checkbox,
  },
  {
    key: 'novelType',
    label: 'Novel Type',
    values: [
      { label: 'Light Novel', value: '2443' },
      { label: 'Published Novel', value: '26874' },
      { label: 'Web Novel', value: '2444' },
    ],
    inputType: FilterInputs.Checkbox,
  },
  {
    key: 'genres',
    label: 'Genres',
    values: [
      { label: 'Action', value: 8 },
      { label: 'Adult', value: 280 },
      { label: 'Adventure', value: 13 },
      { label: 'Comedy', value: 17 },
      { label: 'Drama', value: 9 },
      { label: 'Ecchi', value: 292 },
      { label: 'Fantasy', value: 5 },
      { label: 'Gender Bender', value: 168 },
      { label: 'Harem', value: 3 },
      { label: 'Historical', value: 330 },
      { label: 'Horror', value: 343 },
      { label: 'Josei', value: 324 },
      { label: 'Martial Arts', value: 14 },
      { label: 'Mature', value: 4 },
      { label: 'Mecha', value: 10 },
      { label: 'Mystery', value: 245 },
      { label: 'Psychoical', value: 486 },
      { label: 'Romance', value: 15 },
      { label: 'School Life', value: 6 },
      { label: 'Sci-fi', value: 11 },
      { label: 'Seinen', value: 18 },
      { label: 'Shoujo', value: 157 },
      { label: 'Shoujo Ai', value: 851 },
      { label: 'Shounen', value: 12 },
      { label: 'Shounen Ai', value: 1692 },
      { label: 'Slice of Life', value: 7 },
      { label: 'Smut', value: 281 },
      { label: 'Sports', value: 1357 },
      { label: 'Supernatural', value: 16 },
      { label: 'Tragedy', value: 132 },
      { label: 'Wuxia', value: 479 },
      { label: 'Xianxia', value: 480 },
      { label: 'Xuanhuan', value: 3954 },
      { label: 'Yaoi', value: 560 },
      { label: 'Yuri', value: 922 },
    ],
    inputType: FilterInputs.Checkbox,
  },
];

module.exports = {
  id: pluginId,
  name: 'Novel Updates',
  version: '0.5.0',
  icon: 'src/en/novelupdates/icon.png',
  site: baseUrl,
  protected: false,
  fetchImage,
  popularNovels,
  parseNovelAndChapters,
  parseChapter,
  searchNovels,
  filters,
};
