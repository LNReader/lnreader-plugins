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
3. Write your script <br>
See example: [Hako](./plugins/vietnamese/hako.js)
4. Valid your script <br>
```
npm start test
```
<br>
5. Generate json

Finally, comment or remove fetch import in your script
```js
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
```
Dont worry if you forget it, below command will do it for you xD

Generate json file by
```
npm start json
```
----------

The developer of this application does not have any affiliation with the content providers available.
