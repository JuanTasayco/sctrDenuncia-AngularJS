(function($root, deps, action) {
  define(deps, action);
})(this, ['angular', 'constants', 'helper', '/polizas/app/hogar/proxy/hogarFactory.js'], function(
  angular,
  constants,
  helper
) {
  var appAutos = angular.module('appAutos');

  appAutos
    .controller('hogarQuoteController', [
      '$scope',
      'oimPrincipal',
      'homeClaims',
      'proxyGeneral',
      function(
        $scope
        , oimPrincipal
        , homeClaims
        , proxyGeneral) {
        (function onLoad() {
          $scope.mainStep = $scope.mainStep || {};
          $scope.firstStep = $scope.firstStep || {};
          $scope.secondStep = $scope.secondStep || {};

          $scope.currencyType = constants.currencyType.dollar.description;
          $scope.formatDate = constants.formats.dateFormat;
          if (homeClaims) {
            $scope.mainStep.claims = {
              codigoUsuario: homeClaims[2].value.toUpperCase(), //Ejm: DBISBAL //username en el claim
              rolUsuario: homeClaims[12].value, //'ADMIN'
              nombreAgente: homeClaims[6].value.toUpperCase(), //DIRECTO . ORGANIZACION TERRITORIAL
              codigoAgente: homeClaims[7].value //Ejm: 9808 //agendid en el claim
            };
            $scope.userRoot = oimPrincipal.validateAgent('evoSubMenuEMISA','HOGAR');
            /* if (oimPrincipal.isAdmin() && $scope.mainStep.claims.nombreAgente != '') {
              $scope.userRoot = true;
            } */

            /*#########################
            # mAgente
            #########################*/
            $scope.mainStep.mAgente = {
              codigoAgente: $scope.mainStep.claims.codigoAgente,
              codigoNombre: $scope.mainStep.claims.codigoAgente + ' - ' + $scope.mainStep.claims.nombreAgente
            };
          }
          evalAgentViewDcto();
        })();

        function evalAgentViewDcto(){
          var params = {CodigoAgente: $scope.mainStep.claims.codigoAgente}
          proxyGeneral.EsDescuentoIntegralidadParaAgentes(params, false)
          .then(function(response){
            $scope.mainStep.viewDcto = response.Data
          });
        }
        /*#########################
        # mAgente + claims updated
        #########################*/
        $scope.saveAgent = function(agent) {
          var nombreAgente = agent.codigoNombre.split('-');
          $scope.mainStep.claims.codigoAgente = agent.codigoAgente;
          $scope.mainStep.claims.nombreAgente = nombreAgente[0].trim();
        };

        var listenAgent = $scope.$watch('mainStep.mAgente', function(nv, ov){
          if(nv === ov){
            return;
          }else{
            evalAgentViewDcto();
          }
        });
        $scope.$on('$destroy', function() {
          listenAgent(); // call the de-register function on scope destroy
      });


        $scope.$on('$stateChangeSuccess', function(s, state, param, d) {
          $scope.currentStep = param.step;
        });
      }
    ])
    .factory('loaderHogarQuoteController', [
      'hogarFactory',
      '$q',
      'mpSpin',
      function(hogarFactory, $q, mpSpin) {
        var claims,
          products,
          documentTypes,
          monitoringAlarm,
          category,
          constructionYears,
          currencyList;
        //Claims
        function getClaims(showSpin) {
          var deferred = $q.defer();
          hogarFactory.getClaims(showSpin).then(
            function(response) {
              claims = response;
              deferred.resolve(claims);
            },
            function(error) {
              deferred.reject(error.statusText);
            }
          );
          return deferred.promise;
        }
        //Products
        function getProducts() {
          var deferred = $q.defer();
          hogarFactory.getProducts().then(
            function(response) {
              products = response.Data;
              deferred.resolve(products);
            },
            function(error) {
              deferred.reject(error.statusText);
            }
          );
          return deferred.promise;
        }
        //DocumentTypes
        function getDocumentTypes() {
          var deferred = $q.defer();
          hogarFactory.getDocumentTypes().then(
            function(response) {
              documentTypes = response.Data;
              deferred.resolve(documentTypes);
            },
            function(error) {
              deferred.reject(error.statusText);
            }
          );
          return deferred.promise;
        }
        //ConstructionYears
        function getConstructionYears() {
          var deferred = $q.defer();
          hogarFactory.getConstructionYears().then(
            function(response) {
              constructionYears = response.Data;
              deferred.resolve(constructionYears);
            },
            function(error) {
              deferred.reject(error.statusText);
            }
          );
          return deferred.promise;
        }
        //Category
        function getCategory() {
          var deferred = $q.defer();
          hogarFactory.getCategory().then(
            function(response) {
              category = response.Data;
              deferred.resolve(category);
            },
            function(error) {
              deferred.reject(error.statusText);
            }
          );
          return deferred.promise;
        }
        //MonitoringAlarm
        function getMonitoringAlarm() {
          var deferred = $q.defer();
          hogarFactory.getMonitoringAlarm().then(
            function(response) {
              monitoringAlarm = response.Data;
              deferred.resolve(monitoringAlarm);
            },
            function(error) {
              deferred.reject(error.statusText);
            }
          );
          return deferred.promise;
        }

        //CurrencyList
        function getCurrencyList() {
          var deferred = $q.defer();
          hogarFactory.getCurrencyList().then(
            function(res) {
              currencyList = res.Data;
              deferred.resolve(currencyList);
            },
            function(error) {
              deferred.reject(error.statusText);
            }
          );
          return deferred.promise;
        }

        return {
          getClaims: function(showSpin) {
            if (claims) return $q.resolve(claims);
            return getClaims(showSpin);
          },
          getProducts: function(params) {
            if (products) return $q.resolve(products);
            return getProducts(params);
          },
          getDocumentTypes: function() {
            if (documentTypes) return $q.resolve(documentTypes);
            return getDocumentTypes();
          },
          getConstructionYears: function() {
            if (constructionYears) return $q.resolve(constructionYears);
            return getConstructionYears();
          },
          getCategory: function() {
            if (category) return $q.resolve(category);
            return getCategory();
          },
          getMonitoringAlarm: function() {
            if (monitoringAlarm) return $q.resolve(monitoringAlarm);
            return getMonitoringAlarm();
          },
          getCurrencyList: function() {
            if (currencyList) return $q.resolve(currencyList);
            return getCurrencyList();
          }
        };
      }
    ]);
});
