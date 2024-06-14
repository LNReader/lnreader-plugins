// Listen on a specific host via the HOST environment variable
var host = 'localhost';
// Listen on a specific port via the PORT environment variable
var port = 3001;
import cors_proxy from 'cors-anywhere';
cors_proxy.createServer({}).listen(port, host, function () {
  console.log('Running CORS Anywhere on ' + host + ':' + port);
});
