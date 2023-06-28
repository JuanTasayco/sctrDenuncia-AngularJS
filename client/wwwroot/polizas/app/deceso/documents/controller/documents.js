(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper',
  '/polizas/app/vida/proxy/vidaFactory.js'], 
  function(angular, constants, helper){

    var appAutos = angular.module('appDeceso');

    appAutos.controller('decesoDocumentsController', 
      ['$scope', '$window', '$state', '$timeout', '$filter', 'oimPrincipal', 'decesoAuthorize',   
      function($scope, $window, $state, $timeout, $filter, oimPrincipal, decesoAuthorize){
    
        (function onLoad(){
          $scope.main = $scope.main || {};
          $scope.codeModule = $state.current.nombreCorto || $state.toOimState.nombreCorto || null;
          $scope.main.isAdmin = true;//oimPrincipal.isAdmin();
          $scope.main.agent = oimPrincipal.getAgent();
          
          $scope.main.filterDate = $filter('date');

          $scope.vidaDocuments = {
            cotizadas:{
              code: 1,
              name: 'cotizadas',
              title: 'Cotizadas'
            },
            emitidasvi:{
              code: 2,
              name: 'emitidasvi',
              title: 'Emitidas Vigentes'
            },
            emitidasPro:{
              code: 3,
              name: 'emitidasPro',
              title: 'Emitidas Provisional'
            }
            
          };

        })();
        $scope.validate = function(itemName){
          return decesoAuthorize.menuItem($scope.codeModule, itemName);
        }
        $scope.$on('$stateChangeSuccess', function (s, state, param, d) {
          var page = _.find($scope.vidaDocuments, function(item){
            return item.name == param.doc;
          });
          $scope.currentDoc = page;
        });

    }]).factory('loaderDecesoDocumentsController', ['vidaFactory', '$q', function(vidaFactory, $q){
        var products;
      //Products
      function getProducts(showSpin){
        var deferred = $q.defer();
        vidaFactory.getProducts(showSpin).then(function(response){
          products = response.Data;
          deferred.resolve(products);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      return {
        getProducts: function(showSpin){
          if(products) return $q.resolve(products);
          return getProducts(showSpin);
        }
      };

    }]);

  });