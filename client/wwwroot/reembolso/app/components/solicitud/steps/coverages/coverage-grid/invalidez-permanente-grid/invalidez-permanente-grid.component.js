'use strict';

define(['angular', 'lodash'], function (ng, _) {
  RePermanentDisabilityGridController.$inject = ['reServices'];

  function RePermanentDisabilityGridController(reServices) {
    var vm = this;
    vm.$onInit = onInit;
    vm.$onChanges = onChanges;
    vm.deleteItem = deleteItem;
    vm.editItem = editItem;
    vm.formatDateToSlash = formatDateToSlash;

    function onInit() {}

    function onChanges(changes) {
      if (changes.compensationList) {
        vm.sumPctg = reServices.sumProperty(vm.compensationList, 'pctngBeneficiaryParticipation');
        vm.sumImporte = reServices.sumProperty(vm.compensationList, 'benefitImport');
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
    .controller('RePermanentDisabilityGridController', RePermanentDisabilityGridController)
    .component('rePermanentDisabilityGrid', {
      templateUrl: '/reembolso/app/components/solicitud/steps/coverages/coverage-grid/invalidez-permanente-grid/invalidez-permanente-grid.html',
      controller: 'RePermanentDisabilityGridController as $ctrl',
      bindings: {
        edit: '<?',
        delete: '<?',
        compensationList: '<',
        readOnly: '<?'
      }
    })
})
