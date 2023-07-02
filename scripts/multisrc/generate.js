const path = require('path');
const fs = require('fs');

const generate = async (name) => {
    const sourcesJson = require(`./${name}/sources.json`);
    if(!sourcesJson) return;
    const generator = require(`./${name}/template`);
    for(let sourceJson of sourcesJson){
        if(!sourceJson) continue;
        const { name, pluginScript } = generator(sourceJson);
        const filename = name.replace(/[\s-\.]+/g, '') + '_multisrc.ts';
        console.log(filename)
        // Write plugin with specific lang (English is default)
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