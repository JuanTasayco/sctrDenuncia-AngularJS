/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
console.log('test-submodelo');

// https://mxperu.atlassian.net/browse/OIM-100
router.get('/automovil/submodelo/1/30/284',function(req, res){
  console.log(req.body);
  res.json({
    "Message": "",
    "Data": [
      {
        "Codigo": "21",
        "Descripcion": "AT 1.3",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "55",
        "Descripcion": "GLI 1.3",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "54",
        "Descripcion": "GLI 1.3 A/T",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "22",
        "Descripcion": "GLI 1.5 A/T",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "23",
        "Descripcion": "GLI 1.5 GSL",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "24",
        "Descripcion": "GXI 1.5",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "25",
        "Descripcion": "GXI 1.5 A/T",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "26",
        "Descripcion": "GXI 1.5 M/T",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "30",
        "Descripcion": "HATCHBACK",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "31",
        "Descripcion": "HATCHBACK 1.3",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "27",
        "Descripcion": "H/B 1.3 A/T",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "28",
        "Descripcion": "H/B 1.3 GLS",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "29",
        "Descripcion": "H/B 1.3 M/T",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "32",
        "Descripcion": "LX",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "33",
        "Descripcion": "LX 1.3",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "34",
        "Descripcion": "LXI 1.3",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "35",
        "Descripcion": "LXI 1.3 GSL",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "36",
        "Descripcion": "LXI 1.3 M/T",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "37",
        "Descripcion": "MC 1.3 C/AC",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "38",
        "Descripcion": "SEDAN",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "39",
        "Descripcion": "VVT.I SEDAN 1.5",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "40",
        "Descripcion": "XLI 1.3",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "41",
        "Descripcion": "XLI 1.3 A/T",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "42",
        "Descripcion": "XLI 1.3 AUT",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "43",
        "Descripcion": "XLI 1.3 CC MT GASO",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "44",
        "Descripcion": "XLI 1.3 GSL",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "53",
        "Descripcion": "XLI 1.3 LTD",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "45",
        "Descripcion": "XLI 1.3 M/T",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "46",
        "Descripcion": "XLI 1.3 M/T AC",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "47",
        "Descripcion": "XLI 1.5 CC MT GASO",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "48",
        "Descripcion": "XLI 1.5 GSL",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "49",
        "Descripcion": "XLI 1.5 M/T",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "50",
        "Descripcion": "XLI 1.6 M/T",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "1",
        "Descripcion": "1.3",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "2",
        "Descripcion": "1.3 CC MT",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "4",
        "Descripcion": "1.3 HATCHBACK AUTO",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "5",
        "Descripcion": "1.3 HATCHBACK MEC",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "6",
        "Descripcion": "1.3 HB",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "3",
        "Descripcion": "1.3 H/B GSL",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "7",
        "Descripcion": "1.3 LXI",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "8",
        "Descripcion": "1.3 LXI SEDAN",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "11",
        "Descripcion": "1.3 MEC",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "9",
        "Descripcion": "1.3 M/T",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "10",
        "Descripcion": "1.3 M/T 2003",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "12",
        "Descripcion": "1.3 SEDAN (2006)",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "13",
        "Descripcion": "1.3 STD MT",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "14",
        "Descripcion": "1.3 XLI MT",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "15",
        "Descripcion": "1.5 AT",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "16",
        "Descripcion": "1.5 GXI",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "17",
        "Descripcion": "1.5 M/T",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "18",
        "Descripcion": "1.5 SEDAN",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "19",
        "Descripcion": "1.5 SEDAN (2006)",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      },
      {
        "Codigo": "20",
        "Descripcion": "1.6 XL",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      }
    ],
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});



router.get('/automovil/submodelo/1/31/285',function(req, res){
  console.log(req.body);
  res.json({
    "Message": "",
    "Data": [
      {
        "Codigo": "21",
        "Descripcion": "AT 1.3",
        "Tipo": 1,
        "NombreTipo": "AUTO",
        "CodigoCategoria": 1,
        "FlgPickup": "N"
      }
    ],
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});
module.exports = router;