const router = require('express').Router();
const mentorsController = require('../../controllers/mentors.controller');
const optionalAuth = require('../../middleware/optional-auth');
const authMiddleware = require('../../middleware/auth');
const roleGuard = require('../../middleware/role-guard');

router.get('/', optionalAuth, mentorsController.listMentors);
router.get('/me', authMiddleware, roleGuard('mentor', 'admin'), mentorsController.getMyMentorProfile);
router.patch('/me', authMiddleware, roleGuard('mentor', 'admin'), mentorsController.updateMyMentorProfile);
router.get('/:id', optionalAuth, mentorsController.getMentorById);

module.exports = router;
