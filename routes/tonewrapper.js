var express = require('express');
var router = express.Router();

const tonejs = require('tone');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send(tonejs.start());
});

module.exports = router;