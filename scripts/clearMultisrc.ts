import * as path from 'path'
import * as fs from 'fs'

const pluginDir = 'plugins'
fs.readdirSync(pluginDir).forEach(lang => {
    const langDir = path.join(pluginDir, lang);
    fs.readdirSync(langDir).forEach(plugin => {
        if(plugin.endsWith('.ts') && plugin.includes("[")){
            fs.unlinkSync(path.join(langDir, plugin));
        }
    })
})