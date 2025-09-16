const router = require('express').Router();
const authController = require('../../controllers/auth.controller');

router.post('/invite', authController.requestInvite);
router.post('/register', authController.registerWithInvite);
router.post('/login', authController.login);

module.exports = router;
