/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();

router.get('/claims/values',function(req, res){
  res.json([
    {
      "type": "http://schema.mapfrelogin.com/api/identity/customclaim/type",
      "value": "1"
    },
    {
      "type": "http://schema.mapfrelogin.com/api/identity/customclaim/subtype",
      "value": "0"
    },
    {
      "type": "http://schema.mapfrelogin.com/api/identity/customclaim/username",
      "value": "DBISBAL"
    },
    {
      "type": "http://schema.mapfrelogin.com/api/identity/customclaim/name",
      "value": "DANIEL BISBAL BISBAL"
    },
    {
      "type": "http://schema.mapfrelogin.com/api/identity/customclaim/clientprofile",
      "value": "0"
    },
    {
      "type": "http://schema.mapfrelogin.com/api/identity/customclaim/userprofile",
      "value": "ADMINWEB"
    },
    {
      "type": "http://schema.mapfrelogin.com/api/identity/customclaim/agentname",
      "value": "DIRECTO . ORGANIZACION TERRITORIAL"
    },
    {
      "type": "http://schema.mapfrelogin.com/api/identity/customclaim/agendid",
      "value": "9808"
    },
    {
      "type": "http://schema.mapfrelogin.com/api/identity/customclaim/numdoc",
      "value": ""
    },
    {
      "type": "http://schema.mapfrelogin.com/api/identity/customclaim/numruc",
      "value": ""
    },
    {
      "type": "http://schema.mapfrelogin.com/api/identity/customclaim/useremail",
      "value": "LQUEQUEZANA@MAPFRE.COM.PE"
    },
    {
      "type": "http://schema.mapfrelogin.com/api/identity/customclaim/tokenmapfre",
      "value": "DLSXZCRJ701858"
    },
    {
      "type": "http://schema.mapfrelogin.com/api/identity/customclaim/rolCode",
      "value": "ADMIN"
    },
    {
      "type": "iss",
      "value": "http://jwtauthzsrv.azurewebsites.net"
    },
    {
      "type": "aud",
      "value": "099153c2625149bc8ecb3e85e03f0022"
    },
    {
      "type": "exp",
      "value": "1479007033"
    },
    {
      "type": "nbf",
      "value": "1478791033"
    }
  ]);
});

router.get("/claims/list", function(req,res) {
  return res.json({"userType":"1","userSubType":"0","loginUserName":"fulano","userName":"FULANO DETAL ","clientProfile":"0","userProfile":"EMISCONS","agentName":"MN  ASOC ASES CORREDORES SEG","agentID":"104","documentNumber":"","rucNumber":"","userEmail":"HCORREA@MAPFRE.COM.PE","tokenMapfre":"OBEJNXFX434211","roleCode":"ADMIN","roleName":"REDES MAPFRE - EMISOR CONSULTOR WEB DE LA OIM","officeCode":"5999","urlRedirect":"","iss":"http://jwtauthzsrv.azurewebsites.net","aud":"099153c2625149bc8ecb3e85e03f0022","exp":"1491018610","nbf":"1490802610"});
});
module.exports = router;