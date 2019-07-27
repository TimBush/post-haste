// ROUTING FOR LOGGING USER OUT => /logout
const express = require("express");
const router = express.Router();

const routeAuth = require("../middleware/routeAuth");

router.get("/", routeAuth, (req, res) => {
  req.session.destroy(err => {
    res.render("successful-submission", {
      message: "You have succesfully logged out"
    });
  });
});

module.exports = router;
