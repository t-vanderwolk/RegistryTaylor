const router = require('express').Router();
const requireAuth = require('../../middleware/requireAuth');
const controller = require('../../controllers/registryController');

router.use(requireAuth);

router.get('/overview', controller.getOverview);
router.get('/items', controller.listItems);
router.post('/items', controller.createItem);
router.patch('/items/:id', controller.updateItem);
router.delete('/items/:id', controller.removeItem);
router.get('/catalog', controller.getCatalog);

module.exports = router;
