/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
console.log('test');

router.get('/datos/1/DNI/12345678',function(req, res){
  console.log(req.body);
  res.json({
      "Message": "",
      "Data": {
        "MCAExistencia": "S",
        "FechaNacimiento": "10/10/1985",
        "Telefono": "",
        "Direccion": "BUENAVENTURA REY",
        "CorreoElectronico": "MBUSTAMANTE@MAPFRE.COM.PE",
        "Telefono2": "999444555",
        "MCAFisico": "SI",
        "Nombre": "JACKYE",
        "ApellidoPaterno": "DONOHUE",
        "ApellidoMaterno": "SIGARROSTEGUI",
        "SegmentoComercial": "",
        "Sexo": "HOMBRE",
        "MapfreDolares": 0,
        "Ubigeo": {
          "CodigoDepartamento": "14",
          "CodigoProvincia": "125",
          "CodigoDistrito": "9",
          "NombreDepartamento": "LAMBAYEQUE",
          "NombreProvincia": "CHICLAYO",
          "NombreDistrito": "NUEVA ARICA",
          "CodigoVia": "3",
          "NombreVia": "AV.",
          "CodigoNumero": "1",
          "TextoNumero": "119",
          "CodigoInterior": "2",
          "TextoInterior": "10",
          "CodigoZona": "",
          "TextoZona": "",
          "Referencia": ""
        },
        "Profesion": {
          "Codigo": "99",
          "Descripcion": "PROFESIO-OCUP.NO ESPECIFICADA"
        }
      }
    });
});
module.exports = router;