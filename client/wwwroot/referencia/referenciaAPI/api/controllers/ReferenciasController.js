  /**
 * ReferenciasController
 *
 * @description :: Server-side logic for managing Proveedores
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict';

var data = require('./referencias');

module.exports = {
  filter: function(req, res) {
    var dataReferencia = data.referencias || {};
    var respFilter = {};
    respFilter.Message = 'exito';
    respFilter.OperationCode = 200;
    respFilter.TypeMessage = 'success';
    respFilter.Data = {};
    respFilter.Data.total = dataReferencia.length;
    respFilter.Data.nroPaginas = 13;
    respFilter.Data.lista = dataReferencia;

    setTimeout(function() {
      res.json('200', respFilter);
    }, 500);
  },
  referencia: function(req, res) {
    var respFilter = {};
    respFilter.Message = 'exito';
    respFilter.OperationCode = 200;
    respFilter.TypeMessage = 'success';
    respFilter.Data = data.referencia;

    setTimeout(function() {
      res.json('200', respFilter);
    }, 500);
  },
  pdf: function(req, res) {
    var respFilter = {};
    respFilter.Message = 'exito';
    respFilter.OperationCode = 200;
    respFilter.TypeMessage = 'success post';
    respFilter.Data = {};

    setTimeout(function() {
      res.json('200', respFilter);
    }, 1500);
  },
  excel: function(req, res) {
    var respFilter = {};
    respFilter.Message = 'exito';
    respFilter.OperationCode = 200;
    respFilter.TypeMessage = 'success post';
    respFilter.Data = {};

    setTimeout(function() {
      res.json('200', respFilter);
    }, 1500);
  },
  save: function(req, res) {
    var respFilter = {};
    var objReq = req.body;
    respFilter.Message = 'exito';
    respFilter.OperationCode = 200;
    respFilter.TypeMessage = 'success post';
    respFilter.Data = {
      idReferencia: '123123'
    };
    console.log(objReq);
    setTimeout(function() {
      res.json('200', respFilter);
    }, 1500);
  }
};
