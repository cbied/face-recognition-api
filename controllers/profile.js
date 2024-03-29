const handleProfile = (req, res, knex) => {
  const { id } = req.params;
  const badRequest = 400;

  knex
    .select("*")
    .from("users")
    .where("id", id)
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(badRequest).json("error geting profile");
      }
    });
};

const handleProfileUpdate = (req, res, knex) => {
  const { id } = req.params;
  const { name, email } = req.body;

  knex("users")
    .where({ id })
    .update({ name, email })
    .then((resp) => {
      if (resp) {
        res.json("success");
      } else {
        res.status(400).json("unable to update");
      }
    })
    .catch((err) => res.status(400).json(err + " error updating user"));
};

module.exports = {
  handleProfile: handleProfile,
  handleProfileUpdate: handleProfileUpdate,
};
