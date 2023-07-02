require("module-alias/register");

import * as fs from "fs";
import { languages } from "@libs/languages";
import * as path from "path";
import { Plugin, isPlugin } from "@typings/plugin";
const root = path.dirname(__dirname);
const outRoot = path.join(root, "..");
const config = fs.existsSync(path.join(outRoot, "config.json"))
    ? // @ts-ignore
      require("../../config.json")
    : {};
const username = config.githubUsername;
const repo = config.githubRepository;
const branch = config.githubBranch;
if (!username || !repo || !branch) {
    process.exit();
}
if (!fs.existsSync(path.join(outRoot, "dist", username))) {
    fs.mkdirSync(path.join(outRoot, "dist", username));
}
const githubIconsLink = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/icons`;
const githubPluginsLink = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/js/plugins`;

const json: {
    [key: string]: {
        id: string;
        name: string;
        site: string;
        lang: string;
        version: string;
        url: string;
        iconUrl: string;
    }[];
} = {};
const jsonPath = path.join(outRoot, "dist", username, "plugins.json");
const jsonMinPath = path.join(outRoot, "dist", username, "plugins.min.json");

for (let language in languages) {
    // language with English name
    const languageNative = languages[language as keyof typeof languages];
    const langPath = path.join(root, "plugins", language.toLowerCase());
    if (!fs.existsSync(langPath)) continue;
    const plugins = fs.readdirSync(langPath);
    json[languageNative] = [];
    plugins.forEach((plugin) => {
        if (plugin.startsWith(".")) return;
        const instance:
            | Plugin.instance
            | unknown = require(`../plugins/${language.toLowerCase()}/${
            plugin.split(".")[0]
        }`);

        if (!isPlugin(instance)) return;

        const { id, name, site, version, icon } = instance;
        const info = {
            id,
            name,
            site,
            lang: languageNative,
            version,
            url: `${githubPluginsLink}/${language.toLowerCase()}/${plugin}`,
            iconUrl: `${githubIconsLink}/${icon}`,
        } as const;

        json[languageNative].push(info);

        console.log("Collected", name);
    });
}

for (let lang in json) json[lang].sort((a, b) => a.id.localeCompare(b.id));

console.log(jsonPath);

fs.writeFileSync(jsonMinPath, JSON.stringify(json));
fs.writeFileSync(jsonPath, JSON.stringify(json, null, "\t"));
console.log("Done ✅");
