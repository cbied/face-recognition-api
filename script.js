const express = require('express');
const cors = require('cors');
const environment = require('./environment');
const bcrypt = require('bcrypt-nodejs');
const app = express()
const port = 3001
const badRequest = 400

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

app.get('/', (req, res) => res.send('success!'))

// get profile
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    
    knex
    .select('*')
    .from('users')
    .where('id', id)
    .then(user => {
        if(user.length) {
            res.json(user[0])
        } else {
            res.status(badRequest).json('error geting profile')
        }
    })
})

// POST

app.post('/signIn', (req, res) => {
    const { email, password } = req.body
    // get email and password form login db
    knex
    .select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(userInfo => {
        // compare user password with bcrypt hash
        const correctLogin = bcrypt.compareSync(password, userInfo[0].hash)

        // if user has correct login, get user info from users db
        if(correctLogin) {
           return knex
            .select('*')
            .from('users')
            .where('email', '=', userInfo[0].email)
            .then(user => {
                return res.json(user[0]);
            })
            .catch(err => res.status(badRequest).json('upable to get user'));
        } else {
            res.status(badRequest).json("error signing in") 
        }
    })
    .catch(err => res.status(badRequest).json('wrong credentials'));
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password);
    
    // user transaction to input user data in both users and login dbs when registering 
    knex.transaction(trx => {
        trx
        .insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            const newUser = {
                name: name,
                email: loginEmail[0].email,
                joined: new Date()
            }
            return knex('users')
            .returning('*')
            .insert(newUser)
            .then((user) => {
                res.json(user[0]);
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
    })
})

// PUT

app.put('/image', (req, res) => {
    const { id } = req.body;
    
    // if user submits an image, update count in db
    knex('users')
    .where('id', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(() => res.status(badRequest).json('error updating entries'))
})

// LISTEN 

app.listen(port, () => console.log(`Workin' Hard!`))