import http from 'http';
import httpProxy from 'http-proxy';
import { exec } from 'child_process';

const proxy = httpProxy.createProxyServer({});
const ServerSettings = {
  CLIENT_HOST: 'http://localhost:3000',
  fetchMode: 'proxy',
  cookies: null,
  disAllowedRequestHeaders: [
    'sec-ch-ua',
    'sec-ch-ua-mobile',
    'sec-ch-ua-platform',
    'sec-fetch-site',
    'origin',
    'sec-fetch-site',
    'sec-fetch-dest',
    'pragma',
  ],
  disAllowResponseHeaders: ['link', 'set-cookie', 'set-cookie2'],
  useUserAgent: true,
};

const proxyRequest = (req, res) => {
  const _url = new URL(req.url);
  console.log('\x1b[36m', '----------------');
  console.log(
    `Making proxy request - at ${new Date().toLocaleTimeString()}
url: ${_url.href}
headers:`,
  );
  Object.entries(req.headers).forEach(([name, value]) => {
    console.log('\t', '\x1b[32m', name + ':', '\x1b[37m', value);
  });
  console.log('\x1b[36m', '----------------');
  if (ServerSettings.fetchMode === 'curl') {
    //i mean if it works it works i guess, better than nothing
    let curl = `curl '${_url.href}'`;
    if (ServerSettings.useUserAgent) {
      curl += ` -H 'User-Agent: ${req.headers['user-agent']}'`;
    }
    if (ServerSettings.cookies)
      curl += ` -H 'Cookie: ${ServerSettings.cookies}'`;
    if (req.headers.origin2) curl += ` -H 'Origin: ${req.headers.origin2}'`;

    console.log('Running curl command:', curl);

    const isWindows = process.platform === 'win32';
    const options = isWindows
      ? {
          shell:
            process.env.BASH_LOCATION ||
            process.env.ProgramFiles + '\\git\\usr\\bin\\bash.exe',
        }
      : {};

    exec(curl, options, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        res.statusCode = 500;
        res.write(`exec error: ${error}`);
        res.end();
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      res.statusCode = 200;
      res.write(stdout);
      res.end();
    });
  } else if (ServerSettings.fetchMode === 'node-fetch') {
    fetch(_url.href, {
      'headers': {
        'cookie': ServerSettings.cookies,
        'origin': req.headers.origin2,
        'user-agent': ServerSettings.useUserAgent
          ? req.headers['user-agent']
          : undefined,
      },
    })
      .then(res2 => res2.text())
      .then(res2 => {
        res.statusCode = 200;
        res.write(res2);
        res.end();
      })
      .catch(err => {
        console.error(err);
        res.statusCode = 500;
        res.end();
      });
  } else if (ServerSettings.fetchMode === 'proxy') {
    proxy.web(req, res, {
      target: _url.origin,
      selfHandleResponse: true,
      followRedirects: true,
    });
  }
};

proxy.on('proxyRes', function (proxyRes, req, res) {
  var statusCode = proxyRes.statusCode;
  // Redirect
  if (
    statusCode === 301 ||
    statusCode === 302 ||
    statusCode === 303 ||
    statusCode === 307 ||
    statusCode === 308
  ) {
    req.method = 'GET';
    req.headers['content-length'] = '0';
    delete req.headers['content-type'];
    // Remove all listeners (=reset events to initial state)
    req.removeAllListeners();

    // Remove the error listener so that the ECONNRESET "error" that
    // may occur after aborting a request does not propagate to res.
    // https://github.com/nodejitsu/node-http-proxy/blob/v1.11.1/lib/http-proxy/passes/web-incoming.js#L134
    proxyReq.removeAllListeners('error');
    proxyReq.once('error', function catchAndIgnoreError() {});
    proxyReq.abort();

    // Initiate a new proxy request.
    proxyRequest(req, res);
    return false;
  }
  for (const _header in proxyRes.headers) {
    if (!ServerSettings.disAllowResponseHeaders.includes(_header)) {
      res.setHeader(_header, proxyRes.headers[_header]);
    }
  }
  for (const _header in ServerSettings.disAllowedRequestHeaders) {
    delete proxyRes.headers[_header];
  }
  proxyRes.on('data', function (chunk) {
    res.write(chunk);
  });
  proxyRes.on('end', function () {
    res.end();
  });
});

const settingsHandler = (req, res) => {
  let str = '';
  req.on('data', chunk => {
    str += chunk;
  });
  req.on('end', () => {
    try {
      const settings = JSON.parse(str);
      for (let setting in settings) {
        ServerSettings[setting] = settings[setting];
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(ServerSettings));
    } catch {
      res.statusCode = 400;
    } finally {
      res.end();
    }
  });
};

http
  .createServer(function (req, res) {
    const path = req.url.charAt(0) === '/' ? req.url.slice(1) : req.url;
    if (req.headers['access-control-request-method']) {
      res.setHeader(
        'access-control-allow-methods',
        req.headers['access-control-request-method'],
      );
      delete req.headers['access-control-request-method'];
    }
    if (req.headers['access-control-request-headers']) {
      res.setHeader(
        'access-control-allow-headers',
        req.headers['access-control-request-headers'],
      );
      delete req.headers['access-control-request-headers'];
    }
    res.setHeader('Access-Control-Allow-Origin', ServerSettings.CLIENT_HOST);
    res.setHeader('Access-Control-Allow-Credentials', true);
    if (req.method === 'OPTIONS') {
      res.statusCode = 200;
      res.end();
    } else if (path === 'settings') {
      settingsHandler(req, res);
    } else {
      try {
        const _url = new URL(path);
        for (const _header in req.headers) {
          if (
            req.headers[_header]?.includes('localhost') ||
            ServerSettings.disAllowedRequestHeaders.includes(_header)
          ) {
            delete req.headers[_header];
          }
        }
        req.headers['sec-fetch-mode'] = 'cors';
        if (ServerSettings.cookies) {
          req.headers['cookie'] = ServerSettings.cookies;
        }
        if (!ServerSettings.useUserAgent) {
          delete req.headers['user-agent'];
        }
        req.headers.host = _url.host;
        req.url = _url.toString();
        res.statusCode = 200;
        proxyRequest(req, res);
      } catch (err) {
        console.log('\x1b[31m', '----------ERRROR----------');
        console.error(err);
        console.log('\x1b[31m', '----------ERRROR----------');
        if (!res.closed) {
          res.end();
        }
      }
    }
  })
  .listen(3001);
