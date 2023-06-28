'use strict';

define(['angular', 'moment', 'lodash'], function(ng, moment, _) {
  detalleVehiculoController.$inject = ['inspecFactory', '$timeout'];

  function detalleVehiculoController(inspecFactory, $timeout) {
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
    }

    function clearValues() {
      vm.query = {};
      vm.query.mFrom = moment().toDate();
      vm.query.mTo = moment().toDate();
      vm.query.mInspector = null;
      vm.query.mAgent = null;
      vm.query.mUbigeo = {};
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
        departmentId: vm.query.mUbigeo.mDepartamento.Codigo,
        provinceId: vm.query.mUbigeo.mProvincia ? vm.query.mUbigeo.mProvincia.Codigo : null,
        districtId: vm.query.mUbigeo.mDistrito ? vm.query.mUbigeo.mDistrito.Codigo : null
      };

      inspecFactory.reports.vehicleDetails(request, true);
    }
  }

  return ng
    .module('appInspec')
    .controller('DetalleVehiculoController', detalleVehiculoController)
    .component('inspecDetalleVehiculo', {
      templateUrl: '/inspec/app/components/reportes/detalle-vehiculo/detalle-vehiculo.html',
      controller: 'DetalleVehiculoController',
      controllerAs: '$ctrl'
    });
});
