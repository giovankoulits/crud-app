const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
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
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));
app.use(authRoutes);
