const fs = require('fs');
const pluginDir = "plugins";
const langs = fs.readdirSync(pluginDir);
const path = require('path')
langs.forEach(lang => {
    langPath = path.join(pluginDir, lang);
    const plugins = fs.readdirSync(langPath);
    plugins.forEach(plugin => {
        if(plugin.endsWith('.broken.ts')) return;
        const pluginPath = path.join(langPath, plugin);
        if(plugin.endsWith('.ts')){
            fs.rename(pluginPath, pluginPath.replace('.ts', '.broken.ts'), (e) => {
                console.log(e);
            });
        }
    })
})