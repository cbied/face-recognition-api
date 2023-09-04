const express = require('express');
const cors = require('cors');
const environment = require('./environment');
const bcrypt = require('bcrypt-nodejs');
const app = express()
const port = 3001

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


const database = {
    users: [
        {
            id: 123,
            name: 'John',
            email: 'john@example.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: 124,
            name: 'Sally',
            email: 'sally@example.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        },
        {
            id: 125,
            name: 'Fred', 
            email: 'fred@example.com',
            password: 'yourmom',
            entries: 0,
            joined: new Date()
        },
        {
            id: 126,
            name: 's',
            email: 's',
            password: 's',
            entries: 0,
            joined: new Date()
        },
    ]
}

app.use(express.json())
app.use(cors())

// GET

app.get('/', (req, res) => res.send(database.users))

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => { 
        if(user.id === +id) {
            found = true
            return res.json(user)
        }
    })

    if (!found) {
        res.status(400).json('Login Failed')
    }
})

// POST

app.post('/signIn', (req, res) => {
    // Load hash from your password DB.
    // bcrypt.compare("bacon", hash, function(err, res) {
    //     // res == true
    // });
    if (req.body.email === database.users[3].email &&
        req.body.password === database.users[3].password) {
            res.json(database.users[3]);
    } else {
        res.status(400).json("error signing in")
    }
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body)
    const newUser = {
        name: name,
        email: email,
        joined: new Date()
    }

    
        knex('users')
        .insert(newUser)
        .then((data) => {
            console.log(data)
        })

        
    res.json(database.users[database.users.length - 1]);





    // ** UPDATE FOR LOGIN DB **
    
    // bcrypt.hash(password, null, null, (err, hash) => {
    //     console.log(req.body)
    //     if(req.body.name && req.body.email) {
    //         console.log(userInfo)
            
    //         // ignore only on email conflict and active is true.
    //         // .onConflict(knex.raw('(email) where active'))
    //         // .ignore()

    //         knex('login')
    //         .insert(newLogin)
    //         .then((data) => {
    //             // console.log(data)
    //         })
            
    //     } else {
    //         res.status(400).json('Registration Failed')
    //     }
    // });
    
    
})



app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    
    database.users.forEach(user => {
        if(user.id === +id) {
            found = true
            user.entries++
            return res.json(user.entries)
        }
    })

    if (!found) {
        res.status(400).json('Login Failed')
    }
})

// LISTEN 

app.listen(port, () => console.log(`HELLLOOO`))