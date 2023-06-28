/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
console.log('test-cotizacionautomovil');

router.post('/cotizacion/grabar/vehiculo',function(req, res){
  console.log(req.body);
  res.json({
     "Message": "",
      "Data": {
        "CodigoCorredor": 12,
        "McaDctoComision": "N",
        "Vehiculo": {
          "CodigoTipo": "1",
          "NombreTipo": "AUTO",
          "MCAREQUIEREGPS": "S",
          "TipoVolante": "I",
          "ZonaTarifa": "A",
          "CodigoUso": "8",
          "CodigoCategoria": 2,
          "PolizaGrupo": "",
          "CodigoMarca": "15",
          "CodigoModelo": "23",
          "CodigoSubModelo": "1",
          "NombreMarca": "HYUNDAI",
          "NombreModelo": "ELANTRA",
          "AnioFabricacion": "2016",
          "MCANUEVO": "S",
          "MCAPICKUP": "S",
          "MCAGPS": "S"
        },
        "Contratante": {
          "Nombre": "LUIS",
          "ApellidoPaterno": "CORDOVA TEST 15",
          "MCAMapfreDolar": "N"
        },
        "DocumentosAsociados": [
          {
            "NumeroDocumento": 75843,
            "NumeroAnterior": 0,
            "CodigoEstado": "1",
            "CodigoUsuario": "DBISBAL",
            "FechaRegistro": "09/08/2016 16:37:07",
            "IpDocumento": "::1",
            "CodigoUsuarioRED": "Usuario",
            "CodigoProceso": 1,
            "CodigoProducto": 5,
            "MontoPrima": 0,
            "CodigoAgente": 12,
            "MarcaAsistencia": "N",
            "FlgAplicaDsctoComision": "S",
            "DsctoPorComision": -3,
            "TotalDscto": -3,
            "TuComision": 13,
            "PrimaNeta": 8500,
            "Ubigeo": {
              "CodigoDepartamento": "15",
              "CodigoProvincia": "128",
              "CodigoDistrito": "22"
            }
          }
        ],
        "CodigoCompania": 1,
        "CodigoTipoEntidad": 1
      },
      "OperationCode": 200,
      "TypeMessage": "success"
    });
});
module.exports = router;