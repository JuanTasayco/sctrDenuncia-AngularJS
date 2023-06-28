/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
console.log('test-Calcular Prima');

router.post('/cotizacion/cotizar/vehiculo',function(req, res){
	console.log(req.body);
	res.json(
		{
			// "Message":"No hay coincidencias",
			"Message":"",
			"Data":{
				"CodigoCorredor": 9808,
				"NumeroSequence": 24038,
				"NumeroCotizacion": "0000000024038",
				"Vehiculo": {
					"PrimaVehicular": 83958,
					"TipoVolante": "I",
					"ZonaTarifa": "A",
					"CodigoUso": "8",
					"PolizaGrupo": "",
					"CodigoMarca": "15",
					"CodigoModelo": "23",
					"CodigoSubModelo": "1",
					"AnioFabricacion": "2016",
					"MCANUEVO": "S",
					"MCAGPS": "N",
					"SumaAsegurada": 19990,
					"ProductoVehiculo": {
						"CodigoModalidad": 30116,
						"CodigoCompania": 1,
						"CodigoRamo": 301
					}
				},
				"Contratante": {
					"MCAMapfreDolar": "N"
				},
				"Ubigeo": {
					"CodigoProvincia": "128",
					"CodigoDistrito": "22"
				}
			},
			"OperationCode":200,
			"TypeMessage":"success",
			"Title":"Operación Exitosa",
			"Icon":"glyphicon glyphicon-ok-sign"
		}
	);
});
module.exports = router;