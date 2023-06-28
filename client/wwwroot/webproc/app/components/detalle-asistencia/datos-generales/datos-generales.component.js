'use strict';

define(['angular', 'lodash', 'AsistenciaActions', 'wpConstant'], function(ng, _, AsistenciaActions, wpConstant) {
  DatosGeneralesController.$inject = ['wpFactory', '$log', '$scope', '$interval', '$ngRedux'];
  function DatosGeneralesController(wpFactory, $log, $scope, $interval, $ngRedux) {
    var vm = this;
    var actionsRedux, updateIntervalPromise, oldFrm, watchFrmRequire, isSeteado, countToUnBlock;
    vm.$onDestroy = onDestroy;
    vm.$onInit = onInit;
    vm.changeTipoSiniestro = changeTipoSiniestro;
    vm.onChangeLstDetalleSiniestroPorChoque = onChangeLstDetalleSiniestroPorChoque;
    vm.onChangeLstDetalleSiniestroPorRobo = onChangeLstDetalleSiniestroPorRobo;
    vm.onSeleccionRoturaLuna = onSeleccionRoturaLuna;
    vm.toggleComisariaManual = toggleComisariaManual;
    vm.changeExoneracionDenunciaDosaje = changeExoneracionDenunciaDosaje;

    // declaracion

    function onInit() {
      actionsRedux = $ngRedux.connect(mapStateToThis, AsistenciaActions)(vm);
      vm.dateFormat = 'dd/MM/yyyy';
      vm.frm.tab1 = {};
      vm.showRegistroInputComisaria = vm.frm.comisariaNoRegistrada ? true : false;
      _.isEmpty(vm.frm.detalleTipoSiniestro) || _setListaDetalleSiniestro();
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
        isFrmRequire: state.frmStatus.require,
        statusBlock: state.frmStatus
      };
    }

    function watcherFrmRequire() {
      watchFrmRequire = $scope.$watch('$ctrl.isFrmRequire', function(nv) {
        if (nv) {
          vm.frmGeneralObj.markAsPristine();
        }
      });
    }

    function _autoUpdate() {
      updateIntervalPromise = $interval(function() {
        if (wpFactory.help.isObjDifferent(oldFrm, vm.frm)) {
          oldFrm = ng.copy(vm.frm);
          vm.rdxDetalleUpdate(oldFrm);
          vm.rdxFrmsValidate({general: vm.frmGeneralObj.$valid});
          vm.rdxFrmSaved(false);
        }
      }, wpConstant.timeToUpdate);
    }

    function changeExoneracionDenunciaDosaje() {
      if (vm.frm.exoneraDenuncia) {
        vm.frm.conductor.fchDosajeConductor = '';
        vm.frm.conductor.horaDosajeConductor = '';
        vm.frm.conductor.resulDosajeConductor = '';
        vm.frm.conductor.oficioDosajeCondunctor = '';
      }
    }

    function toggleComisariaManual(goToManual) {
      if (goToManual) {
        vm.frm.codigoComisaria = {usercode: null, selectedEmpty: true};
      } else {
        vm.frm.comisariaNoRegistrada = '';
      }
      vm.showRegistroInputComisaria = goToManual ? true : false;
    }

    function changeTipoSiniestro() {
      if (vm.frm.tab1.siniestroTipo.codigoValor === '2') {
        vm.frm.tab1.rbDetaSiniestroPorChoque = null;
        vm.frm.tab1.roturaLuna = false;
      } else {
        vm.frm.tab1.lstSelDetaSiniestroPorRobo = [];
        isSeteado = true;
      }
      vm.frm.expediente = '';
    }

    function _setListaDetalleSiniestro() {
      vm.frm.detalleTipoSiniestro = _.map(vm.frm.detalleTipoSiniestro, function rmF(item, idx) {
        return _.assign({}, item, wpConstant.labelsDetalleSiniestro[idx]);
      });
      _paintDetalleSiniestro();
    }

    function _paintDetalleSiniestro() {
      vm.frm.tab1.lstDetalleSiniestroPorRobo = wpFactory.help.getDetaSiniestroRobo(vm.frm.detalleTipoSiniestro);
      vm.frm.tab1.lstDetalleSiniestroPorChoque = wpFactory.help.getDetaSiniestroChoque(vm.frm.detalleTipoSiniestro);
      var lstSelRobo = _.filter(vm.frm.tab1.lstDetalleSiniestroPorRobo, function flds(item) {
        return item.value;
      });
      vm.frm.tab1.lstSelDetaSiniestroPorRobo = _.map(lstSelRobo, function mlds(item) {
        return item.id;
      });

      var siniestroChoque = _.find(vm.frm.tab1.lstDetalleSiniestroPorChoque, 'value') || {};
      vm.frm.tab1.rbDetaSiniestroPorChoque = siniestroChoque.id;
      vm.frm.tab1.roturaLuna = vm.frm.detalleTipoSiniestro[12] && vm.frm.detalleTipoSiniestro[12].value;
      if (vm.frm.tab1.roturaLuna) {
        vm.frm.expediente = vm.frm.tab1.rbDetaSiniestroPorChoque ? 'PPD/PPL' : vm.frm.expediente;
      } else {
        vm.frm.expediente = vm.frm.expediente;
      }
    }

    function _updateDetalleSiniestro(frm, dataTab1) {
      var detalleSiniestro = wpFactory.help.getArrayTipoSiniestro(frm, dataTab1);
      vm.rdxDetalleUpdate({detalleTipoSiniestro: detalleSiniestro, expediente: vm.frm.expediente, tab1: vm.frm.tab1});
      _paintDetalleSiniestro();
    }

    function onChangeLstDetalleSiniestroPorChoque(radioItem) {
      if (vm.frm.tab1.rbDetaSiniestroPorChoque === radioItem.id) {
        vm.frm.tab1.rbDetaSiniestroPorChoque = null;
        vm.frm.expediente = vm.frm.tab1.roturaLuna ? 'PPL' : '';
      } else {
        vm.frm.tab1.rbDetaSiniestroPorChoque = radioItem.id;
        vm.frm.expediente = vm.frm.tab1.roturaLuna ? 'PPD/PPL' : 'PPD';
      }
      _updateDetalleSiniestro(vm.frm.detalleTipoSiniestro, vm.frm.tab1);
      
      if (
        !(
          vm.frm &&
          vm.frm.codigoTipoSiniestro === '2' && // Tipo de Siniestro = CHOQUE
          vm.frm.detalleTipoSiniestro.length === 14 && // Exista un Detalle de Siniestro
          vm.frm.detalleTipoSiniestro[13].value === true
        ) // Detalle del siniestro = Entre Vehiculos)
      ) {
        vm.frm.siniestroConvenio = {
          aplicaConvenio: false,
          codigoConvenioGolpe: 0,
          codigoEmpresaAseguradora: 0,
          numeroPlaca: ''
        };
      }
    
    }

    function onChangeLstDetalleSiniestroPorRobo(chkItem) {
      if (isSeteado && !countToUnBlock) {
        isSeteado = false;
        return void 0;
      }
      _.isNumber(countToUnBlock) && countToUnBlock--;
      if (chkItem.id === 1 && !isSeteado && countToUnBlock !== -1) {
        countToUnBlock = vm.frm.tab1.lstSelDetaSiniestroPorRobo.length - 2;
        vm.frm.tab1.lstSelDetaSiniestroPorRobo = [].concat(ng.copy(vm.frm.tab1.lstDetalleSiniestroPorRobo)[0].id);
        vm.frm.expediente = 'PTR';
        isSeteado = true;
      } else if (chkItem.id !== 1 && !isSeteado) {
        vm.frm.expediente = 'PPR';
        vm.frm.tab1.lstSelDetaSiniestroPorRobo = _.filter(vm.frm.tab1.lstSelDetaSiniestroPorRobo, function(item) {
          return item !== 1;
        });
      }
      vm.frm.expediente = vm.frm.tab1.lstSelDetaSiniestroPorRobo.length ? vm.frm.expediente : '';
      _updateDetalleSiniestro(vm.frm.detalleTipoSiniestro, vm.frm.tab1);
    }

    function onSeleccionRoturaLuna() {
      vm.frm.expediente = '';
      vm.frm.expediente = vm.frm.tab1.rbDetaSiniestroPorChoque ? 'PPD' : vm.frm.expediente;
      if (vm.frm.tab1.roturaLuna) {
        vm.frm.expediente = vm.frm.expediente ? vm.frm.expediente + '/PPL' : 'PPL';
      } else {
        vm.frm.expediente = vm.frm.expediente;
      }
      _updateDetalleSiniestro(vm.frm.detalleTipoSiniestro, vm.frm.tab1);
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('DatosGeneralesController', DatosGeneralesController)
    .component('wpDatosGenerales', {
      templateUrl: '/webproc/app/components/detalle-asistencia/datos-generales/datos-generales.html',
      controller: 'DatosGeneralesController',
      bindings: {}
    });
});
