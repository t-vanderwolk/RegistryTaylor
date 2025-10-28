const express = require('express');
const { requireUser } = require('../../middleware/auth');
const workbookController = require('../../controllers/workbookController');

const router = express.Router();

router.use(requireUser);

router.get('/module/:slug', workbookController.getEntryForModule);
router.get('/:memberId', workbookController.listEntries);
router.post('/', workbookController.createOrUpdateEntry);
router.put('/:id/share', workbookController.toggleShare);

module.exports = router;
