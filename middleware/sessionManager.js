const { User } = require("../models/user");

module.exports = async function(req, res, next) {
  try {
    // Verify that there is a session & that a session.user exists
    if (req.session && req.session.user) {
      const user = await User.findOne({ email: req.session.user.email });

      if (user) {
        req.user = user;
        req.user.password = undefined; // Removes the users pswd, so it's not stored in the session
        req.session.user = user; // Refresh the session value w/o the password
        res.locals.user = user; // Sets the user as a variable that is accessible in all view templates

        next(); // Finish processing & transfer control to next middleware
      }
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};
