(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper',
  '/polizas/app/documentos/proxy/documentosFactory.js',
  '/scripts/mpf-main-controls/components/documentTray/component/documentTray.js'],
  function(angular, constants, helper){

    var appAutos = angular.module('appAutos');

    appAutos.controller('autosDocumentsController',
      ['$scope', '$window', '$state', '$timeout', '$filter', 'carProducts',
      function($scope, $window, $state, $timeout, $filter, carProducts){

        document.title = 'OIM - Pólizas Autos - Documentos autos';

        (function onLoad(){
          $scope.main = $scope.main || {};
          $scope.productoFilterData = carProducts

        })();

    }]).factory('loaderAutosDocumentsController', ['documentosFactory', '$q', function(documentosFactory, $q){
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
