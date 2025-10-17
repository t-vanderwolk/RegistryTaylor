const router = require('express').Router();
const packagesController = require('../../controllers/packages.controller');
const authMiddleware = require('../../middleware/auth');
const roleGuard = require('../../middleware/role-guard');

router.get('/', packagesController.listPackages);
router.get('/:id', packagesController.getPackageById);

router.post('/', authMiddleware, roleGuard('admin'), packagesController.createPackage);
router.put('/:id', authMiddleware, roleGuard('admin'), packagesController.updatePackage);
router.delete('/:id', authMiddleware, roleGuard('admin'), packagesController.archivePackage);

module.exports = router;
