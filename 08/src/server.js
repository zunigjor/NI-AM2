const https = require('https');
const fs = require('fs');

const PORT = 8888;

const options = {
    key: fs.readFileSync('localhost-privkey.pem'),
    cert: fs.readFileSync('localhost-cert.pem')
};

https.createServer(options, (req, res) => {
   res.writeHead(200, {
       'content-type': 'text/html',
       'Cache-Control': 'no-cache',
       'Access-Control-Allow-Origin': '*',
       'Access-Control-Allow-Headers': 'X-Requested-With'
   });

   res.end(fs.readFileSync('index.html'));
}).listen(PORT, () => {
    console.log("http/2 server started on port:", PORT);
});
