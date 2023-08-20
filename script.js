import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
const app = express()
const port = 3001


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
    let newUser;
    bcrypt.hash(password, null, null, (err, hash) => {
        newUser = {
            id: +database.users[database.users.length - 1].id + 1,
            name: name,
            email: email,
            password: hash,
            entries: 0,
            joined: new Date()
        }
        if(req.body.name && req.body.email && req.body.password) {
            database.users.push(newUser)
            res.json(database)
        } else {
            res.status(400).json('Registration Failed')
        }
    });
    
    
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