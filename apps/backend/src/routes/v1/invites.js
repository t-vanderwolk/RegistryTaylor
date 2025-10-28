const express = require('express');
const { createInvite } = require('../../controllers/inviteController');

const router = express.Router();

router.post('/request', createInvite);

module.exports = router;
