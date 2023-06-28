'use strict';

define(['angular', 'moment', 'lodash'], function(ng, moment, _) {
  gestionDepartamentoController.$inject = ['inspecFactory', '$timeout'];

  function gestionDepartamentoController(inspecFactory, $timeout) {
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
        startMonth: vm.query.mFromMonth.Codigo,
        startYear: vm.query.mFromYear,
        endMonth: vm.query.mToMonth.Codigo,
        endYear: vm.query.mToYear,
        // extension: extension,
        agentId: vm.query.mAgent ? vm.query.mAgent.CodigoAgente : null,
        inspectorId: vm.query.mInspector ? vm.query.mInspector.inspectorId : null,
        reportType: vm.query.mType.Codigo
      };

      if (vm.query.mType.Codigo === 'R') {
        inspecFactory.reports.managementByDepartments(request, true).then(function(response) {
          vm.reportProperties.reportData = response;
          vm.reportProperties.hasSum = true;
          vm.reportProperties.columns = {
            main: 'DEPARTAMENTOS',
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
      } else {
        request.startMonth = request.endMonth;
        request.startYear = request.endYear;
        inspecFactory.reports.managementByDepartmentsDetails(request, true).then(function(response) {
          vm.reportProperties.reportData = response;
          vm.reportProperties.hasSum = true;
          vm.reportProperties.subTitle =
            'Detalle al mes de ' + vm.query.mToMonth.Descripcion + ' del ' + vm.query.mFromYear;
          vm.reportProperties.columns = {
            main: 'DEPARTAMENTOS',
            mainClass: 'col-22-dktp',
            detailClass: 'col-13-dktp',
            detail: [
              {label: 'PROGRAMADAS', property: 'totalProgramadas'},
              {label: 'INSPECCIONADAS', property: 'totalInspeccionadas'},
              {label: 'EN PROCESO', property: 'totalEnProceso'},
              {label: 'EN EVALUACIÓN', property: 'totalEnEvaluacion'},
              {label: 'TERMINADAS', property: 'totalTerminadas'},
              {label: 'ANULADAS', property: 'totalAnuladas'}
            ]
          };
        });
      }

      vm.showResult = false;
      $timeout(function() {
        vm.showResult = true;
      }, 500);
    }

    function generateReport($event) {
      var request = {
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

      if (vm.query.mType.Codigo === 'R') {
        inspecFactory.reports.exportManagementByDepartments(request);
      } else {
        request.period = vm.query.mToMonth.Descripcion.toUpperCase();
        inspecFactory.reports.exportManagementByDepartmentsDetails(request);
      }
    }

    function setReportFields() {
      vm.reportProperties = {};
      vm.reportProperties.title =
        vm.query.mType.Codigo === 'R'
          ? 'Reporte Resumen de Registro por Departamentos'
          : 'Reporte Detalle de Registro por Departamentos';
      vm.reportProperties.inspector = vm.query.mInspector.inspectorId ? vm.query.mInspector.fullName : null;
      vm.reportProperties.agent = vm.query.mAgent ? vm.query.mAgent.CodigoNombre : null;
      vm.reportProperties.from =
        vm.query.mType.Codigo === 'R'
          ? moment(vm.query.mFromYear + '-' + vm.query.mFromMonth.Codigo, 'YYYY-MM')
              .startOf('month')
              .toDate()
          : null;
      vm.reportProperties.to = moment(vm.query.mToYear + '-' + vm.query.mToMonth.Codigo, 'YYYY-MM')
        .endOf('month')
        .startOf('day')
        .toDate();
      vm.reportProperties.reportData = null;
    }
  }

  return ng
    .module('appInspec')
    .controller('GestionDepartamentoController', gestionDepartamentoController)
    .component('inspecGestionDepartamento', {
      templateUrl: '/inspec/app/components/reportes/gestion-departamento/gestion-departamento.html',
      controller: 'GestionDepartamentoController',
      controllerAs: '$ctrl'
    });
});
