const https = require("https");
const url = require("url");
const Stream = require("stream").Transform;
const fs = require("fs");
const path = require("path");

/* const server = http.createServer(function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const path = url.parse(req.url);
  const chunks = [];

  req.on("data", (chunk) => chunks.push(chunk));
  req.on("end", () => {
    const buffer = Buffer.concat(chunks);
    const quote = buffer.toString();
    console.log(quote);
  });
  res.end();
});

server.listen(3000, function () {
  console.log("Listening on port 3000");
}); */

https.get("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY", (resp) => {
  let data = "";
  resp.on("data", (chunk) => (data += chunk));

  resp.on("end", () => {
    let url = JSON.parse(data).hdurl;
    //console.log(url);
    https.get(url, (res) => {
      if (
        res.statusCode === 200 &&
        res.headers["content-type"] === "image/png"
      ) {
        let img = new Stream();
        res.on("data", (chunk) => img.push(chunk));
        res.on("end", () => {
          if (!fs.existsSync("./spacepic")) {
            fs.mkdirSync("./spacepic");
          }

          let filename = path.join(__dirname + "/spacepic" + "/spacepic.png");
          fs.writeFileSync(filename, img.read());
        });
      }
    });
  });
});
