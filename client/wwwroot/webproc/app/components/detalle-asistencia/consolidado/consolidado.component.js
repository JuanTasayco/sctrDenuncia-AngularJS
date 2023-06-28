'use strict';

define(['angular', 'AsistenciaActions', 'lodash', 'wpConstant'], function(ng, AsistenciaActions, _, wpConstant) {
  ConsolidadoController.$inject = ['$interval', '$ngRedux', 'wpFactory', '$log'];

  function ConsolidadoController($interval, $ngRedux, wpFactory, $log) {
    var vm = this;
    var actionsRedux, updateIntervalPromise, oldFrm;
    vm.$onDestroy = onDestroy;
    vm.$onInit = onInit;
    vm.descargarVersionPDF = descargarVersionPDF;

    // declaracion

    function onInit() {
      actionsRedux = $ngRedux.connect(mapStateToThis, AsistenciaActions)(vm);
      oldFrm = ng.copy(vm.frm);
      vm.lstIndGenExp = wpConstant.indGenExp;
      vm.mIndGenExp = [];
      _autoUpdate();
      _getVersiones();
      _getServicios();
      _getConsolidado();
      vm.user = wpFactory.getCurrentUser();
    }

    function onDestroy() {
      $interval.cancel(updateIntervalPromise);
      actionsRedux();
    }

    function mapStateToThis(state) {
      return {
        frm: _.merge({}, state.detalle),
        frmsValidationStates: ng.copy(state.frmsValidationStates),
        isFrmRequire: state.frmStatus.require
      };
    }

    function _autoUpdate() {
      updateIntervalPromise = $interval(function() {
        if (wpFactory.help.isObjDifferent(oldFrm, vm.frm)) {
          oldFrm = ng.copy(vm.frm);
          vm.rdxConsolidadoUpdate(oldFrm);
          vm.rdxFrmSaved(false);
        }
      }, wpConstant.timeToUpdate);
    }

    function _getVersiones() {
      wpFactory.siniestro
        .GetVersion()
        .then(function gvSP(resp) {
          vm.lstVersiones = resp;
        })
        .catch(function gvEP(err) {
          vm.lstVersiones = [];
          $log.error('Falló el obtener versiones', err);
        });
    }

    function _getServicios() {
      wpFactory.siniestro
        .GetListServiec()
        .then(function glsSP(resp) {
          vm.lstServicios = resp;
        })
        .catch(function gvEP(err) {
          vm.lstServicios = [];
          $log.error('Falló el obtener servicios', err);
        });
    }

    function _getConsolidado() {
      wpFactory.siniestro
        .GetListAffected()
        .then(function glsSP(resp) {
          vm.lstConsolidado = resp;
          _setModelCbo(resp);
        })
        .catch(function gvEP(err) {
          vm.lstConsolidado = [];
          $log.error('Falló el obtener consolidado', err);
        });
    }

    function _setModelCbo(lstConsolidado) {
      _.each(lstConsolidado, function elc(item, idx) {
        vm.mIndGenExp[idx] = item.cobertura === 'S' ? wpConstant.indGenExp[0] : wpConstant.indGenExp[1];
      });
    }

    function descargarVersionPDF(objVersion) {
      if (wpFactory.getSiniestroNro()) {
        wpFactory.assistance.DownloadVersion(
          'api/Siniestro/versions/download/' + wpFactory.getNroAsistencia() + '/' + objVersion.idDocumento
        );
      } else {
        wpFactory.siniestro.DownloadVersionSinSiniestro(
          'api/Siniestro/versions/downloadSinSiniestro?fileName=' +
            objVersion.filename +
            '&idDocumento=' +
            _getNroByFileName(objVersion.filename)
        );
      }
    }

    function _getNroByFileName(fileName) {
      var idx__ = fileName.indexOf('__');
      var idxDot = fileName.indexOf('.');
      return fileName.substring(idx__ + 2, idxDot);
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('ConsolidadoController', ConsolidadoController)
    .component('wpConsolidado', {
      templateUrl: '/webproc/app/components/detalle-asistencia/consolidado/consolidado.html',
      controller: 'ConsolidadoController',
      bindings: {}
    });
});
