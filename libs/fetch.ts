import { cookieManager } from '@libs/сookie';

type FetchInit = {
    headers?: Record<string, string | undefined> | Headers;
    method?: string;
    body?: FormData | string;
    [x: string]:
        | string
        | Record<string, string | undefined>
        | undefined
        | FormData
        | Headers;
};

const makeInit = async (url: string, init?: FetchInit) => {
    const cookies = await cookieManager.get(url);
    let defaultHeaders: Record<string, string> = {
        Connection: 'keep-alive',
        Accept: '*/*',
        'Accept-Language': '*',
        'Sec-Fetch-Mode': 'cors',
        'Accept-Encoding': 'gzip, deflate',
        'Cache-Control': 'max-age=0',
    };
    if (cookies.length) {
        defaultHeaders.Cookie = cookies
            .map(({ name, value }) => name + '=' + value)
            .join('; ');
    }
    try {
        const { getHeaders } = await import('../index.js');
        defaultHeaders = {
            ...defaultHeaders,
            ...getHeaders(),
        };
    } catch {
        // nothing to do
    }
    if (init?.headers) {
        if (init.headers instanceof Headers) {
            for (const [name, value] of Object.entries(defaultHeaders)) {
                if (!init.headers.get(name)) init.headers.set(name, value);
            }
        } else {
            init.headers = {
                ...defaultHeaders,
                ...init.headers,
            };
        }
    } else {
        init = {
            ...init,
            headers: defaultHeaders,
        };
    }
    return init;
};

const addCookies = async (url: string, cookies: string[]) =>
    Promise.all(
        cookies.map((cookie) => cookieManager.setFromResponse(url, cookie)),
    );

/**
 * Fetch with (Android) User Agent
 * @param url
 * @param init
 * @returns response as normal fetch
 */
export async function fetchApi(url: string, init?: FetchInit) {
    init = await makeInit(url, init);
    // console.log(init.headers);
    console.log(url, init);
    const res = await fetch(url, init as RequestInit);
    if (res.headers.has('set-cookie')) {
        await addCookies(url, res.headers.getSetCookie());
    }
    return res;
}

/**
 *
 * @param url
 * @param init
 * @returns base64 string of file
 * @example fetchFile('https://avatars.githubusercontent.com/u/81222734?s=48&v=4');
 */
export const fetchFile = async function (url: string, init?: FetchInit) {
    init = await makeInit(url, init);
    console.log(url, init);
    try {
        const res = await fetch(url, init as RequestInit);
        if (res.headers.has('set-cookie')) {
            await addCookies(url, res.headers.getSetCookie());
        }
        if (!res.ok) return '';
        const arrayBuffer = await res.arrayBuffer();
        return Buffer.from(arrayBuffer).toString('base64');
    } catch (e) {
        return '';
    }
};

/**
 *
 * @param url
 * @param init
 * @param encoding default: `utf-8`. link: https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder/encoding
 * @returns plain text
 * @example fetchText('https://github.com/LNReader/lnreader', {}, 'gbk');
 */
export const fetchText = async function (
    url: string,
    init?: FetchInit,
    encoding?: string,
): Promise<string> {
    init = await makeInit(url, init);
    console.log(url, init);
    try {
        const res = await fetch(url, init as RequestInit);
        if (res.headers.has('set-cookie')) {
            await addCookies(url, res.headers.getSetCookie());
        }
        if (!res.ok) return '';
        const arrayBuffer = await res.arrayBuffer();
        const decoder = new TextDecoder(encoding);
        return decoder.decode(arrayBuffer);
    } catch (e) {
        return '';
    }
};
