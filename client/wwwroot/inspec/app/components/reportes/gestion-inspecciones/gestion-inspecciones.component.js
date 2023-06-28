'use strict';

define(['angular', 'moment', 'lodash'], function(ng, moment, _) {
  gestionInspeccionesController.$inject = ['inspecFactory', '$timeout'];

  function gestionInspeccionesController(inspecFactory, $timeout) {
    var vm = this;
    vm.$onInit = onInit;
    vm.clearValues = clearValues;
    vm.getAgents = getAgents;
    vm.queryReport = queryReport;
    vm.generateReport = generateReport;
    vm.setReportFields = setReportFields;

    function onInit() {
      vm.reportProperties = {};
      vm.today = new Date();
      vm.types = [{Descripcion: 'RESUMEN', Codigo: 'R'}, {Descripcion: 'DETALLE', Codigo: 'D'}];
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
          .startOf('day')
          .toDate(),
        startMonth: vm.query.mFromMonth.Codigo,
        startYear: vm.query.mFromYear,
        endMonth: vm.query.mToMonth.Codigo,
        endYear: vm.query.mToYear,
        // extension: extension,
        agentId: vm.query.mAgent ? vm.query.mAgent.CodigoAgente : null,
        inspectorId: vm.query.mInspector ? vm.query.mInspector.inspectorId : null
      };

      inspecFactory.reports.inspectionManagement(request, true).then(function(response) {
        vm.reportProperties.reportData = response;

        vm.reportProperties.columns = {
          main: 'INSPECCIONES',
          mainClass: 'col-16-dktp',
          detailClass: 'col-7-dktp',
          detail: [
            {label: 'ENE', property: 'totalE'},
            {label: 'FEB', property: 'totalF'},
            {label: 'MAR', property: 'totalM'},
            {label: 'ABR', property: 'totalA'},
            {label: 'MAY', property: 'totalMA'},
            {label: 'JUN', property: 'totalJU'},
            {label: 'JUL', property: 'totalJL'},
            {label: 'AGO', property: 'totalAG'},
            {label: 'SEP', property: 'totalSP'},
            {label: 'OCT', property: 'totalOC'},
            {label: 'NOV', property: 'totalNO'},
            {label: 'DIC', property: 'totalDC'}
          ]
        };
      });

      vm.showResult = false;
      $timeout(function() {
        vm.showResult = true;
      }, 500);
    }

    function generateReport($event) {
      var request = {
        startDate: moment(vm.query.mFromYear + '-' + vm.query.mFromMonth.Codigo, 'YYYY-MM')
          .startOf('month')
          .toDate(),
        endDate: moment(vm.query.mToYear + '-' + vm.query.mToMonth.Codigo, 'YYYY-MM')
          .endOf('month')
          .format('YYYY-MM-DD[T00:00:00-05:00]'),
        startMonth: vm.query.mFromMonth.Codigo,
        startYear: vm.query.mFromYear,
        endMonth: vm.query.mToMonth.Codigo,
        endYear: vm.query.mToYear,
        extension: $event.format,
        agentId: vm.query.mAgent ? vm.query.mAgent.CodigoAgente : null,
        agentName: vm.query.mAgent ? vm.query.mAgent.CodigoNombre.split('>>>')[1].trim() : null,
        inspectorId: vm.query.mInspector ? vm.query.mInspector.inspectorId : null,
        inspectorName: vm.query.mInspector.inspectorId ? vm.query.mInspector.fullName : null,
        data: vm.reportProperties.reportData
      };
      inspecFactory.reports.exportInspectionManagement(request);
    }

    function setReportFields() {
      vm.reportProperties = {};
      vm.reportProperties.title = '';
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
    .controller('GestionInspeccionesController', gestionInspeccionesController)
    .component('inspecGestionInspecciones', {
      templateUrl: '/inspec/app/components/reportes/gestion-inspecciones/gestion-inspecciones.html',
      controller: 'GestionInspeccionesController',
      controllerAs: '$ctrl'
    });
});
