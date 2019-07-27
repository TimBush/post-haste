// ROUTING FOR CREATING, VIEWING, UPDATING, & DELETING A POST => /post
const { Post, validatePost } = require("../models/post");
const {
  uploadFile,
  deleteFile,
  generateVideoHtml
} = require("../services/cloudFiles");
const { User } = require("../models/user");
const categoryData = require("../helpers/categoryData");
const clearDirectory = require("../services/clearDirectory");
const sanitizeRequest = require("../middleware/sanitizeRequest");
const routeAuth = require("../middleware/routeAuth");
const mimeCheck = require("../middleware/mimeTypeCheck");
const userPostAuth = require("../middleware/userAuth");
const queryStringCreator = require("../helpers/queryString");

const path = require("path");
const express = require("express");
const multer = require("multer");
const moment = require("moment");
const router = express.Router();

// Specifies which folder to save the uploaded file to
let upload = multer({ dest: "uploads/" });
const uploadDirectory = path.join(__dirname, "../uploads");

// GET the create a post form
router.get("/create", routeAuth, (req, res) => {
  res.render("create-post", { categoryData });
});

// GET a single post by its ID
router.get("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).render("error", { errorStatus: 400 });
    }

    const htmlForVideo = generateVideoHtml(post.publicId);

    const {
      title,
      description,
      city,
      state,
      zip,
      category,
      createdAt,
      updatedAt
    } = post;

    res.render("single-post", {
      title,
      description,
      city,
      state,
      zip,
      category,
      createdAt,
      updatedAt,
      htmlForVideo
    });
  } catch (err) {
    next(err);
  }
});

// GET a single post to update
router.get("/update/:id", routeAuth, userPostAuth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    const { title, description, price, city, state, zip, category, _id } = post;

    // Display the particular post that is being updated
    res.render("update-post", {
      title,
      description,
      price,
      city,
      state,
      zip,
      category,
      categoryData,
      postId: _id
    });
  } catch (err) {
    next(err);
  }
});

// GET page that confirms the user wants to delete a given post
router.get("/delete/:id", routeAuth, userPostAuth, async (req, res) => {
  res.render("delete-post", { post: res.locals.post });
});

// POST handles CREATING a new post
router.post(
  "/create",
  upload.single("videoFile"),
  mimeCheck,
  sanitizeRequest,
  routeAuth,
  async (req, res, next) => {
    const { title, description, price, city, state, zip, category } = req.body;

    // TODO - Place a limit on the size of file that can be uploaded

    /* This block validates the given req against Joi schema
     * If validation errors are found and error obj is returned
     * we then re-render the creat-post page with the inputted values
     * We also pass in the array of error.details so the template
     * can render all errors
     */

    // Validation logic for req.body
    const { error } = validatePost(req.body);
    if (error) {
      console.log(error); //TODO - remove

      res.render("create-post", {
        title,
        description,
        price,
        city,
        state,
        zip,
        category,
        categoryData,
        errors: error.details
      });
      return;
    }

    // Validation logic for req.file to confirm there was a file uploaded
    // and that it's in an acceptable format.  Relies on mimeCheck middelware
    if (!req.file || !req.file.validMimeType) {
      res.render("create-post", {
        title,
        description,
        price,
        city,
        state,
        zip,
        category,
        categoryData,
        errors: [{ message: "That is not a valid video file type" }]
      });
      return;
    }

    console.log(req.file.size);

    try {
      const uploadedFile = await uploadFile(req.file.filename);

      const newPost = new Post({
        title,
        description,
        price,
        city,
        state,
        zip,
        category,
        videoUrl: uploadedFile.secure_url,
        publicId: uploadedFile.public_id,
        author: req.session.user._id
      });
      const newSavedPost = await newPost.save();

      const postAuthor = await User.findById(req.session.user._id);
      postAuthor.posts.push(newSavedPost._id);
      await postAuthor.save();

      clearDirectory(uploadDirectory); // Deletes all files from the uploads/ folder

      // We are creating a query string to pass info to /success on redirect
      // for use in rendering
      const queryData = queryStringCreator("created", newSavedPost._id);

      res.redirect(`/success?${queryData}`);
    } catch (err) {
      next(err);
    }
  }
);

// POST handles UPDATING an exisitng post
// TODO update the 'updatedAt' property on the post when an update is made
router.post(
  "/update",
  upload.single("videoFile"),
  mimeCheck,
  sanitizeRequest,
  routeAuth,
  userPostAuth,
  async (req, res, next) => {
    const {
      title,
      description,
      price,
      city,
      state,
      zip,
      category,
      postId
    } = req.body;

    // Validate incoming req.body
    const { error } = validatePost(req.body);
    if (error) {
      res.render("update-post", {
        title,
        description,
        price,
        city,
        state,
        zip,
        category,
        categoryData,
        postId,
        errors: error.details
      });
    }

    // Throws an error if there is a file, but not a valid Mime Type
    if (req.file && !req.file.validMimeType) {
      return res.render("update-post", {
        title,
        description,
        price,
        city,
        state,
        zip,
        category,
        categoryData,
        postId,
        errors: [{ message: "That is not a valid video file type" }]
      });
    }

    try {
      // This IF block handles the use-case of a client uploading a new video
      // This block allows for the deletion & replacement of the old video w/ The new one
      if (req.file && req.file.validMimeType) {
        // IF it has a file, make a call to cloudinary and delete the exisitng video file
        await deleteFile(res.locals.post.publicId);

        // Make a call to uploadFile() to upload the new file that the user wants
        // We only pass in the filename, because uploadFile will append the name to the uploads dir to get the actual file
        const uploadedFile = await uploadFile(req.file.filename);

        const updatedPost = await Post.findByIdAndUpdate(
          postId,
          {
            title,
            description,
            price,
            city,
            state,
            zip,
            category,
            updatedAt: moment().format("MMMM Do YYYY"),
            videoUrl: uploadedFile.secure_url,
            publicId: uploadedFile.public_id
          },
          { new: true, useFindAndModify: false }
        );

        clearDirectory(uploadDirectory); // Deletes all files from the uploads/ folder

        const queryData = queryStringCreator("updated", updatedPost._id);

        return res.redirect(`/success?${queryData}`);
      }

      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          title,
          description,
          price,
          city,
          state,
          zip,
          category,
          updatedAt: moment().format("MMMM Do YYYY")
        },
        { new: true, useFindAndModify: false }
      );

      // We are creating a query string to pass info to /success on redirect
      // for use in rendering
      const queryData = queryStringCreator("updated", updatedPost._id);

      res.redirect(`/success?${queryData}`);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE a given post by its ID
router.delete(
  "/delete/:id",
  routeAuth,
  userPostAuth,
  async (req, res, next) => {
    try {
      // Make a call to cloudinary to delete the video
      await deleteFile(res.locals.post.publicId);
      // Find the given post by ID and delete it
      await Post.findByIdAndDelete(req.params.id);

      // Removes the post ID from the user.posts arr
      const currentUser = await User.findById(req.user._id);
      const indexOfPost = currentUser.posts.indexOf(req.params.id);
      currentUser.posts.splice(indexOfPost, 1);
      await currentUser.save();

      const queryData = queryStringCreator("deleted");
      // Sends response back to client with redirect address
      res.send(`/success?${queryData}`);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
