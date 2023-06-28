'use strict';

define(['angular', 'moment', 'lodash'], function(ng, moment, _) {
  detalleAlertaController.$inject = ['inspecFactory', '$timeout'];

  function detalleAlertaController(inspecFactory, $timeout) {
    var vm = this;
    vm.$onInit = onInit;
    vm.clearValues = clearValues;
    vm.getProviders = getProviders;
    vm.getInspectors = getInspectors;
    vm.queryReport = queryReport;
    vm.generateReport = generateReport;

    function onInit() {
      vm.today = new Date();
      clearValues();
      getInspectors();
      getProviders();
    }

    function clearValues() {
      vm.query = {};
      vm.query.mFrom = moment()
        .subtract(1, 'months')
        .toDate();
      vm.query.mTo = moment().toDate();
      vm.query.mInspector = null;
      vm.query.mProvider = null;
      vm.showResult = false;
      vm.reportProperties = null;
    }

    function getInspectors() {
      var typeProvider = null;
      var nroProvider = null;

      if (vm.query.mProvider && vm.query.mProvider.documentCode) {
        typeProvider = vm.query.mProvider.documentType;
        nroProvider = vm.query.mProvider.documentCode;
      }

      vm.inspectors = [];
      inspecFactory.common.searchInspectors(typeProvider, nroProvider, true).then(function(response) {
        _.map(response, function(inspector) {
          inspector.fullName =
            inspector.name +
            ' ' +
            (inspector.lastName ? inspector.lastName : '') +
            ' ' +
            (inspector.motherLastName ? inspector.motherLastName : '');
          return inspector;
        });
        vm.inspectors = response;
      });
    }

    function getProviders() {
      return inspecFactory.common.GetProviders().then(function(response) {
        vm.providers = response;
      });
    }

    function queryReport() {
      vm.showResult = false;
      $timeout(function() {
        vm.showResult = true;
      }, 500);
    }

    function generateReport(extension) {
      var request = {
        startDate: vm.query.mFrom,
        endDate: vm.query.mTo,
        extension: extension,
        providerCode: vm.query.mProvider ? vm.query.mProvider.documentCode : null,
        providerTypeCode: vm.query.mProvider ? vm.query.mProvider.documentType : null,
        inspectorId: vm.query.mInspector ? vm.query.mInspector.inspectorId : null
      };

      inspecFactory.reports.reportAlerts(request, true);
    }
  }

  return ng
    .module('appInspec')
    .controller('DetalleAlertaController', detalleAlertaController)
    .component('inspecDetalleAlerta', {
      templateUrl: '/inspec/app/components/reportes/detalle-alerta/detalle-alerta.html',
      controller: 'DetalleAlertaController',
      controllerAs: '$ctrl'
    });
});
