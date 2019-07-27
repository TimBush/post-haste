const validator = require("validator");

module.exports = function(req, res, next) {
  const query = req.query;

  for (let prop in query) {
    if (typeof query[prop] === "string") {
      //Sanitize given property
      let escapedProp = validator.escape(query[prop]);
      // Replace existing req.query.prop with the escaped version for access in routes
      query[prop] = escapedProp;
    }
  }
  // Pass control to next middleware
  next();
};
