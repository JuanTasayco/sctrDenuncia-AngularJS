/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
console.log('test-uso');

// router.get('/automovil/tipouso/301/30116/1',function(req, res){
router.get('/automovil/tipouso/301/30101/1',function(req, res){
  console.log(req.body);
  res.json({
    "Message":"",
    "Data":[
      {
      "Codigo":"8",
      "Descripcion":"PRIVADO"
      }, 
      {
      "Codigo":"9",
      "Descripcion":"ESCOLAR"
      }
    ],
    "OperationCode":200,
    "TypeMessage":"success",
    "Title":"Operación Exitosa",
    "Icon":"glyphicon glyphicon-ok-sign"
  });
});
module.exports = router;