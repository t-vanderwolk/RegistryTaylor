const express = require('express');
const requireAuth = require('../../middleware/requireAuth');
const controller = require('../../controllers/privateBlogController');

const router = express.Router();

router.use(requireAuth);

router.get('/', controller.list);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
