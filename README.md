
  
# LNReader Plugins

<p>
  <img alt="GitHub issues by-label" src="https://img.shields.io/github/issues/lnreader/lnreader-sources/Source%20Request?color=success&label=source%20requests">
  <img alt="GitHub issues by-label" src="https://img.shields.io/github/issues/lnreader/lnreader-sources/Bug?color=red&label=bugs">
</p>

Repository to host plugins and related issues, and requests for [LNReader](https://github.com/LNReader/lnreader).

## Contributing

1. Please use this [template](./template.js) or [template.min](./template.min.js)
2. Choose your language in [./plugins](./plugins)
+ If your language doenst exist, please request us. We will add it soon.
3. Write your scripts
+ See example: [Hako](./plugins/vietnamese/LNHako.js)

## Test your script
We use expressjs to make an UI web for testing.
1. Installing
	```
	npm install
	```
2. Running
	```
	nodemon index.js
	```
	+ Then open http://localhost:3000
3. Testing
	+ Find you plugin
	+ Check if all functions of your plugin work properly
####  No need to reload webpage after changing your plugin script. 
4. JSON
	+ Just press `JSON plugins` button
	+ The results will be printed in your console
- One more thing: you can use [cheerio_space](./cheerio_space) to build functions without requesting to the site.
----------

 If you want to test plugin in app side, remember to config these things.

in [json_plugin.js](./api/json_plugins.js)
```ts
const  username = "nyagami";
const  repo = "plugins";
const  branch = "main"
```

in [pluginManager.ts](https://github.com/nyagami/lnreader/blob/install_sources/src/plugins/pluginManager.ts)
```ts
const fetchPlugins = async () => {
  const availablePlugins: Record<Languages, Array<PluginItem>> = await fetch(
    'https://raw.githubusercontent.com/nyagami/plugins/main/plugins/plugins.min.json',
  ).then(res => res.json());
  return availablePlugins;
};
```

----------
The developer of this application does not have any affiliation with the content providers available.
