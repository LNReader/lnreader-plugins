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
const path = require('path');
const fs = require('fs');
const generate = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const sourcesJson = require(`./${name}/sources.json`);
    if (!sourcesJson)
        return;
    const generator = require(`./${name}/template`);
    for (let sourceJson of sourcesJson) {
        if (!sourceJson)
            continue;
        const { name, pluginScript } = generator(sourceJson);
        const filename = name.replace(/[\s-\.]+/g, '') + '_multisrc.ts';
        console.log(filename);
        // Write plugin with specific lang (English is default)
    }
});
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    const sources = fs.readdirSync(__dirname).filter(name => fs.lstatSync(path.join(__dirname, name)).isDirectory());
    for (let name of sources) {
        yield generate(name);
    }
});
run();
