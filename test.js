// Import the url module from Node.js
const url = require("url");

// Parse an URL string into its segments
const myURL = url.parse(
  "http://localhost:3000/pathname?search=test#hash?henlo=me",
  true
);

console.log(myURL);
