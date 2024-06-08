import { CheerioAPI, load } from 'cheerio';
import { fetchApi, fetchFile } from '@libs/fetch';
import { Plugin } from '@typings/plugin';
import { Filters, FilterTypes } from '@libs/filterInputs';
import { defaultCover } from '@libs/defaultCover';
import { NovelStatus } from '@libs/novelStatus';

class KissWoodPlugin implements Plugin.PluginBase {
  id = 'kisswood';
  name = 'KissWood';
  icon = 'src/fr/kisswood/icon.png';
  site = 'https://kisswood.eu';
  version = '1.0.0';
  filters: Filters | undefined = undefined;

  async getCheerio(url: string): Promise<CheerioAPI> {
    const r = await fetchApi(url);
    const body = await r.text();
    const $ = load(body);
    return $;
  }

  async getNovelsCovers(
    novels: Plugin.NovelItem[],
    listUrlCover: string[],
  ): Promise<Plugin.NovelItem[]> {
    await Promise.all(
      novels.map(async (novel, index) => {
        if (listUrlCover[index] !== '') {
          const $novel = await this.getCheerio(listUrlCover[index]);
          novel.cover =
            $novel('div p img').first().attr('src') ||
            $novel('figure a img').first().attr('src') ||
            $novel('figure img').first().attr('src') ||
            defaultCover;
        }
      }),
    );
    return novels;
  }

  async popularNovels(
    pageNo: number,
    {
      showLatestNovels,
      filters,
    }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    if (pageNo > 1) return [];

    const novels: Plugin.NovelItem[] = [];
    let novel: Plugin.NovelItem;
    const url = this.site;
    const $ = await this.getCheerio(url);
    var listUrlCover: string[] = [];
    $('nav div div ul li ul li').each((i, elem) => {
      if ($(elem).text().trim() === 'Sommaire') {
        const novelName = $(elem)
          .parent()
          .parent()
          .find('a')
          .first()
          .text()
          .trim();
        const novelUrl = $(elem).find('a').attr('href');
        if (novelUrl && novelName) {
          const urlCover = $(elem).parent().find('a').attr('href');
          if (urlCover) {
            listUrlCover.push(urlCover);
          } else {
            listUrlCover.push('');
          }

          novel = {
            name: novelName,
            path: novelUrl.replace(this.site, ''),
          };
          novels.push(novel);
        }
      }
    });
    return await this.getNovelsCovers(novels, listUrlCover);
  }

  regexAuthors = [/Auteur :([^\n]*)/, /Auteur\u00A0:([^\n]*)/];

  async DonnerNovel(
    novel: Plugin.SourceNovel,
    url: string,
  ): Promise<Plugin.SourceNovel> {
    let $ = await this.getCheerio(url);

    let textArray: string[] = [];
    $('.entry-content p').each((index, element) => {
      const array = $(element).text().trim().split('\n');
      for (let i = 0; i < array.length; i++) {
        textArray.push(array[i]);
      }
    });

    const index = textArray.findIndex(function (element) {
      return (
        element.includes('Traducteur Anglais- Français') ||
        element.includes('Titre en français') ||
        element.includes('———') ||
        element.includes('Titre :') ||
        element.includes('Lien vers le premier chapitre') ||
        element.includes('____________') ||
        element.includes('Auteur : ')
      );
    });

    novel.name = $('header h1').text().trim();
    novel.summary = (index !== -1 ? textArray.slice(0, index) : textArray)
      .join('\n')
      .replace('Synopsis :', '');
    novel.author = this.extractInfo(novel.summary, this.regexAuthors);
    novel.cover =
      $('div p img').first().attr('src') ||
      $('figure a img').first().attr('src') ||
      $('figure img').first().attr('src') ||
      defaultCover;
    return novel;
  }

  extractInfo(text: string, regexes: RegExp[]): string {
    for (const regex of regexes) {
      const match = regex.exec(text);
      if (match !== null) {
        return match[1].trim();
      }
    }
    return '';
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    let novel: Plugin.SourceNovel = {
      path: novelPath,
      name: 'Sans titre',
      status: NovelStatus.Ongoing,
    };

    let $ = await this.getCheerio(this.site + novelPath);
    let novelUrl = null;

    $('nav div div ul li ul li').each((i, elem) => {
      if ($(elem).find('a').attr('href') === this.site + novelPath) {
        novelUrl = $(elem).parent().find('a').first().attr('href');
        return;
      }
    });

    if (novelUrl) {
      novel = await this.DonnerNovel(novel, novelUrl);
    }
    let chapters: Plugin.ChapterItem[] = [];
    $(
      '.entry-content ul li a, .entry-content ul li ul li a , .entry-content p a, .entry-content li a, .entry-content blockquote a',
    ).each((i, elem) => {
      const chapterName = $(elem).text().trim();
      const chapterUrl = $(elem).attr('href')?.replace('http://', 'https://');
      if (
        chapterUrl &&
        chapterUrl.includes(this.site) &&
        chapterName &&
        // We remove the unnecessary links to Facebook, X, and the homepage from the chapters.
        !chapterUrl.includes('share=facebook') &&
        !chapterUrl.includes('share=x') &&
        !chapterUrl.includes('/category/traductions/') &&
        !chapterUrl.includes('/category/tour-des-mondes/') &&
        // Removal of duplicates
        !chapters.some(chapter => this.site + chapter.path === chapterUrl)
      ) {
        chapters.push({
          name: chapterName,
          path: chapterUrl.replace(this.site, ''),
        });
      }
    });
    novel.chapters = chapters;
    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const $ = await this.getCheerio(this.site + chapterPath);

    let elements: string[] = [];

    $('.entry-content')
      .contents()
      .each(function () {
        elements.push($.html(this));
      });

    const hrIndexes: number[] = [];

    // Parcourir tous les éléments de la liste
    elements.forEach((elem, index) => {
      // Vérifier si l'élément contient la balise <hr>
      if (elem.includes('<hr>')) {
        // Si oui, ajouter son index au tableau
        hrIndexes.push(index);
      }
    });

    if (hrIndexes.length === 0) {
      hrIndexes.push(0);
      hrIndexes.push(
        elements.findIndex(function (element) {
          return (
            element.includes('https://fr.tipeee.com/kisswood/') ||
            element.includes('>Sommaire</a>') ||
            element.includes('>Chapitre Suivant</a>') ||
            element.includes('———————————————————————————-') ||
            element.includes('share=facebook')
          );
        }),
      );
    } else if (hrIndexes.length === 1) {
      hrIndexes.unshift(0);
    } else {
      hrIndexes[0] += 1;
    }
    return elements.slice(hrIndexes[0], hrIndexes[1]).join('\n');
  }

  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    if (pageNo !== 1) return [];

    let popularNovels = this.popularNovels(1, {
      showLatestNovels: true,
      filters: undefined,
    });

    let novels = (await popularNovels).filter(novel =>
      novel.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .includes(
          searchTerm
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim(),
        ),
    );

    return novels;
  }

  async fetchImage(url: string): Promise<string | undefined> {
    // if your plugin has images and they won't load
    // this is the function to fiddle with
    return fetchFile(url);
  }
}

export default new KissWoodPlugin();
