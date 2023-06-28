'use strict';

define([
  'angular',
  'moment'
], function(ng,moment) {

  AutoReemplazoDetalleRequeridoController.$inject = ['$scope', '$window', '$state', '$timeout', '$uibModal', 'mModalAlert', 'oimPrincipal', '$rootScope', '$stateParams', 'CommonCboService', 'gcwFactory'];

  function AutoReemplazoDetalleRequeridoController($scope, $window, $state, $timeout, $uibModal, mModalAlert, oimPrincipal, $rootScope, $stateParams, CommonCboService, gcwFactory) {
    var vm = this;
    vm.$onInit = onInit;
    vm.showVerAsignacion = showVerAsignacion;
    vm.showAsignarTaller = showAsignarTaller;
    vm.setDifference = setDifference;

    function onInit() {
      vm.detail = $stateParams.detail;
      if (!vm.detail) {
        $state.go('consulta.33');
      } else {
        vm.detail.endservicedate = vm.detail.servicedate.substring(0, 10);
        vm.ppd = 'PPD';
        vm.yes = 'SI';
        vm.cabecera = $rootScope.cabecera;
        vm.format = 'dd/MM/yyyy';
        vm.currentDate = new Date();
        vm.mFechaDesde = ng.copy(vm.currentDate);
        vm.mFechaHasta = moment().add(5, 'days').toDate();
        vm.maxDate = moment().add(15, 'days').toDate();
        setDifference();
        CommonCboService.getTipoCliente(false).then(function glpPr(req) {
          vm.lstTipoCliente = req.data;
        });

        CommonCboService.getProvidersRequests(false).then(function glpPr(req) {
          vm.lstProveedores = req.data;
          vm.providers = req.data;
        });

        gcwFactory.getReplacementCarFactory(vm.detail.sinisterid).then(function(response){
          if(response && response.data) {
            vm.coverage = !!+response.data.cantidad ? 'SI' : 'NO';
            vm.factoryName = response.data.noM_TALLER;
          }
        });
      }
    }

    function setDifference() {
      vm.difference = (moment(vm.mFechaHasta).diff(moment(vm.mFechaDesde), 'days') || 0);
    }

    $scope.showVerPoliza = showVerPoliza;
    function showVerPoliza(value) {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal--lg fade',
        templateUrl: '/gcw/app/components/siniestros/auto-reemplazo/detalle/modal-ver-poliza.html',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function() {
            $uibModalInstance.close();
          };
        }]
      });
    }

    function showAsignarTaller(value) {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal--lg fade',
        templateUrl: '/gcw/app/components/siniestros/auto-reemplazo/detalle/modal-asignar-taller.html',
        controllerAs: '$ctrl',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function() {
            $uibModalInstance.close();
          };

          scope.searchFactory = function() {

          };
        }]
      });
    }

    function showVerAsignacion(value) {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal--lg fade',
        templateUrl: '/gcw/app/components/siniestros/auto-reemplazo/detalle/modal-ver-asignacion.html',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.lstProveedores = vm.providers;
          scope.close = function() {
            $uibModalInstance.close();
          };
        }]
      });
    }
  } // end controller

  return ng.module('appGcw')
    .controller('AutoReemplazoDetalleRequeridoController', AutoReemplazoDetalleRequeridoController)
    .component('gcwAutoReemplazoDetalleRequerido', {
      templateUrl: '/gcw/app/components/siniestros/auto-reemplazo/detalle/detalle-requerido.html',
      controller: 'AutoReemplazoDetalleRequeridoController',
      bindings: {
      }
    });
});
