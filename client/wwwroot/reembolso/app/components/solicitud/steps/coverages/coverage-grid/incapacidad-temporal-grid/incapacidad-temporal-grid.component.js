'use strict';

define(['angular', 'lodash'], function (ng, _) {
  ReTemporaryDisabilityGridController.$inject = ['reServices'];

  function ReTemporaryDisabilityGridController(reServices) {
    var vm = this;
    vm.$onInit = onInit;
    vm.$onChanges = onChanges;
    vm.deleteItem = deleteItem;
    vm.editItem = editItem;
    vm.formatDateToSlash = formatDateToSlash;

    function onInit() {}

    function onChanges(changes) {
      if (changes.compensationList) {
        vm.sumBenefitDays = reServices.sumProperty(vm.compensationList, 'benefitNumberDays');
        vm.totalBenefitImport = reServices.sumProperty(vm.compensationList, 'compensationAmount');
      }
    }

    function deleteItem(item) {
      var data = {
        compensationCorrelativeNumber: item.compensationCorrelativeNumber,
        compensationStatus: item.compensationStatus,
        index: item.index,
        serviceName: 'AnnularTemporaryDisability'
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
    .controller('ReTemporaryDisabilityGridController', ReTemporaryDisabilityGridController)
    .component('reTemporaryDisabilityGrid', {
      templateUrl: '/reembolso/app/components/solicitud/steps/coverages/coverage-grid/incapacidad-temporal-grid/incapacidad-temporal-grid.html',
      controller: 'ReTemporaryDisabilityGridController as $ctrl',
      bindings: {
        edit: '<?',
        delete: '<?',
        compensationList: '<',
        coverage: '<',
        readOnly: '<?'
      }
    })
})
