var con = require('../public/inc/db');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  con.query('SELECT * FROM tb_users ORDER BY name', (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.send(results);
    }
  });
});

module.exports = router;
