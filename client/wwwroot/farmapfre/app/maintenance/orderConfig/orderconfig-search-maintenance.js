define([
    'angular', 'farmConstants'
  ], function(angular, farmConstants) {
    var appAutos = angular.module('farmapfre.app');
    appAutos.controller('searchOrderConfigController', 
    ['$scope', 'proxyOrder', 'proxyAttentionType', 'proxyProvider', 'mModalAlert', 
    function($scope, proxyOrder, proxyAttentionType, proxyProvider, mModalAlert) {
      var title = 'Configurar Generación de Pedidos (Sucursal x Tipo Atención)';
      $scope.title = title;
      $scope.arg = {};
      $scope.noResultInfo = true;
      $scope.noResult = false;
      $scope.newOrder = {};

      document.title = title;

      getAttentionTypes = function() {
        proxyAttentionType.GetAttentionTypesFromMedicalCenters(false).then(function(response) {
          $scope.attentionTypes = response;
        });
      }

      getBranchOffices = function() {
        proxyProvider.GetBranchOffices(farmConstants.provider.mapfreId, true).then(function(response) {
            $scope.branchOffices = response;
        });
      }

      getAttentionTypes();

      getBranchOffices();

      $scope.search = function(filter) {
        $scope.noResultInfo = false;

        var branchOfficeId = $scope.arg.branchOffice && $scope.arg.branchOffice.id ? $scope.arg.branchOffice.id : null;
        var attentionTypeId = $scope.arg.attentionType && $scope.arg.attentionType.id ? $scope.arg.attentionType.id : null;

        proxyOrder.GetOrdersConfig(branchOfficeId, attentionTypeId, true).then(function(response) {
          $scope.ordersConfig = response;
          $scope.noResult = !$scope.ordersConfig || $scope.ordersConfig.length == 0 ? true : false;
        });
      }

      $scope.search();

      $scope.edit = function(order) {
        order.action = 2;
      }

      $scope.clearFilter = function() {
        $scope.arg = {};
        $scope.search();
      }

      showMsgError = function() {
          mModalAlert.showError('Ocurrió un error, comuníquece con el administrador.', 'Error');
      };
    }])
  });
  