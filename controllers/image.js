const handleImage = (req,res,knex) => {
    const { id } = req.body;
    const badRequest = 400;
    
    // if user submits an image, update count in db
    knex('users')
    .where('id', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(() => res.status(badRequest).json('error updating entries'))
}

module.exports = {
    handleImage: handleImage
}