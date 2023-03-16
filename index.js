require('module-alias/register')
const fs = require('fs');
const path = require('path')
const languages = require('@libs/languages');
const root = path.dirname(require.main.filename);
const githubIconsLink = 'https://raw.githubusercontent.com/nyagami/plugins/main/icons';
const githubIconSuffix = '?raw=true';
const githubPluginsLink = 'https://raw.githubusercontent.com/nyagami/plugins/main/plugins';
const githubPluginSuffix = '?newtest=true';

(() => {
    const args = process.argv;
    if(args.includes('help')){
        console.log(`
        npm start:
        [valid [./your-path-file]]: valid your plugin script
        [json]: generate json file
        `);
        return;
    }
    const command = args[2];
    switch(command){
        case 'json':
            const json = {};
            const jsonPath = path.join(root, 'plugins', 'plugins.json');
            const jsonMinPath = path.join(root,'plugins', 'plugins.min.json');
            for(let language in languages){     //language with English name
                const langPath = path.join(root, 'plugins', language.toLowerCase());
                if(!fs.existsSync(langPath)) continue;
                try{
                    const plugins = fs.readdirSync(langPath);
                    json[languages[language]] = [];
                    plugins.forEach(plugin => {
                        const instance = require(`@plugins/${language.toLowerCase()}/${plugin.split('.')[0]}`)
                        const {id, name, lang, version, icon, description} = instance
                        const info = {id, name, lang, version, description} // lang: language with native name
                        info.url = `${githubPluginsLink}/${language.toLowerCase()}/${plugin}${githubPluginSuffix}`;
                        info.iconUrl = `${githubIconsLink}/${icon}${githubIconSuffix}`;
                        json[lang].push(info);
                    });
                }catch(e){
                    console.log(e);
                }
            }
            fs.writeFileSync(jsonMinPath, JSON.stringify(json));
            fs.writeFileSync(jsonPath, JSON.stringify(json, null, '\t'));
            console.log('done');
            break;
        case 'valid':
            break;
        default:
            console.log(command, 'is not valid command. Using help to see');
    }
})();