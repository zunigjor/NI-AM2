## Stateful
* open
* add <item_id>
* process
* list
```
telnet localhost 8124
Connected to localhost.
Escape character is '^]'.
test
Warning: Bad request
list
order contains items:  and is: initial
open
opened order
add 1
added to order item: 1
add 2
added to order item: 2
list
order contains items: 1, 2 and is: opened
process
processed order with items: 1, 2
list
order contains items: 1, 2 and is: processed
add 1
Warning: Order not in state OPEN.
list
order contains items: 1, 2 and is: processed
add 3
Warning: Order not in state OPEN.
list
order contains items: 1, 2 and is: processed
```


## Stateless
* open <order_id>
* add <order_id> <item_id>
* process <order_id>
* list
```
telnet localhost 8124
Trying ::1...
Connected to localhost.
Escape character is '^]'.
open 1
opened order: 1
add 1 1
added order=1, item=1
open 2
opened order: 2
add 1 2
added order=1, item=2
add 2 1
added order=2, item=1
process 1
processed order: 1 with items: 1, 2
add 2 3
added order=2, item=3
process 3
Warning: Order cannot be found.
process 2
processed order: 2 with items: 1, 3
test
Warning: Bad request
asdf
Warning: Bad request
open
Warning: Bad open request.
process
Warning: Bad process request
open 1 2
Warning: Bad open request.
```