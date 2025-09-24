const express = require('express');
const requireAuth = require('../../middleware/requireAuth');
const requireRole = require('../../middleware/requireRole');
const adminController = require('../../controllers/adminController');

const router = express.Router();

router.use(requireAuth, requireRole('admin'));

router.post('/invites', adminController.createInvite);
router.get('/invites', adminController.listInvites);
router.get('/dashboard', adminController.dashboard);
router.get('/clients', adminController.listClients);
router.get('/mentors', adminController.listMentors);

module.exports = router;
