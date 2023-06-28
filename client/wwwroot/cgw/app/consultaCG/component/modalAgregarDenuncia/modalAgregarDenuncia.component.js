define([
  'angular'
], function(ng) {

  ModalAgregarDenunciaController.$inject = ['$scope', '$timeout', '$log'];

  function ModalAgregarDenunciaController($scope, $timeout, log) {
    var vm = this;

    vm.buscar = function bFn() {
      $timeout(function() {
        log.info('guardando..');
      }, 1500);
    };

    vm.seleccionarDenuncia = function sdFn(item) {
      log.info(item);
    };

  } // end controller

  return ng.module('appCgw')
    .controller('ModalAgregarDenunciaController', ModalAgregarDenunciaController)
    .component('mfpModalAgregarDenuncia', {
      templateUrl: '/cgw/app/consultaCG/component/modalAgregarDenuncia/modalAgregarDenuncia.html',
      controller: 'ModalAgregarDenunciaController',
      bindings: {
        close: '&?'
      }
    })
    .directive('preventDefault', function() {
      return function(scope, element, attrs) {
          angular.element(element).bind('click', function(event) {
              event.preventDefault();
              event.stopPropagation();
          });
      }
    });
});
