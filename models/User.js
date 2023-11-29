const { compare } = require("bcrypt");
const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const saltRounds = 13;
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, saltRounds);

  next();
});

userSchema.post("save", function (doc, next) {
  console.log("new user was created & saved");
  next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
