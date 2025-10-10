const express = require('express');
const requireAuth = require('../../middleware/requireAuth');
const requireRole = require('../../middleware/requireRole');
const academyController = require('../../controllers/academyController');

const router = express.Router();

router.use(requireAuth);

router.get('/modules', requireRole('client', 'mentor', 'admin'), academyController.listModules);
router.get('/modules/:id', requireRole('client', 'mentor', 'admin'), academyController.getModule);
router.get(
  '/modules/:moduleId/workbook',
  requireRole('client', 'mentor', 'admin'),
  academyController.getWorkbookEntry
);
router.post('/workbook', requireRole('client', 'mentor', 'admin'), academyController.saveWorkbookEntry);
router.get(
  '/workbook/:userId',
  requireRole('client', 'mentor', 'admin'),
  academyController.getWorkbookForUser
);
router.patch(
  '/workbook/:id/mentor-notes',
  requireRole('mentor', 'admin'),
  academyController.updateMentorNotes
);
router.get('/mentees', requireRole('mentor', 'admin'), academyController.listAssignedMentees);

module.exports = router;
