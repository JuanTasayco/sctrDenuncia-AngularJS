(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper',
  '/polizas/app/documentos/proxy/documentosFactory.js',
  '/scripts/mpf-main-controls/components/documentTray/component/documentTray.js'], 
  function(angular, constants, helper){

    var appAutos = angular.module('appAutos');

    appAutos.controller('accidentesDocumentsController', 
      ['$scope', '$window', '$state', '$timeout', '$filter', 'accidentsProducts',  
      function($scope, $window, $state, $timeout, $filter, accidentsProducts){
    
        (function onLoad(){
          $scope.main = $scope.main || {};
          // $scope.firstStep = $scope.firstStep || {};
          // $scope.secondStep = $scope.secondStep || {};

          // if (carProducts) $scope.productoFilterData = carProducts
          $scope.productoFilterData = accidentsProducts

        })();

    }]).factory('loaderAccidentesDocumentsController', ['documentosFactory', '$q', function(documentosFactory, $q){
      var products;
      //Products
      function getProducts(companyCode, codeRamo, showSpin){
        var deferred = $q.defer();
        //debugger;
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