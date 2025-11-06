const router = require('express').Router();

const authRouter = require('./auth');
const adminRouter = require('./admin');
const mentorRouter = require('./mentor');
const mentorsLegacyRouter = require('./mentors');
const clientRouter = require('./client');
const profileRouter = require('./profile');
const forumRouter = require('./forum');
const blogQuestionsRouter = require('./blog-questions');
const blogRouter = require('./blog');
const inviteRequestRouter = require('./invite-requests');

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/mentor', mentorRouter);
router.use('/mentors', mentorsLegacyRouter);
router.use('/client', clientRouter);
router.use('/profile', profileRouter);
router.use('/forum', forumRouter);
router.use('/blog/questions', blogQuestionsRouter);
router.use('/blog', blogRouter);
router.use('/invite-requests', inviteRequestRouter);

module.exports = router;
