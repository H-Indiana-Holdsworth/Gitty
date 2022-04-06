const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Post = require('../models/Post');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try {
      const posts = await Post.getPosts();
      res.send(posts);
    } catch (error) {
      next(error);
    }
  })

  .post('/', authenticate, (req, res, next) => {
    Post.createPost({
      text: req.body.text,
    })
      .then((post) => res.send(post))
      .catch(next);
  });
