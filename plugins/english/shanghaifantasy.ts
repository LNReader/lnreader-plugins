import { fetchApi } from '@libs/fetch';
import { Plugin } from '@/types/plugin';
import { load as loadCheerio } from 'cheerio';
import { Filters, FilterTypes } from '@libs/filterInputs';
import { storage } from '@libs/storage';
import { defaultCover } from '@libs/defaultCover';

class ShanghaiFantasyPlugin implements Plugin.PluginBase {
  id = 'shanghaifantasy';
  name = 'Shanghai Fantasy';
  icon = 'src/en/shanghaifantasy/icon.png';
  site = 'https://shanghaifantasy.com';
  version = '1.0.10';
  imageRequestInit?: Plugin.ImageRequestInit | undefined = undefined;

  hideLocked = storage.get('hideLocked');
  pluginSettings = {
    hideLocked: {
      value: '',
      label: 'Hide locked chapters',
      type: 'Switch',
    },
  };

  //flag indicates whether access to LocalStorage, SesesionStorage is required.
  webStorageUtilized?: boolean;

  async popularNovels(
    pageNo: number,
    {
      showLatestNovels,
      filters,
    }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    const genre = filters.genres.value.join('*');
    const status = filters.status.value !== 'all' ? filters.status.value : '';
    const res = await fetchApi(
      `${this.site}/wp-json/fiction/v1/novels/?novelstatus=${status}&page=${pageNo}&term=${genre}&${filters.sort.value}`,
    ).then(r => r.json());

    return res.map(r => this.parseNovelFromApi(r));
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const html = await fetchApi(`${this.site}/novel/${novelPath}/`, {
      headers: {
        'User-Agent': '',
      },
    }).then(r => r.text());
    const loadedCheerio = loadCheerio(html);

    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: stripTitle(
        loadedCheerio('div.ml-5.p-1.flex.flex-col > p.mb-3.text-lg').text(),
      ),
      id: loadedCheerio('#chapterList').data('cat'),
      summary: loadedCheerio('[x-show*="Synopsis"] p')
        .map((i, el) => loadCheerio(el).text())
        .get()
        .join('\n\n')
        .trim(),
    };
    // novel.artist = '';
    novel.author = loadedCheerio(
      'header + div:first > div > div > p:eq(2)',
    ).contents()[1].data;
    const coverMatch = loadedCheerio('header + div:first > img').attr('src');
    novel.cover = coverMatch ? coverMatch : defaultCover;
    novel.genres = loadedCheerio(
      'header + div:first > div span:has(> a[href*="genre="])',
    )
      .map((i, el) => loadCheerio(el).text().trim())
      .toArray()
      .join(',');
    novel.status = loadedCheerio('header + div:first > div > a > p')
      .first()
      .text()
      .trim();

    let chapters = await this.fetchChapters(novel.id, 1);

    if (this.hideLocked) {
      chapters = chapters.filter(c => !c.locked);
    }
    console.log(chapters);

    novel.chapters = chapters
      .map(c => ({
        name:
          (c.locked ? '🔒 ' : '') +
          'Chapter ' +
          stripTitle(c.title.replace(/^.+ Chapter /i, ''), false),
        path: c.permalink.split('/').at(-2),
        chapterNumber: parseFloat(
          c.title.replace(/^.+ ([0-9]+.?[0-9]?)$/i, '$1'),
        ),
      }))
      .sort((a, b) => a.chapterNumber - b.chapterNumber) /**/;
    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const page = await fetchApi(this.site + '/' + chapterPath, {
      headers: {
        'User-Agent': '',
      },
    }).then(r => r.text());
    const loadedCheerio = loadCheerio(page);
    loadedCheerio('div.ai-viewports').remove();
    return loadedCheerio('div.contenta').html() || '';
  }

  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    return await fetchApi(
      `${this.site}/wp-json/fiction/v1/novels/?novelstatus=&term=&page=${pageNo}&orderby=&order=&query=${encodeURIComponent(searchTerm)}`,
    )
      .then(r => r.json())
      .then(r => r.map(novel => this.parseNovelFromApi(novel)));
  }

  parseNovelFromApi(apiData) {
    return {
      name: stripTitle(apiData.title),
      path: apiData.permalink.split('/').at(-2),
      cover: apiData.novelImage,
      summary: apiData.novelIntro,
      status: apiData.novelStat,
      genres: apiData.novelGenres.join(','),
    };
  }
  async fetchChapters(id, pageNo) {
    let res = await fetchApi(
      `${this.site}/wp-json/fiction/v1/chapters/?category=${id}&page=${pageNo}&order=asc`,
    );
    let pages = parseInt(res.headers.get('x-wp-totalpages'), 10);
    let chs = await res.json();
    return pageNo == pages
      ? chs
      : Array.prototype.concat(chs, await this.fetchChapters(id, pageNo + 1));
  }

  resolveUrl = (path: string, isNovel?: boolean) =>
    this.site + '/series/' + path;

  filters = {
    status: {
      type: FilterTypes.Picker,
      label: 'Status',
      value: 'all',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Ongoing', value: 'Ongoing' },
        { label: 'Completed', value: 'Completed' },
        { label: 'Dropped', value: 'Dropped' },
        { label: 'Hiatus', value: 'Hiatus' },
      ],
    },

    sort: {
      type: FilterTypes.Picker,
      label: 'Sort',
      value: 'orderby=date&order=desc',
      options: [
        { label: 'Recent', value: 'orderby=date&order=desc' },
        { label: 'Older', value: 'orderby=date&order=asc' },
        { label: 'Title', value: 'orderby=title&order=asc' },
        { label: 'Title (Reversed)', value: 'orderby=title&order=desc' },
      ],
    },
    genres: {
      type: FilterTypes.CheckboxGroup,
      label: 'Genres',
      value: [],
      options: [
        { 'label': '1960s', 'value': '1960s' },
        { 'label': '1970s', 'value': '1970s' },
        { 'label': '1980s', 'value': '1980s' },
        { 'label': '1990s', 'value': '1990s' },
        { 'label': '80s Setting', 'value': '80s Setting' },
        { 'label': 'Abandoned', 'value': 'Abandoned' },
        { 'label': 'ABO', 'value': 'ABO' },
        { 'label': 'Action', 'value': 'Action' },
        { 'label': 'Adopted Children', 'value': 'Adopted Children' },
        { 'label': 'Adorable Baby', 'value': 'Adorable Baby' },
        { 'label': 'Adult', 'value': 'Adult' },
        { 'label': 'Adventure', 'value': 'Adventure' },
        {
          'label': 'Affectionate Relationship',
          'value': 'Affectionate Relationship',
        },
        { 'label': 'Age Gap', 'value': 'Age Gap' },
        { 'label': 'Alternate Universe', 'value': 'Alternate Universe' },
        { 'label': 'Alternate World', 'value': 'Alternate World' },
        { 'label': 'Amnesia', 'value': 'Amnesia' },
        { 'label': 'Ancient China', 'value': 'Ancient China' },
        { 'label': 'Ancient Farming', 'value': 'Ancient Farming' },
        { 'label': 'Ancient Romance', 'value': 'Ancient Romance' },
        { 'label': 'ancient style', 'value': 'ancient style' },
        { 'label': 'Ancient Times', 'value': 'Ancient Times' },
        { 'label': 'Angst', 'value': 'Angst' },
        { 'label': 'Apocalypse', 'value': 'Apocalypse' },
        { 'label': 'Arranged Marriage', 'value': 'Arranged Marriage' },
        { 'label': 'Beastmen', 'value': 'Beastmen' },
        { 'label': 'Beautiful Female Lead', 'value': 'Beautiful Female Lead' },
        { 'label': 'Beautiful protagonist', 'value': 'Beautiful protagonist' },
        { 'label': 'BG', 'value': 'BG' },
        { 'label': 'Bickering Couple', 'value': 'Bickering Couple' },
        { 'label': 'BL', 'value': 'BL' },
        { 'label': 'Book Transmigration', 'value': 'Book Transmigration' },
        { 'label': 'Boys Love', 'value': 'Boys Love' },
        { 'label': 'Business', 'value': 'Business' },
        { 'label': 'Business management', 'value': 'Business management' },
        { 'label': 'Bussiness', 'value': 'Bussiness' },
        { 'label': 'celebrity', 'value': 'celebrity' },
        { 'label': 'CEO', 'value': 'CEO' },
        { 'label': 'Character Growth', 'value': 'Character Growth' },
        { 'label': 'Charismatic MC', 'value': 'Charismatic MC' },
        { 'label': 'Charming Protagonist', 'value': 'Charming Protagonist' },
        { 'label': 'Childcare', 'value': 'Childcare' },
        { 'label': 'Childhood Love', 'value': 'Childhood Love' },
        { 'label': 'Comedy', 'value': 'Comedy' },
        { 'label': 'Contemporary', 'value': 'Contemporary' },
        { 'label': 'Cooking', 'value': 'Cooking' },
        { 'label': 'Countryside', 'value': 'Countryside' },
        { 'label': 'Crime', 'value': 'Crime' },
        { 'label': 'Crime Investigation', 'value': 'Crime Investigation' },
        { 'label': 'Crossing', 'value': 'Crossing' },
        { 'label': 'Cultivation', 'value': 'Cultivation' },
        { 'label': 'cute baby', 'value': 'cute baby' },
        { 'label': 'Cute Child', 'value': 'Cute Child' },
        { 'label': 'Cute Children', 'value': 'Cute Children' },
        { 'label': 'Cute Protagonist', 'value': 'Cute Protagonist' },
        { 'label': 'Dimensional Space', 'value': 'Dimensional Space' },
        { 'label': 'Doting Husband', 'value': 'Doting Husband' },
        { 'label': 'Doting Love Interest', 'value': 'Doting Love Interest' },
        { 'label': 'Double Purity', 'value': 'Double Purity' },
        { 'label': 'Drama', 'value': 'Drama' },
        { 'label': 'dual male lead', 'value': 'dual male lead' },
        { 'label': 'Ecchi', 'value': 'Ecchi' },
        { 'label': 'Educated Youth', 'value': 'Educated Youth' },
        { 'label': 'Entertainment', 'value': 'Entertainment' },
        {
          'label': 'Entertainment Industry',
          'value': 'Entertainment Industry',
        },
        { 'label': 'Era', 'value': 'Era' },
        { 'label': 'Era Farming', 'value': 'Era Farming' },
        { 'label': 'Era novel', 'value': 'Era novel' },
        { 'label': 'Era Romance', 'value': 'Era Romance' },
        { 'label': 'Face-Slapping', 'value': 'Face-Slapping' },
        { 'label': 'Familial Love', 'value': 'Familial Love' },
        { 'label': 'Family', 'value': 'Family' },
        { 'label': 'Family Bonds', 'value': 'Family Bonds' },
        { 'label': 'Family conflict', 'value': 'Family conflict' },
        { 'label': 'Family Doting', 'value': 'Family Doting' },
        { 'label': 'Family Drama', 'value': 'Family Drama' },
        { 'label': 'Family Life', 'value': 'Family Life' },
        { 'label': 'Fanfiction', 'value': 'Fanfiction' },
        { 'label': 'Fantasy', 'value': 'Fantasy' },
        { 'label': 'Fantasy Romance', 'value': 'Fantasy Romance' },
        { 'label': 'Farming', 'value': 'Farming' },
        { 'label': 'Farming life', 'value': 'Farming life' },
        { 'label': 'Fate and Destiny', 'value': 'Fate and Destiny' },
        { 'label': 'Female Lead', 'value': 'Female Lead' },
        { 'label': 'Female Protagonist', 'value': 'Female Protagonist' },
        { 'label': 'Flash Marriage', 'value': 'Flash Marriage' },
        { 'label': 'Free Love', 'value': 'Free Love' },
        { 'label': 'FREE NOVEL‼️', 'value': 'FREE NOVEL‼️' },
        { 'label': 'Futuristic', 'value': 'Futuristic' },
        { 'label': 'Game', 'value': 'Game' },
        { 'label': 'Game World', 'value': 'Game World' },
        { 'label': 'Gay', 'value': 'Gay' },
        { 'label': 'Gay Romance', 'value': 'Gay Romance' },
        { 'label': 'Gender Bender', 'value': 'Gender Bender' },
        { 'label': 'Getting Rich', 'value': 'Getting Rich' },
        { 'label': 'Ghost', 'value': 'Ghost' },
        { 'label': 'Gourmet Food', 'value': 'Gourmet Food' },
        { 'label': 'handsome male lead', 'value': 'handsome male lead' },
        { 'label': 'Happy Ending', 'value': 'Happy Ending' },
        { 'label': 'Harem', 'value': 'Harem' },
        { 'label': 'HE (Happy Ending)', 'value': 'HE (Happy Ending)' },
        { 'label': 'Heartwarming', 'value': 'Heartwarming' },
        { 'label': 'Historical', 'value': 'Historical' },
        { 'label': 'Historical BL', 'value': 'Historical BL' },
        { 'label': 'Historical Fiction', 'value': 'Historical Fiction' },
        { 'label': 'Historical Romance', 'value': 'Historical Romance' },
        { 'label': 'Horror', 'value': 'Horror' },
        { 'label': 'Humor', 'value': 'Humor' },
        { 'label': 'Interstellar', 'value': 'Interstellar' },
        { 'label': 'Isekai', 'value': 'Isekai' },
        { 'label': 'Josei', 'value': 'Josei' },
        { 'label': 'LGBT+', 'value': 'LGBT+' },
        { 'label': 'Light-hearted', 'value': 'Light-hearted' },
        { 'label': 'Lighthearted', 'value': 'Lighthearted' },
        { 'label': 'Livestream', 'value': 'Livestream' },
        { 'label': 'livestreaming', 'value': 'livestreaming' },
        { 'label': 'love', 'value': 'love' },
        { 'label': 'Love After Marriage', 'value': 'Love After Marriage' },
        { 'label': 'love at first sight', 'value': 'love at first sight' },
        { 'label': 'Love Confession', 'value': 'Love Confession' },
        { 'label': 'loyal male lead', 'value': 'loyal male lead' },
        { 'label': 'Lucky Protagonist', 'value': 'Lucky Protagonist' },
        { 'label': 'Magical Realism', 'value': 'Magical Realism' },
        { 'label': 'magical space', 'value': 'magical space' },
        { 'label': 'Male Protagonist', 'value': 'Male Protagonist' },
        { 'label': 'Marriage', 'value': 'Marriage' },
        { 'label': 'Marriage Before Love', 'value': 'Marriage Before Love' },
        { 'label': 'Martial Arts', 'value': 'Martial Arts' },
        { 'label': 'Mature', 'value': 'Mature' },
        { 'label': 'Mecha', 'value': 'Mecha' },
        { 'label': 'medical skills', 'value': 'medical skills' },
        { 'label': 'Metaphysics', 'value': 'Metaphysics' },
        { 'label': 'Military', 'value': 'Military' },
        { 'label': 'Military Husband', 'value': 'Military Husband' },
        { 'label': 'Military Marriage', 'value': 'Military Marriage' },
        { 'label': 'Military Romance', 'value': 'Military Romance' },
        { 'label': 'Military Wife', 'value': 'Military Wife' },
        { 'label': 'mind reading', 'value': 'mind reading' },
        { 'label': 'Modern', 'value': 'Modern' },
        { 'label': 'Modern Day', 'value': 'Modern Day' },
        { 'label': 'Modern Romance', 'value': 'Modern Romance' },
        { 'label': 'Modern/Contemporary', 'value': 'Modern/Contemporary' },
        { 'label': 'Mpreg', 'value': 'Mpreg' },
        { 'label': 'Mutated beast', 'value': 'Mutated beast' },
        { 'label': 'Mystery', 'value': 'Mystery' },
        { 'label': 'Mythical Beasts', 'value': 'Mythical Beasts' },
        { 'label': 'Obsessive love', 'value': 'Obsessive love' },
        { 'label': 'Older Love Interests', 'value': 'Older Love Interests' },
        { 'label': 'omegaverse', 'value': 'omegaverse' },
        { 'label': 'palace fighting', 'value': 'palace fighting' },
        { 'label': 'Pampering Wife', 'value': 'Pampering Wife' },
        { 'label': 'Period Novel', 'value': 'Period Novel' },
        { 'label': 'Poor Protagonist', 'value': 'Poor Protagonist' },
        { 'label': 'Poor to rich', 'value': 'Poor to rich' },
        { 'label': 'Power Couple', 'value': 'Power Couple' },
        { 'label': 'Power Fantasy', 'value': 'Power Fantasy' },
        { 'label': 'Powers', 'value': 'Powers' },
        { 'label': 'pregnancy', 'value': 'pregnancy' },
        { 'label': 'Psychological', 'value': 'Psychological' },
        { 'label': 'Pursuit of love', 'value': 'Pursuit of love' },
        { 'label': 'Quick transmigration', 'value': 'Quick transmigration' },
        { 'label': 'raising a baby', 'value': 'raising a baby' },
        { 'label': 'Rebirth', 'value': 'Rebirth' },
        { 'label': 'Reborn', 'value': 'Reborn' },
        { 'label': 'Redemption', 'value': 'Redemption' },
        { 'label': 'reincarnation', 'value': 'reincarnation' },
        { 'label': 'Revenge', 'value': 'Revenge' },
        { 'label': 'Rich CEO', 'value': 'Rich CEO' },
        { 'label': 'Rich Family', 'value': 'Rich Family' },
        { 'label': 'Romance', 'value': 'Romance' },
        { 'label': 'Romantic Comedy', 'value': 'Romantic Comedy' },
        { 'label': 'Royal Family', 'value': 'Royal Family' },
        { 'label': 'Royalty', 'value': 'Royalty' },
        { 'label': 'Rural', 'value': 'Rural' },
        { 'label': 'Rural life', 'value': 'Rural life' },
        { 'label': 'SameSexMarriage', 'value': 'SameSexMarriage' },
        {
          'label': 'Schemes and Conspiracies',
          'value': 'Schemes and Conspiracies',
        },
        { 'label': 'Scheming Female Lead', 'value': 'Scheming Female Lead' },
        { 'label': 'School Life', 'value': 'School Life' },
        { 'label': 'Sci-fi', 'value': 'Sci-fi' },
        { 'label': 'Second Chance', 'value': 'Second Chance' },
        { 'label': 'Secret Crush', 'value': 'Secret Crush' },
        { 'label': 'Secret Identity', 'value': 'Secret Identity' },
        { 'label': 'seinen', 'value': 'seinen' },
        { 'label': 'Short Story', 'value': 'Short Story' },
        { 'label': 'Shoujo', 'value': 'Shoujo' },
        { 'label': 'Shoujo Ai', 'value': 'Shoujo Ai' },
        { 'label': 'Shounen', 'value': 'Shounen' },
        { 'label': 'Shounen Ai', 'value': 'Shounen Ai' },
        { 'label': 'Showbiz', 'value': 'Showbiz' },
        { 'label': 'Slice of Life', 'value': 'Slice of Life' },
        { 'label': 'Slow Burn', 'value': 'Slow Burn' },
        { 'label': 'slow romance', 'value': 'slow romance' },
        { 'label': 'Slow-burn Romance', 'value': 'Slow-burn Romance' },
        { 'label': 'Smut', 'value': 'Smut' },
        { 'label': 'Space', 'value': 'Space' },
        { 'label': 'Space Ability', 'value': 'Space Ability' },
        { 'label': 'special abilities', 'value': 'special abilities' },
        { 'label': 'Sports', 'value': 'Sports' },
        { 'label': 'Stand-in Lover', 'value': 'Stand-in Lover' },
        { 'label': 'Strong Female Lead', 'value': 'Strong Female Lead' },
        { 'label': 'Strong Love Interest', 'value': 'Strong Love Interest' },
        { 'label': 'Supernatural', 'value': 'Supernatural' },
        { 'label': 'supporting characters', 'value': 'supporting characters' },
        {
          'label': 'Supporting Female Character',
          'value': 'Supporting Female Character',
        },
        { 'label': 'Survival', 'value': 'Survival' },
        { 'label': 'Suspense', 'value': 'Suspense' },
        { 'label': 'Sweet', 'value': 'Sweet' },
        { 'label': 'Sweet Doting', 'value': 'Sweet Doting' },
        { 'label': 'Sweet Love', 'value': 'Sweet Love' },
        { 'label': 'Sweet Marriage', 'value': 'Sweet Marriage' },
        { 'label': 'Sweet Pampering', 'value': 'Sweet Pampering' },
        { 'label': 'sweet pet', 'value': 'sweet pet' },
        { 'label': 'Sweet Revenge', 'value': 'Sweet Revenge' },
        { 'label': 'Sweet Romance', 'value': 'Sweet Romance' },
        { 'label': 'Sweet Story', 'value': 'Sweet Story' },
        { 'label': 'SweetNovel', 'value': 'SweetNovel' },
        { 'label': 'system', 'value': 'system' },
        { 'label': 'Thriller', 'value': 'Thriller' },
        { 'label': 'Time Travel', 'value': 'Time Travel' },
        { 'label': 'Tragedy', 'value': 'Tragedy' },
        { 'label': 'Transformation', 'value': 'Transformation' },
        { 'label': 'Transmigration', 'value': 'Transmigration' },
        {
          'label': 'transmigration into a novel',
          'value': 'transmigration into a novel',
        },
        {
          'label': 'Transmigration into Books',
          'value': 'Transmigration into Books',
        },
        {
          'label': 'Traveling through space',
          'value': 'Traveling through space',
        },
        {
          'label': 'Traveling through time',
          'value': 'Traveling through time',
        },
        { 'label': 'Ugly', 'value': 'Ugly' },
        { 'label': 'Unlimited Flow', 'value': 'Unlimited Flow' },
        { 'label': 'Urban', 'value': 'Urban' },
        { 'label': 'urban life', 'value': 'urban life' },
        { 'label': 'Village Life', 'value': 'Village Life' },
        { 'label': 'Villain', 'value': 'Villain' },
        { 'label': 'Weak to Strong', 'value': 'Weak to Strong' },
        { 'label': 'wealthy characters', 'value': 'wealthy characters' },
        { 'label': 'Wealthy Family', 'value': 'Wealthy Family' },
        { 'label': 'Wuxia', 'value': 'Wuxia' },
        { 'label': 'Xianxia', 'value': 'Xianxia' },
        { 'label': 'Xuanhuan', 'value': 'Xuanhuan' },
        { 'label': 'yandere', 'value': 'yandere' },
        { 'label': 'Yaoi', 'value': 'Yaoi' },
        { 'label': 'Younger Love Interest', 'value': 'Younger Love Interest' },
        { 'label': 'Yuri', 'value': 'Yuri' },
        { 'label': 'Zombie', 'value': 'Zombie' },
        {
          'label': '🔓 Completely Unlocked 🔓',
          'value': '🔓 Completely Unlocked 🔓',
        },
      ],
    },
  } satisfies Filters;
}

export default new ShanghaiFantasyPlugin();

function stripTitle(title, trim = true) {
  title = title.replace(
    /&#(\d+);|&#x([0-9a-fA-F]+);|&[a-zA-Z0-9]+;/g,
    (m, d, h) => {
      if (d !== undefined) return String.fromCharCode(parseInt(d, 10));
      if (h !== undefined) return String.fromCharCode(parseInt(h, 16));
      return m;
    },
  );
  if (trim) title = title.replace(/^[“”‘.]|[“”‘.]{0,2}$/g, '');
  return title;
}
//paste into console on site to load
async function getUpdatedGenres(pageNo = 1) {
  const res = await fetch(
    `https://shanghaifantasy.com/wp-json/wp/v2/genre?page=${pageNo}&per_page=100`,
  );
  let data = await res.json();
  const pages = parseInt(res.headers.get('x-wp-totalpages'), 10);
  if (pageNo < pages)
    data = Array.prototype.concat(data, await getUpdatedGenres(pageNo + 1));
  const genreData = data.map(g => ({ label: g.name, value: g.id.toString() }));
  console.log(JSON.stringify(genreData));
}
