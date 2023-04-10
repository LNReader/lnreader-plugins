const fs = require('fs');
const languages = require('@libs/languages');
const path = require('path')
const root = path.dirname(require.main.filename);

const githubIconsLink = 'https://raw.githubusercontent.com/nyagami/plugins/main/icons';
const githubIconSuffix = '?raw=true';
const githubPluginsLink = 'https://raw.githubusercontent.com/nyagami/plugins/main/plugins';
const githubPluginSuffix = '?newtest=true';

const json = {};
const jsonPath = path.join(root, 'plugins', 'plugins.json');
const jsonMinPath = path.join(root, 'plugins', 'plugins.min.json');

const run = () => {
    for (let language in languages) {     //language with English name
        const langPath = path.join(root, 'plugins', language.toLowerCase());
        if (!fs.existsSync(langPath)) continue;
        try {
            const plugins = fs.readdirSync(langPath);
            json[languages[language]] = [];
            plugins.forEach(plugin => {
                if(plugin.startsWith('.')) return;

                const instance = require(`@plugins/${language.toLowerCase()}/${plugin.split('.')[0]}`);

                const { id, name, lang, version, icon, description } = instance;
                const info = { id, name, lang, version, description } // lang: language with native name
                info.url = `${githubPluginsLink}/${language.toLowerCase()}/${plugin}${githubPluginSuffix}`;
                info.iconUrl = `${githubIconsLink}/${icon}${githubIconSuffix}`;

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

module.exports = run;