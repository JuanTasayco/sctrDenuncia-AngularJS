'use strict';

define(['angular', 'moment', 'lodash'], function(ng, moment, _) {
  gestionTiemposController.$inject = ['inspecFactory'];

  function gestionTiemposController(inspecFactory) {
    var vm = this;
    vm.$onInit = onInit;
    vm.clearValues = clearValues;
    vm.getAgents = getAgents;
    vm.queryReport = queryReport;
    vm.generateReport = generateReport;

    function onInit() {
      vm.today = new Date();
      vm.types = [{Descripcion: 'HORA', Codigo: 'H'}, {Descripcion: 'DIA', Codigo: 'D'}];
      vm.months = [
        {Descripcion: 'Enero', Codigo: '01'},
        {Descripcion: 'Febrero', Codigo: '02'},
        {Descripcion: 'Marzo', Codigo: '03'},
        {Descripcion: 'Abril', Codigo: '04'},
        {Descripcion: 'Mayo', Codigo: '05'},
        {Descripcion: 'Junio', Codigo: '06'},
        {Descripcion: 'Julio', Codigo: '07'},
        {Descripcion: 'Agosto', Codigo: '08'},
        {Descripcion: 'Septiembre', Codigo: '09'},
        {Descripcion: 'Octubre', Codigo: '10'},
        {Descripcion: 'Noviembre', Codigo: '11'},
        {Descripcion: 'Diciembre', Codigo: '12'}
      ];
      clearValues();
      getInspectors();
    }

    function clearValues() {
      vm.query = {};
      vm.query.mFromYear = moment().format('YYYY');
      vm.query.mToYear = moment().format('YYYY');
      vm.query.mInspector = null;
      vm.query.mAgent = null;
      vm.query.mFromMonth = {
        Codigo: '01'
      };
      vm.query.mToMonth = {
        Codigo: moment().format('MM')
      };
      vm.showResult = false;
      vm.reportProperties = null;
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
      setReportFields();
      var request = {
        startDate: moment(vm.query.mFromYear + '-' + vm.query.mFromMonth.Codigo, 'YYYY-MM')
          .startOf('month')
          .toDate(),
        endDate: moment(vm.query.mToYear + '-' + vm.query.mToMonth.Codigo, 'YYYY-MM')
          .endOf('month')
          .toDate(),
        // extension: extension,
        periodType: vm.query.mType.Codigo,
        agentId: vm.query.mAgent ? vm.query.mAgent.CodigoAgente : null,
        inspectorId: vm.query.mInspector ? vm.query.mInspector.inspectorId : null,
        reportType: vm.query.mType.Codigo
      };

      inspecFactory.reports.timeManagement(request, true).then(function(response) {
        vm.reportProperties.reportData = response;
        vm.reportProperties.columns = {
          main: 'TIPO REGISTRO',
          mainClass: 'col-40-dktp',
          detailClass: 'col-10-dktp',
          detail: [
            {label: 'Cero', property: 'cero'},
            {label: 'Uno', property: 'uno'},
            {label: 'Dos', property: 'dos'},
            {label: 'Tres', property: 'tres'},
            {label: 'Cuatro', property: 'cuatro'},
            {label: 'Más', property: 'mas'}
          ]
        };
      });
    }

    function generateReport($event) {
      var request = {
        startMonth: vm.query.mFromMonth.Codigo,
        startYear: vm.query.mFromYear,
        endMonth: vm.query.mToMonth.Codigo,
        endYear: vm.query.mToYear,
        startDate: moment(vm.query.mFromYear + '-' + vm.query.mFromMonth.Codigo, 'YYYY-MM')
          .startOf('month')
          .toDate(),
        endDate: moment(vm.query.mToYear + '-' + vm.query.mToMonth.Codigo, 'YYYY-MM')
          .endOf('month')
          .toDate(),
        extension: $event.format,
        data: vm.reportProperties.reportData,
        periodType: vm.query.mType.Codigo,
        agentId: vm.query.mAgent ? vm.query.mAgent.CodigoAgente : null,
        agentName: vm.query.mAgent ? vm.query.mAgent.CodigoNombre.split('>>>')[1].trim() : null,
        inspectorId: vm.query.mInspector ? vm.query.mInspector.inspectorId : null,
        inspectorName: vm.query.mInspector.inspectorId ? vm.query.mInspector.fullName : null,
        reportType: vm.query.mType.Codigo
      };

      inspecFactory.reports.exportTimeManagement(request, true);
    }

    function setReportFields() {
      vm.reportProperties = {};
      vm.reportProperties.title =
        vm.query.mType.Codigo === 'D' ? 'Reporte Resumen Registro por Día' : 'Reporte Resumen Registro por Hora';
      vm.reportProperties.inspector = vm.query.mInspector.inspectorId ? vm.query.mInspector.fullName : null;
      vm.reportProperties.agent = vm.query.mAgent ? vm.query.mAgent.CodigoNombre : null;
      vm.reportProperties.from = moment(vm.query.mFromYear + '-' + vm.query.mFromMonth.Codigo, 'YYYY-MM')
        .startOf('month')
        .toDate();
      vm.reportProperties.to = moment(vm.query.mToYear + '-' + vm.query.mToMonth.Codigo, 'YYYY-MM')
        .endOf('month')
        .toDate();
      vm.reportProperties.reportData = null;
    }
  }

  return ng
    .module('appInspec')
    .controller('GestionTiemposController', gestionTiemposController)
    .component('inspecGestionTiempos', {
      templateUrl: '/inspec/app/components/reportes/gestion-tiempos/gestion-tiempos.html',
      controller: 'GestionTiemposController',
      controllerAs: '$ctrl'
    });
});
