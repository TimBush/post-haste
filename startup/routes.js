const home = require("../routes/home");
const posts = require("../routes/posts");
const register = require("../routes/register");
const login = require("../routes/login");
const logout = require("../routes/logout");
const dashboard = require("../routes/dashboard");
const success = require("../routes/success");
const listings = require("../routes/listings");

module.exports = function(app) {
  app.use("/", home);
  app.use("/post", posts);
  app.use("/register", register);
  app.use("/login", login);
  app.use("/logout", logout);
  app.use("/dashboard", dashboard);
  app.use("/success", success);
  app.use("/listings", listings);
};
