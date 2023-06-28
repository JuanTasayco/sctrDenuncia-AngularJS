define([
  'angular', '/cgw/app/factory/cgwFactory.js'
], function(ng) {

  ModalAgregarAfiliadoController.$inject = ['$scope', '$timeout', '$log', 'cgwFactory', 'mModalAlert'];

  function ModalAgregarAfiliadoController($scope, $timeout, log, cgwFactory, mModalAlert) {
    var vm = this;

    vm.buscar = function bFn() {

      var paramsAffiliateReporte = {
        LastName: ($scope.mApePaternoAfiliado === undefined) ? '' : $scope.mApePaternoAfiliado.toUpperCase(),
        LastName2: ($scope.mApeMaternoAfiliado === undefined) ? '' : $scope.mApeMaternoAfiliado.toUpperCase(),
        Name: ($scope.mNombreAfiliado === undefined) ? '' : $scope.mNombreAfiliado.toUpperCase(),
        CodeCompany: vm.data.CodeCompany,
        EntityCode: '',
        EntityRucNumber: ''
      };

      cgwFactory.getAffiliateReporte(paramsAffiliateReporte).then(function (response) {
          if (response.data.items) {
            $scope.afiliados = response.data.items;
          }
        }, function(error){
          if (error.data)
            mModalAlert.showError(error.data.message, "Error");
      });
    };

    vm.seleccionarAfiliado = function sdFn(item) {
      vm.data.dataAfiliado = item;
      vm.close();
    };

  } // end controller

  return ng.module('appCgw')
    .controller('ModalAgregarAfiliadoController', ModalAgregarAfiliadoController)
    .component('mfpModalAgregarAfiliado', {
      templateUrl: '/cgw/app/reportes/component/modalAgregarAfiliado/modalAgregarAfiliado.html',
      controller: 'ModalAgregarAfiliadoController',
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
