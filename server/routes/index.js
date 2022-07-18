const router = require('express').Router();

const auth = require('./auth');
const dash = require('./dash');

router.use('/auth', auth);
router.use('/dash', dash);

module.exports = router;