/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
console.log('test-Observaciones');

// router.get('/automovil/gps/30/284/7/2016',function(req, res){
router.get('/automovil/gps/30/284/1/2013',function(req, res){
  console.log(req.body);
  res.json({
    Message: "",
    Data: "S",
    OperationCode: 200,
    TypeMessage: "success",
    Title: "Operación Exitosa"
  });
});
module.exports = router;