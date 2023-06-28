(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper',
  '/polizas/app/empresa/factory/empresasFactory.js',
  '/scripts/mpf-main-controls/components/documentTray/component/documentTray.js'],
  function(angular, constants, helper){

    var appAutos = angular.module('appAutos');

    appAutos.controller('companyDocumentsController',
      ['$scope', '$window', '$state', '$timeout', '$filter', 'companyProducts',
      function($scope, $window, $state, $timeout, $filter, companyProducts){

        (function onLoad(){
          $scope.main = $scope.main || {};
          $scope.productoFilterData = companyProducts

        })();

    }]).factory('loaderCompanyDocumentsController', ['empresasFactory', '$q', function(empresasFactory, $q){
      var products;
      //Products
      function getProducts(companyCode){
        var deferred = $q.defer();
        empresasFactory.getProductsList(companyCode).then(function(response){
          products = response.Data;
          deferred.resolve(products);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      return {
        getProducts: function(companyCode){
          if(products) return $q.resolve(products);
          return getProducts(companyCode);
        }
      };

    }]);

  });
