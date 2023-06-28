(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper',
  '/polizas/app/documentos/proxy/documentosFactory.js',
  '/scripts/mpf-main-controls/components/documentTray/component/documentTray.js'], 
  function(angular, constants, helper){

    var appAutos = angular.module('appAutos');

    appAutos.controller('documentosController', 
      ['$scope', '$window', '$state', '$timeout', '$filter', 'documentosProducts', 
      function($scope, $window, $state, $timeout, $filter, documentosProducts){
    
        (function onLoad(){
          $scope.main = $scope.main || {};
          // $scope.firstStep = $scope.firstStep || {};
          // $scope.secondStep = $scope.secondStep || {};

          // if (documentosProducts) $scope.productoFilterData = documentosProducts;
          $scope.productoFilterData = documentosProducts;
          
        })();

    }]).factory('loaderDocumentosController', ['documentosFactory', '$q', function(documentosFactory, $q){
      var products;
      //Products
      function getProducts(userCode, showSpin){
        var deferred = $q.defer();
        documentosFactory.getProducts(userCode, showSpin).then(function(response){
          products = response.Data;
          deferred.resolve(products);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }
    
      return {
        getProducts: function(userCode, showSpin){
          if(products) return $q.resolve(products);
          return getProducts(userCode, showSpin);
        }
      }

    }])

  });