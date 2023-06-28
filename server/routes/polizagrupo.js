/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
console.log('test-polizagrupo');

router.get('/automovil/poliza/20510',function(req, res){
  console.log(req.body);
  res.json({
    "Message":"",
    "Data":{
      "PolizaGrupoNombre":"ARTESCO S.A."
    },
    "OperationCode":200,
    "TypeMessage":"success",
    "Title":"Operación Exitosa",
    "Icon":"glyphicon glyphicon-ok-sign"
  });
});
module.exports = router;