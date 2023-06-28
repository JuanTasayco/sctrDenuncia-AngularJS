/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
console.log('test-tipoVehiculo');

// https://mxperu.atlassian.net/browse/OIM-208
router.get('/automovil/tipovehiculo/30/284/1',function(req, res){
  console.log(req.body);
  res.json({
    "Message":"",
    "Data":{
      "CodigoTipo":"1",
      "NombreTipo":"AUTO"
    },
    "OperationCode":200,
    "TypeMessage":"success",
    "Title":"Operación Exitosa",
    "Icon":"glyphicon glyphicon-ok-sign"
  });
});

router.get('/automovil/soat/tipovehiculo/',function(req, res){
  console.log(req.body);
  res.json({
   "Message":"",
   "Data":[
      {
         "Codigo":"1",
         "Descripcion":"AUTO"
      },
      {
         "Codigo":"4",
         "Descripcion":"CAMION"
      },
      {
         "Codigo":"5",
         "Descripcion":"CAMIONETA PANEL/VAN"
      },
      {
         "Codigo":"6",
         "Descripcion":"CAMIONETA PICK-UP DOBLE TRACCI"
      },
      {
         "Codigo":"7",
         "Descripcion":"CAMIONETA PICK-UP TRACCION SIM"
      },
      {
         "Codigo":"8",
         "Descripcion":"CAMIONETA RURAL DOBLE TRACCION"
      },
      {
         "Codigo":"9",
         "Descripcion":"CAMIONETA RURAL TRACCION SIMPL"
      },
      {
         "Codigo":"10",
         "Descripcion":"CAMIONETA ST.WAGON"
      },
      {
         "Codigo":"14",
         "Descripcion":"MOTOCICLETA MAS DE 50 CC"
      },
      {
         "Codigo":"18",
         "Descripcion":"REMOLCADOR"
      },
      {
         "Codigo":"15",
         "Descripcion":"TRIMOVIL DE PASAJEROS"
      }
   ],
   "OperationCode":200,
   "TypeMessage":"success",
   "Title":"Operación Exitosa",
   "Icon":"glyphicon glyphicon-ok-sign"
});
});

module.exports = router;


