(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper',
  '/polizas/app/documentos/proxy/documentosFactory.js',
  '/scripts/mpf-main-controls/components/documentTray/component/documentTray.js'],
  function(angular, constants, helper){

    var appAutos = angular.module('appAutos');

    appAutos.controller('hogarDocumentsController',
      ['$scope', '$window', '$state', '$timeout', '$filter', 'homeProducts', 'hogarFactory',
      function($scope, $window, $state, $timeout, $filter, homeProducts, hogarFactory){

        (function onLoad(){
          $scope.main = $scope.main || {};
          $scope.productoFilterData = homeProducts;
          if ($scope.productoFilterData[0].Codigo === 0) {
            $scope.productoFilterData.splice(0, 1);
          }

          $scope.moduleHogar = true;

        })();

    }]).factory('loaderHogarDocumentsController', ['documentosFactory', '$q', 'hogarFactory', function(documentosFactory, $q, hogarFactory){
      var products;
      //Products
      function getProducts(companyCode, codeRamo, showSpin){
        var deferred = $q.defer();
        hogarFactory.getProducts(companyCode, codeRamo, showSpin).then(function(response){
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
