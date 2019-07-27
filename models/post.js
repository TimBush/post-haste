const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const moment = require("moment");

const Schema = mongoose.Schema;

function validatePost(requestBody) {
  const schema = {
    title: Joi.string()
      .min(3)
      .max(50)
      .trim()
      .required(),
    description: Joi.string()
      .min(5)
      .max(3000)
      .trim()
      .required(),
    price: Joi.number()
      .min(0)
      .max(1000000)
      .required(),
    city: Joi.string()
      .min(3)
      .max(20)
      .trim()
      .required(),
    state: Joi.string()
      .min(2)
      .max(20)
      .trim()
      .required(),
    zip: Joi.number()
      .min(1)
      .max(100000)
      .required(),
    category: Joi.string()
      .min(3)
      .max(20)
      .trim()
      .required(),
    postId: Joi.string()
      .min(3)
      .max(25)
      .trim()
      .optional()
  };
  return Joi.validate(requestBody, schema, { abortEarly: false });
}

function validatePostQuery(requestQuery) {
  const schema = {
    search: Joi.string()
      .min(2)
      .max(50)
      .trim()
      .optional(),
    category: Joi.string()
      .min(2)
      .max(50)
      .trim()
      .allow("")
      .optional(),
    city: Joi.string()
      .min(2)
      .max(50)
      .trim()
      .allow("")
      .optional(),
    state: Joi.string()
      .min(2)
      .max(50)
      .trim()
      .allow("")
      .optional(),
    zip: Joi.string()
      .min(2)
      .max(50)
      .trim()
      .allow("")
      .optional(),
    filterForm: Joi.string()
      .min(2)
      .max(50)
      .trim()
      .allow("")
      .optional(),
    searchForm: Joi.string()
      .min(2)
      .max(50)
      .trim()
      .allow("")
      .optional(),
    minPrice: Joi.number()
      .min(1)
      .max(1000000)
      .allow("")
      .optional(),
    maxPrice: Joi.number()
      .min(1)
      .max(1000000)
      .allow("")
      .optional()
  };

  return Joi.validate(requestQuery, schema);
}

// 1. Define Schema
const postSchema = new Schema({
  title: { type: String, required: true, minlength: 3, maxlength: 50 },
  description: { type: String, required: true, minlength: 5, maxlength: 3000 },
  price: { type: Number, required: true, min: 0, max: 1000000 },
  city: { type: String, required: true, minlength: 3, maxlength: 20 },
  state: { type: String, required: true, minlength: 2, maxlength: 20 },
  zip: { type: Number, required: true, min: 1, max: 100000 },
  category: { type: String, required: true, minlength: 3, maxlength: 20 },
  createdAt: {
    type: String,
    default: moment().format("MMMM Do YYYY"),
    required: true
  },
  updatedAt: String,
  videoUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" }
});

postSchema.index({ title: "text", description: "text" });

//2. Model Schema into a Class we can use
const Post = mongoose.model("Post", postSchema);

// 3. Export Schema for use in routes and validation f()
module.exports.Post = Post;
module.exports.validatePost = validatePost;
module.exports.validatePostQuery = validatePostQuery;
