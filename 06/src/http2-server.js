const fs = require('fs');
const http2 = require('http2')
const path = require('path')

const HTTP2_SERVER_PORT = 8889;

const server = http2.createSecureServer({
    key: fs.readFileSync('localhost-privkey.pem'),
    cert: fs.readFileSync('localhost-cert.pem')
})

server.on('stream', (stream, headers) => {
    if (headers[":path"] === '/') {
        fs.readFile('index.html', (err, data) => {
            if (err) {
                stream.respond({
                    'content-type': 'text/plain',
                    ':status': 500
                });
                stream.end('Error loading: index.html');
                console.log('500: Error loading: index.html')
            } else {
                stream.respond({
                    'content-type': 'text/html',
                    ':status': 200
                });
                stream.end(data);
                console.log('200: index.html')
            }
        });
    } else {
        const filename = path.join(__dirname, headers[':path']);
        fs.readFile(filename, (err, data) => {
            if (err) {
                stream.respond({'content-type': 'text/plain', ':status': 404});
                stream.end('File not found');
                console.log('404: Not found: ' + filename)
            } else {
                const extension = path.extname(filename);
                let contentType = 'text/plain';
                switch (extension) {
                    case '.css':
                        contentType = 'text/css';
                        break;
                    case '.jpg':
                    case '.jpeg':
                        contentType = 'image/jpeg';
                        break;
                }
                stream.respond({
                    'content-type': contentType,
                    ':status': 200
                });
                stream.end(data);
                console.log('200: ' + headers[':path'])
            }
        });
    }
});

server.on('error', (err) => console.error(err));

server.listen(HTTP2_SERVER_PORT, () => {
    console.log("http/2 server started on port:", HTTP2_SERVER_PORT);
});