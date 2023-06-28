'use strict';
var express = require('express');
var router = express.Router();

//vehiculos cotizacion
router.post('/email/mail/cotizacion/sendMail',function(req, res){
  console.log(req.body);
  res.json(
  	);
});

module.exports = router;