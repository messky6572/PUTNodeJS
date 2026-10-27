// module http

const http = require("http");

// data global awal

let task = [
  { id: 1, nama: "laptop", harga: 120 },
  { id: 2, nama: "handphone", harga: 115 },
];

// main server

const server = http.createServer((req, res) => {
  // CORS

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // split url

  const partUrl = req.url.split("/");
  const id = parseInt(partUrl[2]);

  // routing

  // PUT endpoint

  if (req.method === "PUT" && partUrl[1] === "data" && !isNaN(id)) {
    // penyimpanan sementara

    let body = [];

    // proses penerimaan data per potong (chunk)

    req.on("data", (chunk) => {
      body.push(chunk);
    });

    // proses penerimaan data terakhir

    req.on("end", () => {
      // try & error

      try {
        // mengubah data mentah ke string javascript

        const bodyToString = Buffer.concat(body);
        const dataSiap = JSON.parse(bodyToString.toString());

        // pengecekan ID

        const indexId = task.find((idBarang) => {
          return idBarang === id;
        });

        // validation

        if (
          dataSiap.id !== indexId ||
          dataSiap.id === -1 ||
          dataSiap.nama === "" ||
          dataSiap.harga <= 0
        ) {
          res.writeHead(400, { "content-type": "application/json" });
          return res.end(
            JSON.stringify({
              messages: "format data tidak valid!",
            }),
          );
        }

        // kode perubahan data

        task = {
          id: id,
          ...dataSiap,
        };

        // informasi berhasil (succes)

        let pesanSukses = {
          messages: "data berhasil diubah! (PUT method)",
          data: task,
        };

        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(pesanSukses));
      } catch (err) {
        console.error(err);
        res.writeHead(400, { "content-type": "application/json" });
        res.end(
          JSON.stringify({
            pesan: "Bad request! Error!",
          }),
        );
      }
    });
  }
});

let PORT = 3000;

server.listen(3000, () => {
  console.log("server berjalan di port " + PORT);
});
