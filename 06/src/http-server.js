const http = require('http');
const fs = require('fs');
const path = require('path')

const HTTP_SERVER_PORT = 8888;

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile('index.html', (err, data) => {
            if (err) {
                res.setHeader('Content-Type', 'text/plain');
                res.statusCode = 500;
                res.end('Error loading: index.html');
                console.log('500: Error loading: index.html')
            } else {
                res.setHeader('Content-Type', 'text/html');
                res.statusCode = 200;
                res.end(data);
                console.log('200: index.html')
            }
        });
    } else {
        const filename = path.join(__dirname, req.url);
        fs.readFile(filename, (err, data) => {
            if (err) {
                res.setHeader('Content-Type', 'text/plain');
                res.statusCode = 404;
                res.end('File ' + req.url + ' not found');
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
                res.setHeader('Content-Type', contentType);
                res.statusCode = 200;
                res.end(data);
                console.log('200: ' + req.url)
            }
        });
    }
});

server.on('error', (err) => console.error(err));

server.listen(HTTP_SERVER_PORT, () => {
    console.log("http server started on port:", HTTP_SERVER_PORT);
});