const http = require('http');
const url = require('url');

const port = 8888;

let server = http.createServer((req, res) => {
    const helloValue = url.parse(req.url,true).pathname.substring(1);
    if (helloValue === 'favicon.ico') {
        res.writeHead(200, {'Content-Type': 'image/x-icon'} );
        res.end();
        return;
    }
    console.log(`Hello ${helloValue}`)
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(`Hello ${helloValue}\n`);

});

server.listen(port, () => {
    console.log('Server started');
});
