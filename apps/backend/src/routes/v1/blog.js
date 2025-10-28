const express = require('express');
const { getBlogPosts, getBlogPostBySlug } = require('../../controllers/blogController');

const router = express.Router();

router.get('/', getBlogPosts);
router.get('/:slug', getBlogPostBySlug);

module.exports = router;
