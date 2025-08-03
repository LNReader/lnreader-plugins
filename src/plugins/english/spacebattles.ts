import { fetchApi } from '@libs/fetch';
import { Plugin } from '@typings/plugin';
import { Filters } from '@libs/filterInputs';
import { load as loadCheerio } from 'cheerio';
import { defaultCover } from '@libs/defaultCover';
import { NovelStatus } from '@libs/novelStatus';
import { isUrlAbsolute } from '@libs/isAbsoluteUrl';

class SpaceBattlesPlugin implements Plugin.PluginBase {
  id = 'spacebattles';
  name = 'SpaceBattlesUnofficial';
  icon = 'src/en/spacebattles/icon.png';
  site = 'https://forums.spacebattles.com';
  version = '1.0.0';
  filters: Filters | undefined = undefined;
  imageRequestInit?: Plugin.ImageRequestInit | undefined = undefined;

  constructor() {
    console.log('SPACEBATTLES PLUGIN LOADED');
  }

  // Helper method to find the best cover (story cover prioritized over author avatar)
  private findBestCover(cheerioElement: any): string {
    try {
      // First, look for story cover (threadmark index icon)
      const storyIconElement = cheerioElement.find(
        'img[src*="/data/threadmark-index-icons/"][class*="threadmarkIndexIcon"]',
      );
      if (storyIconElement.length) {
        const storyIconSrc = storyIconElement.attr('src');
        if (storyIconSrc) {
          const coverUrl = storyIconSrc.startsWith('http')
            ? storyIconSrc
            : `${this.site}${storyIconSrc}`;
          console.log(`✅ Found story cover: ${coverUrl}`);
          return coverUrl;
        }
      }

      // Fallback to author's avatar
      const avatarElement = cheerioElement.find(
        'img[src*="/data/avatar/"][class*="avatar-u"]',
      );
      if (avatarElement.length) {
        const avatarSrc = avatarElement.attr('src');
        if (avatarSrc) {
          const coverUrl = avatarSrc.startsWith('http')
            ? avatarSrc
            : `${this.site}${avatarSrc}`;
          console.log(`✅ Found author avatar: ${coverUrl}`);
          return coverUrl;
        }
      }

      // Additional fallback for popular novels (different avatar structure)
      const popularAvatarElement = cheerioElement.find(
        '.structItem-cell--icon .avatar img',
      );
      if (popularAvatarElement.length) {
        const avatarSrc = popularAvatarElement.attr('src');
        if (avatarSrc) {
          const coverUrl = avatarSrc.startsWith('http')
            ? avatarSrc
            : `${this.site}${avatarSrc}`;
          console.log(`✅ Found author avatar (popular): ${coverUrl}`);
          return coverUrl;
        }
      }

      // Additional fallback for parse novel (alternative avatar selectors)
      const altAvatarElement = cheerioElement.find(
        '.avatar img, .message-userContent img[src*="/data/avatar/"]',
      );
      if (altAvatarElement.length) {
        const avatarSrc = altAvatarElement.attr('src');
        if (avatarSrc) {
          const coverUrl = avatarSrc.startsWith('http')
            ? avatarSrc
            : `${this.site}${avatarSrc}`;
          console.log(`✅ Found author avatar (alternative): ${coverUrl}`);
          return coverUrl;
        }
      }

      console.log(`⚠️ No cover found, using default`);
      return defaultCover;
    } catch (error) {
      console.log(`⚠️ Error finding cover: ${error}`);
      return defaultCover;
    }
  }

  // Specific method for parseNovel to find the best cover
  private findBestCoverForParseNovel(cheerioInstance: any): string {
    try {
      // First, look for threadmark index icon (story cover) - this should be prioritized
      const threadmarkIcon = cheerioInstance(
        '.threadmarkListingHeader-icon img.threadmarkIndexIcon',
      );
      if (threadmarkIcon.length) {
        const iconSrc = threadmarkIcon.attr('src');
        if (iconSrc) {
          const coverUrl = iconSrc.startsWith('http')
            ? iconSrc
            : `${this.site}${iconSrc}`;
          console.log(`✅ Found threadmark index icon: ${coverUrl}`);
          return coverUrl;
        }
      }

      // Fallback to author's avatar in message-avatar
      const authorAvatar = cheerioInstance('.message-avatar img.avatar-u');
      if (authorAvatar.length) {
        const avatarSrc = authorAvatar.attr('src');
        if (avatarSrc) {
          const coverUrl = avatarSrc.startsWith('http')
            ? avatarSrc
            : `${this.site}${avatarSrc}`;
          console.log(`✅ Found author avatar: ${coverUrl}`);
          return coverUrl;
        }
      }

      // Additional fallback for any avatar in the page
      const anyAvatar = cheerioInstance('.avatar img[src*="/data/avatar/"]');
      if (anyAvatar.length) {
        const avatarSrc = anyAvatar.attr('src');
        if (avatarSrc) {
          const coverUrl = avatarSrc.startsWith('http')
            ? avatarSrc
            : `${this.site}${avatarSrc}`;
          console.log(`✅ Found any avatar: ${coverUrl}`);
          return coverUrl;
        }
      }

      console.log(`⚠️ No cover found in parseNovel context, using default`);
      return defaultCover;
    } catch (error) {
      console.log(`⚠️ Error finding cover in parseNovel: ${error}`);
      return defaultCover;
    }
  }

  async popularNovels(
    pageNo: number,
    {
      showLatestNovels,
      filters,
    }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    const novels: Plugin.NovelItem[] = [];

    try {
      console.log('SPACEBATTLES POPULAR NOVELS CALLED');
      console.log(`📚 Fetching popular novels for page ${pageNo}`);

      // Use the correct URL for popular threads with proper sorting
      let url;
      if (pageNo === 1) {
        // Use the URL that shows most popular threads
        url = `${this.site}/forums/creative-writing.18/?order=view_count`;
      } else {
        // For subsequent pages, add page parameter
        url = `${this.site}/forums/creative-writing.18/page-${pageNo}?order=view_count`;
      }

      console.log(`🔍 Using popular threads URL: ${url}`);

      const result = await fetchApi(url);
      if (!result.ok) {
        console.log(`❌ Failed to fetch: ${result.status}`);
        return novels;
      }

      const body = await result.text();

      const loadedCheerio = loadCheerio(body);

      console.log(`📄 Fetched ${body.length} characters of forum page`);

      // Find thread items - using the correct SpaceBattles structure
      const threadElements = loadedCheerio('.structItem--thread');
      console.log(`🔍 Found ${threadElements.length} thread elements`);

      // Process each thread element
      threadElements.each((_, element) => {
        const threadElement = loadedCheerio(element);

        // Skip sticky threads (they have .structItem-status--sticky)
        if (threadElement.find('.structItem-status--sticky').length > 0) {
          return;
        }

        // Find the title link within this thread element
        const titleElement = threadElement.find('.structItem-title a');
        const title = titleElement.text().trim();
        const path = titleElement.attr('href');

        if (title && path) {
          // Clean up the path - remove leading/trailing slashes and ensure it's just the thread ID
          const cleanPath = path
            .replace(/^\/threads\//, '')
            .replace(/^\//, '')
            .replace(/\/$/, '');

          // Use the helper method to find the best cover
          const coverUrl = this.findBestCover(threadElement);

          console.log(`✅ Found novel: ${title}`);
          novels.push({
            name: title,
            path: cleanPath,
            cover: coverUrl,
          });
        }
      });

      console.log(
        `🎉 Popular novels fetch complete: ${novels.length} novels found`,
      );
    } catch (error) {
      console.error('Error fetching popular novels:', error);
    }

    return novels;
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: 'Untitled',
    };

    try {
      // Get the main thread page for author/avatar info
      let mainThreadUrl = isUrlAbsolute(novelPath)
        ? novelPath
        : this.resolveUrl(novelPath, true);

      // If the URL already contains /threadmarks, remove it to get the main thread page
      if (mainThreadUrl.includes('/threadmarks')) {
        mainThreadUrl = mainThreadUrl.replace(/\/threadmarks.*$/, '');
      }

      console.log(`📖 Fetching main thread page: ${mainThreadUrl}`);
      const mainThreadBody = await fetchApi(mainThreadUrl).then(r => r.text());
      let mainThreadCheerio = loadCheerio(mainThreadBody);

      // Get the threadmarks page for chapters
      const threadmarksUrl = mainThreadUrl.replace(/\/$/, '') + '/threadmarks';
      console.log(`📚 Fetching threadmarks page: ${threadmarksUrl}`);
      const threadmarksBody = await fetchApi(threadmarksUrl).then(r =>
        r.text(),
      );
      let threadmarksCheerio = loadCheerio(threadmarksBody);

      // Extract novel information from main thread page
      const titleElement = mainThreadCheerio('.p-title-value');
      if (titleElement.length) {
        novel.name = titleElement.text().trim();
      }

      // Extract author from thread starter - try multiple approaches
      let author = '';

      // Try data-author attribute first
      const authorElement = mainThreadCheerio('[data-author]');
      if (authorElement.length) {
        author = authorElement.attr('data-author') || '';
        console.log(`✅ Found author via data-author: ${author}`);
      }

      // If not found, try looking for the thread starter's username
      if (!author) {
        const threadStarter = mainThreadCheerio(
          '.message-userContent .username',
        );
        if (threadStarter.length) {
          author = threadStarter.text().trim();
          console.log(`✅ Found author via username: ${author}`);
        }
      }

      // If still not found, try the first post's author
      if (!author) {
        const firstPostAuthor = mainThreadCheerio(
          '.structItem-cell--main .username',
        );
        if (firstPostAuthor.length) {
          author = firstPostAuthor.text().trim();
          console.log(`✅ Found author via first post: ${author}`);
        }
      }

      novel.author = author;
      console.log(`📝 Final author: ${author}`);

      // Use a specific method for parseNovel to find the best cover
      console.log(`🔍 Looking for cover in parseNovel context`);
      const coverUrl = this.findBestCoverForParseNovel(mainThreadCheerio);
      novel.cover = coverUrl;

      // Extract genres from thread title and tags
      const title = novel.name.toLowerCase();
      const genres: string[] = [];

      if (title.indexOf('crossover') !== -1) genres.push('Crossover');
      if (title.indexOf('si') !== -1) genres.push('Self-Insert');
      if (title.indexOf('oc') !== -1) genres.push('Original Character');
      if (title.indexOf('alt-power') !== -1) genres.push('Alt-Power');
      if (title.indexOf('au') !== -1) genres.push('Alternate Universe');
      if (title.indexOf('fic') !== -1) genres.push('Fanfiction');
      if (title.indexOf('story') !== -1) genres.push('Story');

      if (genres.length > 0) {
        novel.genres = genres.join(', ');
      }

      // Extract summary from first post on main thread page
      const firstPost = mainThreadCheerio('.message-body').first();
      if (firstPost.length) {
        const summary = firstPost.text().substring(0, 500).trim();
        novel.summary = summary + (summary.length >= 500 ? '...' : '');
      }

      novel.status = NovelStatus.Ongoing;

      // Extract chapters from all threadmarks pages
      const chapters: Plugin.ChapterItem[] = [];
      let chapterNumber = 1;
      const processedPostIds = new Set<string>(); // Track processed post IDs to avoid duplicates

      console.log('📚 Extracting threadmarks from all pages...');

      // Function to extract chapters from a single page
      const extractChaptersFromPage = (
        pageCheerio: any,
        pageNumber: number,
      ) => {
        console.log(`📄 Processing threadmarks page ${pageNumber}...`);
        let pageChapters = 0;

        pageCheerio('.structItem--threadmark').each(
          (index: number, element: any) => {
            const threadmarkElement = pageCheerio(element);

            // Skip filler elements (three dots)
            if (threadmarkElement.hasClass('structItem--threadmark-filler')) {
              return;
            }

            // Get threadmark title
            const titleLink = threadmarkElement.find('.structItem-title a');
            const chapterTitle = titleLink.text().trim();
            const chapterUrl = titleLink.attr('href');

            // Skip if no title or URL
            if (!chapterTitle || !chapterUrl) return;

            // Get post ID from URL
            const postId = chapterUrl.split('#post-')[1];
            if (!postId) return;

            // Skip if we've already processed this post ID
            if (processedPostIds.has(postId)) {
              return;
            }

            // Mark this post ID as processed
            processedPostIds.add(postId);

            // Get author from data attribute
            const author =
              threadmarkElement.attr('data-content-author') || 'Unknown';

            // Get date from the time element
            const timeElement = threadmarkElement.find(
              '.structItem-latestDate',
            );
            const postDate = timeElement.length
              ? timeElement.text().trim()
              : '';

            // Create chapter from threadmark - use the full URL from the threadmark link
            // Extract the path part from the full URL (remove the site prefix)
            const fullUrl = chapterUrl.startsWith('http')
              ? chapterUrl
              : `${this.site}${chapterUrl}`;
            const chapterPath = fullUrl
              .replace(this.site, '')
              .replace(/^\//, '');

            const chapter: Plugin.ChapterItem = {
              name: chapterTitle,
              path: chapterPath,
              releaseTime: postDate,
              chapterNumber: chapterNumber,
            };

            chapters.push(chapter);
            chapterNumber++;
            pageChapters++;
          },
        );

        console.log(`✅ Found ${pageChapters} chapters on page ${pageNumber}`);
        return pageChapters;
      };

      // Start with the first page
      let currentPage = 1;
      let hasMorePages = true;
      let totalChapters = 0;

      while (hasMorePages && currentPage <= 10) {
        // Safety limit of 10 pages
        const pageUrl =
          currentPage === 1
            ? threadmarksUrl
            : `${threadmarksUrl}?per_page=25&page=${currentPage}`;

        console.log(`📖 Fetching threadmarks page ${currentPage}: ${pageUrl}`);
        const pageBody = await fetchApi(pageUrl).then(r => r.text());
        const pageCheerio = loadCheerio(pageBody);

        // Extract chapters from this page
        const pageChapters = extractChaptersFromPage(pageCheerio, currentPage);
        totalChapters += pageChapters;

        // Check if there are more pages by looking for pagination links
        const nextPageLink = pageCheerio('a[href*="page="]').filter((_, el) => {
          const href = pageCheerio(el).attr('href');
          return Boolean(href && href.includes(`page=${currentPage + 1}`));
        });

        if (nextPageLink.length > 0 && pageChapters > 0) {
          currentPage++;
          console.log(
            `🔄 Found next page, continuing to page ${currentPage}...`,
          );
        } else {
          hasMorePages = false;
          console.log(`✅ No more pages found or no chapters on current page`);
        }
      }

      console.log(`📊 Total chapters extracted: ${totalChapters}`);

      // Now auto-expand to get ALL threadmarks
      console.log(`🔄 Starting auto-expansion to get all threadmarks...`);

      // Keep expanding until no more filler elements
      let hasMoreFillers = true;
      let expansionCount = 0;
      let processedUrls = new Set(); // Track which URLs we've already processed
      let currentCheerio = threadmarksCheerio; // Start with the threadmarks cheerio instance

      while (hasMoreFillers && expansionCount < 10) {
        // Safety limit
        const fillerElements = currentCheerio('.structItem--threadmark-filler');
        console.log(
          `🔄 Found ${fillerElements.length} filler elements to expand (iteration ${expansionCount + 1})`,
        );

        if (fillerElements.length === 0) {
          hasMoreFillers = false;
          break;
        }

        let processedAny = false;
        let newContent = ''; // Collect new content to merge

        // Process each filler element sequentially
        for (
          let fillerIndex = 0;
          fillerIndex < fillerElements.length;
          fillerIndex++
        ) {
          const fillerElement = fillerElements.eq(fillerIndex);
          const fetchUrl = fillerElement
            .find('[data-fetchurl]')
            .attr('data-fetchurl');

          if (fetchUrl && !processedUrls.has(fetchUrl)) {
            console.log(`🔄 Expanding filler ${fillerIndex + 1}: ${fetchUrl}`);
            processedUrls.add(fetchUrl);

            try {
              const expandUrl = `${this.site}${fetchUrl}`;
              const expandResponse = await fetchApi(expandUrl);

              if (expandResponse.ok) {
                const expandData = await expandResponse.text();
                const expandCheerio = loadCheerio(expandData);
                const expandedThreadmarks = expandCheerio(
                  '.structItem--threadmark',
                );

                console.log(
                  `✅ Fetched ${expandedThreadmarks.length} threadmarks from filler ${fillerIndex + 1}`,
                );

                // Process expanded threadmarks
                let validThreadmarks = 0;
                expandedThreadmarks.each((index, element) => {
                  const threadmarkElement = expandCheerio(element);

                  // Skip filler elements (we'll handle them in the next iteration)
                  if (
                    threadmarkElement.hasClass('structItem--threadmark-filler')
                  ) {
                    return;
                  }

                  // Get threadmark title
                  const titleLink = threadmarkElement.find(
                    '.structItem-title a',
                  );
                  const chapterTitle = titleLink.text().trim();
                  const chapterUrl = titleLink.attr('href');

                  // Skip if no title or URL
                  if (!chapterTitle || !chapterUrl) return;

                  // Get post ID from URL
                  const postId = chapterUrl.split('#post-')[1];
                  if (!postId) return;

                  // Skip if we've already processed this post ID
                  if (processedPostIds.has(postId)) {
                    return;
                  }

                  // Mark this post ID as processed
                  processedPostIds.add(postId);

                  // Get author from data attribute
                  const author =
                    threadmarkElement.attr('data-content-author') || 'Unknown';

                  // Get date from the time element
                  const timeElement = threadmarkElement.find(
                    '.structItem-latestDate',
                  );
                  const postDate = timeElement.length
                    ? timeElement.text().trim()
                    : '';

                  // Create chapter from threadmark - use the full URL from the threadmark link
                  // Extract the path part from the full URL (remove the site prefix)
                  const fullUrl = chapterUrl.startsWith('http')
                    ? chapterUrl
                    : `${this.site}${chapterUrl}`;
                  const chapterPath = fullUrl
                    .replace(this.site, '')
                    .replace(/^\//, '');

                  const chapter: Plugin.ChapterItem = {
                    name: chapterTitle,
                    path: chapterPath,
                    releaseTime: postDate,
                    chapterNumber: chapterNumber,
                  };
                  chapters.push(chapter);
                  chapterNumber++;
                  validThreadmarks++;
                });

                console.log(
                  `✅ Added ${validThreadmarks} valid chapters from filler ${fillerIndex + 1}`,
                );
                processedAny = true;

                // Add the expanded content to our collection for merging
                newContent += expandData;
              } else {
                console.log(
                  `❌ Failed to fetch threadmarks from filler ${fillerIndex + 1}`,
                );
              }
            } catch (error) {
              console.error(
                `Error expanding filler ${fillerIndex + 1}:`,
                error,
              );
            }
          } else if (processedUrls.has(fetchUrl)) {
            console.log(`⏭️ Skipping already processed filler: ${fetchUrl}`);
          }
        }

        // If we processed any fillers, merge the new content to find new filler elements
        if (processedAny && newContent) {
          const mergedHtml = currentCheerio.html() + newContent;
          currentCheerio = loadCheerio(mergedHtml);
          console.log(`🔄 Merged expanded content to find new filler elements`);
        }

        // If we didn't process any new fillers, we're done
        if (!processedAny) {
          console.log('✅ No new fillers to process, stopping expansion');
          hasMoreFillers = false;
        }

        expansionCount++;
      }

      console.log(
        `✅ Auto-expansion complete: total ${chapters.length} chapters after ${expansionCount} iterations`,
      );

      // Sort chapters by post date to get correct chronological order
      console.log(`🔄 Sorting chapters by post date...`);
      chapters.sort((a, b) => {
        const postIdA = a.path.includes('#post-')
          ? parseInt(a.path.split('#post-')[1]) || 0
          : 0;
        const postIdB = b.path.includes('#post-')
          ? parseInt(b.path.split('#post-')[1]) || 0
          : 0;
        return postIdA - postIdB; // Sort by post ID (which correlates with date)
      });

      // Reassign chapter numbers after sorting
      chapters.forEach((chapter, index) => {
        chapter.chapterNumber = index + 1;
      });

      console.log(`✅ Chapters sorted chronologically`);

      novel.chapters = chapters;
    } catch (error) {
      console.error('Error parsing novel:', error);
    }

    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    try {
      const url = isUrlAbsolute(chapterPath)
        ? chapterPath
        : this.resolveUrl(chapterPath, true);
      const body = await fetchApi(url).then(r => r.text());
      const loadedCheerio = loadCheerio(body);

      // Extract chapter content
      let chapterText = '';

      if (chapterPath.indexOf('#post-') !== -1) {
        // Parse specific post
        const postId = chapterPath.split('#post-')[1];
        const postElement = loadedCheerio(`#js-post-${postId} .message-body`);
        if (postElement.length) {
          chapterText = this.convertBBCodeToHTML(postElement.html() || '');
        }
      } else {
        // Parse all posts in thread
        loadedCheerio('.message-body').each((_, element) => {
          const postElement = loadedCheerio(element);
          const postContent = this.convertBBCodeToHTML(
            postElement.html() || '',
          );
          chapterText += postContent + '\n\n---\n\n';
        });
      }

      return chapterText || 'Chapter content not found.';
    } catch (error) {
      console.error('Error parsing chapter:', error);
      return 'Error loading chapter content.';
    }
  }

  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    const novels: Plugin.NovelItem[] = [];

    try {
      console.log('SPACEBATTLES SEARCH NOVELS CALLED');
      console.log(`🔍 Searching for "${searchTerm}" on page ${pageNo}`);

      let body: string = '';
      let loadedCheerio: any;
      let searchId = '';

      // Use + for spaces instead of %20 to match the website's URL format
      const encodedSearchTerm = searchTerm.replace(/\s+/g, '+');

      if (pageNo === 1) {
        // First page - get search ID and perform initial search
        console.log(
          `📤 Using advanced search GET approach for "${searchTerm}"`,
        );

        // First, get a search ID
        const initialSearchUrl = `${this.site}/search/search?q=${encodedSearchTerm}&t=post&c[nodes][0]=18&c[threadmark_only]=1&c[title_only]=1&o=word_count`;
        const initialResponse = await fetchApi(initialSearchUrl);

        if (!initialResponse.ok) {
          throw new Error(`Initial search failed: ${initialResponse.status}`);
        }

        const initialBody = await initialResponse.text();

        // Extract search ID from the response
        const initialSearchIdMatch = initialBody.match(/\/search\/(\d+)\//);
        if (initialSearchIdMatch) {
          searchId = initialSearchIdMatch[1];
          console.log(`🔍 Found search ID: ${searchId}`);
        } else {
          console.log(`⚠️ No search ID found, using direct search`);
        }

        // Use the search ID for the actual search
        const searchUrl = searchId
          ? `${this.site}/search/${searchId}/?q=${encodedSearchTerm}&t=post&c[nodes][0]=18&c[threadmark_only]=1&c[title_only]=1&o=word_count`
          : initialSearchUrl;

        const response = await fetchApi(searchUrl);

        if (!response.ok) {
          console.log(`❌ Search failed: ${response.status}`);
          return novels;
        }

        body = await response.text();
        console.log(`✅ Search successful (${body.length} chars)`);

        // Extract search ID for pagination (in case it wasn't found in initial response)
        const searchIdMatch = body.match(/\/search\/(\d+)\//);
        if (searchIdMatch && !searchId) {
          searchId = searchIdMatch[1];
          console.log(`🔍 Found search ID from search response: ${searchId}`);
        }

        loadedCheerio = loadCheerio(body);
        console.log(`📄 Fetched ${body.length} characters of search results`);
      } else {
        // Handle Pagination - use the search ID approach with correct format
        console.log(
          `📄 Fetching page ${pageNo} - using search ID with ?page parameter`,
        );

        // First, get the search ID from the initial search (without page parameter)
        const firstPageUrl = `${this.site}/search/search?q=${encodedSearchTerm}&t=post&c[nodes][0]=18&c[threadmark_only]=1&c[title_only]=1&o=word_count`;
        const firstPageResponse = await fetchApi(firstPageUrl);

        if (!firstPageResponse.ok) {
          console.log(
            `❌ Failed to get search ID for pagination: ${firstPageResponse.status}`,
          );
          return novels;
        }

        const firstPageBody = await firstPageResponse.text();
        const searchIdMatch = firstPageBody.match(/\/search\/(\d+)\//);

        if (searchIdMatch) {
          const searchId = searchIdMatch[1];
          console.log(`🔍 Found search ID for pagination: ${searchId}`);

          // Use the search ID with the page parameter
          const searchUrl = `${this.site}/search/${searchId}/?page=${pageNo}&q=${encodedSearchTerm}&t=post&c[nodes][0]=18&c[threadmark_only]=1&c[title_only]=1&o=word_count`;

          const response = await fetchApi(searchUrl);
          if (!response.ok) {
            console.log(`❌ Pagination failed: ${response.status}`);
            return novels;
          }

          body = await response.text();
          loadedCheerio = loadCheerio(body);
          console.log(
            `📄 Fetched ${body.length} characters of search results for page ${pageNo}`,
          );
        } else {
          console.log(`❌ Could not find search ID for pagination`);
          return novels;
        }
      }

      // Parse search results
      let foundCount = 0;
      const seenPaths = new Set(); // Track unique paths to avoid duplicates

      console.log(`🔍 Parsing search results...`);

      // Find thread links in search results
      const threadLinks = loadedCheerio('a[href*="/threads/"]');
      console.log(
        `🔍 Found ${threadLinks.length} thread links in search results`,
      );

      threadLinks.each((_: number, element: any) => {
        const linkElement = loadedCheerio(element);
        const href = linkElement.attr('href');
        const title = linkElement.text().trim();

        if (
          title &&
          href &&
          href.includes('/threads/') &&
          !href.includes('#js-') &&
          !href.includes('/threadmarks')
        ) {
          // Skip if we've already seen this path
          if (seenPaths.has(href)) {
            return;
          }

          seenPaths.add(href);

          // Clean up the path - remove leading/trailing slashes and ensure it's just the thread ID
          // For post-specific URLs, extract just the thread part
          let cleanPath = href
            .replace(/^\/threads\//, '')
            .replace(/^\//, '')
            .replace(/\/$/, '');

          // If it's a post-specific URL, extract just the thread ID
          if (cleanPath.includes('#post-')) {
            cleanPath = cleanPath.split('#post-')[0];
          }

          // Remove any page numbers from the path (e.g., /page-3)
          cleanPath = cleanPath.replace(/\/page-\d+$/, '');

          // Since we're using advanced search with forum constraint and title-only,
          // we can trust that the results are already filtered appropriately
          // Just skip obvious non-thread results
          if (
            cleanPath.includes('the-spacebattles-library-is-now-open') ||
            cleanPath.includes('creative-writing-library') ||
            cleanPath.includes('forum-rules') ||
            cleanPath.includes('announcement') ||
            cleanPath.includes('sticky')
          ) {
            return;
          }

          // Use the helper method to find the best cover
          const parentElement = linkElement.closest('.contentRow, .structItem');
          const coverUrl =
            parentElement.length > 0
              ? this.findBestCover(parentElement)
              : defaultCover;

          console.log(`✅ Found novel: ${title} (${cleanPath})`);
          novels.push({
            name: title,
            path: cleanPath,
            cover: coverUrl,
          });
          foundCount++;
        }
      });

      console.log(
        `✅ Found ${foundCount} non-sticky threads for "${searchTerm}" on page ${pageNo}`,
      );
    } catch (error) {
      console.error('Error searching novels:', error);
    }

    return novels;
  }

  resolveUrl = (path: string, isNovel?: boolean) => {
    // If the path already starts with 'threads/' or 'posts/', don't add it again
    if (path.startsWith('threads/') || path.startsWith('posts/')) {
      return this.site + '/' + path;
    }
    return this.site + '/' + (isNovel ? 'threads/' : 'posts/') + path;
  };

  // Helper function to convert BBCode to HTML
  private convertBBCodeToHTML(bbcode: string): string {
    if (!bbcode) return '';

    let html = bbcode
      // Convert BBCode to HTML
      .replace(/\[b\](.*?)\[\/b\]/g, '<strong>$1</strong>')
      .replace(/\[i\](.*?)\[\/i\]/g, '<em>$1</em>')
      .replace(/\[u\](.*?)\[\/u\]/g, '<u>$1</u>')
      .replace(/\[url\](.*?)\[\/url\]/g, '<a href="$1">$1</a>')
      .replace(/\[url=(.*?)\](.*?)\[\/url\]/g, '<a href="$1">$2</a>')
      .replace(/\[quote\](.*?)\[\/quote\]/g, '<blockquote>$1</blockquote>')
      .replace(
        /\[spoiler\](.*?)\[\/spoiler\]/g,
        '<details><summary>Spoiler</summary>$1</details>',
      )
      .replace(/\[code\](.*?)\[\/code\]/g, '<pre><code>$1</code></pre>')
      .replace(
        /\[color=(.*?)\](.*?)\[\/color\]/g,
        '<span style="color: $1">$2</span>',
      )
      .replace(
        /\[size=(.*?)\](.*?)\[\/size\]/g,
        '<span style="font-size: $1">$2</span>',
      )
      // Remove remaining BBCode tags
      .replace(/\[.*?\]/g, '')
      // Clean up extra whitespace
      .replace(/\n\s*\n/g, '\n\n')
      .trim();

    return html;
  }
}

export default new SpaceBattlesPlugin();
