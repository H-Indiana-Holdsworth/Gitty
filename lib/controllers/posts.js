const { Router } = require('express');
const Post = require('../models/Post');

module.exports = Router().post('/', async (req, res, next) => {
  const post = await Post.createPost({
    text: req.body.text,
  });
  res.send(post);
});
