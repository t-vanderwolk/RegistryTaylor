const router = require('express').Router();

const packageRouter = require('./packages');
const addOnRouter = require('./add-ons');
const blogRouter = require('./blog');
const authRouter = require('./auth');

router.use('/auth', authRouter);
router.use('/packages', packageRouter);
router.use('/add-ons', addOnRouter);
router.use('/blog', blogRouter);

module.exports = router;
