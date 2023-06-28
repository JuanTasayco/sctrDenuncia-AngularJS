/**
 * ClientesController
 *
 * @description :: Server-side logic for managing clientes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict';

var data = require('./departamentos');
var dataClientes = require('./clientes');
var _ = require('lodash');

module.exports = {
  ubigeoPeru: function(req, res) {
    var id = req.param('id');
    var dataCliente = (!id ? data.clientes['PERU'] : data.clientes[id] || {});
    var respFilter = {};
    respFilter.Message = 'exito';
    respFilter.OperationCode = 200;
    respFilter.TypeMessage = 'success';
    respFilter.Data = dataCliente;

    setTimeout(function() {
      res.json('200', respFilter);
    }, 1000);
  },
  entidad: function(req, res) {
    var objReq = req.body;
    var idProd = objReq.producto;

    var respFilter = {};
    respFilter.Message = 'exito';
    respFilter.OperationCode = 200;
    respFilter.TypeMessage = 'success';
    console.log(objReq);

    if (idProd === 'J') {
      respFilter.Data = dataClientes.empresasAAMM;
    } else {
      respFilter.Data = dataClientes.empresas;
    }

    console.log(' cliente/entidad ====> Filtro1: ' +req.param('filtro1') + ', Filtro2: ' +req.param('filtro2') );
    setTimeout(function() {
      res.json('200', respFilter);
    }, 1000);
  },
  cobertura: function(req, res) {
    var respFilter = {};
    respFilter.Message = 'exito';
    respFilter.OperationCode = 200;
    respFilter.TypeMessage = 'success';
    respFilter.Data = {};

    respFilter.Data.lista = [
      { "name": "Consulta ambulatoria",
        "copago_fijo": "$10 por consulta",
        "copago_variable": "80%",
        "fin_carencia": "17/03/2019"
      },
      { "name": "Hospitalario",
        "copago_fijo": "$5 por consulta",
        "copago_variable": "80%",
        "fin_carencia": "17/03/2017"
      },
      { "name": "Consulta ambulatoria",
        "copago_fijo": "$15 por consulta",
        "copago_variable": "80%",
        "fin_carencia": "17/03/2018"
      }
    ];

    setTimeout(function() {
      res.json('200', respFilter);
    }, 500);
  },

  //  clientes/afiliados/buscar
  afiliados: function(req, res) {
    var objReq = req.body;
    var dni = objReq.dni;
    var apellidos = objReq.apellidos;
    console.log(objReq);

    // var arrAfiliados = _.slice(dataClientes.afiliados, 0, 5) || [];
    var arrAfiliados = dataClientes.afiliados;
    var arrLength;
    var listaRespFilter;
    var respFilter = {};
    respFilter.Message = 'exito';
    respFilter.OperationCode = 200;
    respFilter.TypeMessage = 'success';
    respFilter.Data = {};

    var listaRespFilterFn = function fn(afiliado) {
      var regxName = new RegExp(apellidos, 'gi');
      var regxDNI = new RegExp(dni, 'gi');

      var testName = apellidos ? regxName.test(afiliado.asegurado.name) : false;
      var testDNI = dni ? regxDNI.test(afiliado.asegurado.dni) : false;

      return testName || testDNI;
    }

    //  si llegan a busqueda clientes desde la página de empresas
    var listaRespFilter = apellidos || dni ? arrAfiliados.filter(listaRespFilterFn) : arrAfiliados;

    arrLength = listaRespFilter.length;

    respFilter.Data.total = arrLength;
    respFilter.Data.nroPaginas = 13;
    respFilter.Data.lista = listaRespFilter;

    setTimeout(function() {
      res.json('200', respFilter);
    }, 500);
  }
};
