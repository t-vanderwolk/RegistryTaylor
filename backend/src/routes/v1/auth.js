const express = require('express');
const authController = require('../../controllers/authController');

const router = express.Router();

router.get('/invites/:code', authController.verifyInvite);
router.post('/register-with-invite', authController.registerWithInvite);
router.post('/login', authController.login);

module.exports = router;
