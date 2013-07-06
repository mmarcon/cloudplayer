var static = require('node-static');

var file = new(static.Server)('./dist');

require('http').createServer(function (request, response) {
    file.serve(request, response);
}).listen(process.env.VMC_APP_PORT || 1337);