(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper',
  '/polizas/app/autos/autosEmitirUsado/service/usedCarEmitFactory.js'],
  function(angular, constants, helper){

  var appAutos = angular.module('appAutos');

  appAutos.controller('usedCarEmitController',
    ['$scope', 'oimPrincipal', '$window', '$state', 'usedCarEmitFactory', '$timeout', 'carClaims','proxyReferido','mModalAlert',
    function($scope, oimPrincipal, $window, $state, usedCarEmitFactory, $timeout, carClaims,proxyReferido,mModalAlert){

    (function onLoad(){
      $scope.mainStep = $scope.mainStep || {};
      $scope.firstStep = $scope.firstStep || {};
      $scope.secondStep = $scope.secondStep || {};
      $scope.thirdStep = $scope.thirdStep || {};
      $scope.fourthStep = $scope.fourthStep || {};
      $scope.fiveStep = $scope.fiveStep || {};
      $scope.summaryStep = $scope.summaryStep || {};
      $scope.formData = {};

      $scope.currencyType = constants.currencyType.dollar.description;
      $scope.formatDate = constants.formats.dateFormat;
      if (carClaims){ //Falta el ROLUSUARIO, para validar
        $scope.mainStep.claims = {
          codigoUsuario: carClaims[2].value.toUpperCase(), //Ejm: DBISBAL //username en el claim
          rolUsuario: carClaims[12].value, //'ADMIN', //carClaims[5].value,
          nombreAgente: carClaims[6].value.toUpperCase(),
          codigoAgente: carClaims[7].value //Ejm: 9808 //agendid en el claim
        }
        $scope.userRoot = false;
        if ((oimPrincipal.isAdmin()) && $scope.mainStep.claims.nombreAgente != ''){
          $scope.userRoot = true;  // console.log('admin');
        }

        /*#########################
        # mAgente
        #########################*/
        $scope.mainStep.mAgente = {
          codigoNombre: $scope.mainStep.claims.codigoAgente + ' - ' + $scope.mainStep.claims.nombreAgente
        };
      }
      $scope.formData.numReferido = JSON.parse(window.localStorage.getItem('profile')).numeroReferido;
      _validateReferredNumber();
    })();

    function _validateReferredNumber() {
      if($scope.formData.numReferido){
        proxyReferido.ValidateReferredNumber($scope.formData.numReferido,"ambos", $scope.mainStep.claims.codigoAgente ,$scope.userRoot, true)              
        .then(function(response){
            if (response.data == "F1" || response.data == "F2" || response.data == "F3" ){
              mModalAlert.showWarning(response.mensaje, '')
              window.location.href = "/polizas/#"
            }
            else{
              $scope.numReferidoIsValid = true;
              $scope.formData.msjReferidoValidate = null;
            }
          });
      }
    }

    $scope.saveAgent = function(agent){
      var nombreAgente = agent.codigoNombre.split('-');
      $scope.mainStep.claims.codigoAgente = agent.codigoAgente;
      $scope.mainStep.claims.nombreAgente = nombreAgente[1].trim();
    }

    $scope.nav = {}
    $scope.nav.go = function (step){
      var e = { cancel : false, step: step }
      $scope.$broadcast('changingStep', e);
      if (!e.cancel)
        $state.go('usedEmit.steps', {step: step })
    }

    $scope.$on('$stateChangeSuccess', function (s, state, param, d) {
      $scope.currentStep = param.step;
    });


  }]).factory('loaderUsedCarEmit', ['usedCarEmitFactory', '$q', 'oimPrincipal', function(usedCarEmitFactory, $q, oimPrincipal){
    var colors, products, endorsee, discountCommission, discountCommissionParams, gps, claims, newProducts;
    //Colors
    function getColors(){
      var deferred = $q.defer();
      usedCarEmitFactory.getColors().then(function(response){
        colors = response.Data;
        deferred.resolve(response.Data);
      }, function (error){
        deferred.reject(error.statusText);
      });
      return deferred.promise;
    }

    //Products
    function getProducts(params){
      var deferred = $q.defer();
      usedCarEmitFactory.getProducts(params).then(function(response){
        products = response.Data;
        deferred.resolve(response.Data);
      }, function (error){
        deferred.reject(error.statusText);
      });
      return deferred.promise;
    }

    //Endorsee
    function getEndorsee(){
      var deferred = $q.defer();
      usedCarEmitFactory.getEndorsee().then(function(response){
        endorsee = response.Data;
        deferred.resolve(response.Data);
      }, function (error){
        deferred.reject(error.statusText);
      });
      return deferred.promise;
    }
    //DiscountsCommission
    function getDiscountCommission(params){
      var deferred = $q.defer();
      usedCarEmitFactory.getDiscountCommission(params).then(function(response){
        discountCommission = response.Data;
        discountCommissionParams = params;
        deferred.resolve(response.Data);
      }, function (error){
        deferred.reject(error.statusText);
      });
      return deferred.promise;
    }
    //Gps
    function getGps(params){
      var deferred = $q.defer();
      usedCarEmitFactory.getGps(params).then(function(response){
        gps = response.Data;
        deferred.resolve(response.Data);
      }, function (error){
        deferred.reject(error.statusText);
      });
      return deferred.promise;
    }
    //Claims
    function getClaims(){
     var deferred = $q.defer();
      usedCarEmitFactory.getClaims().then(function(response){
        claims = response;
        deferred.resolve(response);
      }, function (error){
        deferred.reject(error.statusText);
      });
      return deferred.promise;
    }

    //NewProducts
    function getNewProducts(showSpin){
     var deferred = $q.defer();
      usedCarEmitFactory.getNewProducts(showSpin).then(function(response){
        newProducts = response;
        deferred.resolve(newProducts);
      }, function (error){
        deferred.reject(error.statusText);
      });
      return deferred.promise;
    }



    return {
      getColors: function(){
        if(colors) return $q.resolve(colors);
        return getColors();
      },
      getProducts: function(params){
        if (params){
          if(products) return $q.resolve(products);
          return getProducts(params);
        }
      },
      getEndorsee: function(){
        if(endorsee) return $q.resolve(endorsee);
        return getEndorsee();
      },
      getDiscountCommission: function(params){
        if (params){
          if(discountCommission && params.CodigosProductos[0] === (discountCommissionParams && discountCommissionParams.CodigosProductos[0])) return $q.resolve(discountCommission);
          return getDiscountCommission(params);
        }
      },
      getGps: function(params){
        if (params){
          if(gps) return $q.resolve(gps);
          return getGps(params);
        }
      },
      getClaims: function(){
        if(claims) return $q.resolve(claims);
        return getClaims();
      },
      getNewProducts: function(showSpin){
        if(newProducts) return $q.resolve(newProducts);
        return getNewProducts(showSpin);
      }
    }

  }])
});
