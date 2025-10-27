const express = require('express');
const blogQuestionsController = require('../../controllers/blogQuestionsController');

const router = express.Router();

router.get('/', blogQuestionsController.listPublic);
router.post('/', blogQuestionsController.submitQuestion);

module.exports = router;
