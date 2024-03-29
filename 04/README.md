# HW4 - Docker advanced

https://courses.fit.cvut.cz/NI-AM2/hw/04/index.html

___
* Příkazem `docker run -p 8881:6379 --hostname am2-redis -d --name am2-redis redis` jsem vytvořil kontejner se jménem am2-redis.
** Příkazem `docker run -it --link am2-redis:redis --name am2-redis-client redis sh` jsem spustil klienta,
kterého jsem přepínačem `--link` propojil k vytvořenému am2-redis kontejneru.
** Uvnitř po zavolání `cat /etc/hosts` je vidět, že klientský kontejner má k dispozici kontejner `am2-redis` skrz IP adresu `172.17.0.2`.
** Příkazem `redis-cli -h am2-redis` jsem se připojil k redisu v kontejneru am2-redis.
** Příkazem `ping` jsem vyzkoušel, že redis odpovídá.
* Příkazy `set Kuchar "Thankurova 9, 160 00, Prague"`, `set Jorge "Adresni 123, 123 00, Prague"`
jsem do redisu vložil záznamy.
** Příkazem `docker run -it --link am2-redis:redis --name am2-redis-client-2 redis sh` jsem spustil druhého klienta odkud
jsem vyzkoušel příkazy `get Kuchar`, `get Jorge` a tím potvrdil nezávislost kontejneru am2-redis na klientech.
* V souboru `src/server.js` jsem napsal implementaci jednoduchého serveru, na portu 8888, který volá redis a z něj
vytahuje data kterými odpovídá na requesty ve formátu `http://localhost:8888/person/{person_name}/address`.
Využil jsem balíčku `ioredis`, protože mi samotný redis nefungoval.
* Poté jsem vytvořil Dockerfile a zavolal příkaz `docker build -t am2-hw-04 .`, kterým jsem vytvořil image.
* Příkazem `docker run --link am2-redis:redis -p 8888:8888 --name am2-hw-04-con am2-hw-04` jsem spustil kontejner s
běžícím serverem, který odpovídá na adrese `localhost:8888`
** `curl http://localhost:8888/person/Jorge/address` -> `Adresni 123, 123 00, Prague`
** `curl http://localhost:8888/person/Kuchar/address` -> `Thankurova 9, 160 00, Prague`
* Výpis terminálu v kontejneru `am2-hw-04-con`:
___
```
> start
> node server.js

Server started
Redis client connected
person,Kuchar,address
Thankurova 9, 160 00, Prague

person,Jorge,address
Adresni 123, 123 00, Prague

person,test,address
Address not found for: 'test'
```