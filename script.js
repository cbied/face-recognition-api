const register = require("./controllers/register");
const signIn = require("./controllers/signIn");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt-nodejs");
const morgan = require("morgan");
const app = express();
const env = process.env;
const PORT = process.env.PORT || 3001;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Connect to db
const knex = require("knex")({
  client: "pg",
  connection: {
    host: env.herokuHost,
    port: "5432",
    user: env.herokuUser,
    password: env.herokuDbPassword,
    database: env.herokuDatabase,
    ssl: true,
    // connection: env.POSTGRES_URI
  },
});

// Keep for testing purposes
// const knex = require("knex")({
//   client: "pg",
//   connection: {
//     host: "localhost",
//     port: "5432",
//     user: "postgres",
//     password: "Piper007!",
//     database: "postgres",
// pgadmin_default_email: "cabiediger@gmail.com",
// pgadmin_default_password: "Piper007!",
//   },
// });

console.log("hello: " + PORT);

app.set("trust proxy", true);
app.use(express.json());
app.use(morgan("combined"));
app.use(cors());

// GET

// get home route
app.get("/", (req, res) => res.send("working hard!"));

// get profile
app.get("/profile/:id", (req, res) => {
  profile.handleProfile(req, res, knex);
});

////////////////////////////////////////////////////////////////////////////

// POST

// post update user profile
app.post("/profile/:id", (req, res) => {
  profile.handleProfileUpdate(req, res, knex);
});

// post sign in user
app.post("/signIn", (req, res) => {
  signIn.handelSignIn(req, res, knex, bcrypt);
});

// post register user
app.post("/register", (req, res) => {
  register.handleRegister(req, res, knex, bcrypt);
});

// post to get image url for Clarifai API
app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res, knex);
});

////////////////////////////////////////////////////////////////////////////

// PUT

// update image entries when user uses image to detect a face
app.put("/image", (req, res) => {
  image.handleImage(req, res, knex);
});

////////////////////////////////////////////////////////////////////////////

// LISTEN
app.listen(PORT, () => console.log(`Working on port ${PORT}!`));
