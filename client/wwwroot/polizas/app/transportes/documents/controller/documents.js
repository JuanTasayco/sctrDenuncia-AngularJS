(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper',
  '/polizas/app/documentos/proxy/documentosFactory.js',
  '/scripts/mpf-main-controls/components/documentTray/component/documentTray.js'], 
  function(angular, constants, helper){

    var appAutos = angular.module('appAutos');

    appAutos.controller('transporteDocumentsController', 
      ['$scope', '$window', '$state', '$timeout', '$filter', 'transportProducts',  
      function($scope, $window, $state, $timeout, $filter, transportProducts){
    
        (function onLoad(){
          $scope.main = $scope.main || {};
          // $scope.firstStep = $scope.firstStep || {};
          // $scope.secondStep = $scope.secondStep || {};

          // if (transportProducts) $scope.productoFilterData = transportProducts
          $scope.productoFilterData = transportProducts

        })();

    }]).factory('loaderTransporteDocumentsController', ['documentosFactory', '$q', function(documentosFactory, $q){
      var products;
      //Products
      function getProducts(companyCode, codeRamo, showSpin){
        var deferred = $q.defer();
        documentosFactory.getProductsByRamo(companyCode, codeRamo, showSpin).then(function(response){
          products = response.Data;
          deferred.resolve(products);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }
    
      return {
        getProducts: function(companyCode, codeRamo, showSpin){
          if(products) return $q.resolve(products);
          return getProducts(companyCode, codeRamo, showSpin);
        }
      }

    }])

  });