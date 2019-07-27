module.exports = function(err, req, res, next) {
  console.log(err);

  res.render("error", {
    errorStatus: 500
  });
};
