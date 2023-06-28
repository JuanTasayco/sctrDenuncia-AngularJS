(function($root, deps, action) {
    define(deps, action)
})(this, ['angular', 'constants', 'system'],
  function(angular, constants, system) {

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('nsctrHomeController',
    ['$scope', 'authorizedResource', '$state', 'oimClaims', 'nsctrAuthorize',
    function($scope, authorizedResource, $state, oimClaims, nsctrAuthorize) {
      /*########################
      # onLoad
      ########################*/
      (function onLoad(){
        $scope.isMYD = window.localStorage['appOrigin'] === constants.originApps.myDream;
        $scope.isOIM = !$scope.isMYD;

        nsctrAuthorize.getHomeMenu(oimClaims, authorizedResource.accessMenu)
          .then(function(response) {
            $scope.secondDesign = response.length < 3;
            if (response.length){
              $scope.menu = response;
            } else {
              $state.go('accessDenied');
            }
          });
      })();
  }]);
});
