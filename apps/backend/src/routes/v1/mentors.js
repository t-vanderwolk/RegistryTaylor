const express = require('express');
const requireAuth = require('../../middleware/requireAuth');
const requireRole = require('../../middleware/requireRole');
const mentorController = require('../../controllers/mentorController');

const router = express.Router();

router.use(requireAuth, requireRole('mentor'));

router.get('/me', mentorController.getProfile);

module.exports = router;
