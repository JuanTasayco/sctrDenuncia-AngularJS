/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
console.log('test-login');

//https://mxperu.atlassian.net/browse/OIM-402
router.post('/login',function(req, res){
  console.log(req.body);
  res.json({
    "access_token": "LvRSjDRsVm2Edcvo6eDFNDMT-HxujLHuB9B6EM4a-pNR7_a4WsMfTgxfDxzFBiWEP8fxBI0jKbZ41QxX6nGW5yL_EaoBWUpVWpC_35rQxNYpxDmQ6dMTL-LF6AcrA92CBfS8QAEic16NVch3EJsnoaFErYIpnG7s0qbcmhjWE6cDjXCE5KUEB_P2uGk5GBH4xQcbzBmBl9Y6BnFUT-REgMtKRd3fVlTY8ikWl0m65tscKKrUKOAgVFx8eJaelObro-M7xorOieiDrH1uCatAIz4nT5Wh2E0OYFOlnjv8_hHMZ74HnywxCu2bkQM2khZ_EJb0nVJKEvz8LA3u8uMDmO9TY4DRjVOAcKBxQUlfg3A",
    "token_type": "bearer",
    "expires_in": 215999,
    "userName": "MULTIPLICA",
    "type": "1",
    "userIp": "::1",
    "name" : "Luis Alex",
    ".issued": "Thu, 15 Sep 2016 17:14:58 GMT",
    ".expires": "Sun, 18 Sep 2016 05:14:58 GMT"
  });
});

//https://mxperu.atlassian.net/browse/OIM-406
//https://mxperu.atlassian.net/browse/OIM-413
//https://mxperu.atlassian.net/browse/OIM-426
router.post('/seguridad/usuario/recuperapassword',function(req, res){
  console.log(req.body);
  res.json({
    "Message":"",
    "Data":
      {
        "name":'Erick'
      },
    "OperationCode":200,
    "YypeMessage":"success"
  });
});

//https://mxperu.atlassian.net/browse/OIM-425
router.post('/seguridad/acceso/reenviacorreo',function(req, res){
  console.log(req.body);
  res.json({
    "Data": [],
    "message": "",
    "operationCode": 200,
    "typeMessage": "success"
  });
});

//https://mxperu.atlassian.net/browse/OIM-424
router.post('/seguridad/acceso/registrarnuevo',function(req, res){
  console.log(req.body);
  res.json({
    "Data": 
      {
        "name":'Erick'
      },
    "message": "",
    "operationCode": 200,
    "typeMessage": "success"
  });
});

router.get('/claims/rolesPorUsuario', function(req, res) {
  return res.json({"message":"","data":[{"nombreAplicacion":"STEW","codigoRol":"ADMIN","nombreRol":"ADMINISTRACION MAPFRE"},{"nombreAplicacion":"NSCTR","codigoRol":"BROKER","nombreRol":"CORREDOR DE POLIZAS DE PERIODO CORTO"},{"nombreAplicacion":"INSPEC","codigoRol":"ADMIN","nombreRol":"ADMINISTRADOR"},{"nombreAplicacion":"GCW","codigoRol":"GESTOR","nombreRol":"ADMINISTRADOR OIM"},{"nombreAplicacion":"EMISA","codigoRol":"FULANO","nombreRol":"ROLES POR USUARIO"},{"nombreAplicacion":"DACC","codigoRol":"BROKER","nombreRol":"BROKER"},{"nombreAplicacion":"CWVI","codigoRol":"AGENTEV","nombreRol":"AGENTE VIDA DE CWVI"},{"nombreAplicacion":"CPAO","codigoRol":"ADMIN","nombreRol":"ADMINISTRADOR DE APLICACION CPAO"},{"nombreAplicacion":"AUTOLIQ","codigoRol":"AGT_VIDA","nombreRol":"AGENTE"},{"nombreAplicacion":"ACTTER","codigoRol":"BROKER","nombreRol":"BROKER"}],"operationCode":0,"typeMessage":"info"});
});

module.exports = router;