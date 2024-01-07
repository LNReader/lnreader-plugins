import * as path from 'path'
import * as fs from 'fs'

for (let pluginDir of ['plugins', path.join('.js', 'plugins')]){    
    if(fs.existsSync(pluginDir)){
        fs.readdirSync(pluginDir).forEach(lang => {
            const langDir = path.join(pluginDir, lang);
            fs.readdirSync(langDir).forEach(plugin => {
                if(plugin.includes("[") && plugin.includes("]")){
                    fs.unlinkSync(path.join(langDir, plugin));
                }
            })
        })
    }
}
