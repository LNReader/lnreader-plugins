import { CheerioAPI, load as parseHTML } from 'cheerio';
import { fetchApi } from '@libs/fetch';
import { Filters, FilterTypes } from '@libs/filterInputs';
import { Plugin } from '@typings/plugin';

class NovelUpdates implements Plugin.PluginBase {
  id = 'novelupdates';
  name = 'Novel Updates';
  version = '0.9.0';
  icon = 'src/en/novelupdates/icon.png';
  customCSS = 'src/en/novelupdates/customCSS.css';
  site = 'https://www.novelupdates.com/';

  parseNovels(loadedCheerio: CheerioAPI) {
    const novels: Plugin.NovelItem[] = [];
    loadedCheerio('div.search_main_box_nu').each((_, el) => {
      const novelUrl = loadedCheerio(el).find('.search_title > a').attr('href');
      if (!novelUrl) return;
      novels.push({
        name: loadedCheerio(el).find('.search_title > a').text(),
        cover: loadedCheerio(el).find('img').attr('src'),
        path: novelUrl.replace(this.site, ''),
      });
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
    let url = this.site;

    // Build the URL based on filters
    if (showLatestNovels) {
      url += 'series-finder/?sf=1&sort=sdate&order=desc';
    } else if (
      filters?.sort.value === 'popmonth' ||
      filters?.sort.value === 'popular'
    ) {
      url += 'series-ranking/?rank=' + filters.sort.value;
    } else {
      url += 'series-finder/?sf=1';
      if (
        filters?.genres.value.include?.length ||
        filters?.genres.value.exclude?.length
      ) {
        url += '&mgi=' + filters.genre_operator.value;
      }
      if (filters?.novelType.value.length) {
        url += '&nt=' + filters.novelType.value.join(',');
      }
      if (filters?.reading_lists.value.length) {
        url += '&hd=' + filters?.reading_lists.value.join(',');
        url += '&mRLi=' + filters?.reading_list_operator.value;
      }
      url += '&sort=' + filters?.sort.value;
      url += '&order=' + filters?.order.value;
    }

    // Add common filters
    if (filters?.language.value.length)
      url += '&org=' + filters.language.value.join(',');
    if (filters?.genres.value.include?.length)
      url += '&gi=' + filters.genres.value.include.join(',');
    if (filters?.genres.value.exclude?.length)
      url += '&ge=' + filters.genres.value.exclude.join(',');
    if (filters?.storyStatus.value) url += '&ss=' + filters.storyStatus.value;

    url += '&pg=' + page;

    const result = await fetchApi(url);
    const body = await result.text();
    const loadedCheerio = parseHTML(body);
    return this.parseNovels(loadedCheerio);
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const url = this.site + novelPath;
    const result = await fetchApi(url);
    const body = await result.text();
    const loadedCheerio = parseHTML(body);

    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: loadedCheerio('.seriestitlenu').text() || 'Untitled',
      cover: loadedCheerio('.wpb_wrapper img').attr('src'),
      chapters: [],
    };
    novel.author = loadedCheerio('#authtag')
      .map((_, el) => loadedCheerio(el).text().trim())
      .toArray()
      .join(', ');
    novel.genres = loadedCheerio('#seriesgenre')
      .children('a')
      .map((_, el) => loadedCheerio(el).text())
      .toArray()
      .join(',');
    novel.status = loadedCheerio('#editstatus').text().includes('Ongoing')
      ? 'Ongoing'
      : 'Completed';

    const type = loadedCheerio('#showtype').text().trim();
    const summary = loadedCheerio('#editdescription').text().trim();
    novel.summary = summary + `\n\nType: ${type}`;
    const rating = loadedCheerio('.seriesother .uvotes')
      .text()
      .match(/(\d+\.\d+) \/ \d+\.\d+/)?.[1];
    if (rating) {
      novel.rating = parseFloat(rating);
    }

    const novelId = loadedCheerio('input#mypostid').attr('value')!;
    const formData = new FormData();
    formData.append('action', 'nd_getchapters');
    formData.append('mygrr', '0');
    formData.append('mypostid', novelId);

    const chaptersHtml = await fetchApi(`${this.site}wp-admin/admin-ajax.php`, {
      method: 'POST',
      body: formData,
    }).then(data => data.text());

    const chaptersCheerio = parseHTML(chaptersHtml);
    const chapters: Plugin.ChapterItem[] = [];

    chaptersCheerio('li.sp_li_chp').each((_, el) => {
      const chapterName = chaptersCheerio(el)
        .text()
        .replace('v', 'volume ')
        .replace('c', ' chapter ')
        .replace('part', 'part ')
        .replace('ss', 'SS')
        .replace(/\b\w/g, l => l.toUpperCase())
        .trim();

      const chapterPath =
        'https:' + chaptersCheerio(el).find('a').first().next().attr('href');

      if (chapterPath)
        chapters.push({
          name: chapterName,
          path: chapterPath.replace(this.site, ''),
        });
    });

    novel.chapters = chapters.reverse();
    return novel;
  }

  getLocation(href: string) {
    const match = href.match(
      /^(https?:)\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/,
    );
    return match && `${match[1]}//${match[3]}`;
  }

  async getChapterBody(
    loadedCheerio: CheerioAPI,
    domain: string[],
    chapterPath: string,
  ) {
    let bloatElements = [];
    let chapterTitle = '';
    let chapterContent = '';
    let chapterText = '';

    const unwanted = ['app', 'blogspot', 'casper', 'wordpress', 'www'];
    const targetDomain = domain.find(d => !unwanted.includes(d));

    switch (targetDomain) {
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'anotivereads': {
        chapterTitle = loadedCheerio('#comic-nav-name').first().text();
        chapterContent = loadedCheerio('#spliced-comic').html()!;
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'arcanetranslations': {
        bloatElements = ['.bottomnav'];
        bloatElements.forEach(tag => loadedCheerio(tag).remove());
        chapterTitle = loadedCheerio('.epwrapper .cat-series').first().text();
        loadedCheerio('.entry-content div, .entry-content span').each(
          (_, element) => {
            const el = loadedCheerio(element);
            const style = el.attr('style');
            if (!style) return; // Skip elements without inline styles
            if (/border:.*#00219b/.test(style)) {
              el.removeAttr('style').addClass('arcane_box_blue'); // Blue box
            } else if (/border:.*white/.test(style)) {
              el.removeAttr('style').addClass('arcane_box_white'); // White box
            } else if (
              style.includes('text-transform: uppercase') &&
              /text-shadow:.*blue/.test(style)
            ) {
              el.removeAttr('style').addClass('arcane_title_blue'); // Blue title
            } else if (/text-shadow:.*blue/.test(style)) {
              el.removeAttr('style').addClass('arcane_text_blue'); // Blue text
            } else if (/text-shadow:.*lightyellow/.test(style)) {
              el.removeAttr('style').addClass('arcane_text_lightyellow'); // Lightyellow text
            } else if (/color:.*#ff00ff/.test(style)) {
              el.removeAttr('style').addClass('arcane_text_pink'); // Pink text
            }
          },
        );
        chapterContent = loadedCheerio('.entry-content').html()!;
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'asuratls': {
        const titleElement = loadedCheerio('.post-body div b').first();
        chapterTitle = titleElement.text();
        titleElement.remove();
        chapterContent = loadedCheerio('.post-body').html()!;
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'daoist': {
        chapterTitle = loadedCheerio('.chapter__title').first().text();
        chapterContent = loadedCheerio('.chapter__content').html()!;
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'darkstartranslations': {
        chapterTitle = loadedCheerio('ol.breadcrumb li').last().text().trim();
        chapterContent = loadedCheerio('.text-left').html()!;
        // Load the extracted chapter content into Cheerio
        const chapterCheerio = parseHTML(chapterContent);
        // Add an empty row (extra <br>) after each <br> element
        chapterCheerio('br').each((_, el) => {
          chapterCheerio(el).after('<br>'); // Add one more <br> for an empty row
        });
        // Get the updated content
        chapterContent = chapterCheerio.html();
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'fictionread': {
        bloatElements = [
          '.content > style',
          '.highlight-ad-container',
          '.meaning',
          '.word',
        ];
        bloatElements.forEach(tag => loadedCheerio(tag).remove());
        chapterTitle = loadedCheerio('.title-image span').first().text();
        loadedCheerio('.content')
          .children()
          .each((_, el) => {
            if (loadedCheerio(el).attr('id')?.includes('Chaptertitle-info')) {
              loadedCheerio(el).remove();
              return false;
            }
          });
        chapterContent = loadedCheerio('.content').html()!;
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'genesistudio': {
        const url = `${chapterPath}/__data.json?x-sveltekit-invalidated=001`;
        try {
          // Fetch the chapter's data in JSON format
          const json = await fetchApi(url).then(r => r.json());
          const nodes = json.nodes;
          const data = nodes
            .filter((node: { type: string }) => node.type === 'data')
            .map((node: { data: any }) => node.data)[0];
          // Look for chapter container with required fields
          const contentKey = 'content';
          const notesKey = 'notes';
          const footnotesKey = 'footnotes';
          // Iterate over each property in data to find chapter containers
          for (const key in data) {
            const mapping = data[key];
            // Check container for keys that match the required fields
            if (
              mapping &&
              typeof mapping === 'object' &&
              contentKey in mapping &&
              notesKey in mapping &&
              footnotesKey in mapping
            ) {
              // Retrieve the chapter's content, notes, and footnotes using the mapping.
              const content = data[mapping[contentKey]];
              const notes = data[mapping[notesKey]];
              const footnotes = data[mapping[footnotesKey]];
              // Combine the parts with appropriate formatting
              chapterText =
                content +
                (notes ? `<h2>Notes</h2><br>${notes}` : '') +
                (footnotes ?? '');
              break;
            }
          }
        } catch (error) {
          throw new Error(`Failed to fetch chapter data: ${error}`);
        }
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'helscans': {
        chapterTitle = loadedCheerio('.entry-title-main').first().text();
        const chapterString_helscans =
          'Chapter ' + chapterTitle.split('Chapter')[1].trim();
        loadedCheerio('#readerarea.rdminimal')
          .children()
          .each((_, el) => {
            const elementText = loadedCheerio(el).text();
            if (elementText.includes(chapterString_helscans)) {
              chapterTitle = elementText;
              loadedCheerio(el).remove();
              return false;
            }
          });
        chapterContent = loadedCheerio('#readerarea.rdminimal').html()!;
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'hiraethtranslation': {
        chapterTitle = loadedCheerio('li.active').first().text();
        chapterContent = loadedCheerio('.text-left').html()!;
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'hostednovel': {
        chapterTitle = loadedCheerio('#chapter-title').first().text();
        chapterContent = loadedCheerio('#chapter-content').html()!;
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'infinitenoveltranslations': {
        // Get the chapter link from the main page
        const url = loadedCheerio('article > p > a').first().attr('href')!;
        if (url) {
          const result = await fetchApi(url);
          const body = await result.text();
          loadedCheerio = parseHTML(body);
        }
        chapterContent = loadedCheerio('.hentry').html()!;
        chapterTitle = loadedCheerio('.page-entry-title').text();
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'inoveltranslation': {
        bloatElements = ['header', 'section'];
        bloatElements.forEach(tag => loadedCheerio(tag).remove());
        chapterText = loadedCheerio('.styles_content__JHK8G').html()!;
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      // mii translates
      case 'isotls': {
        bloatElements = [
          'footer',
          'header',
          'nav',
          '.ezoic-ad',
          '.ezoic-adpicker-ad',
          '.ezoic-videopicker-video',
        ];
        bloatElements.forEach(tag => loadedCheerio(tag).remove());
        chapterTitle = loadedCheerio('head title').first().text();
        chapterContent = loadedCheerio('main article').html()!;
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'ko-fi': {
        const matchResult = loadedCheerio(
          'script:contains("shadowDom.innerHTML")',
        )
          .html()
          ?.match(/shadowDom\.innerHTML \+= '(<div.*?)';/);
        if (matchResult && matchResult[1]) {
          chapterText = matchResult[1];
        }
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'mirilu': {
        bloatElements = ['#jp-post-flair'];
        bloatElements.forEach(tag => loadedCheerio(tag).remove());
        const titleElement = loadedCheerio('.entry-content p strong').first();
        chapterTitle = titleElement.text();
        titleElement.remove();
        chapterContent = loadedCheerio('.entry-content').html()!;
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'novelplex': {
        bloatElements = ['.passingthrough_adreminder'];
        bloatElements.forEach(tag => loadedCheerio(tag).remove());
        chapterTitle = loadedCheerio('.halChap--jud').first().text();
        chapterContent = loadedCheerio('.halChap--kontenInner ').html()!;
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'novelworldtranslations': {
        bloatElements = ['.separator img'];
        bloatElements.forEach(tag => loadedCheerio(tag).remove());
        loadedCheerio('.entry-content a')
          .filter((_, el) => {
            return (
              loadedCheerio(el)
                .attr('href')
                ?.includes('https://novelworldtranslations.blogspot.com') ||
              false
            );
          })
          .each((_, el) => {
            loadedCheerio(el).parent().remove();
          });
        chapterTitle = loadedCheerio('.entry-title').first().text();
        chapterContent = loadedCheerio('.entry-content')
          .html()!
          .replace(/&nbsp;/g, '')
          .replace(/\n/g, '<br>');
        // Load the chapter content into Cheerio and clean up empty elements
        const chapterCheerio = parseHTML(chapterContent);
        chapterCheerio('span, p, div').each((_, el) => {
          if (chapterCheerio(el).text().trim() === '') {
            chapterCheerio(el).remove();
          }
        });
        chapterContent = chapterCheerio.html()!;
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'raeitranslations': {
        const parts = chapterPath.split('/');
        const url = `${parts[0]}//api.${parts[2]}/api/chapters/single?id=${parts[3]}&num=${parts[4]}`;
        const json = await fetchApi(url).then(r => r.json());
        const titleElement = `Chapter ${json.currentChapter.chapTag}`;
        chapterTitle = json.currentChapter.chapTitle
          ? `${titleElement} - ${json.currentChapter.chapTitle}`
          : titleElement;
        chapterContent = [
          json.novelHead,
          `<br><hr><br>`,
          json.currentChapter.body,
          `<br><hr><br>Translator's Note:<br>`,
          json.currentChapter.note,
        ].join('');
        chapterContent = chapterContent.replace(/\n/g, '<br>');
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'rainofsnow': {
        const displayedDiv = loadedCheerio('.bb-item').filter(function () {
          return loadedCheerio(this).css('display') === 'block';
        });
        const loadedCheerioSnow = parseHTML(displayedDiv.html()!);
        bloatElements = [
          '.responsivevoice-button',
          '.zoomdesc-cont p img',
          '.zoomdesc-cont p noscript',
        ];
        bloatElements.forEach(tag => loadedCheerioSnow(tag).remove());
        chapterContent = loadedCheerioSnow('.zoomdesc-cont').html()!;
        const titleElement = loadedCheerioSnow('.scroller h2').first();
        if (titleElement.length) {
          chapterTitle = titleElement.text();
          titleElement.remove();
          chapterContent = loadedCheerioSnow('.zoomdesc-cont').html()!;
        }
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'readingpia': {
        bloatElements = ['.ezoic-ad', '.ezoic-adpicker-ad', '.ez-video-wrap'];
        bloatElements.forEach(tag => loadedCheerio(tag).remove());
        chapterText = loadedCheerio('.chapter-body').html()!;
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'redoxtranslation': {
        const chapterId = chapterPath.split('/').pop();
        chapterTitle = `Chapter ${chapterId}`;
        const url = `${chapterPath.split('chapter')[0]}txt/${chapterId}.txt`;
        chapterContent = await fetchApi(url)
          .then(r => r.text())
          .then(text => {
            // Split text into sentences based on newline characters
            const sentences = text.split('\n');
            // Process each sentence individually
            const formattedSentences = sentences.map(sentence => {
              // Check if the sentence contains "<hr>"
              if (sentence.includes('{break}')) {
                // Create a centered sentence with three stars
                return '<br> <p>****</p>';
              } else {
                // Replace text enclosed within ** with <strong> tags
                sentence = sentence.replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong>$1</strong>',
                );
                // Replace text enclosed within ++ with <em> tags
                sentence = sentence.replace(/\+\+(.*?)\+\+/g, '<em>$1</em>');
                return sentence;
              }
            });
            // Join the formatted sentences back together with newline characters
            return formattedSentences.join('<br>');
          });
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'sacredtexttranslations': {
        bloatElements = [
          '.entry-content blockquote',
          '.entry-content div',
          '.reaction-buttons',
        ];
        bloatElements.forEach(tag => loadedCheerio(tag).remove());
        chapterTitle = loadedCheerio('.entry-title').first().text();
        chapterContent = loadedCheerio('.entry-content').html()!;
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'scribblehub': {
        bloatElements = ['.wi_authornotes'];
        bloatElements.forEach(tag => loadedCheerio(tag).remove());
        chapterTitle = loadedCheerio('.chapter-title').first().text();
        chapterContent = loadedCheerio('.chp_raw').html()!;
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'skydemonorder': {
        // Check for age verification
        const ageVerification = loadedCheerio('main').text().toLowerCase()!;
        if (ageVerification.includes('age verification required')) {
          throw new Error('Age verification required, please open in webview.');
        }
        chapterTitle = `${loadedCheerio('header .font-medium.text-sm').first().text().trim()}`;
        chapterContent = loadedCheerio('#chapter-body').html()!;
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'stabbingwithasyringe': {
        // Get the chapter link from the main page
        const url = loadedCheerio('.entry-content a').attr('href')!;
        if (url) {
          const result = await fetchApi(url);
          const body = await result.text();
          loadedCheerio = parseHTML(body);
        }
        bloatElements = [
          '.has-inline-color',
          '.wp-block-buttons',
          '.wpcnt',
          '#jp-post-flair',
        ];
        bloatElements.forEach(tag => loadedCheerio(tag).remove());
        chapterContent = loadedCheerio('.entry-content').html()!;
        const titleElement = loadedCheerio('.entry-content h3').first();
        if (titleElement.length) {
          chapterTitle = titleElement.text();
          titleElement.remove();
          chapterContent = loadedCheerio('.entry-content').html()!;
        }
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'tinytranslation': {
        bloatElements = [
          '.content noscript',
          '.google_translate_element',
          '.navigate',
          '.post-views',
          'br',
        ];
        bloatElements.forEach(tag => loadedCheerio(tag).remove());
        chapterTitle = loadedCheerio('.title-content').first().text();
        loadedCheerio('.title-content').first().remove();
        chapterContent = loadedCheerio('.content').html()!;
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'tumblr': {
        chapterText = loadedCheerio('.post').html()!;
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'vampiramtl': {
        // Get the chapter link from the main page
        const url = loadedCheerio('.entry-content a').attr('href')!;
        if (url) {
          const result = await fetchApi(chapterPath + url);
          const body = await result.text();
          loadedCheerio = parseHTML(body);
        }
        chapterTitle = loadedCheerio('.entry-title').first().text();
        chapterContent = loadedCheerio('.entry-content').html()!;
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'wattpad': {
        chapterTitle = loadedCheerio('.h2').first().text();
        chapterContent = loadedCheerio('.part-content pre').html()!;
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'webnovel': {
        chapterTitle = loadedCheerio('.cha-tit .pr .dib').first().text();
        chapterContent = loadedCheerio('.cha-words').html()!;
        if (!chapterContent) {
          chapterContent = loadedCheerio('._content').html()!;
        }
        break;
      }
      case 'wetriedtls': {
        const scriptContent =
          loadedCheerio('script:contains("p dir=")').html() ||
          loadedCheerio('script:contains("u003c")').html();
        if (scriptContent) {
          const jsonString_wetried = scriptContent.slice(
            scriptContent.indexOf('.push(') + '.push('.length,
            scriptContent.lastIndexOf(')'),
          );
          chapterText = JSON.parse(jsonString_wetried)[1];
        }
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'wuxiaworld': {
        bloatElements = ['.MuiLink-root'];
        bloatElements.forEach(tag => loadedCheerio(tag).remove());
        chapterTitle = loadedCheerio('h4 span').first().text();
        chapterContent = loadedCheerio('.chapter-content').html()!;
        break;
      }
      case 'yoru': {
        const chapterId = chapterPath.split('/').pop();
        const url = `https://pxp-main-531j.onrender.com/api/v1/book_chapters/${chapterId}/content`;
        const json = await fetchApi(url).then(r => r.json());
        chapterText = await fetchApi(json).then(r => r.text());
        break;
      }
      // Last edited in 0.9.0 by Batorian - 19/03/2025
      case 'zetrotranslation': {
        chapterContent = loadedCheerio('.text-left').html()!;
        const titleElement = loadedCheerio('.text-left h2').first();
        if (titleElement.length) {
          chapterTitle = titleElement.text();
          titleElement.remove();
          chapterContent = loadedCheerio('.text-left').html()!;
        } else if (chapterContent) {
          chapterTitle = loadedCheerio('.active').first().text();
        }
        break;
      }
    }
    if (!chapterText) {
      if (chapterTitle) {
        chapterText = `<h2>${chapterTitle}</h2><hr><br>${chapterContent}`;
      } else {
        chapterText = chapterContent;
      }
    }
    return chapterText;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    let chapterText;

    const result = await fetchApi(this.site + chapterPath);
    const body = await result.text();
    const url = result.url;
    const domainParts = url.toLowerCase().split('/')[2].split('.');

    const loadedCheerio = parseHTML(body);

    // Handle CAPTCHA cases
    const blockedTitles = [
      'bot verification',
      'just a moment...',
      'redirecting...',
      'un instant...',
      'you are being redirected...',
    ];
    const title = loadedCheerio('title').text().trim().toLowerCase();
    if (blockedTitles.includes(title)) {
      throw new Error('Captcha detected, please open in webview.');
    }

    // Check if chapter url is wrong or site is down
    if (!result.ok) {
      throw new Error(
        `Failed to fetch ${result.url}: ${result.status} ${result.statusText}`,
      );
    }

    // Detect platforms
    let isBlogspot = ['blogspot', 'blogger'].some(keyword =>
      [
        loadedCheerio('meta[name="google-adsense-platform-domain"]').attr(
          'content',
        ),
        loadedCheerio('meta[name="generator"]').attr('content'),
      ].some(meta => meta?.toLowerCase().includes(keyword)),
    );

    let isWordPress = ['wordpress', 'site kit by google'].some(keyword =>
      [
        loadedCheerio('#dcl_comments-js-extra').html(),
        loadedCheerio('meta[name="generator"]').attr('content'),
        loadedCheerio('.powered-by').text(),
        loadedCheerio('footer').text(),
      ].some(meta => meta?.toLowerCase().includes(keyword)),
    );

    // Manually set WordPress flag for known sites
    const manualWordPress = ['etherreads', 'greenztl2', 'soafp'];
    if (!isWordPress && domainParts.some(wp => manualWordPress.includes(wp))) {
      isWordPress = true;
    }

    // Handle outlier sites
    const outliers = [
      'anotivereads',
      'arcanetranslations',
      'asuratls',
      'darkstartranslations',
      'fictionread',
      'helscans',
      'infinitenoveltranslations',
      'mirilu',
      'novelworldtranslations',
      'sacredtexttranslations',
      'stabbingwithasyringe',
      'tinytranslation',
      'vampiramtl',
      'zetrotranslation',
    ];
    if (domainParts.some(d => outliers.includes(d))) {
      isWordPress = false;
      isBlogspot = false;
    }

    // Last edited in 0.9.0 - 19/03/2025
    /**
     * Blogspot sites:
     * - ¼-Assed
     * - AsuraTls (Outlier)
     * - FictionRead (Outlier)
     * - Novel World Translations (Outlier)
     * - SacredText TL (Outlier)
     * - Toasteful
     *
     * WordPress sites:
     * - Anomlaously Creative (Outlier)
     * - Arcane Translations (Outlier)
     * - Blossom Translation
     * - Darkstar Translations (Outlier)
     * - Dumahs Translations
     * - ElloMTL
     * - Femme Fables
     * - Gadgetized Panda Translation
     * - Gem Novels
     * - Goblinslate
     * - GreenzTL
     * - Hel Scans (Outlier)
     * - ippotranslations
     * - JATranslations
     * - Light Novels Translations
     * - Mirilu - Novel Reader Attempts Translating (Outlier)
     * - Neosekai Translations
     * - Shanghai Fantasy
     * - Soafp (Manually added)
     * - Stabbing with a Syringe (Outlier)
     * - StoneScape
     * - TinyTL (Outlier)
     * - VampiraMTL (Outlier)
     * - Wonder Novels
     * - Yong Library
     * - Zetro Translation (Outlier)
     */

    // Fetch chapter content based on detected platform
    if (!isWordPress && !isBlogspot) {
      chapterText = await this.getChapterBody(loadedCheerio, domainParts, url);
    } else {
      const bloatElements = isBlogspot
        ? ['.button-container', '.ChapterNav', '.ch-bottom', '.separator']
        : [
            '.ad',
            '.author-avatar',
            '.chapter-warning',
            '.entry-meta',
            '.ezoic-ad',
            '.mb-center',
            '.modern-footnotes-footnote__note',
            '.patreon-widget',
            '.post-cats',
            '.pre-bar',
            '.sharedaddy',
            '.sidebar',
            '.swg-button-v2-light',
            '.wp-block-buttons',
            '.wp-block-columns',
            '.wp-dark-mode-switcher',
            '.wp-next-post-navi',
            '#hpk',
            '#jp-post-flair',
            '#textbox',
          ];

      bloatElements.forEach(tag => loadedCheerio(tag).remove());

      // Extract title
      const titleSelectors = isBlogspot
        ? ['.entry-title', '.post-title', 'head title']
        : [
            '.entry-title',
            '.chapter__title',
            '.title-content',
            '.wp-block-post-title',
            '.title_story',
            '#chapter-heading',
            'head title',
            'h1:first-of-type',
            'h2:first-of-type',
            '.active',
          ];
      let chapterTitle = titleSelectors
        .map(sel => loadedCheerio(sel).first().text())
        .find(text => text);

      // Extract subtitle (if any)
      const chapterSubtitle =
        loadedCheerio('.cat-series').first().text() ||
        loadedCheerio('h1.leading-none ~ span').first().text();
      if (chapterSubtitle) chapterTitle = chapterSubtitle;

      // Extract content
      const contentSelectors = isBlogspot
        ? ['.content-post', '.entry-content', '.post-body']
        : [
            '.chapter__content',
            '.entry-content',
            '.text_story',
            '.post-content',
            '.contenta',
            '.single_post',
            '.main-content',
            '.reader-content',
            '#content',
            '#the-content',
            'article.post',
          ];
      const chapterContent = contentSelectors
        .map(sel => loadedCheerio(sel).html()!)
        .find(html => html);

      if (chapterTitle) {
        chapterText = `<h2>${chapterTitle}</h2><hr><br>${chapterContent}`;
      } else {
        chapterText = chapterContent;
      }
    }

    // Fallback content extraction
    if (!chapterText) {
      ['nav', 'header', 'footer', '.hidden'].forEach(tag =>
        loadedCheerio(tag).remove(),
      );
      chapterText = loadedCheerio('body').html()!;
    }

    // Convert relative URLs to absolute
    chapterText = chapterText.replace(
      /href="\//g,
      `href="${this.getLocation(result.url)}/`,
    );

    // Process images
    const chapterCheerio = parseHTML(chapterText);
    chapterCheerio('noscript').remove();

    chapterCheerio('img').each((_, el) => {
      const $el = chapterCheerio(el);

      // Only update if the lazy-loaded attribute exists
      if ($el.attr('data-lazy-src')) {
        $el.attr('src', $el.attr('data-lazy-src'));
      }
      if ($el.attr('data-lazy-srcset')) {
        $el.attr('srcset', $el.attr('data-lazy-srcset'));
      }

      // Remove lazy-loading class if it exists
      if ($el.hasClass('lazyloaded')) {
        $el.removeClass('lazyloaded');
      }
    });

    return chapterCheerio.html()!;
  }

  async searchNovels(
    searchTerm: string,
    page: number,
  ): Promise<Plugin.NovelItem[]> {
    // Split searchTerm by specific special characters and find the longest split
    const splits = searchTerm.split('*');
    const longestSearchTerm = splits.reduce(
      (a, b) => (a.length > b.length ? a : b),
      '',
    );
    searchTerm = longestSearchTerm.replace(/[‘’]/g, "'").replace(/\s+/g, '+');

    const url = `${this.site}series-finder/?sf=1&sh=${searchTerm}&sort=srank&order=asc&pg=${page}`;
    const result = await fetchApi(url);
    const body = await result.text();

    const loadedCheerio = parseHTML(body);

    return this.parseNovels(loadedCheerio);
  }

  filters = {
    sort: {
      label: 'Sort Results By',
      value: 'popmonth',
      options: [
        { label: 'Popular (Month)', value: 'popmonth' },
        { label: 'Popular (All)', value: 'popular' },
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
      label: 'Order (Not for Popular)',
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
    genre_operator: {
      label: 'Genre (And/Or) (Not for Popular)',
      value: 'and',
      options: [
        { label: 'And', value: 'and' },
        { label: 'Or', value: 'or' },
      ],
      type: FilterTypes.Picker,
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
      label: 'Novel Type (Not for Popular)',
      value: [],
      options: [
        { label: 'Light Novel', value: '2443' },
        { label: 'Published Novel', value: '26874' },
        { label: 'Web Novel', value: '2444' },
      ],
      type: FilterTypes.CheckboxGroup,
    },
    reading_list_operator: {
      label: 'Reading List (Include/Exclude) (Not for Popular)',
      value: 'include',
      options: [
        { label: 'Include', value: 'include' },
        { label: 'Exclude', value: 'exclude' },
      ],
      type: FilterTypes.Picker,
    },
    reading_lists: {
      label: 'Reading Lists (Not for Popular)',
      value: [],
      options: [{ label: 'All Reading Lists', value: '-1' }],
      type: FilterTypes.CheckboxGroup,
    },
  } satisfies Filters;
}

export default new NovelUpdates();
