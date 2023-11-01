var http = require('http');
const server = http.createServer((req, res) => {
  res.setHeader('Content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.writeHead(200); //status code
  let dataObj = { id: 123, name: 'Bob', email: 'bob@work.org' };
  let data = JSON.stringify(dataObj);
  res.end(data);
});
server.listen(3333, () => {
  console.log('hi');
});
