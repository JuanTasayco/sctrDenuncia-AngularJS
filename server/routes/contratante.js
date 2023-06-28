/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
console.log('test-DatosContratante');

router.get('/contratante/tercero/1/DNI/46093572',function(req, res){
  res.json({
		"Message": "",
		"Data": {
			"Nombre": "GREGORIA",
			"ApellidoPaterno": "OJEDA",
			"ApellidoMaterno": "HUARCA",
			"SegmentoComercial": "",
			"FechaNacimiento": "01/01/0001",
			"Sexo": "0",
			"MapfreDolars": "10.5"
		},
		"OperationCode": 200,
		"TypeMessage": "success"
		});
});

router.get('/contratante/endosatario/20265391886',function(req, res){
  console.log(req.body);
  res.json({
		"Message": "",
		"Data": {
		"Codigo": "RUC - 20265391886",
		"Descripcion": "AMERIKA FINANCIERA S.A."
		},
		"OperationCode": 200,
		"TypeMessage": "success"
	});
});

router.get('/contratante/endosatario',function(req, res){
      console.log(req.body);
      res.json({
            "Message": "",
      	"Data": [
                  {
                        "Codigo": "20100047307",
                        "Descripcion": "ADMINISTRADORA DEL COMERCIO SA",
                        "TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "99825070422",
      			"Descripcion": "ALEX IRVIN",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20265391886",
      			"Descripcion": "AMERIKA FINANCIERA S.A.",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20263951787",
      			"Descripcion": "BAC INTERNATIONAL BANK",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20100133131",
      			"Descripcion": "BANCO BANEX - EN LIQUIDACION",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20509507199",
      			"Descripcion": "BANCO DE COMERCIO",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20100047218",
      			"Descripcion": "BANCO DE CREDITO DEL PERU",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20100030595",
      			"Descripcion": "BANCO DE LA NACION",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20100178584",
      			"Descripcion": "BANCO DE MATERIALES S.A.C. EN LIQUIDACION",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20108166534",
      			"Descripcion": "BANCO DEL NUEVO MUNDO EN LIQUIDACION",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20100122520",
      			"Descripcion": "BANCO DEL PROGRESO",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20330401991",
      			"Descripcion": "BANCO FALABELLA PERU S.A.",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20100105862",
      			"Descripcion": "BANCO FINANCIERO DEL PERU",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20513074370",
      			"Descripcion": "BANCO GNB PERU S.A.",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20101036813",
      			"Descripcion": "BANCO INTERAMERICANO DE FINANZAS",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20100053455",
      			"Descripcion": "BANCO INTERNACIONAL DEL PERU-INTERBANK",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20100041791",
      			"Descripcion": "BANCO LATINO S.A. EN LIQUIDACION",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20100327172",
      			"Descripcion": "BANCO SANTANDER CENTRAL HISPANO",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20516711559",
      			"Descripcion": "BANCO SANTANDER PERU S.A.",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20100119812",
      			"Descripcion": "BANCO STANDARD CHARTERED",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20100127327",
      			"Descripcion": "BANCOSUR",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20331285251",
      			"Descripcion": "BANKBOSTON N.A., SUCURSAL DEL PERU",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20100130204",
      			"Descripcion": "BBVA BANCO CONTINENTAL",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20553849161",
      			"Descripcion": "BBVA CONSUMER FINANCE EDPYME",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20100209641",
      			"Descripcion": "CAJA MUNICIPAL DE AHORRO Y CREDITO AREQUIPA",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20102881347",
      			"Descripcion": "CAJA MUNICIPAL DE AHORRO Y CREDITO DE SULLANA S.A",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20100269466",
      			"Descripcion": "CAJA MUNICIPAL DE CREDITO POPULAR DE LIMA",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20100116635",
      			"Descripcion": "CITIBANK DEL PERU S.A.",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20170879750",
      			"Descripcion": "CITILEASING S.A",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20130200789",
      			"Descripcion": "CMAC - HUANCAYO S.A.",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20113604248",
      			"Descripcion": "CMAC PIURA S.A.C.",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20100116392",
      			"Descripcion": "COFIDE",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20101091083",
      			"Descripcion": "COOP. DE AHORRO Y CREDITO ABACO",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20100904072",
      			"Descripcion": "COOP DE AHORRO Y CREDITO AELU",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20255993225",
      			"Descripcion": "CREDISCOTIA FINANCIERA S.A.",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20308668780",
      			"Descripcion": "CREDITO LEASING S.A.",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20550226589",
      			"Descripcion": "EDPYME SANTANDER CONSUMO PERU S.A.",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20299070728",
      			"Descripcion": "FINANCIERA DAEWOO S.A.",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20100130972",
      			"Descripcion": "FINANCIERA SAN PEDRO",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20337996834",
      			"Descripcion": "FINANCIERA TFC S.A",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20523395701",
      			"Descripcion": "FONBIENES PERU EMPRESA ADMINISTRADORA DE FONDOS COLECTIVOS S.A.",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20544705335",
      			"Descripcion": "FORUM COMERCIALIZADORA DEL PERU S.A.",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20126440350",
      			"Descripcion": "LATINO LEASING S.A. EN LIQUIDACION",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20524981981",
      			"Descripcion": "LEASING PERU S.A.",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20297530756",
      			"Descripcion": "LEASING SANTANDER CENTRAL HISPANO S A",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20377892918",
      			"Descripcion": "LEASING TOTAL S.A.",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20100120586",
      			"Descripcion": "LIMA LEASING S.A.",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20382036655",
      			"Descripcion": "MIBANCO  BANCO DE LA MICROEMPRESA SA",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20375361991",
      			"Descripcion": "MITSUI AUTO FINANCE PERU S.A.",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20102519150",
      			"Descripcion": "NBK BANK EN LIQUIDACION",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20100115663",
      			"Descripcion": "PANDERO S.A. EAFC",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20100341914",
      			"Descripcion": "PROMOTORA OPCION S.A. EAFC",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20100176450",
      			"Descripcion": "REPSOL GAS DEL PERU S.A.",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20100118174",
      			"Descripcion": "SCOTIA PERU HOLDINGS S.A.",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20100043140",
      			"Descripcion": "SCOTIABANK PERU SAA",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20251684619",
      			"Descripcion": "SERBANCO",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20100161771",
      			"Descripcion": "SOLUCION FINANCIERA DE CREDITO DEL PERU S.A.",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20154981021",
      			"Descripcion": "SUMMA ASESORES FINANCIEROS S.A.",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20292160888",
      			"Descripcion": "SUR LEASING S.A",
      			"TipoDocumento": "RUC"
      		},
      		{
      			"Codigo": "20100126274",
      			"Descripcion": "WIESE SUDAMERIS LEASING SA",
      			"TipoDocumento": "RUC"
      		}
	     ]
      });
});



module.exports = router;