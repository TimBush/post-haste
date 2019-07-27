// ROUTING FOR LOGIN PAGE => /login
const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");

const { User } = require("../models/user");

function validateLogin(requestBody) {
  const schema = {
    email: Joi.string()
      .required()
      .max(50),
    password: Joi.string()
      .required()
      .max(100)
  };
  return Joi.validate(requestBody, schema);
}

// GET - Render login page
router.get("/", (req, res) => {
  // Checks to see if there is a current user session
  // IF there is, redirects to the home page
  if (req.session && req.session.user) {
    return res.redirect("/");
  }
  res.render("login");
});

// POST - Handles user login
router.post("/", async (req, res) => {
  const { email } = req.body;
  const message = [
    { message: "The email or password you entered was incorrect" }
  ];

  // Validate req.body
  const { error } = validateLogin(req.body);
  if (error) {
    res.render("login", { email, errors: error.details });
    return;
  }

  try {
    // Lookup given user based on email
    const user = await User.findOne({ email });
    // IF no user is found, render /login again w/ error msg
    if (!user) {
      res.render("login", {
        errors: message
      });
      return;
    }

    // IF user is found, compare given pswd with hashed pswd
    const match = await bcrypt.compare(req.body.password, user.password);

    if (match) {
      req.session.user = user;
      res.redirect("/dashboard");
    } else {
      // IF password doesn't match, render /login w/ error msg
      res.render("login", {
        errors: message
      });
    }
  } catch (err) {
    console.log(err); //TODO - remove this
    res.status(500).render("error", { errorStatus: 500 });
  }
});

module.exports = router;
