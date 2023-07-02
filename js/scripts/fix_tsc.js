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
const exports = module.exports = {"__esModule":true}
require("module-alias/register");
const fs = __importStar(require("fs"));
const languages_1 = require("@libs/languages");
const path = __importStar(require("path"));
const root = path.dirname(__dirname);
const replaceExports = (text) => {
    return text.replace(`Object.defineProperty(exports, "__esModule", { value: true });`, `const exports = module.exports = {"__esModule":true}`);
};
// plugins
for (let language in languages_1.languages) {
    // language with English name
    const languageNative = languages_1.languages[language];
    const langPath = path.join(root, "plugins", language.toLowerCase());
    if (!fs.existsSync(langPath))
        continue;
    const pluginFiles = fs.readdirSync(langPath);
    pluginFiles.forEach((plugin) => {
        if (plugin.startsWith("."))
            return;
        const pluginPath = path.join(langPath, plugin);
        console.log("Fixing", pluginPath);
        const fileContent = fs.readFileSync(pluginPath);
        const fileText = fileContent.toString();
        const replacedText = replaceExports(fileText);
        fs.writeFileSync(pluginPath, replacedText);
    });
}
// libs
const pathsToCheck = ["libs", "types", "scripts"];
for (let checkPath of pathsToCheck) {
    const fullPath = path.join(root, checkPath);
    if (!fs.existsSync(fullPath))
        continue;
    const libFiles = fs.readdirSync(fullPath);
    libFiles.forEach((libFile) => {
        const libPath = path.join(fullPath, libFile);
        console.log("Fixing", libPath);
        const fileContent = fs.readFileSync(libPath);
        const fileText = fileContent.toString();
        const replacedText = replaceExports(fileText);
        fs.writeFileSync(libPath, replacedText);
    });
}
console.log("Done ✅");
