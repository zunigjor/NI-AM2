// Author: Jorge Zuniga 2023

let net = require('net');

const Request = {
    OPEN: "open",
    ADD: "add",
    PROCESS: "process",
    LIST: "list",
}

const State = {
    INITIAL: "initial",
    OPENED: "opened",
    PROCESSED: "processed",
}

class Order {
    constructor() {
        this.state = State.INITIAL;
        this.items = [];
    }

    Open(socket) {
        if (this.state !== State.INITIAL){
            socket.write("Warning: Order cannot be opened.\n");
        }
        this.state = State.OPENED;
        socket.write("opened order\n")
    }

    Add(socket, item) {
        if (this.state !== State.OPENED) {
            socket.write("Warning: Order not in state OPEN.\n");
            return;
        }
        this.items.push(item);
        socket.write("added to order item: " + item + "\n");
    }

    Process(socket) {
        if (this.state !== State.OPENED) {
            socket.write("Warning: Order not in state OPEN.\n");
            return;
        }
        this.state = State.PROCESSED;
        socket.write("processed order with items: " + this.items.join(", ") + "\n");
    }

    List(socket){
        socket.write("order contains items: " + this.items.join(", ") + " and is: " + this.state + "\n");
    }
}

let server = net.createServer((socket) => {
    console.log('Socket opened');
    socket.setEncoding('utf8');

    let order = new Order();

    socket.on('close', () => {
        console.log('Connection closed');
    });

    socket.on('data', (data) => {
        // Allow:
        // open <id>
        // add <id> <id>
        // process <id>
        data = data.replace(/(\r\n|\n|\r)/gm, "")
        if (data === "") return;
        let line_start_re = /^/.source;
        let open_re = RegExp(Request.OPEN).source;
        let add_re = RegExp(Request.ADD).source;
        let process_re = RegExp(Request.PROCESS).source;
        let list_re = RegExp(Request.LIST).source;
        let num_re = /\s+\d+/.source;
        let line_end_re = /$/.source;
        let input_arr = data.split(" ");

        if (data.match(open_re)){
            if (!data.match(RegExp(line_start_re + open_re + line_end_re))){
                socket.write("Warning: Bad open request.\n");
                return;
            }
            order.Open(socket);
        } else if (data.match(add_re)) {
            if (!data.match(RegExp(line_start_re + add_re + num_re + line_end_re))){
                socket.write("Warning: Bad add request.\n");
                return;
            }
            order.Add(socket, input_arr[1]);
        } else if (data.match(process_re)){
            if (!data.match(RegExp(line_start_re + process_re + line_end_re))){
                socket.write("Warning: Bad process request.\n");
                return;
            }
            order.Process(socket);
        } else if (data.match(list_re)){
            if ( !data.match(RegExp(line_start_re + list_re + line_end_re))){
                socket.write("Warning: Bad list request.\n");
                return;
            }
            order.List(socket);
        } else {
            socket.write("Warning: Bad request\n");
        }
    });
});

server.listen(8124, () => {
    console.log('Server started');
});