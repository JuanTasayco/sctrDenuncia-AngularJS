define([
  'angular', 'constants',
  '/polizas/app/autos/autosCotizar2/service/autosCotizarFactory.js'
], function(angular, constants){

  var appAutos = angular.module('appAutos');

  appAutos.controller('autosCotizarController2', ['$scope', 'oimPrincipal', '$window', '$state', 'autosCotizarFactory', '$rootScope', 'claims','proxyReferido','mModalAlert', function($scope, oimPrincipal, $window, $state, autosCotizarFactory, $rootScope, claims,proxyReferido,mModalAlert){
    console.log('autosCotizarController2');

   (function onLoad(){
      $scope.formData = $rootScope.formData || {};
      $scope.disableSgt = false;
      
      if (claims){
        $scope.formData.claims = {
          codigoUsuario:  claims[2].value.toUpperCase(), //Ejm: DBISBAL //username en el claim
          rolUsuario:     claims[12].value, //'ADMIN'
          nombreAgente:   claims[6].value.toUpperCase(),
          codigoAgente:   claims[7].value //Ejm: 9808 //agendid en el claim
        }
        $scope.userRoot = false;
        if ((oimPrincipal.isAdmin()) && $scope.formData.claims.nombreAgente != ''){
          $scope.userRoot = true;
        }

        $scope.mAgente = {
          codigoAgente: $scope.formData.claims.codigoAgente,
          codigoNombre: $scope.formData.claims.codigoAgente + "-" + $scope.formData.claims.nombreAgente,
          importeAplicarMapfreDolar:0,
          mcamapfreDolar:"",
          codigoEstadoCivil:0,
          codigoUsuario: $scope.formData.claims.codigoUsuario
        };
      }
      
      $scope.formData.numReferido = JSON.parse(window.localStorage.getItem('profile')).numeroReferido;

      if($scope.userRoot){
        _validateReferredNumber();
      }
    
    })();

    $scope.saveAgent = function(agent){
      $scope.formData.claims.codigoAgente = agent.codigoAgente;
      $scope.mAgente.codigoUsuario = $scope.formData.claims.codigoUsuario;
      _validateReferredNumber();
    }

    function _validateReferredNumber() {
      if($scope.formData.numReferido){
      proxyReferido.ValidateReferredNumber($scope.formData.numReferido,"ambos", $scope.mAgente.codigoAgente,$scope.userRoot, true)              
      .then(function(response){
          if (response.data == "F1" || response.data == "F2"){
            mModalAlert.showWarning(response.mensaje, '')
            window.location.href = "/polizas/#"
          }
          else if(response.data == "F3" ){
            mModalAlert.showWarning(response.mensaje, '')
            $scope.disableSgt = true;
            $scope.formData.msjReferidoValidate = response.mensaje;
          }
          else{
            $scope.disableSgt = false;
            $scope.formData.msjReferidoValidate = null;
          }
        });
    }
  }

    
    $scope.$watch('formData', function(nv)
    {
      $rootScope.formData =  nv;
    })

    $scope.currencyType = constants.currencyType.dollar;

    $scope.gLblProducto = {
      label:'¿Qué producto quieres cotizar',
      required: true,
      error1: '* Este campo es obligatorio',
      defaultValue: '- SELECCIONE -'
    };

    $scope.gLblUsoRiesgo = {
      label:'Tipo de uso',
      required: true,
      error1: '* Este campo es obligatorio',
      defaultValue: '- SELECCIONE -'
    };

    $scope.isEmblem = false;

    $scope.validationForm = function () {
      return $scope.frmAutosCotizar.$valid && !$scope.frmAutosCotizar.$pristine;
    };

    $scope.$on('$stateChangeSuccess', function (s, state, param, d) {
      $scope.currentStep = param.step;
    });

    /*#########################
    # Steps
    #########################*/
    $scope.nav = {};
    $scope.nav.go = function (step){
      var e = { cancel : false, step: step }
      $scope.$broadcast('changingStep', e);
      return !e.cancel;
    }

  }])

  appAutos.factory('loaderAutosCotizar', ['autosCotizarFactory', '$q', function(autosCotizarFactory, $q){
     var claims;
    //Claims
    function getClaims(){
     var deferred = $q.defer();
      autosCotizarFactory.getClaims().then(function(response){
        claims = response;
        deferred.resolve(response);
      }, function (error){
        deferred.reject(error.statusText);
      });
      return deferred.promise;
    }

    return {
      getClaims: function(){
        if(claims) return $q.resolve(claims);
        return getClaims();
      }
    }
  }])

  appAutos.filter('makePositive', function() {
    return function(num) { return Math.abs(num); }
  });

  appAutos.filter('isEmpty', function () {
    var bar;
    return function (obj) {
      for (bar in obj) {
        if (obj.hasOwnProperty(bar)) {
          return false;
        }
      }
      return true;
    };
  });

});
