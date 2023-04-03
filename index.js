require('module-alias/register');
const clc = require('cli-color');
const json_plugins = require('@scripts/json_plugins');
const test = require('@scripts/test');
(() => {
    const args = process.argv;
    if(args.includes('help')){
        console.log('', clc.green('npm start'));
        console.log('-', clc.green('test'), 'valid your plugin');
        console.log('-', clc.green('json'), 'generate json file')
        return;
    }
    const command = args[2];
    switch(command){
        case 'json':
            json_plugins();
            break;
        case 'test':
            if(args.length > 3){
                // test specified file
                test(args[3]);
            }else{
                // test all modified | added files
                test()
            }
            break;
        default:
            console.log(clc.red(command), "is not a valid command");
            console.log("Use", clc.green("npm start help"));
            break;
    }
})();