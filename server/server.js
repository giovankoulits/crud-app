//node
const path = require("path");
//npm libs
require("dotenv").config();
const port = process.env.DEV_PORT;

//express libs
const { lookup } = require("mime-types");
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const app = express();
const cookieOptions = require("./config/cookieOptions.js");
const corsOptions = require("./config/corsOptions.js");

app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(cors(corsOptions));
const things = require("./routes/things.js");
const auth = require("./routes/auth.js");

app.use("/things", things);
app.use("/auth", auth);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

app.listen(port, () => console.log(`Listening on port ${port}`));
