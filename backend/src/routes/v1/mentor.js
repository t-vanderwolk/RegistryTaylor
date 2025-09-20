const express = require('express');
const requireAuth = require('../../middleware/requireAuth');
const requireRole = require('../../middleware/requireRole');
const mentorController = require('../../controllers/mentorController');

const router = express.Router();

router.use(requireAuth, requireRole('mentor'));

router.get('/dashboard', mentorController.getDashboard);
router.post('/messages', mentorController.sendMessage);
router.patch('/messages/:id/read', mentorController.markMessageRead);

module.exports = router;
