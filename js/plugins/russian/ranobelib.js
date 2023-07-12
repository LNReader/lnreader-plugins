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
const cheerio = require("cheerio");
const dayjs = require("dayjs");
const fetchApi = require("@libs/fetchApi").default;
const fetchFile = require("@libs/fetchFile").default;
const Status = require("@libs/novelStatus").default;
const FilterInputs = require("@libs/filterInputs").default;
const pluginId = "RLIB";
const sourceName = "RanobeLib";
const baseUrl = "https://ranobelib.me";
var ui = null;
function popularNovels(page, { showLatestNovels, filters }) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return __awaiter(this, void 0, void 0, function* () {
        let url = `${baseUrl}/manga-list?sort=`;
        url += showLatestNovels ? "last_chapter_at" : (filters === null || filters === void 0 ? void 0 : filters.sort) || "rate";
        url += "&dir=" + ((filters === null || filters === void 0 ? void 0 : filters.order) || "desc");
        if ((_a = filters === null || filters === void 0 ? void 0 : filters.type) === null || _a === void 0 ? void 0 : _a.length) {
            url += filters.type.map((i) => `&types[]=${i}`).join("");
        }
        if ((_b = filters === null || filters === void 0 ? void 0 : filters.format) === null || _b === void 0 ? void 0 : _b.length) {
            url += filters.format.map((i) => `&format[include][]=${i}`).join("");
        }
        if ((_c = filters === null || filters === void 0 ? void 0 : filters.status) === null || _c === void 0 ? void 0 : _c.length) {
            url += filters.status.map((i) => `&status[]=${i}`).join("");
        }
        if ((_d = filters === null || filters === void 0 ? void 0 : filters.statuss) === null || _d === void 0 ? void 0 : _d.length) {
            url += filters.statuss.map((i) => `&manga_status[]=${i}`).join("");
        }
        if ((_e = filters === null || filters === void 0 ? void 0 : filters.genres) === null || _e === void 0 ? void 0 : _e.length) {
            url += filters.genres.map((i) => `&genres[include][]=${i}`).join("");
        }
        if ((_f = filters === null || filters === void 0 ? void 0 : filters.tags) === null || _f === void 0 ? void 0 : _f.length) {
            url += filters.tags.map((i) => `&tags[include][]=${i}`).join("");
        }
        url += "&page=" + page;
        const result = yield fetchApi(url);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        ui = (_h = (_g = loadedCheerio("a.header-right-menu__item")
            .attr("href")) === null || _g === void 0 ? void 0 : _g.replace) === null || _h === void 0 ? void 0 : _h.call(_g, /[^0-9]/g, "");
        let novels = [];
        loadedCheerio(".media-card-wrap").each(function () {
            const name = loadedCheerio(this).find(".media-card__title").text();
            const cover = loadedCheerio(this).find("a.media-card").attr("data-src");
            const url = loadedCheerio(this).find("a.media-card").attr("href");
            novels.push({ name, cover, url });
        });
        return novels;
    });
}
function parseNovelAndChapters(novelUrl) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield fetchApi(novelUrl);
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        let novel = {
            url: novelUrl,
        };
        novel.name = loadedCheerio(".media-name__main").text().trim();
        novel.cover = loadedCheerio(".media-sidebar__cover img").attr("src");
        novel.summary = loadedCheerio(".media-description__text").text().trim();
        novel.genres = loadedCheerio('div[class="media-tags"]')
            .text()
            .trim()
            .replace(/[\n\r]+/g, ", ")
            .replace(/  /g, "");
        loadedCheerio('div[class="media-info-list paper"] > [class="media-info-list__item"]').each(function () {
            let name = loadedCheerio(this)
                .find('div[class="media-info-list__title"]')
                .text();
            if (name === "Статус перевода") {
                novel.status =
                    loadedCheerio(this).find("div:nth-child(2)").text().trim() ===
                        "Продолжается"
                        ? Status.Ongoing
                        : Status.Completed;
            }
            else if (name === "Автор") {
                novel.author = loadedCheerio(this).find("div:nth-child(2)").text().trim();
            }
            else if (name === "Художник") {
                novel.artist = loadedCheerio(this).find("div:nth-child(2)").text().trim();
            }
        });
        let chapters = [];
        let chaptersJson = body.match(/window.__DATA__ = [\s\S]*?window._SITE_COLOR_/gm);
        chaptersJson = (_d = (_c = (_b = (_a = chaptersJson === null || chaptersJson === void 0 ? void 0 : chaptersJson[0]) === null || _a === void 0 ? void 0 : _a.replace("window.__DATA__ = ", "")) === null || _b === void 0 ? void 0 : _b.replace("window._SITE_COLOR_", "")) === null || _c === void 0 ? void 0 : _c.trim()) === null || _d === void 0 ? void 0 : _d.slice(0, -1);
        chaptersJson = JSON.parse(chaptersJson);
        ui = (_e = chaptersJson === null || chaptersJson === void 0 ? void 0 : chaptersJson.user) === null || _e === void 0 ? void 0 : _e.id;
        chaptersJson.chapters.list.forEach((chapter) => {
            var _a;
            return chapters.push({
                name: (_a = `Том ${chapter.chapter_volume} Глава ${chapter.chapter_number} ${chapter.chapter_name}`) === null || _a === void 0 ? void 0 : _a.trim(),
                releaseTime: dayjs(chapter.chapter_created_at).format("LLL"),
                url: `${baseUrl}/${chaptersJson.manga.slug}/v${chapter.chapter_volume}/c${chapter.chapter_number}?bid=` +
                    ((chapter === null || chapter === void 0 ? void 0 : chapter.branch_id) || ""),
            });
        });
        novel.chapters = chapters.reverse();
        return novel;
    });
}
function parseChapter(chapterUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield fetchApi(chapterUrl + (ui ? `&ui=${ui}` : ""));
        const body = yield result.text();
        const loadedCheerio = cheerio.load(body);
        loadedCheerio(".reader-container img").each(function () {
            const url = loadedCheerio(this).attr("data-src") || loadedCheerio(this).attr("src");
            if (!(url === null || url === void 0 ? void 0 : url.startsWith("http"))) {
                loadedCheerio(this).attr("src", baseUrl + url);
            }
            else {
                loadedCheerio(this).attr("src", url);
            }
            loadedCheerio(this).removeAttr("data-src");
        });
        const chapterText = loadedCheerio(".reader-container").html();
        return chapterText;
    });
}
function searchNovels(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield fetchApi(`${baseUrl}/search?q=${searchTerm}&type=manga`);
        const body = yield result.json();
        let novels = [];
        body.forEach((novel) => novels.push({
            name: (novel === null || novel === void 0 ? void 0 : novel.rus_name) || novel.name,
            cover: novel.coverImage,
            url: (novel === null || novel === void 0 ? void 0 : novel.href) || baseUrl + "/" + novel.slug,
        }));
        return novels;
    });
}
const filters = [
    {
        key: "sort",
        label: "Сортировка",
        values: [
            { label: "Рейтинг", value: "rate" },
            { label: "Имя", value: "name" },
            { label: "Просмотры", value: "views" },
            { label: "Дате добавления", value: "created_at" },
            { label: "Дате обновления", value: "last_chapter_at" },
            { label: "Количество глав", value: "chap_count" },
        ],
        inputType: FilterInputs.Picker,
    },
    {
        key: "order",
        label: "Порядок",
        values: [
            { label: "По убыванию", value: "desc" },
            { label: "По возрастанию", value: "asc" },
        ],
        inputType: FilterInputs.Picker,
    },
    {
        key: "type",
        label: "Тип",
        values: [
            { label: "Авторский", value: "14" },
            { label: "Английский", value: "13" },
            { label: "Китай", value: "12" },
            { label: "Корея", value: "11" },
            { label: "Фанфик", value: "15" },
            { label: "Япония", value: "10" },
        ],
        inputType: FilterInputs.Checkbox,
    },
    {
        key: "format",
        label: "Формат выпуска",
        values: [
            { label: "4-кома (Ёнкома)", value: "1" },
            { label: "В цвете", value: "4" },
            { label: "Веб", value: "6" },
            { label: "Вебтун", value: "7" },
            { label: "Додзинси", value: "3" },
            { label: "Сборник", value: "2" },
            { label: "Сингл", value: "5" },
        ],
        inputType: FilterInputs.Checkbox,
    },
    {
        key: "status",
        label: "Статус перевода",
        values: [
            { label: "Продолжается", value: "1" },
            { label: "Завершен", value: "2" },
            { label: "Заморожен", value: "3" },
            { label: "Заброшен", value: "4" },
        ],
        inputType: FilterInputs.Checkbox,
    },
    {
        key: "statuss",
        label: "Статус тайтла",
        values: [
            { label: "Онгоинг", value: "1" },
            { label: "Завершён", value: "2" },
            { label: "Анонс", value: "3" },
            { label: "Приостановлен", value: "4" },
            { label: "Выпуск прекращён", value: "5" },
        ],
        inputType: FilterInputs.Checkbox,
    },
    {
        key: "genres",
        label: "Жанры",
        values: [
            { label: "Арт", value: "32" },
            { label: "Безумие", value: "91" },
            { label: "Боевик", value: "34" },
            { label: "Боевые искусства", value: "35" },
            { label: "Вампиры", value: "36" },
            { label: "Военное", value: "89" },
            { label: "Гарем", value: "37" },
            { label: "Гендерная интрига", value: "38" },
            { label: "Героическое фэнтези", value: "39" },
            { label: "Демоны", value: "81" },
            { label: "Детектив", value: "40" },
            { label: "Детское", value: "88" },
            { label: "Дзёсэй", value: "41" },
            { label: "Драма", value: "43" },
            { label: "Игра", value: "44" },
            { label: "Исекай", value: "79" },
            { label: "История", value: "45" },
            { label: "Киберпанк", value: "46" },
            { label: "Кодомо", value: "76" },
            { label: "Комедия", value: "47" },
            { label: "Космос", value: "83" },
            { label: "Магия", value: "85" },
            { label: "Махо-сёдзё", value: "48" },
            { label: "Машины", value: "90" },
            { label: "Меха", value: "49" },
            { label: "Мистика", value: "50" },
            { label: "Музыка", value: "80" },
            { label: "Научная фантастика", value: "51" },
            { label: "Омегаверс", value: "77" },
            { label: "Пародия", value: "86" },
            { label: "Повседневность", value: "52" },
            { label: "Полиция", value: "82" },
            { label: "Постапокалиптика", value: "53" },
            { label: "Приключения", value: "54" },
            { label: "Психология", value: "55" },
            { label: "Романтика", value: "56" },
            { label: "Самурайский боевик", value: "57" },
            { label: "Сверхъестественное", value: "58" },
            { label: "Сёдзё", value: "59" },
            { label: "Сёдзё-ай", value: "60" },
            { label: "Сёнэн", value: "61" },
            { label: "Сёнэн-ай", value: "62" },
            { label: "Спорт", value: "63" },
            { label: "Супер сила", value: "87" },
            { label: "Сэйнэн", value: "64" },
            { label: "Трагедия", value: "65" },
            { label: "Триллер", value: "66" },
            { label: "Ужасы", value: "67" },
            { label: "Фантастика", value: "68" },
            { label: "Фэнтези", value: "69" },
            { label: "Школа", value: "70" },
            { label: "Эротика", value: "71" },
            { label: "Этти", value: "72" },
            { label: "Юри", value: "73" },
            { label: "Яой", value: "74" },
        ],
        inputType: FilterInputs.Checkbox,
    },
    {
        key: "tags",
        label: "Теги",
        values: [
            { label: "Авантюристы", value: "328" },
            { label: "Антигерой", value: "176" },
            { label: "Бессмертные", value: "333" },
            { label: "Боги", value: "218" },
            { label: "Борьба за власть", value: "309" },
            { label: "Брат и сестра", value: "360" },
            { label: "Ведьма", value: "339" },
            { label: "Видеоигры", value: "204" },
            { label: "Виртуальная реальность", value: "214" },
            { label: "Владыка демонов", value: "349" },
            { label: "Военные", value: "198" },
            { label: "Воспоминания из другого мира", value: "310" },
            { label: "Выживание", value: "212" },
            { label: "ГГ женщина", value: "294" },
            { label: "ГГ имба", value: "292" },
            { label: "ГГ мужчина", value: "295" },
            { label: "ГГ не ояш", value: "325" },
            { label: "ГГ не человек", value: "331" },
            { label: "ГГ ояш", value: "326" },
            { label: "Главный герой бог", value: "324" },
            { label: "Глупый ГГ", value: "298" },
            { label: "Горничные", value: "171" },
            { label: "Гуро", value: "306" },
            { label: "Гяру", value: "197" },
            { label: "Демоны", value: "157" },
            { label: "Драконы", value: "313" },
            { label: "Древний мир", value: "317" },
            { label: "Зверолюди", value: "163" },
            { label: "Зомби", value: "155" },
            { label: "Исторические фигуры", value: "323" },
            { label: "Кулинария", value: "158" },
            { label: "Культивация", value: "161" },
            { label: "ЛГБТ", value: "344" },
            { label: "ЛитРПГ", value: "319" },
            { label: "Лоли", value: "206" },
            { label: "Магия", value: "170" },
            { label: "Машинный перевод", value: "345" },
            { label: "Медицина", value: "159" },
            { label: "Межгалактическая война", value: "330" },
            { label: "Монстр Девушки", value: "207" },
            { label: "Монстры", value: "208" },
            { label: "Мрачный мир", value: "316" },
            { label: "Музыка", value: "358" },
            { label: "Музыка", value: "209" },
            { label: "Ниндзя", value: "199" },
            { label: "Обратный Гарем", value: "210" },
            { label: "Офисные Работники", value: "200" },
            { label: "Пираты", value: "341" },
            { label: "Подземелья", value: "314" },
            { label: "Политика", value: "311" },
            { label: "Полиция", value: "201" },
            { label: "Преступники / Криминал", value: "205" },
            { label: "Призраки / Духи", value: "196" },
            { label: "Призыватели", value: "329" },
            { label: "Прыжки между мирами", value: "321" },
            { label: "Путешествие в другой мир", value: "318" },
            { label: "Путешествие во времени", value: "213" },
            { label: "Рабы", value: "355" },
            { label: "Ранги силы", value: "312" },
            { label: "Реинкарнация", value: "154" },
            { label: "Самураи", value: "202" },
            { label: "Скрытие личности", value: "315" },
            { label: "Средневековье", value: "174" },
            { label: "Традиционные игры", value: "203" },
            { label: "Умный ГГ", value: "303" },
            { label: "Характерный рост", value: "332" },
            { label: "Хикикомори", value: "167" },
            { label: "Эволюция", value: "322" },
            { label: "Элементы РПГ", value: "327" },
            { label: "Эльфы", value: "217" },
            { label: "Якудза", value: "165" },
        ],
        inputType: FilterInputs.Checkbox,
    },
];
module.exports = {
    id: pluginId,
    name: sourceName,
    site: baseUrl,
    version: "1.0.0",
    icon: "src/ru/ranobelib/icon.png",
    filters,
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
    fetchImage: fetchFile,
};
