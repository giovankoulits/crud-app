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
const { v4: uuidv4 } = require("uuid");
//express libs
const express = require("express");
const app = express();
const cors = require("cors");
var bodyParser = require("body-parser");
app.use(bodyParser.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const { users } = require("./db.json");
const cookieOptions = require("./cookieOptions.js");

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://127.0.0.1:3000"],
    credentials: true,
    methods: ["GET", "POST"],
  })
);
const things = require("./routes/things.js");
const auth = require("./routes/auth.js");

app.use("/things", things);
app.use("/auth", auth);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

app.post("/register", async (req, res) => {
  if (req.body.password && req.body.email) {
    const { email, password } = req.body;
    console.log(email, password);
    if (users.find((user) => user.email === email)) {
      res.status(409).json({
        error: { code: 409, message: "Conflict! User already exists." },
      });
    } else {
      //cookie
      const cookieKey = "token";
      const cookieValue = uuidv4();
      res.cookie(cookieKey, cookieValue, cookieOptions);

      let hashedPass = await bcrypt.hash(password, saltRounds);

      const newUser = {
        _id: Date.now(),
        email,
        hashedPass,
        date: format(new Date(Date.now()), "yyyy-MM-dd'T'HH:mm:ss"),
        loginToken: cookieValue,
      };

      users.push(newUser);
      try {
        fs.writeFileSync("./db.json", JSON.stringify({ users }));
        res.status(200).render("pages/account", { data: { email, password } });
      } catch (err) {
        res.status(401).json({
          error: { code: 401, message: "invalid username or password." },
        });
      }
    }
  }
});

app.post("/login", async (req, res) => {
  const loggedIn = users.find((user) => user.token === req.cookies.token);
  if (loggedIn) {
    res.json({ msg: "already logged in" });
  } else if (req.body.password && req.body.email) {
    const { email, password } = req.body;
    const userMatch = users.find((user) => user.email === email);
    let submittedPass = password; //plain text from browser
    if (userMatch) {
      let savedPass = userMatch.hashedPass; //that has been hashed
      const passwordDidMatch = await bcrypt.compare(submittedPass, savedPass);
      if (passwordDidMatch) {
        res.status(200).render("account", { data: { email, password } });
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
