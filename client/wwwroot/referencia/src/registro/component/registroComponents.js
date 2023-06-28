'use strict';
define(['angular', '/referencia/app/clientesProveedores/component/clienteProveedoresDetalleModal.js'], function(ng) {

  progressSummaryController.$inject = ['$scope', '$uibModal', '$timeout'];

  function progressSummaryController($scope, $uibModal, $timeout) {
    var vm = this;

    vm.$onInit = function oiFn() {
      vm.listShow = [];

      vm.listShow[1] = false;
      var getDataST = vm.datast;

      if (getDataST) {
        //  get data from storage
        getDataST.origen && (vm.origen = getDataST.origen);
        getDataST.paciente && (vm.paciente = getDataST.paciente);
        getDataST.filtrosDestino && (vm.filter = getDataST.filtrosDestino);
      }
    };

    vm.openClientProveedoresDetailModal = function(afiliado, type) {
      var modalInstance = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: true,
        animation: vm.animationsEnabled,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal-cpd fade',
        template: '<modalcpd-referencia close="close()" afiliado="infoAfiliado">HLEO</modalcpd-referencia>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function() {
            $uibModalInstance.close();
          };

          scope.infoAfiliado = {};
          scope.infoAfiliado.clsIsLoading = 'modal-data--is-loading';
          scope.infoAfiliado.info = afiliado;
          type === 'asegurado' && (scope.infoAfiliado.info.cobertura = null);

          $timeout(function() {
            scope.infoAfiliado.clsIsLoading = '';
          }, 500);
        }]
      });
      modalInstance.result.then(function() {}, function() {});
    };

    vm.collapse = function icFn(idx) {
      vm.listShow[idx] = !vm.listShow[idx];
    };
  }

  return ng.module('referenciaApp')
    .controller('ProgressSummaryController', progressSummaryController)
    .component('mfprogressSummary', {
      templateUrl: '/referencia/app/registro/component/progressSummary.html',
      controller: 'ProgressSummaryController',
      bindings: {
        datast: '='
      }
    })
    .component('mfstep', {
      templateUrl: '/referencia/app/registro/component/steps.html',
      bindings: {
        step: '='
      }
    });
});
