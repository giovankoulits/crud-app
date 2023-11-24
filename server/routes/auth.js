const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { users } = require("../db.json");

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

module.exports = router;
