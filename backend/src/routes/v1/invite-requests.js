const express = require('express');
const inviteRequestController = require('../../controllers/inviteRequestController');
const requireAuth = require('../../middleware/requireAuth');
const requireRole = require('../../middleware/requireRole');

const router = express.Router();

router.post('/', inviteRequestController.create);
router.get('/', requireAuth, requireRole('admin'), inviteRequestController.list);
router.patch('/:id', requireAuth, requireRole('admin'), inviteRequestController.updateStatus);

module.exports = router;
