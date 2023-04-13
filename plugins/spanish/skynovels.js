const fetchApi = require('@libs/fetchApi');
const languages = require('@libs/languages');
const fetchFile = require('@libs/fetchFile');

const baseUrl = 'https://www.skynovels.net/';

async function popularNovels (page) {
  const url = 'https://api.skynovels.net/api/novels?&q';

  const result = await fetchApi(url);
  const body = await result.json();

  const novels = [];

  body.novels.map(res => {
    const novelName = res.nvl_title;
    const novelCover =
      'https://api.skynovels.net/api/get-image/' + res.image + '/novels/false';
    const novelUrl = baseUrl + 'novelas/' + res.id + '/' + res.nvl_name + '/';

    const novel = { name: novelName, url: novelUrl, cover: novelCover };

    novels.push(novel);
  });

  return novels ;
};

async function parseNovelAndChapters (novUrl) {
  let novelId = novUrl.substring().split('/')[4];
  const url = 'https://api.skynovels.net/api/novel/' + novelId + '/reading?&q';

  const result = await fetchApi(url);
  const body = await result.json();

  const item = body.novel[0];

  let novel = {};

  novel.url = novUrl;

  novel.name = item.nvl_title;

  novel.cover =
    'https://api.skynovels.net/api/get-image/' + item.image + '/novels/false';

  let genres = [];
  item.genres.map(genre => genres.push(genre.genre_name));
  novel.genres = genres.join(',');
  novel.author = item.nvl_writer;
  novel.summary = item.nvl_content;
  novel.status = item.nvl_status;

  let novelChapters = [];

  item.volumes.map(volume => {
    volume.chapters.map(chapter => {
      const chapterName = chapter.chp_index_title;
      const releaseDate = new Date(chapter.createdAt).toDateString();
      const chapterUrl = novUrl + chapter.id + '/' + chapter.chp_name;

      const chap = { name: chapterName, releaseTime: releaseDate, url: chapterUrl };

      novelChapters.push(chap);
    });
  });

  novel.chapters = novelChapters;

  return novel;
};
// https://www.skynovels.net/novelas/1/el-senor-de-los-misterios/27701/lotm-capitulo-74
const parseChapter = async (chapUrl) => {
  let chapterId = chapUrl.split('/')[6];
  const url = `https://api.skynovels.net/api/novel-chapter/${chapterId}`;

  const result = await fetchApi(url);
  const body = await result.json();

  const item = body.chapter[0];

  let chapterText = item.chp_content;

  return chapterText;
};

async function searchNovels (searchTerm) {
  searchTerm = searchTerm.toLowerCase();
  const url = 'https://api.skynovels.net/api/novels?&q';

  const result = await fetchApi(url);
  const body = await result.json();

  let results = body.novels.filter(novel =>
    novel.nvl_title.toLowerCase().includes(searchTerm),
  );

  const novels = [];

  results.map(res => {
    const novelName = res.nvl_title;
    const novelCover =
      'https://api.skynovels.net/api/get-image/' + res.image + '/novels/false';
    const novelUrl = baseUrl + 'novelas/' + res.id + '/' + res.nvl_name + '/';

    const novel = { name: novelName, url: novelUrl, cover: novelCover };

    novels.push(novel);
  });

  return novels;
};

module.exports = {
    id: 'skynovels.net',
    name: "SkyNovels",
    site: baseUrl,
    version: '1.0.0',
    icon: 'src/es/skynovels/icon.png',
    lang: languages.Spanish,
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};