const handleProfile = (req,res,knex) => {
    const { id } = req.params;
    const badRequest = 400;

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
}

module.exports = {
    handleProfile: handleProfile
}