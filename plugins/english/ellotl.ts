import { Parser } from 'htmlparser2';
import { fetchFile } from '@libs/fetch';
import { Plugin } from '@typings/plugin';
import { NovelStatus } from '@libs/novelStatus';
import { FilterTypes, Filters } from '@libs/filterInputs';

class ElloTL implements Plugin.PluginBase {
  id = 'ellotl';
  name = 'ElloTL';
  icon = 'src/en/ellotl/icon.png';
  site = 'https://ellotl.com';
  version = '1.0.0';

  parseNovels(url: string) {
    return fetch(url)
      .then(res => res.text())
      .then(html => {
        const novels: Plugin.NovelItem[] = [];
        let tempNovel = {} as Plugin.NovelItem;
        let isGettingUrl = false;
        let isParsingNovel = false;
        const parser = new Parser({
          onopentag(name, attribs) {
            if (attribs['class']?.includes('maindet')) {
              isParsingNovel = true;
            }
            if (isParsingNovel) {
              if (name === 'a' && attribs['class']?.includes('tip')) {
                isGettingUrl = true;
              }
              if (isGettingUrl && name === 'a') {
                if (attribs['title'] !== '') {
                  tempNovel.name = attribs['title'];
                } else {
                  tempNovel.name = attribs['oldtitle'];
                }
                tempNovel.path = attribs['href'];
              }
              if (
                name === 'img' &&
                attribs['class']?.includes('wp-post-image')
              ) {
                tempNovel.cover = attribs['src'];
                novels.push(tempNovel);
                tempNovel = {} as Plugin.NovelItem;
                isGettingUrl = false;
                isParsingNovel = false;
              }
            }
          },
        });
        parser.write(html);
        parser.end();
        return novels;
      });
  }

  popularNovels(
    pageNo: number,
    {
      showLatestNovels,
      filters,
    }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    let link = this.site + '/series';
    if (filters) {
      const params = new URLSearchParams();
      for (const genre of filters.genres.value) {
        params.append('genre[]', genre);
      }
      for (const type of filters.type.value) {
        params.append('type[]', type);
      }
      params.append('status', filters.status.value);
      params.append('order', filters.sort.value);
      link += '/?' + params.toString() + '&page=' + pageNo;
    } else {
      link += '/?page=' + pageNo;
    }
    return this.parseNovels(link);
  }

  parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    return fetch(this.site + novelPath)
      .then(res => res.text())
      .then(html => {
        const novel: Plugin.SourceNovel = {
          path: novelPath,
          name: '',
          cover: '',
          genres: '',
          summary: '',
          author: '',
          status: '',
          chapters: [] as Plugin.ChapterItem[],
          latestChapter: {} as Plugin.ChapterItem,
        };
        let isReadingName = false;
        let isParsingGenreList = false;
        let isReadingGenre = false;
        let isReadingSummary = 0;
        let isParsingInfo = false;
        let isReadingInfo = false;
        let isReadingInfoValue = 0;
        let isReadingChapterList = false;
        let isReadingChapterInfo = 0;
        const chapters: Plugin.ChapterItem[] = [];
        let tempChapter = {} as Plugin.ChapterItem;
        const parser = new Parser({
          onopentag(name, attribs) {
            if (!novel.name && attribs['class']?.includes('entry-title')) {
              isReadingName = true; // start reading name
            } else if (
              !novel.cover &&
              attribs['class']?.includes('wp-post-image')
            ) {
              novel.cover = attribs['src']; // get cover image
            } else if (attribs['class']?.includes('genxed')) {
              isParsingGenreList = true; // start parsing genre list
            } else if (isParsingGenreList && name === 'a') {
              isReadingGenre = true; // start reading genre
            } else if (attribs['class'].includes('entry-content')) {
              isReadingSummary = 1; // start reading summary
            } else if (isReadingSummary === 1 && name === 'br') {
              isReadingSummary = 2; // add a newline
            } else if (attribs['class'].includes('spe')) {
              isParsingInfo = true; // start parsing info
            } else if (isParsingInfo && name === 'span') {
              isReadingInfo = true; // start reading info
            } else if (isReadingInfo && name === 'b') {
              isReadingInfoValue = 1; // start reading info value
            } else if (name === 'ul') {
              isReadingChapterList = true; // start reading chapter list
            } else if (isReadingChapterList && name === 'div') {
              if (attribs['class'].includes('epl-title')) {
                isReadingChapterInfo = 1; // start reading chapter title
              } else if (attribs['class'].includes('epl-date')) {
                isReadingChapterInfo = 2; // start reading chapter date
              } else if (attribs['class'].includes('epl-num')) {
                isReadingChapterInfo = 3; // start reading chapter number
              }
            }
          },
          ontext(data) {
            if (isReadingName) {
              novel.name += data;
              console.log(novel.name);
            } else if (isReadingGenre) {
              novel.genres += data;
            } else if (isReadingSummary === 1) {
              novel.summary += data;
            } else if (isReadingInfoValue === 1) {
              if (data === 'Author:') {
                isReadingInfoValue = 2;
              } else if (data === 'Status:') {
                isReadingInfoValue = 3;
              }
            } else if (isReadingInfoValue >= 2) {
              if (isReadingInfoValue === 2) {
                novel.author += data;
              } else if (isReadingInfoValue === 3) {
                novel.status = data;
              }
            } else if (isReadingChapterInfo !== 0) {
              if (isReadingChapterInfo === 1) {
                tempChapter.name = data;
              } else if (isReadingChapterInfo === 2) {
                tempChapter.releaseTime = new Date(data).toISOString();
              } else if (isReadingChapterInfo === 3 && /\d/.test(data)) {
                tempChapter.chapterNumber = parseInt(data.split(' ')[1]);
              }
            }
          },
          onclosetag(name) {
            if (isReadingName) {
              isReadingName = false; // stop reading name
            } else if (isReadingGenre) {
              isReadingGenre = false; // stop reading genre
              novel.genres += ',';
            } else if (isParsingGenreList) {
              isParsingGenreList = false; // stop parsing genre list
            } else if (isReadingSummary !== 0) {
              if (isReadingSummary === 2) {
                isReadingSummary = 1;
                novel.summary += '\n';
              } else if (isReadingSummary === 1 && name === 'div') {
                isReadingSummary = 0;
              }
            } else if (isReadingInfo && name === 'span') {
              isReadingInfo = false;
              isReadingInfoValue = 0;
            } else if (isParsingInfo && name === 'div') {
              isParsingInfo = false;
            } else if (isReadingChapterInfo >= 1 && name === 'div') {
              isReadingChapterInfo = 0;
            } else if (isReadingChapterList && name === 'li') {
              isReadingChapterInfo = 0;
              chapters.push(tempChapter);
              tempChapter = {} as Plugin.ChapterItem;
            } else if (isReadingChapterList && name === 'ul') {
              isReadingChapterList = false;
            }
          },
        });
        parser.write(html);
        parser.end();
        novel.latestChapter = chapters[0];
        switch (novel.status?.trim()) {
          case 'Ongoing':
            novel.status = NovelStatus.Ongoing;
            break;
          case 'Hiatus':
            novel.status = NovelStatus.OnHiatus;
            break;
          case 'Completed':
            novel.status = NovelStatus.Completed;
            break;
          default:
            novel.status = NovelStatus.Unknown;
        }
        novel.genres = novel.genres?.replace(/,*\s*$/, '');
        return novel;
      });
  }

  async parseChapter(chapterPath: string): Promise<string> {
    return fetch(this.site + chapterPath)
      .then(res => res.text())
      .then(
        html =>
          html.match(
            /(<div id="chapter-content".+?>[^]+)<div style="text-align: center;/,
          )?.[1] || 'Không tìm thấy nội dung',
      );
  }
  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    let novels: Plugin.NovelItem[] = [];

    // get novels using the search term

    return novels;
  }

  async fetchImage(url: string): Promise<string | undefined> {
    // if your plugin has images and they won't load
    // this is the function to fiddle with
    return fetchFile(url);
  }

  filters = {
    genres: {
      type: FilterTypes.CheckboxGroup,
      label: 'Genres',
      value: [],
      options: [
        { label: 'Action', value: 'action' },
        { label: 'Adventure', value: 'adventure' },
        { label: 'Comedy', value: 'comedy' },
        { label: 'Drama', value: 'drama' },
        { label: 'Ecchi', value: 'ecchi' },
        { label: 'Fantasy', value: 'fantasy' },
        { label: 'Gender Bender', value: 'gender-bender' },
        { label: 'Harem', value: 'harem' },
        { label: 'Martial Arts', value: 'martial-arts' },
        { label: 'Mature', value: 'mature' },
        { label: 'Mystery', value: 'mystery' },
        { label: 'Psychological', value: 'psychological' },
        { label: 'Romance', value: 'romance' },
        { label: 'School Life', value: 'school-life' },
        { label: 'Seinen', value: 'seinen' },
        { label: 'Shounen', value: 'shounen' },
        { label: 'Slice of Life', value: 'slice-of-life' },
        { label: 'Supernatural', value: 'supernatural' },
        { label: 'Tragedy', value: 'tragedy' },
      ],
    },
    type: {
      type: FilterTypes.CheckboxGroup,
      label: 'Type',
      value: [],
      options: [
        { label: 'Japanese Web Novel', value: 'japanese-web-novel' },
        { label: 'Korean Web Novel', value: 'korean-web-novel' },
        { label: 'Light Novel (JP)', value: 'light-novel-jp' },
        { label: 'Web Novel', value: 'web-novel' },
      ],
    },
    status: {
      type: FilterTypes.Picker,
      label: 'Status',
      value: '',
      options: [
        { label: 'All', value: '' },
        { label: 'Ongoing', value: 'ongoing' },
        { label: 'Hiatus', value: 'hiatus' },
        { label: 'Completed', value: 'completed' },
      ],
    },
    sort: {
      type: FilterTypes.Picker,
      label: 'Sort',
      value: '',
      options: [
        { label: 'Default', value: '' },
        { label: 'A-Z', value: 'title' },
        { label: 'Z-A', value: 'titlereverse' },
        { label: 'Latest Update', value: 'update' },
        { label: 'Latest Added', value: 'latest' },
        { label: 'Popular', value: 'popular' },
        { label: 'Rating', value: 'rating' },
      ],
    },
  } satisfies Filters;
}

export default new ElloTL();
