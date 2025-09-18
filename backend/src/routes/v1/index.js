const router = require('express').Router();

const packageRouter = require('./packages');
const addOnRouter = require('./add-ons');
const blogRouter = require('./blog');
const authRouter = require('./auth');
const mentorRouter = require('./mentors');

router.use('/auth', authRouter);
router.use('/packages', packageRouter);
router.use('/add-ons', addOnRouter);
router.use('/blog', blogRouter);
router.use('/mentors', mentorRouter);

module.exports = router;
