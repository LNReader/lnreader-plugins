const fs = require('fs');
const languages = require('@libs/languages');
const path = require('path')
const root = path.dirname(require.main.filename);

const username = "nyagami";
const repo = "plugins";
const branch = "main"

const githubIconsLink = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/icons`;
const githubPluginsLink = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/plugins`;

const json = {};
const jsonPath = path.join(root, 'plugins', 'plugins.json');
const jsonMinPath = path.join(root, 'plugins', 'plugins.min.json');

const json_plugins = () => {
    for (let language in languages) {     // language with English name
        const langPath = path.join(root, 'plugins', language.toLowerCase());
        if (!fs.existsSync(langPath)) continue;
        try {
            const plugins = fs.readdirSync(langPath);
            json[languages[language]] = [];
            plugins.forEach(plugin => {
                if(plugin.startsWith('.')) return;

                const instance = require(`@plugins/${language.toLowerCase()}/${plugin.split('.')[0]}`);

                const { id, name, site, lang, version, icon, description } = instance;
                // lang: language with native name
                const info = { id, name, site, lang, version, description }
                info.url = `${githubPluginsLink}/${language.toLowerCase()}/${plugin}`;
                info.iconUrl = `${githubIconsLink}/${icon}`;

                json[lang].push(info);

                console.log('Collected', name);
            });
        } catch (e) {
            console.log(e);
        }
    }
    fs.writeFileSync(jsonMinPath, JSON.stringify(json));
    fs.writeFileSync(jsonPath, JSON.stringify(json, null, '\t'));
    console.log('Done ✅');
};

module.exports = json_plugins;