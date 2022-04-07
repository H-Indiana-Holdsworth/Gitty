const { Router } = require('express');
const jwt = require('jsonwebtoken');
const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', (req, res, next) => {
    try {
      res.redirect(
        `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=http://localhost:7890/api/v1/github/login/callback`
      );
    } catch (error) {
      next(error);
    }
  })

  .get('/login/callback', (req, res, next) => {
    // get code
    const { code } = req.query;
    let user;
    // exchange code for access token
    exchangeCodeForToken(code)
      .then((token) => getGithubProfile(token))
      .then(({ username, photoUrl, email }) =>
        GithubUser.findByUsername(username).then((foundUser) => {
          if (foundUser) {
            user = foundUser;
          } else {
            GithubUser.createUser({
              username,
              photoUrl,
              email,
            }).then((createdUser) => (user = createdUser));
          }
        })
      )
      .then(() => {
        const payload = jwt.sign({ ...user }, process.env.JWT_SECRET, {
          expiresIn: '1 day',
        });
        res
          .cookie(process.env.COOKIE_NAME, payload, {
            httpOnly: true,
            maxAge: ONE_DAY_IN_MS,
          })
          .redirect('/api/v1/posts');
      })
      .catch((error) => next(error));
  })

  .delete('/sessions', async (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'Signed out successfully' });
  });
