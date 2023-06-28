/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
console.log('test-documentos-autos');

var cabecera = [{'name':'company', 'orderBy':true},{'name':'gender', 'orderBy':false},{'name':'name', 'orderBy':true}],
		data1 = {
			'totalregistros': 65,
			'cabecera': cabecera,
			'resultados':[
				{
					"name": "Ethel Price",
					"gender": "female",
					"company": "Enersol"
				},
				{
						"name": "Claudine Neal",
						"gender": "female",
						"company": "Sealoud"
				},
				{
						"name": "Beryl Rice",
						"gender": "female",
						"company": "Velity"
				},
				{
						"name": "Wilder Gonzales",
						"gender": "male",
						"company": "Geekko"
				},
				{
						"name": "Georgina Schultz",
						"gender": "female",
						"company": "Suretech"
				},
				{
						"name": "Carroll Buchanan",
						"gender": "male",
						"company": "Ecosys"
				},
				{
						"name": "Valarie Atkinson",
						"gender": "female",
						"company": "Hopeli"
				},
				{
						"name": "Schroeder Mathews",
						"gender": "male",
						"company": "Polarium"
				},
				{
						"name": "Lynda Mendoza",
						"gender": "female",
						"company": "Dogspa"
				},
				{
						"name": "Sarah Massey",
						"gender": "female",
						"company": "Bisba"
				}
			],
			'orderBy': {'column':1, 'az':true}
		},
		data2 = {
			'totalregistros': 65,
			'cabecera': cabecera,
			'resultados': [
				{
	        "name": "Valenzuela Huff",
	        "gender": "male",
	        "company": "Applideck"
		    },
		    {
		        "name": "Tiffany Anderson",
		        "gender": "female",
		        "company": "Zanymax"
		    },
		    {
		        "name": "Jerri King",
		        "gender": "female",
		        "company": "Eventex"
		    },
		    {
		        "name": "Rocha Meadows",
		        "gender": "male",
		        "company": "Goko"
		    },
		    {
		        "name": "Marcy Green",
		        "gender": "female",
		        "company": "Pharmex"
		    },
		    {
		        "name": "Kirk Cross",
		        "gender": "male",
		        "company": "Portico"
		    },
		    {
		        "name": "Hattie Mullen",
		        "gender": "female",
		        "company": "Zilencio"
		    },
		    {
		        "name": "Deann Bridges",
		        "gender": "female",
		        "company": "Equitox"
		    },
		    {
		        "name": "Chaney Roach",
		        "gender": "male",
		        "company": "Qualitern"
		    },
		    {
		        "name": "Consuelo Dickson",
		        "gender": "female",
		        "company": "Poshome"
		    }
			],
			'orderBy': {'column':1, 'az':true}
		},
		data3 = {
			'totalregistros': 65,
			'cabecera': cabecera,
			'resultados': [
				{
						"name": "Robles Boyle",
						"gender": "male",
						"company": "Comtract"
				},
				{
						"name": "Evans Hickman",
						"gender": "male",
						"company": "Parleynet"
				},
				{
						"name": "Dawson Barber",
						"gender": "male",
						"company": "Dymi"
				},
				{
						"name": "Bruce Strong",
						"gender": "male",
						"company": "Xyqag"
				},
				{
						"name": "Nellie Whitfield",
						"gender": "female",
						"company": "Exospace"
				},
				{
						"name": "Jackson Macias",
						"gender": "male",
						"company": "Aquamate"
				},
				{
						"name": "Pena Pena",
						"gender": "male",
						"company": "Quarx"
				},
				{
						"name": "Lelia Gates",
						"gender": "female",
						"company": "Proxsoft"
				},
				{
						"name": "Letitia Vasquez",
						"gender": "female",
						"company": "Slumberia"
				},
				{
						"name": "Frye Sharpe",
						"gender": "male",
						"company": "Eplode"
				}
			],
			'orderBy': {'column':1, 'az':true}
		},
		data4 = {
			'totalregistros': 65,
			'cabecera': cabecera,
			'resultados': [
				{
						"name": "Trevino Moreno",
						"gender": "male",
						"company": "Conjurica"
				},
				{
						"name": "Barr Page",
						"gender": "male",
						"company": "Apex"
				},
				{
						"name": "Kirkland Merrill",
						"gender": "male",
						"company": "Utara"
				},
				{
						"name": "Blanche Conley",
						"gender": "female",
						"company": "Imkan"
				},
				{
						"name": "Atkins Dunlap",
						"gender": "male",
						"company": "Comveyor"
				},
				{
						"name": "Everett Foreman",
						"gender": "male",
						"company": "Maineland"
				},
				{
						"name": "Gould Randolph",
						"gender": "male",
						"company": "Intergeek"
				},
				{
						"name": "Kelli Leon",
						"gender": "female",
						"company": "Verbus"
				},
				{
						"name": "Freda Mason",
						"gender": "female",
						"company": "Accidency"
				},
				{
						"name": "Tucker Maxwell",
						"gender": "male",
						"company": "Lumbrex"
				}
			],
			'orderBy': {'column':1, 'az':true}
		},
		data5 = {
			'totalregistros': 65,
			'cabecera': cabecera,
			'resultados': [
				{
						"name": "Yvonne Parsons",
						"gender": "female",
						"company": "Zolar"
				},
				{
						"name": "Woods Key",
						"gender": "male",
						"company": "Bedder"
				},
				{
						"name": "Stephens Reilly",
						"gender": "male",
						"company": "Acusage"
				},
				{
						"name": "Mcfarland Sparks",
						"gender": "male",
						"company": "Comvey"
				},
				{
						"name": "Jocelyn Sawyer",
						"gender": "female",
						"company": "Fortean"
				},
				{
						"name": "Renee Barr",
						"gender": "female",
						"company": "Kiggle"
				},
				{
						"name": "Gaines Beck",
						"gender": "male",
						"company": "Sequitur"
				},
				{
						"name": "Luisa Farrell",
						"gender": "female",
						"company": "Cinesanct"
				},
				{
						"name": "Robyn Strickland",
						"gender": "female",
						"company": "Obones"
				},
				{
						"name": "Roseann Jarvis",
						"gender": "female",
						"company": "Aquazure"
				}
			],
			'orderBy': {'column':1, 'az':true}
		},
		data6 = {
			'totalregistros': 65,
			'cabecera': cabecera,
			'resultados': [
				{
						"name": "Johnston Park",
						"gender": "male",
						"company": "Netur"
				},
				{
						"name": "Wong Craft",
						"gender": "male",
						"company": "Opticall"
				},
				{
						"name": "Merritt Cole",
						"gender": "male",
						"company": "Techtrix"
				},
				{
						"name": "Dale Byrd",
						"gender": "female",
						"company": "Kneedles"
				},
				{
						"name": "Sara Delgado",
						"gender": "female",
						"company": "Netagy"
				},
				{
						"name": "Alisha Myers",
						"gender": "female",
						"company": "Intradisk"
				},
				{
						"name": "Felecia Smith",
						"gender": "female",
						"company": "Futurity"
				},
				{
						"name": "Neal Harvey",
						"gender": "male",
						"company": "Pyramax"
				},
				{
						"name": "Nola Miles",
						"gender": "female",
						"company": "Sonique"
				},
				{
						"name": "Herring Pierce",
						"gender": "male",
						"company": "Geeketron"
				}
			],
			'orderBy': {'column':1, 'az':true}
		},
		data7 = {
			'totalregistros': 65,
			'cabecera': cabecera,
			'resultados': [
				{
						"name": "Shelley Rodriquez",
						"gender": "female",
						"company": "Bostonic"
				},
				{
						"name": "Cora Chase",
						"gender": "female",
						"company": "Isonus"
				},
				{
						"name": "Mckay Santos",
						"gender": "male",
						"company": "Amtas"
				},
				{
						"name": "Hilda Crane",
						"gender": "female",
						"company": "Jumpstack"
				},
				{
						"name": "Jeanne Lindsay",
						"gender": "female",
						"company": "Genesynk"
				}
			],
			'orderBy': {'column':1, 'az':true}
		}


router.post('/automovil/grid',function(req, res){
	console.log(req.body);
	if (req.body.NumeroPagina == 1) {
		res.json({
			"Message":"",
			"Data":data1,
			"OperationCode":200,
			"TypeMessage":"success",
			"Title":"Operación Exitosa",
			"Icon":"glyphicon glyphicon-ok-sign"
		});
	}
	if (req.body.NumeroPagina == 2) {
		res.json({
			"Message":"",
			"Data":data2,
			"OperationCode":200,
			"TypeMessage":"success",
			"Title":"Operación Exitosa",
			"Icon":"glyphicon glyphicon-ok-sign"
		});
	}
	if (req.body.NumeroPagina == 3) {
		res.json({
			"Message":"",
			"Data":data3,
			"OperationCode":200,
			"TypeMessage":"success",
			"Title":"Operación Exitosa",
			"Icon":"glyphicon glyphicon-ok-sign"
		});
	}
	if (req.body.NumeroPagina == 4) {
		res.json({
			"Message":"",
			"Data":data4,
			"OperationCode":200,
			"TypeMessage":"success",
			"Title":"Operación Exitosa",
			"Icon":"glyphicon glyphicon-ok-sign"
		});
	}
	if (req.body.NumeroPagina == 5) {
		res.json({
			"Message":"",
			"Data":data5,
			"OperationCode":200,
			"TypeMessage":"success",
			"Title":"Operación Exitosa",
			"Icon":"glyphicon glyphicon-ok-sign"
		});
	}
	if (req.body.NumeroPagina == 6) {
		res.json({
			"Message":"",
			"Data":data6,
			"OperationCode":200,
			"TypeMessage":"success",
			"Title":"Operación Exitosa",
			"Icon":"glyphicon glyphicon-ok-sign"
		});
	}
	if (req.body.NumeroPagina == 7) {
		res.json({
			"Message":"",
			"Data":data7,
			"OperationCode":200,
			"TypeMessage":"success",
			"Title":"Operación Exitosa",
			"Icon":"glyphicon glyphicon-ok-sign"
		});
	}
	// res.json({
	// 	"Message":"",
	// 	"Data":{
	// 		'totalregistros': 65,
	// 		'resultados':[
	// 			{
	// 				"name": "Ethel Price",
	// 				"gender": "female",
	// 				"company": "Enersol"
	// 			},
	// 			{
	// 					"name": "Claudine Neal",
	// 					"gender": "female",
	// 					"company": "Sealoud"
	// 			},
	// 			{
	// 					"name": "Beryl Rice",
	// 					"gender": "female",
	// 					"company": "Velity"
	// 			},
	// 			{
	// 					"name": "Wilder Gonzales",
	// 					"gender": "male",
	// 					"company": "Geekko"
	// 			},
	// 			{
	// 					"name": "Georgina Schultz",
	// 					"gender": "female",
	// 					"company": "Suretech"
	// 			},
	// 			{
	// 					"name": "Carroll Buchanan",
	// 					"gender": "male",
	// 					"company": "Ecosys"
	// 			},
	// 			{
	// 					"name": "Valarie Atkinson",
	// 					"gender": "female",
	// 					"company": "Hopeli"
	// 			},
	// 			{
	// 					"name": "Schroeder Mathews",
	// 					"gender": "male",
	// 					"company": "Polarium"
	// 			},
	// 			{
	// 					"name": "Lynda Mendoza",
	// 					"gender": "female",
	// 					"company": "Dogspa"
	// 			},
	// 			{
	// 					"name": "Sarah Massey",
	// 					"gender": "female",
	// 					"company": "Bisba"
	// 			}
	// 		]
	// 	},
	// 	"OperationCode":200,
	// 	"TypeMessage":"success",
	// 	"Title":"Operación Exitosa",
	// 	"Icon":"glyphicon glyphicon-ok-sign"
	// });
});


module.exports = router;