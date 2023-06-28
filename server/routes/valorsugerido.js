/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
console.log('test-valor-sugerido');

router.get('/automovil/valorsugerido/1/30/284/1/2013',function(req, res){
  console.log(req.body);
  res.json({
    "Message":"",
    "Data":{
      "Maximo":14500.0,
      "Minimo":11500.0,
      "Valor":13000.0
      },
    "OperationCode":200,
    "TypeMessage":"success",
    "Title":"Operación Exitosa",
    "Icon":"glyphicon glyphicon-ok-sign"
    });
});

router.get('/automovil/valorsugerido/1/31/285/21/2016',function(req, res){
  console.log(req.body);
  res.json({
    "Message":"",
    "Data":{
      "Maximo":29500.0,
      "Minimo":21500.0,
      "Valor":23000.0
      },
    "OperationCode":200,
    "TypeMessage":"success",
    "Title":"Operación Exitosa",
    "Icon":"glyphicon glyphicon-ok-sign"
    });
});
module.exports = router;