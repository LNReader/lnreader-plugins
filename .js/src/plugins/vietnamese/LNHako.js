"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = require("@libs/fetch");
var htmlparser2_1 = require("htmlparser2");
var novelStatus_1 = require("@libs/novelStatus");
var filterInputs_1 = require("@libs/filterInputs");
var ParseNovelAction;
(function (ParseNovelAction) {
    ParseNovelAction["Unknown"] = "Unknown";
    ParseNovelAction["GetName"] = "GetName";
    ParseNovelAction["GetSummary"] = "GetSummary";
    ParseNovelAction["GetInfos"] = "GetInfos";
    ParseNovelAction["GetGenres"] = "GetGenres";
    ParseNovelAction["GetCover"] = "GetCover";
    ParseNovelAction["GetVolumes"] = "GetVolumes";
})(ParseNovelAction || (ParseNovelAction = {}));
var HakoPlugin = /** @class */ (function () {
    function HakoPlugin() {
        this.id = 'ln.hako';
        this.name = 'Hako';
        this.icon = 'src/vi/hakolightnovel/icon.png';
        this.site = 'https://ln.hako.vn';
        this.version = '1.1.0';
        this.imageRequestInit = {
            headers: {
                Referer: this.site,
            },
        };
        this.filters = {
            alphabet: {
                type: filterInputs_1.FilterTypes.Picker,
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
                type: filterInputs_1.FilterTypes.CheckboxGroup,
                label: 'Phân loại',
                value: [],
                options: [
                    { label: 'Truyện dịch', value: 'truyendich' },
                    { label: 'Truyện sáng tác', value: 'sangtac' },
                    { label: 'Convert', value: 'convert' },
                ],
            },
            status: {
                type: filterInputs_1.FilterTypes.CheckboxGroup,
                label: 'Tình trạng',
                value: [],
                options: [
                    { label: 'Đang tiến hành', value: 'dangtienhanh' },
                    { label: 'Tạm ngưng', value: 'tamngung' },
                    { label: 'Đã hoàn thành', value: 'hoanthanh' },
                ],
            },
            sort: {
                type: filterInputs_1.FilterTypes.Picker,
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
        };
    }
    HakoPlugin.prototype.parseNovels = function (url) {
        return (0, fetch_1.fetchApi)(url)
            .then(function (res) { return res.text(); })
            .then(function (html) {
            var novels = [];
            var tempNovel = {};
            var isGettingUrl = false;
            var isParsingNovel = false;
            var parser = new htmlparser2_1.Parser({
                onopentag: function (name, attribs) {
                    var _a, _b, _c;
                    if ((_a = attribs['class']) === null || _a === void 0 ? void 0 : _a.includes('thumb-item-flow')) {
                        isParsingNovel = true;
                    }
                    if (isParsingNovel) {
                        if ((_b = attribs['class']) === null || _b === void 0 ? void 0 : _b.includes('series-title')) {
                            isGettingUrl = true;
                        }
                        if ((_c = attribs['class']) === null || _c === void 0 ? void 0 : _c.includes('img-in-ratio')) {
                            tempNovel.cover = attribs['data-bg'];
                        }
                        if (isGettingUrl && name === 'a') {
                            tempNovel.name = attribs['title'];
                            tempNovel.path = attribs['href'];
                            novels.push(tempNovel);
                            tempNovel = {}; // re-assign new reference
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
    };
    HakoPlugin.prototype.popularNovels = function (pageNo, _a) {
        var filters = _a.filters;
        var link = this.site + '/danh-sach';
        if (filters) {
            if (filters.alphabet.value) {
                link += '/' + filters.alphabet.value;
            }
            var params = new URLSearchParams();
            for (var _i = 0, _b = filters.type.value; _i < _b.length; _i++) {
                var novelType = _b[_i];
                params.append(novelType, '1');
            }
            for (var _c = 0, _d = filters.status.value; _c < _d.length; _c++) {
                var status_1 = _d[_c];
                params.append(status_1, '1');
            }
            params.append('sapxep', filters.sort.value);
            link += '?' + params.toString() + '&page=' + pageNo;
        }
        else {
            link += '?page=' + pageNo;
        }
        return this.parseNovels(link);
    };
    HakoPlugin.prototype.parseNovel = function (novelPath) {
        var novel = {
            path: novelPath,
            name: '',
            author: '',
            artist: '',
            summary: '',
            genres: '',
            status: '',
        };
        var chapters = [];
        var getNameHandler = {
            isDone: false,
            isStarted: false,
            onopentag: function (name) {
                if (name === 'a') {
                    this.isStarted = true;
                }
            },
            ontext: function (data) {
                novel.name += data;
            },
            onclosetag: function () {
                if (this.isStarted) {
                    this.isDone = true;
                }
            },
        };
        var getSummaryHandler = {
            newLine: false,
            ontext: function (data) {
                if (this.newLine) {
                    this.newLine = false;
                    novel.summary += '\n' + data;
                }
                else {
                    novel.summary += data;
                }
            },
            onclosetag: function () {
                this.newLine = true;
            },
        };
        var getGenresHandler = {
            ontext: function (data) {
                novel.genres += data;
            },
        };
        var InfoItem;
        (function (InfoItem) {
            InfoItem[InfoItem["Author"] = 0] = "Author";
            InfoItem[InfoItem["Artist"] = 1] = "Artist";
            InfoItem[InfoItem["Status"] = 2] = "Status";
            InfoItem[InfoItem["Unknown"] = 3] = "Unknown";
        })(InfoItem || (InfoItem = {}));
        var getInfosHandler = {
            isStarted: false,
            info: InfoItem.Unknown,
            onopentag: function (name, attribs) {
                if (attribs['class'] === 'info-item') {
                    switch (this.info) {
                        case InfoItem.Unknown:
                            if (!novel.author) {
                                this.info = InfoItem.Author;
                            }
                            break;
                        case InfoItem.Author:
                            this.info = InfoItem.Artist;
                            break;
                        case InfoItem.Artist:
                            this.info = InfoItem.Status;
                            break;
                        // we dont need the other info (if exist)
                        case InfoItem.Status:
                            this.info = InfoItem.Unknown;
                            break;
                        default:
                            break;
                    }
                }
                if (name === 'a') {
                    this.isStarted = true;
                }
            },
            ontext: function (data) {
                if (this.isStarted) {
                    switch (this.info) {
                        case InfoItem.Author:
                            novel.author += data;
                            break;
                        case InfoItem.Artist:
                            novel.artist += data;
                            break;
                        case InfoItem.Status:
                            novel.status += data;
                            break;
                        default:
                            break;
                    }
                }
            },
            onclosetag: function (name) {
                if (this.isStarted) {
                    this.isStarted = false;
                }
                if (name === 'a' && this.info === InfoItem.Status) {
                    this.isDone = true;
                }
            },
        };
        var getChapterListHandler = {
            currentVolume: '',
            num: 0,
            part: 1,
            isStarted: false,
            readingTime: false,
            tempChapter: {},
            onopentag: function (name, attribs) {
                var _a;
                if (this.isStarted) {
                    if (name === 'a' && attribs['title'] !== null) {
                        var chapterName = attribs['title'];
                        var chapterNumber = Number((_a = chapterName.match(/Chương\s*(\d+)/i)) === null || _a === void 0 ? void 0 : _a[1]);
                        if (chapterNumber) {
                            if (this.num === chapterNumber) {
                                chapterNumber = this.num + this.part / 10;
                                this.part += 1;
                            }
                            else {
                                this.num = chapterNumber;
                                this.part = 1;
                            }
                        }
                        else {
                            chapterNumber = this.num + this.part / 10;
                            this.part++;
                        }
                        this.tempChapter = {
                            path: attribs['href'],
                            name: chapterName,
                            page: this.currentVolume,
                            chapterNumber: chapterNumber,
                        };
                    }
                    else if (attribs['class'] === 'chapter-time') {
                        this.readingTime = true;
                    }
                }
            },
            ontext: function (data) {
                if (this.readingTime) {
                    var chapterTime = data.split('/').map(function (x) { return Number(x); });
                    this.tempChapter.releaseTime = new Date(chapterTime[2], chapterTime[1], chapterTime[0]).toISOString();
                    chapters.push(this.tempChapter);
                    this.readingTime = false;
                    this.tempChapter = {};
                }
            },
            onclosetag: function () {
                if (this.readingTime)
                    this.readingTime = false;
            },
        };
        var getVolumesHandler = {
            isStarted: false,
            isDone: false,
            isParsingChapterList: false,
            onopentag: function (name, attribs) {
                var _a;
                if (attribs['class'] === 'sect-title') {
                    this.isStarted = true;
                    getChapterListHandler.currentVolume = '';
                }
                if (name === 'ul') {
                    getChapterListHandler.isStarted = true;
                    getChapterListHandler.num = 0;
                    getChapterListHandler.part = 1;
                }
                (_a = getChapterListHandler.onopentag) === null || _a === void 0 ? void 0 : _a.call(getChapterListHandler, name, attribs);
            },
            ontext: function (data) {
                var _a;
                if (this.isStarted) {
                    getChapterListHandler.currentVolume += data.trim();
                }
                (_a = getChapterListHandler.ontext) === null || _a === void 0 ? void 0 : _a.call(getChapterListHandler, data);
            },
            onclosetag: function (name, isImplied) {
                var _a;
                (_a = getChapterListHandler.onclosetag) === null || _a === void 0 ? void 0 : _a.call(getChapterListHandler, name, isImplied);
                this.isStarted = false;
                if (name === 'ul') {
                    getChapterListHandler.isStarted = false;
                }
            },
        };
        var parseNovelRouter = {
            handlers: {
                Unknown: undefined,
                GetName: getNameHandler,
                GetCover: undefined,
                GetSummary: getSummaryHandler,
                GetGenres: getGenresHandler,
                GetInfos: getInfosHandler,
                GetVolumes: getVolumesHandler,
            },
            action: ParseNovelAction.Unknown,
            onopentag: function (name, attribs) {
                var _a, _b;
                if (attribs['class'] === 'series-name') {
                    this.action = ParseNovelAction.GetName;
                }
                else if (!novel.cover && ((_a = attribs['class']) === null || _a === void 0 ? void 0 : _a.includes('img-in-ratio'))) {
                    var background = attribs['style'];
                    if (background) {
                        novel.cover = background.substring(background.indexOf('http'), background.length - 2);
                    }
                }
                else if (attribs['class'] === 'summary-content') {
                    this.action = ParseNovelAction.GetSummary;
                }
                else if (attribs['class'] === 'series-gerne-item') {
                    this.action = ParseNovelAction.GetGenres;
                }
                else if (attribs['class'] === 'info-item') {
                    this.action = ParseNovelAction.GetInfos;
                }
                else if ((_b = attribs['class']) === null || _b === void 0 ? void 0 : _b.includes('volume-list')) {
                    this.action = ParseNovelAction.GetVolumes;
                }
            },
            onclosetag: function (name) {
                var _a, _b, _c;
                switch (this.action) {
                    case ParseNovelAction.GetName:
                        if ((_a = this.handlers.GetName) === null || _a === void 0 ? void 0 : _a.isDone) {
                            this.action = ParseNovelAction.Unknown;
                        }
                        break;
                    case ParseNovelAction.GetSummary:
                        if (name === 'div') {
                            this.action = ParseNovelAction.Unknown;
                        }
                        break;
                    case ParseNovelAction.GetGenres:
                        this.action = ParseNovelAction.Unknown;
                        novel.genres += ',';
                        break;
                    case ParseNovelAction.GetInfos:
                        if ((_b = this.handlers.GetInfos) === null || _b === void 0 ? void 0 : _b.isDone) {
                            this.action = ParseNovelAction.Unknown;
                        }
                        break;
                    case ParseNovelAction.GetVolumes:
                        if ((_c = this.handlers.GetVolumes) === null || _c === void 0 ? void 0 : _c.isDone) {
                            this.action = ParseNovelAction.Unknown;
                        }
                        break;
                    default:
                        break;
                }
            },
        };
        return (0, fetch_1.fetchApi)(this.site + novelPath)
            .then(function (res) { return res.text(); })
            .then(function (html) {
            var _a, _b, _c;
            var parser = new htmlparser2_1.Parser({
                onopentag: function (name, attributes) {
                    var _a, _b, _c;
                    (_a = parseNovelRouter.onopentag) === null || _a === void 0 ? void 0 : _a.call(parseNovelRouter, name, attributes);
                    if (parseNovelRouter.action) {
                        (_c = (_b = parseNovelRouter.handlers[parseNovelRouter.action]) === null || _b === void 0 ? void 0 : _b.onopentag) === null || _c === void 0 ? void 0 : _c.call(_b, name, attributes);
                    }
                },
                ontext: function (data) {
                    var _a, _b;
                    if (parseNovelRouter.action) {
                        (_b = (_a = parseNovelRouter.handlers[parseNovelRouter.action]) === null || _a === void 0 ? void 0 : _a.ontext) === null || _b === void 0 ? void 0 : _b.call(_a, data);
                    }
                },
                onclosetag: function (name, isImplied) {
                    var _a, _b, _c;
                    if (parseNovelRouter.action) {
                        (_b = (_a = parseNovelRouter.handlers[parseNovelRouter.action]) === null || _a === void 0 ? void 0 : _a.onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a, name, isImplied);
                    }
                    (_c = parseNovelRouter.onclosetag) === null || _c === void 0 ? void 0 : _c.call(parseNovelRouter, name, isImplied);
                },
            });
            parser.write(html);
            parser.end();
            novel.chapters = chapters;
            switch ((_a = novel.status) === null || _a === void 0 ? void 0 : _a.trim()) {
                case 'Đang tiến hành':
                    novel.status = novelStatus_1.NovelStatus.Ongoing;
                    break;
                case 'Tạm ngưng':
                    novel.status = novelStatus_1.NovelStatus.OnHiatus;
                    break;
                case 'Completed':
                    novel.status = novelStatus_1.NovelStatus.Completed;
                    break;
                default:
                    novel.status = novelStatus_1.NovelStatus.Unknown;
            }
            novel.genres = (_b = novel.genres) === null || _b === void 0 ? void 0 : _b.replace(/,*\s*$/, '');
            novel.name = novel.name.trim();
            novel.summary = (_c = novel.summary) === null || _c === void 0 ? void 0 : _c.trim();
            return novel;
        });
    };
    HakoPlugin.prototype.parseChapter = function (chapterPath) {
        return (0, fetch_1.fetchApi)(this.site + chapterPath)
            .then(function (res) { return res.text(); })
            .then(function (html) {
            var _a;
            return ((_a = html.match(/(<div id="chapter-content".+?>[^]+)<div style="text-align: center;/)) === null || _a === void 0 ? void 0 : _a[1]) || 'Không tìm thấy nội dung';
        });
    };
    HakoPlugin.prototype.searchNovels = function (searchTerm, pageNo) {
        var url = this.site + '/tim-kiem?keywords=' + searchTerm + '&page=' + pageNo;
        return this.parseNovels(url);
    };
    return HakoPlugin;
}());
exports.default = new HakoPlugin();
