const router = require('express').Router();
const authController = require('../../controllers/auth.controller');
const authMiddleware = require('../../middleware/auth');

router.post('/invite', authController.requestInvite);
router.post('/register', authController.registerWithInvite);
router.post('/login', authController.login);
router.get('/profile', authMiddleware, authController.profile);

module.exports = router;
