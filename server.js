const http = require("http");
const url = require("url");
//const Stream = require("stream");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const port = process.env.PORT;
const server = http.createServer(function (req, res) {
  const file = path.join(__dirname, "spacepic", "spacepic.jpg");
  const headers = {
    "Access-Control-Allow-Origin": "*",
  };
  if (fs.existsSync(file.toString())) {
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(300, "no such file", {
          ...headers,
          "content-type": "text/html;",
        });
        res.end("<h1>no such file</h1>");
      } else {
        res.writeHead(200, "here is your pic", {
          ...headers,
          "content-type": "image/jpeg",
        });
        res.end(data);
      }
    });
  } else {
    res.writeHead(300, "no such file", {
      ...headers,
      "content-type": "text/html;",
    });
    res.end("<h1>no such file</h1>");
  }
});

server.listen(3000, () => console.log(`Listening on port ${port}`));

/* https.get("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY", (resp) => {
  let data = "";
  resp.on("data", (chunk) => (data += chunk));

  resp.on("end", () => {
    let url = JSON.parse(data).hdurl;
    console.log(resp.statusCode);
    https.get(url, (res) => {
      if (
        res.statusCode === 200 &&
        res.headers["content-type"] === "image/jpeg"
      ) {
        let img = new Stream.Transform();
        res.on("data", (chunk) => img.push(chunk));
        res.on("end", () => {
          if (!fs.existsSync("./spacepic")) {
            fs.mkdirSync("./spacepic");
          }

          let filename = path.join(__dirname + "/spacepic" + "/spacepic.jpg");
          fs.writeFileSync(filename, img.read());
        });
      }
    });
  });
});
 */
