/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
console.log('test-Descuento especial');

router.post('/cotizacion/dsctoespecial',function(req, res){
	console.log(req.body);
	res.json({
		"Message": "",
		"Data": [
			{
				"PorDsctoEspecial": -1,
				"ValDsctoEspecial": 1,
				"PorAgenteComision": 16
			},
			{
				"PorDsctoEspecial": -2,
				"ValDsctoEspecial": 2,
				"PorAgenteComision": 14.5
			},
			{
				"PorDsctoEspecial": -3,
				"ValDsctoEspecial": 3,
				"PorAgenteComision": 13
			},
			{
				"PorDsctoEspecial": -4,
				"ValDsctoEspecial": 4,
				"PorAgenteComision": 11.5
			},
			{
				"PorDsctoEspecial": -5.5,
				"ValDsctoEspecial": 5.5,
				"PorAgenteComision": 10
			},
			{
				"PorDsctoEspecial": -6,
				"ValDsctoEspecial": 6,
				"PorAgenteComision": 8.5
			},
			{
				"PorDsctoEspecial": -7.5,
				"ValDsctoEspecial": 7.5,
				"PorAgenteComision": 7
			},
			{
				"PorDsctoEspecial": -8.5,
				"ValDsctoEspecial": 8.5,
				"PorAgenteComision": 5.5
			},
			{
				"PorDsctoEspecial": -9.5,
				"ValDsctoEspecial": 9.5,
				"PorAgenteComision": 4
			},
			{
				"PorDsctoEspecial": -10.5,
				"ValDsctoEspecial": 10.5,
				"PorAgenteComision": 2.5
			},
			{
				"PorDsctoEspecial": -11.5,
				"ValDsctoEspecial": 11.5,
				"PorAgenteComision": 1
			},
			{
				"PorDsctoEspecial": -12.5,
				"ValDsctoEspecial": 12.5
			}
		],
		"OperationCode": 200,
		"TypeMessage": "success"
	});
});
module.exports = router;