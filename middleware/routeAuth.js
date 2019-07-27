// This middleware ONLY checks to see if a user is logged in

module.exports = function(req, res, next) {
  // Check to see if the req.user obj is populated via a session
  // If not, render error page asking them to login
  if (req.user) {
    next();
  } else {
    res.status(401).render("error", { errorStatus: 401 });
  }
};
