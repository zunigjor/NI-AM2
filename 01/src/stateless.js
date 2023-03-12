//Author: Jorge Zuniga 2023

let net = require('net');

const Request = {
    OPEN: "open",
    ADD: "add",
    PROCESS: "process",
    LIST: "list",
}

const State = {
    OPENED: "opened",
    PROCESSED: "processed",
}

class Order {
    constructor(id, state) {
        this.id = id;
        this.state = state;
        this.items = [];
    }
}

class OrdersDatabase {
    constructor() {
        this.orders = [];
    }

    Open(socket, orderId) {
        let order = this.orders.find(order => {
            return order.id === orderId;
        })
        if (order) {
            console.log(order);
            socket.write("Warning: Order ID already exists.\n");
            return;
        }
        this.orders.push(new Order(orderId, State.OPENED));
        socket.write("opened order: " + orderId + "\n");
    }

    Add(socket, orderId, item) {
        let order = this.orders.find(order => {
            return order.id === orderId;
        })
        if (!order) {
            socket.write("Warning: Order cannot be found.\n");
            return;
        }
        if (order.state !== State.OPENED) {
            socket.write("Warning: Order not in state OPEN.\n");
            return;
        }
        order.items.push(item);
        socket.write("added to order: " + orderId + ", item: " + item + "\n");
    }

    Process(socket, orderId) {
        let order = this.orders.find(order => {
            return order.id === orderId;
        })
        if (!order) {
            socket.write("Warning: Order cannot be found.\n");
            return;
        }
        if (order.state !== State.OPENED) {
            socket.write("Warning: Order not in state OPEN.\n");
            return;
        }
        order.state = State.PROCESSED;
        socket.write("processed order: " + orderId + " with items: " + order.items.join(", ") + "\n");
    }

    List(socket) {
        for (let order of this.orders){
            socket.write("order_id: " + order.id + " status: " + order.state + " items: " + order.items.join(", ") + "\n");
        }
    }
}



let server = net.createServer((socket) => {
    console.log('Socket opened');
    socket.setEncoding('utf8');

    let ordersDatabase = new OrdersDatabase();

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
            if (!data.match(RegExp(line_start_re + open_re + num_re + line_end_re))){
                socket.write("Warning: Bad open request.\n");
                return;
            }
            ordersDatabase.Open(socket, input_arr[1]);
        } else if (data.match(add_re)) {
            if (!data.match(RegExp(line_start_re + add_re + num_re + num_re + line_end_re))){
                socket.write("Warning: Bad add request.\n");
                return;
            }
            ordersDatabase.Add(socket, input_arr[1], input_arr[2]);
        } else if (data.match(process_re)){
            if (!data.match(RegExp(line_start_re + process_re + num_re + line_end_re))){
                socket.write("Warning: Bad process request.\n");
                return;
            }
            ordersDatabase.Process(socket, input_arr[1]);
        } else if (data.match(list_re)){
            if ( !data.match(RegExp(line_start_re + list_re + line_end_re))){
                socket.write("Warning: Bad list request.\n");
                return;
            }
            ordersDatabase.List(socket);
        } else {
            socket.write("Warning: Bad request\n");
        }
    });
});

server.listen(8124, () => {
    console.log('Server started');
});
