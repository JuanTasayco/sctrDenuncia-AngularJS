'use strict';

define(['angular', 'lodash', 'reConstants'], function (ng, _, reConstants) {
  ReAttachmentsProcedimientosController.$inject = ['reFactory', '$log', '$http', '$uibModal', '$scope', 'reServices'];

  function ReAttachmentsProcedimientosController(reFactory, $log, $http, $uibModal, $scope, reServices) {
    var vm = this;
    vm.$onInit = onInit;
    vm.$onChanges = onChanges;
    vm.formatDateToSlash = formatDateToSlash;
    vm.showModalResumen = showModalResumen;

    function onInit() {
      vm.isCoverageCodeHealing = reConstants.coverages.gastosCuracion === vm.coverage;
    }

    function onChanges(changes) {
      if (changes.proceduresList) {
        vm.proceduresResumenList = vm.proceduresList || [];
        vm.sumImport = _sumImports();
      }
    }

    function formatDateToSlash(date) {
      return reServices.formatDateToSlash(date);
    }

    function showModalResumen() {
      if (vm.readOnly) {
        return void 0;
      }

      if (vm.coverage !== reConstants.coverages.gastosSepelio) {
        _showModalProcedures(vm.proceduresResumenList, vm.edit, vm.idCompany)
          .result
          .then(function (res) {
            _showModalProceduresImport(res).result.then(function (r) {
              vm.proceduresResumenList = r;
              vm.sumImport = _sumImports();
              vm.getProcedureList(vm.proceduresResumenList);
            })
          })
      } else {
        var sepelio = [{
          code: '372',
          description: 'SEPELIO',
          procedureGroupCode: 0
        }];

        var data = vm.proceduresResumenList.length > 0 ? vm.proceduresResumenList : sepelio;

        _showModalProceduresImport(data).result.then(function (r) {
          vm.proceduresResumenList = r;
          vm.sumImport = _sumImports();
          vm.getProcedureList(vm.proceduresResumenList);
        })
      }
    }

    // private

    function _showModalProcedures(proceduresSelectedList, edit, idCompany) {
      return $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        template: '<re-procedimientos-modal close="close($event)" procedures-selected-list="proceduresSelectedList" edit="edit" id-company="idCompany" coverage="coverage"></re-procedimientos-modal>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function (scope, $uibModalInstance) {
            scope.proceduresSelectedList = proceduresSelectedList;
            scope.edit = edit;
            scope.idCompany = idCompany;
            scope.coverage = vm.coverage;
            scope.close = function (ev) {
              ev && ev.status === 'ok' ? $uibModalInstance.close(ev.data) : $uibModalInstance.dismiss();
            };
          }
        ]
      });
    }

    function _showModalProceduresImport(proceduresList) {
      return $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        template: '<re-procedimientos-importe-modal procedures-list="proceduresList" diagnostic="diagnostic" treatment-init="treatmentInit" close="close($event)"></re-procedimientos-importe-modal>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function (scope, $uibModalInstance) {
            scope.proceduresList = proceduresList
            scope.diagnostic = vm.diagnostic;
            scope.treatmentInit = vm.treatmentInit;
            scope.close = function (ev) {
              ev && ev.status === 'ok' ? $uibModalInstance.close(ev.data) : $uibModalInstance.dismiss();
            };
          }
        ]
      });
    }

    function _sumImports() {
      var numsArr = _.map(vm.proceduresResumenList, function (item) {
        return parseFloat(item.importe || '0');
      })
      var sum = _.reduce(numsArr, function (prev, current) {
        return prev + current;
      });

      return sum;
    }

  }

  return ng
    .module('appReembolso')
    .controller('ReAttachmentsProcedimientosController', ReAttachmentsProcedimientosController)
    .component('reAttachmentsProcedimientos', {
      templateUrl: '/reembolso/app/components/solicitud/steps/attachments/attachments-procedimientos/attachments-procedimientos.html',
      controller: 'ReAttachmentsProcedimientosController as $ctrl',
      bindings: {
        listFile: '<?',
        getProcedureList: '<',
        proceduresList: '<?',
        edit: '<',
        idCompany: '<',
        coverage: '<',
        readOnly: '<',
        diagnostic: '<',
        treatmentInit: '<',
        hasProcedureError: '<'
      }
    })
})
