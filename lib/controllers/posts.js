const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Post = require('../models/Post');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    Post.getPosts()
      .then((posts) => res.send(posts))
      .catch(next);
  })

  .post('/', authenticate, (req, res, next) => {
    Post.createPost({
      text: req.body.text,
    })
      .then((post) => res.send(post))
      .catch(next);
  });
