'use strict';

define(['angular', 'constants', 'helper', 'saludFactory'], function(
  angular, constants, helper, saludFactory) {

  historialPlanesController.$inject = [
    '$scope', '$window', '$state', '$timeout', 'mainServices', '$uibModal', 'mModalAlert', 'saludFactory', '$stateParams', '$sce'
  ];

  function historialPlanesController($scope, $window, $state, $timeout, mainServices, $uibModal, mModalAlert, saludFactory, $stateParams, $sce) {
    var vm = this;

    vm.downloafFile = downloafFile;

    vm.$onInit = function () {
      getGlobalProduct();
      getHistoryPlan();
    };

    function getGlobalProduct(){
      //get detail plan
      saludFactory.obtenerProductoGlobal($stateParams.compania, $stateParams.ramo, $stateParams.contrato, $stateParams.subContrato).then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            vm.planDetail = response.Data;
          }
      }).catch(function (err) {
          mModalAlert.showError(err.data.message, 'Error');
        });
    }

    function getHistoryPlan(){
      //historial
      saludFactory.getHistoryPlan($stateParams.ramo, $stateParams.modalidad, $stateParams.contrato, $stateParams.subContrato).then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            vm.historyPlan = response.Data;
          }
      }).catch(function (err) {
          mModalAlert.showError(err.data.message, 'Error');
        });
    }

    function downloafFile(fechaValidez) {
      if (fechaValidez) {
        var res = fechaValidez.split("/");
        vm.fechaValidez = res[0] + res[1] + res[2];
        vm.paramsFile = $stateParams.ramo + '/' + $stateParams.modalidad + '/' + $stateParams.contrato + '/' + $stateParams.subContrato + '/' + vm.fechaValidez;
        vm.attachFileHistoryURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + 'api/salud/descargar/archivoplan/historial/' + vm.paramsFile);
        $timeout(function () {
          document.getElementById('frmAttachFileHistory').submit();
        }, 500);
      }
    }

  }
  return angular.module('appSalud')
    .controller('historialPlanesController', historialPlanesController)
});
