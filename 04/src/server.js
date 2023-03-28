const http = require('http')
const url = require('url');
const Redis = require('ioredis');

const host = "am2-redis";
const port = 6379;

var client = new Redis({
    host: host,
    port: port,
});

client.on('connect', function() {
    console.log('Redis client connected');
});

client.on('error', function (err) {
    console.log('Redis error: ' + err);
});

http.createServer((req, res) => {
    const pathArray = url.parse(req.url,true).pathname.substring(1).split('/');

    console.log(`${pathArray}`)

    if (pathArray.length != 3 || pathArray[0] != 'person' || pathArray[2] != 'address') {
        res.writeHead(200, {'Content-Type': 'image/x-icon'} );
        res.end();
        return;
    }

    let name = pathArray[1];

    client.get(name, function (error, result) {
        if (error || result == null) {
            console.log(`Address not found for: '${name}'\n`);
            res.end(`Address not found for: '${name}'\n`);
            return;
        }

        console.log(`${result}\n`);
        res.end(`${result}\n`);
    });
}).listen(8888, () => {
    console.log("Server started")
});