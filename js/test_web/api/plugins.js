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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchImage = exports.parseChapter = exports.parseNovelAndChapters = exports.searchNovels = exports.popularNovels = exports.all_plugins = void 0;
const fs_1 = __importDefault(require("fs"));
const languages_1 = require("@libs/languages");
const path_1 = __importDefault(require("path"));
const plugin_1 = require("@typings/plugin");
const root = path_1.default.dirname(((_a = require === null || require === void 0 ? void 0 : require.main) === null || _a === void 0 ? void 0 : _a.filename) || "");
const all_plugins = () => {
    const res = {};
    for (let languageEnglish in languages_1.languages) {
        //language with English name
        const languageNative = languages_1.languages[languageEnglish];
        const langPath = path_1.default.join(root, "plugins", languageEnglish.toLowerCase());
        if (!fs_1.default.existsSync(langPath))
            continue;
        const plugins = fs_1.default.readdirSync(langPath);
        res[languageNative] = [];
        plugins.forEach((plugin) => {
            if (plugin.startsWith("."))
                return;
            const requirePath = `../plugins/${languageEnglish.toLowerCase()}/${plugin.split(".")[0]}`;
            const instance = require(requirePath);
            const { id, name, version } = instance;
            const info = {
                id,
                name,
                lang: languageNative,
                version,
                requirePath,
            }; // lang: language with native name
            res[info.lang].push(info);
        });
    }
    return res;
};
exports.all_plugins = all_plugins;
const getPlugin = (requirePath) => __awaiter(void 0, void 0, void 0, function* () {
    const plugin = yield require(requirePath);
    if ((0, plugin_1.isPlugin)(plugin))
        return plugin;
    return null;
});
const popularNovels = (pluginRequirePath, options) => __awaiter(void 0, void 0, void 0, function* () {
    const plugin = yield getPlugin(pluginRequirePath);
    if (!plugin)
        return null;
    const popularNovels = yield plugin.popularNovels(1, options);
    return popularNovels;
});
exports.popularNovels = popularNovels;
const searchNovels = (pluginRequirePath, searchTerm) => __awaiter(void 0, void 0, void 0, function* () { var _b; return (_b = (yield getPlugin(pluginRequirePath))) === null || _b === void 0 ? void 0 : _b.searchNovels(searchTerm); });
exports.searchNovels = searchNovels;
const parseNovelAndChapters = (pluginRequirePath, novelUrl) => __awaiter(void 0, void 0, void 0, function* () { var _c; return (_c = (yield getPlugin(pluginRequirePath))) === null || _c === void 0 ? void 0 : _c.parseNovelAndChapters(novelUrl); });
exports.parseNovelAndChapters = parseNovelAndChapters;
const parseChapter = (pluginRequirePath, chapterUrl) => __awaiter(void 0, void 0, void 0, function* () { var _d; return (_d = (yield getPlugin(pluginRequirePath))) === null || _d === void 0 ? void 0 : _d.parseChapter(chapterUrl); });
exports.parseChapter = parseChapter;
const fetchImage = (pluginRequirePath, url) => __awaiter(void 0, void 0, void 0, function* () { var _e; return (_e = (yield getPlugin(pluginRequirePath))) === null || _e === void 0 ? void 0 : _e.fetchImage(url); });
exports.fetchImage = fetchImage;
