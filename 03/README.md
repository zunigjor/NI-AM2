# HW3 - Node.js server in Docker

https://courses.fit.cvut.cz/NI-AM2/hw/03/index.html

___

* Naimplementoval jsem jednoduchý Hello server v souboru `src/server.js`.
* V souboru `Dockerfile` jsem definoval image, která spouští tento server.
* Příkazem `docker build -t am2-hw-03 .` ve složce `src` jsem vytvořil image.
* Příkazem `docker run -p 8880:8888/tcp` jsem spustil kontejner a namapoval port 8880 na port kontejneru 8888.
* Příkazem `docker ps` jsem zkontroloval, že kontejner běží.
* Z prohlížeče jsem přistoupil na adresu `http://localhost:8880/` kde server běžel a odpovídal.
  * `http://localhost:8880/` -> `Hello`
  * `http://localhost:8880/Jorge` -> `Hello Jorge`
* Kontejner jsem zastavil příkazem `docker stop <CONTAINER ID>`.