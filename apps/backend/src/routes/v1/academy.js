const router = require('express').Router();
const requireAuth = require('../../middleware/requireAuth');
const controller = require('../../controllers/academyController');

router.use(requireAuth);

router.get('/modules', controller.listModules);
router.get('/modules/:moduleId', controller.getModule);
router.post('/modules/:moduleId/progress', controller.updateProgress);

module.exports = router;
