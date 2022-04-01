const { Router } = require('express');
const Post = require('../models/Post');

module.exports = Router()
  .get('/', async (req, res, next) => {
    try {
      const posts = await Post.getPosts();
      res.send(posts);
    } catch (error) {
      next(error);
    }
  })

  .post('/', async (req, res, next) => {
    try {
      const post = await Post.createPost({
        text: req.body.text,
      });
      res.send(post);
    } catch (error) {
      next(error);
    }
  });
