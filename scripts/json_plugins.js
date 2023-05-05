require('module-alias/register');
require('dotenv').config();
const fs = require('fs');
const languages = require('@libs/languages');
const path = require('path')
const root = path.dirname(__dirname);
const username = process.env.GITHUB_USERNAME;
const repo = process.env.GITHUB_REPOSITORY;
const branch = process.env.GITHUB_BRANCH;

const githubIconsLink = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/icons`;
const githubPluginsLink = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/plugins`;

const json = {};
const jsonPath = path.join(root, 'plugins', 'plugins.json');
const jsonMinPath = path.join(root, 'plugins', 'plugins.min.json');

for (let language in languages) {     // language with English name
    const langPath = path.join(root, 'plugins', language.toLowerCase());
    if (!fs.existsSync(langPath)) continue;
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
}
fs.writeFileSync(jsonMinPath, JSON.stringify(json));
fs.writeFileSync(jsonPath, JSON.stringify(json, null, '\t'));
console.log('Done ✅');
