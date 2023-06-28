/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
console.log('test descuento producto');

router.post('/automovil/descuento',function(req, res){
  console.log(req.body);
    res.json({
      "Message": "",
      "Data": [
        {
          "AgenteComision": 16,
          "DsctoEspecial": -1,
          "ValorDsctoEsp": 1
        },
        {
          "AgenteComision": 14.5,
          "DsctoEspecial": -2,
          "ValorDsctoEsp": 2
        },
        {
          "AgenteComision": 13,
          "DsctoEspecial": -3,
          "ValorDsctoEsp": 3
        },
        {
          "AgenteComision": 11.5,
          "DsctoEspecial": -4,
          "ValorDsctoEsp": 4
        },
        {
          "AgenteComision": 10,
          "DsctoEspecial": -5.5,
          "ValorDsctoEsp": 5.5
        },
        {
          "AgenteComision": 8.5,
          "DsctoEspecial": -6,
          "ValorDsctoEsp": 6
        },
        {
          "AgenteComision": 7,
          "DsctoEspecial": -7.5,
          "ValorDsctoEsp": 7.5
        },
        {
          "AgenteComision": 5.5,
          "DsctoEspecial": -8.5,
          "ValorDsctoEsp": 8.5
        },
        {
          "AgenteComision": 4,
          "DsctoEspecial": -9.5,
          "ValorDsctoEsp": 9.5
        },
        {
          "AgenteComision": 2.5,
          "DsctoEspecial": -10.5,
          "ValorDsctoEsp": 10.5
        },
        {
          "AgenteComision": 1,
          "DsctoEspecial": -11.5,
          "ValorDsctoEsp": 11.5
        },
        {
          "DsctoEspecial": -12.5,
          "ValorDsctoEsp": 12.5
        }
      ],
      "OperationCode": 200,
      "TypeMessage": "success"
  });

 // res.json({
 //    "Message": "",
 //    "Data": [],
 //    "OperationCode": 204
 //  });
});
module.exports = router;