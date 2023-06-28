'use strict';

define(['angular', 'constants', 'helper', 'saludFactory'], function(
  angular, constants, helper, saludFactory) {

  misProductosController.$inject = [
    '$scope', '$window', '$state', '$timeout', 'saludFactory', 'mModalAlert'
  ];

  function misProductosController($scope, $window, $state, $timeout, saludFactory, mModalAlert) {
    var vm = this;
    vm.gLblTitle = "Mis Productos";
    vm.productsList = [];
    vm.editPlan = editPlan;
    vm.showHistory = showHistory;
    vm.listarProductoGlobal = listarProductoGlobal;

    vm.$onInit = function() {
      vm.listarProductoGlobal();
    };

    function listarProductoGlobal() {
      saludFactory.listarProductoGlobal().then(function(response) {
        if (response.OperationCode === constants.operationCode.success) {
          if (response.Data) {
            vm.productsList = response.Data;
          }
        } else {
          mModalAlert.showError(response.Message, 'Error');
        }
      }).catch(function(err){
        mModalAlert.showError(err.data.message, 'Error');
      });
    }

    function editPlan(producto) {
      $state.go('editarPlanSalud', {compania: producto.CodigoCompania, ramo: producto.CodigoRamo, modalidad: producto.CodigoModalidad, contrato: producto.NumeroContrato, subContrato: producto.NumeroSubContrato});
    }

    function showHistory(producto) {
      $state.go('historialPlanesSalud', {compania: producto.CodigoCompania, ramo: producto.CodigoRamo, modalidad: producto.CodigoModalidad, contrato: producto.NumeroContrato, subContrato: producto.NumeroSubContrato});
    }
  }
  return angular.module('appSalud')
    .controller('misProductosController', misProductosController)
});
