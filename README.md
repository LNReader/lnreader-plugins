# LNReader Plugins
<p>
<img  alt="GitHub issues by-label"  src="https://img.shields.io/github/issues/lnreader/lnreader-sources/Source%20Request?color=success&label=source%20requests">
<img  alt="GitHub issues by-label"  src="https://img.shields.io/github/issues/lnreader/lnreader-sources/Bug?color=red&label=bugs">
</p>

Repository to host plugins and related issues, and requests for
[LNReader](https://github.com/LNReader/lnreader).

## Installing
- Prerequisites: Nodejs >= 18
1. `npm install`
2.  Create `config.json` file in root dir

```json
{
	"githubUsername": "<username>",
	"githubRepository": "<repo>",
	"githubBranch": "<branch>"
}
```

Example
```json
{
	"githubUsername": "LNReader",
	"githubRepository": "lnreader-sources",
	"githubBranch": "master"
}
```


## Contributing

- [Quick start](./docs/quickstart.md)
- [Documentation](./docs/docs.md)

## Testing

#### via the testing website

1. Generate multi-src plugins using `npm generate`
2. Run the website `npm start`
3. Open `localhost:3000`
4. Find your plugin at the top-left search box
5. Test all the different functions below

[Detailed tutorial for testing website](./docs/website-tutorial.md)

#### via an app

1. Commit and push changes. Check if there are your dist files in your GitHub fork: `.dist/<username>/`

2. Change the values in [pluginManager.ts](https://github.com/LNReader/lnreader/blob/master/src/plugins/pluginManager.ts) (in-app) to yours
```ts
const  githubUsername = 'LNReader';
const  githubRepository = 'lnreader-sources';
const  githubBranch = 'master';
```
###### Note: No need to modify the `.dist` folder when opening PR. There's already action for that job.

----------

The developer of this application does not have any affiliation with the content providers available.
