'use strict';

define(['angular'],
  function(ng) {
    reportesService.$inject = ['$q', 'Restangular', '$log'];

    function reportesService($q, Restangular, $log) {

      var service = {
        getProveedor: getProveedor,
        getReportesByFilter: getReportesByFilter,
        getReferencia: getReferencia,
        getPDF: getPDF,
        getObjReq: getObjReq,
        addObservacion: addObservacion,
        updateObservacion: updateObservacion,
        getCIE10: getCIE10,
        getCondicion: getCondicion,
        registrarReferencia: registrarReferencia
      };

      return service;

      /**
       *
       * helpers functions
       *
       */
      /*
      function getObjServicio(arrOrigen, nombreServicio) {
        var arrDest = [], obj = {}, arrLength = arrOrigen.length;

        for (var i = 0; i < arrLength; i++) {
          obj.tipoServicio = nombreServicio;
          obj.nombreServicio = arrOrigen[i].nombre;

          if (nombreServicio !== 'especialidades') {
            obj.idFiltro = arrOrigen[i].id;
          } else {
            obj.idFiltro = null;
            obj.filtroValue = arrOrigen[i].id;
          }
          arrDest.push(obj);
          obj = {};
        }

        return arrDest;
      }
      */

      function getObjReq(myflt) {
        var req = {},
          proveObj = {};

        req.filtros = [];

        myflt.order && (req.order = myflt.order);
        myflt.asegurado && (req.asegurado = myflt.asegurado);
        myflt.fechaInicio && (req.fechaInicio = myflt.fechaInicio);
        myflt.fechaFin && (req.fechaFin = myflt.fechaFin);
        myflt.refType && (req.origenCodReferencia = myflt.refType);
        myflt.revisado && (req.revisado = myflt.revisado);
        myflt.resPl && (req.resueltoOrigen = +myflt.resPl);
        myflt.origCentro && (req.origenCentro = myflt.origCentro.toUpperCase());

        myflt.origDepaPl && (req.origenCodDepartamento = myflt.origDepaPl);
        myflt.origProvPl && (req.origenCodProvincia = myflt.origProvPl);

        myflt.creador && (req.creador = myflt.creador);

        myflt.destCentro && (proveObj.nombreProveedor = myflt.destCentro.toUpperCase());
        myflt.destDepaPl && (proveObj.codigoDepartamento = myflt.destDepaPl);
        myflt.destProvPl && (proveObj.codigoProvincia = myflt.destProvPl);

        myflt.categoria && (proveObj.categoriaProveedorID = +myflt.categoria);
        myflt.entidad && (proveObj.tipoEntidadId = myflt.entidad);
        myflt.convenio && (proveObj.convenioId = myflt.convenio.toUpperCase());
        req.proveedores = [proveObj];

        req.esPaginacion = myflt.esPaginacion;  // valor booleano, por default recibimos false
        req.pageSize = +myflt.pageSize || 5;  // por defecto enviamos 5 si es que no lo seteamos
        myflt.pagina && (req.pagina = +myflt.pagina);

        return req;
      }

      /**
       *
       * service's functions to reveal as public
       *
       */

      function getProveedor(req) {
        var deferred = $q.defer();
        req.Patron = req.Patron.toUpperCase();
        Restangular.one('referencia').post('getUsuario', req).then(function postSFn(data) {
          deferred.resolve(data);
        }, function getEFn(error) {
          $log.info('factory error: ' + error);
        });

        return deferred.promise;
      }

      function getReportesByFilter(filter) {
        var myflt = filter || {},
          deferred = $q.defer();
        var req = getObjReq(myflt);

        Restangular.one('referencia').post('listaReferencia', req).then(function postSFn(data) {
          deferred.resolve(data.Data);
        }, function getEFn(error) {
          $log.info('factory error: ' + error);
        });

        return deferred.promise;
      }

      function getReferencia(id) {
        var deferred = $q.defer(),
          req = {};

        req.idReferencia = id;

        Restangular.one('referencia').post('detalleReferencia', req).then(function postSFn(data) {
          deferred.resolve(data.Data);
        }, function getEFn(error) {
          $log.info('factory error: ' + error);
        });

        return deferred.promise;
      }

      function getPDF(obj) {
        var deferred = $q.defer();

        Restangular.one('referencia/resumen').post('pdf', obj).then(function postSFn(data) {
          $log.info('Success');
          deferred.resolve(data);
        }, function getEFn(error) {
          $log.info('factory error: ' + error);
        });

        return deferred.promise;
      }

      function addObservacion(id, msg) {
        var deferred = $q.defer();
        var req = {
          idReferencia: id,
          descripcionObservacion: msg
        };

        Restangular.one('observacion').post('add', req).then(function postSFn(data) {
          deferred.resolve(data);
        }, function getEFn(error) {
          $log.info('factory error: ' + error);
        });

        return deferred.promise;
      }

      function updateObservacion(id, msg) {
        var deferred = $q.defer();
        var req = {
          idReferencia: id,
          descripcionObservacion: msg
        };

        Restangular.one('observacion').post('update', req).then(function postSFn(data) {
          deferred.resolve(data);
        }, function getEFn(error) {
          $log.info('factory error: ' + error);
        });

        return deferred.promise;
      }

      function getCIE10(req) {
        var deferred = $q.defer();
        req.Patron = req.Patron.toUpperCase();
        Restangular.one('referencia').post('getCIE10', req).then(function postSFn(data) {
          deferred.resolve(data);
        }, function getEFn(error) {
          $log.info('factory error: ' + error);
        });

        return deferred.promise;
      }

      function getCondicion() {
        var deferred = $q.defer();
        Restangular.one('referencia').post('getCondicion').then(function postSFn(data) {
          deferred.resolve(data);
        }, function getEFn(error) {
          $log.info('factory error: ' + error);
        });

        return deferred.promise;
      }

      function registrarReferencia(registro) {
        var deferred = $q.defer();

        registro.diagnosticoIngreso && (registro.diagnosticoIngreso = registro.diagnosticoIngreso.codigo);
        registro.diagnosticoEgreso && (registro.diagnosticoEgreso = registro.diagnosticoEgreso.codigo);
        registro.condicionPaciente && (registro.condicionPaciente = registro.condicionPaciente.Codigo);

        Restangular.one('refsig').post('add', registro).then(function postSFn(data) {
          deferred.resolve(data);
        }, function getEFn(error) {
          $log.info('factory error: ' + error);
        });

        return deferred.promise;
      }

    } //  end reportesService

    return ng.module('referenciaApp')
      .service('reportesService', reportesService);
  });
