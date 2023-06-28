/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();

router.get('/domicilio/numero',function(req, res){
  console.log(req.body);
  res.json(
      {
        "Message":"",
        "Data":[
        {
        "Codigo":"4",
        "Descripcion":"BLOCK"
        },
        {
        "Codigo":"6",
        "Descripcion":"CASA"
        },
        {
        "Codigo":"7",
        "Descripcion":"CHALET"
        },
        {
        "Codigo":"5",
        "Descripcion":"EDIFICIO"
        },
        {
        "Codigo":"2",
        "Descripcion":"KM"
        },
        {
        "Codigo":"8",
        "Descripcion":"LOTE"
        },
        {
        "Codigo":"3",
        "Descripcion":"MZ"
        },
        {
        "Codigo":"1",
        "Descripcion":"NRO"
        }
        ],
        "OperationCode":200,
        "TypeMessage":"success",
        "Title":"Operación Exitosa",
        "Icon":"glyphicon glyphicon-ok-sign"
        }
    );
});


router.get('/domicilio/interior',function(req, res){
  console.log(req.body);
  res.json(
      {
        "Message":"",
        "Data":[
        {
        "Codigo":"1",
        "Descripcion":"DPTO"
        },
        {
        "Codigo":"2",
        "Descripcion":"INTERIOR"
        },
        {
        "Codigo":"3",
        "Descripcion":"LOTE"
        },
        {
        "Codigo":"4",
        "Descripcion":"OFICINA"
        },
        {
        "Codigo":"6",
        "Descripcion":"PISO"
        },
        {
        "Codigo":"5",
        "Descripcion":"PUESTO"
        }
        ],
        "OperationCode":200,
        "TypeMessage":"success",
        "Title":"Operación Exitosa",
        "Icon":"glyphicon glyphicon-ok-sign"
        }
    );
});

router.get('/domicilio/zona',function(req, res){
  console.log(req.body);
  res.json({
      "Message": "",
      "Data": [
        {
          "Codigo": "5",
          "Descripcion": "AA.HH"
        },
        {
          "Codigo": "9",
          "Descripcion": "ASOC"
        },
        {
          "Codigo": "12",
          "Descripcion": "COMITE"
        },
        {
          "Codigo": "4",
          "Descripcion": "CONJ.HABIT"
        },
        {
          "Codigo": "6",
          "Descripcion": "COOPERATIVA"
        },
        {
          "Codigo": "2",
          "Descripcion": "PBLO.JOVEN"
        },
        {
          "Codigo": "7",
          "Descripcion": "RESIDENCIAL"
        },
        {
          "Codigo": "11",
          "Descripcion": "SECTOR"
        },
        {
          "Codigo": "3",
          "Descripcion": "UN.VECINAL"
        },
        {
          "Codigo": "1",
          "Descripcion": "URB"
        },
        {
          "Codigo": "10",
          "Descripcion": "ZONA"
        },
        {
          "Codigo": "8",
          "Descripcion": "ZON.INDUSTRIAL"
        }
      ],
      "OperationCode": 200,
      "TypeMessage": "success"
    });
});

router.get('/domicilio/tipo',function(req, res){
  console.log(req.body);
  res.json({
				"Message":"",
				"Data":[
				{
				"Codigo":"34",
				"Descripcion":"AA.HH."
				},
				{
				"Codigo":"37",
				"Descripcion":"AGRUPACION"
				},
				{
				"Codigo":"14",
				"Descripcion":"ALAMEDA"
				},
				{
				"Codigo":"38",
				"Descripcion":"AMPLIACION"
				},
				{
				"Codigo":"39",
				"Descripcion":"ANEXO"
				},
				{
				"Codigo":"11",
				"Descripcion":"AUTOPISTA"
				},
				{
				"Codigo":"3",
				"Descripcion":"AV."
				},
				{
				"Codigo":"36",
				"Descripcion":"BARRIO"
				},
				{
				"Codigo":"19",
				"Descripcion":"BLOCK"
				},
				{
				"Codigo":"1",
				"Descripcion":"CALLE"
				},
				{
				"Codigo":"18",
				"Descripcion":"CARRETERA"
				},
				{
				"Codigo":"26",
				"Descripcion":"CASERIO"
				},
				{
				"Codigo":"40",
				"Descripcion":"CENTRO POBLADO"
				},
				{
				"Codigo":"33",
				"Descripcion":"CERRO"
				},
				{
				"Codigo":"32",
				"Descripcion":"COMITE"
				},
				{
				"Codigo":"31",
				"Descripcion":"COMPLEJO"
				},
				{
				"Codigo":"21",
				"Descripcion":"COMUNIDAD"
				},
				{
				"Codigo":"29",
				"Descripcion":"CONDOMINIO"
				},
				{
				"Codigo":"30",
				"Descripcion":"CONJUNTO HABITACIONAL"
				},
				{
				"Codigo":"27",
				"Descripcion":"COOPERATIVA"
				},
				{
				"Codigo":"10",
				"Descripcion":"ESQUINA"
				},
				{
				"Codigo":"12",
				"Descripcion":"JIRON"
				},
				{
				"Codigo":"15",
				"Descripcion":"MALECON"
				},
				{
				"Codigo":"41",
				"Descripcion":"MERCADO"
				},
				{
				"Codigo":"16",
				"Descripcion":"OVALO"
				},
				{
				"Codigo":"17",
				"Descripcion":"PARQUE"
				},
				{
				"Codigo":"13",
				"Descripcion":"PASAJE"
				},
				{
				"Codigo":"2",
				"Descripcion":"PASEO"
				},
				{
				"Codigo":"5",
				"Descripcion":"PLAZA"
				},
				{
				"Codigo":"23",
				"Descripcion":"PROLONG."
				},
				{
				"Codigo":"35",
				"Descripcion":"PUEBLO JOVEN"
				},
				{
				"Codigo":"24",
				"Descripcion":"RESIDENCIAL"
				},
				{
				"Codigo":"9",
				"Descripcion":"SECTOR"
				},
				{
				"Codigo":"20",
				"Descripcion":"UNIDAD VECINAL"
				},
				{
				"Codigo":"28",
				"Descripcion":"VILLA"
				}
				],
				"OperationCode":200,
				"TypeMessage":"success",
				"Title":"Operación Exitosa",
				"Icon":"glyphicon glyphicon-ok-sign"
				});
});
module.exports = router;