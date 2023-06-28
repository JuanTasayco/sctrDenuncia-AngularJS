'use strict';

define(['angular', 'moment', 'constants'], function (ng, moment, constants) {
  programacionesController.$inject = [
    'mModalAlert',
    '$stateParams',
    '$scope',
    '$state',
    '$rootScope',
    'inspecFactory',
    '$window'
  ];

  function programacionesController(mModalAlert, $stateParams, $scope, $state, $rootScope, inspecFactory, $window) {
    var vm = this;

    vm.$onInit = onInit;
    vm.pageChanged = pageChanged;
    vm.goToAlerts = goToAlerts;
    vm.goToProgram = goToProgram;

    function onInit() {
      vm.pagination = {
        currentPage: 1,
        maxSize: 10,
        totalRecords: 0,
        mOrderBy: {
          Descripcion: 'Más reciente',
          Codigo: '1'
        }
      };
    }

    function handleQueryServiceResult(response) {
      vm.requests = response.data.map(function (element) {
        return {
          numero: element.nroSolicitud,
          numeroRiesgo: element.nroRiesgo,
          estado: element.descMcaEstadoRiesgo,
          agente: element.agente,
          proveedor: element.descProveedor,
          fecha: moment(element.fecCreaSol).toDate(),
          contacto: ((element.nombreContacto || '') + ' ' + (element.apellidosContacto || '')).trim(),
          idEstado: element.mcaEstadoSol,
          idRiesgo: element.nroRiesgo,
          telefono1: element.telefono1,
          telefono2: element.celular,
          telefonos: ((element.telefono1 || '') + (element.celular ? ' / ' + element.celular : '')).trim(),
          vehiculo: element.marca,
          placa: element.placa,
          usuario: element.usrCreaSol,
          idEstadoPrevio: element.previousState,
          inspector: element.inspectorName,
          reprog: element.reScheduledCode ? 'SI' : element.idEstado === '2' ? 'NO' : '-',
          frust: element.frustratedCode === 'S' ? 'SI' : element.idEstado === '2' ? 'NO' : '-',
          sourceId: element.sourceId,
          requestTypeCode: element.requestTypeCode,
          confirmationEmail: element.confirmationEmail,
          marca: element.marca,
          modelo: element.modelo,
          idInspecPresencial: element.mcaReqInspeccionPresencial === 'S' ? '10' : null,
          inspecPresencial: element.mcaReqInspeccionPresencial === 'S' ? 'INSP. PRESENCIAL' : null
        };
      });
      vm.firstQueryCompleted = true;
      vm.pagination.totalRecords = response.totalCount;
    }

    function doFilter(filledArguments) {
      filledArguments.pageNumber = vm.pagination.currentPage;
      filledArguments.pageSize = vm.pagination.maxSize;
      filledArguments.sort = vm.pagination.mOrderBy.Codigo;
      inspecFactory.requests.getSchedule(filledArguments, true).then(function (response) {
        handleQueryServiceResult(response);
      });
    }

    $scope.$on('fullFilter', function (e, a) {
      vm.pagination.currentPage = 1;
      $rootScope.$broadcast('resetOrderBy');
      doFilter(a);
    });

    $scope.$on('filter', function (e, a) {
      doFilter(a);
    });

    $scope.$on('clearFilter', function (e, a) {
      vm.pagination.currentPage = 1;
      $rootScope.$broadcast('resetOrderBy');
      doFilter(a);
    });

    function goToProgram(request, tab) {
      var tabId;
      if (request.sourceId) {
        $state.go('solicitudesDetalle', {
          requestId: request.numero,
          riskId: request.idRiesgo,
          tab: tab,
          fromProgram: true
        });
      } else {
        tabId = 'from-program' + request.numero + '-' + request.idRiesgo;
        $window.open(
          constants.module.inspec[constants.environment].urlOldInspection +
          'inspeccion/frmProgramacionDet.aspx?id=' +
          request.numero +
          '&nr=' +
          request.idRiesgo,
          tabId,
          'toolbar=yes,scrollbars=true,menubar=yes,resizable=no,width=740,height=796'
        );
      }
    }

    function pageChanged() {
      $rootScope.$broadcast('callFilterFromChildren');
    }

    function goToAlerts(requestId, riskId) {
      $state.go('solicitudesDetalle', {
        requestId: requestId,
        riskId: riskId,
        tab: 'alerts',
        fromProgram: true
      });
    }
  }

  return ng
    .module('appInspec')
    .controller('ProgramacionesController', programacionesController)
    .component('inspecProgramaciones', {
      templateUrl: '/inspec/app/components/programaciones/programaciones/programaciones.html',
      controller: 'ProgramacionesController',
      controllerAs: '$ctrl'
    });
});
