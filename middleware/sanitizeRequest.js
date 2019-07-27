const validator = require("validator");

module.exports = function(req, res, next) {
  const body = req.body;

  for (let prop in body) {
    if (typeof body[prop] === "string") {
      //Sanitize given property
      let escapedProp = validator.escape(body[prop]);
      // Replace existing req.body.prop with the escaped version for access in routes
      body[prop] = escapedProp;
    }
  }
  // Pass control to next middleware
  next();
};
