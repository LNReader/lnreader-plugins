const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const defaultUserAgentString =
  'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.128 Mobile Safari/537.36';

async function fetchApi (url, init, pluginId){
    const headers = {
        ...init?.headers,
        'User-Agent': defaultUserAgentString,
    };
    return await fetch(url, { ...init, headers });
}

module.exports = fetchApi