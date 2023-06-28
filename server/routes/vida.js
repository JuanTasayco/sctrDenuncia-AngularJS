'use strict';
var express = require('express');
var router = express.Router();

router.get('/Vida/tipobeneficiario/2/601', function(req, res) {
	return res.json({
	  "Message": "",
	  "Data": [
	    {
	      "Codigo": "5",
	      "Descripcion": "BENEFICIARIOS"
	    },
	    {
	      "Codigo": "6",
	      "Descripcion": "BENEFICIARIOS VIDA"
	    }
	  ],
	  "OperationCode": 200,
	  "TypeMessage": "success"
	});
});

router.post("/emision/Vida", function(req, res) {
	console.log(req.body);
	return res.json({
		"Message": "",
		"Data": {
			"CodeResult": 1,
			"MessageResult": "",
			"ValueResult": "20508",
			"ValueResultInt1": 20508
		},
		"OperationCode": 200,
		"TypeMessage": "success"
	});
});

router.post("/cotizacion/vida/pendientepaginado", function(req, res) {
	return res.json({
	  "Message": "",
	  "Data": {
	    "CantidadTotalPaginas": 0,
	    "CantidadTotalFilas": 2,
	    "Lista": [
	      {
	        "NumeroCotizacion": "20394",
	        "FechaCotizacion": "21/02/2017 05:13 p.m.",
	        "ComisionPendiente": 0.0,
	        "FechaVisita": "25/02/2017",
	        "Agente": {
	          "CodigoAgente": 104,
	          "FechaNacimiento": "01/01/0001",
	          "ImporteAplicarMapfreDolar": 0.0,
	          "Nombre": "MN  ASOC ASES CORREDORES SEG",
	          "CodigoEstadoCivil": 0
	        },
	        "Modalidad": {
	          "Nombre": "US$ MUJER INDEPEN. (P.VITAL)"
	        },
	        "Contratante": {
	          "Nombre": "HGUHGHG GUHGUHGUH HGHUGUG",
	          "NumeroDocumento": "65656565",
	          "FechaNacimiento": "01/01/0001",
	          "Ubigeo": {},
	          "Agente": {
	            "FechaNacimiento": "01/01/0001",
	            "ImporteAplicarMapfreDolar": 0.0,
	            "CodigoEstadoCivil": 0
	          },
	          "NumeroCotizacion": "0"
	        },
	        "Asegurado": {
	          "Nombre": "HGUHGHG GUHGUHGUH HGHUGUG",
	          "NumeroDocumento": "65656565",
	          "FechaNacimiento": "01/01/0001",
	          "Ubigeo": {},
	          "Agente": {
	            "FechaNacimiento": "01/01/0001",
	            "ImporteAplicarMapfreDolar": 0.0,
	            "CodigoEstadoCivil": 0
	          },
	          "NumeroCotizacion": "0"
	        },
	        "SumaAsegurada": 10000.0,
	        "PrimaAnual": 73.84,
	        "FechaVencimiento": "21/02/2116",
	        "FechaVisitada": "",
	        "Plazo": "30",
	        "FechaEnvio": "",
	        "ComisionGanada": 0.0
	      },
	      {
	        "NumeroCotizacion": "20393",
	        "FechaCotizacion": "21/02/2017 05:12 p.m.",
	        "ComisionPendiente": 0.0,
	        "FechaVisita": "25/02/2017",
	        "Agente": {
	          "CodigoAgente": 104,
	          "FechaNacimiento": "01/01/0001",
	          "ImporteAplicarMapfreDolar": 0.0,
	          "Nombre": "MN  ASOC ASES CORREDORES SEG",
	          "CodigoEstadoCivil": 0
	        },
	        "Modalidad": {
	          "Nombre": "US$ MUJER INDEPEN. (P.VITAL)"
	        },
	        "Contratante": {
	          "Nombre": "HGUHGHG GUHGUHGUH HGHUGUG",
	          "NumeroDocumento": "65656565",
	          "FechaNacimiento": "01/01/0001",
	          "Ubigeo": {},
	          "Agente": {
	            "FechaNacimiento": "01/01/0001",
	            "ImporteAplicarMapfreDolar": 0.0,
	            "CodigoEstadoCivil": 0
	          },
	          "NumeroCotizacion": "0"
	        },
	        "Asegurado": {
	          "Nombre": "HGUHGHG GUHGUHGUH HGHUGUG",
	          "NumeroDocumento": "65656565",
	          "FechaNacimiento": "01/01/0001",
	          "Ubigeo": {},
	          "Agente": {
	            "FechaNacimiento": "01/01/0001",
	            "ImporteAplicarMapfreDolar": 0.0,
	            "CodigoEstadoCivil": 0
	          },
	          "NumeroCotizacion": "0"
	        },
	        "SumaAsegurada": 10000.0,
	        "PrimaAnual": 73.84,
	        "FechaVencimiento": "21/02/2116",
	        "FechaVisitada": "",
	        "Plazo": "30",
	        "FechaEnvio": "",
	        "ComisionGanada": 0.0
	      }
	    ]
	  },
	  "OperationCode": 200,
	  "TypeMessage": "success"
	});
});
router.get("/producto/vida", function(req, res) {
	return res.json({
	  "Message": "",
	  "Data": [
	    {
	      "CodigoProducto": 60120,
	      "NombreProducto": "5 x 1",
	      "CodigoModalidad": 0,
	      "CodigoFamProducto": 0,
	      "CodigoMoneda": 2,
	      "FlagAnual": 0,
	      "SimboloMoneda": "USD"
	    },
	    {
	      "CodigoProducto": 60218,
	      "NombreProducto": "VIVASEGURO",
	      "CodigoModalidad": 0,
	      "CodigoFamProducto": 0,
	      "CodigoMoneda": 2,
	      "FlagAnual": 0,
	      "SimboloMoneda": "USD"
	    },
	    {
	      "CodigoProducto": 60425,
	      "NombreProducto": "US$ VIVAMAS (PRIMAS VITAL.)",
	      "CodigoModalidad": 0,
	      "CodigoFamProducto": 0,
	      "CodigoMoneda": 2,
	      "FlagAnual": 0,
	      "SimboloMoneda": "USD"
	    },
	    {
	      "CodigoProducto": 60424,
	      "NombreProducto": "US$ VIVAMAS (PRIMAS TEMPOR.)",
	      "CodigoModalidad": 0,
	      "CodigoFamProducto": 0,
	      "CodigoMoneda": 2,
	      "FlagAnual": 0,
	      "SimboloMoneda": "USD"
	    },
	    {
	      "CodigoProducto": 60725,
	      "NombreProducto": "US$ PPJ  PP",
	      "CodigoModalidad": 0,
	      "CodigoFamProducto": 0,
	      "CodigoMoneda": 2,
	      "FlagAnual": 0,
	      "SimboloMoneda": "USD"
	    },
	    {
	      "CodigoProducto": 60213,
	      "NombreProducto": "US$ PLAN DE AHORRO GARAN.",
	      "CodigoModalidad": 0,
	      "CodigoFamProducto": 0,
	      "CodigoMoneda": 2,
	      "FlagAnual": 0,
	      "SimboloMoneda": "USD"
	    },
	    {
	      "CodigoProducto": 60422,
	      "NombreProducto": "US$ MUJER INDEPEN. (P.VITAL)",
	      "CodigoModalidad": 0,
	      "CodigoFamProducto": 0,
	      "CodigoMoneda": 2,
	      "FlagAnual": 0,
	      "SimboloMoneda": "USD"
	    },
	    {
	      "CodigoProducto": 60423,
	      "NombreProducto": "US$ MUJER INDEPEN. (P.TEMP.)",
	      "CodigoModalidad": 0,
	      "CodigoFamProducto": 0,
	      "CodigoMoneda": 2,
	      "FlagAnual": 0,
	      "SimboloMoneda": "USD"
	    },
	    {
	      "CodigoProducto": 60526,
	      "NombreProducto": "US$ FONDO UNIVERSITARIO",
	      "CodigoModalidad": 0,
	      "CodigoFamProducto": 0,
	      "CodigoMoneda": 2,
	      "FlagAnual": 0,
	      "SimboloMoneda": "USD"
	    },
	    {
	      "CodigoProducto": 60333,
	      "NombreProducto": "US$ CONVIDA (PLAZO FIJO)",
	      "CodigoModalidad": 0,
	      "CodigoFamProducto": 0,
	      "CodigoMoneda": 2,
	      "FlagAnual": 0,
	      "SimboloMoneda": "USD"
	    },
	    {
	      "CodigoProducto": 60332,
	      "NombreProducto": "US$ CONVIDA",
	      "CodigoModalidad": 0,
	      "CodigoFamProducto": 0,
	      "CodigoMoneda": 2,
	      "FlagAnual": 0,
	      "SimboloMoneda": "USD"
	    },
	    {
	      "CodigoProducto": 60429,
	      "NombreProducto": "S/. VIVAMAS (PRIMAS VITAL.)",
	      "CodigoModalidad": 0,
	      "CodigoFamProducto": 0,
	      "CodigoMoneda": 1,
	      "FlagAnual": 0,
	      "SimboloMoneda": "S/."
	    },
	    {
	      "CodigoProducto": 60428,
	      "NombreProducto": "S/. VIVAMAS (PRIMAS TEMPOR.)",
	      "CodigoModalidad": 0,
	      "CodigoFamProducto": 0,
	      "CodigoMoneda": 1,
	      "FlagAnual": 0,
	      "SimboloMoneda": "S/."
	    },
	    {
	      "CodigoProducto": 60724,
	      "NombreProducto": "S/. PPJ  PP",
	      "CodigoModalidad": 0,
	      "CodigoFamProducto": 0,
	      "CodigoMoneda": 1,
	      "FlagAnual": 0,
	      "SimboloMoneda": "S/."
	    },
	    {
	      "CodigoProducto": 60426,
	      "NombreProducto": "S/. MUJER INDEPEN. (P.VITAL)",
	      "CodigoModalidad": 0,
	      "CodigoFamProducto": 0,
	      "CodigoMoneda": 1,
	      "FlagAnual": 0,
	      "SimboloMoneda": "S/."
	    },
	    {
	      "CodigoProducto": 60427,
	      "NombreProducto": "S/. MUJER INDEPEN. (P.TEMP.)",
	      "CodigoModalidad": 0,
	      "CodigoFamProducto": 0,
	      "CodigoMoneda": 1,
	      "FlagAnual": 0,
	      "SimboloMoneda": "S/."
	    },
	    {
	      "CodigoProducto": 60525,
	      "NombreProducto": "S/. FONDO UNIVERSITARIO",
	      "CodigoModalidad": 0,
	      "CodigoFamProducto": 0,
	      "CodigoMoneda": 1,
	      "FlagAnual": 0,
	      "SimboloMoneda": "S/."
	    },
	    {
	      "CodigoProducto": 60335,
	      "NombreProducto": "S/. CONVIDA PF 2010",
	      "CodigoModalidad": 0,
	      "CodigoFamProducto": 0,
	      "CodigoMoneda": 1,
	      "FlagAnual": 0,
	      "SimboloMoneda": "S/."
	    },
	    {
	      "CodigoProducto": 60334,
	      "NombreProducto": "S/. CONVIDA",
	      "CodigoModalidad": 0,
	      "CodigoFamProducto": 0,
	      "CodigoMoneda": 1,
	      "FlagAnual": 0,
	      "SimboloMoneda": "S/."
	    },
	    {
	      "CodigoProducto": 60303,
	      "NombreProducto": "CONVIDA ORO (PLAZO FIJO)",
	      "CodigoModalidad": 0,
	      "CodigoFamProducto": 0,
	      "CodigoMoneda": 2,
	      "FlagAnual": 0,
	      "SimboloMoneda": "USD"
	    },
	    {
	      "CodigoProducto": 60306,
	      "NombreProducto": "CONVIDA ORO",
	      "CodigoModalidad": 0,
	      "CodigoFamProducto": 0,
	      "CodigoMoneda": 2,
	      "FlagAnual": 0,
	      "SimboloMoneda": "USD"
	    }
	  ],
	  "OperationCode": 200,
	  "TypeMessage": "success"
	});
});

router.get("/contratante/datos/:empresa/:tipo/:numero", function(req, res) {
	if (req.params.numero == '20547775156') {
		return res.json({
		  "Message": "",
		  "Data": {
		    "MCAExistencia": "S",
		    "SaldoMapfreDolar": 0.0,
		    "FechaNacimiento": "09/02/2017",
		    "ImporteAplicarMapfreDolar": 0.0,
		    "Telefono": "997365945",
		    "Direccion": "CHICMABAMBA MZA C LOTE 16 ASOC DE PROP ",
		    "CorreoElectronico": "RICARDO@MULTIPLICA.COM",
		    "Telefono2": "",
		    "MCAFisico": "N",
		    "Nombre": "NOGA ESTRUCTURAS METALICAS S.A.C.",
		    "ApellidoPaterno": "",
		    "ApellidoMaterno": "",
		    "TipoDocumento": "RUC",
		    "CodigoDocumento": "20547775156",
		    "SegmentoComercial": "",
		    "Sexo": "",
		    "CodigoEstadoCivil": 1,
		    "Ubigeo": {
		      "CodigoDepartamento": "15",
		      "CodigoProvincia": "128",
		      "CodigoDistrito": "35",
		      "NombreDepartamento": "LIMA",
		      "NombreProvincia": "LIMA",
		      "NombreDistrito": "SAN MARTIN DE PORRES",
		      "CodigoVia": "13",
		      "NombreVia": "PASAJE",
		      "CodigoNumero": "",
		      "TextoNumero": "",
		      "CodigoInterior": "",
		      "TextoInterior": "",
		      "CodigoZona": "",
		      "TextoZona": "",
		      "Referencia": "",
		      "Direccion": "CHICMABAMBA MZA C LOTE 16 ASOC DE PROP ",
		      "ZonaDescripcion": "",
		      "InteriorDescripcion": "",
		      "NumeroDescripcion": "",
		      "ViaDescripcion": "PASAJE"
		    },
		    "ActividadEconomica": {
		      "Codigo": "2811",
		      "Descripcion": "FABRICACION DE PRODUCTOS METALICOS PARA USO ESTRUCTURAL",
		      "Indice": 0
		    },
		    "Profesion": {
		      "Codigo": "99",
		      "Descripcion": "PROFESIO-OCUP.NO ESPECIFICADA",
		      "Indice": 0
		    },
		    "TelefonoOficina": ""
		  },
		  "OperationCode": 200,
		  "TypeMessage": "success"
		});
	} else {
		return res.json({
			Message: 'usuario no exite',
			OperationCode: 90
		});
	}
});

router.post("/gestor/vida", function(req,res) {
	console.log(req.body);
	return res.json({
	  "Message": "",
	  "Data": [
	    {
	      "Codigo": "0",
	      "Descripcion": "TODOS"
	    },
	    {
	      "Codigo": "417",
	      "Descripcion": "ACEVEDO MARQUEZ JOSE LUIS"
	    },
	    {
	      "Codigo": "384",
	      "Descripcion": "ACHUY DEL AGUILA DOLLY"
	    },
	    {
	      "Codigo": "386",
	      "Descripcion": "ACUÑA DE LUJAN ROSSANA LUCIA"
	    },
	    {
	      "Codigo": "646",
	      "Descripcion": "AGUILAR ALEGRIA GUILLERMO AARON"
	    },
	    {
	      "Codigo": "131",
	      "Descripcion": "AGUILAR RODAS MIGUEL ANGEL"
	    },
	    {
	      "Codigo": "636",
	      "Descripcion": "AGUIRRE DIEZ RAMIRO FERNANDO"
	    },
	    {
	      "Codigo": "215",
	      "Descripcion": "AGUIRRE PONCE EDY ALEJANDRO"
	    },
	    {
	      "Codigo": "238",
	      "Descripcion": "AGUIRRE SAONA FERNANDO"
	    },
	    {
	      "Codigo": "518",
	      "Descripcion": "ALCANTARA LEIVA IRMA"
	    },
	    {
	      "Codigo": "574",
	      "Descripcion": "ALCAZAR FERNANDINI NOELIA PATRICIA"
	    },
	    {
	      "Codigo": "495",
	      "Descripcion": "ALEGRIA LARA MILUSKA ISABEL"
	    },
	    {
	      "Codigo": "259",
	      "Descripcion": "ALVA LOLI TRILCE"
	    },
	    {
	      "Codigo": "337",
	      "Descripcion": "ALVA MURILLO JENNY LETICIA"
	    },
	    {
	      "Codigo": "593",
	      "Descripcion": "ALVA RAEZ MARIA EUGENIA DEL ROSARIO"
	    },
	    {
	      "Codigo": "451",
	      "Descripcion": "ALVARADO SALAS ELIAS JUERGEN"
	    },
	    {
	      "Codigo": "308",
	      "Descripcion": "AMABLE SANCHEZ ANA SILVIA"
	    },
	    {
	      "Codigo": "461",
	      "Descripcion": "AMANZO RAVICHAGUA JOSE EFRAIN"
	    },
	    {
	      "Codigo": "327",
	      "Descripcion": "AMASIFUEN FASABI EDWIN"
	    },
	    {
	      "Codigo": "96",
	      "Descripcion": "AMAYA GUTIERREZ JOSE FERNANDO"
	    },
	    {
	      "Codigo": "274",
	      "Descripcion": "AMAYO BURGOS JULIO FAVIO"
	    },
	    {
	      "Codigo": "612",
	      "Descripcion": "AMPUDIA CIUDAD RAUL RICARDO"
	    },
	    {
	      "Codigo": "140",
	      "Descripcion": "ANCHIRAICO GALARZA ROCIO GIOVANNA"
	    },
	    {
	      "Codigo": "595",
	      "Descripcion": "ANDRADE CASTILLO TILSA ISABEL"
	    },
	    {
	      "Codigo": "78",
	      "Descripcion": "ANGLES WITHER CARLA PIER"
	    },
	    {
	      "Codigo": "485",
	      "Descripcion": "ARAKAKI YOGUI PAMELA"
	    },
	    {
	      "Codigo": "459",
	      "Descripcion": "ARANDA RAMOS SHIRLEY ANDREA"
	    },
	    {
	      "Codigo": "603",
	      "Descripcion": "ARAUJO INGA OLIVIA BETTINA"
	    },
	    {
	      "Codigo": "201",
	      "Descripcion": "ARAUJO ROBLES CARLOS MIGUEL"
	    },
	    {
	      "Codigo": "163",
	      "Descripcion": "ARENAS DIAZ JUAN BORIS"
	    },
	    {
	      "Codigo": "553",
	      "Descripcion": "ARIAS VELEZ EMILIO JAVIER"
	    },
	    {
	      "Codigo": "400",
	      "Descripcion": "ARROSPIDE CACERES MIGUEL ANGEL"
	    },
	    {
	      "Codigo": "317",
	      "Descripcion": "ASCENZO VEGA CLAUDIA"
	    },
	    {
	      "Codigo": "544",
	      "Descripcion": "ASPILLAGA HUACO JAVIER JESUS"
	    },
	    {
	      "Codigo": "75",
	      "Descripcion": "ASTETE HERMOZA YOVANA"
	    },
	    {
	      "Codigo": "627",
	      "Descripcion": "ASTORGA JIMENEZ LESLIE OLTRI"
	    },
	    {
	      "Codigo": "179",
	      "Descripcion": "AYALA MARREROS ERMITA%O LUIS"
	    },
	    {
	      "Codigo": "175",
	      "Descripcion": "AYESTA VALCARCEL RICARDO MAURICIO"
	    },
	    {
	      "Codigo": "141",
	      "Descripcion": "AZAHUANCHE ZAMBRANO KARL KONRAD ARMANDO"
	    },
	    {
	      "Codigo": "370",
	      "Descripcion": "BACIGALUPO LAGO RAUL SANTIAGO"
	    },
	    {
	      "Codigo": "613",
	      "Descripcion": "BAEZ MEJIA JOSE AMADOR"
	    },
	    {
	      "Codigo": "608",
	      "Descripcion": "BALABARCA MORI JACKELINNE IVETTE"
	    },
	    {
	      "Codigo": "261",
	      "Descripcion": "BALAREZO ALVARADO VICTOR JOSE"
	    },
	    {
	      "Codigo": "486",
	      "Descripcion": "BALAREZO FLORES FERNANDO MARTIN"
	    },
	    {
	      "Codigo": "563",
	      "Descripcion": "BALAREZO MARTINELLI ANDREA"
	    },
	    {
	      "Codigo": "491",
	      "Descripcion": "BALLENA CHOTA ANITA VICTORIA"
	    },
	    {
	      "Codigo": "251",
	      "Descripcion": "BALLETTA SALINAS ANGELO GIUSEPPE"
	    },
	    {
	      "Codigo": "647",
	      "Descripcion": "BALTAZAR GALLOSO IVIANNE"
	    },
	    {
	      "Codigo": "321",
	      "Descripcion": "BANCES RAMIREZ ROMMEL"
	    },
	    {
	      "Codigo": "427",
	      "Descripcion": "BARDALES REATEGUI ROY RODY"
	    },
	    {
	      "Codigo": "575",
	      "Descripcion": "BARRANTES PLAZA MIRKO YSRAEL"
	    },
	    {
	      "Codigo": "375",
	      "Descripcion": "BARRIENTOS BARRETO MARIA ESTHER"
	    },
	    {
	      "Codigo": "85",
	      "Descripcion": "BARRIOS PALOMINO EMILIO ROMAN"
	    },
	    {
	      "Codigo": "503",
	      "Descripcion": "BARTENS ESTRELLA NORMA"
	    },
	    {
	      "Codigo": "311",
	      "Descripcion": "BASAURI SANCHEZ GLORIA ROCIO"
	    },
	    {
	      "Codigo": "571",
	      "Descripcion": "BAYLON MONTOYA ELENID AMELIA"
	    },
	    {
	      "Codigo": "125",
	      "Descripcion": "BAZAN ROBLES ELYS MARILYN"
	    },
	    {
	      "Codigo": "323",
	      "Descripcion": "BEGAZO ARAGON EDUARDO ERNESTO"
	    },
	    {
	      "Codigo": "424",
	      "Descripcion": "BENAVENTE FLORES KATIA BELGOT"
	    },
	    {
	      "Codigo": "598",
	      "Descripcion": "BENAVENTE MERINO CRISTIAN MANUEL"
	    },
	    {
	      "Codigo": "378",
	      "Descripcion": "BENAVIDES ROMERO DANNY CHRISTOPHER"
	    },
	    {
	      "Codigo": "173",
	      "Descripcion": "BENITES MARTINEZ YENNI SOLEDAD"
	    },
	    {
	      "Codigo": "481",
	      "Descripcion": "BERNAOLA FARFAN JACQUELINE MONICA"
	    },
	    {
	      "Codigo": "611",
	      "Descripcion": "BERNAOLA VERASTEGUI NANCY LUZ"
	    },
	    {
	      "Codigo": "6",
	      "Descripcion": "BERNASCONI CAROZZI ALDO JESUS"
	    },
	    {
	      "Codigo": "584",
	      "Descripcion": "BETETA HUERTAS RONALD RAFAEL"
	    },
	    {
	      "Codigo": "1",
	      "Descripcion": "BLACKER RODRIGUEZ CHRISTIAN"
	    },
	    {
	      "Codigo": "126",
	      "Descripcion": "BLAS BRAVO JULIO"
	    },
	    {
	      "Codigo": "344",
	      "Descripcion": "BLAS VALDIVIA WILDER"
	    },
	    {
	      "Codigo": "402",
	      "Descripcion": "BRAVO VIGO NORMA PATRICIA"
	    },
	    {
	      "Codigo": "82",
	      "Descripcion": "BRICEÑO OSTOLAZA GLADYS MADELEINE"
	    },
	    {
	      "Codigo": "313",
	      "Descripcion": "BROGGI ROJAS VANESSA"
	    },
	    {
	      "Codigo": "546",
	      "Descripcion": "BUENO MELENDEZ ROSA MARGOT"
	    },
	    {
	      "Codigo": "588",
	      "Descripcion": "BURGOS BERMEJO MARCELA ANGELICA CAROLINA"
	    },
	    {
	      "Codigo": "264",
	      "Descripcion": "BURGOS TAPIA ENRIQUE"
	    },
	    {
	      "Codigo": "628",
	      "Descripcion": "BURNEO POSAVAC FELIPE MIGUEL"
	    },
	    {
	      "Codigo": "624",
	      "Descripcion": "CABALLERO MEJIA HUMBERTO RAFAEL"
	    },
	    {
	      "Codigo": "435",
	      "Descripcion": "CABANILLAS BENITES LUIS ENRIQUE"
	    },
	    {
	      "Codigo": "578",
	      "Descripcion": "CABEZUDO HIDALGO ALICIA DOLORES"
	    },
	    {
	      "Codigo": "409",
	      "Descripcion": "CABRERA PISCONTE DIANA JUANA"
	    },
	    {
	      "Codigo": "639",
	      "Descripcion": "CACERES RIVERA SANDRA PAOLA"
	    },
	    {
	      "Codigo": "592",
	      "Descripcion": "CAJAL VILLAR JELLY SHEIDELLA"
	    },
	    {
	      "Codigo": "174",
	      "Descripcion": "CALDERON ALVAREZ LUZ ANGELICA"
	    },
	    {
	      "Codigo": "528",
	      "Descripcion": "CALDERON ARTEAGA BLANCA SOFIA JACQUELINE"
	    },
	    {
	      "Codigo": "529",
	      "Descripcion": "CALDERON CARAZA ZOILA MARIA"
	    },
	    {
	      "Codigo": "343",
	      "Descripcion": "CALDERON TEJADA JUAN CARLOS"
	    },
	    {
	      "Codigo": "299",
	      "Descripcion": "CALISTO GIAMPIETRI ARTURO JOSE"
	    },
	    {
	      "Codigo": "413",
	      "Descripcion": "CAMPOS CORNEJO GRECIA RICARDINA"
	    },
	    {
	      "Codigo": "587",
	      "Descripcion": "CAMUS GUIVIN MARTHA MEREDITH"
	    },
	    {
	      "Codigo": "476",
	      "Descripcion": "CANCHAYA VIVAS MONICA MILAGROS"
	    },
	    {
	      "Codigo": "180",
	      "Descripcion": "CANDELA SANCHEZ LUZ ISABEL"
	    },
	    {
	      "Codigo": "232",
	      "Descripcion": "CANEPA KREDERDT LILIAN AMPARO"
	    },
	    {
	      "Codigo": "372",
	      "Descripcion": "CANESSA COSTA MARIELLA ELIZABETH"
	    },
	    {
	      "Codigo": "605",
	      "Descripcion": "CANO LARRIEGA VANESSA"
	    },
	    {
	      "Codigo": "610",
	      "Descripcion": "CANO ZAVALA FANNY MARIBEL"
	    },
	    {
	      "Codigo": "288",
	      "Descripcion": "CAPURRO PARDO JOSE  ELOY"
	    },
	    {
	      "Codigo": "560",
	      "Descripcion": "CARDENAS FERNANDEZ JIMMY ERNESTO ALAIN"
	    },
	    {
	      "Codigo": "369",
	      "Descripcion": "CARLOS SOTO WALTER"
	    },
	    {
	      "Codigo": "516",
	      "Descripcion": "CARMELINO BETETTA NANCY ISABEL"
	    },
	    {
	      "Codigo": "401",
	      "Descripcion": "CARRASCO GIRON YASNA TATIANA"
	    },
	    {
	      "Codigo": "542",
	      "Descripcion": "CARRION CARMEN CARLOS CESAR"
	    },
	    {
	      "Codigo": "331",
	      "Descripcion": "CARRUITERO CARPIO JORGE LUIS"
	    },
	    {
	      "Codigo": "222",
	      "Descripcion": "CASTA%EDA BURGOS MARIELLA DEL CARMEN"
	    },
	    {
	      "Codigo": "472",
	      "Descripcion": "CASTAGNINO CALDERON GIANCARLO"
	    },
	    {
	      "Codigo": "243",
	      "Descripcion": "CASTILLO FLORES LUIS MARTIN"
	    },
	    {
	      "Codigo": "465",
	      "Descripcion": "CASTRO AMES LUIS ALBERTO"
	    },
	    {
	      "Codigo": "353",
	      "Descripcion": "CASTRO CABREJOS FABIOLA LISSET"
	    },
	    {
	      "Codigo": "298",
	      "Descripcion": "CASTRO MESTANZA JOSEFA ROSARIO"
	    },
	    {
	      "Codigo": "333",
	      "Descripcion": "CASTRO NAVARRETE MARIA JESUS"
	    },
	    {
	      "Codigo": "123",
	      "Descripcion": "CAVA DIAZ RICARDO GUSTAVO"
	    },
	    {
	      "Codigo": "556",
	      "Descripcion": "CAVERO ARANA JULIO IVAN"
	    },
	    {
	      "Codigo": "487",
	      "Descripcion": "CCAYO NARVAJA LUIS ALBERTO"
	    },
	    {
	      "Codigo": "289",
	      "Descripcion": "CEDANO ARRUNATEGUI JAVIER ARTURO"
	    },
	    {
	      "Codigo": "240",
	      "Descripcion": "CERNA RISCO NORMA ROXANA"
	    },
	    {
	      "Codigo": "458",
	      "Descripcion": "CERVANTES MENDOZA HUGO MANUEL"
	    },
	    {
	      "Codigo": "365",
	      "Descripcion": "CHANDUVI DE SANCHEZ OLGA ETELVINA"
	    },
	    {
	      "Codigo": "397",
	      "Descripcion": "CHANOVE ARENAS NORBERTO HERNAN"
	    },
	    {
	      "Codigo": "548",
	      "Descripcion": "CHAVARRI RODRIGUEZ CESAR ANTONIO"
	    },
	    {
	      "Codigo": "279",
	      "Descripcion": "CHAVEZ DEL AGUILA JOSE MARIA"
	    },
	    {
	      "Codigo": "568",
	      "Descripcion": "CHAVEZ GUEVARA ROXANA ELIZABETH"
	    },
	    {
	      "Codigo": "390",
	      "Descripcion": "CHAVEZ LOMBARDI JORGE MARTIN"
	    },
	    {
	      "Codigo": "223",
	      "Descripcion": "CHINGA ESPINOZA MARGARITA"
	    },
	    {
	      "Codigo": "326",
	      "Descripcion": "CHIONG AMPUDIA JOSE GABRIEL"
	    },
	    {
	      "Codigo": "349",
	      "Descripcion": "CHIRINOS RUIZ SARA MILAGROS"
	    },
	    {
	      "Codigo": "267",
	      "Descripcion": "CHUMBE RAMIREZ EDWIN"
	    },
	    {
	      "Codigo": "143",
	      "Descripcion": "COLLANTES SOTOMAYOR CARLOS ENIO"
	    },
	    {
	      "Codigo": "247",
	      "Descripcion": "CONCHA PITTA CESAR RICARDO"
	    },
	    {
	      "Codigo": "226",
	      "Descripcion": "CORIAT ALVAN HERMAN FERNANDO"
	    },
	    {
	      "Codigo": "305",
	      "Descripcion": "CORNEJO REJAS PAULO MANUEL"
	    },
	    {
	      "Codigo": "363",
	      "Descripcion": "CORTIJO ROSELL MILAGROS VANESSA"
	    },
	    {
	      "Codigo": "557",
	      "Descripcion": "COSTANTINO VILELA JUAN GERONIMO"
	    },
	    {
	      "Codigo": "466",
	      "Descripcion": "CRUZ LOPEZ ERICKA MARYLIN"
	    },
	    {
	      "Codigo": "340",
	      "Descripcion": "CUEVA DE MARZO CESAR ANTONIO"
	    },
	    {
	      "Codigo": "531",
	      "Descripcion": "CUEVA RAVINES FERNANDO LUIS"
	    },
	    {
	      "Codigo": "266",
	      "Descripcion": "DAVILA ESPINAL MIGUEL ANGEL"
	    },
	    {
	      "Codigo": "324",
	      "Descripcion": "DAVIS ZAPATA TERESA DE JESUS"
	    },
	    {
	      "Codigo": "513",
	      "Descripcion": "DE LA CRUZ SIPAN KATHERYN JIMENA"
	    },
	    {
	      "Codigo": "272",
	      "Descripcion": "DE LA TORRE DE LA TORRE CHRISTIAN VICTOR"
	    },
	    {
	      "Codigo": "650",
	      "Descripcion": "DEL AGUILA BICERRA JOHANA NATALIA"
	    },
	    {
	      "Codigo": "566",
	      "Descripcion": "DEL AGUILA CUÑAÑAY CARLOS"
	    },
	    {
	      "Codigo": "467",
	      "Descripcion": "DEL AGUILA GARCIA KEYTA"
	    },
	    {
	      "Codigo": "285",
	      "Descripcion": "DEL SOLAR VELANDO RAUL ARTURO"
	    },
	    {
	      "Codigo": "88",
	      "Descripcion": "DELGADO ALZAMORA JORGE"
	    },
	    {
	      "Codigo": "338",
	      "Descripcion": "DELGADO HUERTA RICHARD EDUARDO"
	    },
	    {
	      "Codigo": "439",
	      "Descripcion": "DELGADO PADROS JOSE LUIS"
	    },
	    {
	      "Codigo": "569",
	      "Descripcion": "DESPOSORIO VALLE MARIELA"
	    },
	    {
	      "Codigo": "558",
	      "Descripcion": "DESPOSORIO VALLE MARIELA ARMIDA"
	    },
	    {
	      "Codigo": "282",
	      "Descripcion": "DIAZ APAZA MARIA ELENA"
	    },
	    {
	      "Codigo": "539",
	      "Descripcion": "DIAZ CASTRO CARLOS ANDRES"
	    },
	    {
	      "Codigo": "306",
	      "Descripcion": "DIAZ DE HUAMAN BESSIE LOURDES"
	    },
	    {
	      "Codigo": "541",
	      "Descripcion": "DIAZ GAZZOLO FRANCISCO JAVIER"
	    },
	    {
	      "Codigo": "249",
	      "Descripcion": "DIAZ MORI FRANK AGUSTO"
	    },
	    {
	      "Codigo": "416",
	      "Descripcion": "DIAZ SALINAS ROCIO VERONICKA"
	    },
	    {
	      "Codigo": "361",
	      "Descripcion": "DIEZ CANSECO MARTINEZ FABIOLA ROSSINA"
	    },
	    {
	      "Codigo": "76",
	      "Descripcion": "DIEZ CANSECO RIVERO BEATRIZ YSABEL"
	    },
	    {
	      "Codigo": "35",
	      "Descripcion": "DIRECTO OFICINA MIGUEL DASSO"
	    },
	    {
	      "Codigo": "38",
	      "Descripcion": "DIRECTO OFICINA PIURA"
	    },
	    {
	      "Codigo": "619",
	      "Descripcion": "DIRECTO OFICINA PUCALLPA"
	    },
	    {
	      "Codigo": "468",
	      "Descripcion": "DOLORIERT MAYTA GREGORIA ISABEL"
	    },
	    {
	      "Codigo": "124",
	      "Descripcion": "DUANY CASTRO MARIA ROSA"
	    },
	    {
	      "Codigo": "183",
	      "Descripcion": "DULANTO REYES JORGE LUIS"
	    },
	    {
	      "Codigo": "448",
	      "Descripcion": "ELIAS VALDIVIA VICTORIA EULALIA"
	    },
	    {
	      "Codigo": "328",
	      "Descripcion": "ESCATE VEGA JESUS MANUEL"
	    },
	    {
	      "Codigo": "477",
	      "Descripcion": "ESPINOZA PAGAN LUZ MARIA"
	    },
	    {
	      "Codigo": "482",
	      "Descripcion": "ESPINOZA YAYA ANETTE ISELA"
	    },
	    {
	      "Codigo": "166",
	      "Descripcion": "ESTEBAN . CESAR EDUARDO"
	    },
	    {
	      "Codigo": "165",
	      "Descripcion": "ESTRADA PUENTE LUISA FERNANDA"
	    },
	    {
	      "Codigo": "2",
	      "Descripcion": "FACHO ARANGURI VERONICA CECILIA"
	    },
	    {
	      "Codigo": "368",
	      "Descripcion": "FALCON ESPEJO DORA SUSAN"
	    },
	    {
	      "Codigo": "389",
	      "Descripcion": "FARFAN LOPEZ ANAI TOMMY"
	    },
	    {
	      "Codigo": "7137",
	      "Descripcion": "FARROÑAY NIEVES MYRIAM AKEMI"
	    },
	    {
	      "Codigo": "309",
	      "Descripcion": "FERNANDEZ CASTILLO JORGE ENRIQUE"
	    },
	    {
	      "Codigo": "366",
	      "Descripcion": "FERNANDEZ CASTRO RICHARD ALBERTO"
	    },
	    {
	      "Codigo": "354",
	      "Descripcion": "FERNANDEZ CCENTE REYNA MILIANA"
	    },
	    {
	      "Codigo": "257",
	      "Descripcion": "FERNANDEZ DE CORDOVA MACERA MARIA CONSUELO"
	    },
	    {
	      "Codigo": "504",
	      "Descripcion": "FERNANDEZ SANCHEZ WILFREDO"
	    },
	    {
	      "Codigo": "297",
	      "Descripcion": "FERNANDEZ VASQUEZ GABRIEL ENRIQUE"
	    },
	    {
	      "Codigo": "268",
	      "Descripcion": "FHON VILLALOBOS CARLOS ALBERTO"
	    },
	    {
	      "Codigo": "552",
	      "Descripcion": "FIGUEROA HUAMANI MADELEINE MARIA"
	    },
	    {
	      "Codigo": "535",
	      "Descripcion": "FLORES FRANCO PERSI JOEL"
	    },
	    {
	      "Codigo": "281",
	      "Descripcion": "FLORES GUILLEN DORIS ELENA"
	    },
	    {
	      "Codigo": "207",
	      "Descripcion": "FLORES SILVA OSCAR EDUARDO"
	    },
	    {
	      "Codigo": "236",
	      "Descripcion": "FLORES-CASTRO LINARES GIOVANNA YANET"
	    },
	    {
	      "Codigo": "377",
	      "Descripcion": "FLOREZ GARCIA GINAMARIA"
	    },
	    {
	      "Codigo": "559",
	      "Descripcion": "FRANCO DELGADO KELLY ALLISSON"
	    },
	    {
	      "Codigo": "89",
	      "Descripcion": "FRANCO LARRIVIERE KARIN ELIZABETH"
	    },
	    {
	      "Codigo": "394",
	      "Descripcion": "GALINDO MERCADO SHIRLEY KATHERINE"
	    },
	    {
	      "Codigo": "475",
	      "Descripcion": "GALLEGOS AYALA JOHAN CARLOS"
	    },
	    {
	      "Codigo": "538",
	      "Descripcion": "GALVEZ DIAZ MARIA ALEJANDRA"
	    },
	    {
	      "Codigo": "462",
	      "Descripcion": "GAMARRA MAGALLANES LILIANA ROSA"
	    },
	    {
	      "Codigo": "277",
	      "Descripcion": "GAMBOA ENCISO JULIO CESAR"
	    },
	    {
	      "Codigo": "254",
	      "Descripcion": "GAMERO ESPINO CARLOS LUIS"
	    },
	    {
	      "Codigo": "385",
	      "Descripcion": "GARCIA BARCELLI CINZIA ROSINA"
	    },
	    {
	      "Codigo": "190",
	      "Descripcion": "GARCIA BUENO WUILIN RODOLFO"
	    },
	    {
	      "Codigo": "256",
	      "Descripcion": "GARCIA PALOMINO WALTER JULIHNO"
	    },
	    {
	      "Codigo": "149",
	      "Descripcion": "GARCIA SALAZAR LUIS ALBERTO"
	    },
	    {
	      "Codigo": "150",
	      "Descripcion": "GARCIA SANTISTEBAN CESAR"
	    },
	    {
	      "Codigo": "471",
	      "Descripcion": "GARCIA SERNA  JOSE LUIS"
	    },
	    {
	      "Codigo": "316",
	      "Descripcion": "GARCIA TINEDO RODOLFO CARLOS"
	    },
	    {
	      "Codigo": "407",
	      "Descripcion": "GARCIA ZEGARRA MERY CARMEN"
	    },
	    {
	      "Codigo": "151",
	      "Descripcion": "GARDINI LECCA MIGUEL ANGEL"
	    },
	    {
	      "Codigo": "457",
	      "Descripcion": "GARIBALDI PIÑAS KATTIA IRENE"
	    },
	    {
	      "Codigo": "629",
	      "Descripcion": "GARRIDO LECCA PALACIOS PATRICIO HERNAN"
	    },
	    {
	      "Codigo": "118",
	      "Descripcion": "GASTA%AGA CASAFRANCA ALFREDO"
	    },
	    {
	      "Codigo": "320",
	      "Descripcion": "GASTELO AGUILAR ANGEL ENRIQUE"
	    },
	    {
	      "Codigo": "410",
	      "Descripcion": "GIL CAMPOS JUAN CARLOS"
	    },
	    {
	      "Codigo": "291",
	      "Descripcion": "GIRIBALDI BALAREZO JORGE MIGUEL"
	    },
	    {
	      "Codigo": "121",
	      "Descripcion": "GIRIBALDI BALAREZO MARIELLA ROSANNA"
	    },
	    {
	      "Codigo": "609",
	      "Descripcion": "GOMERO ARRUNATEGUI LUIS ENRIQUE"
	    },
	    {
	      "Codigo": "145",
	      "Descripcion": "GONZALES AYALA CARMEN JULIA"
	    },
	    {
	      "Codigo": "350",
	      "Descripcion": "GONZALEZ DEL RIEGO LEVY ELIANA ESTHER"
	    },
	    {
	      "Codigo": "642",
	      "Descripcion": "GONZALEZ MEJIA JHON STIP"
	    },
	    {
	      "Codigo": "429",
	      "Descripcion": "GRADOS ARANDA RUDITH SILVINA"
	    },
	    {
	      "Codigo": "623",
	      "Descripcion": "GRADOS CHIRITO RICARDO ANTONIO"
	    },
	    {
	      "Codigo": "428",
	      "Descripcion": "GRADOS CORTEZ LILIANA"
	    },
	    {
	      "Codigo": "561",
	      "Descripcion": "GRADOS FLORES LUIS HUMBERTO"
	    },
	    {
	      "Codigo": "216",
	      "Descripcion": "GUARNIZO GONZALES SANTOS JULISSA"
	    },
	    {
	      "Codigo": "239",
	      "Descripcion": "GUERRERO GONZALES JOSE ANTONIO"
	    },
	    {
	      "Codigo": "10",
	      "Descripcion": "GUTARRA SAMANIEGO ADA GABRIELA"
	    },
	    {
	      "Codigo": "474",
	      "Descripcion": "GUTIERREZ MARTINEZ OLIVIA AMELIA"
	    },
	    {
	      "Codigo": "164",
	      "Descripcion": "GUTIERREZ SANCHEZ LUIS ENRIQUE"
	    },
	    {
	      "Codigo": "515",
	      "Descripcion": "GUZMAN SANCHEZ ALBERTO MARTIN"
	    },
	    {
	      "Codigo": "387",
	      "Descripcion": "HERNANDEZ MIGUEL CARMEN"
	    },
	    {
	      "Codigo": "227",
	      "Descripcion": "HERNANI CALDAS JUAN BENJAMIN"
	    },
	    {
	      "Codigo": "425",
	      "Descripcion": "HERRERA BURGA CARMEN CAROLINA"
	    },
	    {
	      "Codigo": "509",
	      "Descripcion": "HIDALGO CALLE CRISTHIAN SMITH"
	    },
	    {
	      "Codigo": "84",
	      "Descripcion": "HOLGUIN RAMOS LUIS ANTONIO"
	    },
	    {
	      "Codigo": "447",
	      "Descripcion": "HUAMAN FLORES GINA PAMELA"
	    },
	    {
	      "Codigo": "540",
	      "Descripcion": "HUAMAN ROJAS RAQUEL MAZZEI"
	    },
	    {
	      "Codigo": "362",
	      "Descripcion": "HUATAY CARRASCAL LUIS ENRRIQUE"
	    },
	    {
	      "Codigo": "381",
	      "Descripcion": "HURTADO BAMBAREN RUBEN MAX"
	    },
	    {
	      "Codigo": "620",
	      "Descripcion": "HURTADO CABALLERO ANGELA IVETTE"
	    },
	    {
	      "Codigo": "635",
	      "Descripcion": "HURTADO VILLANUEVA BRESCIA"
	    },
	    {
	      "Codigo": "596",
	      "Descripcion": "INUMA GUERRERO LUCY MARGARITA"
	    },
	    {
	      "Codigo": "426",
	      "Descripcion": "IRAOLA SANCHEZ ANGELA ANTONIA"
	    },
	    {
	      "Codigo": "460",
	      "Descripcion": "IRRAZABAL LLERENA LUISA RODASKA"
	    },
	    {
	      "Codigo": "496",
	      "Descripcion": "ITA URIBE ELOISA JOHANA"
	    },
	    {
	      "Codigo": "640",
	      "Descripcion": "JAIMES MAGUIÑA HERMELINDA"
	    },
	    {
	      "Codigo": "132",
	      "Descripcion": "JAPA MELENDEZ ROLANDO"
	    },
	    {
	      "Codigo": "582",
	      "Descripcion": "JIMENEZ CARBAJAL GIOVANNA PAMELA ALEXANDRA"
	    },
	    {
	      "Codigo": "271",
	      "Descripcion": "JIMENEZ VIACAVA MARIA GRACIELA DEL CARMEN"
	    },
	    {
	      "Codigo": "170",
	      "Descripcion": "JUAREZ JUAREZ HECTOR"
	    },
	    {
	      "Codigo": "332",
	      "Descripcion": "JUAREZ PIZARRO JOSE LUIS"
	    },
	    {
	      "Codigo": "346",
	      "Descripcion": "JURADO GUTIERREZ ROSA MARIA"
	    },
	    {
	      "Codigo": "302",
	      "Descripcion": "JURSICH PARDO MASSIMILIANO"
	    },
	    {
	      "Codigo": "543",
	      "Descripcion": "KIANMAN KCOMT NANCY PATRICIA"
	    },
	    {
	      "Codigo": "399",
	      "Descripcion": "LA TORRE MORALES DIEGO SEBASTIAN"
	    },
	    {
	      "Codigo": "138",
	      "Descripcion": "LABARTHE MEZA CESAR RUBEN"
	    },
	    {
	      "Codigo": "614",
	      "Descripcion": "LANDEO PONCE HORACIO LUIS"
	    },
	    {
	      "Codigo": "437",
	      "Descripcion": "LANDERAS ORUNA ESTUARDO OCTAVIO"
	    },
	    {
	      "Codigo": "638",
	      "Descripcion": "LARCO SALAZAR RODRIGO MARCELO"
	    },
	    {
	      "Codigo": "589",
	      "Descripcion": "LAVADO BOCANEGRA CARMEN JOHANNA"
	    },
	    {
	      "Codigo": "364",
	      "Descripcion": "LEGUA RAMIREZ JOHNNY IVAN"
	    },
	    {
	      "Codigo": "286",
	      "Descripcion": "LEON BAQUEDANO MIGUEL  ANGEL"
	    },
	    {
	      "Codigo": "92",
	      "Descripcion": "LEON ROJAS ROSA ANGELICA"
	    },
	    {
	      "Codigo": "455",
	      "Descripcion": "LEON VILLAGARCIA MAX GERARDO"
	    },
	    {
	      "Codigo": "534",
	      "Descripcion": "LINARES CASAS JUAN CARLOS"
	    },
	    {
	      "Codigo": "276",
	      "Descripcion": "LINARES MEJIA MARISABEL"
	    },
	    {
	      "Codigo": "403",
	      "Descripcion": "LIZARES ARCE ZOILA BEVERLY"
	    },
	    {
	      "Codigo": "507",
	      "Descripcion": "LLANOS GARCIA PEDRO ANTONIO"
	    },
	    {
	      "Codigo": "300",
	      "Descripcion": "LLANOS MORENO ELIZABETH HERMILA"
	    },
	    {
	      "Codigo": "502",
	      "Descripcion": "LLANOS MUÑOZ JANET JOHANI"
	    },
	    {
	      "Codigo": "217",
	      "Descripcion": "LLERENA NOBLECILLA PERCY ESTEBAN"
	    },
	    {
	      "Codigo": "478",
	      "Descripcion": "LOO SU MERCEDES VICTORIA"
	    },
	    {
	      "Codigo": "631",
	      "Descripcion": "LOPEZ GARCIA MARIA MARIELA"
	    },
	    {
	      "Codigo": "379",
	      "Descripcion": "LOPEZ MENDOZA MARIA ISABEL"
	    },
	    {
	      "Codigo": "314",
	      "Descripcion": "LOPEZ PUGA MIGUEL ANGEL"
	    },
	    {
	      "Codigo": "225",
	      "Descripcion": "LOPEZ TORRES MONCADA JORGE LUIS"
	    },
	    {
	      "Codigo": "154",
	      "Descripcion": "LOYOLA MENDOZA OSCAR ORLANDO"
	    },
	    {
	      "Codigo": "220",
	      "Descripcion": "LUCERO HUAMAN MIGUEL ANGEL"
	    },
	    {
	      "Codigo": "525",
	      "Descripcion": "LUCIONI FERNANDEZ ROSA CONSTANZA"
	    },
	    {
	      "Codigo": "405",
	      "Descripcion": "LUNA VICTORIA REATEGUI JOSE  LUIS"
	    },
	    {
	      "Codigo": "359",
	      "Descripcion": "LUYO ZEVALLOS ANGEL"
	    },
	    {
	      "Codigo": "501",
	      "Descripcion": "MACHUCA YACOLCA JAVIER HERNAN"
	    },
	    {
	      "Codigo": "470",
	      "Descripcion": "MADRID CASTILLO RAUL ENRIQUE"
	    },
	    {
	      "Codigo": "464",
	      "Descripcion": "MADRID RODRIGUEZ JORGE"
	    },
	    {
	      "Codigo": "352",
	      "Descripcion": "MADRID VALLE FIORELLA VANESSA"
	    },
	    {
	      "Codigo": "551",
	      "Descripcion": "MAMANI MARTINEZ SANDRA ESTHER"
	    },
	    {
	      "Codigo": "395",
	      "Descripcion": "MANRIQUE CANTO ALFREDO MARTIN"
	    },
	    {
	      "Codigo": "512",
	      "Descripcion": "MANRIQUE HUACCHA MARIA GENOVEVA"
	    },
	    {
	      "Codigo": "391",
	      "Descripcion": "MANRRIQUE MENDOZA MONICA NANCY"
	    },
	    {
	      "Codigo": "228",
	      "Descripcion": "MANZUR CAPURRO JORGE FERNANDO"
	    },
	    {
	      "Codigo": "265",
	      "Descripcion": "MAQUERA DE PRADO GLADYS MARIA"
	    },
	    {
	      "Codigo": "436",
	      "Descripcion": "MARIÑO ADRIANZEN MARIO EMILIO"
	    },
	    {
	      "Codigo": "312",
	      "Descripcion": "MARQUEZ HERNANDEZ SERGIO"
	    },
	    {
	      "Codigo": "522",
	      "Descripcion": "MARTINEZ ARIADELA NILTON FELIX"
	    },
	    {
	      "Codigo": "383",
	      "Descripcion": "MARTINEZ BENAVIDES JOSE ADAN"
	    },
	    {
	      "Codigo": "632",
	      "Descripcion": "MARUY OCHOA ELIANA MENICSA"
	    },
	    {
	      "Codigo": "244",
	      "Descripcion": "MATOS ARANA JORGE LUIS"
	    },
	    {
	      "Codigo": "137",
	      "Descripcion": "MATTA ORME%O CARLOS ALBERTO"
	    },
	    {
	      "Codigo": "184",
	      "Descripcion": "MAU FLORES LYLY CAROLINA"
	    },
	    {
	      "Codigo": "90",
	      "Descripcion": "MAYORGA BALCAZAR SONIA MARIA"
	    },
	    {
	      "Codigo": "423",
	      "Descripcion": "MEDINA AQUIZE BENGALI ANDRAS"
	    },
	    {
	      "Codigo": "231",
	      "Descripcion": "MEDINA OCHANTE JULISSA"
	    },
	    {
	      "Codigo": "295",
	      "Descripcion": "MEGO FLORES LLENY ALICIA"
	    },
	    {
	      "Codigo": "520",
	      "Descripcion": "MENDEZ MENDOCILLA VANIA MILAGRITOS"
	    },
	    {
	      "Codigo": "527",
	      "Descripcion": "MENDOZA RAMIREZ FERNANDO ELIAS"
	    },
	    {
	      "Codigo": "583",
	      "Descripcion": "MENDOZA REVOLLEDO KATHERINE DORA"
	    },
	    {
	      "Codigo": "129",
	      "Descripcion": "MERCHOR RODRIGUEZ CHRISTIAN"
	    },
	    {
	      "Codigo": "600",
	      "Descripcion": "MERINO NATORCE MARIA CRISTINA"
	    },
	    {
	      "Codigo": "219",
	      "Descripcion": "MERINO ZARATE ELIZABETH ROXANA"
	    },
	    {
	      "Codigo": "253",
	      "Descripcion": "MEZA HINOSTROZA MARIA AQUILINA"
	    },
	    {
	      "Codigo": "283",
	      "Descripcion": "MEZA VALDIVIA ANA YESICA"
	    },
	    {
	      "Codigo": "224",
	      "Descripcion": "MILIANO VEGA CESAR ALEJANDRO"
	    },
	    {
	      "Codigo": "135",
	      "Descripcion": "MILLA MONTORO ANDRES LORENZO"
	    },
	    {
	      "Codigo": "508",
	      "Descripcion": "MILLA TUYA TANIA JANNINA"
	    },
	    {
	      "Codigo": "660",
	      "Descripcion": "MIRANDA BASAURI ERNESTO LUIS"
	    },
	    {
	      "Codigo": "128",
	      "Descripcion": "MOGOLLON MANTILLA AUGUSTO MODESTO"
	    },
	    {
	      "Codigo": "269",
	      "Descripcion": "MONDOÑEDO CORNEJO JOSE ALBERTO"
	    },
	    {
	      "Codigo": "489",
	      "Descripcion": "MONTAÑEZ BENITES MAGALY MELISSA"
	    },
	    {
	      "Codigo": "296",
	      "Descripcion": "MONTERO ALVARADO MARCO TULIO"
	    },
	    {
	      "Codigo": "235",
	      "Descripcion": "MONTOYA RISCO SAUL FERNANDO"
	    },
	    {
	      "Codigo": "446",
	      "Descripcion": "MORALES PONCE DE LEON CARLOS ERNESTO JESUS"
	    },
	    {
	      "Codigo": "565",
	      "Descripcion": "MORANTE GAMBOA JORGE ALIPIO"
	    },
	    {
	      "Codigo": "248",
	      "Descripcion": "MORENO GORDILLO MICHELL MILTON HAROLD"
	    },
	    {
	      "Codigo": "374",
	      "Descripcion": "MORI CARDENAS SEGUNDO"
	    },
	    {
	      "Codigo": "382",
	      "Descripcion": "MORI TORRES JORGE EDUARDO"
	    },
	    {
	      "Codigo": "661",
	      "Descripcion": "MORI TORRES JORGE EDUARDO (LEAD)"
	    },
	    {
	      "Codigo": "573",
	      "Descripcion": "MUÃ�OZ AGUILAR AURORA"
	    },
	    {
	      "Codigo": "419",
	      "Descripcion": "MUNAYCO SARAVIA FERNANDO"
	    },
	    {
	      "Codigo": "134",
	      "Descripcion": "MUÑOZ DIAZ WILDER"
	    },
	    {
	      "Codigo": "398",
	      "Descripcion": "MUÑOZ OTAROLA MELISSA"
	    },
	    {
	      "Codigo": "456",
	      "Descripcion": "MUÑOZ YARROW KELVIN"
	    },
	    {
	      "Codigo": "245",
	      "Descripcion": "MUÑOZ ZEBALLOS ALEXIS UBERCINDA"
	    },
	    {
	      "Codigo": "345",
	      "Descripcion": "NAVARRO ACOSTA ROLANDO JAEL"
	    },
	    {
	      "Codigo": "310",
	      "Descripcion": "NAVARRO SANTOS PATRICIA"
	    },
	    {
	      "Codigo": "336",
	      "Descripcion": "NEIRA JIMENEZ MARIZA ELIZABETH"
	    },
	    {
	      "Codigo": "181",
	      "Descripcion": "NICHO MAURICIO DANIELINA"
	    },
	    {
	      "Codigo": "130",
	      "Descripcion": "NIÑO DE GUZMAN HERRERA JULMER HUGO"
	    },
	    {
	      "Codigo": "136",
	      "Descripcion": "NIZAMA ALBURQUERQUE JUAN FRANCISCO"
	    },
	    {
	      "Codigo": "160",
	      "Descripcion": "NU%EZ ARRIOLA ENRIQUE ALFREDO"
	    },
	    {
	      "Codigo": "555",
	      "Descripcion": "NUÑEZ JUAREZ CARLOS ALBERTO"
	    },
	    {
	      "Codigo": "94",
	      "Descripcion": "NUÑEZ LEON PATRICIA ROSARIO"
	    },
	    {
	      "Codigo": "233",
	      "Descripcion": "NUÑEZ-MELGAR ALBA BLANCA CAROLINA"
	    },
	    {
	      "Codigo": "319",
	      "Descripcion": "OBLITAS MENDEZ MONICA JANET"
	    },
	    {
	      "Codigo": "133",
	      "Descripcion": "OCA%A LOPEZ EDELI"
	    },
	    {
	      "Codigo": "659",
	      "Descripcion": "OCHOA DEL CASTILLO ABRAHAM GABRIEL"
	    },
	    {
	      "Codigo": "270",
	      "Descripcion": "OCHOA SEGURA MELIDA ISABEL"
	    },
	    {
	      "Codigo": "36",
	      "Descripcion": "OFICINA . ANGAMOS"
	    },
	    {
	      "Codigo": "26",
	      "Descripcion": "OFICINA . BARRANCA"
	    },
	    {
	      "Codigo": "40",
	      "Descripcion": "OFICINA  CUZCO"
	    },
	    {
	      "Codigo": "25",
	      "Descripcion": "OFICINA . HUACHO"
	    },
	    {
	      "Codigo": "37",
	      "Descripcion": "OFICINA . LAS PALMERAS"
	    },
	    {
	      "Codigo": "34",
	      "Descripcion": "OFICINA . LIBERTAD"
	    },
	    {
	      "Codigo": "406",
	      "Descripcion": "ORDOÃ�EZ RAMOS OMAR NILTON"
	    },
	    {
	      "Codigo": "114",
	      "Descripcion": "ORTIZ RETAMOZO MANUEL JESUS"
	    },
	    {
	      "Codigo": "87",
	      "Descripcion": "ORTIZ VIVANCO ROBERTO CARLOS"
	    },
	    {
	      "Codigo": "115",
	      "Descripcion": "OSORES INFANTE CHRISTIAN FRANCISCO"
	    },
	    {
	      "Codigo": "453",
	      "Descripcion": "OSPINO COLONIO KELLY JHOANA"
	    },
	    {
	      "Codigo": "454",
	      "Descripcion": "OSSIO DE BUITRON MARIA GUADALUPE"
	    },
	    {
	      "Codigo": "93",
	      "Descripcion": "OTERO PINGO JORGE EDUARDO"
	    },
	    {
	      "Codigo": "547",
	      "Descripcion": "OTERO TRELLES CARLO MARIO"
	    },
	    {
	      "Codigo": "182",
	      "Descripcion": "PACHECO GARCIA RAUL JULIAN"
	    },
	    {
	      "Codigo": "452",
	      "Descripcion": "PALACIOS DA'POZZO ROCIO"
	    },
	    {
	      "Codigo": "663",
	      "Descripcion": "PALOMINO RIMACHI YAQUELIN"
	    },
	    {
	      "Codigo": "570",
	      "Descripcion": "PANTA SIPION MILAGROS"
	    },
	    {
	      "Codigo": "621",
	      "Descripcion": "PAREDES TORRES ELFRE RUDI"
	    },
	    {
	      "Codigo": "393",
	      "Descripcion": "PASTRANA SUZUKI FATIMA MICHELLE"
	    },
	    {
	      "Codigo": "567",
	      "Descripcion": "PAUCAR COTRINA CARLOS ALBERTO"
	    },
	    {
	      "Codigo": "469",
	      "Descripcion": "PAUCAS SARMIENTO ROCIO ESMERALDA"
	    },
	    {
	      "Codigo": "449",
	      "Descripcion": "PAYBA REA ANGIE ROXANA"
	    },
	    {
	      "Codigo": "438",
	      "Descripcion": "PAZ HUALLPA ZAYDA"
	    },
	    {
	      "Codigo": "273",
	      "Descripcion": "PEDRAZA GUARDALES ANGELICA"
	    },
	    {
	      "Codigo": "617",
	      "Descripcion": "PEÑAHERRERA SUITO GONZALO ALONSO"
	    },
	    {
	      "Codigo": "667",
	      "Descripcion": "PERALTA SANTIVAÑEZ JESSY GIOVANA"
	    },
	    {
	      "Codigo": "615",
	      "Descripcion": "PERALTA YAZAWA JACQUELINE"
	    },
	    {
	      "Codigo": "275",
	      "Descripcion": "PEREZ DE VELAZCO GONZALES FRANCISCO GUILLERMO"
	    },
	    {
	      "Codigo": "641",
	      "Descripcion": "PEREZ HERNANDEZ ANTONIA"
	    },
	    {
	      "Codigo": "480",
	      "Descripcion": "PEREZ VALDERRAMA DIANA LISSETH"
	    },
	    {
	      "Codigo": "116",
	      "Descripcion": "PESCHIERA VENEGAS PAOLA MARIA"
	    },
	    {
	      "Codigo": "252",
	      "Descripcion": "PETIT GRUTER JEAN PIERRE"
	    },
	    {
	      "Codigo": "329",
	      "Descripcion": "PINEDA CORNEJO CARMEN ROSA"
	    },
	    {
	      "Codigo": "380",
	      "Descripcion": "PINTO SALINAS MARIA ELIZABETH"
	    },
	    {
	      "Codigo": "537",
	      "Descripcion": "PINTO VELASQUEZ LUCY"
	    },
	    {
	      "Codigo": "633",
	      "Descripcion": "POZO VASQUEZ WALTER JHONNY"
	    },
	    {
	      "Codigo": "360",
	      "Descripcion": "PRADO TRAVEZAÃ�O CESAR JESUS"
	    },
	    {
	      "Codigo": "347",
	      "Descripcion": "PUERTA GOMEZ ROBERT PAULO"
	    },
	    {
	      "Codigo": "497",
	      "Descripcion": "PULACHE PIZARRO NATALIE YANNINA"
	    },
	    {
	      "Codigo": "355",
	      "Descripcion": "QUESADA ESTREMADOYRO ORLANDO JAIME"
	    },
	    {
	      "Codigo": "500",
	      "Descripcion": "QUIÑONES LUZQUIÑOS CARLOS ENRIQUE"
	    },
	    {
	      "Codigo": "371",
	      "Descripcion": "QUIROZ AZNARAN JOSE BALTAZAR"
	    },
	    {
	      "Codigo": "591",
	      "Descripcion": "QUISPE BRACAMONTE ALEX EMILIO"
	    },
	    {
	      "Codigo": "645",
	      "Descripcion": "QUISPE QUINTANA MARIA STHEFANI"
	    },
	    {
	      "Codigo": "388",
	      "Descripcion": "RAMIREZ ALVAN AZUCENA"
	    },
	    {
	      "Codigo": "651",
	      "Descripcion": "RAMIREZ CASTRO MARIA CAROLINA"
	    },
	    {
	      "Codigo": "304",
	      "Descripcion": "RAMIREZ CERVANTES JACKELINE"
	    },
	    {
	      "Codigo": "510",
	      "Descripcion": "RAMIREZ FALEN JORGE LUIS"
	    },
	    {
	      "Codigo": "443",
	      "Descripcion": "RAMOS CAYO SILVIA ROSSANA"
	    },
	    {
	      "Codigo": "473",
	      "Descripcion": "RAMOS FALLA LUIS ENRIQUE"
	    },
	    {
	      "Codigo": "171",
	      "Descripcion": "RAMOS JUAREZ LUIS ALBERTO"
	    },
	    {
	      "Codigo": "630",
	      "Descripcion": "RAMOS JURADO LUIS ENRIQUE"
	    },
	    {
	      "Codigo": "169",
	      "Descripcion": "RAMOS RIVERA WILLIAM ALFREDO"
	    },
	    {
	      "Codigo": "431",
	      "Descripcion": "RAMOS SANCHEZ JORGE"
	    },
	    {
	      "Codigo": "339",
	      "Descripcion": "RAMOS TORRES ADOLFO MARTIN"
	    },
	    {
	      "Codigo": "146",
	      "Descripcion": "RAZZETO ZAVALA JOE NICOLAS"
	    },
	    {
	      "Codigo": "301",
	      "Descripcion": "REATEGUI YOUNG MANUELA DEL ROCIO"
	    },
	    {
	      "Codigo": "148",
	      "Descripcion": "RENGIFO LOPEZ EROL MARTIN"
	    },
	    {
	      "Codigo": "562",
	      "Descripcion": "RENGIFO VEGA RICHARD JAVIER"
	    },
	    {
	      "Codigo": "86",
	      "Descripcion": "REQUENA OLAVARRIA DENISSE ROXANA DE J"
	    },
	    {
	      "Codigo": "533",
	      "Descripcion": "REYES BOITANO NELLY SABINA"
	    },
	    {
	      "Codigo": "430",
	      "Descripcion": "REYES FALLA CARLOS ALBERTO"
	    },
	    {
	      "Codigo": "442",
	      "Descripcion": "REYES LUYO FELIX AUGUSTO"
	    },
	    {
	      "Codigo": "644",
	      "Descripcion": "REYES SAJI RONALD"
	    },
	    {
	      "Codigo": "602",
	      "Descripcion": "REYNOSO ALVARADO SOLEDAD DEL ROSARIO"
	    },
	    {
	      "Codigo": "590",
	      "Descripcion": "RIOFRIO SEMINARIO DIANA"
	    },
	    {
	      "Codigo": "16896",
	      "Descripcion": "RIOS VEGA TEODORO"
	    },
	    {
	      "Codigo": "626",
	      "Descripcion": "RIVERA HUAMANCHUMO THEDDY RIBOBERTO"
	    },
	    {
	      "Codigo": "658",
	      "Descripcion": "RIVERO TAPIA MARIANA FIORELLA"
	    },
	    {
	      "Codigo": "479",
	      "Descripcion": "RIVEROS CONDORI MARIA DEL CARMEN"
	    },
	    {
	      "Codigo": "71",
	      "Descripcion": "RIZO PATRON CARDOZO PEDRO RAUL"
	    },
	    {
	      "Codigo": "580",
	      "Descripcion": "ROBLES DEZA LOURDES"
	    },
	    {
	      "Codigo": "421",
	      "Descripcion": "RODRIGUEZ ARELLANO IRENE MARIA"
	    },
	    {
	      "Codigo": "246",
	      "Descripcion": "RODRIGUEZ BAZAN SAMUEL GUILLERMO"
	    },
	    {
	      "Codigo": "122",
	      "Descripcion": "RODRIGUEZ DIAZ NELSON LEONIDAS"
	    },
	    {
	      "Codigo": "463",
	      "Descripcion": "RODRIGUEZ MONTERROSO JOSE MANUEL"
	    },
	    {
	      "Codigo": "234",
	      "Descripcion": "RODRIGUEZ VELEZ ALDO MOISES"
	    },
	    {
	      "Codigo": "514",
	      "Descripcion": "ROJAS ARTEAGA JUDITH CELINDA"
	    },
	    {
	      "Codigo": "664",
	      "Descripcion": "ROJAS BALCAZAR PEDRO MIGUEL"
	    },
	    {
	      "Codigo": "396",
	      "Descripcion": "ROJAS CALLE MARIA DEL ROSARIO"
	    },
	    {
	      "Codigo": "260",
	      "Descripcion": "ROJAS LLANOS ABEL"
	    },
	    {
	      "Codigo": "524",
	      "Descripcion": "ROJAS MARTINEZ LIVIA TERESA"
	    },
	    {
	      "Codigo": "550",
	      "Descripcion": "ROJAS PARIONA JOSE LUIS"
	    },
	    {
	      "Codigo": "139",
	      "Descripcion": "ROJAS PEREZ ROBERTO CARMELO"
	    },
	    {
	      "Codigo": "318",
	      "Descripcion": "ROMAN CARRASCO ALLAN ALAIN"
	    },
	    {
	      "Codigo": "549",
	      "Descripcion": "ROMERO HUAMAN SILVIA ELIZABETH"
	    },
	    {
	      "Codigo": "517",
	      "Descripcion": "ROMERO MORGAN DIEGO"
	    },
	    {
	      "Codigo": "499",
	      "Descripcion": "ROSSI NOEL RAUL FERNANDO"
	    },
	    {
	      "Codigo": "594",
	      "Descripcion": "RUBINA CALLE MIZAR"
	    },
	    {
	      "Codigo": "579",
	      "Descripcion": "RUIZ FACHO HUMBERTO GERMAN"
	    },
	    {
	      "Codigo": "81",
	      "Descripcion": "RUIZ RABINES ZOILA  EUGENIA  DE LAS MERCEDES"
	    },
	    {
	      "Codigo": "158",
	      "Descripcion": "RUJEL ORTIZ ADAN BENITO"
	    },
	    {
	      "Codigo": "643",
	      "Descripcion": "SAAVEDRA FERNANDEZ CARMEN LIZBETH"
	    },
	    {
	      "Codigo": "649",
	      "Descripcion": "SABLA KOURANI MARIAM"
	    },
	    {
	      "Codigo": "367",
	      "Descripcion": "SABOGAL LA ROSA URSULA"
	    },
	    {
	      "Codigo": "213",
	      "Descripcion": "SALAS LLERENA SANDRA KARINA"
	    },
	    {
	      "Codigo": "351",
	      "Descripcion": "SALAS PAREDES ROGER ULISES"
	    },
	    {
	      "Codigo": "506",
	      "Descripcion": "SALAZAR CONTRERAS RAUL ALEXIS"
	    },
	    {
	      "Codigo": "307",
	      "Descripcion": "SALCEDO SOLANO MARIANELA MELCHORA"
	    },
	    {
	      "Codigo": "95",
	      "Descripcion": "SALCEDO VALENTIN LUCIO ENRIQUE"
	    },
	    {
	      "Codigo": "293",
	      "Descripcion": "SALDARRIAGA MONTOYA JOSE ANTONIO"
	    },
	    {
	      "Codigo": "292",
	      "Descripcion": "SALDARRIAGA OBANDO GABRIEL AUGUSTO"
	    },
	    {
	      "Codigo": "637",
	      "Descripcion": "SALGUERO QUINOSO GONZALO"
	    },
	    {
	      "Codigo": "7",
	      "Descripcion": "SALIZAR CORNEJO MANUEL ANDRES"
	    },
	    {
	      "Codigo": "392",
	      "Descripcion": "SANCHEZ BARRAGAN FREDDY ENRIQUE"
	    },
	    {
	      "Codigo": "404",
	      "Descripcion": "SANCHEZ CESPEDES MATILDE ESTELA"
	    },
	    {
	      "Codigo": "147",
	      "Descripcion": "SANCHEZ GELDRES MANUEL EMILIO"
	    },
	    {
	      "Codigo": "418",
	      "Descripcion": "SANCHEZ POLO YSELA JANET"
	    },
	    {
	      "Codigo": "255",
	      "Descripcion": "SANCHEZ RODRIGUEZ CAROLINA JACINTA ISABEL"
	    },
	    {
	      "Codigo": "294",
	      "Descripcion": "SANCHEZ SALAS JOSE ROBERTO"
	    },
	    {
	      "Codigo": "335",
	      "Descripcion": "SANCHEZ SANCHEZ JOSE MELQUIADES"
	    },
	    {
	      "Codigo": "356",
	      "Descripcion": "SANTOS OLIVERA MISAEL JUAN"
	    },
	    {
	      "Codigo": "434",
	      "Descripcion": "SEGURA MORENO JOSE LUIS"
	    },
	    {
	      "Codigo": "492",
	      "Descripcion": "SEVILLA TORRES JORGE"
	    },
	    {
	      "Codigo": "483",
	      "Descripcion": "SIGUAS HERRERA CARMEN LIZBETH"
	    },
	    {
	      "Codigo": "526",
	      "Descripcion": "SILVA ANDRADE CRISTIAN JACOBO"
	    },
	    {
	      "Codigo": "357",
	      "Descripcion": "SILVA ARAUJO CESAR  ANTONIO"
	    },
	    {
	      "Codigo": "127",
	      "Descripcion": "SILVA CARDENAS JOSE LUIS"
	    },
	    {
	      "Codigo": "432",
	      "Descripcion": "SILVA FLOR LOURDES MERCEDES"
	    },
	    {
	      "Codigo": "523",
	      "Descripcion": "SILVA KASENG EDUARDO"
	    },
	    {
	      "Codigo": "358",
	      "Descripcion": "SILVA ORE JULIO CESAR"
	    },
	    {
	      "Codigo": "412",
	      "Descripcion": "SILVA PEDRAZA ERNESTO ALFONSO"
	    },
	    {
	      "Codigo": "420",
	      "Descripcion": "SIMONI CHAMORRO JANETH VERONICA"
	    },
	    {
	      "Codigo": "521",
	      "Descripcion": "SIPAN ROMERO NORMA SAGRARIO"
	    },
	    {
	      "Codigo": "342",
	      "Descripcion": "SISNIEGAS NONATO KARINA EVELYN"
	    },
	    {
	      "Codigo": "576",
	      "Descripcion": "SIU CHANG JUAN CARLOS"
	    },
	    {
	      "Codigo": "519",
	      "Descripcion": "SOLIS MENDOZA JORGE MARTIN"
	    },
	    {
	      "Codigo": "322",
	      "Descripcion": "SOLIS OLIVEIRA DE HOLZ MARIA DE JESUS"
	    },
	    {
	      "Codigo": "284",
	      "Descripcion": "SOTELO RAMIREZ JUAN DE DIOS"
	    },
	    {
	      "Codigo": "241",
	      "Descripcion": "SOTO ORTIZ VICTOR EDUARDO"
	    },
	    {
	      "Codigo": "511",
	      "Descripcion": "SOTO SANES MARITZA LILIANA"
	    },
	    {
	      "Codigo": "348",
	      "Descripcion": "SUAREZ MORON JOSE MARTIN"
	    },
	    {
	      "Codigo": "414",
	      "Descripcion": "TEJADA VILELA KARLA ANDREA"
	    },
	    {
	      "Codigo": "433",
	      "Descripcion": "TELLO VELASCO LUIS RODRIGO"
	    },
	    {
	      "Codigo": "494",
	      "Descripcion": "TORREJON LOPEZ LUISA ALEJANDRA"
	    },
	    {
	      "Codigo": "422",
	      "Descripcion": "TORRES FERNANDEZ JORGE LUIS"
	    },
	    {
	      "Codigo": "178",
	      "Descripcion": "TORRES RODRIGUEZ CARLOS ALFREDO"
	    },
	    {
	      "Codigo": "601",
	      "Descripcion": "TORRES SANDOVAL CARMEN PAMELA"
	    },
	    {
	      "Codigo": "484",
	      "Descripcion": "TRELLES COSTAGUTA BRUNO"
	    },
	    {
	      "Codigo": "604",
	      "Descripcion": "TRIGO COHELLO SERGIO"
	    },
	    {
	      "Codigo": "554",
	      "Descripcion": "TRILLO SAENZ ALBERTO"
	    },
	    {
	      "Codigo": "161",
	      "Descripcion": "TRONCOS DELFIN JAIME GABRIEL"
	    },
	    {
	      "Codigo": "411",
	      "Descripcion": "UNDA SIMBORTH FRIDER"
	    },
	    {
	      "Codigo": "490",
	      "Descripcion": "URIBE CRISOSTOMO MARIELLA ANGELICA"
	    },
	    {
	      "Codigo": "70",
	      "Descripcion": "USQUIANO FERREYRA MIGUEL ANGEL"
	    },
	    {
	      "Codigo": "488",
	      "Descripcion": "VALCAZAR CASTELLO LINDA CYNDY"
	    },
	    {
	      "Codigo": "450",
	      "Descripcion": "VALDERRAMA ALCANDRE YOLANDA"
	    },
	    {
	      "Codigo": "250",
	      "Descripcion": "VALDEZ ZARATE CARMEN"
	    },
	    {
	      "Codigo": "564",
	      "Descripcion": "VALDIVIA GONZALES JORGE HERNAN"
	    },
	    {
	      "Codigo": "287",
	      "Descripcion": "VALDIVIA GUTIERREZ JAIME DANIEL"
	    },
	    {
	      "Codigo": "577",
	      "Descripcion": "VALENCIA ROJAS MARIA MARGARITA"
	    },
	    {
	      "Codigo": "498",
	      "Descripcion": "VARGAS GARCIA SERGIO WALTHER"
	    },
	    {
	      "Codigo": "303",
	      "Descripcion": "VARGAS MACHUCA AGUERO CARLOS FERNANDO"
	    },
	    {
	      "Codigo": "80",
	      "Descripcion": "VARGAS RUFFNER CESAR RAFAEL"
	    },
	    {
	      "Codigo": "9",
	      "Descripcion": "VARGAS TOUR RAFAEL FELIPE"
	    },
	    {
	      "Codigo": "536",
	      "Descripcion": "VASQUEZ HUACHILLO ERIKA ZULIV"
	    },
	    {
	      "Codigo": "532",
	      "Descripcion": "VASQUEZ UGAS JOSE ANTONIO RAFAEL"
	    },
	    {
	      "Codigo": "415",
	      "Descripcion": "VASQUEZ YACTAYO LUIS ROY"
	    },
	    {
	      "Codigo": "581",
	      "Descripcion": "VEGA AQUIÑO LUIS ALBERTO"
	    },
	    {
	      "Codigo": "258",
	      "Descripcion": "VEGA GARCIA RAFAEL GUSTAVO"
	    },
	    {
	      "Codigo": "315",
	      "Descripcion": "VEGA LEAÑO JANNET VICTORIA"
	    },
	    {
	      "Codigo": "634",
	      "Descripcion": "VEGA OBREGON LUZ VERONICA"
	    },
	    {
	      "Codigo": "597",
	      "Descripcion": "VEGA RUIZ BETZABE TERESA"
	    },
	    {
	      "Codigo": "622",
	      "Descripcion": "VEGA VALENTIN JORGE ANTONIO"
	    },
	    {
	      "Codigo": "341",
	      "Descripcion": "VELASQUEZ ECHEVARRIA YENNY  ROCIO"
	    },
	    {
	      "Codigo": "408",
	      "Descripcion": "VERA FIGUEROA MARCO ANTONIO"
	    },
	    {
	      "Codigo": "325",
	      "Descripcion": "VERA REA?O MARCO GUSTAVO"
	    },
	    {
	      "Codigo": "168",
	      "Descripcion": "VIA Y RADA DAVILA MIRIAM VICTORIA"
	    },
	    {
	      "Codigo": "5",
	      "Descripcion": "VIDAL GUTIERREZ JULIAN"
	    },
	    {
	      "Codigo": "585",
	      "Descripcion": "VILCA SALAS JOSE MANUEL"
	    },
	    {
	      "Codigo": "159",
	      "Descripcion": "VILCHEZ ROSILLO CARLOS ALBERTO"
	    },
	    {
	      "Codigo": "214",
	      "Descripcion": "VILLALTA PALACIOS NELLY ESPERANZA"
	    },
	    {
	      "Codigo": "648",
	      "Descripcion": "VILLANUEVA TRUJILLO CANDICE MILU"
	    },
	    {
	      "Codigo": "290",
	      "Descripcion": "VILLAR GAUDRY VERONICA JACQUELINE"
	    },
	    {
	      "Codigo": "545",
	      "Descripcion": "VIZCARRA RIVAS GEOVANNA PAOLA"
	    },
	    {
	      "Codigo": "91",
	      "Descripcion": "VIZCARRA ZENTENO ELENA SOLEDAD"
	    },
	    {
	      "Codigo": "278",
	      "Descripcion": "VLASICA RUBIANES MYROS LUIS ANTONIO"
	    },
	    {
	      "Codigo": "262",
	      "Descripcion": "VUKOVICH MORI ALEXANDER"
	    },
	    {
	      "Codigo": "373",
	      "Descripcion": "WILSON ARAMBURU RICHARD"
	    },
	    {
	      "Codigo": "572",
	      "Descripcion": "YACILA YAMUNAQUE DARWIN"
	    },
	    {
	      "Codigo": "218",
	      "Descripcion": "YANQUI PINTO VICTOR EDGARDO"
	    },
	    {
	      "Codigo": "505",
	      "Descripcion": "ZAMORA GUTIERREZ KIMI MARITZA"
	    },
	    {
	      "Codigo": "157",
	      "Descripcion": "ZAMORA YOVERA ZOILA JESUS"
	    },
	    {
	      "Codigo": "607",
	      "Descripcion": "ZANABRIA RODRIGUEZ ENRIQUE EDUARDO"
	    },
	    {
	      "Codigo": "229",
	      "Descripcion": "ZANONI REVILLA ROSA ELVIRA"
	    },
	    {
	      "Codigo": "117",
	      "Descripcion": "ZARATE OLIVARI TERESA RICARDINA DEL SOCORRO"
	    },
	    {
	      "Codigo": "606",
	      "Descripcion": "ZAVALA BRAVO JHONATAN ELOY"
	    },
	    {
	      "Codigo": "142",
	      "Descripcion": "ZAVALA RICALDE ZURAMA BETTY"
	    },
	    {
	      "Codigo": "493",
	      "Descripcion": "ZAVALA ROMERO MARIA DEL CARMEN JUDITH"
	    },
	    {
	      "Codigo": "334",
	      "Descripcion": "ZEVALLOS LUZQUI?OS JORGE ALBERTO"
	    },
	    {
	      "Codigo": "376",
	      "Descripcion": "ZEVALLOS VIRREYRA PEDRO EDUARDO"
	    }
	  ],
	  "OperationCode": 200,
	  "TypeMessage": "success"
	});
});

router.post("/agente/vida", function(req, res) {
	console.log(req.body);
	return res.json({
	  "Message": "",
	  "Data": [
	    {
	      "CodigoNombre": "955 - ACARO JURADO JOSE OLMEDO",
	      "CodigoAgente": 955
	    },
	    {
	      "CodigoNombre": "2493 - ACOSTA MANRIQUE PEDRO PABEL",
	      "CodigoAgente": 2493
	    },
	    {
	      "CodigoNombre": "7336 - AEDO SANCHEZ IRIS",
	      "CodigoAgente": 7336
	    },
	    {
	      "CodigoNombre": "2276 - ALCANTARA REAÑO LUIS TEOFILO",
	      "CodigoAgente": 2276
	    },
	    {
	      "CodigoNombre": "1151 - ALPISTE ZAMORA CARLOS ENRIQUE",
	      "CodigoAgente": 1151
	    },
	    {
	      "CodigoNombre": "1233 - ALVAREZ RODRIGUEZ OCTAVIO",
	      "CodigoAgente": 1233
	    },
	    {
	      "CodigoNombre": "2229 - ALZAMORA GONZALES LIDIA ROSA",
	      "CodigoAgente": 2229
	    },
	    {
	      "CodigoNombre": "7305 - AMADO PEREZ MARCO ANTONIO DANIEL",
	      "CodigoAgente": 7305
	    },
	    {
	      "CodigoNombre": "119 - AQUIJE OROSCO FLORISA  HERMILIA",
	      "CodigoAgente": 119
	    },
	    {
	      "CodigoNombre": "1689 - ARDILES VILLASECA JORGE",
	      "CodigoAgente": 1689
	    },
	    {
	      "CodigoNombre": "6912 - ARENAS DIAZ JUAN BORIS",
	      "CodigoAgente": 6912
	    },
	    {
	      "CodigoNombre": "89 - ARRUNATEGUI UGARTE ESTHER MILAGROS",
	      "CodigoAgente": 89
	    },
	    {
	      "CodigoNombre": "91 - ATENCIO ARQUE ALEX",
	      "CodigoAgente": 91
	    },
	    {
	      "CodigoNombre": "1525 - BADOVINI VALENZUELA SLAVA G",
	      "CodigoAgente": 1525
	    },
	    {
	      "CodigoNombre": "2346 - BARDALES CANAZAS LUIS",
	      "CodigoAgente": 2346
	    },
	    {
	      "CodigoNombre": "912 - BARZOLA QUISPE MARINO LUIS",
	      "CodigoAgente": 912
	    },
	    {
	      "CodigoNombre": "200 - BUSTAMANTE RAMIREZ CESAR AUGUSTO",
	      "CodigoAgente": 200
	    },
	    {
	      "CodigoNombre": "7628 - CABRAL CORREA CARMEN",
	      "CodigoAgente": 7628
	    },
	    {
	      "CodigoNombre": "892 - CAMPOS GUANILO HEBERT DAN",
	      "CodigoAgente": 892
	    },
	    {
	      "CodigoNombre": "923 - CAMPOS RAYMUNDO CARLOS",
	      "CodigoAgente": 923
	    },
	    {
	      "CodigoNombre": "2841 - CARRANZA GAMBOA LUIS RICARDO",
	      "CodigoAgente": 2841
	    },
	    {
	      "CodigoNombre": "683 - CARRILLO PAREDES ANGEL EDUARDO",
	      "CodigoAgente": 683
	    },
	    {
	      "CodigoNombre": "1530 - CASTAÑETA CASTRO FRECTOR N",
	      "CodigoAgente": 1530
	    },
	    {
	      "CodigoNombre": "1659 - CELIS GARCIA GENARO TOMAS",
	      "CodigoAgente": 1659
	    },
	    {
	      "CodigoNombre": "2156 - CHUMBE DEL AGUILA HORACIO",
	      "CodigoAgente": 2156
	    },
	    {
	      "CodigoNombre": "857 - COLE REYES OSWALDO JOSE",
	      "CodigoAgente": 857
	    },
	    {
	      "CodigoNombre": "2013 - CONDORI GONZALES CECILIA",
	      "CodigoAgente": 2013
	    },
	    {
	      "CodigoNombre": "966 - CUBA SUAREZ JORGE JAVIER",
	      "CodigoAgente": 966
	    },
	    {
	      "CodigoNombre": "1327 - DANRESA CORREDORES DE SEGUROS S.A.C.",
	      "CodigoAgente": 1327
	    },
	    {
	      "CodigoNombre": "7201 - DE LA CRUZ DIAZ MARIA MILAGROS",
	      "CodigoAgente": 7201
	    },
	    {
	      "CodigoNombre": "219 - DE PAZ INFANTE ROQUE",
	      "CodigoAgente": 219
	    },
	    {
	      "CodigoNombre": "3048 - DIRECTO UDV - OF. LAS PALMERAS",
	      "CodigoAgente": 3048
	    },
	    {
	      "CodigoNombre": "1459 - DONAYRE BARRIOS ATILIO MARIO",
	      "CodigoAgente": 1459
	    },
	    {
	      "CodigoNombre": "624 - ESPINOZA CASTA%EDA PEDRO JUSTO",
	      "CodigoAgente": 624
	    },
	    {
	      "CodigoNombre": "914 - ESQUERRE ROJAS VICTOR MANUEL",
	      "CodigoAgente": 914
	    },
	    {
	      "CodigoNombre": "140 - FERNANDEZ BAUTISTA VICTOR",
	      "CodigoAgente": 140
	    },
	    {
	      "CodigoNombre": "1475 - GALDOS & ASOCIADOS EIRL CORRED",
	      "CodigoAgente": 1475
	    },
	    {
	      "CodigoNombre": "1479 - GANOZA CABALLERO ROGER MANUEL",
	      "CodigoAgente": 1479
	    },
	    {
	      "CodigoNombre": "7200 - GARCIA BENITES CARLOS MANUEL",
	      "CodigoAgente": 7200
	    },
	    {
	      "CodigoNombre": "6055 - GUARNIZO GONZALES SANTOS JULISSA",
	      "CodigoAgente": 6055
	    },
	    {
	      "CodigoNombre": "715 - GUIJA NU%EZ WALTER DIEGO",
	      "CodigoAgente": 715
	    },
	    {
	      "CodigoNombre": "2057 - GUZMAN FERNANDEZ SILVERIO P",
	      "CodigoAgente": 2057
	    },
	    {
	      "CodigoNombre": "1260 - HERRERA MONTOYA FERNANDO",
	      "CodigoAgente": 1260
	    },
	    {
	      "CodigoNombre": "1221 - HORNA RODRIGUEZ VICTOR RAUL",
	      "CodigoAgente": 1221
	    },
	    {
	      "CodigoNombre": "734 - IZQUIERDO VALLE ABSALON ENRIQUE",
	      "CodigoAgente": 734
	    },
	    {
	      "CodigoNombre": "130 - LA ANDINA CORREDORES DE SEG.",
	      "CodigoAgente": 130
	    },
	    {
	      "CodigoNombre": "1501 - LADERA ORTIZ JESUS ANGEL",
	      "CodigoAgente": 1501
	    },
	    {
	      "CodigoNombre": "2271 - LAVADO SOTELO ROGER EPIFANIO",
	      "CodigoAgente": 2271
	    },
	    {
	      "CodigoNombre": "127 - LINARES CORNEJO JULIO JAIME",
	      "CodigoAgente": 127
	    },
	    {
	      "CodigoNombre": "1628 - LOC ELSENSOHN JORGE LUIS",
	      "CodigoAgente": 1628
	    },
	    {
	      "CodigoNombre": "7288 - LUJAN-RIPOLL CORNELIO VIVIANA VANESA",
	      "CodigoAgente": 7288
	    },
	    {
	      "CodigoNombre": "2345 - LUPERDIGA MENDOZA PATRICIA",
	      "CodigoAgente": 2345
	    },
	    {
	      "CodigoNombre": "7430 - LUYO QUIROGA YVAN MAXIMILIANO",
	      "CodigoAgente": 7430
	    },
	    {
	      "CodigoNombre": "661 - MACHUCA BARRIENTOS ISMAEL",
	      "CodigoAgente": 661
	    },
	    {
	      "CodigoNombre": "1445 - MADALENGOITIA OVIEDO JULIO C",
	      "CodigoAgente": 1445
	    },
	    {
	      "CodigoNombre": "2091 - MAGUI%A VARGAS JHENY FLORLINDA",
	      "CodigoAgente": 2091
	    },
	    {
	      "CodigoNombre": "7488 - MOLINA ESPINOZA OMAR",
	      "CodigoAgente": 7488
	    },
	    {
	      "CodigoNombre": "7313 - MONTELLANOS CAYTUERO GIOVANNI",
	      "CodigoAgente": 7313
	    },
	    {
	      "CodigoNombre": "1965 - MONTOYA ALCANTARA CESAR",
	      "CodigoAgente": 1965
	    },
	    {
	      "CodigoNombre": "513 - MORENO GARCIA RAMON",
	      "CodigoAgente": 513
	    },
	    {
	      "CodigoNombre": "1083 - MORENO GORDILLO MICHELL MILTON HAROLD",
	      "CodigoAgente": 1083
	    },
	    {
	      "CodigoNombre": "2980 - MUÑOZ NAJAR Y ASOCIADOS S.A.C. CONSULTORES Y CORREDORES DE SEG(OF. INDEPE.)",
	      "CodigoAgente": 2980
	    },
	    {
	      "CodigoNombre": "7429 - NOLASCO AGUILAR MANUEL IVAN",
	      "CodigoAgente": 7429
	    },
	    {
	      "CodigoNombre": "7309 - OFICINA LAS PALMERAS  DIRECTO DECESOS",
	      "CodigoAgente": 7309
	    },
	    {
	      "CodigoNombre": "1541 - OLORTEGUI YOMONA HILDEBRANDO",
	      "CodigoAgente": 1541
	    },
	    {
	      "CodigoNombre": "2466 - ORDOÑEZ CAYCHO ANGEL VICENTE",
	      "CodigoAgente": 2466
	    },
	    {
	      "CodigoNombre": "1802 - PACHECO FRANCISCO MARGOT",
	      "CodigoAgente": 1802
	    },
	    {
	      "CodigoNombre": "809 - PALOMINO BECERRA MANUEL E",
	      "CodigoAgente": 809
	    },
	    {
	      "CodigoNombre": "7410 - PASTOR LOPEZ FLOR DE MARIA",
	      "CodigoAgente": 7410
	    },
	    {
	      "CodigoNombre": "7409 - PEREIRA CASTRO MARIA PATRICIA",
	      "CodigoAgente": 7409
	    },
	    {
	      "CodigoNombre": "2798 - POLANCO & ASOCIADOS CORREDORES DE SEGUROS S.A.C",
	      "CodigoAgente": 2798
	    },
	    {
	      "CodigoNombre": "991 - QUISPE MORALES RAMON ARISTIDES",
	      "CodigoAgente": 991
	    },
	    {
	      "CodigoNombre": "7278 - REBOSIO CASALDERREY LUIS ALBERTO",
	      "CodigoAgente": 7278
	    },
	    {
	      "CodigoNombre": "7335 - REVOREDO SALAS JESSY JHESSLEY",
	      "CodigoAgente": 7335
	    },
	    {
	      "CodigoNombre": "1072 - RODRIGUEZ CACERES ALEJANDRO",
	      "CodigoAgente": 1072
	    },
	    {
	      "CodigoNombre": "529 - ROMAN ZAVALA RENE ADOLFO",
	      "CodigoAgente": 529
	    },
	    {
	      "CodigoNombre": "228 - SALAZAR COLOMA ROBERTO ALFREDO",
	      "CodigoAgente": 228
	    },
	    {
	      "CodigoNombre": "1733 - SAMANIEGO CABELLERO ANGEL E",
	      "CodigoAgente": 1733
	    },
	    {
	      "CodigoNombre": "487 - SANCHEZ BELLIDO AURELIO",
	      "CodigoAgente": 487
	    },
	    {
	      "CodigoNombre": "321 - SEGURLOC'S S.A.C. CORREDORES DE SEGUROS",
	      "CodigoAgente": 321
	    },
	    {
	      "CodigoNombre": "1591 - SORIANO PADILLA NINA ROSALIA",
	      "CodigoAgente": 1591
	    },
	    {
	      "CodigoNombre": "416 - SPICER ALVAREZ CESAR AUGUSTO",
	      "CodigoAgente": 416
	    },
	    {
	      "CodigoNombre": "1218 - SUAREZ ESTELA ANTONINO",
	      "CodigoAgente": 1218
	    },
	    {
	      "CodigoNombre": "536 - SUMARRIVA BACA DEMETRIO",
	      "CodigoAgente": 536
	    },
	    {
	      "CodigoNombre": "2585 - TAMARIZ ADRIANZEN WALTER",
	      "CodigoAgente": 2585
	    },
	    {
	      "CodigoNombre": "2572 - TELLEZ POLANCO FIDEL JESUS",
	      "CodigoAgente": 2572
	    },
	    {
	      "CodigoNombre": "1419 - TEVES ESPINOZA MONICA VIOLETA",
	      "CodigoAgente": 1419
	    },
	    {
	      "CodigoNombre": "330 - TIPACTI HERNANDEZ NORMA MARGOT",
	      "CodigoAgente": 330
	    },
	    {
	      "CodigoNombre": "110 - TORERO AGUIRRE MARTIN EDUARDO",
	      "CodigoAgente": 110
	    },
	    {
	      "CodigoNombre": "702 - VALDERRAMA MARES JORGE ALBERTO",
	      "CodigoAgente": 702
	    },
	    {
	      "CodigoNombre": "2965 - VEGA LAVERIO ELISABETH MARLENY",
	      "CodigoAgente": 2965
	    },
	    {
	      "CodigoNombre": "12 - VELASCO VASQUEZ ROBERTO",
	      "CodigoAgente": 12
	    },
	    {
	      "CodigoNombre": "7289 - VILLACORTA CHUNGA ALAIN MARLON",
	      "CodigoAgente": 7289
	    },
	    {
	      "CodigoNombre": "2286 - VILLACORTA MEDINA EDGARD",
	      "CodigoAgente": 2286
	    },
	    {
	      "CodigoNombre": "2079 - VILLAFUERTE FERNANDEZ CARLOS",
	      "CodigoAgente": 2079
	    },
	    {
	      "CodigoNombre": "2201 - VILLALOBOS SALAZAR JESUS ROBERTO",
	      "CodigoAgente": 2201
	    },
	    {
	      "CodigoNombre": "1415 - YON JAUREGUI CARMEN ROSA",
	      "CodigoAgente": 1415
	    },
	    {
	      "CodigoNombre": "2967 - YRRIVAREN TORRES DAVID",
	      "CodigoAgente": 2967
	    },
	    {
	      "CodigoNombre": "7592 - ZAPATA PACHAS PEDRO JOSE",
	      "CodigoAgente": 7592
	    },
	    {
	      "CodigoNombre": "2252 - ZOLID BROKERS CORREDORES DE SEGUROS S.A.C.",
	      "CodigoAgente": 2252
	    }
	  ],
	  "OperationCode": 200,
	  "TypeMessage": "success"
	});
});

router.get("/general/frecuenciapago", function(req, res) {
	return res.json({
	  "Message": "",
	  "Data": [
	    {
	      "CodeResult": 4,
	      "ValueResult": "ANUAL"
	    },
	    {
	      "CodeResult": 1,
	      "ValueResult": "MENSUAL"
	    },
	    {
	      "CodeResult": 3,
	      "ValueResult": "SEMESTRAL"
	    },
	    {
	      "CodeResult": 2,
	      "ValueResult": "TRIMESTRAL"
	    }
	  ],
	  "OperationCode": 200,
	  "TypeMessage": "success"
	});
});

router.get("/Vida/Cobertura/:company/:productCode", function(req, res) {
	return res.json({
	  "Message": "",
	  "Data": {
	    "DuracionSeguro": 99,
	    "ActivoDuracionSeguro": "N",
	    "MinimoDuracionSeguro": 99,
	    "MaximoDuracionSeguro": 99,
	    "DuracionPago": 99,
	    "ActivoDuracionPago": "N",
	    "MinimoDuracionPago": 1,
	    "MaximoDuracionPago": 99,
	    "DuracionAnualidad": 0,
	    "ActivoDuracionAnualidad": "S",
	    "MinimoDuracionAnualidad": 1,
	    "MaximoDuracionAnualidad": 99,
	    "CapitalEstimado1": 5,
	    "MinimoCapitalEstimado1": 5,
	    "MaximoCapitalEstimado1": 7.5,
	    "ActivoCapitalEstimado1": "S",
	    "CapitalEstimado2": 7.5,
	    "MinimoCapitalEstimado2": 5,
	    "MaximoCapitalEstimado2": 7.5,
	    "ActivoCapitalEstimado2": "S",
	    "ActivoCheckCapitalEstimado2": "S",
	    "Cobertura": [
	      {
	        "CodigoCobertura": 5005,
	        "NombreCobertura": "SEGURO ONCOLOGICO",
	        "FactorAsegurado": 0.2,
	        "ValorMinimoAsegurado": 6000,
	        "ValorMaximoAsegurado": 30000,
	        "MarcaPrincipal": "N",
	        "MarcaRentabilidad": "N",
	        "MontoCobertura": 2000,
	        "CapitalCobertura": 0,
	        "SumaSobreMortalidad": 0,
	        "SumaEnfermedad": 0,
	        "SumaProfesion": 0
	      },
	      {
	        "CodigoCobertura": 5004,
	        "NombreCobertura": "MUERTE",
	        "ValorMinimoAsegurado": 10000,
	        "ValorMaximoAsegurado": 500000,
	        "MarcaPrincipal": "S",
	        "MarcaRentabilidad": "S",
	        "MontoCobertura": 10000,
	        "CapitalCobertura": 0,
	        "SumaSobreMortalidad": 0,
	        "SumaEnfermedad": 0,
	        "SumaProfesion": 0
	      },
	      {
	        "CodigoCobertura": 5003,
	        "NombreCobertura": "INVALIDEZ PERMANENTE TOTAL",
	        "MarcaPrincipal": "N",
	        "MarcaRentabilidad": "N",
	        "MontoCobertura": 10000,
	        "CapitalCobertura": 0,
	        "SumaSobreMortalidad": 0,
	        "SumaEnfermedad": 0,
	        "SumaProfesion": 0
	      },
	      {
	        "CodigoCobertura": 5002,
	        "NombreCobertura": "MUERTE ACCIDENTAL",
	        "MarcaPrincipal": "N",
	        "MarcaRentabilidad": "N",
	        "MontoCobertura": 10000,
	        "CapitalCobertura": 0,
	        "SumaSobreMortalidad": 0,
	        "SumaEnfermedad": 0,
	        "SumaProfesion": 0
	      }
	    ]
	  },
	  "OperationCode": 200,
	  "TypeMessage": "success"
	});
});

router.post("/cotizacion/calcularprima/vida/", function(req, res) {
	console.log(req.body);
	return res.json({
	  "Message": "",
	  "Data": [
	    {
	      "CodigoCobertura": 5004,
	      "NombreCobertura": "MUERTE",
	      "ValorMinimoAsegurado": 254514.16,
	      "ValorMaximoAsegurado": 500000.0,
	      "MarcaPrincipal": "S",
	      "MarcaRentabilidad": "N",
	      "MontoCobertura": 254514.16,
	      "CapitalCobertura": 0.0,
	      "SumaSobreMortalidad": 0.0,
	      "SumaEnfermedad": 0.0,
	      "SumaProfesion": 0.0
	    },
	    {
	      "CodigoCobertura": 5003,
	      "NombreCobertura": "INVALIDEZ PERMANENTE TOTAL",
	      "MarcaPrincipal": "N",
	      "MarcaRentabilidad": "N",
	      "MontoCobertura": 254514.16,
	      "CapitalCobertura": 0.0,
	      "SumaSobreMortalidad": 0.0,
	      "SumaEnfermedad": 0.0,
	      "SumaProfesion": 0.0
	    },
	    {
	      "CodigoCobertura": 5002,
	      "NombreCobertura": "MUERTE ACCIDENTAL",
	      "MarcaPrincipal": "N",
	      "MarcaRentabilidad": "N",
	      "MontoCobertura": 254514.16,
	      "CapitalCobertura": 0.0,
	      "SumaSobreMortalidad": 0.0,
	      "SumaEnfermedad": 0.0,
	      "SumaProfesion": 0.0
	    }
	  ]
	});
});

router.post("/cotizacion/calcular/vida", function(req, res) {
	console.log(req.body);
	return res.json({
	  "Message": "",
	  "Data": {
	    "Producto": {
	      "CodigoProducto": 60218,
	      "CodigoModalidad": 0,
	      "CodigoFamProducto": 0,
	      "CodigoMoneda": 1,
	      "FlagAnual": 0,
	      "SimboloMoneda": "S/."
	    },
	    "FechaEfecto": "01/03/2017",
	    "FechaEfectoInicial": "01/03/2017",
	    "FechaEfectoVencimiento": "01/03/2027",
	    "DuracionSeguro": 10,
	    "DuracionPago": 10,
	    "DuracionAnualidad": 10,
	    "FormaPago": 4,
	    "FrecuenciaPago": 0,
	    "Asegurado": {
	      "Nombre": "JKHNK",
	      "TipoDocumento": "DNI",
	      "NumeroDocumento": "12345678",
	      "ApellidoPaterno": "JKNJ",
	      "ApellidoMaterno": "NJ",
	      "FechaNacimiento": "27/01/1969",
	      "Sexo": "0",
	      "NumeroCotizacion": "0",
	      "Profesion": {},
	      "Ocupacion": {}
	    },
	    "Contratante": {
	      "Nombre": "JKHNK",
	      "TipoDocumento": "DNI",
	      "NumeroDocumento": "12345678",
	      "ApellidoPaterno": "JKNJ",
	      "ApellidoMaterno": "NJ",
	      "FechaNacimiento": "27/01/1969",
	      "TelefonoCasa": "970000123",
	      "Sexo": "0",
	      "NumeroCotizacion": "0",
	      "Profesion": {},
	      "Ocupacion": {}
	    },
	    "Coberturas": [
	      {
	        "CodigoCobertura": 5004,
	        "MarcaPrincipal": "S",
	        "MontoCobertura": 25000.0,
	        "CapitalCobertura": 0.0,
	        "SumaSobreMortalidad": 0.0,
	        "SumaEnfermedad": 0.0,
	        "SumaProfesion": 0.0,
	        "chkSeleccionCobertura": "S"
	      }
	    ],
	    "mcaEmpleado": 0,
	    "CapitalEstimado": 0.0,
	    "CapitalEstimado1": 0.0,
	    "CapitalEstimado2": 0.0,
	    "CapitalGarantizado": 7355.1,
	    "CapitalGarantizado1": 7355.1,
	    "CapitalGarantizado2": 7355.1,
	    "CapitalVidaEstimado": 0.0,
	    "CapitalVidaEstimado1": 0.0,
	    "CapitalVidaEstimado2": 0.0,
	    "CapitalCasoVida": "0",
	    "TipoCambio": 3.272,
	    "DescuentoEmpleado": 0.0,
	    "PrimaPrincipal": 735.51,
	    "PrimaComplementaria": 0.0,
	    "CobranzaDomicilio": 0.0,
	    "IgvFactura": 0.0,
	    "PrimaAnual": 735.51,
	    "PrimaInicialAnual": 735.51,
	    "PrimaInicialSemestral": 375.11,
	    "PrimaInicialTrimestral": 191.23,
	    "PrimaInicialMensual": 64.97,
	    "Corridas": [
	      {
	        "Periodo": 1,
	        "PrimaPrincipal": 735.51,
	        "PrimaComplementaria": 0.0,
	        "TotalPrima": 735.51,
	        "CapitalGarantizado": 25000.0,
	        "CapitalEstimado1": 0.0,
	        "CapitalEstimado2": 0.0,
	        "RescateGarantizado": 0.0,
	        "RescateEstimado1": 0.0,
	        "RescateEstimado2": 0.0
	      },
	      {
	        "Periodo": 2,
	        "PrimaPrincipal": 735.51,
	        "PrimaComplementaria": 0.0,
	        "TotalPrima": 735.51,
	        "CapitalGarantizado": 25000.0,
	        "CapitalEstimado1": 0.0,
	        "CapitalEstimado2": 0.0,
	        "RescateGarantizado": 0.0,
	        "RescateEstimado1": 0.0,
	        "RescateEstimado2": 0.0
	      },
	      {
	        "Periodo": 3,
	        "PrimaPrincipal": 735.51,
	        "PrimaComplementaria": 0.0,
	        "TotalPrima": 735.51,
	        "CapitalGarantizado": 25000.0,
	        "CapitalEstimado1": 0.0,
	        "CapitalEstimado2": 0.0,
	        "RescateGarantizado": 0.0,
	        "RescateEstimado1": 0.0,
	        "RescateEstimado2": 0.0
	      },
	      {
	        "Periodo": 4,
	        "PrimaPrincipal": 735.51,
	        "PrimaComplementaria": 0.0,
	        "TotalPrima": 735.51,
	        "CapitalGarantizado": 25000.0,
	        "CapitalEstimado1": 0.0,
	        "CapitalEstimado2": 0.0,
	        "RescateGarantizado": 0.0,
	        "RescateEstimado1": 0.0,
	        "RescateEstimado2": 0.0
	      },
	      {
	        "Periodo": 5,
	        "PrimaPrincipal": 735.51,
	        "PrimaComplementaria": 0.0,
	        "TotalPrima": 735.51,
	        "CapitalGarantizado": 25000.0,
	        "CapitalEstimado1": 0.0,
	        "CapitalEstimado2": 0.0,
	        "RescateGarantizado": 0.0,
	        "RescateEstimado1": 0.0,
	        "RescateEstimado2": 0.0
	      },
	      {
	        "Periodo": 6,
	        "PrimaPrincipal": 735.51,
	        "PrimaComplementaria": 0.0,
	        "TotalPrima": 735.51,
	        "CapitalGarantizado": 25000.0,
	        "CapitalEstimado1": 0.0,
	        "CapitalEstimado2": 0.0,
	        "RescateGarantizado": 0.0,
	        "RescateEstimado1": 0.0,
	        "RescateEstimado2": 0.0
	      },
	      {
	        "Periodo": 7,
	        "PrimaPrincipal": 735.51,
	        "PrimaComplementaria": 0.0,
	        "TotalPrima": 735.51,
	        "CapitalGarantizado": 25000.0,
	        "CapitalEstimado1": 0.0,
	        "CapitalEstimado2": 0.0,
	        "RescateGarantizado": 0.0,
	        "RescateEstimado1": 0.0,
	        "RescateEstimado2": 0.0
	      },
	      {
	        "Periodo": 8,
	        "PrimaPrincipal": 735.51,
	        "PrimaComplementaria": 0.0,
	        "TotalPrima": 735.51,
	        "CapitalGarantizado": 25000.0,
	        "CapitalEstimado1": 0.0,
	        "CapitalEstimado2": 0.0,
	        "RescateGarantizado": 0.0,
	        "RescateEstimado1": 0.0,
	        "RescateEstimado2": 0.0
	      },
	      {
	        "Periodo": 9,
	        "PrimaPrincipal": 735.51,
	        "PrimaComplementaria": 0.0,
	        "TotalPrima": 735.51,
	        "CapitalGarantizado": 25000.0,
	        "CapitalEstimado1": 0.0,
	        "CapitalEstimado2": 0.0,
	        "RescateGarantizado": 0.0,
	        "RescateEstimado1": 0.0,
	        "RescateEstimado2": 0.0
	      },
	      {
	        "Periodo": 10,
	        "PrimaPrincipal": 735.51,
	        "PrimaComplementaria": 0.0,
	        "TotalPrima": 735.51,
	        "CapitalGarantizado": 25000.0,
	        "CapitalEstimado1": 0.0,
	        "CapitalEstimado2": 0.0,
	        "RescateGarantizado": 0.0,
	        "RescateEstimado1": 0.0,
	        "RescateEstimado2": 0.0
	      }
	    ],
	    "CodigoEstado": 0,
	    "FormaPagoSeguro": 0
	  },
	  "OperationCode": 200,
	  "TypeMessage": "success"
	});
});

router.post("/cotizacion/vida", function(req, res) {
	console.log(req.body);
	return res.json({
	  "Message": "",
	  "Data": {
	    "NumeroCotizacion": 20345,
	    "Producto": {
	      "CodigoProducto": 60120,
	      "CodigoModalidad": 0,
	      "CodigoFamProducto": 0,
	      "CodigoMoneda": 2,
	      "FlagAnual": 0,
	      "CodigoRamo": 601
	    },
	    "FechaEfecto": "01/04/2017",
	    "FechaEfectoInicial": "01/01/0001",
	    "FechaEfectoVencimiento": "01/01/0001",
	    "DuracionSeguro": 6,
	    "DuracionPago": 6,
	    "DuracionAnualidad": 6,
	    "FormaPago": 4,
	    "FrecuenciaPago": 4,
	    "Asegurado": {
	      "Nombre": "JORGEX",
	      "TipoDocumento": "DNI",
	      "NumeroDocumento": "12345678",
	      "ApellidoPaterno": "LEON",
	      "ApellidoMaterno": "EYZAGUIRRE",
	      "FechaNacimiento": "10/10/1985",
	      "TipoPersona": "A",
	      "Sexo": "1",
	      "EstadoCivil": "4"
	    },
	    "Contratante": {
	      "Nombre": "BENJAMIN",
	      "TipoDocumento": "CEX",
	      "NumeroDocumento": "12345678",
	      "ApellidoPaterno": "LEO",
	      "ApellidoMaterno": "EYZAGUIRRE",
	      "FechaNacimiento": "01/01/0001",
	      "TelefonoCasa": "2790224",
	      "TelefonoOficina": "",
	      "TelefonoMovil": "989222288",
	      "TipoPersona": "C"
	    },
	    "Coberturas": [
	      {
	        "CodigoCobertura": 5001,
	        "CapitalCobertura": 2000,
	        "SumaSobreMortalidad": 0,
	        "SumaEnfermedad": 0,
	        "SumaProfesion": 0,
	        "chkSeleccionCobertura": "S"
	      },
	      {
	        "CodigoCobertura": 5003,
	        "CapitalCobertura": 0,
	        "SumaSobreMortalidad": 0,
	        "SumaEnfermedad": 0,
	        "SumaProfesion": 0,
	        "chkSeleccionCobertura": "N"
	      },
	      {
	        "CodigoCobertura": 5002,
	        "CapitalCobertura": 0,
	        "SumaSobreMortalidad": 0,
	        "SumaEnfermedad": 0,
	        "SumaProfesion": 0,
	        "chkSeleccionCobertura": "N"
	      }
	    ],
	    "UsuarioRegistro": "GZAPATA",
	    "MotivoRecargo": "",
	    "mcaEmpleado": 0,
	    "CapitalEstimado1": 5,
	    "CapitalEstimado2": 7.5,
	    "TipoCambio": 3.419,
	    "CapitalGarantizado1": 2000,
	    "CapitalGarantizado2": 2000,
	    "DescuentoEmpleado": 44.4,
	    "PrimaPrincipal": 11.1,
	    "PrimaComplementaria": 22.2,
	    "CobranzaDomicilio": 33.3,
	    "IgvFactura": 55.5,
	    "PrimaAnual": 66.6,
	    "PrimaInicialAnual": 77.7,
	    "PrimaInicialSemestral": 88.8,
	    "PrimaInicialTrimestral": 99.9,
	    "PrimaInicialMensual": 0,
	    "CapitalVidaEstimado1": 0,
	    "CapitalVidaEstimado2": 0,
	    "Corridas": [
	      {
	        "NumeroCotizacion": 20345,
	        "IdFila": 1,
	        "Periodo": 1,
	        "PrimaPrincipal": 356.35,
	        "PrimaComplementaria": 0,
	        "TotalPrima": 356.35,
	        "CapitalGarantizado": 10000,
	        "CapitalEstimado1": 10000,
	        "CapitalEstimado2": 10000,
	        "RescateGarantizado": 0,
	        "RescateEstimado1": 0,
	        "RescateEstimado2": 0
	      },
	      {
	        "NumeroCotizacion": 20345,
	        "IdFila": 2,
	        "Periodo": 1,
	        "PrimaPrincipal": 356.35,
	        "PrimaComplementaria": 0,
	        "TotalPrima": 356.35,
	        "CapitalGarantizado": 10000,
	        "CapitalEstimado1": 10000,
	        "CapitalEstimado2": 10000,
	        "RescateGarantizado": 0,
	        "RescateEstimado1": 0,
	        "RescateEstimado2": 0
	      }
	    ]
	  },
	  "OperationCode": 200,
	  "TypeMessage": "success"
	});
});

router.get("/cotizacion/vida/:codigo", function(req, res) {

	if (req.params.codigo == 20393) {
		return res.json({
		  "Message": "",
		  "Data": {
		    "NumeroCotizacion": 20393,
		    "Producto": {
		      "CodigoProducto": 60422,
		      "NombreProducto": "US$ MUJER INDEPEN. (P.VITAL)",
		      "CodigoModalidad": 0,
		      "CodigoFamProducto": 0,
		      "CodigoMoneda": 2,
		      "FlagAnual": 0,
		      "CodigoRamo": 604
		    },
		    "FechaEfecto": "21/02/2017",
		    "FechaEfectoInicial": "01/01/0001",
		    "FechaEfectoVencimiento": "01/01/0001",
		    "DuracionSeguro": 99,
		    "DuracionPago": 99,
		    "DuracionAnualidad": 1,
		    "FormaPago": 4,
		    "FrecuenciaPago": 4,
		    "NombreFrecuenciaPago": "ANUAL",
		    "Asegurado": {
		      "Nombre": "HGUHGHG",
		      "TipoDocumento": "DNI",
		      "NumeroDocumento": "65656565",
		      "ApellidoPaterno": "GUHGUHGUH",
		      "ApellidoMaterno": "HGHUGUG",
		      "FechaNacimiento": "06/06/1992",
		      "TelefonoCasa": "3432423423",
		      "TelefonoOficina": "2343243232",
		      "TelefonoMovil": "4343242343",
		      "TipoPersona": "A",
		      "Sexo": "0",
		      "EstadoCivil": "3",
		      "Ubigeo": {},
		      "Agente": {
		        "FechaNacimiento": "01/01/0001",
		        "ImporteAplicarMapfreDolar": 0.0,
		        "CodigoEstadoCivil": 0
		      },
		      "NumeroCotizacion": "0"
		    },
		    "Contratante": {
		      "Nombre": "HGUHGHG",
		      "TipoDocumento": "DNI",
		      "NumeroDocumento": "65656565",
		      "ApellidoPaterno": "GUHGUHGUH",
		      "ApellidoMaterno": "HGHUGUG",
		      "FechaNacimiento": "06/06/1992",
		      "TelefonoCasa": "3432423423",
		      "TelefonoOficina": "2343243232",
		      "TelefonoMovil": "4343242343",
		      "TipoPersona": "C",
		      "Sexo": "0",
		      "EstadoCivil": "3",
		      "Ubigeo": {},
		      "Agente": {
		        "FechaNacimiento": "01/01/0001",
		        "ImporteAplicarMapfreDolar": 0.0,
		        "CodigoEstadoCivil": 0
		      },
		      "NumeroCotizacion": "0"
		    },
		    "Coberturas": [
		      {
		        "CodigoCobertura": 5002,
		        "CapitalCobertura": 0.0,
		        "SumaSobreMortalidad": 0.0,
		        "SumaEnfermedad": 0.0,
		        "SumaProfesion": 0.0,
		        "chkSeleccionCobertura": "N"
		      },
		      {
		        "CodigoCobertura": 5003,
		        "CapitalCobertura": 0.0,
		        "SumaSobreMortalidad": 0.0,
		        "SumaEnfermedad": 0.0,
		        "SumaProfesion": 0.0,
		        "chkSeleccionCobertura": "N"
		      },
		      {
		        "CodigoCobertura": 5004,
		        "CapitalCobertura": 10000.0,
		        "SumaSobreMortalidad": 0.0,
		        "SumaEnfermedad": 0.0,
		        "SumaProfesion": 0.0,
		        "chkSeleccionCobertura": "S"
		      },
		      {
		        "CodigoCobertura": 5005,
		        "CapitalCobertura": 0.0,
		        "SumaSobreMortalidad": 0.0,
		        "SumaEnfermedad": 0.0,
		        "SumaProfesion": 0.0,
		        "chkSeleccionCobertura": "N"
		      }
		    ],
		    "UsuarioRegistro": "FULANO",
		    "MotivoRecargo": "",
		    "mcaEmpleado": 1,
		    "CapitalEstimado": 0.0,
		    "CapitalEstimado1": 5.0,
		    "CapitalEstimado2": 7.5,
		    "CapitalGarantizado": 0.0,
		    "CapitalGarantizado1": 0.0,
		    "CapitalGarantizado2": 0.0,
		    "CapitalVidaEstimado": 0.0,
		    "CapitalVidaEstimado1": 0.0,
		    "CapitalVidaEstimado2": 0.0,
		    "TipoCambio": 3.272,
		    "DescuentoEmpleado": 8.20444444444445,
		    "PrimaPrincipal": 73.84,
		    "PrimaComplementaria": 0.0,
		    "CobranzaDomicilio": 0.0,
		    "IgvFactura": 0.0,
		    "PrimaAnual": 73.84,
		    "PrimaInicialAnual": 6.15333333333333,
		    "PrimaInicialSemestral": 36.92,
		    "PrimaInicialTrimestral": 18.46,
		    "PrimaInicialMensual": 0.0,
		    "Corridas": [
		      {
		        "NumeroCotizacion": 20393,
		        "IdFila": 1,
		        "Periodo": 1,
		        "PrimaPrincipal": 73.84,
		        "PrimaComplementaria": 0.0,
		        "TotalPrima": 73.84,
		        "CapitalGarantizado": 10000.0,
		        "CapitalEstimado1": 10000.0,
		        "CapitalEstimado2": 10000.0,
		        "RescateGarantizado": 0.0,
		        "RescateEstimado1": 0.0,
		        "RescateEstimado2": 0.0
		      }
		    ],
		    "Agente": {
		      "CodigoAgente": 104,
		      "FechaNacimiento": "01/01/0001",
		      "ImporteAplicarMapfreDolar": 0.0,
		      "Telefono": "4425983",
		      "CorreoElectronico": "mnovoa@mn.com.pe;echuqui@mn.com.pe",
		      "NombreCompleto": "",
		      "CodigoEstadoCivil": 0
		    }
		  },
		  "OperationCode": 200,
		  "TypeMessage": "success"
		});
	} else if (req.params.codigo == 20345) {
		return res.json({
		  "Message": "",
		  "Data": {
		    "NumeroCotizacion": 20345,
		    "Producto": {
		      "CodigoProducto": 60120,
		      "CodigoModalidad": 0,
		      "CodigoFamProducto": 0,
		      "CodigoMoneda": 2,
		      "FlagAnual": 0,
		      "CodigoRamo": 601
		    },
		    "FechaEfecto": "01/04/2017",
		    "FechaEfectoInicial": "01/01/0001",
		    "FechaEfectoVencimiento": "01/01/0001",
		    "DuracionSeguro": 6,
		    "DuracionPago": 6,
		    "DuracionAnualidad": 6,
		    "FormaPago": 4,
		    "FrecuenciaPago": 4,
		    "Asegurado": {
		      "Nombre": "JORGEX",
		      "TipoDocumento": "DNI",
		      "NumeroDocumento": "12345678",
		      "ApellidoPaterno": "LEON",
		      "ApellidoMaterno": "EYZAGUIRRE",
		      "FechaNacimiento": "10/10/1985",
		      "TelefonoCasa": "",
		      "TelefonoOficina": "",
		      "TelefonoMovil": "",
		      "TipoPersona": "A",
		      "Sexo": "1",
		      "EstadoCivil": "4"
		    },
		    "Contratante": {
		      "Nombre": "BENJAMIN",
		      "TipoDocumento": "CEX",
		      "NumeroDocumento": "12345678",
		      "ApellidoPaterno": "LEO",
		      "ApellidoMaterno": "EYZAGUIRRE",
		      "FechaNacimiento": "01/01/0001",
		      "TelefonoCasa": "2790224",
		      "TelefonoOficina": "",
		      "TelefonoMovil": "9892222",
		      "TipoPersona": "C",
		      "Sexo": "",
		      "EstadoCivil": ""
		    },
		    "Coberturas": [
		      {
		        "CodigoCobertura": 5001,
		        "CapitalCobertura": 2000,
		        "SumaSobreMortalidad": 0,
		        "SumaEnfermedad": 0,
		        "SumaProfesion": 0,
		        "chkSeleccionCobertura": "S"
		      },
		      {
		        "CodigoCobertura": 5002,
		        "CapitalCobertura": 0,
		        "SumaSobreMortalidad": 0,
		        "SumaEnfermedad": 0,
		        "SumaProfesion": 0,
		        "chkSeleccionCobertura": "N"
		      },
		      {
		        "CodigoCobertura": 5003,
		        "CapitalCobertura": 0,
		        "SumaSobreMortalidad": 0,
		        "SumaEnfermedad": 0,
		        "SumaProfesion": 0,
		        "chkSeleccionCobertura": "N"
		      }
		    ],
		    "UsuarioRegistro": "GZAPATA",
		    "MotivoRecargo": "",
		    "mcaEmpleado": 0,
		    "CapitalEstimado1": 5,
		    "CapitalEstimado2": 7.5,
		    "TipoCambio": 3.419,
		    "CapitalGarantizado1": 2000,
		    "CapitalGarantizado2": 0,
		    "DescuentoEmpleado": 44.4,
		    "PrimaPrincipal": 11.1,
		    "PrimaComplementaria": 22.2,
		    "CobranzaDomicilio": 33.3,
		    "IgvFactura": 55.5,
		    "PrimaAnual": 66.6,
		    "PrimaInicialAnual": 77.7,
		    "PrimaInicialSemestral": 88.8,
		    "PrimaInicialTrimestral": 99.9,
		    "PrimaInicialMensual": 0,
		    "CapitalVidaEstimado1": 0,
		    "CapitalVidaEstimado2": 0,
		    "Corridas": [
		      {
		        "NumeroCotizacion": 20345,
		        "IdFila": 1,
		        "Periodo": 1,
		        "PrimaPrincipal": 356.35,
		        "PrimaComplementaria": 0,
		        "TotalPrima": 356.35,
		        "CapitalGarantizado": 10000,
		        "CapitalEstimado1": 10000,
		        "CapitalEstimado2": 10000,
		        "RescateGarantizado": 0,
		        "RescateEstimado1": 0,
		        "RescateEstimado2": 0
		      },
		      {
		        "NumeroCotizacion": 20345,
		        "IdFila": 2,
		        "Periodo": 1,
		        "PrimaPrincipal": 356.35,
		        "PrimaComplementaria": 0,
		        "TotalPrima": 356.35,
		        "CapitalGarantizado": 10000,
		        "CapitalEstimado1": 10000,
		        "CapitalEstimado2": 10000,
		        "RescateGarantizado": 0,
		        "RescateEstimado1": 0,
		        "RescateEstimado2": 0
		      }
		    ]
		  },
		  "OperationCode": 200,
		  "TypeMessage": "success"
		});
	} else {
		return res.json({
		  "Message": "",
		  "Data": {
		    "NumeroCotizacion": req.params.codigo,
		    "Producto": {
		      "CodigoProducto": 60120,
		      "CodigoModalidad": 0,
		      "CodigoFamProducto": 0,
		      "CodigoMoneda": 2,
		      "FlagAnual": 0,
		      "CodigoRamo": 601
		    },
		    "FechaEfecto": "01/04/2017",
		    "FechaEfectoInicial": "01/01/0001",
		    "FechaEfectoVencimiento": "01/01/0001",
		    "DuracionSeguro": 6,
		    "DuracionPago": 6,
		    "DuracionAnualidad": 6,
		    "FormaPago": 4,
		    "FrecuenciaPago": 4,
		    "Asegurado": {
		      "Nombre": "JORGEX",
		      "TipoDocumento": "DNI",
		      "NumeroDocumento": "12345678",
		      "ApellidoPaterno": "LEON",
		      "ApellidoMaterno": "EYZAGUIRRE",
		      "FechaNacimiento": "10/10/1985",
		      "TelefonoCasa": "",
		      "TelefonoOficina": "",
		      "TelefonoMovil": "",
		      "TipoPersona": "A",
		      "Sexo": "1",
		      "EstadoCivil": "4"
		    },
		    "Contratante": {
		      "Nombre": "BENJAMIN",
		      "TipoDocumento": "CEX",
		      "NumeroDocumento": "12345678",
		      "ApellidoPaterno": "LEO",
		      "ApellidoMaterno": "EYZAGUIRRE",
		      "FechaNacimiento": "01/01/0001",
		      "TelefonoCasa": "2790224",
		      "TelefonoOficina": "",
		      "TelefonoMovil": "9892222",
		      "TipoPersona": "C",
		      "Sexo": "",
		      "EstadoCivil": ""
		    },
		    "Coberturas": [
		      {
		        "CodigoCobertura": 5001,
		        "CapitalCobertura": 2000,
		        "SumaSobreMortalidad": 0,
		        "SumaEnfermedad": 0,
		        "SumaProfesion": 0,
		        "chkSeleccionCobertura": "S"
		      },
		      {
		        "CodigoCobertura": 5002,
		        "CapitalCobertura": 0,
		        "SumaSobreMortalidad": 0,
		        "SumaEnfermedad": 0,
		        "SumaProfesion": 0,
		        "chkSeleccionCobertura": "N"
		      },
		      {
		        "CodigoCobertura": 5003,
		        "CapitalCobertura": 0,
		        "SumaSobreMortalidad": 0,
		        "SumaEnfermedad": 0,
		        "SumaProfesion": 0,
		        "chkSeleccionCobertura": "N"
		      }
		    ],
		    "UsuarioRegistro": "GZAPATA",
		    "MotivoRecargo": "",
		    "mcaEmpleado": 0,
		    "CapitalEstimado1": 5,
		    "CapitalEstimado2": 7.5,
		    "TipoCambio": 3.419,
		    "CapitalGarantizado1": 2000,
		    "CapitalGarantizado2": 0,
		    "DescuentoEmpleado": 44.4,
		    "PrimaPrincipal": 11.1,
		    "PrimaComplementaria": 22.2,
		    "CobranzaDomicilio": 33.3,
		    "IgvFactura": 55.5,
		    "PrimaAnual": 66.6,
		    "PrimaInicialAnual": 77.7,
		    "PrimaInicialSemestral": 88.8,
		    "PrimaInicialTrimestral": 99.9,
		    "PrimaInicialMensual": 0,
		    "CapitalVidaEstimado1": 0,
		    "CapitalVidaEstimado2": 0,
		    "Corridas": [
		      {
		        "NumeroCotizacion": 20345,
		        "IdFila": 1,
		        "Periodo": 1,
		        "PrimaPrincipal": 356.35,
		        "PrimaComplementaria": 0,
		        "TotalPrima": 356.35,
		        "CapitalGarantizado": 10000,
		        "CapitalEstimado1": 10000,
		        "CapitalEstimado2": 10000,
		        "RescateGarantizado": 0,
		        "RescateEstimado1": 0,
		        "RescateEstimado2": 0
		      },
		      {
		        "NumeroCotizacion": 20345,
		        "IdFila": 2,
		        "Periodo": 1,
		        "PrimaPrincipal": 356.35,
		        "PrimaComplementaria": 0,
		        "TotalPrima": 356.35,
		        "CapitalGarantizado": 10000,
		        "CapitalEstimado1": 10000,
		        "CapitalEstimado2": 10000,
		        "RescateGarantizado": 0,
		        "RescateEstimado1": 0,
		        "RescateEstimado2": 0
		      }
		    ]
		  },
		  "OperationCode": 200,
		  "TypeMessage": "success"
		});
	}
});

module.exports = router;