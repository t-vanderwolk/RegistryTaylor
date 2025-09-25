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
router.get('/clients/:id', adminController.getClientDetail);
router.get('/mentors/:id', adminController.getMentorDetail);
router.get('/calendar', adminController.calendar);
router.get('/messages/threads', adminController.listMessageThreads);
router.get('/messages/threads/:id', adminController.getThreadMessages);
router.post('/messages', adminController.sendMessage);
router.patch('/messages/:id/read', adminController.markMessageRead);

module.exports = router;
