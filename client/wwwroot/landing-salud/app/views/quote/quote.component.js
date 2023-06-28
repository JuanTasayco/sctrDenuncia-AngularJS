(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'appConstant'],
function(angular, appConstant) {

  QuoteController.$inject = ['$scope','$window'];
  function QuoteController($scope, $window) {
    $scope.gLblTitle = 'Suscripción';
    $scope.credential = 'dXNlcnNhbHVkOnVzM3JzNGx1ZC4yMDIx';
    
    (function onLoad(){

      $window.onbeforeunload = function () {
       localStorage.clear();
        return 'Si refresca la pagina perdera la session';
       }

      $scope.nav = {};
      $scope.ubigeos = $scope.ubigeos || {};

      $scope.nav.go = function (step) {
        var e = { cancel : false, step: step };
        $scope.$broadcast('changingStep', e);
        return !e.cancel;
      }
    }    
    )();


    $scope.$on('$destroy', function $destroy(){
      stateChangeSuccess();
    });

    var stateChangeSuccess = $scope.$on('$stateChangeSuccess', function (s, state, param) {
      $scope.currentStep = param.step;
    });
  }

  return angular
    .module(appConstant.appModule)
    .controller('QuoteController', QuoteController);

});
