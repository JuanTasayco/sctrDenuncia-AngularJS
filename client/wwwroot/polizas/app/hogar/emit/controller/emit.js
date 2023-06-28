(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper',
  '/polizas/app/hogar/proxy/hogarFactory.js'],
  function(angular, constants, helper){

    var appAutos = angular.module('appAutos');

    appAutos.controller('hogarEmitController',
      ['$scope', '$window', '$state', 'hogarFactory', '$timeout', 'homeClaims', 'homeQuotation', '$filter',
      function($scope, $window, $state, hogarFactory, $timeout, homeClaims, homeQuotation, $filter){

        (function onLoad(){
          $scope.mainStep = $scope.mainStep || {};
          $scope.firstStep = $scope.firstStep || {};
          $scope.secondStep = $scope.secondStep || {};
          $scope.thirdStep = $scope.thirdStep || {};

          $scope.constants = $scope.constants || {};
          $scope.filters = $scope.filters || {};
          $scope.functions = $scope.functions || {};


          $scope.constants.currencyType = constants.currencyType.dollar.description;
          $scope.constants.formatDate = constants.formats.dateFormat;
          $scope.filters.filterDate = $filter('date');

          $scope.mainStep.stepActive = 0;


          if (homeClaims){
            $scope.mainStep.claims = {
              codigoUsuario:  homeClaims[2].value.toUpperCase(), //Ejm: DBISBAL //username en el claim
              rolUsuario:     homeClaims[12].value, //'ADMIN'
              nombreAgente:   homeClaims[6].value.toUpperCase(),
              codigoAgente:   homeClaims[7].value //Ejm: 9808 //agendid en el claim
            }
          }

          (homeQuotation) ? $scope.mainStep.quotationData = homeQuotation : $state.go('hogarHome');

        })();


        $scope.$on('$stateChangeSuccess', function (s, state, param, d) {
          $scope.currentStep = param.step;
        });

        /*#########################
        # Steps
        #########################*/
        $scope.nav = {}
        $scope.nav.go = function (step){
          var e = { cancel : false, step: step }
          $scope.$broadcast('changingStep', e);
          return !e.cancel;
        }



    }]).factory('loaderHogarEmitController', ['hogarFactory', '$q', function(hogarFactory, $q){
      var claims, financing, endorsee, types, materials, quotation;

      //Claims
      function getClaims(){
       var deferred = $q.defer();
        hogarFactory.getClaims().then(function(response){
          claims = response;
          deferred.resolve(claims);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      //Financing
      function getFinancingType(){
       var deferred = $q.defer();
        hogarFactory.getFinancingType().then(function(response){
          financing = response.Data;
          deferred.resolve(financing);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      //Endorsee
      function getEndorsee(){
       var deferred = $q.defer();
        hogarFactory.getEndorsee().then(function(response){
          endorsee = response.Data;
          deferred.resolve(endorsee);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      //Types
      function getTypes(){
       var deferred = $q.defer();
        hogarFactory.getTypes().then(function(response){
          types = response.Data;
          deferred.resolve(types);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      //Materials
      function getMaterials(){
       var deferred = $q.defer();
        hogarFactory.getMaterials().then(function(response){
          materials = response.Data;
          deferred.resolve(materials);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      //Quotation
      function getQuotation(quotationNumber, showSpin){
       var deferred = $q.defer();
        hogarFactory.getQuotation(quotationNumber, showSpin).then(function(response){
          quotation = response.Data;
          deferred.resolve(quotation);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      return {
        getClaims: function(){
          if(claims) return $q.resolve(claims);
          return getClaims();
        },
        getFinancingType: function(){
          if(financing) return $q.resolve(financing);
          return getFinancingType();
        },
        getEndorsee: function(){
          if(endorsee) return $q.resolve(endorsee);
          return getEndorsee();
        },
        getTypes: function(){
          if(types) return $q.resolve(types);
          return getTypes();
        },
        getMaterials: function(){
          if(materials) return $q.resolve(materials);
          return getMaterials();
        },
        getQuotation: function(quotationNumber, showSpin){
          if(quotation) return $q.resolve(quotation);
          return getQuotation(quotationNumber, showSpin);
        }
      }

    }])

  });
