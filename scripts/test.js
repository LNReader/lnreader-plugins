const child_process = require('child_process');
const clc = require('cli-color');
const path = require('path');
const { exit } = require('process');
const root = path.dirname(require.main.filename);
const allPlugins = require('@plugins/plugins.min.json');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const requiredProps = [
    'id', 'name', 'site', 'lang',
    'fetchImage', 'popularNovels', 'parseNovelAndChapters', 'parseChapter', 'searchNovels'
]
const optionalProps = ['icon', 'version', 'description', 'protected'];

const testPlugin = async (file, index) => {
    console.log(clc.blue(index));
    const plugin = require(`@${file.split('.')[0]}`);
    console.log('Checking if', clc.green(file), 'is a plugin...');

    requiredProps.forEach(prop => {
        if (!(prop in plugin)) {
            console.log(clc.bgRedBright('Error'), clc.red(prop), 'is not found');
            exit(-1);
        }
    });
    optionalProps.forEach(prop => {
        if (!(prop in plugin)) {
            console.log(clc.bgYellowBright('Warning'), clc.yellow(prop), 'is not found');
        }
    })

    // Check if this is a unique plugin and is new version.
    for (lang in allPlugins) {
        allPlugins[lang].forEach(_plg => {
            if (_plg.id === plugin.id) {
                if (_plg.lang !== plugin.lang || _plg.name !== plugin.name) {
                    console.log(clc.bgRedBright('Error'), 'duplicated of', clc.red(_plg.id), clc.blue(_plg.url));
                    exit(-1);
                } else if (_plg.version === plugin.version) {
                    console.log(clc.bgYellowBright('Warning'), "Did you change the version of", clc.yellow(plugin.id), '?')
                }
            }
        })
    }

    console.log("Testing", clc.green(plugin.id), '...');
    console.log('popularNovels');
    const popularNovels = await plugin.popularNovels(1);
    if (!Array.isArray(popularNovels) || popularNovels.length === 0 || !(popularNovels[0].url)) {
        console.log(clc.bgRedBright('Error'), clc.red(plugin.id), 'cant fetch popular novels');
        exit(-1);
    }

    await sleep(1500);
    console.log('parseNovelAndChapters');
    const novelItem = popularNovels[0];
    const novel = await plugin.parseNovelAndChapters(novelItem.url);
    if(!novel || !novel.name || !novel.chapters || novel.chapters.length === 0 || !(novel.chapters[0].url)){
        // why chapters length != 0, because this is popular novel!
        console.log(clc.bgRedBright('Error'), clc.red(plugin.id), 'cant parse novel and chapters');
        exit(-1);
    }

    await sleep(1500);
    console.log('parseChapter');
    const chapter = novel.chapters[0];
    const chapterText = await plugin.parseChapter(chapter.url);
    if(!chapterText || chapterText.length === 0){
        console.log(clc.bgRedBright('Error'), clc.red(plugin.id), 'cant parse chapter');
        exit(-1);
    }

    await sleep(1500);
    console.log('searchNovels');
    const term = novel.name.trim().split(' ')[0];
    const searchResults = await plugin.searchNovels(term);
    if (!Array.isArray(searchResults) || searchResults.length === 0 || !(searchResults[0].url)) {
        console.log(clc.bgRedBright('Error'), clc.red(plugin.id), 'cant search novels');
        exit(-1);
    }

    await sleep(1500);
    console.log('fetchImage');
    const base64 = await plugin.fetchImage(novel.cover || searchResults[0].cover);
    if(!base64 || base64.length === 0){
        console.log(clc.bgYellowBright('Error'), clc.yellow(plugin.id), 'cant fetch images');
    }

    console.log(clc.green(plugin.id), 'passed ✔️');
    console.log('----------');
}

const test = async (filePath) => {
    if(filePath){
        const cleanPath = path.join(...filePath.split(/\\+/g)).replaceAll("\\", "\/");
        if(!cleanPath.startsWith('plugins') || !cleanPath.endsWith('.js')){
            console.log(clc.bgRedBright('Error'), 'wrong file path!');
            return;
        }
        await testPlugin(cleanPath, 0);
    }else{
        const command = `cd ${root} && git add . && git status -s`;
        const files = child_process.execSync(command)
            .toString().trim().split('\n')
            ?.map(status => status.replaceAll(/\s+/g, ' ').split(' ').pop())
            .filter(file => file.endsWith('.js') && file.startsWith('plugins/'));
    
        for(let index in files){
            await testPlugin(files[index], index);
        }
    }

    console.log("done ✅");
};

module.exports = test;
