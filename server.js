const http = require("http");
const url = require("url");
//const Stream = require("stream");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { lookup } = require("mime-types");
const port = process.env.PORT;
const server = http.createServer(function (req, res) {
  //

  const filter = /^\/+/g;
  const myUrl = url.parse(req.url);
  let parsedUrl = myUrl.pathname.replace(filter, "");
  let file = path.join(__dirname, "public", parsedUrl);

  if (parsedUrl === "") {
    file = "./public/index.html";
  }
  res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
  fs.readFile(file, (err, data) => {
    if (err) {
      console.log(`File not found ${file}`);
      res.writeHead(404);
      fs.readFile("./public/error.html", (err, data) => res.end(data));
    } else {
      const mime = lookup(parsedUrl);
      res.writeHead(200, { "Content-type": mime });
      switch (parsedUrl) {
        case "index.html":
          res.writeHead(200, { "Content-type": "text/html" });
          break;
        case "about.html":
          res.writeHead(200, { "Content-type": "text/html" });
          break;
        default:
          break;
      }
      res.end(data);
    }
  });
});

server.listen(3000, () => console.log(`Listening on port ${port}`));
