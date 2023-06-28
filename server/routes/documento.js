'use strict';
var express = require('express');
var router = express.Router();

//vehiculos cotizacion
router.get('/documento/documentoBuscar/1/75844/301',function(req, res){
  console.log(req.body);
  res.json(
		{
		  "Message": "",
		  "Data": {
		    "NumeroPoliza": "",
		    "NumeroDocumento": 75844,
		    "NumeroTicket": "",
		    "FechaRegistro": "25/08/2016 16:44:43",
		    "IpDocumento": "::1",
		    "CodigoUsuarioRED": "Usuario",
		    "EstadoEmision": "",
		    "RutaDocumento": "",
		    "FlagDocumento": "",
		    "CodigoProceso": 1,
		    "CodigoProducto": 5,
		    "NombreProducto": "AUTOS 0 KM.",
		    "NumeroPlaca": "",
		    "CodigoMoneda": "",
		    "CodigoCia": 1,
		    "CodigoAgente": 9808,
		    "McaAsegNuevo": "",
		    "NumeroRecibo": "",
		    "MarcaAsistencia": "N",
		    "NumeroPolizaRel": "",
		    "NumeroReciboRel": "",
		    "IGV": 18,
		    "TipoCambio": 1,
		    "DsctoPorComision": -4,
		    "TotalDscto": -4,
		    "TuComision": 5,
		    "PrimaNeta": 653,
		    "NombreAgente": "DIRECTO . ORGANIZACION TERRITORIAL",
		    "CodigoRamo": 301,
		    "Ubigeo": {
		      "NombreDistrito": "MIRAFLORES",
		      "CodigoDistrito": "22",
		      "NombreDepartamento": "LIMA",
		      "NombreProvincia": "LIMA",
		      "CodigoDepartamento": "15",
		      "CodigoProvincia": "128"
		    },
		    "Vehiculo": {
		      "CodigoUso": "8",
		      "CodigoCategoria": 2,
		      "CodigoMarca": "15",
		      "CodigoModelo": "23",
		      "CodigoSubModelo": "1",
		      "NombreUso": "PARTICULAR",
		      "NombreMarca": "HYUNDAI",
		      "NombreModelo": "ELANTRA",
		      "NombreSubModelo": "1.6",
		      "AnioFabricacion": "2016",
		      "MCANUEVO": "S",
		      "MCAGPS": "S",
		      "ProductoVehiculo": {},
		      "AccesorioMusical": [],
		      "CodigoTipoVehiculo": 1,
		      "NombreTipoVehiculo": "Automovil",
		      "NombreCategoria": "MEDIANO RIESGO",
		      "ValorComercial": 19990
		    },
		    "DsctoAutomovil": {
		      "DsctoComercial": {
		        "DsctoMinimo": 10,
		        "DsctoMaximo": 90
		      }
		    },
		    "Contratante": {
		      "Agente": {},
		      "Poliza": [],
		      "Nombre": "ARTURO VALERIO",
		      "ApellidoPaterno": "KUAN-VENG",
		      "ImporteMapfreDolar": 94,
		      "MCAMapfreDolar": "S",
		      "Ubigeo": {},
		      "ActividadEconomica": {},
		      "Profesion": {}
		    },
		    "PolizaGrupo": ""
		  },
		  "OperationCode": 200,
		  "TypeMessage": "success"
		}
  	);
});

router.get('/documento/documentoBuscar/1//301',function(req, res){
  console.log(req.body);
  res.json(
		{
		  "Message": "",
		  "Data": {
		    "NumeroPoliza": "",
		    "NumeroDocumento": 75844,
		    "NumeroTicket": "",
		    "FechaRegistro": "25/08/2016 16:44:43",
		    "IpDocumento": "::1",
		    "CodigoUsuarioRED": "Usuario",
		    "EstadoEmision": "",
		    "RutaDocumento": "",
		    "FlagDocumento": "",
		    "CodigoProceso": 1,
		    "CodigoProducto": 5,
		    "NombreProducto": "AUTOS 0 KM.",
		    "NumeroPlaca": "",
		    "CodigoMoneda": "",
		    "CodigoCia": 1,
		    "CodigoAgente": 9808,
		    "McaAsegNuevo": "",
		    "NumeroRecibo": "",
		    "MarcaAsistencia": "N",
		    "NumeroPolizaRel": "",
		    "NumeroReciboRel": "",
		    "IGV": 18,
		    "TipoCambio": 1,
		    "DsctoPorComision": -4,
		    "TotalDscto": -4,
		    "TuComision": 5,
		    "PrimaNeta": 653,
		    "NombreAgente": "DIRECTO . ORGANIZACION TERRITORIAL",
		    "CodigoRamo": 301,
		    "Ubigeo": {
		      "NombreDistrito": "MIRAFLORES",
		      "CodigoDistrito": "22",
		      "NombreDepartamento": "LIMA",
		      "NombreProvincia": "LIMA",
		      "CodigoDepartamento": "15",
		      "CodigoProvincia": "128"
		    },
		    "Vehiculo": {
		      "CodigoUso": "8",
		      "CodigoCategoria": 2,
		      "CodigoMarca": "15",
		      "CodigoModelo": "23",
		      "CodigoSubModelo": "1",
		      "NombreUso": "PARTICULAR",
		      "NombreMarca": "HYUNDAI",
		      "NombreModelo": "ELANTRA",
		      "NombreSubModelo": "1.6",
		      "AnioFabricacion": "2016",
		      "MCANUEVO": "S",
		      "MCAGPS": "S",
		      "ProductoVehiculo": {},
		      "AccesorioMusical": [],
		      "CodigoTipoVehiculo": 1,
		      "NombreTipoVehiculo": "Automovil",
		      "NombreCategoria": "MEDIANO RIESGO",
		      "ValorComercial": 19990
		    },
		    "DsctoAutomovil": {
		      "DsctoComercial": {
		        "DsctoMinimo": 10,
		        "DsctoMaximo": 90
		      }
		    },
		    "Contratante": {
		      "Agente": {},
		      "Poliza": [],
		      "Nombre": "ARTURO VALERIO",
		      "ApellidoPaterno": "KUAN-VENG",
		      "ImporteMapfreDolar": 94,
		      "MCAMapfreDolar": "S",
		      "Ubigeo": {},
		      "ActividadEconomica": {},
		      "Profesion": {}
		    },
		    "PolizaGrupo": ""
		  },
		  "OperationCode": 200,
		  "TypeMessage": "success"
		}
  	);
});

// router.get('/documento/documentoBuscar/1/75843/301',function(req, res){
//   console.log(req.body);
//   res.json(
// 		{
// 		  "Message": "",
// 		  "Data": {
// 		    "NumeroPoliza": "",
// 		    "NumeroDocumento": 75843,
// 		    "NumeroTicket": "",
// 		    "FechaRegistro": "25/08/2016 16:44:43",
// 		    "IpDocumento": "::1",
// 		    "CodigoUsuarioRED": "Usuario",
// 		    "EstadoEmision": "",
// 		    "RutaDocumento": "",
// 		    "FlagDocumento": "",
// 		    "CodigoProceso": 1,
// 		    "CodigoProducto": 5,
// 		    "NombreProducto": "AUTOS 10 KM.",
// 		    "NumeroPlaca": "",
// 		    "CodigoMoneda": "",
// 		    "CodigoCia": 1,
// 		    "CodigoAgente": 9808,
// 		    "McaAsegNuevo": "",
// 		    "NumeroRecibo": "",
// 		    "MarcaAsistencia": "N",
// 		    "NumeroPolizaRel": "",
// 		    "NumeroReciboRel": "",
// 		    "IGV": 18,
// 		    "TipoCambio": 1,
// 		    "DsctoPorComision": -4,
// 		    "TotalDscto": -4,
// 		    "TuComision": 5,
// 		    "PrimaNeta": 653,
// 		    "NombreAgente": "DIRECTO . ORGANIZACION TERRITORIAL",
// 		    "CodigoRamo": 301,
// 		    "Ubigeo": {
// 		      "NombreDistrito": "MIRAFLORES",
// 		      "CodigoDistrito": "22",
// 		      "NombreDepartamento": "LIMA",
// 		      "NombreProvincia": "LIMA",
// 		      "CodigoDepartamento": "15",
// 		      "CodigoProvincia": "128"
// 		    },
// 		    "Vehiculo": {
// 		      "CodigoUso": "8",
// 		      "CodigoCategoria": 2,
// 		      "CodigoMarca": "15",
// 		      "CodigoModelo": "23",
// 		      "CodigoSubModelo": "1",
// 		      "NombreUso": "PARTICULAR",
// 		      "NombreMarca": "HYUNDAI",
// 		      "NombreModelo": "ELANTRA",
// 		      "NombreSubModelo": "1.6",
// 		      "AnioFabricacion": "2016",
// 		      "MCANUEVO": "S",
// 		      "MCAGPS": "S",
// 		      "ProductoVehiculo": {},
// 		      "AccesorioMusical": [],
// 		      "CodigoTipoVehiculo": 1,
// 		      "NombreTipoVehiculo": "Automovil",
// 		      "NombreCategoria": "MEDIANO RIESGO",
// 		      "ValorComercial": 19990
// 		    },
// 		    "DsctoAutomovil": {
// 		      "DsctoComercial": {
// 		        "DsctoMinimo": 10,
// 		        "DsctoMaximo": 90
// 		      }
// 		    },
// 		    "Contratante": {
// 		      "Agente": {},
// 		      "Poliza": [],
// 		      "Nombre": "ARTURO VALERIO",
// 		      "ApellidoPaterno": "KUAN-VENG",
// 		      "ImporteMapfreDolar": 94,
// 		      "MCAMapfreDolar": "S",
// 		      "Ubigeo": {},
// 		      "ActividadEconomica": {},
// 		      "Profesion": {}
// 		    },
// 		    "PolizaGrupo": ""
// 		  },
// 		  "OperationCode": 200,
// 		  "TypeMessage": "success"
// 		}
//   	);
// });

router.get('/documento/documentoBuscar/1/75843/301',function(req, res){
  console.log(req.body);
  res.json(
		{
		  "Message": "",
		  "Data": {
		    "NumeroPoliza": "",
		    "NumeroDocumento": 75843,
		    "NumeroTicket": "",
		    "FechaRegistro": "25/08/2016 16:44:43",
		    "IpDocumento": "::1",
		    "CodigoUsuarioRED": "Usuario",
		    "EstadoEmision": "",
		    "RutaDocumento": "",
		    "FlagDocumento": "",
		    "CodigoProceso": 1,
		    "CodigoProducto": 5,
		    "NombreProducto": "DORADA VIP",
		    "NumeroPlaca": "",
		    "CodigoMoneda": "",
		    "CodigoCia": 1,
		    "CodigoAgente": 9808,
		    "McaAsegNuevo": "",
		    "NumeroRecibo": "",
		    "MarcaAsistencia": "N",
		    "NumeroPolizaRel": "",
		    "NumeroReciboRel": "",
		    "IGV": 18,
		    "TipoCambio": 1,
		    "DsctoPorComision": -1,
		    "TotalDscto": -1,
		    "TuComision": 10,
		    "PrimaNeta": 2053,
		    "NombreAgente": "DIRECTO . ORGANIZACION TERRITORIAL",
		    "CodigoRamo": 301,
		    "Ubigeo": {
		      "NombreDistrito": "MIRAFLORES",
		      "CodigoDistrito": "22",
		      "NombreDepartamento": "LIMA",
		      "NombreProvincia": "LIMA",
		      "CodigoDepartamento": "15",
		      "CodigoProvincia": "128"
		    },
		    "Vehiculo": {
		      "CodigoUso": "8",
		      "CodigoCategoria": 2,
		      "CodigoMarca": "15",
		      "CodigoModelo": "23",
		      "CodigoSubModelo": "1",
		      "NombreUso": "PARTICULAR",
		      "NombreMarca": "FIAT",
		      "NombreModelo": "FIESTA",
		      "NombreSubModelo": "GT",
		      "AnioFabricacion": "2010",
		      "MCANUEVO": "N",
		      "MCAGPS": "S",
		      "ProductoVehiculo": {},
		      "AccesorioMusical": [],
		      "CodigoTipoVehiculo": 1,
		      "NombreTipoVehiculo": "Automovil",
		      "NombreCategoria": "MEDIANO RIESGO",
		      "ValorComercial": 19990
		    },
		    "DsctoAutomovil": {
		      "DsctoComercial": {
		        "DsctoMinimo": 10,
		        "DsctoMaximo": 90
		      }
		    },
		    "Contratante": {
		      "Agente": {},
		      "Poliza": [],
		      "Nombre": "ARTURO VALERIO",
		      "ApellidoPaterno": "KUAN-VENG",
		      "ImporteMapfreDolar": 94,
		      "MCAMapfreDolar": "S",
		      "Ubigeo": {},
		      "ActividadEconomica": {},
		      "Profesion": {}
		    },
		    "PolizaGrupo": ""
		  },
		  "OperationCode": 200,
		  "TypeMessage": "success"
		}
  	);
});
router.post('/reporte/emisa/cotizacion',function(req, res){
  console.log(req.body);
  res.json(

  	);
});
module.exports = router;