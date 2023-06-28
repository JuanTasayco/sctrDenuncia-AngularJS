/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();

router.get('/poliza/transporte/grupopoliza/:codigoRamo/:codigoAgente/:codigoRubro',function(req, res){
  var codigoRamo = req.params.codigoRamo;
  var codigoAgente = req.params.codigoAgente;
  var codigoRubro = req.params.codigoRubro;

  var response = {
    "Message": "",
    "Data": [],
    "OperationCode": 200,
    "TypeMessage": "success"
  }
  for (var i = 10; i >= 0; i--) {
    response.Data.push({
      "CodigoCompania": 1,
      "NumeroPolizaGrupo": "27126" + i,
      "NombrePolizaGrupo": "MAPFRE PERU COMPA?IA DE SEGURO",
      "CodigoTipoTransporte": "M",
      "NombreTipoTransporte": "MARITIMO",
      "TasaMinima": (i % 2) == 0 ? 0.15 : 0.2,
      "TasaMaxima": (i % 2) == 0 ? 0.5 : 0.3,
      "TasaDefectoMercaderia": (i % 2) == 0 ? 0.15 : 0.2,
      "CodigoMoneda": 2,
      "SimboloMoneda": "US$",
      "LimiteEmbarque": 200000,
      "TasaDerechoAduana": 30,
      "LimiteSobreSeguro": 20,
      "CodigoFraccPago": 10001,
      "NombreFraccPago": "1 IGUAL A PARTIR DE 0 DIA",
      "CodigoEmbalaje": 8,
      "NombreEmbalaje": "CONTENEDOR EXCLUSIVO",
      "TipoSuscripcion": "A",
      "NombreTipoSuscripcion": "CLAUSULA \"A\"",
      "DiasVigencia": 90,
      "CodigoRamo": codigoRamo,
      "CodigoAgente": codigoAgente
    });
  }
  res.json(response);
});

router.get('/transporte/listarAlmacen', function(req, res) {
  var data = {
    "Message": "",
    "Data": [
      {
        "Codigo": "028",
        "Descripcion": "ABANCAY"
      },
      {
        "Codigo": "082",
        "Descripcion": "ACOBAMBA"
      },
      {
        "Codigo": "069",
        "Descripcion": "ACOMAYO"
      },
      {
        "Codigo": "009",
        "Descripcion": "AIJA"
      },
      {
        "Codigo": "139",
        "Descripcion": "ALTO AMAZONAS"
      },
      {
        "Codigo": "089",
        "Descripcion": "AMBO"
      },
      {
        "Codigo": "029",
        "Descripcion": "ANDAHUAYLAS"
      },
      {
        "Codigo": "083",
        "Descripcion": "ANGARAES"
      },
      {
        "Codigo": "070",
        "Descripcion": "ANTA"
      },
      {
        "Codigo": "030",
        "Descripcion": "ANTABAMBA"
      },
      {
        "Codigo": "010",
        "Descripcion": "ANTONIO RAYMONDI"
      },
      {
        "Codigo": "035",
        "Descripcion": "AREQUIPA"
      },
      {
        "Codigo": "114",
        "Descripcion": "ASCOPE"
      },
      {
        "Codigo": "011",
        "Descripcion": "ASUNCION"
      },
      {
        "Codigo": "192",
        "Descripcion": "ATALAYA"
      },
      {
        "Codigo": "154",
        "Descripcion": "AYABACA"
      },
      {
        "Codigo": "031",
        "Descripcion": "AYMARAES"
      },
      {
        "Codigo": "162",
        "Descripcion": "AZANGARO"
      },
      {
        "Codigo": "002",
        "Descripcion": "BAGUA"
      },
      {
        "Codigo": "129",
        "Descripcion": "BARRANCA"
      },
      {
        "Codigo": "175",
        "Descripcion": "BELLAVISTA"
      },
      {
        "Codigo": "115",
        "Descripcion": "BOLIVAR"
      },
      {
        "Codigo": "012",
        "Descripcion": "BOLOGNESI"
      },
      {
        "Codigo": "003",
        "Descripcion": "BONGARA"
      },
      {
        "Codigo": "055",
        "Descripcion": "CAJABAMBA"
      },
      {
        "Codigo": "054",
        "Descripcion": "CAJAMARCA"
      },
      {
        "Codigo": "130",
        "Descripcion": "CAJATAMBO"
      },
      {
        "Codigo": "071",
        "Descripcion": "CALCA"
      },
      {
        "Codigo": "067",
        "Descripcion": "CALLAO"
      },
      {
        "Codigo": "036",
        "Descripcion": "CAMANA"
      },
      {
        "Codigo": "072",
        "Descripcion": "CANAS"
      },
      {
        "Codigo": "073",
        "Descripcion": "CANCHIS"
      },
      {
        "Codigo": "185",
        "Descripcion": "CANDARAVE"
      },
      {
        "Codigo": "044",
        "Descripcion": "CANGALLO"
      },
      {
        "Codigo": "131",
        "Descripcion": "CANTA"
      },
      {
        "Codigo": "132",
        "Descripcion": "CAÑETE"
      },
      {
        "Codigo": "163",
        "Descripcion": "CARABAYA"
      },
      {
        "Codigo": "037",
        "Descripcion": "CARAVELI"
      },
      {
        "Codigo": "013",
        "Descripcion": "CARHUAZ"
      },
      {
        "Codigo": "014",
        "Descripcion": "CARLOS F. F"
      },
      {
        "Codigo": "015",
        "Descripcion": "CASMA"
      },
      {
        "Codigo": "038",
        "Descripcion": "CASTILLA"
      },
      {
        "Codigo": "084",
        "Descripcion": "CASTROVIRREYNA"
      },
      {
        "Codigo": "039",
        "Descripcion": "CAYLLOMA"
      },
      {
        "Codigo": "056",
        "Descripcion": "CELENDIN"
      },
      {
        "Codigo": "001",
        "Descripcion": "CHACHAPOYAS"
      },
      {
        "Codigo": "106",
        "Descripcion": "CHANCHAMAYO"
      },
      {
        "Codigo": "116",
        "Descripcion": "CHEPEN"
      },
      {
        "Codigo": "125",
        "Descripcion": "CHICLAYO"
      },
      {
        "Codigo": "100",
        "Descripcion": "CHINCHA"
      },
      {
        "Codigo": "033",
        "Descripcion": "CHINCHEROS"
      },
      {
        "Codigo": "057",
        "Descripcion": "CHOTA"
      },
      {
        "Codigo": "164",
        "Descripcion": "CHUCUITO"
      },
      {
        "Codigo": "074",
        "Descripcion": "CHUMBIVILCAS"
      },
      {
        "Codigo": "112",
        "Descripcion": "CHUPACA"
      },
      {
        "Codigo": "085",
        "Descripcion": "CHURCAMPA"
      },
      {
        "Codigo": "105",
        "Descripcion": "CONCEPCION"
      },
      {
        "Codigo": "040",
        "Descripcion": "CONDESUYOS"
      },
      {
        "Codigo": "004",
        "Descripcion": "CONDORCANQUI"
      },
      {
        "Codigo": "189",
        "Descripcion": "CONTRALMIRANTE"
      },
      {
        "Codigo": "058",
        "Descripcion": "CONTUMAZA"
      },
      {
        "Codigo": "191",
        "Descripcion": "CORONEL PORTILLO"
      },
      {
        "Codigo": "016",
        "Descripcion": "CORONGO"
      },
      {
        "Codigo": "032",
        "Descripcion": "COTABAMBAS"
      },
      {
        "Codigo": "068",
        "Descripcion": "CUSCO"
      },
      {
        "Codigo": "059",
        "Descripcion": "CUTERVO"
      },
      {
        "Codigo": "151",
        "Descripcion": "DANIEL CARRION"
      },
      {
        "Codigo": "090",
        "Descripcion": "DOS DE MAYO"
      },
      {
        "Codigo": "165",
        "Descripcion": "EL COLLAO"
      },
      {
        "Codigo": "176",
        "Descripcion": "EL DORADO"
      },
      {
        "Codigo": "075",
        "Descripcion": "ESPINAR"
      },
      {
        "Codigo": "126",
        "Descripcion": "FERREÑAFE"
      },
      {
        "Codigo": "148",
        "Descripcion": "GRAL.SANCHEZ CERRO"
      },
      {
        "Codigo": "123",
        "Descripcion": "GRAN CHIMU"
      },
      {
        "Codigo": "034",
        "Descripcion": "GRAU"
      },
      {
        "Codigo": "091",
        "Descripcion": "HUACAYBAMBA"
      },
      {
        "Codigo": "060",
        "Descripcion": "HUALGAYOC"
      },
      {
        "Codigo": "177",
        "Descripcion": "HUALLAGA"
      },
      {
        "Codigo": "092",
        "Descripcion": "HUAMALIES"
      },
      {
        "Codigo": "043",
        "Descripcion": "HUAMANGA"
      },
      {
        "Codigo": "045",
        "Descripcion": "HUANCA SANCOS"
      },
      {
        "Codigo": "155",
        "Descripcion": "HUANCABAMBA"
      },
      {
        "Codigo": "166",
        "Descripcion": "HUANCANE"
      },
      {
        "Codigo": "081",
        "Descripcion": "HUANCAVELICA"
      },
      {
        "Codigo": "104",
        "Descripcion": "HUANCAYO"
      },
      {
        "Codigo": "046",
        "Descripcion": "HUANTA"
      },
      {
        "Codigo": "088",
        "Descripcion": "HUANUCO"
      },
      {
        "Codigo": "133",
        "Descripcion": "HUARAL"
      },
      {
        "Codigo": "008",
        "Descripcion": "HUARAZ"
      },
      {
        "Codigo": "017",
        "Descripcion": "HUARI"
      },
      {
        "Codigo": "018",
        "Descripcion": "HUARMEY"
      },
      {
        "Codigo": "134",
        "Descripcion": "HUAROCHIRI"
      },
      {
        "Codigo": "135",
        "Descripcion": "HUAURA"
      },
      {
        "Codigo": "019",
        "Descripcion": "HUAYLAS"
      },
      {
        "Codigo": "086",
        "Descripcion": "HUAYTARA"
      },
      {
        "Codigo": "099",
        "Descripcion": "ICA"
      },
      {
        "Codigo": "149",
        "Descripcion": "ILO"
      },
      {
        "Codigo": "041",
        "Descripcion": "ISLAY"
      },
      {
        "Codigo": "061",
        "Descripcion": "JAEN"
      },
      {
        "Codigo": "107",
        "Descripcion": "JAUJA"
      },
      {
        "Codigo": "186",
        "Descripcion": "JORGE BASAD"
      },
      {
        "Codigo": "117",
        "Descripcion": "JULCAN"
      },
      {
        "Codigo": "108",
        "Descripcion": "JUNIN"
      },
      {
        "Codigo": "076",
        "Descripcion": "LA CONVENCION"
      },
      {
        "Codigo": "047",
        "Descripcion": "LA MAR"
      },
      {
        "Codigo": "042",
        "Descripcion": "LA UNION"
      },
      {
        "Codigo": "178",
        "Descripcion": "LAMAS"
      },
      {
        "Codigo": "127",
        "Descripcion": "LAMBAYEQUE"
      },
      {
        "Codigo": "167",
        "Descripcion": "LAMPA"
      },
      {
        "Codigo": "097",
        "Descripcion": "LAURICOCHA"
      },
      {
        "Codigo": "093",
        "Descripcion": "LEONCIO PRADO"
      },
      {
        "Codigo": "128",
        "Descripcion": "LIMA"
      },
      {
        "Codigo": "140",
        "Descripcion": "LORETO"
      },
      {
        "Codigo": "048",
        "Descripcion": "LUCANAS"
      },
      {
        "Codigo": "005",
        "Descripcion": "LUYA"
      },
      {
        "Codigo": "145",
        "Descripcion": "MANU"
      },
      {
        "Codigo": "094",
        "Descripcion": "MARAÑON"
      },
      {
        "Codigo": "179",
        "Descripcion": "MARISCAL CACERES"
      },
      {
        "Codigo": "020",
        "Descripcion": "MARISCAL LUZURIAGA"
      },
      {
        "Codigo": "147",
        "Descripcion": "MARISCAL NIETO"
      },
      {
        "Codigo": "141",
        "Descripcion": "MARISCAL RAMON CASTILLA"
      },
      {
        "Codigo": "138",
        "Descripcion": "MAYNAS"
      },
      {
        "Codigo": "168",
        "Descripcion": "MELGAR"
      },
      {
        "Codigo": "169",
        "Descripcion": "MOHO"
      },
      {
        "Codigo": "156",
        "Descripcion": "MORROPON"
      },
      {
        "Codigo": "174",
        "Descripcion": "MOYOBAMBA"
      },
      {
        "Codigo": "101",
        "Descripcion": "NAZCA"
      },
      {
        "Codigo": "021",
        "Descripcion": "OCROS"
      },
      {
        "Codigo": "118",
        "Descripcion": "OTUZCO"
      },
      {
        "Codigo": "152",
        "Descripcion": "OXAPAMPA"
      },
      {
        "Codigo": "136",
        "Descripcion": "OYON"
      },
      {
        "Codigo": "119",
        "Descripcion": "PACASMAYO"
      },
      {
        "Codigo": "095",
        "Descripcion": "PACHITEA"
      },
      {
        "Codigo": "193",
        "Descripcion": "PADRE ABAD"
      },
      {
        "Codigo": "157",
        "Descripcion": "PAITA"
      },
      {
        "Codigo": "022",
        "Descripcion": "PALLASCA"
      },
      {
        "Codigo": "102",
        "Descripcion": "PALPA"
      },
      {
        "Codigo": "049",
        "Descripcion": "PARINACOCHAS"
      },
      {
        "Codigo": "077",
        "Descripcion": "PARURO"
      },
      {
        "Codigo": "150",
        "Descripcion": "PASCO"
      },
      {
        "Codigo": "120",
        "Descripcion": "PATAZ"
      },
      {
        "Codigo": "050",
        "Descripcion": "PAUCAR DEL SARA"
      },
      {
        "Codigo": "078",
        "Descripcion": "PAUCARTAMBO"
      },
      {
        "Codigo": "180",
        "Descripcion": "PICOTA"
      },
      {
        "Codigo": "103",
        "Descripcion": "PISCO"
      },
      {
        "Codigo": "153",
        "Descripcion": "PIURA"
      },
      {
        "Codigo": "023",
        "Descripcion": "POMABAMBA"
      },
      {
        "Codigo": "096",
        "Descripcion": "PUERTO INCA"
      },
      {
        "Codigo": "161",
        "Descripcion": "PUNO"
      },
      {
        "Codigo": "194",
        "Descripcion": "PURUS"
      },
      {
        "Codigo": "079",
        "Descripcion": "QUISPICANCHI"
      },
      {
        "Codigo": "024",
        "Descripcion": "RECUAY"
      },
      {
        "Codigo": "142",
        "Descripcion": "REQUENA"
      },
      {
        "Codigo": "181",
        "Descripcion": "RIOJA"
      },
      {
        "Codigo": "006",
        "Descripcion": "RODRIGUEZ DE MENDOZA"
      },
      {
        "Codigo": "170",
        "Descripcion": "SAN ANTONIO"
      },
      {
        "Codigo": "062",
        "Descripcion": "SAN IGNACIO"
      },
      {
        "Codigo": "063",
        "Descripcion": "SAN MARCOS"
      },
      {
        "Codigo": "182",
        "Descripcion": "SAN MARTIN"
      },
      {
        "Codigo": "064",
        "Descripcion": "SAN MIGUEL"
      },
      {
        "Codigo": "065",
        "Descripcion": "SAN PABLO"
      },
      {
        "Codigo": "171",
        "Descripcion": "SAN ROMAN"
      },
      {
        "Codigo": "121",
        "Descripcion": "SANCHEZ CARRION"
      },
      {
        "Codigo": "172",
        "Descripcion": "SANDIA"
      },
      {
        "Codigo": "025",
        "Descripcion": "SANTA"
      },
      {
        "Codigo": "066",
        "Descripcion": "SANTA CRUZ"
      },
      {
        "Codigo": "122",
        "Descripcion": "SANTIAGO DE CHUCO"
      },
      {
        "Codigo": "109",
        "Descripcion": "SATIPO"
      },
      {
        "Codigo": "160",
        "Descripcion": "SECHURA"
      },
      {
        "Codigo": "026",
        "Descripcion": "SIHUAS"
      },
      {
        "Codigo": "051",
        "Descripcion": "SUCRE"
      },
      {
        "Codigo": "158",
        "Descripcion": "SULLANA"
      },
      {
        "Codigo": "184",
        "Descripcion": "TACNA"
      },
      {
        "Codigo": "146",
        "Descripcion": "TAHUAMANU"
      },
      {
        "Codigo": "159",
        "Descripcion": "TALARA"
      },
      {
        "Codigo": "144",
        "Descripcion": "TAMBOPATA"
      },
      {
        "Codigo": "187",
        "Descripcion": "TARATA"
      },
      {
        "Codigo": "110",
        "Descripcion": "TARMA"
      },
      {
        "Codigo": "087",
        "Descripcion": "TAYACAJA"
      },
      {
        "Codigo": "198",
        "Descripcion": "TINGO MARIA"
      },
      {
        "Codigo": "183",
        "Descripcion": "TOCACHE"
      },
      {
        "Codigo": "999",
        "Descripcion": "TODOS LOS CASOS"
      },
      {
        "Codigo": "113",
        "Descripcion": "TRUJILLO"
      },
      {
        "Codigo": "188",
        "Descripcion": "TUMBES"
      },
      {
        "Codigo": "143",
        "Descripcion": "UCAYALI"
      },
      {
        "Codigo": "080",
        "Descripcion": "URUBAMBA"
      },
      {
        "Codigo": "007",
        "Descripcion": "UTCUBAMBA"
      },
      {
        "Codigo": "052",
        "Descripcion": "VICTOR FAJARDO"
      },
      {
        "Codigo": "053",
        "Descripcion": "VILCAS HUAMAN"
      },
      {
        "Codigo": "124",
        "Descripcion": "VIRU"
      },
      {
        "Codigo": "098",
        "Descripcion": "YAROWILCA"
      },
      {
        "Codigo": "111",
        "Descripcion": "YAULI"
      },
      {
        "Codigo": "137",
        "Descripcion": "YAUYOS"
      },
      {
        "Codigo": "027",
        "Descripcion": "YUNGAY"
      },
      {
        "Codigo": "173",
        "Descripcion": "YUNGUYO"
      },
      {
        "Codigo": "190",
        "Descripcion": "ZARUMILLA"
      }
    ],
    "OperationCode": 200,
    "TypeMessage": "success"
  };
  res.json(data);
});

router.post('/cotizacion/cotizar/transporte', function(req, res) {
  console.log(req.body);
  return res.json({
    "Message": "",
    "Data": {
      "CodigoMateriaAsegurada": "42",
      "TasaMercaderia": 0.15,
      "CodigoValuacionMercaderia": "1",
      "PorcentajeSobreSeguro": 10,
      "ImporteEmbarque": 10000,
      "PorcentajeDerechosAduana": 30,
      "ImporteFleteTransporte": 1000,
      "ImporteDerechoAduana": 500,
      "PolizaGrupo": "27126",
      "MarcaOK": "S",
      "ImporteSobreSeguro": 1100,
      "ImporteAsegurado": 121,
      "TotalImporteAsegurado": 126,
      "PrimaNeta": 18.38
    },
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});

router.get('/transporte/listaValuacionMercaderia/:codigo', function(req, res) {
  var codigo = req.params.codigo;
  if (codigo == "252") {
    return res.json({
      Message: "",
      Data: [
        {
          CodigoRamos: 252,
          CodigoValuacion: 1,
          NombreValuacion: "F.O.B"
        },
        {
          CodigoRamos: 252,
          CodigoValuacion: 2,
          NombreValuacion: "F.O.B + FLETE"
        },
        {
          CodigoRamos: 252,
          CodigoValuacion: 3,
          NombreValuacion: "C.I.F"
        },
        {
          CodigoRamos: 252,
          CodigoValuacion: 4,
          NombreValuacion: "EX WORK"
        },
        {
          CodigoRamos: 252,
          CodigoValuacion: 5,
          NombreValuacion: "FAS"
        },
        {
          CodigoRamos: 252,
          CodigoValuacion: 6,
          NombreValuacion: "FCA"
        },
        {
          CodigoRamos: 252,
          CodigoValuacion: 7,
          NombreValuacion: "CPT"
        },
        {
          CodigoRamos: 252,
          CodigoValuacion: 8,
          NombreValuacion: "D.A.F."
        },
        {
          CodigoRamos: 252,
          CodigoValuacion: 9,
          NombreValuacion: "D.D.U."
        },
        {
          CodigoRamos: 252,
          CodigoValuacion: 10,
          NombreValuacion: "CIP"
        },
        {
          CodigoRamos: 252,
          CodigoValuacion: 11,
          NombreValuacion: "CFR"
        }
      ],
      OperationCode: 200,
      TypeMessage: "success"
    });
  }
  return res.json({
    "Message": "",
    "Data": [
      {
        "CodigoRamos": codigo,
        "CodigoValuacion": 1,
        "NombreValuacion": "F.O.B"
      },
      {
        "CodigoRamos": codigo,
        "CodigoValuacion": 2,
        "NombreValuacion": "F.O.B + FLETE"
      },
      {
        "CodigoRamos": codigo,
        "CodigoValuacion": 3,
        "NombreValuacion": "C.I.F"
      },
      {
        "CodigoRamos": codigo,
        "CodigoValuacion": 4,
        "NombreValuacion": "EX WORK"
      }
    ],
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});

router.post('/emision/grabar/transporte', function(req, res) {
  console.log(req.body);
  return res.json({
    "Message": "Se realizo el registro satisfactoriamente",
    "Data" : {
      "NumeroDocumento" : "121313"
    },
    "OperationCode": 200,
    "TypeMessage": "success",
    "Title": "Operación Exitosa"
  });
});

router.post('/transporte/aplicacion/buscaremisiones', function(req,res) {
  console.log(req.body);
  if (req.body.Poliza && req.body.Poliza.NumeroPoliza && req.body.Poliza.NumeroPoliza != "2521610100031") {
    return res.json({
      "Message": "",
      "Data": [],
      "OperationCode": 200,
      "TypeMessage": "success"
    });
  } 

  return res.json({
    "Message": "",
    "Data": [
      {
        "CodigoCompania": 1,
        "NumeroPoliza": "2521610100031",
        "InicioVigencia": "21/12/2016",
        "FinVigencia": "21/12/2017",
        "ContratanteNombre": "JKNJK NJK JKHNKJ",
        "ContratanteTipoDoc": "DNI",
        "ContratanteNumeroDoc": "12345678",
        "Aplicacion": 3,
        "UltimoSuplemento": 3,
        "NumeroShipTo": 0
      }
    ],
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});

router.get('/transporte/aplicacion/listarriesgos/:compannia/:poliza/:ship', function(req, res) {
  return res.json({
    "Message": "",
    "Data": [
      {
        "NumeroRiesgo": 1,
        "ValorCampo": "42",
        "NombreMaterial": "PROPIOS DEL GIRO DEL NEGOCIO DEL ASEGURADO",
        "RiesgoMaterial": "1-42-PROPIOS DEL GIRO DEL NEGOCIO DEL ASEGURADO-EMBALAJE ADECUADO (TASA 0.20%)"
      },
      {
        "NumeroRiesgo": 2,
        "ValorCampo": "42",
        "NombreMaterial": "PROPIOS DEL GIRO DEL NEGOCIO DEL ASEGURADO",
        "RiesgoMaterial": "2-42-PROPIOS DEL GIRO DEL NEGOCIO DEL ASEGURADO-CONTENEDOR CONSOLIDADO (TASA 0.14%)"
      },
      {
        "NumeroRiesgo": 3,
        "ValorCampo": "42",
        "NombreMaterial": "PROPIOS DEL GIRO DEL NEGOCIO DEL ASEGURADO",
        "RiesgoMaterial": "3-42-PROPIOS DEL GIRO DEL NEGOCIO DEL ASEGURADO-CONTENEDOR EXCLUSIVO (TASA 0.10%)"
      },
      {
        "NumeroRiesgo": 7,
        "ValorCampo": "42",
        "NombreMaterial": "PROPIOS DEL GIRO DEL NEGOCIO DEL ASEGURADO",
        "RiesgoMaterial": "7-42-PROPIOS DEL GIRO DEL NEGOCIO DEL ASEGURADO-GAS EN CILINDROS (TASA 0.07%)"
      }
    ],
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});

router.post('/transporte/aplicacion/marcoriesgo', function(req,res) {
  console.log(req.body);
  return res.json({
    "Message": "",
    "Data": {
      "Clausula": "CLAUSULA A",
      "Transporte": "MARITIMO-AEREO-TERRESTRE",
      "Sobreseguro": "12",
      "Derechoaduana": "12",
      "Embalaje": "CAJAS DE CARTON",
      "NombreRiesgo": "PROD.METALURGICOS Y ELECTRICOS",
      "CodigoValuacionMercaderia": 2,
      "TasaDerechoAduana": 2500,
      "ImpuestoDerechoAduana": 0,
      "LimiteMaximoEmbarque": 600000
    },
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});

router.post('/transporte/aplicacion/calcularprima', function(req,res) {
  console.log(req.body);
  return res.json({
    "Message": "",
    "Data": {
      "ValorMercaderiaFOB": 200,
      "ImporteDerechoAduana": 10,
      "PorcentajeSobreSeguro": 10,
      "Flete": 1,
      "ValorEmbarque": 201,
      "ImporteSobreSeguro": 20.1,
      "ImporteAseguradoMercaderia": 221.1,
      "SumaAsegurada": 231.1
    },
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});

router.post('/transporte/aplicacion/grabar', function(req,res) {
  console.log(req.body);
  return res.json({
    "Message": "Se registro la cotizacion satisfactoriamente",
    "Data": {
      "CodigoCompania": 1,
      "CodigoEntidad": 1,
      "NumeroDocumento": 182759,
      "CodigoProducto": 10,
      "NumeroRiesgo": 40,
      "FechaEmbarque": "01082016",
      "CodigoMesAplicacion": "082016",
      "ImpuestoDerechoAduana": 0,
      "TasaDerechoAduana": 0.66,
      "ImporteEmbarque": 11000,
      "NombreEmpTransporte": "POR CONFIRMAR",
      "NombreVehiculo": "POR CONFIRMAR",
      "NumeroGuia": "POR CONFIRMAR",
      "CodigoPaisOrigen": "CHN",
      "CodigoValuacionMercaderia": "2",
      "PorcentajeSobreSeguro": 15,
      "Origen": "SHANGAI",
      "Destino": "ALMAC.ASEG.LIMA VIA/CALLAO",
      "Proveedor": "COSISE",
      "CodigoMateriaAsegurada": "5",
      "FechaEfectivaPoliza": "31/07/2016",
      "FechaVencimientoPoliza": "30/08/2016",
      "TipoDocumentoAsegurado": "RUC",
      "TipoDocumentoEndosatario": "RUC",
      "CodigoDocumentoAsegurado": "",
      "CodigoDocumentoEndosatario": "20100116635",
      "ImporteAsegurado": 11615,
      "NumeroPolizaMarco": "2520110000071",
      "NumeroAplicacion": "96",
      "NombreRiesgo": "GIRO DEL NEGOCIO DEL ASEGURADO",
      "MCA_DerechoAduana": "S",
      "ImporteFleteAsegurado": 100,
      "ValorMercaderia": 10000,
      "ImporteSobreSeguro": 1515,
      "Contratante": "ACEROS Y TECHOS S.A.",
      "UsuarioRegistro": "DANIEL BISBAL",
      "IPRegistro": "",
      "UsuarioRed": "",
      "DescripcionMateria": "PRUEBA",
      "MCA_TomadoresAlternos": "N",
      "PorcentajeTomadorPrincipal": 10,
      "CodigoRamo": 0,
      "CodigoEmbalaje": 0,
      "FechaFinVigencia": "0001-01-01T00:00:00",
      "PorcentajeTasaRiesgo": 0,
      "Prima": 0,
      "CodigoPolizaMarco": "2520110000071"
    },
    "OperationCode": 200,
    "TypeMessage": "success",
    "Title": "Operación Exitosa",
    "Icon": "glyphicon glyphicon-ok-sign"
  });
});

router.get("/transporte/aplicacion/listarMateriaAseg/:codigo", function(req, res) {
  return res.json({
    "Message": "",
    "Data": [
      {
        "Codigo": "1",
        "Descripcion": "ALIMENTOS NO CONGELADOS",
        "Indice": 0
      }
    ],
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});

module.exports = router;