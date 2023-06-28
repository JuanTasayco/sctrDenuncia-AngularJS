define([
  'angular', 'constants',
  '/polizas/app/soat/emit/service/soatFactory.js'
], function(angular, constants){

  var appSoat = angular.module('appSoat');

  appSoat.controller('soatEmitController', ['$scope', 'oimPrincipal', '$window', '$state', 'soatFactory', '$rootScope', 'claims', 'proxySoat','proxyReferido','mModalAlert','mModalConfirm',
    function($scope, oimPrincipal, $window, $state, soatFactory, $rootScope, claims, proxySoat,proxyReferido,mModalAlert,mModalConfirm){

    (function onLoad(){
      $scope.formData = $scope.formData || {};
      $scope.disableSgt = false;
      
      if (claims){
        $scope.formData.claims = {
          codigoUsuario:  claims[2].value.toUpperCase(), //Ejm: DBISBAL //username en el claim
          rolUsuario:     claims[12].value, //'ADMIN'
          nombreAgente:   claims[6].value.toUpperCase(),
          codigoAgente:   claims[7].value //Ejm: 9808 //agendid en el claim
        }
        $scope.userRoot = false;
        if (oimPrincipal.isAdmin() && $scope.formData.claims.nombreAgente != ''){
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
        
        _validateReferredNumber();
        

    })();

    $scope.saveAgent = function(agent){
      $scope.formData.claims.codigoAgente = agent.codigoAgente;
      $scope.mAgente.codigoUsuario = $scope.formData.claims.codigoUsuario;
      $scope.mAgente.codigoAgente = agent.codigoAgente;//$scope.formData.claims.codigoAgente;
      $scope.mAgente.codigoNombre = agent.codigoNombre;//$scope.formData.claims.codigoAgente + "-" + $scope.formData.claims.nombreAgente;
      _validateReferredNumber();

      if(oimPrincipal.get_role() == "ADMIN" ||
          oimPrincipal.get_role() == "GST" ||
          oimPrincipal.get_role() == "EAC" ){

        proxySoat.ValidarAgentePorCodigo($scope.mAgente.codigoAgente, false).then(function(response){
            if(response.Data && response.Data.Bloqueado == "1"){
              $scope.formData.isBlocked = true;
            }else{
              $scope.formData.isBlocked = false;
            }
          }, function(response){
            $scope.formData.isBlocked = false;
          });
        }else{
          proxySoat.ValidarAgente(false).then(function(response){
            if(response.Data && response.Data.Bloqueado == "1"){
              $scope.formData.isBlocked = true;
            }else{
              $scope.formData.isBlocked = false;
            }
          }, function(response){
            $scope.formData.isBlocked = false;
          });
        }
    }

    $scope.$watch('formData', function(nv)
    {
      $rootScope.formData =  nv;
    })

    $scope.gLblTitle = 'Emisión póliza SOAT';

    $scope.currencyType = constants.currencyType.dollar;

    $scope.$on('$stateChangeSuccess', function (s, state, param, d) {
      $scope.currentStep = param.step;
    });
    
    function _validateReferredNumber() {
      if($scope.formData.numReferido){
        proxyReferido.ValidateReferredNumber($scope.formData.numReferido,"ambos", $scope.mAgente.codigoAgente,$scope.userRoot, true)              
        .then(function(response){
            if(response.data == "F1" || response.data == "F2"){
              mModalAlert.showWarning(response.mensaje, '')
              window.location.href = "/polizas/#"
            }
            else if (response.data == "F3"){
              if($scope.userRoot){
                mModalAlert.showWarning(response.mensaje, '')
                $scope.disableSgt = true;
                $scope.formData.msjReferidoValidate = response.mensaje;
              }
              else{
              mModalAlert.showWarning(response.mensaje, '')
              window.location.href = "/polizas/#"
              }
            }
            else{
              $scope.disableSgt = false;
              $scope.formData.msjReferidoValidate = null;
            }
          });
      }
    }


    /*#########################
    # Steps
    #########################*/
    $scope.nav = {}
    $scope.nav.go = function (step){
      var e = { cancel : false, step: step }
      $scope.$broadcast('changingStep', e);
      return !e.cancel;
    }

  }]).factory('loaderSoatEmit', ['soatFactory', '$q', function(soatFactory, $q){

    return;
  }])


  appSoat.factory('loaderSOATController', ['soatFactory', '$q', 'mpSpin', function(soatFactory, $q, mpSpin){
      var claims;
      //Claims
      function getClaims(){
       var deferred = $q.defer();
        soatFactory.getClaims().then(function(response){
          claims = response;
          deferred.resolve(claims);
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

  appSoat.filter('isEmpty', function () {
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

