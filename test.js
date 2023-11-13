const http = require('http');
const url = require('url');
const data = require('./data');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const port = process.env.DEV_PORT;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });

  const filter = /^\//g;
  const reqUlr = url.parse(req.url).pathname;
  if (req.method === 'GET') {
    res.end(JSON.stringify(data));
  }
  if (req.method === 'POST') {
    let chunks = '';
    req.on('data', (data) => {
      chunks += data;
    });
    req.on('end', () => {
      data.channels.push(JSON.parse(chunks));
      fs.writeFile(
        path.join(__dirname, 'data.js'),
        JSON.stringify(data),
        (err) => {
          if (err) console.log(err);
          else {
            console.log('File written successfully\n');
            console.log('The written has the following contents:');
          }
        }
      );
    });
  }
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
