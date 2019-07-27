// ROUTING FOR REGISTERING => /register
const { User, validateUser } = require("../models/user");

const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("register");
});

router.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  // Validate incoming req.body
  const { error } = validateUser(req.body);
  // if error, re-render page w/ errors & end req/res cycle
  if (error) {
    res.render("register", {
      username,
      email,
      errors: error.details
    });
    return;
  }

  try {
    // Find out if user is already registered
    let existingUser = await User.findOne({ email });
    // If so, render error page & end req/res cycle
    if (existingUser) {
      res.status(409).render("error", { errorStatus: 409 });
      return;
    }

    // Create new user doc
    const newUser = await new User({
      username,
      email,
      password
    });

    // Hash password to be saved to DB
    const salt = await bcrypt.genSalt();
    // Replace req.body.password w/ hashed pswd
    newUser.password = await bcrypt.hash(newUser.password, salt);

    // Save new user doc to db
    await newUser.save();

    // Store the newUser doc in the session
    req.session.user = newUser;
    req.session.user.password = undefined;

    // res.render() success page
    res.render("successful-submission", {
      message: "You have successfully registered"
    });
  } catch (err) {
    console.log(err);

    res.render("error", {
      errorStatus: 400
    });
  }
});

module.exports = router;
