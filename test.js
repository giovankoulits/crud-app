const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
var cors = require("cors");
app.use(cookieParser());

app.use(cors());

app.get("/signin", function (req, res) {
  console.log(JSON.stringify(req.headers));

  res.cookie("session_id", Date.now(), { secure: true, httpOnly: true });
  res.status(200).json("hi");

  console.log(req.cookies.session_id);
});
app.listen(3512, () => console.log(`Listening on port ${3512}`));
