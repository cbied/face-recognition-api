const register = require('./controllers/register');
const signIn = require('./controllers/signIn');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const express = require('express');
const cors = require('cors');
const environment = require('./environment');
const bcrypt = require('bcrypt-nodejs');
const app = express();
const PORT = process.env.PORT || 3001;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Connect to db
const knex = require('knex')({
    client: 'pg',
    connection: {
      host : environment.herokuHost,
      port : '5432',
      user : environment.herokuUser,
      password : environment.herokuDbPassword,
      database : environment.herokuDatabase,
      ssl: true
    }
});

app.use(express.json())
app.use(cors({
  origin: 'https://cbied.github.io/face-recognition/',
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}))

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