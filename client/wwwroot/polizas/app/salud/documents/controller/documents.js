'use strict';

define(['angular', 'constants', 'helper',
  '/polizas/app/documentos/proxy/documentosFactory.js',
  '/scripts/mpf-main-controls/components/documentTray/component/documentTray.js', 'saludFactory'], function(
  angular, constants, helper) {

  saludDocumentsController.$inject = [
    '$scope', '$window', '$state', '$timeout', 'mainServices', '$uibModal', 'mModalAlert', '$filter', 'saludFactory'
  ];

  function saludDocumentsController($scope, $window, $state, $timeout, mainServices, $uibModal, mModalAlert, $filter, saludFactory) {
    var vm = this;

    vm.$onInit = function () {
      getProducts();
    };

    function getProducts(){

      saludFactory.getProducts().then(function (response) {
        if (response.OperationCode === constants.operationCode.success) {
          $scope.productoFilterData = response.Data;
        } else {
          mModalAlert.showError(response.Message, 'Error');
        }
      }).catch(function (err) {
        mModalAlert.showError(err.data.message, 'Error');
      });
    }

  }  return angular.module('appSalud')
    .controller('saludDocumentsController', saludDocumentsController)
});

