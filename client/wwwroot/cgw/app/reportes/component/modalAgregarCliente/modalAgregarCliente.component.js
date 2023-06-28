define([
  'angular', '/cgw/app/factory/cgwFactory.js'
], function(ng) {

  ModalAgregarClienteController.$inject = ['$scope', '$timeout', '$log', 'cgwFactory'];

  function ModalAgregarClienteController($scope, $timeout, log, cgwFactory) {
    var vm = this;

    vm.buscar = function bFn() {
      $scope.frmModalBuscarCliente.markAsPristine();
      if ($scope.mNombreCliente) {
        var paramsClienteReporte = {
          Code : '',
          Name : ($scope.mNombreCliente === undefined) ? '' : $scope.mNombreCliente.toUpperCase()
        };

        cgwFactory.getClienteReporte(paramsClienteReporte).then(function (response) {
            if (response.data.items) {
              $scope.clientes = response.data.items;
            }
          }, function(error){
            if (error.data)
              mModalAlert.showError(error.data.message, "Error");
        });
      }
    };

    vm.seleccionarCliente = function sdFn(item) {
      vm.data.dataCliente = item;
      vm.close();
    };

  } // end controller

  return ng.module('appCgw')
    .controller('ModalAgregarClienteController', ModalAgregarClienteController)
    .component('mfpModalAgregarCliente', {
      templateUrl: '/cgw/app/reportes/component/modalAgregarCliente/modalAgregarCliente.html',
      controller: 'ModalAgregarClienteController',
      bindings: {
        data: '=?',
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
