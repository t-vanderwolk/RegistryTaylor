const express = require('express');
const requireAuth = require('../../middleware/requireAuth');
const requireRole = require('../../middleware/requireRole');
const clientController = require('../../controllers/clientController');

const router = express.Router();

router.use(requireAuth, requireRole('client'));

router.get('/dashboard', clientController.getDashboard);
router.get('/messages', clientController.listMessages);
router.post('/messages', clientController.sendMessage);
router.patch('/messages/:id/read', clientController.markMessageRead);

module.exports = router;
