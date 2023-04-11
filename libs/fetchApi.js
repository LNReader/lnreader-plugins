const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

  const defaultUserAgentString =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36';

async function fetchApi (url, init, pluginId){
    const headers = {
        ...init?.headers,
        'User-Agent': defaultUserAgentString,
    };
    return await fetch(url, { ...init, headers });
}

module.exports = fetchApi