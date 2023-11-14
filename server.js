const http = require("http");
const url = require("url");
//const Stream = require("stream");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { lookup } = require("mime-types");
const port = process.env.DEV_PORT;
const express = require("express");
const books = require("./books");
//
const app = express();

app.get("/books/:id/henlo/:cat", (req, res) => {
  const bookIndex = parseInt(req.params.id);
  console.log(req.params);

  if (bookIndex <= books.length) {
    res.send(books[bookIndex]);
  } else {
    res.send("henlo");
  }
});

/* app.use("/", (req, res) => {
  num += 1;
  console.log(num);
  res.send("hello world");
}); */

/* const server = http.createServer(function (req, res) {
  //

  const filter = /^\/+/g;
  const myUrl = url.parse(req.url);
  let parsedUrl = myUrl.pathname.replace(filter, "");

  console.log(myUrl.query);

  if (parsedUrl === "") {
    file = "./public/index.html";
  }
  res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
  res.end();
}); */

app.listen(3000, () => console.log(`Listening on port ${port}`));
