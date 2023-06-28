'use strict';

define([
  'angular',
  'lodash',
  'moment',
  'constants'
], function(ng, _, moment, constants) {

  AutoReemplazoPlanillaController.$inject = ['gcwFactory', '$rootScope', '$state', '$timeout', '$document', '$sce', '$stateParams'];

  function AutoReemplazoPlanillaController(gcwFactory, $rootScope, $state, $timeout, $document, $sce, $stateParams) {
    var vm = this;

    vm.$onInit = onInit;
    vm.searchPayroll = searchPayroll;
    vm.cleanPayroll = cleanPayroll;
    vm.exportPayroll = exportPayroll;

    function onInit() {
      $rootScope.currentURL = $state.current.url;
      $rootScope.$broadcast('dashboard');
      $rootScope.$broadcast('networkInit');
      $rootScope.$broadcast('msgSinResultados');
      vm.dataTicket =  gcwFactory.getVariableSession('dataTicket');
      vm.cabecera = $rootScope.cabecera;
      vm.currentData = $stateParams.currentData;
      cleanPayroll();
    }

    function searchPayroll() {
      var params = getParams();
      gcwFactory.getPayRoll(params, true)
        .then(function(response) {
          vm.payrolls = response.data;
          vm.noResult = !response.data.length;
          vm.firstSearch = true;
        });
    }

    function cleanPayroll() {
      vm.payrolls = [];
      vm.format = 'dd/MM/yyyy';
      vm.currentDate = new Date();
      vm.mFechaDesde = moment().subtract(1, 'weeks').toDate();
      vm.mFechaHasta = ng.copy(vm.currentDate);
      vm.firstSearch = false;
    }

    function exportPayroll() {
      vm.exportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw + 'api/policy/download');
      var params = _.assign({
        Data: vm.payrolls
      }, getParams());
      gcwFactory.downloadPayRoll(params);
    }


    function getParams() {
      return {
        StartDate: gcwFactory.formatearFecha(vm.mFechaDesde),
        EndDate: gcwFactory.formatearFecha(vm.mFechaHasta),
        ProviderId: (vm.dataTicket.oimClaims.documentNumber || null)
      };
    }
  } // end controller

  return ng.module('appGcw')
    .controller('AutoReemplazoPlanillaController', AutoReemplazoPlanillaController)
    .component('gcwAutoReemplazoPlanilla', {
      templateUrl: '/gcw/app/components/siniestros/auto-reemplazo/auto-reemplazo-planilla.html',
      controller: 'AutoReemplazoPlanillaController',
      bindings: {
      }
    });
});
