/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
console.log('test-anofabricacion');

router.get('/automovil/anofabricacion/30/284/1/',function(req, res){
  console.log(req.body);
  res.json({
   "Message":"",
   "Data":[
      {
         "Codigo":"2016",
         "Descripcion":"2016"
      },
      {
         "Codigo":"2015",
         "Descripcion":"2015"
      },
      {
         "Codigo":"2014",
         "Descripcion":"2014"
      },
      {
         "Codigo":"2013",
         "Descripcion":"2013"
      },
      {
         "Codigo":"2012",
         "Descripcion":"2012"
      },
      {
         "Codigo":"2011",
         "Descripcion":"2011"
      },
      {
         "Codigo":"2010",
         "Descripcion":"2010"
      },
      {
         "Codigo":"2009",
         "Descripcion":"2009"
      },
      {
         "Codigo":"2008",
         "Descripcion":"2008"
      },
      {
         "Codigo":"2007",
         "Descripcion":"2007"
      },
      {
         "Codigo":"2006",
         "Descripcion":"2006"
      },
      {
         "Codigo":"2005",
         "Descripcion":"2005"
      },
      {
         "Codigo":"2004",
         "Descripcion":"2004"
      },
      {
         "Codigo":"2003",
         "Descripcion":"2003"
      },
      {
         "Codigo":"2002",
         "Descripcion":"2002"
      },
      {
         "Codigo":"2001",
         "Descripcion":"2001"
      },
      {
         "Codigo":"2000",
         "Descripcion":"2000"
      }
    ],
   "OperationCode":200,
   "TypeMessage":"success",
   "Title":"Operación Exitosa",
   "Icon":"glyphicon glyphicon-ok-sign"
  });
});

router.get('/automovil/anofabricacion/31/285/21/',function(req, res){
  console.log(req.body);
  res.json({
   "Message":"",
   "Data":[
      {
         "Codigo":"2016",
         "Descripcion":"2016"
      }
    ],
   "OperationCode":200,
   "TypeMessage":"success",
   "Title":"Operación Exitosa",
   "Icon":"glyphicon glyphicon-ok-sign"
  });
});

module.exports = router;