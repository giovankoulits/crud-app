const express = require("express");
const router = express.Router();
const { users } = require("../data/db.json");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 13;
const { compareAsc, format } = require("date-fns");
const { v4: uuidv4 } = require("uuid");
const cookieOptions = require("../config/cookieOptions.js");
const corsOptions = require("../config/corsOptions.js");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
router.use(express.json());
router.use(cookieParser());
router.use(cors(corsOptions));
/* app.set("view engine", "ejs"); */

router.route("/login").post(async (req, res) => {
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

router.route("/register").post(async (req, res) => {
  if (req.body.password && req.body.email) {
    const { email, password } = req.body;
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
        console.log(__dirname);
        fs.writeFileSync(
          path.join(__dirname, "../data", "db.json"),
          JSON.stringify({ users })
        );
        /* res.status(200).render("pages/account", { data: { email, password } }); */
        res.json(users);
      } catch (err) {
        res.status(401).json({
          error: { code: 401, message: "invalid username or password." },
        });
      }
    }
  }
});

module.exports = router;
