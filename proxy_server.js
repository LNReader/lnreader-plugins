import http from 'http';
import httpProxy from 'http-proxy';

const CLIENT_HOST = 'http://localhost:3000';
const proxy = httpProxy.createProxyServer({});

const disAllowedHeaders = [
  'sec-ch-ua',
  'sec-ch-ua-mobile',
  'sec-ch-ua-platform',
  'sec-fetch-site',
  'origin',
  'sec-fetch-site',
  'sec-fetch-dest',
  'pragma',
];

const proxyRequest = (req, res) => {
  const _url = new URL(req.url);
  proxy.web(req, res, {
    target: _url.origin,
    selfHandleResponse: true,
    followRedirects: true,
  });
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
    res.setHeader(_header, proxyRes.headers[_header]);
  }
  delete proxyRes.headers['set-cookie'];
  delete proxyRes.headers['set-cookie2'];
  res.setHeader('Access-Control-Allow-Origin', CLIENT_HOST);
  res.setHeader('Access-Control-Allow-Credentials', true);
  proxyRes.on('data', function (chunk) {
    res.write(chunk);
  });
  proxyRes.on('end', function () {
    res.end();
  });
});

var temp_cookies = null;

const cookiesHandler = (req, res) => {
  let cookies = '';
  res.setHeader('Access-Control-Allow-Origin', CLIENT_HOST);
  res.setHeader('Access-Control-Allow-Credentials', true);
  req.on('readable', () => {
    cookies += req.read();
  });
  req.on('end', () => {
    temp_cookies = cookies;
    res.end();
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
    if (path === 'cookies') {
      cookiesHandler(req, res);
    } else {
      const _url = new URL(path);
      for (const _header of disAllowedHeaders) {
        delete req.headers[_header];
      }
      for (const _header in req.headers) {
        if (req.headers[_header]?.includes('localhost')) {
          delete req.headers[_header];
        }
      }
      req.headers['sec-fetch-mode'] = 'cors';
      if (temp_cookies) {
        req.headers['cookie'] = temp_cookies;
      }
      req.headers.host = _url.host;
      req.url = _url.toString();
      res.statusCode = 200;
      if (req.method === 'OPTIONS') {
        res.end();
      } else {
        proxyRequest(req, res);
      }
    }
  })
  .listen(3001);
