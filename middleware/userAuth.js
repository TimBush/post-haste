// The purpose of this middleware is two-fold:
// 1. Determines if there is a given post based on the :id provided.
// 2. Checks to see if the post that was found was actually created by the client trying to update it.

const { Post } = require("../models/post");

module.exports = async function(req, res, next) {
  let postId;
  if (req.body.postId) {
    postId = req.body.postId;
  } else {
    postId = req.params.id;
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).render("error", { errorStatus: 404 });
    }

    // Loop through the current users posts
    // IF the current post doesn't match the users posts, return 401
    if (!req.user.posts.includes(post._id)) {
      return res.status(401).render("error", {
        errorStatus: 401,
        message401: "It doesn't look like this post belongs to you."
      });
    }
    // Allows us to past the found post on to the next piece of middleware
    // Saving the need for an extra call in the route
    res.locals.post = post;
    // IF a post is found && it belongs to the user trying to access this route, pass control to next middleware
    next();
  } catch (err) {
    next(err);
  }
};
