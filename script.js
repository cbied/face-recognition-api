const register = require('./controllers/register');
const signIn = require('./controllers/signIn');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const express = require('express');
const cors = require('cors');
const environment = require('./environment');
const bcrypt = require('bcrypt-nodejs');
const app = express();
const port = 3001;

// Connect to db
const knex = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : '5432',
      user : 'postgres',
      password : environment.dbpassword,
      database : 'postgres'
    }
});

app.use(express.json())
app.use(cors())

// GET

// get home route
app.get('/', (req, res) => res.send('success!'))

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
app.listen(port, () => console.log(`Workin' Hard!`))