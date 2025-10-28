const express = require('express');
const requireAuth = require('../../middleware/requireAuth');
const controller = require('../../controllers/registryController');

const router = express.Router();

router.get('/', controller.getRegistryItems);

router.use(requireAuth);

router.get('/overview', controller.getOverview);
router.get('/items', controller.listItems);
router.post('/items', controller.createItem);
router.patch('/items/:id', controller.updateItem);
router.delete('/items/:id', controller.removeItem);
router.get('/catalog', controller.getCatalog);

module.exports = router;
