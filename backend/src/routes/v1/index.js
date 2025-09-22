const router = require('express').Router();

const authRouter = require('./auth');
const adminRouter = require('./admin');
const mentorRouter = require('./mentor');
const mentorsLegacyRouter = require('./mentors');
const clientRouter = require('./client');
const profileRouter = require('./profile');
const privateBlogRouter = require('./private-blog');
const inviteRequestRouter = require('./invite-requests');

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/mentor', mentorRouter);
router.use('/mentors', mentorsLegacyRouter);
router.use('/client', clientRouter);
router.use('/profile', profileRouter);
router.use('/private-blog', privateBlogRouter);
router.use('/invite-requests', inviteRequestRouter);

module.exports = router;
