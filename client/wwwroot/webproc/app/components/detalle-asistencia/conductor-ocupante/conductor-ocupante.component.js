'use strict';

define(['angular', 'AsistenciaActions', 'lodash', 'wpConstant'], function(ng, AsistenciaActions, _, wpConstant) {
  ConductorOcupanteController.$inject = ['wpFactory', '$ngRedux', '$interval', '$scope'];
  function ConductorOcupanteController(wpFactory, $ngRedux, $interval, $scope) {
    var vm = this;
    var actionsRedux, updateIntervalPromise, oldFrm, watchFrmRequire;
    vm.$onDestroy = onDestroy;
    vm.$onInit = onInit;
    vm.agregarOcupante = agregarOcupante;
    vm.editarOcupante = editarOcupante;
    vm.eliminarOcupante = eliminarOcupante;
    vm.changeNacimiento = changeNacimiento;
    vm.changeLesion = changeLesion;

    // declaracion

    function onInit() {
      actionsRedux = $ngRedux.connect(mapStateToThis, AsistenciaActions)(vm);
      vm.frm.tab2 = {};
      vm.dateFormat = 'dd/MM/yyyy';
      oldFrm = ng.copy(vm.frm);
      _autoUpdate();
      watcherFrmRequire();
    }

    function onDestroy() {
      $interval.cancel(updateIntervalPromise);
      actionsRedux();
      watchFrmRequire();
    }

    function mapStateToThis(state) {
      return {
        frm: _.merge({}, state.detalle),
        frmsValidationStates: ng.copy(state.frmsValidationStates),
        lstOcupantes: ng.copy(state.detalle.ocupantes),
        isFrmRequire: state.frmStatus.require
      };
    }

    function watcherFrmRequire() {
      watchFrmRequire = $scope.$watch('$ctrl.isFrmRequire', function(nv) {
        if (nv) {
          vm.frmConductorObj.markAsPristine();
        }
      });
    }

    function _autoUpdate() {
      updateIntervalPromise = $interval(function() {
        if (wpFactory.help.isObjDifferent(oldFrm, vm.frm)) {
          oldFrm = ng.copy(vm.frm);
          vm.rdxDetalleUpdate(oldFrm);
          vm.rdxFrmsValidate({conductor: vm.frmConductorObj.$valid});
          vm.rdxFrmSaved(false);
        }
      }, wpConstant.timeToUpdate);
    }

    function changeNacimiento() {
      vm.frm.conductor.edadCondutor = wpFactory.help.calcularEdad(vm.fechaNacimiento);
    }

    function changeLesion() {
      if (!vm.frm.conductor.codigoLesionConductor) {
        vm.frm.conductor.diagnosticoLesionConductor = '';
      }
    }

    function agregarOcupante(event) {
      vm.rdxOcupantesDirectosAdd(event.ocupante);
    }

    function editarOcupante(event) {
      vm.rdxOcupantesDirectosEdit(event.idx, event.ocupante);
    }

    function eliminarOcupante(event) {
      vm.rdxOcupantesDirectosDelete(event.idx);
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('ConductorOcupanteController', ConductorOcupanteController)
    .component('wpConductorOcupante', {
      templateUrl: '/webproc/app/components/detalle-asistencia/conductor-ocupante/conductor-ocupante.html',
      controller: 'ConductorOcupanteController',
      bindings: {}
    });
});
