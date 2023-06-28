'use strict';

define(['angular', 'lodash', 'wpConstant'], function(ng, _, wpConstant) {
  FiltroController.$inject = ['wpFactory', '$log', '$timeout', '$scope'];
  function FiltroController(wpFactory, $log, $timeout, $scope) {
    var vm = this;
    var watchAssistance, watchSinester;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.limpiarFrm = limpiarFrm;
    vm.handleFiltrarFrm = handleFiltrarFrm;

    function onInit() {
      vm.frm = {};
      vm.dateFormat = 'dd/MM/yyyy';
      watcherAssistance();
      watcherSinester();
      $timeout(_setStateFiltroByRole, 0);
      $timeout(function tgr() {
        vm.isAdminOrSuperv = wpFactory.isAdminOrSupervisor();
      }, 0);
      vm.frm.fromDate = new Date();
      vm.frm.toDate = new Date();
      getUsers();
    }

    function onDestroy() {
      watchAssistance();
      watchSinester();
    }

    function watcherAssistance() {
      watchAssistance = $scope.$watch('$ctrl.frm.assistanceNumber', function(nv) {
        if (!nv) {
          return void 0;
        }

        vm.isStringAssistance = _.isNumber(+nv) && !_.isNaN(+nv) ? false : true;
      });
    }

    function watcherSinester() {
      watchSinester = $scope.$watch('$ctrl.frm.sinesterNumber', function(nv) {
        if (!nv) {
          return void 0;
        }

        vm.isStringSinester = _.isNumber(+nv) && !_.isNaN(+nv) ? false : true;
      });
    }

    function limpiarFrm() {
      vm.frm.assistanceNumber = '';
      vm.frm.sinesterNumber = '';
      vm.frm.licensePlate = '';
      vm.frm.state = {codigoValor: '', nombreValor: 'TODOS'};
      vm.frm.user = {usercode: null, selectedEmpty: true};
      vm.frm.fromDate = new Date();
      vm.frm.toDate = new Date();

      vm.handleFiltrarFrm();
    }

    function _setStateFiltroByRole() {
      if (wpFactory.isProcOrObservador()) {
        vm.lstEstado = wpConstant.estadoParaProcurador;
      } else {
        vm.lstEstado = wpConstant.estadoParaNoProcurador;
      }
    }

    // Envio de data al componente padre: bandeja
    function handleFiltrarFrm(form) {
      var frmFormateado = ng.copy(form || vm.frm);
      var plate = frmFormateado.licensePlate || '';
      frmFormateado.licensePlate = plate.toUpperCase();

      if (vm.isStringAssistance || vm.isStringSinester) {
        frmFormateado.isInvalid = true;
      }

      vm.onFiltrarFrm({
        $event: {
          frm: frmFormateado
        }
      });
    }

    function getUsers() {
      wpFactory.lookup
        .GetUsers()
        .then(function(resp) {
          var user = wpFactory.getCurrentUser().loginUserName.toUpperCase();
          vm.lstUsuarios = resp;
          if (wpFactory.isProcOrObservador()) {
            vm.frm.user = wpFactory.help.seleccionarCombo(vm.lstUsuarios, 'usercode', user);
            vm.frm.user || (vm.frm.user = {usercode: user.trim()});
          }
          vm.bindFiltroFrm = handleFiltrarFrm;
        })
        .catch(function guEPr(err) {
          $log.error('Falló el obtener users', err);
        });
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('FiltroController', FiltroController)
    .component('wpFiltro', {
      templateUrl: '/webproc/app/components/bandeja/filtro/filtro.html',
      controller: 'FiltroController',
      bindings: {
        onFiltrarFrm: '&?',
        bindFiltroFrm: '=?'
      }
    });
});
