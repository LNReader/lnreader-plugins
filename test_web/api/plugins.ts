import fs from "fs";
import { languages } from "@libs/languages";
import path from "path";
import { PluginList } from "@typings/types";
import { Plugin, isPlugin } from "@typings/plugin";
import { Filters } from "@libs/filterInputs";
const root = path.dirname(require?.main?.filename || "");

export const fetchHeaders: Record<string, string> = {};

export const all_plugins = (): PluginList => {
    const res: PluginList = {};
    for (let languageEnglish in languages) {
        //language with English name
        const languageNative =
            languages[languageEnglish as keyof typeof languages];
        const langPath = path.join(
            root,
            "plugins",
            languageEnglish.toLowerCase()
        );
        if (!fs.existsSync(langPath)) continue;
        const plugins = fs.readdirSync(langPath);
        res[languageEnglish] = [];
        plugins.forEach((plugin) => {
            if (plugin.startsWith(".")) return;
            const requirePath = `@plugins/${languageEnglish.toLowerCase()}/${
                plugin.split(".")[0]
            }`;
            const instance = require(requirePath).default;
            const { id, name, version, icon } = instance;
            const info: Plugin.PluginItem = {
                id,
                name: name + (plugin.match(/(\[.+\])/)?.[1] || ''),
                lang: languageNative,
                version,
                requirePath,
                icon,
            }; // lang: language with native name
            res[languageEnglish].push(info);
        });
    }
    return res;
};

const getPlugin = async (
    requirePath: string
): Promise<Plugin.PluginBase | null> => {
    console.log("loading plugin", requirePath);
    const plugin = await require(requirePath).default;
    // console.log(plugin);
    if (isPlugin(plugin)) {
        console.log("loaded plugin", plugin.name);
        return plugin;
    }
    console.error("Not a plugin!");
    return null;
};

export const getFilter = async (pluginRequirePath: string) =>
    (await getPlugin(pluginRequirePath))?.filters;

export const popularNovels = async (
    pluginRequirePath: string,
    page: number,
    options: Plugin.PopularNovelsOptions<Filters>
) => (await getPlugin(pluginRequirePath))?.popularNovels(page, options);

export const searchNovels = async (
    pluginRequirePath: string,
    page: number,
    searchTerm: string
) => (await getPlugin(pluginRequirePath))?.searchNovels(searchTerm, page);

export const parseNovelAndChapters = async (
    pluginRequirePath: string,
    novelUrl: string
) => (await getPlugin(pluginRequirePath))?.parseNovelAndChapters(novelUrl);

export const parseChapter = async (
    pluginRequirePath: string,
    chapterUrl: string
) => (await getPlugin(pluginRequirePath))?.parseChapter(chapterUrl);

export const fetchImage = async (pluginRequirePath: string, url: string) =>
    (await getPlugin(pluginRequirePath))?.fetchImage(url);
