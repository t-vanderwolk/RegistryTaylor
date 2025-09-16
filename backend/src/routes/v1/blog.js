const router = require('express').Router();
const blogController = require('../../controllers/blog.controller');
const authMiddleware = require('../../middleware/auth');
const roleGuard = require('../../middleware/role-guard');
const optionalAuth = require('../../middleware/optional-auth');

router.get('/', optionalAuth, blogController.listPosts);
router.get('/:slug', optionalAuth, blogController.getPostBySlug);
router.post('/', authMiddleware, roleGuard('admin'), blogController.createPost);
router.put('/:id', authMiddleware, roleGuard('admin'), blogController.updatePost);
router.delete('/:id', authMiddleware, roleGuard('admin'), blogController.archivePost);

module.exports = router;
