const http = require('http');

const server = http.createServer((request, response) => {
    response.writeHead(200 , {
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache'
    })

    let id = 1;
    // Event streaming.
    setInterval(() => {
        response.write(
            `event: MyEvent\nid: ${id}\ndata: Event #${id}.\n\n`
        );
        console.log(id);
        id++;
    }, 2 * 1000);
});

// Listen.
server.listen(8888);