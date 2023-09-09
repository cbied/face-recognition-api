const handelSignIn = (req,res,knex,bcrypt) => {
    const { email, password } = req.body
    const badRequest = 400;

    // if no email or password provided, send bad request
    if(!email || !password) {
        return res.status(badRequest).json('Incorrect email or password')
    }

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
}

module.exports = {
    handelSignIn: handelSignIn
}