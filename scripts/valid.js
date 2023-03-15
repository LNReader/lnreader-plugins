const languages = require('@libs/languages');
const isUrlAbsolute = require('@libs/isAbsoluteUrl');
const status = require('@libs/pluginStatus');
const cheerio = require('cheerio');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const packages = {
    '@libs/languages': languages,
    '@libs/isAbsoluteUrl': isUrlAbsolute,
    '@libs/pluginStatus': status,
    'cheerio': cheerio,
}

const _require = (pkg) => {
    return packages[pkg];
}
