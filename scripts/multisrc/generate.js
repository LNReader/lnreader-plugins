const path = require('path');
const fs = require('fs');

const generate = async (name) => {
    const sourcesJson = require(`./${name}/sources.json`);
    if(!sourcesJson) return;
    const generator = require(`./${name}/generator`);
    for(let sourceJson of sourcesJson){
        if(!sourceJson) continue;
        const { lang, sourceName, pluginScript } = generator(sourceJson);
        const filename = sourceName.replace(/[\s-\.]+/g, '') + `[${name}].ts`;
        const pluginsDir = path.join(path.dirname(path.dirname(__dirname)), 'plugins');
        const filePath = path.join(pluginsDir, lang.toLowerCase(), filename);
        fs.writeFileSync(filePath, pluginScript, {encoding: 'utf-8'});
    }
}

const run = async () => {
    const sources = fs.readdirSync(__dirname).filter(
        name => fs.lstatSync(path.join(__dirname, name)).isDirectory()
    );

    for(let name of sources){
        await generate(name);
    }
}

run();