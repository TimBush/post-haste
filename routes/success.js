const express = require("express");
const router = express.Router();

// GET page for successful submission
router.get("/", (req, res) => {
  res.render("success_pages/success-submission", {
    typeOfChange: req.query
  });
});

module.exports = router;
