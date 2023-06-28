define([
  'angular'
], function(ng) {

  AutoReemplazoSolicitudController.$inject = ['$scope', '$window', '$state', '$timeout', '$uibModal', 'mModalAlert', 'oimPrincipal', '$rootScope',];

  function AutoReemplazoSolicitudController($scope, $window, $state, $timeout, $uibModal, mModalAlert, oimPrincipal, $rootScope) {

    function _calendarFechaInicio(){
      $scope.todayFechaInicio = function() {
        $scope.mFechaInicio = new Date();
      };
      $scope.todayFechaInicio();

      $scope.inlineOptions = {
        minDate: new Date(),
        showWeeks: true
      };

      $scope.dateOptionsFechaInicio = {
        formatYear: 'yy',
        maxDate: new Date(),
        minDate: new Date(),
        startingDay: 1
      };

      $scope.toggleMinFechaInicio = function() {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptionsFechaInicio.minDate = $scope.inlineOptions.minDate;
      };
      $scope.toggleMinFechaInicio();

      $scope.openFechaInicio = function() {
        $scope.popupFechaInicio.opened = true;
      };

      $scope.formatDate = constants.formats.dateFormat;
      $scope.mask = constants.formats.dateFormatMask;
      $scope.pattern = constants.formats.dateFormatRegex;

      $scope.altInputFormats = ['M!/d!/yyyy'];

      $scope.popupFechaInicio = {
        opened: false
      };
    }

    function _calendarFechaFin(){
      $scope.todayFechaFin = function() {
        $scope.mFechaFin = new Date();
      };
      $scope.todayFechaFin();

      $scope.inlineOptions = {
        minDate: new Date(),
        showWeeks: true
      };

      $scope.dateOptionsFechaFin = {
        formatYear: 'yy',
        maxDate: new Date(),
        minDate: new Date(),
        startingDay: 1
      };

      $scope.toggleMinFechaFin = function() {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptionsFechaFin.minDate = $scope.inlineOptions.minDate;
      };
      $scope.toggleMinFechaFin();

      $scope.openFechaFin = function() {
        $scope.popupFechaFin.opened = true;
      };

      $scope.formatDate = constants.formats.dateFormat;
      $scope.mask = constants.formats.dateFormatMask;
      $scope.pattern = constants.formats.dateFormatRegex;

      $scope.altInputFormats = ['M!/d!/yyyy'];

      $scope.popupFechaFin = {
        opened: false
      };
    }

    _calendarFechaFin();
    _calendarFechaInicio();

    $scope.showVerPoliza = showVerPoliza;
    function showVerPoliza(value) {
      // if(value)
        // cleanCliente();

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

    $scope.showAsignarTaller = showAsignarTaller;
    function showAsignarTaller(value) {
      // if(value)
        // cleanCliente();

      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal--lg fade',
        templateUrl: '/gcw/app/components/siniestros/auto-reemplazo/detalle/modal-asignar-taller.html',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function() {
            $uibModalInstance.close();
          };
        }]
      });
    }

    $scope.showVerAsignacion = showVerAsignacion;
    function showVerAsignacion(value) {
      // if(value)
        // cleanCliente();

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
          scope.close = function() {
            $uibModalInstance.close();
          };
        }]
      });
    }

    (function onLoad() {

    })();

  } // end controller

  return ng.module('appGcw')
    .controller('AutoReemplazoSolicitudController', AutoReemplazoSolicitudController)
    .component('gcwAutoReemplazoSolicitud', {
      templateUrl: '/gcw/app/components/siniestros/auto-reemplazo/detalle/solicitud.html',
      controller: 'AutoReemplazoSolicitudController',
      bindings: {
      }
    });
});
