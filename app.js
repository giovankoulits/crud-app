const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const app = express();

// middleware
app.use(express.static("public"));
// view engine
app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());
// database connection
const dbURI =
  "mongodb+srv://jovankoul:cabul1453@cluster0.okbvxm5.mongodb.net/node-auth";

mongoose
  .connect(dbURI)
  .then((result) => {
    app.listen(3000, () => console.log("listening on port 3000"));
  })
  .catch((err) => console.log(err));
// routes
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", (req, res) => res.render("smoothies"));
app.use(authRoutes);
