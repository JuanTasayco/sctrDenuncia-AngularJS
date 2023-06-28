(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper',
  '/polizas/app/documentos/proxy/documentosFactory.js',
  '/scripts/mpf-main-controls/components/documentTray/component/documentTray.js'],
  function(angular, constants, helper){

    var appAutos = angular.module('appAutos');

    appAutos.controller('soatDocumentsController',
      ['$scope', '$window', '$state', '$timeout', '$filter', 'soatProducts',
      function($scope, $window, $state, $timeout, $filter, soatProducts){

        document.title = 'OIM - Pólizas SOAT - Documentos SOAT';
        (function onLoad(){
          $scope.main = $scope.main || {};
          $scope.productoFilterData = soatProducts

        })();

    }]).factory('loaderSoatDocumentsController', ['documentosFactory', '$q', function(documentosFactory, $q){
      var products;
      //Products
      function getProducts(params, showSpin){
        var deferred = $q.defer();
        documentosFactory.getProductsByUser(params, showSpin).then(function(response){
          products = response.Data;
          deferred.resolve(products);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      return {
        getProducts: function(params, showSpin){
          if(products) return $q.resolve(products);
          return getProducts(params, showSpin);
        }
      }

    }])

  });
