'use strict';

define(['angular', 'lodash'], function (ng, _) {
  ReAccidentalDeathGridController.$inject = ['reServices'];

  function ReAccidentalDeathGridController(reServices) {
    var vm = this;
    vm.$onInit = onInit;
    vm.$onChanges = onChanges;
    vm.deleteItem = deleteItem;
    vm.editItem = editItem;
    vm.formatDateToSlash = formatDateToSlash;

    function onInit() {}

    function onChanges(changes) {
      if (changes.compensationList) {
        vm.sumImport = reServices.sumProperty(vm.compensationList, 'benefitImport');
        vm.sumPercent = reServices.sumProperty(vm.compensationList, 'pctngBeneficiaryParticipation')
      }
    }

    function deleteItem(item) {
      var data = {
        compensationCorrelativeNumber: item.compensationCorrelativeNumber,
        compensationStatus: item.compensationStatus,
        pctngBeneficiaryParticipation: item.pctngBeneficiaryParticipation,
        index: item.index,
        serviceName: 'AnnularPermanentDisability'
      }
      vm.delete(data)
    }

    function editItem(item) {
      vm.edit(item);
    }

    function formatDateToSlash(date) {
      return reServices.formatDateToSlash(date);
    }
  }

  return ng
    .module('appReembolso')
    .controller('ReAccidentalDeathGridController', ReAccidentalDeathGridController)
    .component('reAccidentalDeathGrid', {
      templateUrl: '/reembolso/app/components/solicitud/steps/coverages/coverage-grid/muerte-accidental-grid/muerte-accidental-grid.html',
      controller: 'ReAccidentalDeathGridController as $ctrl',
      bindings: {
        edit: '<?',
        delete: '<?',
        compensationList: '<',
        readOnly: '<?'
      }
    })
})
