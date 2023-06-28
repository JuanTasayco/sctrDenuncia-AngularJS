'use strict';
var express = require('express');
var router = express.Router();

router.get('/general/gestoroficina/1/9808',function(req, res){
  res.json(
          {
          "Message": "",
          "Data": {
            "codigoGestor": 9999,
            "codigoOficina": 1001,
            "nombreOficina": "PROYECTOS ESPECIALES"
          },
          "OperationCode": 200,
          "TypeMessage": "success"
        }
    );
});
module.exports = router;