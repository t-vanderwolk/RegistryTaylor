const express = require('express');
const jwt = require('jsonwebtoken');
const blogController = require('../../controllers/blog.controller');

const router = express.Router();

const attachUserIfPresent = (req, _res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return next();
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    // Invalid tokens are simply ignored for public blog access.
  }

  next();
};

router.get('/', attachUserIfPresent, blogController.listPosts);
router.get('/:slug', attachUserIfPresent, blogController.getPostBySlug);

module.exports = router;
