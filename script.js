const register = require('./controllers/register');
const signIn = require('./controllers/signIn');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const app = express();
const env = process.env
const PORT = process.env.PORT || 3001;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Connect to db
const knex = require('knex')({
    client: 'pg',
    connection: {
      host : env.herokuHost,
      port : '5432',
      user : env.herokuUser,
      password : env.herokuDbPassword,
      database : env.herokuDatabase,
      ssl: true
    }
});

app.use(express.json())
app.use(cors({
  origin: 'https://cbied.github.io',
  methods: ['GET', 'POST', 'PUT']
}))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://cbied.github.io");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// GET

// get home route
app.get('/', (req, res) => res.send('working hard!'))

// get profile
app.get('/profile/:id', (req, res) => { profile.handleProfile(req,res,knex) })

////////////////////////////////////////////////////////////////////////////

// POST

// post sign in user
app.post('/signIn', (req, res) => { signIn.handelSignIn(req,res,knex,bcrypt) })

// post register user
app.post('/register', (req,res) => { register.handleRegister(req,res,knex,bcrypt) })

// post to get image url for Clarifai API
app.post('/imageurl', (req, res) => { image.handleApiCall(req,res,knex) })

////////////////////////////////////////////////////////////////////////////

// PUT

// update image entries when user uses image to detect a face
app.put('/image', (req, res) => { image.handleImage(req,res,knex) })

////////////////////////////////////////////////////////////////////////////

// LISTEN 
app.listen(PORT, () => console.log(`Working on port ${PORT}!`))