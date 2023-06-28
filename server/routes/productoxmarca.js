/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
console.log('test-productoxmarca');

// router.get('/producto/marca/5',function(req, res){
router.get('/producto/marca/30',function(req, res){
  console.log(req.body);
  res.json({
    "Message":"",
    "Data":[
    {
    "CodigoProducto":1,
    "NombreProducto":"CORPORATIVO I",
    "CodigoCompania":0,
    "CodigoModalidad":30101,
    "CodigoFamProducto":0
    }, 
     {
    "CodigoProducto":2,
    "NombreProducto":"VIP",
    "CodigoCompania":0,
    "CodigoModalidad":30102,
    "CodigoFamProducto":0
    }
    ],
    "OperationCode":200,
    "TypeMessage":"success",
    "Title":"Operación Exitosa",
    "Icon":"glyphicon glyphicon-ok-sign"
  });
});

router.get('/producto/marca/31',function(req, res){
  console.log(req.body);
  res.json({
    "Message":"",
    "Data":[
    {
    "CodigoProducto":2,
    "NombreProducto":"VIP",
    "CodigoCompania":0,
    "CodigoModalidad":30102,
    "CodigoFamProducto":0
    }
    ],
    "OperationCode":200,
    "TypeMessage":"success",
    "Title":"Operación Exitosa",
    "Icon":"glyphicon glyphicon-ok-sign"
  });
});

module.exports = router;