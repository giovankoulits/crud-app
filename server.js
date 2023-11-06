var http = require("node:http");
var url = require("node:url");
const StringDecoder = require("node:string_decoder").StringDecoder;
const util = require("node:util");
const formidable = require("formidable");

const server = http.createServer((req, res) => {
  let path = url.parse(req.url, true);
  let decoder = new StringDecoder("utf8");
  let buffer = "";

  if (req.method.toLowerCase() === "post") {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log(err);
        return;
      }
      res.writeHead(200, "OK", { "Content-Type": "text/plain" });
      res.write("The POST output response\n\n");
      res.end(util.inspect({ fields, files }));
    });
  } else if (req.method.toLowerCase() === "get") {
    res.writeHead(200, "OK", { "Content-Type": "text/plain" });
    res.write("The response \n\n");
    res.write(util.inspect(path.query) + "\n\n");
    res.end("End of message to Browser");
  } else {
    ///
  }

  /*   req.on("data", (chunk) => {
    buffer += decoder.write(chunk);
  }); */

  /*   req.on("end", () => {
    //buffer += decoder.end();
    res.writeHead(200, "OK", { "Content-Type": "text/plain" });
    res.write("The response \n\n");
    res.write(util.inspect(path.query) + "\n\n");
    res.write(buffer + "\n\n");
    res.end("End of message");
  }); */
});

server.listen(1234, () => {
  console.log("Listening on port 1234");
});
