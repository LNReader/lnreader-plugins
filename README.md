  

# LNReader Plugins

  

<p>

  

<img  alt="GitHub issues by-label"  src="https://img.shields.io/github/issues/lnreader/lnreader-sources/Source%20Request?color=success&label=source%20requests">

  

<img  alt="GitHub issues by-label"  src="https://img.shields.io/github/issues/lnreader/lnreader-sources/Bug?color=red&label=bugs">

  

</p>

  

Repository to host plugins and related issues, and requests for [LNReader](https://github.com/LNReader/lnreader).

## Installing

- Prerequisites: Nodejs >= 18
1. `npm install`
## Contributing

1. Choose your language in [plugins](./plugins)
2. Write your scripts



## Examples: 
+ [Hako](./plugins/vietnamese/LNHako.ts)
+ Multisrc: [multisrc](./scripts/multisrc)

## Testing
- If you are making a [multisrc](./scripts/multisrc):  `npm run generate`
- `npm start`
- Open http://localhost:3000 and test  

### If you want to test in app side.

- `./host.sh`

- Change these in [pluginManager.ts](https://github.com/LNReader/lnreader/blob/master/src/plugins/pluginManager.ts) (app repo) to yours

  

```ts
const  githubUsername = 'LNReader';
const  githubRepository = 'lnreader-sources';
```
----------

  

The developer of this application does not have any affiliation with the content providers available.
