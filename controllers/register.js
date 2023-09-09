const handleRegister = (req,res,knex,bcrypt) => {
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password);
    const badRequest = 400;

    // if no email, password, or name provided, send bad request
    if(!email || !password || !name) {
        return res.status(badRequest).json('Incorrect form submission')  
    }
    
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
}

module.exports = {
    handleRegister: handleRegister
};