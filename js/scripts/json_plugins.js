"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const fs = __importStar(require("fs"));
const languages_1 = require("@libs/languages");
const path = __importStar(require("path"));
const plugin_1 = require("@typings/plugin");
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
const json = {};
const jsonPath = path.join(outRoot, "dist", username, "plugins.json");
const jsonMinPath = path.join(outRoot, "dist", username, "plugins.min.json");
for (let language in languages_1.languages) {
    // language with English name
    const languageNative = languages_1.languages[language];
    const langPath = path.join(root, "plugins", language.toLowerCase());
    if (!fs.existsSync(langPath))
        continue;
    const plugins = fs.readdirSync(langPath);
    json[languageNative] = [];
    plugins.forEach((plugin) => {
        if (plugin.startsWith("."))
            return;
        const instance = require(`../plugins/${language.toLowerCase()}/${plugin.split(".")[0]}`);
        if (!(0, plugin_1.isPlugin)(instance))
            return;
        const { id, name, site, version, icon } = instance;
        const info = {
            id,
            name,
            site,
            lang: languageNative,
            version,
            url: `${githubPluginsLink}/${language.toLowerCase()}/${plugin}`,
            iconUrl: `${githubIconsLink}/${icon}`,
        };
        json[languageNative].push(info);
        console.log("Collected", name);
    });
}
for (let lang in json)
    json[lang].sort((a, b) => a.id.localeCompare(b.id));
console.log(jsonPath);
fs.writeFileSync(jsonMinPath, JSON.stringify(json));
fs.writeFileSync(jsonPath, JSON.stringify(json, null, "\t"));
console.log("Done ✅");
