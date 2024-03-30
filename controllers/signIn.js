const jwt = require("jsonwebtoken");
const redis = require("redis");

// Setup Redis

const redisClient = redis.createClient({
  url: "redis://redis:6379",
  socket: {
    connectTimeout: 5000,
  },
});

redisClient.on("error", console.error);

const connnectRedis = async () => {
  await redisClient.connect();
};

connnectRedis();

const handelSignIn = (req, res, knex, bcrypt) => {
  const { email, password } = req.body;

  // if no email or password provided, send bad request
  if (!email || !password) {
    return Promise.reject("Incorrect email or password");
  }

  // get email and password form login db
  return knex
    .select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((userInfo) => {
      // compare user password with bcrypt hash
      const correctLogin = bcrypt.compareSync(password, userInfo[0].hash);

      // if user has correct login, get user info from users db
      if (correctLogin) {
        return knex
          .select("*")
          .from("users")
          .where("email", "=", userInfo[0].email)
          .then((user) => user[0])
          .catch((err) => Promise.reject("upable to get user"));
      } else {
        Promise.reject("error signing in");
      }
    })
    .catch((err) => Promise.reject("wrong credentials"));
};

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  redisClient.get(authorization, (err, res) => {
    if (err || !res) {
      return res.status(400).json("Unauthorized");
    }
    return res.json({ id: res });
  });
};

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, "process.env.JWT_SECRET", {
    expiresIn: "2 days",
  });
};

const setToken = (token, id) => {
  return Promise.resolve(redisClient.set(token, id));
};

const createSessions = (user) => {
  // JWT token, retuen user data
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return { success: "true", userId: id, token };
    })
    .catch(console.log);
};

const handelSignInAuthentication = (knex, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenId(req, res)
    : handelSignIn(req, res, knex, bcrypt)
        .then((data) => {
          return data.id && data.email
            ? createSessions(data)
            : Promise().reject("error signing in auth");
        })
        .then((session) => res.json(session))
        .catch((error) => res.status(400).json(error));
};

module.exports = {
  handelSignInAuthentication: handelSignInAuthentication,
};
