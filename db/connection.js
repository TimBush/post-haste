const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true })
  .then(() => {
    console.log("Succesfully Connected to DB");
  })
  .catch(err => {
    console.log(err.message);
  });
mongoose.set("useCreateIndex", true);

module.exports = mongoose;
