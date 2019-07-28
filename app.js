const debug = require("debug")("app");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const app = express();

// Handles env variables
require("dotenv").config();

const errorMiddleware = require("./middleware/errorHandler");

const sessionManager = require("./middleware/sessionManager");
// Setup CORS
// Parse incoming req w/ JSON payload
// Setup view engine for EJS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: "session-data",
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000
    },
    store: new MongoStore({
      url: process.env.MONGO_CONNECTION
    }) // TODO - update for production env
  })
);
app.use(sessionManager);
app.set("view engine", "pug");

// Fire up the server
require("./server/server")(app);

// Fire up DB connection
require("./db/connection");

// Routing Handling
require("./startup/routes")(app);

// Route Handling for Static files
app.use(express.static("public"));

// Error Handling Middleware
app.use(errorMiddleware);
