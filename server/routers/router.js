const express = require('express');
const router = express();
const controller = require('../controllers/index');
// const middleware = require('../middlewares/indexMiddleware');

router.get('/testing', controller.test);

module.exports = router;