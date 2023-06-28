define(['angular',
  '/scripts/mpf-main-controls/components/modalTextArea/component/modalTextArea.js',
  '/cgw/app/solicitudCG/component/modalPreExistencias.js'
], function(ng) {

  SummaryController.$inject = ['$scope', '$uibModal'];

  function SummaryController($scope, $uibModal) {
    var vm = this;

    vm.collapse = collapse;
    vm.getObservaciones = getObservaciones;
    vm.getPreexistencias = getPreexistencias;
    vm.listShow = [];
    vm.showObservaciones = showObservaciones;
    vm.showPreExistencias = showPreExistencias;
    vm.currentStep = +vm.currentStep;

    ng.isNumber(+vm.stepToActivate) && (vm.listShow[+vm.stepToActivate] = true);

    function collapse(idx) {
      vm.listShow[idx] = !vm.listShow[idx];
    }

    function getObservaciones() {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        template: '<mpf-modal-text-area data="observacionesData" close="close()"></mpf-modal-text-area>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function() {
            $uibModalInstance.close();
          };
          scope.observacionesData = vm.data.remark.description;
        }]
      });
    }

    function getPreexistencias() {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        windowTopClass: 'modal--md fade',
        template: '<mpf-modal-pre-existencias data="data" close="close()"></mpf-modal-pre-existencias>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function() {
            $uibModalInstance.close();
          };
          scope.data = {
            lista: vm.data.preexistences
          };
        }]
      });
    }

    function showObservaciones() {
      if (vm.data.remark) {
        return vm.data.remark.description ? true : false;
      }
      return false;
    }

    function showPreExistencias() {
      if (vm.data.preexistences) {
        return vm.data.preexistences.length > 0 ? true : false;
      }
      return false;
    }

  } // end controller

  return ng.module('appCgw')
    .controller('SummaryController', SummaryController)
    .component('mfSummary', {
      templateUrl: '/cgw/app/solicitudCG/component/mf-summary.html',
      controller: 'SummaryController',
      bindings: {
        data: '=?',
        currentStep: '=?',
        stepToActivate: '=?'
      }
    });
});