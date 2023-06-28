/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
console.log('test producto relacionado');

// router.get('/producto/relacionado/5',function(req, res){
router.get('/producto/relacionado/1',function(req, res){
	// console.log(req.body);
	res.json({
		"Message": "",
		"Data": [
			{
				"CodigoProducto":5,
				"NombreProducto":"AUTOS 0 KM.",
				"CodigoCompania":0,
				"CodigoModalidad":30116,
				"CodigoFamProducto":1
			},
			{
				"CodigoProducto":6,
				"NombreProducto":"AUTOS 1 KM.",
				"CodigoCompania":0,
				"CodigoModalidad":30117,
				"CodigoFamProducto":1
			}
		],
		"OperationCode": 200,
		"TypeMessage": "success",
		"Title": "Operación Exitosa",
		"Icon": "glyphicon glyphicon-ok-sign"
	});
});
module.exports = router;