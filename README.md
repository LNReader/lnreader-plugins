# LNReader Plugins

<p>
  <img alt="GitHub issues by-label" src="https://img.shields.io/github/issues/lnreader/lnreader-sources/Source%20Request?color=success&label=source%20requests">
  <img alt="GitHub issues by-label" src="https://img.shields.io/github/issues/lnreader/lnreader-sources/Bug?color=red&label=bugs">
</p>

Repository to host plugins and related issues, and requests for [LNReader](https://github.com/LNReader/lnreader).

## Contributing

1. Please use this [template](./template.js) or [template.min](./template.min.js)
2. Choose your language in [./plugins](./plugins) <br>
If your language doenst exist, please request us. We will add it soon.
3. Write your scripts <br>
See example: [Hako](./plugins/vietnamese/hako.js)
4. Valid your scripts <br>
```js
npm start test

// Or test with specified file
npm start test [path]
// For example: npm run test ./plugins/vietnamese/hako.js
```

5. Generate json
Generate json file by
```
npm start json
```
----------

* NOTE: If you want to test plugin in app side, remember to config these things.

in [json_plugin.js](./scripts/json_plugins.js)
```
const githubIconsLink = 'https://raw.githubusercontent.com/nyagami/plugins/main/icons';
const githubIconSuffix = '?raw=true';
const githubPluginsLink = 'https://raw.githubusercontent.com/nyagami/plugins/main/plugins';
const githubPluginSuffix = '?newtest=true';
```

in [pluginManager.ts](https://github.com/nyagami/lnreader/blob/install_sources/src/plugins/pluginManager.ts)
```
const fetchPlugins = async () => {
  const availablePlugins: Record<Languages, Array<PluginItem>> = await fetch(
    'https://raw.githubusercontent.com/nyagami/plugins/main/plugins/plugins.min.json?newtest=true',
  ).then(res => res.json());
  return availablePlugins;
};
```

----------
The developer of this application does not have any affiliation with the content providers available.
