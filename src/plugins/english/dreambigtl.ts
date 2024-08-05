import { CheerioAPI, load as parseHTML } from 'cheerio';
import { fetchApi, fetchFile } from '@libs/fetch';
import { Plugin } from '@typings/plugin';

class DreamBigTL implements Plugin.PluginBase {
  id = 'dreambigtl';
  name = 'Dream Big Translations';
  version = '1.0.0';
  site = 'https://www.dreambigtl.com/';
  icon = 'src/en/dreambigtl/icon.png';

  async popularNovels(
    pageNo: number,
    { showLatestNovels }: Plugin.PopularNovelsOptions,
  ): Promise<Plugin.NovelItem[]> {
    const delay = (ms: number) =>
      new Promise(resolve => setTimeout(resolve, ms));

    try {
      const url = `${this.site}p/disclaimer.html`;
      console.log('Fetching URL:', url);

      await delay(2000);
      const response = await fetchApi(url);
      const body = await response.text();
      console.log('Response body length:', body.length);

      const loadedCheerio = parseHTML(body);
      const novels: Plugin.NovelItem[] = [];
      const categories = ['New Novels', 'Ongoing Novels', 'Completed Novels'];

      console.log(
        'Menu items found:',
        loadedCheerio('#webify-pro-main-nav-menu > li').length,
      );

      loadedCheerio('#webify-pro-main-nav-menu > li.has-sub').each(
        (_, categoryElem) => {
          const categoryName = loadedCheerio(categoryElem)
            .children('a')
            .first()
            .text()
            .trim();
          console.log('Checking category:', categoryName);

          if (categories.includes(categoryName)) {
            console.log('Found matching category:', categoryName);
            const subMenu =
              loadedCheerio(categoryElem).find('ul.sub-menu.m-sub');
            console.log('Submenu items found:', subMenu.find('li').length);

            subMenu.find('li > a').each((_, novelElem) => {
              const novelName = loadedCheerio(novelElem).text().trim();
              const novelUrl = loadedCheerio(novelElem).attr('href');
              console.log('Novel found:', novelName, novelUrl);

              if (novelUrl) {
                novels.push({
                  name: novelName,
                  path: novelUrl.replace(this.site, ''),
                  cover: '',
                });
              }
            });
          }
        },
      );

      console.log('Total novels found:', novels.length);
      novels.forEach(novel => console.log('Novel:', novel.name, novel.path));

      if (novels.length === 0) {
        console.warn('No novels found, trying to parse everything...');

        // Fallback: try to parse everything...
        loadedCheerio('a').each((_, elem) => {
          const href = loadedCheerio(elem).attr('href');
          if (href && href.includes('/p/') && !href.includes('disclaimer')) {
            const novelName = loadedCheerio(elem).text().trim();
            novels.push({
              name: novelName,
              path: href.replace(this.site, ''),
              cover: '',
            });
          }
        });

        console.log('Fallback total novels found:', novels.length);
      }

      if (showLatestNovels) {
        novels.sort((a, b) => b.path.localeCompare(a.path));
      }

      return novels;
    } catch (error) {
      console.error('Error fetching popular novels:', error);
      throw new Error('Unable to fetch novels from any available URL');
    }
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const url = this.site + novelPath;
    try {
      const result = await fetchApi(url);
      const body = await result.text();
      const loadedCheerio = parseHTML(body);

      const novel: Plugin.SourceNovel = {
        path: novelPath,
        name: loadedCheerio('h1.entry-title').text().trim(),
        cover: await this.getNovelCover(
          loadedCheerio('.post-body img').first().attr('src') || '',
        ),
        summary: loadedCheerio('.post-body p').first().text().trim(),
        author:
          loadedCheerio('.post-body')
            .text()
            .match(/Author:\s*(.+)/i)?.[1]
            ?.trim() || 'Unknown',
        status: this.getNovelStatus(novelPath),
        chapters: await this.parseChapters(loadedCheerio),
      };

      return novel;
    } catch (error) {
      console.error('Error parsing novel:', error);
      throw error;
    }
  }
  async parseChapters(
    loadedCheerio: CheerioAPI,
  ): Promise<Plugin.ChapterItem[]> {
    const chapters: Plugin.ChapterItem[] = [];
    try {
      // Parse "Free Tier" chapters
      loadedCheerio('.chapter-panel').each((_, panel) => {
        const panelTitle = loadedCheerio(panel).find('summary').text().trim();
        if (panelTitle === 'Free Tier') {
          loadedCheerio(panel)
            .find('ul li a')
            .each((_, chapterEle) => {
              const chapterName = loadedCheerio(chapterEle).text().trim();
              const chapterUrl = loadedCheerio(chapterEle).attr('href');
              if (chapterUrl) {
                chapters.push({
                  name: chapterName,
                  path: chapterUrl.replace(this.site, ''),
                });
              }
            });
        }
      });

      // Parse "List of Chapters"
      if (chapters.length === 0) {
        loadedCheerio(
          'h2:contains("List of Chapters"), span:contains("List of Chapters")',
        ).each((_, header) => {
          const chapterList = loadedCheerio(header).next('ul');
          chapterList.find('li a').each((_, chapterEle) => {
            const chapterName = loadedCheerio(chapterEle).text().trim();
            const chapterUrl = loadedCheerio(chapterEle).attr('href');
            if (chapterUrl) {
              chapters.push({
                name: chapterName,
                path: chapterUrl.replace(this.site, ''),
              });
            }
          });
        });
      }

      if (chapters.length === 0) {
        console.warn('No chapters found');
      }

      return chapters.reverse();
    } catch (error) {
      console.error('Error parsing chapters:', error);
      throw error;
    }
  }

  async getNovelCover(coverUrl: string): Promise<string> {
    if (!coverUrl) return '';
    try {
      return await fetchFile(coverUrl);
    } catch (error) {
      console.error('Error fetching novel cover:', error);
      return '';
    }
  }

  getNovelStatus(novelPath: string): string {
    if (novelPath.includes('completed')) return 'Completed';
    return 'Ongoing';
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const url = this.site + chapterPath;
    try {
      const result = await fetchApi(url);
      const body = await result.text();
      const loadedCheerio = parseHTML(body);

      const chapterTitle = loadedCheerio('h1.entry-title').text().trim();
      const chapterContent = loadedCheerio('.post-body').html() || '';

      if (!chapterContent) {
        console.warn('No chapter content found');
      }

      return `<h1>${chapterTitle}</h1>${chapterContent}`;
    } catch (error) {
      console.error('Error parsing chapter:', error);
      throw error;
    }
  }

  async searchNovels(searchTerm: string): Promise<Plugin.NovelItem[]> {
    const url = `${this.site}search?q=${encodeURIComponent(searchTerm)}`;
    try {
      const result = await fetchApi(url);
      const body = await result.text();
      const loadedCheerio = parseHTML(body);

      const novels: Plugin.NovelItem[] = [];

      loadedCheerio(
        '.blog-posts.index-post-wrap .blog-post.hentry.index-post',
      ).each((_, ele) => {
        const novelName = loadedCheerio(ele)
          .find('.entry-title a')
          .text()
          .trim();
        const novelUrl = loadedCheerio(ele).find('.entry-title a').attr('href');
        const novelCover =
          loadedCheerio(ele).find('.entry-image').attr('data-image') || '';
        // const novelCategory = loadedCheerio(ele).find('.entry-category').text().trim();

        if (novelUrl) {
          novels.push({
            name: novelName,
            path: novelUrl.replace(this.site, ''),
            cover: novelCover,
            // category: novelCategory,
          });
        }
      });

      if (novels.length === 0) {
        console.warn('No search results found');
      }

      return novels;
    } catch (error) {
      console.error('Error searching novels:', error);
      throw error;
    }
  }
}

export default new DreamBigTL();
