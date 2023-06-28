'use strict';

define(['angular', 'moment', 'lodash'], function(ng, moment, _) {
  seguimientoController.$inject = ['inspecFactory', '$timeout'];

  function seguimientoController(inspecFactory, $timeout) {
    var vm = this;
    vm.$onInit = onInit;
    vm.clearValues = clearValues;
    vm.getAgents = getAgents;
    vm.queryReport = queryReport;
    vm.generateReport = generateReport;

    function onInit() {
      vm.today = new Date();
      clearValues();
      getInspectors();
      getStatuses();
    }

    function clearValues() {
      vm.query = {};
      vm.query.mFrom = moment()
        .subtract(1, 'months')
        .toDate();
      vm.query.mTo = moment().toDate();
      vm.query.mInspector = null;
      vm.query.mAgent = null;
      vm.query.mStatus = null;
      vm.showResult = false;
    }

    function getInspectors() {
      return inspecFactory.common.searchInspectors(null, null, true).then(function(response) {
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

    function getAgents(input) {
      return inspecFactory.common.getAgents(input).then(function(response) {
        return response.Data;
      });
    }

    function getStatuses() {
      return inspecFactory.common.GetState().then(function(items) {
        vm.statuses = items;
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
        agentId: vm.query.mAgent ? vm.query.mAgent.CodigoAgente : null,
        inspectorId: vm.query.mInspector ? vm.query.mInspector.inspectorId : null,
        riskStatusCode: vm.query.mStatus ? vm.query.mStatus.parameterId || null : null
      };

      inspecFactory.reports.trackingReport(request, true);
    }
  }

  return ng
    .module('appInspec')
    .controller('SeguimientoController', seguimientoController)
    .component('inspecSeguimiento', {
      templateUrl: '/inspec/app/components/reportes/seguimiento/seguimiento.html',
      controller: 'SeguimientoController',
      controllerAs: '$ctrl'
    });
});
