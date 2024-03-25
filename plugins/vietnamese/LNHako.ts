import { CheerioAPI, load as parseHTML } from 'cheerio';
import { Parser } from 'htmlparser2';
import { fetchFile } from '@libs/fetch';
import { Plugin } from '@typings/plugin';
import { isUrlAbsolute } from '@libs/isAbsoluteUrl';
import { NovelStatus } from '@libs/novelStatus';
import { FilterTypes, Filters } from '@libs/filterInputs';

class HakoPlugin implements Plugin.PluginBase {
  id = 'ln.hako';
  name = 'Hako';
  icon = 'src/vi/hakolightnovel/icon.png';
  site = 'https://ln.hako.vn';
  version = '1.0.1';
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
            if (attribs['class']?.includes('thumb-item-flow')) {
              isParsingNovel = true;
            }
            if (isParsingNovel) {
              if (attribs['class']?.includes('series-title')) {
                isGettingUrl = true;
              }
              if (attribs['class']?.includes('img-in-ratio')) {
                tempNovel.cover = attribs['data-bg'];
              }
              if (isGettingUrl && name === 'a') {
                tempNovel.name = attribs['title'];
                tempNovel.path = attribs['href'];
                novels.push(tempNovel);
                tempNovel = {} as Plugin.NovelItem; // re-assign new reference
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
  async popularNovels(
    pageNo: number,
    {
      showLatestNovels,
      filters,
    }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    let link = this.site + '/danh-sach';
    if (filters) {
      if (filters.alphabet.value) {
        link += '/' + filters.alphabet.value;
      }
      const params = new URLSearchParams();
      for (const novelType of filters.type.value) {
        params.append(novelType, '1');
      }
      for (const status of filters.status.value) {
        params.append(status, '1');
      }
      params.append('sapxep', filters.sort.value);
      link += '?' + params.toString() + '&page=' + pageNo;
    } else {
      link += '?page=' + pageNo;
    }
    return this.parseNovels(link);
  }
  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    return fetch(this.site + novelPath)
      .then(res => res.text())
      .then(html => {
        const novel: Plugin.SourceNovel = {
          path: novelPath,
          name: '',
          author: '',
          artist: '',
          summary: '',
          genres: '',
          status: '',
        };
        let isReadingName = 0;
        let isReadingSummary = 0;
        let isReadingGenre = 0;
        let isReadingInfo = 0;
        let isReadingInfoValue = 0;
        let isParsingVolume = false;
        let isReadingVolume = false;
        let currentVolume = '';
        let isParsingChapterList = false;
        let num = 0,
          part = 0;
        let isReadingChapterTime = false;
        const chapters: Plugin.ChapterItem[] = [];
        let tempChapter = {} as Plugin.ChapterItem;
        const parser = new Parser({
          onopentag(name, attribs) {
            if (attribs['class'] === 'series-name') {
              isReadingName = 1;
            } else if (
              !novel.cover &&
              attribs['class']?.includes('img-in-ratio')
            ) {
              const background = attribs['style'];
              if (background) {
                novel.cover = background.substring(
                  background.indexOf('http'),
                  background.length - 2,
                );
              }
            } else if (attribs['class'] === 'summary-content') {
              isReadingSummary = 1;
            } else if (attribs['class'] === 'series-gerne-item') {
              isReadingGenre = 1;
            } else if (attribs['class'] === 'info-item') {
              isReadingInfo += 1;
            } else if (attribs['class']?.includes('volume-list')) {
              isParsingVolume = true;
              num = 0;
              part = 1;
            } else if (isParsingVolume && attribs['class'] === 'sect-title') {
              isReadingVolume = true;
              currentVolume = '';
            } else if (isParsingVolume && name === 'ul') {
              isParsingChapterList = true;
            } else if (
              isParsingChapterList &&
              name === 'a' &&
              attribs['title'] !== null
            ) {
              const chapterName = attribs['title'];
              let chapterNumber = Number(
                chapterName.match(/Chương\s*(\d+)/i)?.[1],
              );
              if (chapterNumber) {
                if (num === chapterNumber) {
                  chapterNumber = num + part / 10;
                  part += 1;
                } else {
                  num = chapterNumber;
                  part = 1;
                }
              } else {
                chapterNumber = num + part / 10;
                part++;
              }
              tempChapter = {
                path: attribs['href'],
                name: chapterName,
                page: currentVolume,
                chapterNumber: chapterNumber,
              };
            } else if (
              isParsingChapterList &&
              attribs['class'] === 'chapter-time'
            ) {
              isReadingChapterTime = true;
            }
            if (isReadingName === 1 && name === 'a') {
              isReadingName = 2;
            }
            if (isReadingInfo !== 0 && name === 'a') {
              isReadingInfoValue = 1;
            }
          },
          ontext(data) {
            if (isReadingName === 2) {
              novel.name += data;
            } else if (isReadingSummary !== 0) {
              if (isReadingSummary === 2) {
                novel.summary += '\n' + data;
                isReadingSummary = 1;
              } else {
                novel.summary += data;
              }
            } else if (isReadingGenre === 1) {
              novel.genres += data;
            } else if (isReadingInfoValue === 1 && isReadingInfo <= 3) {
              if (isReadingInfo === 1) {
                novel.author += data;
              } else if (isReadingInfo === 2) {
                novel.artist += data;
              } else if (isReadingInfo === 3) {
                novel.status += data;
              }
            } else if (isReadingVolume) {
              currentVolume += data.trim();
            } else if (isReadingChapterTime) {
              const chapterTime = data.split('/').map(x => Number(x));
              tempChapter.releaseTime = new Date(
                chapterTime[2],
                chapterTime[1],
                chapterTime[0],
              ).toISOString();
              chapters.push(tempChapter);
              isReadingChapterTime = false;
              tempChapter = {} as Plugin.ChapterItem;
            }
          },
          onclosetag(name) {
            if (isReadingName === 2) {
              isReadingName = 0;
            } else if (isReadingSummary !== 0) {
              if (name !== 'div') {
                isReadingSummary = 2;
              } else {
                isReadingSummary = 0;
              }
            } else if (isReadingGenre === 1) {
              isReadingGenre = 0;
              novel.genres += ',';
            } else if (isReadingVolume) {
              isReadingVolume = false;
            } else if (isReadingChapterTime) isReadingChapterTime = false;
            if (name === 'ul') {
              isParsingChapterList = false;
            }
            if (isReadingInfoValue === 1) {
              isReadingInfoValue = 0;
              if (isReadingInfo === 3) {
                isReadingInfo = 0;
              }
            }
            if (name === 'section') {
              isParsingVolume = false;
            }
          },
        });

        parser.write(html);
        parser.end();
        novel.chapters = chapters;
        switch (novel.status?.trim()) {
          case 'Đang tiến hành':
            novel.status = NovelStatus.Ongoing;
            break;
          case 'Tạm ngưng':
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
    const result = await fetch(this.site + chapterPath);
    const body = await result.text();

    const loadedCheerio = parseHTML(body);

    const chapterText = loadedCheerio('#chapter-content').html() || '';

    return chapterText;
  }
  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    const url =
      this.site + '/tim-kiem?keywords=' + searchTerm + '&page=' + pageNo;
    return this.parseNovels(url);
  }
  async fetchImage(url: string): Promise<string | undefined> {
    const headers = {
      Referer: 'https://ln.hako.vn',
    };
    return await fetchFile(url, { headers: headers });
  }
  filters = {
    alphabet: {
      type: FilterTypes.Picker,
      value: '',
      label: 'Chữ cái',
      options: [
        { label: 'Tất cả', value: '' },
        { label: 'Khác', value: 'khac' },
        { label: 'A', value: 'a' },
        { label: 'B', value: 'b' },
        { label: 'C', value: 'c' },
        { label: 'D', value: 'd' },
        { label: 'E', value: 'e' },
        { label: 'F', value: 'f' },
        { label: 'G', value: 'g' },
        { label: 'H', value: 'h' },
        { label: 'I', value: 'i' },
        { label: 'J', value: 'j' },
        { label: 'K', value: 'k' },
        { label: 'L', value: 'l' },
        { label: 'M', value: 'm' },
        { label: 'N', value: 'n' },
        { label: 'O', value: 'o' },
        { label: 'P', value: 'p' },
        { label: 'Q', value: 'q' },
        { label: 'R', value: 'r' },
        { label: 'S', value: 's' },
        { label: 'T', value: 't' },
        { label: 'U', value: 'u' },
        { label: 'V', value: 'v' },
        { label: 'W', value: 'w' },
        { label: 'X', value: 'x' },
        { label: 'Y', value: 'y' },
        { label: 'Z', value: 'z' },
      ],
    },
    type: {
      type: FilterTypes.CheckboxGroup,
      label: 'Phân loại',
      value: [],
      options: [
        { label: 'Truyện dịch', value: 'truyendich' },
        { label: 'Truyện sáng tác', value: 'sangtac' },
        { label: 'Convert', value: 'convert' },
      ],
    },
    status: {
      type: FilterTypes.CheckboxGroup,
      label: 'Tình trạng',
      value: [],
      options: [
        { label: 'Đang tiến hành', value: 'dangtienhanh' },
        { label: 'Tạm ngưng', value: 'tamngung' },
        { label: 'Đã hoàn thành', value: 'hoanthanh' },
      ],
    },
    sort: {
      type: FilterTypes.Picker,
      label: 'Sắp xếp',
      value: 'top',
      options: [
        { label: 'A-Z', value: 'tentruyen' },
        { label: 'Z-A', value: 'tentruyenza' },
        { label: 'Mới cập nhật', value: 'capnhat' },
        { label: 'Truyện mới', value: 'truyenmoi' },
        { label: 'Theo dõi', value: 'theodoi' },
        { label: 'Top toàn thời gian', value: 'top' },
        { label: 'Top tháng', value: 'topthang' },
        { label: 'Số từ', value: 'sotu' },
      ],
    },
  } satisfies Filters;
}

export default new HakoPlugin();
