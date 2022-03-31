const { Router } = require('express');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');

module.exports = Router()
  .get('/login', async (req, res, next) => {
    try {
      res.redirect(
        `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=http://localhost:7890/api/v1/github/login/callback`
      );
    } catch (error) {
      next(error);
    }
  })

  .get('/login/callback', async (req, res, next) => {
    // get code
    const { code } = req.query;
    // exchange code for access token
    const token = await exchangeCodeForToken(token);
    // use token to get user data from github
    const { login, avatar_url, email } = await getGithubProfile(token);
    // if user, get it
    // if not, create one
    // use created user to generate jwt to save into cookie
    // set cookie and redirect
  });
