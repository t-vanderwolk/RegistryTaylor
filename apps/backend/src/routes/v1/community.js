const router = require('express').Router();
const requireAuth = require('../../middleware/requireAuth');
const controller = require('../../controllers/communityController');

router.use(requireAuth);

router.get('/overview', controller.getOverview);

module.exports = router;
