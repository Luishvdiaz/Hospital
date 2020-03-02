const express = require('express');
const router = express.Router();
const {isloggedIn} = require('../lib/auth');

router.get('/', isloggedIn,(req, res) => {
    res.render('index');
});

module.exports = router;