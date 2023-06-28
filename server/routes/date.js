/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();


router.get('/date/mes',function(req, res){
  res.json({
    "Message":"",
    "Data":[
    {
    "Codigo":"1",
    "Descripcion":"Enero"
    },
    {
    "Codigo":"2",
    "Descripcion":"Febrero"
    },
    {
    "Codigo":"3",
    "Descripcion":"Marzo"
    },
    {
    "Codigo":"4",
    "Descripcion":"Abril"
    },
    {
    "Codigo":"5",
    "Descripcion":"Mayo"
    },
    {
    "Codigo":"6",
    "Descripcion":"Junio"
    },
    {
    "Codigo":"7",
    "Descripcion":"Julio"
    },
    {
    "Codigo":"8",
    "Descripcion":"Agosto"
    },
    {
    "Codigo":"9",
    "Descripcion":"Septiembre"
    },
    {
    "Codigo":"10",
    "Descripcion":"Octubre"
    },
    {
    "Codigo":"11",
    "Descripcion":"Noviembre"
    },
    {
    "Codigo":"12",
    "Descripcion":"Diciembre"
    }],
    "OperationCode":200,
    "TypeMessage":"success",
    "Title":"Operación Exitosa",
    "Icon":"glyphicon glyphicon-ok-sign"
  });
});

router.get('/date/dia',function(req, res){
  res.json({
    "Message":"",
    "Data":[
    {
    "Codigo":"1",
    "Descripcion":"1"
    },
    {
    "Codigo":"2",
    "Descripcion":"3"
    },
    {
    "Codigo":"4",
    "Descripcion":"4"
    },
    {
    "Codigo":"5",
    "Descripcion":"5"
    },
    {
    "Codigo":"6",
    "Descripcion":"6"
    },
    {
    "Codigo":"7",
    "Descripcion":"7"
    },
    {
    "Codigo":"8",
    "Descripcion":"8"
    },
    {
    "Codigo":"9",
    "Descripcion":"9"
    }],
    "OperationCode":200,
    "TypeMessage":"success",
    "Title":"Operación Exitosa",
    "Icon":"glyphicon glyphicon-ok-sign"
  });
});


router.get('/date/anio',function(req, res){
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




module.exports = router;