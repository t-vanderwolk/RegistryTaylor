const express = require('express');
const requireAuth = require('../../middleware/requireAuth');
const profileController = require('../../controllers/profileController');

const router = express.Router();

router.post('/create', profileController.createProfile);
router.get('/me', requireAuth, profileController.getMyProfile);
router.put('/me', requireAuth, profileController.updateMyProfile);

module.exports = router;
