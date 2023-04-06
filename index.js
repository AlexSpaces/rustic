const http = require('http');
const https = require('https');
const url = require('url');

http.createServer(function(req, res) {
  const queryObject = url.parse(req.url,true).query;
  const requestedUrl = queryObject.url;
  
  if (!requestedUrl) {
    res.writeHead(400, {'Content-Type': 'text/plain'});
    res.end('Error: url parameter missing');
    return;
  }

  const options = {
    method: req.method,
    headers: req.headers,
    agent: new http.Agent({ keepAlive: true }),
    timeout: 5000
  };
  
  const proxyReq = https.request(requestedUrl, options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, {
      end: true
    });
  });
  
  req.pipe(proxyReq, {
    end: true
  });
  
}).listen(8080);
