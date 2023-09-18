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

// Connect to db
const knex = require('knex')({
    client: 'pg',
    connection: {
      host : 'ec2-54-243-32-226.compute-1.amazonaws.com',
      port : '5432',
      user : 'ihdrlzvaerzkvm',
      password : '0eda83351b66e0b9f10e8b666700bba069cce4a6aebd34f1638140c6bfcd6d5d',
      database : 'del3ipr7j28aqc',
      ssl: true
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
app.listen(PORT, () => console.log(`Workin' Hard on port ${PORT}!`))