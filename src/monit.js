'use strict';

// A simple listener to let people know that we're alive.


var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Server up\n');
}).listen(1337, '127.0.0.1');
console.log('Monitoring server running at http://127.0.0.1:1337/');
