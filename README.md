# LNReader Plugins

<p>
<img alt="LNReader plugins counting" src="https://raw.githubusercontent.com/LNReader/lnreader-plugins/plugins/v3.0.0/total.svg">
<img alt="GitHub issues by-label"  src="https://img.shields.io/github/issues/lnreader/lnreader-plugins/Plugin%20Request?color=success&label=plugin%20requests">
<img  alt="GitHub issues by-label"  src="https://img.shields.io/github/issues/lnreader/lnreader-plugins/Bug?color=red&label=bugs">
</p>

Repository to host plugins and related issues, and requests for
[LNReader](https://github.com/LNReader/lnreader).

## Installing

- Prerequisites: Nodejs >= 20

1. `npm install`

## Contributing

- [Quick start](./docs/quickstart.md)
- [Documentation](./docs/docs.md)

## Testing

#### via the testing website

1. Run `npm run dev:start` and open `localhost:3000` to test!

[Detailed tutorial for testing website](./docs/website-tutorial.md)

#### via an app

1. Plugins from GitHub
   - Run `npm run publish:plugins` or `npm run publish:plugins:windows` (depending on your operating system)
   - Add your `https://raw.githubusercontent.com/<username>/<repo>/plugins/<tag>/.dist/plugins.min.json` to app repository
2. Plugins from localhost
   - Copy `.env.template` to `.env` and update `USER_CONTENT_BASE` according to the comment there
   - Run `npm run serve:dev`
   - Add plugin listing to app repository (e.g. for android emulator `http://10.0.2.2/.dist/plugins.min.json`)

---

The developers of this application are not affiliated with any of the content providers.

If you are a website owner and would like to have a plugin removed from this repository, please reach out via [Discord](https://discord.gg/QdcWN4MD63) or [create a GitHub issue](https://github.com/LNReader/lnreader-plugins/issues/new). We will promptly remove the plugin and add your site to the [blacklist](BLACKLIST.json) to prevent it from being re-added.
