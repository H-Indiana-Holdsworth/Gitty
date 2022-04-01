const { Router } = require('express');
const Post = require('../models/Post');

module.exports = Router().post('/', async (req, res, next) => {
  try {
    const post = await Post.createPost({
      text: req.body.text,
    });
    res.send(post);
  } catch (error) {
    next(error);
  }
});
