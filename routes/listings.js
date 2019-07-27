// ROUTING FOR LISTINGS PAGE => /listings
const { Post, validatePostQuery } = require("../models/post");
const { generateImgHtml } = require("../services/cloudFiles");
const sanitizeQuery = require("../middleware/sanitizeQuery");
const categoryData = require("../helpers/categoryData");

const htmlparser = require("htmlparser2");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    // Queries DB for multiple posts (i.e limit(20), page 1, etc)
    const posts = await Post.find()
      .limit(20)
      .sort({ createdAt: -1 });

    // Generates image src for each post and then appends them to the post obj
    // This allows us to display an image in the template
    posts.forEach(post => {
      const generatedHtml = generateImgHtml(post.publicId);

      // We need to use HTML parser here to extract the 'src' attribute from the img element
      // returned from generateImgHTML
      const Parser = new htmlparser.Parser({
        onopentag: function(name, attribs) {
          post.imgHtmlSrc = attribs.src;
        }
      });

      Parser.write(generatedHtml);
    });

    // Loops through returned query arr and passes relevant data to render()
    res.render("listings", { posts, categoryData });
  } catch (err) {
    next(err);
  }
});

router.get("/search", sanitizeQuery, async (req, res, next) => {
  // Validate req.query
  const { error } = validatePostQuery(req.query);
  if (error) {
    return res.render("listings", {
      search: req.query.search,
      categoryData,
      errors: error.details
    });
  }

  try {
    const searchString = req.query.search;
    // Find the any posts that match the text string received from the search query

    const posts = await Post.find({ $text: { $search: searchString } });

    // Generates image src for each post and then appends them to the post obj
    // This allows us to display an image in the template
    posts.forEach(post => {
      const generatedHtml = generateImgHtml(post.publicId);

      // We need to use HTML parser here to extract the 'src' attribute from the img element
      // returned from generateImgHTML
      const Parser = new htmlparser.Parser({
        onopentag: function(name, attribs) {
          post.imgHtmlSrc = attribs.src;
        }
      });

      Parser.write(generatedHtml);
    });

    res.render("listings", { posts, categoryData });
  } catch (err) {
    next(err);
  }
});

router.get("/filter", sanitizeQuery, async (req, res, next) => {
  const { category, zip, minPrice, maxPrice, city, state } = req.query;
  const query = {};

  // Validate req.query
  // All validation fields for validatePostQuery are optional
  const { error } = validatePostQuery(req.query);
  if (error) {
    return res.render("listings", {
      city,
      state,
      zip,
      minPrice,
      maxPrice,
      categoryData,
      errors: error.details
    });
  }

  // Conditionals to dynamically create a query based off what was submitted in the filter form
  if (category) {
    query.category = category;
  }
  if (zip) {
    query.zip = zip;
  }
  if (city) {
    query.city = city;
  }
  if (state) {
    query.state = state;
  }
  if (minPrice) {
    query.price = {};
    query.price.$gte = minPrice;
  }
  if (maxPrice) {
    if (query.price === undefined) {
      query.price = {};
    }
    query.price.$lte = maxPrice;
  }

  try {
    // Pass in the created query and find posts
    const posts = await Post.find(query);

    // Generates image src for each post and then appends them to the post obj
    // This allows us to display an image in the template
    posts.forEach(post => {
      const generatedHtml = generateImgHtml(post.publicId);

      // We need to use HTML parser here to extract the 'src' attribute from the img element
      // returned from generateImgHTML
      const Parser = new htmlparser.Parser({
        onopentag: function(name, attribs) {
          post.imgHtmlSrc = attribs.src;
        }
      });

      Parser.write(generatedHtml);
    });

    // Render the page with the results of the query
    res.render("listings", { posts, categoryData });
  } catch (err) {
    next(err);
  }
});
module.exports = router;
