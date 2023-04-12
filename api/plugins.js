const fs = require('fs');
const languages = require('@libs/languages');
const path = require('path')
const root = path.dirname(require.main.filename);

const githubIconsLink = 'https://raw.githubusercontent.com/nyagami/plugins/main/icons';
const githubIconSuffix = '?raw=true';
const githubPluginsLink = 'https://raw.githubusercontent.com/nyagami/plugins/main/plugins';
const githubPluginSuffix = '?newtest=true';

const jsonPath = path.join(root, 'plugins', 'plugins.json');
const jsonMinPath = path.join(root, 'plugins', 'plugins.min.json');

const all_plugins = () => {
    const res = {}
    for (let language in languages) {     //language with English name
        const langPath = path.join(root, 'plugins', language.toLowerCase());
        if (!fs.existsSync(langPath)) continue;
        try {
            const plugins = fs.readdirSync(langPath);
            res[languages[language]] = [];
            plugins.forEach(plugin => {
                if(plugin.startsWith('.')) return;
                const requirePath = `@plugins/${language.toLowerCase()}/${plugin.split('.')[0]}`
                const instance = require(requirePath);
                const { id, name, lang, version, icon, description } = instance;
                const info = { id, name, lang, version, description } // lang: language with native name
                info.url = `${githubPluginsLink}/${language.toLowerCase()}/${plugin}${githubPluginSuffix}`;
                info.iconUrl = `${githubIconsLink}/${icon}${githubIconSuffix}`;
                info.requirePath = requirePath;
                res[lang].push(info);
            });
        } catch (e) {
            console.log(e);
        }
    }
    return res;
}

const popularNovels = async (pluginRequirePath) => {
    try{
        return await require(pluginRequirePath).popularNovels(1);
    }catch(error){
        return {
            "error": error
        }
    }
}

const searchNovels = async (pluginRequirePath, searchTerm) => {
    try{
        return await require(pluginRequirePath).searchNovels(searchTerm);
    }catch(error){
        return {
            "error": error
        }
    }
}

const parseNovelAndChapters = async(pluginRequirePath, novelUrl) => {
    try{
        return await require(pluginRequirePath).parseNovelAndChapters(novelUrl);
    }catch(error){
        return {
            "error": error
        }
    }
}

const parseChapter = async (pluginRequirePath, chapterUrl) => {
    try{
        return await require(pluginRequirePath).parseChapter(chapterUrl);
    }catch(error){
        return {
            "error": error
        }
    }
}

const fetchImage = async (pluginRequirePath, url) => {
    try{
        return await require(pluginRequirePath).fetchImage(url);
    }catch(error){
        return {
            "error": error
        }
    }
}

module.exports = {
    all_plugins,
    popularNovels,
    searchNovels,
    parseNovelAndChapters,
    parseChapter,
    fetchImage
}