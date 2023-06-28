/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
console.log('test-productoxusuario');

router.get('/producto/usuario/',function(req, res){
  console.log(req.body);
  res.json({
    "Message":"",
    "Data":[
      {
         "CodigoProducto":5,
         "NombreProducto":"AUTO 0 KM",
         "CodigoModalidad":30116
      },
      {
         "CodigoProducto":20,
         "NombreProducto":"AUTO 0KM X2",
         "CodigoModalidad":0
      },
      {
         "CodigoProducto":37,
         "NombreProducto":"BANCA TODO RIESGO",
         "CodigoModalidad":30119
      },
      {
         "CodigoProducto":44,
         "NombreProducto":"CAMIONES HASTA 3 TON",
         "CodigoModalidad":30154
      },
      {
         "CodigoProducto":25,
         "NombreProducto":"CORP CONCESIONARIO",
         "CodigoModalidad":30149
      },
      {
         "CodigoProducto":7,
         "NombreProducto":"CORPORATIVO A1",
         "CodigoModalidad":30105
      },
      {
         "CodigoProducto":1,
         "NombreProducto":"CORPORATIVO I",
         "CodigoModalidad":30101
      },
      {
         "CodigoProducto":8,
         "NombreProducto":"CORPORATIVO IE",
         "CodigoModalidad":30129
      },
      {
         "CodigoProducto":28,
         "NombreProducto":"CORPORATIVO WEB",
         "CodigoModalidad":30156
      },
      {
         "CodigoProducto":6,
         "NombreProducto":"DORADA",
         "CodigoModalidad":30118
      },
      {
         "CodigoProducto":21,
         "NombreProducto":"DORADA AG",
         "CodigoModalidad":30150
      },
      {
         "CodigoProducto":19,
         "NombreProducto":"DORADA A1",
         "CodigoModalidad":30140
      },
      {
         "CodigoProducto":3,
         "NombreProducto":"DORADA NORTE I",
         "CodigoModalidad":30137
      },
      {
         "CodigoProducto":4,
         "NombreProducto":"DORADA NORTE II",
         "CodigoModalidad":30138
      },
      {
         "CodigoProducto":18,
         "NombreProducto":"DORADA PICK UP",
         "CodigoModalidad":30139
      },
      {
         "CodigoProducto":30,
         "NombreProducto":"DORADA PICK UP SOLES",
         "CodigoModalidad":30196
      },
      {
         "CodigoProducto":29,
         "NombreProducto":"DORADA SOLES",
         "CodigoModalidad":30197
      },
      {
         "CodigoProducto":2,
         "NombreProducto":"DORADA SUR",
         "CodigoModalidad":30136
      },
      {
         "CodigoProducto":38,
         "NombreProducto":"MI TAXI",
         "CodigoModalidad":30123
      },
      {
         "CodigoProducto":31,
         "NombreProducto":"PERDIDA TOTAL SOLES",
         "CodigoModalidad":30195
      },
      {
         "CodigoProducto":32,
         "NombreProducto":"PLATEADA 1000",
         "CodigoModalidad":30193
      },
      {
         "CodigoProducto":33,
         "NombreProducto":"PLATEADA 2000",
         "CodigoModalidad":30194
      },
      {
         "CodigoProducto":16,
         "NombreProducto":"PROGRAMA CAMIONES",
         "CodigoModalidad":30103
      },
      {
         "CodigoProducto":14,
         "NombreProducto":"RESP CIVIL LIVIANO I",
         "CodigoModalidad":30106
      },
      {
         "CodigoProducto":15,
         "NombreProducto":"RESP CIVIL LIVIANO II",
         "CodigoModalidad":30107
      },
      {
         "CodigoProducto":11,
         "NombreProducto":"RESP CIVIL PESADOS I",
         "CodigoModalidad":378
      },
      {
         "CodigoProducto":12,
         "NombreProducto":"RESP CIVIL PESADOS II",
         "CodigoModalidad":379
      },
      {
         "CodigoProducto":13,
         "NombreProducto":"RESP CIVIL PESADOS III",
         "CodigoModalidad":380
      },
      {
         "CodigoProducto":17,
         "NombreProducto":"SERVICIO TURISTICO / T PERSONAL",
         "CodigoModalidad":30112
      },
      {
         "CodigoProducto":9,
         "NombreProducto":"VEHICULOS CHINOS",
         "CodigoModalidad":30128
      }
    ],
    "OperationCode":200,
    "TypeMessage":"success",
    "Title":"Operación Exitosa",
    "Icon":"glyphicon glyphicon-ok-sign"
    });
});
module.exports = router;