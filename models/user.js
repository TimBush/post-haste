const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const Schema = mongoose.Schema;

// Create validateUser & validate via Joi Schema
function validateUser(requestBody) {
  const schema = {
    username: Joi.string()
      .min(2)
      .max(50)
      .trim()
      .required(),
    email: Joi.string()
      .email()
      .min(5)
      .max(50)
      .trim()
      .required(),
    password: Joi.string()
      .min(5)
      .max(100)
      .trim()
      .required()
  };
  return Joi.validate(requestBody, schema, { abortEarly: false });
}

// 1. Create a new user schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 50
  },
  password: { type: String, required: true, minlength: 5, maxlength: 100 },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }]
});

// 2. Model schema into a model/class we can work with
const User = mongoose.model("User", userSchema);

// 3. Export model for use in routes
module.exports.User = User;
module.exports.validateUser = validateUser;
