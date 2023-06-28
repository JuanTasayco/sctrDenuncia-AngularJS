'use strict';

define(['angular', 'lodash'], function (ng, _) {
  ReGastosCuracionGridController.$inject = ['reServices'];

  function ReGastosCuracionGridController(reServices) {
    var vm = this;
    vm.$onInit = onInit;
    vm.$onChanges = onChanges;
    vm.editItem = editItem;
    vm.mapNameProcedures = mapNameProcedures;
    vm.formatDateToSlash = formatDateToSlash;
    vm.formatComprobante = formatComprobante;

    function onInit() {}

    function onChanges(changes) {
      if (changes.comprobantesList) {
        vm.sumImporte = reServices.sumProperty(vm.comprobantesList, 'invoiceTotalValue');
        vm.totalList(vm.sumImporte);
      }
    }

    function editItem(item) {
      vm.edit(item);
    }

    function mapNameProcedures(arrProcedures) {
      var arr = _.map(arrProcedures, function (item) {
        return item.diagnosticDto ? item.diagnosticDto.code : item.diagnostic.code;
      });

      return arr.toString();
    }

    function formatDateToSlash(date) {
      return reServices.formatDateToSlash(date);
    }

    function formatComprobante(serial, number) {
      var zeroNumbers = '';
      if (number.length < 8) {
        var iterationsNumber = 8 - number.length;

        for (var i = 0; i < iterationsNumber; i++) {
          zeroNumbers += '0'
        }
      }

      return serial + '-' + zeroNumbers + number;
    }
  }

  return ng
    .module('appReembolso')
    .controller('ReGastosCuracionGridController', ReGastosCuracionGridController)
    .component('reGastosCuracionGrid', {
      templateUrl: '/reembolso/app/components/solicitud/steps/coverages/coverage-grid/gastos-curacion-grid/gastos-curacion-grid.html',
      controller: 'ReGastosCuracionGridController as $ctrl',
      bindings: {
        edit: '<?',
        delete: '<?',
        comprobantesList: '<',
        totalList: '<',
        readOnly: '<?'
      }
    })
})
