const express = require("express");
const router = express.Router();

const path = require("path");

router.get("/", (req, res) => {
  res.render("index");
});

//Export Router
module.exports = router;
