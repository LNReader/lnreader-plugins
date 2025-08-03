"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = require("@libs/fetch");
var cheerio_1 = require("cheerio");
var defaultCover_1 = require("@libs/defaultCover");
var novelStatus_1 = require("@libs/novelStatus");
var isAbsoluteUrl_1 = require("@libs/isAbsoluteUrl");
var SpaceBattlesPlugin = /** @class */ (function () {
    function SpaceBattlesPlugin() {
        var _this = this;
        this.id = 'spacebattles';
        this.name = 'SpaceBattlesUnofficial';
        this.icon = 'src/en/spacebattles/icon.png';
        this.site = 'https://forums.spacebattles.com';
        this.version = '1.0.0';
        this.filters = undefined;
        this.imageRequestInit = undefined;
        this.resolveUrl = function (path, isNovel) {
            // If the path already starts with 'threads/' or 'posts/', don't add it again
            if (path.startsWith('threads/') || path.startsWith('posts/')) {
                return _this.site + '/' + path;
            }
            return _this.site + '/' + (isNovel ? 'threads/' : 'posts/') + path;
        };
        console.log('SPACEBATTLES PLUGIN LOADED');
    }
    // Helper method to find the best cover (story cover prioritized over author avatar)
    SpaceBattlesPlugin.prototype.findBestCover = function (cheerioElement) {
        try {
            // First, look for story cover (threadmark index icon)
            var storyIconElement = cheerioElement.find('img[src*="/data/threadmark-index-icons/"][class*="threadmarkIndexIcon"]');
            if (storyIconElement.length) {
                var storyIconSrc = storyIconElement.attr('src');
                if (storyIconSrc) {
                    var coverUrl = storyIconSrc.startsWith('http') ? storyIconSrc : "".concat(this.site).concat(storyIconSrc);
                    console.log("\u2705 Found story cover: ".concat(coverUrl));
                    return coverUrl;
                }
            }
            // Fallback to author's avatar
            var avatarElement = cheerioElement.find('img[src*="/data/avatar/"][class*="avatar-u"]');
            if (avatarElement.length) {
                var avatarSrc = avatarElement.attr('src');
                if (avatarSrc) {
                    var coverUrl = avatarSrc.startsWith('http') ? avatarSrc : "".concat(this.site).concat(avatarSrc);
                    console.log("\u2705 Found author avatar: ".concat(coverUrl));
                    return coverUrl;
                }
            }
            // Additional fallback for popular novels (different avatar structure)
            var popularAvatarElement = cheerioElement.find('.structItem-cell--icon .avatar img');
            if (popularAvatarElement.length) {
                var avatarSrc = popularAvatarElement.attr('src');
                if (avatarSrc) {
                    var coverUrl = avatarSrc.startsWith('http') ? avatarSrc : "".concat(this.site).concat(avatarSrc);
                    console.log("\u2705 Found author avatar (popular): ".concat(coverUrl));
                    return coverUrl;
                }
            }
            // Additional fallback for parse novel (alternative avatar selectors)
            var altAvatarElement = cheerioElement.find('.avatar img, .message-userContent img[src*="/data/avatar/"]');
            if (altAvatarElement.length) {
                var avatarSrc = altAvatarElement.attr('src');
                if (avatarSrc) {
                    var coverUrl = avatarSrc.startsWith('http') ? avatarSrc : "".concat(this.site).concat(avatarSrc);
                    console.log("\u2705 Found author avatar (alternative): ".concat(coverUrl));
                    return coverUrl;
                }
            }
            console.log("\u26A0\uFE0F No cover found, using default");
            return defaultCover_1.defaultCover;
        }
        catch (error) {
            console.log("\u26A0\uFE0F Error finding cover: ".concat(error));
            return defaultCover_1.defaultCover;
        }
    };
    // Specific method for parseNovel to find the best cover
    SpaceBattlesPlugin.prototype.findBestCoverForParseNovel = function (cheerioInstance) {
        try {
            // First, look for threadmark index icon (story cover) - this should be prioritized
            var threadmarkIcon = cheerioInstance('.threadmarkListingHeader-icon img.threadmarkIndexIcon');
            if (threadmarkIcon.length) {
                var iconSrc = threadmarkIcon.attr('src');
                if (iconSrc) {
                    var coverUrl = iconSrc.startsWith('http') ? iconSrc : "".concat(this.site).concat(iconSrc);
                    console.log("\u2705 Found threadmark index icon: ".concat(coverUrl));
                    return coverUrl;
                }
            }
            // Fallback to author's avatar in message-avatar
            var authorAvatar = cheerioInstance('.message-avatar img.avatar-u');
            if (authorAvatar.length) {
                var avatarSrc = authorAvatar.attr('src');
                if (avatarSrc) {
                    var coverUrl = avatarSrc.startsWith('http') ? avatarSrc : "".concat(this.site).concat(avatarSrc);
                    console.log("\u2705 Found author avatar: ".concat(coverUrl));
                    return coverUrl;
                }
            }
            // Additional fallback for any avatar in the page
            var anyAvatar = cheerioInstance('.avatar img[src*="/data/avatar/"]');
            if (anyAvatar.length) {
                var avatarSrc = anyAvatar.attr('src');
                if (avatarSrc) {
                    var coverUrl = avatarSrc.startsWith('http') ? avatarSrc : "".concat(this.site).concat(avatarSrc);
                    console.log("\u2705 Found any avatar: ".concat(coverUrl));
                    return coverUrl;
                }
            }
            console.log("\u26A0\uFE0F No cover found in parseNovel context, using default");
            return defaultCover_1.defaultCover;
        }
        catch (error) {
            console.log("\u26A0\uFE0F Error finding cover in parseNovel: ".concat(error));
            return defaultCover_1.defaultCover;
        }
    };
    SpaceBattlesPlugin.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var novels, url, result, body, loadedCheerio_1, threadElements, error_1;
            var _this = this;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        novels = [];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 5]);
                        console.log('SPACEBATTLES POPULAR NOVELS CALLED');
                        console.log("\uD83D\uDCDA Fetching popular novels for page ".concat(pageNo));
                        url = void 0;
                        if (pageNo === 1) {
                            // Use the URL that shows most popular threads
                            url = "".concat(this.site, "/forums/creative-writing.18/?order=view_count");
                        }
                        else {
                            // For subsequent pages, add page parameter
                            url = "".concat(this.site, "/forums/creative-writing.18/page-").concat(pageNo, "?order=view_count");
                        }
                        console.log("\uD83D\uDD0D Using popular threads URL: ".concat(url));
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url)];
                    case 2:
                        result = _c.sent();
                        if (!result.ok) {
                            console.log("\u274C Failed to fetch: ".concat(result.status));
                            return [2 /*return*/, novels];
                        }
                        return [4 /*yield*/, result.text()];
                    case 3:
                        body = _c.sent();
                        loadedCheerio_1 = (0, cheerio_1.load)(body);
                        console.log("\uD83D\uDCC4 Fetched ".concat(body.length, " characters of forum page"));
                        threadElements = loadedCheerio_1('.structItem--thread');
                        console.log("\uD83D\uDD0D Found ".concat(threadElements.length, " thread elements"));
                        // Process each thread element
                        threadElements.each(function (_, element) {
                            var threadElement = loadedCheerio_1(element);
                            // Skip sticky threads (they have .structItem-status--sticky)
                            if (threadElement.find('.structItem-status--sticky').length > 0) {
                                return;
                            }
                            // Find the title link within this thread element
                            var titleElement = threadElement.find('.structItem-title a');
                            var title = titleElement.text().trim();
                            var path = titleElement.attr('href');
                            if (title && path) {
                                // Clean up the path - remove leading/trailing slashes and ensure it's just the thread ID
                                var cleanPath = path.replace(/^\/threads\//, '').replace(/^\//, '').replace(/\/$/, '');
                                // Use the helper method to find the best cover
                                var coverUrl = _this.findBestCover(threadElement);
                                console.log("\u2705 Found novel: ".concat(title));
                                novels.push({
                                    name: title,
                                    path: cleanPath,
                                    cover: coverUrl,
                                });
                            }
                        });
                        console.log("\uD83C\uDF89 Popular novels fetch complete: ".concat(novels.length, " novels found"));
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _c.sent();
                        console.error('Error fetching popular novels:', error_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, novels];
                }
            });
        });
    };
    SpaceBattlesPlugin.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var novel, mainThreadUrl, mainThreadBody, mainThreadCheerio, threadmarksUrl, threadmarksBody, threadmarksCheerio, titleElement, author, authorElement, threadStarter, firstPostAuthor, coverUrl, title, genres, firstPost, summary, chapters_1, chapterNumber_1, processedPostIds_1, extractChaptersFromPage, currentPage_1, hasMorePages, totalChapters, _loop_1, hasMoreFillers, expansionCount, processedUrls, currentCheerio, fillerElements, processedAny, newContent, _loop_2, this_1, fillerIndex, mergedHtml, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        novel = {
                            path: novelPath,
                            name: 'Untitled',
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 13, , 14]);
                        mainThreadUrl = (0, isAbsoluteUrl_1.isUrlAbsolute)(novelPath) ? novelPath : this.resolveUrl(novelPath, true);
                        // If the URL already contains /threadmarks, remove it to get the main thread page
                        if (mainThreadUrl.includes('/threadmarks')) {
                            mainThreadUrl = mainThreadUrl.replace(/\/threadmarks.*$/, '');
                        }
                        console.log("\uD83D\uDCD6 Fetching main thread page: ".concat(mainThreadUrl));
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(mainThreadUrl).then(function (r) { return r.text(); })];
                    case 2:
                        mainThreadBody = _a.sent();
                        mainThreadCheerio = (0, cheerio_1.load)(mainThreadBody);
                        threadmarksUrl = mainThreadUrl.replace(/\/$/, '') + '/threadmarks';
                        console.log("\uD83D\uDCDA Fetching threadmarks page: ".concat(threadmarksUrl));
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(threadmarksUrl).then(function (r) { return r.text(); })];
                    case 3:
                        threadmarksBody = _a.sent();
                        threadmarksCheerio = (0, cheerio_1.load)(threadmarksBody);
                        titleElement = mainThreadCheerio('.p-title-value');
                        if (titleElement.length) {
                            novel.name = titleElement.text().trim();
                        }
                        author = '';
                        authorElement = mainThreadCheerio('[data-author]');
                        if (authorElement.length) {
                            author = authorElement.attr('data-author') || '';
                            console.log("\u2705 Found author via data-author: ".concat(author));
                        }
                        // If not found, try looking for the thread starter's username
                        if (!author) {
                            threadStarter = mainThreadCheerio('.message-userContent .username');
                            if (threadStarter.length) {
                                author = threadStarter.text().trim();
                                console.log("\u2705 Found author via username: ".concat(author));
                            }
                        }
                        // If still not found, try the first post's author
                        if (!author) {
                            firstPostAuthor = mainThreadCheerio('.structItem-cell--main .username');
                            if (firstPostAuthor.length) {
                                author = firstPostAuthor.text().trim();
                                console.log("\u2705 Found author via first post: ".concat(author));
                            }
                        }
                        novel.author = author;
                        console.log("\uD83D\uDCDD Final author: ".concat(author));
                        // Use a specific method for parseNovel to find the best cover
                        console.log("\uD83D\uDD0D Looking for cover in parseNovel context");
                        coverUrl = this.findBestCoverForParseNovel(mainThreadCheerio);
                        novel.cover = coverUrl;
                        title = novel.name.toLowerCase();
                        genres = [];
                        if (title.indexOf('crossover') !== -1)
                            genres.push('Crossover');
                        if (title.indexOf('si') !== -1)
                            genres.push('Self-Insert');
                        if (title.indexOf('oc') !== -1)
                            genres.push('Original Character');
                        if (title.indexOf('alt-power') !== -1)
                            genres.push('Alt-Power');
                        if (title.indexOf('au') !== -1)
                            genres.push('Alternate Universe');
                        if (title.indexOf('fic') !== -1)
                            genres.push('Fanfiction');
                        if (title.indexOf('story') !== -1)
                            genres.push('Story');
                        if (genres.length > 0) {
                            novel.genres = genres.join(', ');
                        }
                        firstPost = mainThreadCheerio('.message-body').first();
                        if (firstPost.length) {
                            summary = firstPost.text().substring(0, 500).trim();
                            novel.summary = summary + (summary.length >= 500 ? '...' : '');
                        }
                        novel.status = novelStatus_1.NovelStatus.Ongoing;
                        chapters_1 = [];
                        chapterNumber_1 = 1;
                        processedPostIds_1 = new Set();
                        console.log('📚 Extracting threadmarks from all pages...');
                        extractChaptersFromPage = function (pageCheerio, pageNumber) {
                            console.log("\uD83D\uDCC4 Processing threadmarks page ".concat(pageNumber, "..."));
                            var pageChapters = 0;
                            pageCheerio('.structItem--threadmark').each(function (index, element) {
                                var threadmarkElement = pageCheerio(element);
                                // Skip filler elements (three dots)
                                if (threadmarkElement.hasClass('structItem--threadmark-filler')) {
                                    return;
                                }
                                // Get threadmark title
                                var titleLink = threadmarkElement.find('.structItem-title a');
                                var chapterTitle = titleLink.text().trim();
                                var chapterUrl = titleLink.attr('href');
                                // Skip if no title or URL
                                if (!chapterTitle || !chapterUrl)
                                    return;
                                // Get post ID from URL
                                var postId = chapterUrl.split('#post-')[1];
                                if (!postId)
                                    return;
                                // Skip if we've already processed this post ID
                                if (processedPostIds_1.has(postId)) {
                                    return;
                                }
                                // Mark this post ID as processed
                                processedPostIds_1.add(postId);
                                // Get author from data attribute
                                var author = threadmarkElement.attr('data-content-author') || 'Unknown';
                                // Get date from the time element
                                var timeElement = threadmarkElement.find('.structItem-latestDate');
                                var postDate = timeElement.length ? timeElement.text().trim() : '';
                                // Create chapter from threadmark - use the full URL from the threadmark link
                                // Extract the path part from the full URL (remove the site prefix)
                                var fullUrl = chapterUrl.startsWith('http') ? chapterUrl : "".concat(_this.site).concat(chapterUrl);
                                var chapterPath = fullUrl.replace(_this.site, '').replace(/^\//, '');
                                var chapter = {
                                    name: chapterTitle,
                                    path: chapterPath,
                                    releaseTime: postDate,
                                    chapterNumber: chapterNumber_1,
                                };
                                chapters_1.push(chapter);
                                chapterNumber_1++;
                                pageChapters++;
                            });
                            console.log("\u2705 Found ".concat(pageChapters, " chapters on page ").concat(pageNumber));
                            return pageChapters;
                        };
                        currentPage_1 = 1;
                        hasMorePages = true;
                        totalChapters = 0;
                        _loop_1 = function () {
                            var pageUrl, pageBody, pageCheerio, pageChapters, nextPageLink;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        pageUrl = currentPage_1 === 1
                                            ? threadmarksUrl
                                            : "".concat(threadmarksUrl, "?per_page=25&page=").concat(currentPage_1);
                                        console.log("\uD83D\uDCD6 Fetching threadmarks page ".concat(currentPage_1, ": ").concat(pageUrl));
                                        return [4 /*yield*/, (0, fetch_1.fetchApi)(pageUrl).then(function (r) { return r.text(); })];
                                    case 1:
                                        pageBody = _b.sent();
                                        pageCheerio = (0, cheerio_1.load)(pageBody);
                                        pageChapters = extractChaptersFromPage(pageCheerio, currentPage_1);
                                        totalChapters += pageChapters;
                                        nextPageLink = pageCheerio('a[href*="page="]').filter(function (_, el) {
                                            var href = pageCheerio(el).attr('href');
                                            return Boolean(href && href.includes("page=".concat(currentPage_1 + 1)));
                                        });
                                        if (nextPageLink.length > 0 && pageChapters > 0) {
                                            currentPage_1++;
                                            console.log("\uD83D\uDD04 Found next page, continuing to page ".concat(currentPage_1, "..."));
                                        }
                                        else {
                                            hasMorePages = false;
                                            console.log("\u2705 No more pages found or no chapters on current page");
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _a.label = 4;
                    case 4:
                        if (!(hasMorePages && currentPage_1 <= 10)) return [3 /*break*/, 6];
                        return [5 /*yield**/, _loop_1()];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 6:
                        console.log("\uD83D\uDCCA Total chapters extracted: ".concat(totalChapters));
                        // Now auto-expand to get ALL threadmarks
                        console.log("\uD83D\uDD04 Starting auto-expansion to get all threadmarks...");
                        hasMoreFillers = true;
                        expansionCount = 0;
                        processedUrls = new Set();
                        currentCheerio = threadmarksCheerio;
                        _a.label = 7;
                    case 7:
                        if (!(hasMoreFillers && expansionCount < 10)) return [3 /*break*/, 12];
                        fillerElements = currentCheerio('.structItem--threadmark-filler');
                        console.log("\uD83D\uDD04 Found ".concat(fillerElements.length, " filler elements to expand (iteration ").concat(expansionCount + 1, ")"));
                        if (fillerElements.length === 0) {
                            hasMoreFillers = false;
                            return [3 /*break*/, 12];
                        }
                        processedAny = false;
                        newContent = '';
                        _loop_2 = function (fillerIndex) {
                            var fillerElement, fetchUrl, expandUrl, expandResponse, expandData, expandCheerio_1, expandedThreadmarks, validThreadmarks_1, error_3;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        fillerElement = fillerElements.eq(fillerIndex);
                                        fetchUrl = fillerElement.find('[data-fetchurl]').attr('data-fetchurl');
                                        if (!(fetchUrl && !processedUrls.has(fetchUrl))) return [3 /*break*/, 8];
                                        console.log("\uD83D\uDD04 Expanding filler ".concat(fillerIndex + 1, ": ").concat(fetchUrl));
                                        processedUrls.add(fetchUrl);
                                        _c.label = 1;
                                    case 1:
                                        _c.trys.push([1, 6, , 7]);
                                        expandUrl = "".concat(this_1.site).concat(fetchUrl);
                                        return [4 /*yield*/, (0, fetch_1.fetchApi)(expandUrl)];
                                    case 2:
                                        expandResponse = _c.sent();
                                        if (!expandResponse.ok) return [3 /*break*/, 4];
                                        return [4 /*yield*/, expandResponse.text()];
                                    case 3:
                                        expandData = _c.sent();
                                        expandCheerio_1 = (0, cheerio_1.load)(expandData);
                                        expandedThreadmarks = expandCheerio_1('.structItem--threadmark');
                                        console.log("\u2705 Fetched ".concat(expandedThreadmarks.length, " threadmarks from filler ").concat(fillerIndex + 1));
                                        validThreadmarks_1 = 0;
                                        expandedThreadmarks.each(function (index, element) {
                                            var threadmarkElement = expandCheerio_1(element);
                                            // Skip filler elements (we'll handle them in the next iteration)
                                            if (threadmarkElement.hasClass('structItem--threadmark-filler')) {
                                                return;
                                            }
                                            // Get threadmark title
                                            var titleLink = threadmarkElement.find('.structItem-title a');
                                            var chapterTitle = titleLink.text().trim();
                                            var chapterUrl = titleLink.attr('href');
                                            // Skip if no title or URL
                                            if (!chapterTitle || !chapterUrl)
                                                return;
                                            // Get post ID from URL
                                            var postId = chapterUrl.split('#post-')[1];
                                            if (!postId)
                                                return;
                                            // Skip if we've already processed this post ID
                                            if (processedPostIds_1.has(postId)) {
                                                return;
                                            }
                                            // Mark this post ID as processed
                                            processedPostIds_1.add(postId);
                                            // Get author from data attribute
                                            var author = threadmarkElement.attr('data-content-author') || 'Unknown';
                                            // Get date from the time element
                                            var timeElement = threadmarkElement.find('.structItem-latestDate');
                                            var postDate = timeElement.length ? timeElement.text().trim() : '';
                                            // Create chapter from threadmark - use the full URL from the threadmark link
                                            // Extract the path part from the full URL (remove the site prefix)
                                            var fullUrl = chapterUrl.startsWith('http') ? chapterUrl : "".concat(_this.site).concat(chapterUrl);
                                            var chapterPath = fullUrl.replace(_this.site, '').replace(/^\//, '');
                                            var chapter = {
                                                name: chapterTitle,
                                                path: chapterPath,
                                                releaseTime: postDate,
                                                chapterNumber: chapterNumber_1,
                                            };
                                            chapters_1.push(chapter);
                                            chapterNumber_1++;
                                            validThreadmarks_1++;
                                        });
                                        console.log("\u2705 Added ".concat(validThreadmarks_1, " valid chapters from filler ").concat(fillerIndex + 1));
                                        processedAny = true;
                                        // Add the expanded content to our collection for merging
                                        newContent += expandData;
                                        return [3 /*break*/, 5];
                                    case 4:
                                        console.log("\u274C Failed to fetch threadmarks from filler ".concat(fillerIndex + 1));
                                        _c.label = 5;
                                    case 5: return [3 /*break*/, 7];
                                    case 6:
                                        error_3 = _c.sent();
                                        console.error("Error expanding filler ".concat(fillerIndex + 1, ":"), error_3);
                                        return [3 /*break*/, 7];
                                    case 7: return [3 /*break*/, 9];
                                    case 8:
                                        if (processedUrls.has(fetchUrl)) {
                                            console.log("\u23ED\uFE0F Skipping already processed filler: ".concat(fetchUrl));
                                        }
                                        _c.label = 9;
                                    case 9: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        fillerIndex = 0;
                        _a.label = 8;
                    case 8:
                        if (!(fillerIndex < fillerElements.length)) return [3 /*break*/, 11];
                        return [5 /*yield**/, _loop_2(fillerIndex)];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10:
                        fillerIndex++;
                        return [3 /*break*/, 8];
                    case 11:
                        // If we processed any fillers, merge the new content to find new filler elements
                        if (processedAny && newContent) {
                            mergedHtml = currentCheerio.html() + newContent;
                            currentCheerio = (0, cheerio_1.load)(mergedHtml);
                            console.log("\uD83D\uDD04 Merged expanded content to find new filler elements");
                        }
                        // If we didn't process any new fillers, we're done
                        if (!processedAny) {
                            console.log('✅ No new fillers to process, stopping expansion');
                            hasMoreFillers = false;
                        }
                        expansionCount++;
                        return [3 /*break*/, 7];
                    case 12:
                        console.log("\u2705 Auto-expansion complete: total ".concat(chapters_1.length, " chapters after ").concat(expansionCount, " iterations"));
                        // Sort chapters by post date to get correct chronological order
                        console.log("\uD83D\uDD04 Sorting chapters by post date...");
                        chapters_1.sort(function (a, b) {
                            var postIdA = a.path.includes('#post-') ? parseInt(a.path.split('#post-')[1]) || 0 : 0;
                            var postIdB = b.path.includes('#post-') ? parseInt(b.path.split('#post-')[1]) || 0 : 0;
                            return postIdA - postIdB; // Sort by post ID (which correlates with date)
                        });
                        // Reassign chapter numbers after sorting
                        chapters_1.forEach(function (chapter, index) {
                            chapter.chapterNumber = index + 1;
                        });
                        console.log("\u2705 Chapters sorted chronologically");
                        novel.chapters = chapters_1;
                        return [3 /*break*/, 14];
                    case 13:
                        error_2 = _a.sent();
                        console.error('Error parsing novel:', error_2);
                        return [3 /*break*/, 14];
                    case 14: return [2 /*return*/, novel];
                }
            });
        });
    };
    SpaceBattlesPlugin.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, body, loadedCheerio_2, chapterText_1, postId, postElement, error_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        url = (0, isAbsoluteUrl_1.isUrlAbsolute)(chapterPath) ? chapterPath : this.resolveUrl(chapterPath, true);
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(url).then(function (r) { return r.text(); })];
                    case 1:
                        body = _a.sent();
                        loadedCheerio_2 = (0, cheerio_1.load)(body);
                        chapterText_1 = '';
                        if (chapterPath.indexOf('#post-') !== -1) {
                            postId = chapterPath.split('#post-')[1];
                            postElement = loadedCheerio_2("#js-post-".concat(postId, " .message-body"));
                            if (postElement.length) {
                                chapterText_1 = this.convertBBCodeToHTML(postElement.html() || '');
                            }
                        }
                        else {
                            // Parse all posts in thread
                            loadedCheerio_2('.message-body').each(function (_, element) {
                                var postElement = loadedCheerio_2(element);
                                var postContent = _this.convertBBCodeToHTML(postElement.html() || '');
                                chapterText_1 += postContent + '\n\n---\n\n';
                            });
                        }
                        return [2 /*return*/, chapterText_1 || 'Chapter content not found.'];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error parsing chapter:', error_4);
                        return [2 /*return*/, 'Error loading chapter content.'];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SpaceBattlesPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var novels, body, loadedCheerio_3, searchId, encodedSearchTerm, initialSearchUrl, initialResponse, initialBody, initialSearchIdMatch, searchUrl, response, searchIdMatch, firstPageUrl, firstPageResponse, firstPageBody, searchIdMatch, searchId_1, searchUrl, response, foundCount_1, seenPaths_1, threadLinks, error_5;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        novels = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 13, , 14]);
                        console.log('SPACEBATTLES SEARCH NOVELS CALLED');
                        console.log("\uD83D\uDD0D Searching for \"".concat(searchTerm, "\" on page ").concat(pageNo));
                        body = '';
                        searchId = '';
                        encodedSearchTerm = searchTerm.replace(/\s+/g, '+');
                        if (!(pageNo === 1)) return [3 /*break*/, 6];
                        // First page - get search ID and perform initial search
                        console.log("\uD83D\uDCE4 Using advanced search GET approach for \"".concat(searchTerm, "\""));
                        initialSearchUrl = "".concat(this.site, "/search/search?q=").concat(encodedSearchTerm, "&t=post&c[nodes][0]=18&c[threadmark_only]=1&c[title_only]=1&o=word_count");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(initialSearchUrl)];
                    case 2:
                        initialResponse = _a.sent();
                        if (!initialResponse.ok) {
                            throw new Error("Initial search failed: ".concat(initialResponse.status));
                        }
                        return [4 /*yield*/, initialResponse.text()];
                    case 3:
                        initialBody = _a.sent();
                        initialSearchIdMatch = initialBody.match(/\/search\/(\d+)\//);
                        if (initialSearchIdMatch) {
                            searchId = initialSearchIdMatch[1];
                            console.log("\uD83D\uDD0D Found search ID: ".concat(searchId));
                        }
                        else {
                            console.log("\u26A0\uFE0F No search ID found, using direct search");
                        }
                        searchUrl = searchId
                            ? "".concat(this.site, "/search/").concat(searchId, "/?q=").concat(encodedSearchTerm, "&t=post&c[nodes][0]=18&c[threadmark_only]=1&c[title_only]=1&o=word_count")
                            : initialSearchUrl;
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(searchUrl)];
                    case 4:
                        response = _a.sent();
                        if (!response.ok) {
                            console.log("\u274C Search failed: ".concat(response.status));
                            return [2 /*return*/, novels];
                        }
                        return [4 /*yield*/, response.text()];
                    case 5:
                        body = _a.sent();
                        console.log("\u2705 Search successful (".concat(body.length, " chars)"));
                        searchIdMatch = body.match(/\/search\/(\d+)\//);
                        if (searchIdMatch && !searchId) {
                            searchId = searchIdMatch[1];
                            console.log("\uD83D\uDD0D Found search ID from search response: ".concat(searchId));
                        }
                        loadedCheerio_3 = (0, cheerio_1.load)(body);
                        console.log("\uD83D\uDCC4 Fetched ".concat(body.length, " characters of search results"));
                        return [3 /*break*/, 12];
                    case 6:
                        // Handle Pagination - use the search ID approach with correct format
                        console.log("\uD83D\uDCC4 Fetching page ".concat(pageNo, " - using search ID with ?page parameter"));
                        firstPageUrl = "".concat(this.site, "/search/search?q=").concat(encodedSearchTerm, "&t=post&c[nodes][0]=18&c[threadmark_only]=1&c[title_only]=1&o=word_count");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(firstPageUrl)];
                    case 7:
                        firstPageResponse = _a.sent();
                        if (!firstPageResponse.ok) {
                            console.log("\u274C Failed to get search ID for pagination: ".concat(firstPageResponse.status));
                            return [2 /*return*/, novels];
                        }
                        return [4 /*yield*/, firstPageResponse.text()];
                    case 8:
                        firstPageBody = _a.sent();
                        searchIdMatch = firstPageBody.match(/\/search\/(\d+)\//);
                        if (!searchIdMatch) return [3 /*break*/, 11];
                        searchId_1 = searchIdMatch[1];
                        console.log("\uD83D\uDD0D Found search ID for pagination: ".concat(searchId_1));
                        searchUrl = "".concat(this.site, "/search/").concat(searchId_1, "/?page=").concat(pageNo, "&q=").concat(encodedSearchTerm, "&t=post&c[nodes][0]=18&c[threadmark_only]=1&c[title_only]=1&o=word_count");
                        return [4 /*yield*/, (0, fetch_1.fetchApi)(searchUrl)];
                    case 9:
                        response = _a.sent();
                        if (!response.ok) {
                            console.log("\u274C Pagination failed: ".concat(response.status));
                            return [2 /*return*/, novels];
                        }
                        return [4 /*yield*/, response.text()];
                    case 10:
                        body = _a.sent();
                        loadedCheerio_3 = (0, cheerio_1.load)(body);
                        console.log("\uD83D\uDCC4 Fetched ".concat(body.length, " characters of search results for page ").concat(pageNo));
                        return [3 /*break*/, 12];
                    case 11:
                        console.log("\u274C Could not find search ID for pagination");
                        return [2 /*return*/, novels];
                    case 12:
                        foundCount_1 = 0;
                        seenPaths_1 = new Set();
                        console.log("\uD83D\uDD0D Parsing search results...");
                        threadLinks = loadedCheerio_3('a[href*="/threads/"]');
                        console.log("\uD83D\uDD0D Found ".concat(threadLinks.length, " thread links in search results"));
                        threadLinks.each(function (_, element) {
                            var linkElement = loadedCheerio_3(element);
                            var href = linkElement.attr('href');
                            var title = linkElement.text().trim();
                            if (title && href && href.includes('/threads/') && !href.includes('#js-') && !href.includes('/threadmarks')) {
                                // Skip if we've already seen this path
                                if (seenPaths_1.has(href)) {
                                    return;
                                }
                                seenPaths_1.add(href);
                                // Clean up the path - remove leading/trailing slashes and ensure it's just the thread ID
                                // For post-specific URLs, extract just the thread part
                                var cleanPath = href.replace(/^\/threads\//, '').replace(/^\//, '').replace(/\/$/, '');
                                // If it's a post-specific URL, extract just the thread ID
                                if (cleanPath.includes('#post-')) {
                                    cleanPath = cleanPath.split('#post-')[0];
                                }
                                // Remove any page numbers from the path (e.g., /page-3)
                                cleanPath = cleanPath.replace(/\/page-\d+$/, '');
                                // Since we're using advanced search with forum constraint and title-only,
                                // we can trust that the results are already filtered appropriately
                                // Just skip obvious non-thread results
                                if (cleanPath.includes('the-spacebattles-library-is-now-open') ||
                                    cleanPath.includes('creative-writing-library') ||
                                    cleanPath.includes('forum-rules') ||
                                    cleanPath.includes('announcement') ||
                                    cleanPath.includes('sticky')) {
                                    return;
                                }
                                // Use the helper method to find the best cover
                                var parentElement = linkElement.closest('.contentRow, .structItem');
                                var coverUrl = parentElement.length > 0 ? _this.findBestCover(parentElement) : defaultCover_1.defaultCover;
                                console.log("\u2705 Found novel: ".concat(title, " (").concat(cleanPath, ")"));
                                novels.push({
                                    name: title,
                                    path: cleanPath,
                                    cover: coverUrl,
                                });
                                foundCount_1++;
                            }
                        });
                        console.log("\u2705 Found ".concat(foundCount_1, " non-sticky threads for \"").concat(searchTerm, "\" on page ").concat(pageNo));
                        return [3 /*break*/, 14];
                    case 13:
                        error_5 = _a.sent();
                        console.error('Error searching novels:', error_5);
                        return [3 /*break*/, 14];
                    case 14: return [2 /*return*/, novels];
                }
            });
        });
    };
    // Helper function to convert BBCode to HTML
    SpaceBattlesPlugin.prototype.convertBBCodeToHTML = function (bbcode) {
        if (!bbcode)
            return '';
        var html = bbcode
            // Convert BBCode to HTML
            .replace(/\[b\](.*?)\[\/b\]/g, '<strong>$1</strong>')
            .replace(/\[i\](.*?)\[\/i\]/g, '<em>$1</em>')
            .replace(/\[u\](.*?)\[\/u\]/g, '<u>$1</u>')
            .replace(/\[url\](.*?)\[\/url\]/g, '<a href="$1">$1</a>')
            .replace(/\[url=(.*?)\](.*?)\[\/url\]/g, '<a href="$1">$2</a>')
            .replace(/\[quote\](.*?)\[\/quote\]/g, '<blockquote>$1</blockquote>')
            .replace(/\[spoiler\](.*?)\[\/spoiler\]/g, '<details><summary>Spoiler</summary>$1</details>')
            .replace(/\[code\](.*?)\[\/code\]/g, '<pre><code>$1</code></pre>')
            .replace(/\[color=(.*?)\](.*?)\[\/color\]/g, '<span style="color: $1">$2</span>')
            .replace(/\[size=(.*?)\](.*?)\[\/size\]/g, '<span style="font-size: $1">$2</span>')
            // Remove remaining BBCode tags
            .replace(/\[.*?\]/g, '')
            // Clean up extra whitespace
            .replace(/\n\s*\n/g, '\n\n')
            .trim();
        return html;
    };
    return SpaceBattlesPlugin;
}());
exports.default = new SpaceBattlesPlugin();
