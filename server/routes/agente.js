/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
console.log('test');

router.get('/agente/buscar',function(req, res){
  console.log(req.body);
  res.json({
    "Message": "",
    "Data": [
      {
        "CodigoAgente": 9808,
        "CodigoNombre": "9808 - DIRECTO . ORGANIZACION TERRITORIAL",
        "MCAMapfreDolar": ""
      }
    ],
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});
module.exports = router;