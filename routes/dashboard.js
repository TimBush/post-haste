// ROUTING FOR DASHBOARD PAGE => /dashboard
const express = require("express");
const router = express.Router();

const { User } = require("../models/user");
const routeAuth = require("../middleware/routeAuth");

router.get("/", routeAuth, async (req, res) => {
  const user = await User.findById(req.session.user._id).populate("posts");
  if (!user) {
    return res.redirect("/");
  }

  res.render("dashboard", { user });
});

module.exports = router;
