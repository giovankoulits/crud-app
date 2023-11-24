const express = require("express");
const router = express.Router();

router.route("/cars").get((req, res) => {
  console.log("hi from things");
  res.json({ msg: "hi from things" });
});

module.exports = router;
