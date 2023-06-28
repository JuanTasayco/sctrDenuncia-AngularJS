  /**
 * ProveedoresController
 *
 * @description :: Server-side logic for managing Proveedores
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict';

var data = require('./departamentos');
var dataprov = require('./proveedores');
var _ = require('lodash');

module.exports = {
  // mapa proveedores
  ubigeoPeru: function(req, res) {
    var id = req.param('id');
    var dataProveedores = (!id ? data.proveedores['peru'] : data.proveedores[id] || {});
    var respFilter = {};
    respFilter.Message = 'exito';
    respFilter.OperationCode = 200;
    respFilter.TypeMessage = 'success';
    respFilter.Data = dataProveedores;

    setTimeout(function() {
      res.json('200', respFilter);
    }, 1000);
  },
  filter: function(req, res) {
    var proveedores = dataprov.proveFilter;
    var objReq = req.body;
    console.log(objReq);

    var nom = objReq.nom
    var idCate = objReq.categoria;
    var idConvenio = objReq.idConvenio;
    var idTipo = objReq.entidad;
    var idEsp = objReq.especialidades;
    var arrServicios = objReq.servicios;
    var arrEspecialidades = objReq.especialidades;

    var respFilter = {};
    respFilter.Message = 'exito';
    respFilter.OperationCode = 200;
    respFilter.TypeMessage = 'success';
    respFilter.Data = {};
    var respArr = [];
    var arrLength = proveedores.length;

    var regxName = new RegExp(nom, 'i');

    if (nom) {
      for (var i = 0; i < arrLength; i++) {
        var textName = ((nom === undefined) ? false : regxName.test(proveedores[i].nom));

        textName && respArr.push(proveedores[i]);
      }
    } else if (idCate === 6
        && idConvenio === 'c'
        && idTipo === 32
        || _.includes(arrEspecialidades, 'TRAUMATOLOGÍA')
        || _.includes(arrServicios, 36)
        || _.includes(arrServicios, 59)
        ) {
      respArr.push(proveedores[3], proveedores[4]);
    } else {
      respArr = proveedores.slice(0,5); // solo mostrar 5 para simular la cantidad de items del paginador
    }

    respFilter.Data.total = respArr.length;
    respFilter.Data.nroPaginas = 13;
    respFilter.Data.lista = respArr;

    setTimeout(function() {
      res.json('200', respFilter);
    }, 1000);
  },
  detalles: function(req, res) {
    var dataProveedor = dataprov.detalles;
    var objReq = req.body;

    var respFilter = {};
    respFilter.Message = 'exito';
    respFilter.OperationCode = 200;
    respFilter.TypeMessage = 'success';
    respFilter.Data = {};
    console.log(new Date().toLocaleTimeString());
    console.log(objReq);

    var idProvee = objReq.idProveedor;
    //  si no existe la clinica (solo tenemos 5), entonces devolver la data de la clinica "1"
    respFilter.Data = dataProveedor[idProvee] ? dataProveedor[idProvee] : dataProveedor[1];

    setTimeout(function() {
      res.json('200', respFilter);
    }, 700);
  }
};
