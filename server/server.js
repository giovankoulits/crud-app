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
const { compareAsc, format } = require("date-fns");

const saltRounds = 13;

//
const { users } = require("./db.json");

app.post("/register", async (req, res) => {
  console.log("hi");

  if (req.body.password && req.body.email) {
    const { email, password } = req.body;

    if (users.some((user) => user.email === email)) {
      res.json("user already exists");
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
        res.status(201).send({ data: newUser });
        res.json("You have registered successfully");
      } catch (err) {
        console.log(err);
        res.json("something went wrong");
      }
    }
  }
});

app.post("/login", async (req, res) => {
  if (req.body.password && req.body.email) {
    const { email, password } = req.body;
    const userMatch = users.find((user) => user.email === email);
    if (userMatch) {
      let submittedPass = req.body.password; //plain text from browser
      let savedPass = userMatch.passHash; //that has been hashed
      const passwordDidMatch = await bcrypt.compare(submittedPass, savedPass);
      if (passwordDidMatch) {
        console.log("hi");
        res.status(200).json({ data: { token: "this is a pretend token" } });
      } else {
        res.status(401).json({
          error: { code: 401, message: "invalid username or password." },
        });
      }
    }
  } else {
    let fakePass = `$2b$${saltRounds}$invalidusernameaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`;
    await bcrypt.compare(submittedPass, fakePass);
    res
      .status(401)
      .send({ error: { code: 401, message: "invalid username or password." } });
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
