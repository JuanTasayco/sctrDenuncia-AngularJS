(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper'],
  function(angular, constants, helper){

    var appAutos = angular.module('appAutos');

    appAutos.controller('sctrHomeController',
      ['$scope', 'isAgentBloqued', '$window', '$state', '$timeout', '$rootScope', 'oimAuthorize',  'oimClaims', 'proxySctr',
      function($scope, isAgentBloqued, $window, $state, $timeout, $rootScope, oimAuthorize, oimClaims, proxySctr){
        console.log('sctrHomeController');

       (function onLoad(){
          $scope.formData = $rootScope.formData || {};
          $scope.formData.agentID = oimClaims.agentID;
        })();

        $scope.isShowSuscriptor = !!oimAuthorize.isAuthorized($state.get("sctrSuscriptores"));
        $scope.isAllowed = !!oimAuthorize.isAuthorized($state.get("sctrDocumentos"));
        $scope.isShowParam = !!oimAuthorize.isAuthorized($state.get("sctrParametros"));
        $scope.isBlocked = isAgentBloqued;
        $scope.isShowMantenimiento = !!oimAuthorize.isAuthorized($state.get("sctrManagment"));

        if ($scope.isBlocked) {
          proxySctr.ValidarAgente()
          .then(function(response){
            $scope.usuarioBloqueado = response.Message;
          });
        }


        $scope.seleccionarTipo = function(tipo){
          if ($scope.isBlocked) return;
          $rootScope.formData = {};
          if(tipo==1){//periodo corto
            $state.go('sctrEmitir.steps', {tipo:constants.module.polizas.sctr.periodoCorto.TipoPeriodo, quotation: 0, step: 1}, {reload: true, inherit: false});
          }else{//periodo largo
            $state.go('sctrEmitir.steps', {tipo:constants.module.polizas.sctr.periodoNormal.TipoPeriodo, quotation:0, step: 1}, {reload: true, inherit: false});
          }

        }

    }])

  });
