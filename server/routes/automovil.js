/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
console.log('test-automovil');

router.get('/automovil/marcamodelo',function(req, res){
    console.log(req.body);
    res.json({
        // "Message":"No hay coincidencias",
        "Message":"",
        "Data":
          [{
            "MarcaModelo":"TOYOTA YARIS",
            "CodigoMarca":"30",
            "NombreMarca":"TOYOTA",
            "CodigoModelo":"284",
            "NombreModelo":"YARIS"
          },
          {
            "MarcaModelo":"TOYOTA YK110L-KRH",
            "CodigoMarca":"31",
            "NombreMarca":"TOYOTA",
            "CodigoModelo":"285",
            "NombreModelo":"YK110L-KRH"
          },
          {
            "MarcaModelo":"TOYOTA YK110L-KRP",
            "CodigoMarca":"30",
            "NombreMarca":"TOYOTA",
            "CodigoModelo":"286",
            "NombreModelo":"YK110L-KRP"
          },
          {
            "MarcaModelo":"TOYOTA YK110L-MRH",
            "CodigoMarca":"30",
            "NombreMarca":"TOYOTA",
            "CodigoModelo":"287",
            "NombreModelo":"YK110L-MRH"
          },
          {
            "MarcaModelo":"TOYOTA YN106L",
            "CodigoMarca":"30",
            "NombreMarca":"TOYOTA",
            "CodigoModelo":"288",
            "NombreModelo":"YN106L"
          },
          {
            "MarcaModelo":"TOYOTA YN57L-KD",
            "CodigoMarca":"30",
            "NombreMarca":"TOYOTA",
            "CodigoModelo":"289",
            "NombreModelo":"YN57L-KD"
          },
          {
            "MarcaModelo":"TOYOTA YN57LMRHI4X2",
            "CodigoMarca":"30",
            "NombreMarca":"TOYOTA",
            "CodigoModelo":"290",
            "NombreModelo":"YN57LMRHI4X2"
          },
          {
            "MarcaModelo":"TOYOTA YN65L-KR",
            "CodigoMarca":"30",
            "NombreMarca":"TOYOTA",
            "CodigoModelo":"291",
            "NombreModelo":"YN65L-KR"
          },
          {
            "MarcaModelo":"TOYOTA YN67L-MR",
            "CodigoMarca":"30",
            "NombreMarca":"TOYOTA",
            "CodigoModelo":"292",
            "NombreModelo":"YN67L-MR"
          },
          {
            "MarcaModelo":"TOYOTA YN67L-MRP-HILUX",
            "CodigoMarca":"30",
            "NombreMarca":"TOYOTA",
            "CodigoModelo":"293",
            "NombreModelo":"YN67L-MRP-HILUX"
          },
          {
            "MarcaModelo":"TOYOTA YN87L-PRMRS",
            "CodigoMarca":"30",
            "NombreMarca":"TOYOTA",
            "CodigoModelo":"294",
            "NombreModelo":"YN87L-PRMRS"
          },
          {
            "MarcaModelo":"TOYOTA YX110L-XRP",
            "CodigoMarca":"30",
            "NombreMarca":"TOYOTA",
            "CodigoModelo":"295",
            "NombreModelo":"YX110L-XRP"
          }],
        "OperationCode":200,
        "TypeMessage":"success",
        "Title":"Operación Exitosa",
        "Icon":"glyphicon glyphicon-ok-sign"
    });
});

router.get('/automovil/marca',function(req, res){
  res.json({
    "Message":"",
    "Data":[
    {
    "Codigo":"301",
    "Descripcion":"AGRALE-MODASA"
    },
    {
    "Codigo":"86",
    "Descripcion":"ALCOSA"
    },
    {
    "Codigo":"302",
    "Descripcion":"ALFA ROMEO"
    },
    {
    "Codigo":"303",
    "Descripcion":"ANDINO"
    },
    {
    "Codigo":"205",
    "Descripcion":"APRILIA"
    },
    {
    "Codigo":"73",
    "Descripcion":"ASHOK LEYLAND"
    },
    {
    "Codigo":"304",
    "Descripcion":"ASIA"
    },
    {
    "Codigo":"130",
    "Descripcion":"ASIA HERO"
    }],
    "OperationCode":200,
    "TypeMessage":"success",
    "Title":"Operación Exitosa",
    "Icon":"glyphicon glyphicon-ok-sign"
  });
});

router.get('/automovil/color',function(req, res){
  console.log(req.body);
  res.json({
      "Message":"",
      "Data":[
      {
      "Codigo":"1",
      "Descripcion":"ACERO"
      },
      {
      "Codigo":"2",
      "Descripcion":"ALMENDRA"
      },
      {
      "Codigo":"3",
      "Descripcion":"ALUMINIO"
      },
      {
      "Codigo":"4",
      "Descripcion":"AMARILLO"
      },
      {
      "Codigo":"84",
      "Descripcion":"AMARILLO HIGHWAY"
      },
      {
      "Codigo":"5",
      "Descripcion":"AMBAR"
      },
      {
      "Codigo":"6",
      "Descripcion":"ANARANJADO"
      },
      {
      "Codigo":"7",
      "Descripcion":"ARENA"
      },
      {
      "Codigo":"8",
      "Descripcion":"AZUL"
      },
      {
      "Codigo":"85",
      "Descripcion":"AZUL ATLANTIS"
      },
      {
      "Codigo":"92",
      "Descripcion":"AZUL CLARO METALICO"
      },
      {
      "Codigo":"56",
      "Descripcion":"AZUL CRISTAL"
      },
      {
      "Codigo":"51",
      "Descripcion":"AZUL METALICO"
      },
      {
      "Codigo":"57",
      "Descripcion":"AZUL OSCURO"
      },
      {
      "Codigo":"91",
      "Descripcion":"AZUL OSCURO METALICO"
      },
      {
      "Codigo":"58",
      "Descripcion":"AZUL VIRGEN"
      },
      {
      "Codigo":"9",
      "Descripcion":"BEIGE"
      },
      {
      "Codigo":"59",
      "Descripcion":"BEIGE CLARO"
      },
      {
      "Codigo":"45",
      "Descripcion":"BEIGE DORADO"
      },
      {
      "Codigo":"47",
      "Descripcion":"BEIGE METALICO"
      },
      {
      "Codigo":"10",
      "Descripcion":"BLANCO"
      },
      {
      "Codigo":"60",
      "Descripcion":"BLANCO GALAXY"
      },
      {
      "Codigo":"61",
      "Descripcion":"BLANCO METALICO"
      },
      {
      "Codigo":"62",
      "Descripcion":"BLANCO PERLA"
      },
      {
      "Codigo":"11",
      "Descripcion":"BRONCE"
      },
      {
      "Codigo":"41",
      "Descripcion":"BURDEO"
      },
      {
      "Codigo":"39",
      "Descripcion":"CAFE"
      },
      {
      "Codigo":"13",
      "Descripcion":"CAOBA"
      },
      {
      "Codigo":"14",
      "Descripcion":"CELESTE"
      },
      {
      "Codigo":"12",
      "Descripcion":"CHAMPAGNE"
      },
      {
      "Codigo":"15",
      "Descripcion":"COBRE"
      },
      {
      "Codigo":"63",
      "Descripcion":"COBRE PERLA"
      },
      {
      "Codigo":"16",
      "Descripcion":"CREMA"
      },
      {
      "Codigo":"64",
      "Descripcion":"DESERT BLOOM"
      },
      {
      "Codigo":"17",
      "Descripcion":"DORADO"
      },
      {
      "Codigo":"43",
      "Descripcion":"GRAFITO"
      },
      {
      "Codigo":"19",
      "Descripcion":"GRIS"
      },
      {
      "Codigo":"87",
      "Descripcion":"GRIS CLARO METALICO"
      },
      {
      "Codigo":"94",
      "Descripcion":"GRIS CLARO VERDE AGUA"
      },
      {
      "Codigo":"93",
      "Descripcion":"GRIS METALICO"
      },
      {
      "Codigo":"66",
      "Descripcion":"GRIS OSCURO"
      },
      {
      "Codigo":"55",
      "Descripcion":"GRIS OSCURO METALICO"
      },
      {
      "Codigo":"67",
      "Descripcion":"GRIS PERLA"
      },
      {
      "Codigo":"68",
      "Descripcion":"GRIS PEWTER"
      },
      {
      "Codigo":"89",
      "Descripcion":"GRIS PLATINO"
      },
      {
      "Codigo":"69",
      "Descripcion":"GRIS URBAN"
      },
      {
      "Codigo":"70",
      "Descripcion":"GRIS URBANO"
      },
      {
      "Codigo":"18",
      "Descripcion":"GUINDA"
      },
      {
      "Codigo":"46",
      "Descripcion":"GUINDA NARANJA"
      },
      {
      "Codigo":"20",
      "Descripcion":"JADE"
      },
      {
      "Codigo":"71",
      "Descripcion":"LIGHT GOLD"
      },
      {
      "Codigo":"40",
      "Descripcion":"MARFIL"
      },
      {
      "Codigo":"21",
      "Descripcion":"MARRON"
      },
      {
      "Codigo":"72",
      "Descripcion":"MISTY LAKE"
      },
      {
      "Codigo":"22",
      "Descripcion":"MORADO"
      },
      {
      "Codigo":"23",
      "Descripcion":"MOSTAZA"
      },
      {
      "Codigo":"32",
      "Descripcion":"MULTICOLOR"
      },
      {
      "Codigo":"73",
      "Descripcion":"NARANJA"
      },
      {
      "Codigo":"24",
      "Descripcion":"NEGRO"
      },
      {
      "Codigo":"44",
      "Descripcion":"NEGRO METALICO"
      },
      {
      "Codigo":"48",
      "Descripcion":"NEGRO PERLADO"
      },
      {
      "Codigo":"33",
      "Descripcion":"OTROS"
      },
      {
      "Codigo":"36",
      "Descripcion":"PERLA"
      },
      {
      "Codigo":"35",
      "Descripcion":"PLATA"
      },
      {
      "Codigo":"86",
      "Descripcion":"PLATA ACERO"
      },
      {
      "Codigo":"74",
      "Descripcion":"PLATA BROCADE"
      },
      {
      "Codigo":"75",
      "Descripcion":"PLATA CIELO"
      },
      {
      "Codigo":"49",
      "Descripcion":"PLATA METALICO"
      },
      {
      "Codigo":"95",
      "Descripcion":"PLATA MINERAL"
      },
      {
      "Codigo":"76",
      "Descripcion":"PLATA PERLADO"
      },
      {
      "Codigo":"54",
      "Descripcion":"PLATA REFLEX"
      },
      {
      "Codigo":"90",
      "Descripcion":"PLATA TITANIO"
      },
      {
      "Codigo":"25",
      "Descripcion":"PLATEADO"
      },
      {
      "Codigo":"26",
      "Descripcion":"PLOMO"
      },
      {
      "Codigo":"27",
      "Descripcion":"ROJO"
      },
      {
      "Codigo":"77",
      "Descripcion":"ROJO CHINO"
      },
      {
      "Codigo":"78",
      "Descripcion":"ROJO CON PLATA"
      },
      {
      "Codigo":"79",
      "Descripcion":"ROJO DAZZ"
      },
      {
      "Codigo":"80",
      "Descripcion":"ROJO FLAME"
      },
      {
      "Codigo":"53",
      "Descripcion":"ROJO METALICO"
      },
      {
      "Codigo":"50",
      "Descripcion":"ROJO PERLADO"
      },
      {
      "Codigo":"28",
      "Descripcion":"ROSADO"
      },
      {
      "Codigo":"42",
      "Descripcion":"TITANEO"
      },
      {
      "Codigo":"34",
      "Descripcion":"TURQUEZA"
      },
      {
      "Codigo":"29",
      "Descripcion":"VERDE"
      },
      {
      "Codigo":"65",
      "Descripcion":"VERDE COCKTAIL"
      },
      {
      "Codigo":"81",
      "Descripcion":"VERDE CON PLATA CIELO"
      },
      {
      "Codigo":"82",
      "Descripcion":"VERDE FAYENCE"
      },
      {
      "Codigo":"52",
      "Descripcion":"VERDE METALICO"
      },
      {
      "Codigo":"88",
      "Descripcion":"VERDE OSCURO METALICO"
      },
      {
      "Codigo":"83",
      "Descripcion":"VERDE PERLA"
      },
      {
      "Codigo":"30",
      "Descripcion":"VINO"
      },
      {
      "Codigo":"31",
      "Descripcion":"VIOLETA"
      }
      ],
      "OperationCode":200,
      "TypeMessage":"success",
      "Title":"Operación Exitosa",
      "Icon":"glyphicon glyphicon-ok-sign"
      });
});


// https://mxperu.atlassian.net/browse/OIM-320
router.get('/automovil/marcapickup/1',function(req, res){
  console.log(req.body);
  res.json({
    "Message": "",
    "Data": "N",
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});

// https://mxperu.atlassian.net/browse/OIM-321
router.get('/automovil/categoriaVehicular/1/30/284/1',function(req, res){
  console.log(req.body);
  res.json({
    "Message": "",
    "Data": 1,
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});

router.get('/automovil/categoriaVehicular/1/31/284/1',function(req, res){
  console.log(req.body);
  res.json({
    "Message": "",
    "Data": 1,
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});

module.exports = router;