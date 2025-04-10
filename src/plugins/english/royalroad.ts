import { Parser } from 'htmlparser2';
import { fetchApi } from '@libs/fetch';
import { Plugin } from '@typings/plugin';
import { Filters, FilterTypes } from '@libs/filterInputs';
import { NovelStatus } from '@libs/novelStatus';
import { isUrlAbsolute } from '@libs/isAbsoluteUrl';

class RoyalRoad implements Plugin.PluginBase {
  id = 'royalroad';
  name = 'Royal Road';
  version = '2.2.1';
  icon = 'src/en/royalroad/icon.png';
  site = 'https://www.royalroad.com/';

  parseNovels(html: string) {
    const baseUrl = this.site;
    const novels: Plugin.NovelItem[] = [];
    let tempNovel = {} as Plugin.NovelItem;
    let isParsingNovel = false;
    const parser = new Parser({
      onopentag(name, attribs) {
        if (attribs['class']?.includes('fiction-list-item')) {
          isParsingNovel = true;
        }
        if (isParsingNovel) {
          if (name === 'a') {
            tempNovel.path = attribs['href'].split('/').slice(1, 3).join('/');
          }
          if (name === 'img') {
            tempNovel.name = attribs['alt'];
            tempNovel.cover = attribs['src'];
            if (tempNovel.cover && !isUrlAbsolute(tempNovel.cover)) {
              tempNovel.cover = baseUrl + tempNovel.cover.slice(1);
            }
          }
          if (tempNovel.path && tempNovel.name) {
            novels.push(tempNovel);
            tempNovel = {} as Plugin.NovelItem;
          }
        }
      },
      onclosetag(name) {
        if (name === 'h2') {
          isParsingNovel = false;
        }
      },
    });
    parser.write(html);
    parser.end();
    return novels;
  }

  async popularNovels(
    page: number,
    {
      filters,
      showLatestNovels,
    }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    const params = new URLSearchParams({
      page: page.toString(),
    });
    if (showLatestNovels) {
      params.append('orderBy', 'last_update');
    }
    if (!filters) filters = this.filters || {};
    for (const key in filters) {
      if (filters[key as keyof typeof filters].value === '') continue;
      if (key === 'genres' || key === 'tags' || key === 'content_warnings') {
        if (filters[key].value.include) {
          for (const include of filters[key].value.include) {
            params.append('tagsAdd', include);
          }
        }
        if (filters[key].value.exclude) {
          for (const exclude of filters[key].value.exclude) {
            params.append('tagsRemove', exclude);
          }
        }
      } else {
        params.append(key, String(filters[key as keyof typeof filters].value));
      }
    }

    const link = `${this.site}fictions/search?${params.toString()}`;
    const body = await fetchApi(link).then(r => r.text());

    return this.parseNovels(body);
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const result = await fetchApi(this.site + novelPath);
    const html = await result.text();
    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: '',
      author: '',
      chapters: [],
    };
    const baseUrl = this.site;

    enum ParsingState {
      Idle,
      InTitle,
      InAuthor,
      InDescription,
      InTags,
      InTagLink,
      InStatusSpan,
      InScript,
    }

    let currentState: ParsingState = ParsingState.Idle;
    let scriptContent = '';
    let statusText = '';
    let statusSpanCounter = 0;
    const genreArray: string[] = [];
    let chapterJson: ChapterEntry[] = [];
    let volumeJson: VolumeEntry[] = [];

    const parser = new Parser({
      onopentag(name, attribs) {
        switch (name) {
          case 'h1':
            currentState = ParsingState.InTitle;
            break;
          case 'a':
            if (
              attribs['href']?.startsWith('/profile/') &&
              novel.author === ''
            ) {
              currentState = ParsingState.InAuthor;
            } else if (currentState === ParsingState.InTags) {
              currentState = ParsingState.InTagLink;
            }
            break;
          case 'div':
            if (attribs['class'] === 'description') {
              currentState = ParsingState.InDescription;
              novel.summary = '';
            }
            break;
          case 'span':
            if (attribs['class']?.includes('tags')) {
              currentState = ParsingState.InTags;
            } else if (attribs['class']?.includes('label-sm')) {
              statusSpanCounter++;
              if (statusSpanCounter === 2) {
                currentState = ParsingState.InStatusSpan;
                statusText = '';
              }
            }
            break;
          case 'img':
            if (attribs['class']?.includes('thumbnail')) {
              novel.cover = attribs['src'];
              if (novel.cover && !isUrlAbsolute(novel.cover)) {
                novel.cover = baseUrl + novel.cover.slice(1);
              }
            }
            break;
          case 'script':
            currentState = ParsingState.InScript;
            scriptContent = '';
            break;
        }
      },
      ontext(text) {
        const trimmedText = text.trim();
        if (!trimmedText && currentState !== ParsingState.InScript) return;

        switch (currentState) {
          case ParsingState.InTitle:
            novel.name += text;
            break;
          case ParsingState.InAuthor:
            novel.author = trimmedText;
            break;
          case ParsingState.InDescription:
            novel.summary += text;
            break;
          case ParsingState.InStatusSpan:
            statusText = trimmedText;
            break;
          case ParsingState.InTagLink:
            genreArray.push(trimmedText);
            break;
          case ParsingState.InScript:
            scriptContent += text;
            break;
        }
      },
      onclosetag(name) {
        switch (name) {
          case 'h1':
            if (currentState === ParsingState.InTitle) {
              novel.name = novel.name.trim();
              currentState = ParsingState.Idle;
            }
            break;
          case 'a':
            if (currentState === ParsingState.InTagLink) {
              currentState = ParsingState.InTags;
            } else if (currentState === ParsingState.InAuthor) {
              currentState = ParsingState.Idle;
            }
            break;
          case 'div':
            if (currentState === ParsingState.InDescription) {
              if (novel.summary) {
                novel.summary = novel.summary.trim();
              }
              currentState = ParsingState.Idle;
            }
            break;
          case 'span':
            if (currentState === ParsingState.InTags) {
              novel.genres = genreArray.join(', ');
              currentState = ParsingState.Idle;
            } else if (currentState === ParsingState.InStatusSpan) {
              currentState = ParsingState.Idle;
            }
            break;
          case 'script':
            if (currentState === ParsingState.InScript) {
              currentState = ParsingState.Idle;
              const chapterMatch = scriptContent.match(
                /window\.chapters\s*=\s*(\[.*?\]);/,
              );
              const volumeMatch = scriptContent.match(
                /window\.volumes\s*=\s*(\[.*?\]);/,
              );

              if (chapterMatch?.[1]) {
                chapterJson = JSON.parse(chapterMatch[1]);
              }
              if (volumeMatch?.[1]) {
                volumeJson = JSON.parse(volumeMatch[1]);
              }
            }
            break;
        }
      },
      onend() {
        switch (statusText) {
          case 'ONGOING':
            novel.status = NovelStatus.Ongoing;
            break;
          case 'HIATUS':
            novel.status = NovelStatus.OnHiatus;
            break;
          case 'COMPLETED':
            novel.status = NovelStatus.Completed;
            break;
          default:
            novel.status = NovelStatus.Unknown;
        }

        novel.chapters = chapterJson.map((chapter: ChapterEntry) => {
          const matchingVolume = volumeJson.find(
            (volume: VolumeEntry) => volume.id === chapter.volumeId,
          );
          return {
            name: chapter.title,
            path: (() => {
              const parts = chapter.url.split('/');
              return `${parts[1]}/${parts[2]}/${parts[4]}/${parts[5]}`;
            })(),
            releaseTime: chapter.date,
            chapterNumber: chapter?.order,
            page: matchingVolume?.title,
          };
        });
      },
      onerror(error) {
        console.error('HTML Parser Error:', error);
      },
    });

    parser.write(html);
    parser.end();

    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const result = await fetchApi(this.site + chapterPath);
    const html = await result.text();

    enum ChapterParsingState {
      Idle,
      InNote,
      InChapter,
      InHidden,
    }

    let currentState = ChapterParsingState.Idle;
    let stateDepth = 0;
    let depth = 0;
    let isBeforeNote = true;

    let chapterHtml = '';
    let notesHtml = '';
    let beforeNotes = '';
    let afterNotes = '';

    const match = html.match(/<style>\n\s+.(.+?){[^.]+?display: none;/);
    const hiddenClass = match?.[1]?.trim();

    const parser = new Parser({
      onopentag(name, attribs) {
        depth++;

        if (hiddenClass && attribs['class']?.includes(hiddenClass)) {
          currentState = ChapterParsingState.InHidden;
          stateDepth = depth;
          return;
        }
        if (currentState === ChapterParsingState.Idle) {
          if (attribs['class']?.includes('chapter-content')) {
            currentState = ChapterParsingState.InChapter;
            stateDepth = depth;
            isBeforeNote = false;
            return;
          } else if (attribs['class']?.includes('author-note-portlet')) {
            currentState = ChapterParsingState.InNote;
            stateDepth = depth;
            notesHtml = '';
            return;
          }
        }

        if (
          currentState === ChapterParsingState.InChapter ||
          currentState === ChapterParsingState.InNote
        ) {
          let tag = `<${name}`;
          for (const attr in attribs) {
            tag += ` ${attr}="${attribs[attr].replace(/"/g, '&quot;')}"`;
          }
          tag += '>';
          if (currentState === ChapterParsingState.InChapter) {
            chapterHtml += tag;
          } else if (currentState === ChapterParsingState.InNote) {
            notesHtml += tag;
          }
        }
      },
      ontext(text) {
        switch (currentState) {
          case ChapterParsingState.InChapter:
            chapterHtml += text;
            break;
          case ChapterParsingState.InNote:
            notesHtml += text;
            break;
        }
      },
      onclosetag(name) {
        if (depth === stateDepth) {
          switch (currentState) {
            case ChapterParsingState.InHidden:
              currentState = ChapterParsingState.InChapter;
              return;
            case ChapterParsingState.InChapter:
              currentState = ChapterParsingState.Idle;
              return;
            case ChapterParsingState.InNote:
              const fullNote = `<div class="author-note-${
                isBeforeNote ? 'before' : 'after'
              }">${notesHtml}</div>`;
              if (isBeforeNote) {
                beforeNotes += fullNote + '\n';
              } else {
                afterNotes += fullNote + '\n';
              }
              currentState = ChapterParsingState.Idle;
              return;
          }
        }

        if (
          currentState === ChapterParsingState.InChapter ||
          currentState === ChapterParsingState.InNote
        ) {
          const closingTag = `</${name}>`;
          if (currentState === ChapterParsingState.InChapter) {
            chapterHtml += closingTag;
          } else {
            notesHtml += closingTag;
          }
        }
        depth--;
      },
      onerror(error) {
        console.error('HTML Parser Error:', error);
      },
    });
    parser.write(html);
    parser.end();
    return [beforeNotes.trim(), chapterHtml.trim(), afterNotes.trim()]
      .filter(Boolean)
      .join('\n');
  }

  async searchNovels(
    searchTerm: string,
    page: number,
  ): Promise<Plugin.NovelItem[]> {
    const params = new URLSearchParams({
      page: page.toString(),
      title: searchTerm,
      globalFilters: 'true',
    });
    const searchUrl = `${this.site}fictions/search?${params.toString()}`;

    const body = await fetchApi(searchUrl).then(r => r.text());
    return this.parseNovels(body);
  }

  filters = {
    'keyword': {
      'type': FilterTypes.TextInput,
      'label': 'Keyword (title or description)',
      'value': '',
    },
    'author': {
      'type': FilterTypes.TextInput,
      'label': 'Author',
      'value': '',
    },
    'genres': {
      'type': FilterTypes.ExcludableCheckboxGroup,
      'label': 'Genres',
      'value': {
        'include': [],
        'exclude': [],
      },
      'options': [
        {
          'label': 'Action',
          'value': 'action',
        },
        {
          'label': 'Adventure',
          'value': 'adventure',
        },
        {
          'label': 'Comedy',
          'value': 'comedy',
        },
        {
          'label': 'Contemporary',
          'value': 'contemporary',
        },
        {
          'label': 'Drama',
          'value': 'drama',
        },
        {
          'label': 'Fantasy',
          'value': 'fantasy',
        },
        {
          'label': 'Historical',
          'value': 'historical',
        },
        {
          'label': 'Horror',
          'value': 'horror',
        },
        {
          'label': 'Mystery',
          'value': 'mystery',
        },
        {
          'label': 'Psychological',
          'value': 'psychological',
        },
        {
          'label': 'Romance',
          'value': 'romance',
        },
        {
          'label': 'Satire',
          'value': 'satire',
        },
        {
          'label': 'Sci-fi',
          'value': 'sci_fi',
        },
        {
          'label': 'Short Story',
          'value': 'one_shot',
        },
        {
          'label': 'Tragedy',
          'value': 'tragedy',
        },
      ],
    },
    'tags': {
      'type': FilterTypes.ExcludableCheckboxGroup,
      'label': 'Tags',
      'value': {
        'include': [],
        'exclude': [],
      },
      'options': [
        {
          'label': 'Anti-Hero Lead',
          'value': 'anti-hero_lead',
        },
        {
          'label': 'Artificial Intelligence',
          'value': 'artificial_intelligence',
        },
        {
          'label': 'Attractive Lead',
          'value': 'attractive_lead',
        },
        {
          'label': 'Cyberpunk',
          'value': 'cyberpunk',
        },
        {
          'label': 'Dungeon',
          'value': 'dungeon',
        },
        {
          'label': 'Dystopia',
          'value': 'dystopia',
        },
        {
          'label': 'Female Lead',
          'value': 'female_lead',
        },
        {
          'label': 'First Contact',
          'value': 'first_contact',
        },
        {
          'label': 'GameLit',
          'value': 'gamelit',
        },
        {
          'label': 'Gender Bender',
          'value': 'gender_bender',
        },
        {
          'label': 'Genetically Engineered',
          'value': 'genetically_engineered ',
        },
        {
          'label': 'Grimdark',
          'value': 'grimdark',
        },
        {
          'label': 'Hard Sci-fi',
          'value': 'hard_sci-fi',
        },
        {
          'label': 'Harem',
          'value': 'harem',
        },
        {
          'label': 'High Fantasy',
          'value': 'high_fantasy',
        },
        {
          'label': 'LitRPG',
          'value': 'litrpg',
        },
        {
          'label': 'Low Fantasy',
          'value': 'low_fantasy',
        },
        {
          'label': 'Magic',
          'value': 'magic',
        },
        {
          'label': 'Male Lead',
          'value': 'male_lead',
        },
        {
          'label': 'Martial Arts',
          'value': 'martial_arts',
        },
        {
          'label': 'Multiple Lead Characters',
          'value': 'multiple_lead',
        },
        {
          'label': 'Mythos',
          'value': 'mythos',
        },
        {
          'label': 'Non-Human Lead',
          'value': 'non-human_lead',
        },
        {
          'label': 'Portal Fantasy / Isekai',
          'value': 'summoned_hero',
        },
        {
          'label': 'Post Apocalyptic',
          'value': 'post_apocalyptic',
        },
        {
          'label': 'Progression',
          'value': 'progression',
        },
        {
          'label': 'Reader Interactive',
          'value': 'reader_interactive',
        },
        {
          'label': 'Reincarnation',
          'value': 'reincarnation',
        },
        {
          'label': 'Ruling Class',
          'value': 'ruling_class',
        },
        {
          'label': 'School Life',
          'value': 'school_life',
        },
        {
          'label': 'Secret Identity',
          'value': 'secret_identity',
        },
        {
          'label': 'Slice of Life',
          'value': 'slice_of_life',
        },
        {
          'label': 'Soft Sci-fi',
          'value': 'soft_sci-fi',
        },
        {
          'label': 'Space Opera',
          'value': 'space_opera',
        },
        {
          'label': 'Sports',
          'value': 'sports',
        },
        {
          'label': 'Steampunk',
          'value': 'steampunk',
        },
        {
          'label': 'Strategy',
          'value': 'strategy',
        },
        {
          'label': 'Strong Lead',
          'value': 'strong_lead',
        },
        {
          'label': 'Super Heroes',
          'value': 'super_heroes',
        },
        {
          'label': 'Supernatural',
          'value': 'supernatural',
        },
        {
          'label': 'Technologically Engineered',
          'value': 'technologically_engineered',
        },
        {
          'label': 'Time Loop',
          'value': 'loop',
        },
        {
          'label': 'Time Travel',
          'value': 'time_travel',
        },
        {
          'label': 'Urban Fantasy',
          'value': 'urban_fantasy',
        },
        {
          'label': 'Villainous Lead',
          'value': 'villainous_lead',
        },
        {
          'label': 'Virtual Reality',
          'value': 'virtual_reality',
        },
        {
          'label': 'War and Military',
          'value': 'war_and_military',
        },
        {
          'label': 'Wuxia',
          'value': 'wuxia',
        },
        {
          'label': 'Xianxia',
          'value': 'xianxia',
        },
      ],
    },
    'content_warnings': {
      'type': FilterTypes.ExcludableCheckboxGroup,
      'label': 'Content Warnings',
      'value': {
        'include': [],
        'exclude': [],
      },
      'options': [
        {
          'label': 'Profanity',
          'value': 'profanity',
        },
        {
          'label': 'Sexual Content',
          'value': 'sexuality',
        },
        {
          'label': 'Graphic Violence',
          'value': 'graphic_violence',
        },
        {
          'label': 'Sensitive Content',
          'value': 'sensitive',
        },
        {
          'label': 'AI-Assisted Content',
          'value': 'ai_assisted',
        },
        {
          'label': 'AI-Generated Content',
          'value': 'ai_generated',
        },
      ],
    },
    'minPages': {
      'type': FilterTypes.TextInput,
      'label': 'Min Pages',
      'value': '0',
    },
    'maxPages': {
      'type': FilterTypes.TextInput,
      'label': 'Max Pages',
      'value': '20000',
    },
    'minRating': {
      'type': FilterTypes.TextInput,
      'label': 'Min Rating (0.0 - 5.0)',
      'value': '0.0',
    },
    'maxRating': {
      'type': FilterTypes.TextInput,
      'label': 'Max Rating (0.0 - 5.0)',
      'value': '5.0',
    },
    'status': {
      'type': FilterTypes.Picker,
      'label': 'Status',
      'value': 'ALL',
      'options': [
        {
          'label': 'All',
          'value': 'ALL',
        },
        {
          'label': 'Completed',
          'value': 'COMPLETED',
        },
        {
          'label': 'Dropped',
          'value': 'DROPPED',
        },
        {
          'label': 'Ongoing',
          'value': 'ONGOING',
        },
        {
          'label': 'Hiatus',
          'value': 'HIATUS',
        },
        {
          'label': 'Stub',
          'value': 'STUB',
        },
      ],
    },
    'orderBy': {
      'type': FilterTypes.Picker,
      'label': 'Order by',
      'value': 'relevance',
      'options': [
        {
          'label': 'Relevance',
          'value': 'relevance',
        },
        {
          'label': 'Popularity',
          'value': 'popularity',
        },
        {
          'label': 'Average Rating',
          'value': 'rating',
        },
        {
          'label': 'Last Update',
          'value': 'last_update',
        },
        {
          'label': 'Release Date',
          'value': 'release_date',
        },
        {
          'label': 'Followers',
          'value': 'followers',
        },
        {
          'label': 'Number of Pages',
          'value': 'length',
        },
        {
          'label': 'Views',
          'value': 'views',
        },
        {
          'label': 'Title',
          'value': 'title',
        },
        {
          'label': 'Author',
          'value': 'author',
        },
      ],
    },
    'dir': {
      'type': FilterTypes.Picker,
      'label': 'Direction',
      'value': 'desc',
      'options': [
        {
          'label': 'Ascending',
          'value': 'asc',
        },
        {
          'label': 'Descending',
          'value': 'desc',
        },
      ],
    },
    'type': {
      'type': FilterTypes.Picker,
      'label': 'Type',
      'value': 'ALL',
      'options': [
        {
          'label': 'All',
          'value': 'ALL',
        },
        {
          'label': 'Fan Fiction',
          'value': 'fanfiction',
        },
        {
          'label': 'Original',
          'value': 'original',
        },
      ],
    },
  } satisfies Filters;
}

export default new RoyalRoad();

type ChapterEntry = {
  id: number;
  volumeId: number;
  title: string;
  date: string;
  order: number;
  url: string;
};

type VolumeEntry = {
  id: number;
  title: string;
  cover: string;
  order: number;
};
