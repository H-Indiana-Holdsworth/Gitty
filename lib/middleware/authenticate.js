const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // get the value from our cookie
    const { session } = req.cookies;
    // verify the jwt
    const payload = jwt.verify(session, process.env.JWT_SECRET);
    // set the payload to the user
    req.user = payload;
    next();
  } catch (error) {
    error.message = 'You must be signed in to continue';
    error.status = 401;
    next(error);
  }
};
