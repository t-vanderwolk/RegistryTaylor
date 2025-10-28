const express = require('express');

const authRoutes = require('./modules/auth');
const inviteRoutes = require('./modules/invite');
const questionnaireRoutes = require('./modules/questionnaire');
const profileRoutes = require('./modules/profile');
const academyRoutes = require('./modules/academy');
const registryRoutes = require('./modules/registry');
const communityRoutes = require('./modules/community');
const adminRoutes = require('./modules/admin');
const workbookRoutes = require('./workbook');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/invite', inviteRoutes);
router.use('/questionnaire', questionnaireRoutes);
router.use('/profile', profileRoutes);
router.use('/academy', academyRoutes);
router.use('/registry', registryRoutes);
router.use('/community', communityRoutes);
router.use('/admin', adminRoutes);
router.use('/workbook', workbookRoutes);

module.exports = router;
