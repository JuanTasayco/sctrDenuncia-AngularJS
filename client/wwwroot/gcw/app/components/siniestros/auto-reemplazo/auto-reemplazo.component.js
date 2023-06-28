'use strict';

define([
  'angular',
  'moment',
  'lodash'
], function(ng, moment, _) {

  AutoReemplazoController.$inject = ['$scope', '$uibModal', 'gcwFactory', 'CommonCboService', 'mModalAlert', '$rootScope', '$state', 'MxPaginador', '$stateParams'];

  function AutoReemplazoController($scope, $uibModal, gcwFactory, CommonCboService, mModalAlert, $rootScope, $state, MxPaginador, $stateParams) {
    var vm = this;
    vm.$onInit = onInit;
    vm.searchReplacementCar = searchReplacementCar;
    vm.pageChanged = pageChanged;
    vm.cleanSearch = cleanSearch;
    vm.showDetail = showDetail;

    function onInit() {
      $rootScope.currentURL = $state.current.url;
      $rootScope.$broadcast('dashboard');
      $rootScope.$broadcast('networkInit');
      $rootScope.$broadcast('msgSinResultados');
      vm.rol = gcwFactory.getVariableSession('rolSession');
      vm.dataTicket = gcwFactory.getVariableSession('dataTicket');
      cleanSearch(true);
      vm.cabecera = $rootScope.cabecera;
      vm.format = 'dd/MM/yyyy';
      vm.totalItems = Object.keys(vm.autoReemplazo).length;
      vm.itemsXPagina = 10;
      vm.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
      vm.page = new MxPaginador();
      vm.page.setNroItemsPorPagina(vm.itemsXPagina);
      vm.page.setNroTotalRegistros(vm.totalItems)
        .setDataActual(vm.autoReemplazo)
        .setConfiguracionTanda();
      setCurrentPage();
    }

    function showDetail(entry) {
      $state.go('consulta.autoReemplazoDetalleRequerido', { detail: entry }, {reload: false, inherit: false});

      // gcwFactory.addVariableSession('formSession', getFormSession());
      gcwFactory.addVariableSession('rolSession', vm.rol);
      gcwFactory.addVariableSession('cabeceraSession', $rootScope.cabecera);
    }

    function searchReplacementCar() {
      vm.rol = obtenerAgente();
      vm.dataTicket = gcwFactory.getVariableSession('dataTicket');

      gcwFactory.addVariableSession('formSession', getFormSession());
      gcwFactory.addVariableSession('rolSession', vm.rol);
      var params = {};

      if (!vm.rol.agenteID || vm.rol.agenteID === '0') {
        mModalAlert.showInfo('Seleccione un agente para iniciar la consulta', 'Siniestros: Auto de Reemplazo', '', '', '', 'g-myd-modal');
        return;
      }

      switch (vm.formAutoReemplazo.mTipoBusqueda.toString()) {
        case '1':
          // if (ng.isUndefined(vm.formAutoReemplazo.mNroSiniestro)) {
          //   mModalAlert.showInfo('Ingrese un número de siniestro para iniciar la consulta', 'Siniestros: Auto de Reemplazo');
          // } else {
          params = _.assign({}, getParams(), {
            SinisterNumber: vm.formAutoReemplazo.mNroSiniestro
          });

          vm.page.setCurrentTanda(vm.currentPage);
          search(params);
          // }
          break;
        case '2':
          // if (ng.isUndefined(vm.formAutoReemplazo.mNroSolic)) {
          //   mModalAlert.showInfo('Ingrese una número de solicitud para iniciar la consulta', 'Siniestros: Auto de Reemplazo');
          // } else {
          params = _.assign({}, getParams(), {
            RequestNumber: vm.formAutoReemplazo.mNroSolic
          });

          vm.page.setCurrentTanda(vm.currentPage);
          search(params);
          // }
          break;
        case '3':
          // if (ng.isUndefined(vm.formAutoReemplazo.mNroPoliza)) {
          //   mModalAlert.showInfo('Ingrese una número de póliza para iniciar la consulta', 'Siniestros: Auto de Reemplazo');
          // } else {
          params = _.assign({}, getParams(), {
            Policy: vm.formAutoReemplazo.mNroPoliza
          });

          vm.page.setCurrentTanda(vm.currentPage);
          search(params);
          // }
          break;
        case '4':
          // if (ng.isUndefined(vm.formAutoReemplazo.mNroPlaca)) {
          //   mModalAlert.showInfo('Ingrese una número de placa para iniciar la consulta', 'Siniestros: Auto de Reemplazo');
          // } else {
          params = _.assign({}, getParams(), {
            LicensePlate: vm.formAutoReemplazo.mNroPlaca
          });

          vm.page.setCurrentTanda(vm.currentPage);
          search(params);
          // }
          break;
        case '5':
          // if (ng.isUndefined(vm.formAutoReemplazo.mCliente)) {
          //   mModalAlert.showInfo('Seleccione un cliente para iniciar la consulta', 'Siniestros: Auto de Reemplazo');
          // } else {
          params = _.assign({}, getParams(), {
            ClientDocumentType: vm.formAutoReemplazo.mClient ? vm.formAutoReemplazo.mCliente.documentType : null,
            ClientDocumentNumber: vm.formAutoReemplazo.mClient ? vm.formAutoReemplazo.mCliente.documentNumber : null
          });

          vm.page.setCurrentTanda(vm.currentPage);
          search(params);
          break;
        default:
          console.log('none');
      }
    }

    function cleanSearch(firstLoad) {
      vm.autoReemplazo = [];
      if (firstLoad) {
        vm.autoReemplazo = gcwFactory.getVariableSession('dataSession');
      }
      vm.hasBeenQueried = false;
      vm.formAutoReemplazo = {};
      vm.formAutoReemplazo.mTipoBusqueda = '1';
      vm.currentDate = new Date();
      vm.mFechaDesde = moment().subtract(6, 'months').toDate();
      vm.minDate = ng.copy(vm.mFechaDesde);
      vm.mFechaHasta = ng.copy(vm.currentDate);
    }

    function search(params) {
      if (!vm.hasBeenQueried) {
        vm.lastParams = ng.copy(params);
        vm.hasBeenQueried = true;
      }

      var autoReemplazo;

      gcwFactory.getReplacementCar(params, true)
        .then(function(response) {
          if (response.data && response.data.length > 0) {
            autoReemplazo = response.data;

            gcwFactory.addVariableSession('dataSession', autoReemplazo);
            vm.totalItems = response.data.length;
            vm.totalPages = (response.data.length > vm.itemsXPagina ? response.data.length / vm.itemsXPagina : 1);
            vm.noResult = false;
          } else {
            autoReemplazo = [];
            vm.totalItems = 0;
            vm.totalPages = 0;
            vm.noResult = true;
          }
          vm.page.setNroTotalRegistros(vm.totalItems)
            .setDataActual(autoReemplazo)
            .setConfiguracionTanda();
          setCurrentPage();
        });
    }

    function getParams() {
      vm.currentPage = 1;
      return {
        AgentId: String(vm.rol.agenteID),
        StartDate: gcwFactory.formatearFecha(vm.mFechaDesde),
        EndDate: gcwFactory.formatearFecha(vm.mFechaHasta),
        ClientType: vm.formAutoReemplazo.mTipoCliente,
        RequestStatusCode: vm.formAutoReemplazo.mEstadoSolicitud.statuscode,
        ProviderId: vm.formAutoReemplazo.mProveedor ? +vm.formAutoReemplazo.mProveedor.providerid : null
      };
    }

    function getFormSession() {
      vm.formSession = {}; // init vacio para cada vez q se hace una busqueda
      return vm.formSession;
    }

    function setCurrentPage() {
      vm.autoReemplazo = vm.page.getItemsDePagina();
    }

    function pageChanged(event) {
      vm.page.setNroPaginaAMostrar(event.pageToLoad)
        .thenLoadFrom(function(nroTanda) {
          vm.currentPage = nroTanda;
        }, setCurrentPage);
    }

    function obtenerAgente() {
      switch (vm.dataTicket.roleCode) {
        case 'GESTOR-OIM':
          return {
            gestorID: vm.dataTicket.oimClaims.agentID,
            agenteID: (vm.cabecera.agente == null) ? '0' : vm.cabecera.agente.id
          };
        case 'DIRECTOR':
          return {
            gestorID: vm.dataTicket.codeManagerOffice,
            agenteID: (vm.cabecera.agente == null) ? '0' : vm.cabecera.agente.id
          };
        case 'GESTOR':
        case 'ADM-COBRA':
        case 'ADM-COMI':
        case 'ADM-RENOV':
        case 'ADM-SINIE':
        case 'ADM-CART':
          // TODO: Quitar mensaje de error: TypeError: Cannot read property 'agente' of undefined
          return {
            gestorID: (ng.isUndefined(vm.cabecera.gestor)) ? '0' : vm.cabecera.gestor.id,
            agenteID: (vm.cabecera.agente == null) ? '0' : vm.cabecera.agente.id
          };
        default:
          return {
            gestorID: 0,
            agenteID: vm.dataTicket.oimClaims.agentID
          };
      }
    }
  } // end controller

  return ng.module('appGcw')
    .controller('AutoReemplazoController', AutoReemplazoController)
    .component('gcwAutoReemplazo', {
      templateUrl: '/gcw/app/components/siniestros/auto-reemplazo/auto-reemplazo.html',
      controller: 'AutoReemplazoController',
      controllerAs: '$ctrl'
    });
});
