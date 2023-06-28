'use strict';

define(['angular', 'saludFactory'], function (angular) {

  resumenSuscripcionSaludController.$inject = ['$scope', '$stateParams', 'saludFactory', '$state'];
  function resumenSuscripcionSaludController($scope, $stateParams, saludFactory, $state) {
    var vm = this;

    $scope.gLblTitle = 'Resumen suscripción';
    vm.$onInit = onInit;
    $scope.oneAtATime = false;
    $scope.status = {
        open1: false,
        open2: false,
        open3: false,
        open4: false
    };

    $scope.irABandeja = function () {
      $state.go('saludDocuments', {}, {reload: true, inherit: false});
    }

    function onInit() {
      if (!saludFactory.isUserSubscription()) {
        $state.go("homePolizasSalud");
      }
    
      var quotationNumber = 0;
      quotationNumber = $stateParams.quotationNumber;
      $scope.cotizacion = {};
      $scope.titular = {};
      $scope.statesSalud = constants.module.polizas.salud.stateDocuments;

      saludFactory.getSuscripcion(quotationNumber, true).then(function(res) {
        if (res.OperationCode === 200) {
          $scope.cotizacion = res.Data;
          var paso = res.Data.Paso
          var estadoSolicitud = $scope.cotizacion.EstadoSolicitud;
          if (_validarPermiso(estadoSolicitud)) {
            $scope.titular = _obtenerTitular();
          } else {
            $state.go('suscripcionSalud.steps', {quotationNumber: $scope.quotationNumber, step: paso});
          }
        } else {
          console.log(res.error);
        }
      });
    };

    var _validarPermiso = function (estadoSolicitud) {
      return estadoSolicitud != '';
    }

    var _obtenerTitular = function () {
      var titular = _.find($scope.cotizacion.Asegurados, function (asegurado) {
        return asegurado.TipoAsegurado.Codigo == 'TI';
      });
      return titular;
    }
  }

  return angular.module('appSalud')
    .controller('resumenSuscripcionSaludController', resumenSuscripcionSaludController)
    .config(['$httpProvider', function($httpProvider) {
      //initialize get if not there
      if (!$httpProvider.defaults.headers.get) {
          $httpProvider.defaults.headers.get = {};
      }
      // Answer edited to include suggestions from comments
      // because previous version of code introduced browser-related errors
      //disable IE ajax request caching
      $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
      // extra
      $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
      $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    }]);
});
