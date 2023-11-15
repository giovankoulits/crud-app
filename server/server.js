//node
const http = require("http");
const url = require("url");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
//express
const express = require("express");
var cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
//npm libs
require("dotenv").config();
const { lookup } = require("mime-types");
const port = process.env.DEV_PORT;
const bcrypt = require("bcrypt");
const saltRounds = 13;
//
const { users } = require("./db.json");

app.post("/register", async (req, res) => {
  if (req.body.password && req.body.email) {
    const { email, password } = req.body;

    if (users.some((user) => user.email === email)) {
      res.json("user already exists");
    } else {
      let passHash = await bcrypt.hash(req.body.password, saltRounds);
      users.push({ _id: Date.now(), email, passHash });

      fs.writeFileSync("./db.json", JSON.stringify({ users }));
      res.json("successful write");
      /*    catch (err) {
        console.log(err);
        res.json("oops something went wrong");
      } */
    }
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
