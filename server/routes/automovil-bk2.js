/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
console.log('test');

router.get('/automovil/marcamodelo',function(req, res){
    console.log(req.body);
    res.json({
      "Message": "",
      "Data": [],
      "OperationCode": 200,
      "TypeMessage": "success",
      "Title": "Operación Exitosa",
      "Icon": "glyphicon glyphicon-ok-sign"
    });
});
module.exports = router;