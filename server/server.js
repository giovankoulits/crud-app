//node
const http = require("http");
const url = require("url");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
//npm libs
require("dotenv").config();
const { lookup } = require("mime-types");
const port = process.env.DEV_PORT;
const bcrypt = require("bcrypt");
const saltRounds = 13;
const { compareAsc, format } = require("date-fns");
//express
const express = require("express");
const app = express();
var cors = require("cors");
app.use(express.json());
app.use(cors());
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//
const { users } = require("./db.json");

app.post("/register", async (req, res) => {
  if (req.body.password && req.body.email) {
    const { email, password } = req.body;

    if (users.some((user) => user.email === email)) {
      res.status(409).json({
        error: { code: 409, message: "Conflict! User already exists." },
      });
    } else {
      let passHash = await bcrypt.hash(password, saltRounds);
      const newUser = {
        _id: Date.now(),
        email,
        passHash,
        date: format(new Date(Date.now()), "yyyy-MM-dd'T'HH:mm:ss"),
      };
      users.push(newUser);
      try {
        fs.writeFileSync("./db.json", JSON.stringify({ users }));
        res.status(201).json({ data: newUser });
      } catch (err) {
        res.status(401).json({
          error: { code: 401, message: "invalid username or password." },
        });
      }
    }
  }
});

app.post("/login", async (req, res) => {
  if (req.body.password && req.body.email) {
    const { email, password } = req.body;
    const userMatch = users.find((user) => user.email === email);
    let submittedPass = password; //plain text from browser
    console.log(submittedPass);
    if (userMatch) {
      let savedPass = userMatch.hashedPass; //that has been hashed
      const passwordDidMatch = await bcrypt.compare(submittedPass, savedPass);
      if (passwordDidMatch) {
        res.status(200).json({ data: { token: "this is a pretend token" } });
      } else {
        res.status(401).json({
          error: { code: 401, message: "invalid username or password." },
        });
      }
    } else {
      let fakePass = `$2b$${saltRounds}$invalidusernameeeeeeeeeeeee`;
      await bcrypt.compare(submittedPass, fakePass);
      res.status(401).json({
        error: { code: 401, message: "invalid username or password." },
      });
    }
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
