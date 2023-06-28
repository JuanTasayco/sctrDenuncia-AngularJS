/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
console.log('test-departmento');

router.get('/ubigeo/departamento',function(req, res){
  console.log(req.body);
  res.json({
    "Message": "",
    "Data": [{
      "Codigo": "1",
      "Descripcion": "AMAZONAS"
    }, {
      "Codigo": "2",
      "Descripcion": "ANCASH"
    }, {
      "Codigo": "3",
      "Descripcion": "APURIMAC"
    }, {
      "Codigo": "4",
      "Descripcion": "AREQUIPA"
    }, {
      "Codigo": "5",
      "Descripcion": "AYACUCHO"
    }, {
      "Codigo": "6",
      "Descripcion": "CAJAMARCA"
    }, {
      "Codigo": "7",
      "Descripcion": "CALLAO"
    }, {
      "Codigo": "8",
      "Descripcion": "CUSCO"
    }, {
      "Codigo": "9",
      "Descripcion": "HUANCAVELICA"
    }, {
      "Codigo": "10",
      "Descripcion": "HUANUCO"
    }, {
      "Codigo": "11",
      "Descripcion": "ICA"
    }, {
      "Codigo": "12",
      "Descripcion": "JUNIN"
    }, {
      "Codigo": "13",
      "Descripcion": "LA LIBERTAD"
    }, {
      "Codigo": "14",
      "Descripcion": "LAMBAYEQUE"
    }, {
      "Codigo": "15",
      "Descripcion": "LIMA"
    }, {
      "Codigo": "16",
      "Descripcion": "LORETO"
    }, {
      "Codigo": "17",
      "Descripcion": "MADRE DE DIOS"
    }, {
      "Codigo": "18",
      "Descripcion": "MOQUEGUA"
    }, {
      "Codigo": "19",
      "Descripcion": "PASCO"
    }, {
      "Codigo": "20",
      "Descripcion": "PIURA"
    }, {
      "Codigo": "21",
      "Descripcion": "PUNO"
    }, {
      "Codigo": "22",
      "Descripcion": "SAN MARTIN"
    }, {
      "Codigo": "23",
      "Descripcion": "TACNA"
    }, {
      "Codigo": "24",
      "Descripcion": "TUMBES"
    }, {
      "Codigo": "25",
      "Descripcion": "UCAYALI"
    }],
    "OperationCode": 200,
    "TypeMessage": "success",
    "Title": "Operación Exitosa",
    "Icon": "glyphicon glyphicon-ok-sign"
  });
});

router.get('/ubigeo/provincia/15',function(req, res){
// router.get('/general/ubigeo/provincia?iddepartamento=15',function(req, res){
  console.log(req.body);
  res.json({
    "Message": "",
    "Data": [{
      "Codigo": "129",
      "Descripcion": "BARRANCA"
    }, {
      "Codigo": "132",
      "Descripcion": "CA¿ETE"
    }, {
      "Codigo": "130",
      "Descripcion": "CAJATAMBO"
    }, {
      "Codigo": "131",
      "Descripcion": "CANTA"
    }, {
      "Codigo": "133",
      "Descripcion": "HUARAL"
    }, {
      "Codigo": "134",
      "Descripcion": "HUAROCHIRI"
    }, {
      "Codigo": "135",
      "Descripcion": "HUAURA"
    }, {
      "Codigo": "128",
      "Descripcion": "LIMA"
    }, {
      "Codigo": "136",
      "Descripcion": "OYON"
    }, {
      "Codigo": "137",
      "Descripcion": "YAUYOS"
    }],
    "OperationCode": 0,
    "TypeMessage": null,
    "Title": null,
    "Icon": null
  });
});

router.get('/ubigeo/provincia/16',function(req, res){
// router.get('/general/ubigeo/provincia?iddepartamento=15',function(req, res){
  console.log(req.body);
  res.json({
    "Message": "",
    "Data": [{
      "Codigo": "138",
      "Descripcion": "LORETO"
    }, {
      "Codigo": "139",
      "Descripcion": "LOR"
    }],
    "OperationCode": 0,
    "TypeMessage": null,
    "Title": null,
    "Icon": null
  });
});

router.get('/ubigeo/distrito/139',function(req, res){
  console.log(req.body);
  res.json({
    "Message": "",
    "Data": [{
      "Codigo": "44",
      "Descripcion": "VILLA LORETO"
    }],
    "OperationCode": 0,
    "TypeMessage": null,
    "Title": null,
    "Icon": null
  });
});

router.get('/ubigeo/distrito/128',function(req, res){
  console.log(req.body);
  res.json({
    "Message": "",
    "Data": [{
      "Codigo": "2",
      "Descripcion": "ANCON"
    }, {
      "Codigo": "3",
      "Descripcion": "ATE"
    }, {
      "Codigo": "4",
      "Descripcion": "BARRANCO"
    }, {
      "Codigo": "5",
      "Descripcion": "BRE¿A"
    }, {
      "Codigo": "6",
      "Descripcion": "CARABAYLLO"
    }, {
      "Codigo": "1",
      "Descripcion": "CERCADO DE LIMA"
    }, {
      "Codigo": "7",
      "Descripcion": "CHACLACAYO"
    }, {
      "Codigo": "8",
      "Descripcion": "CHORRILLOS"
    }, {
      "Codigo": "9",
      "Descripcion": "CIENEGUILLA"
    }, {
      "Codigo": "10",
      "Descripcion": "COMAS"
    }, {
      "Codigo": "11",
      "Descripcion": "EL AGUSTINO"
    }, {
      "Codigo": "12",
      "Descripcion": "INDEPENDENCIA"
    }, {
      "Codigo": "13",
      "Descripcion": "JESUS MARIA"
    }, {
      "Codigo": "14",
      "Descripcion": "LA MOLINA"
    }, {
      "Codigo": "15",
      "Descripcion": "LA VICTORIA"
    }, {
      "Codigo": "16",
      "Descripcion": "LINCE"
    }, {
      "Codigo": "17",
      "Descripcion": "LOS OLIVOS"
    }, {
      "Codigo": "18",
      "Descripcion": "LURIGANCHO"
    }, {
      "Codigo": "19",
      "Descripcion": "LURIN"
    }, {
      "Codigo": "20",
      "Descripcion": "MAGDALENA DEL MAR"
    }, {
      "Codigo": "22",
      "Descripcion": "MIRAFLORES"
    }, {
      "Codigo": "44",
      "Descripcion": "OTROS"
    }, {
      "Codigo": "23",
      "Descripcion": "PACHACAMAC"
    }, {
      "Codigo": "24",
      "Descripcion": "PUCUSANA"
    }, {
      "Codigo": "21",
      "Descripcion": "PUEBLO LIBRE"
    }, {
      "Codigo": "25",
      "Descripcion": "PUENTE PIEDRA"
    }, {
      "Codigo": "26",
      "Descripcion": "PUNTA HERMOZA"
    }, {
      "Codigo": "27",
      "Descripcion": "PUNTA NEGRA"
    }, {
      "Codigo": "28",
      "Descripcion": "RIMAC"
    }, {
      "Codigo": "29",
      "Descripcion": "SAN BARTOLO"
    }, {
      "Codigo": "30",
      "Descripcion": "SAN BORJA"
    }, {
      "Codigo": "31",
      "Descripcion": "SAN ISIDRO"
    }, {
      "Codigo": "32",
      "Descripcion": "SAN JUAN DE LURIGANCHO"
    }, {
      "Codigo": "33",
      "Descripcion": "SAN JUAN DE MIRAFLORES"
    }, {
      "Codigo": "34",
      "Descripcion": "SAN LUIS"
    }, {
      "Codigo": "35",
      "Descripcion": "SAN MARTIN DE PORRES"
    }, {
      "Codigo": "36",
      "Descripcion": "SAN MIGUEL"
    }, {
      "Codigo": "37",
      "Descripcion": "SANTA ANITA"
    }, {
      "Codigo": "38",
      "Descripcion": "SANTA MARIA DEL MAR"
    }, {
      "Codigo": "39",
      "Descripcion": "SANTA ROSA"
    }, {
      "Codigo": "40",
      "Descripcion": "SANTIAGO DE SURCO"
    }, {
      "Codigo": "41",
      "Descripcion": "SURQUILLO"
    }, {
      "Codigo": "42",
      "Descripcion": "VILLA EL SALVADOR"
    }, {
      "Codigo": "43",
      "Descripcion": "VILLA MARIA DEL TRIUNFO"
    }],
    "OperationCode": 0,
    "TypeMessage": null,
    "Title": null,
    "Icon": null
  });
});
module.exports = router;