const router = require('express').Router();
const addOnController = require('../../controllers/add-ons.controller');
const authMiddleware = require('../../middleware/auth');
const roleGuard = require('../../middleware/role-guard');

router.get('/', addOnController.listAddOns);
router.get('/:id', addOnController.getAddOnById);

router.post('/', authMiddleware, roleGuard('admin'), addOnController.createAddOn);
router.put('/:id', authMiddleware, roleGuard('admin'), addOnController.updateAddOn);
router.delete('/:id', authMiddleware, roleGuard('admin'), addOnController.archiveAddOn);

module.exports = router;
