define(['angular', 'constants'], function (ng, constants) {

  RegistrarAvisoController.$inject = ['$scope', '$state', 'authorizedResource', 'oimClaims', 'mpSpin', 'mModalAlert'];

  function RegistrarAvisoController($scope, $state, authorizedResource, oimClaims, mpSpin, mModalAlert) {
    (
      function onLoad() {
        $scope.masters = {};
        $scope.test = true;

        loadInitialData();

        function loadInitialData() {
          var groupApplication = parseInt(oimClaims.userSubType);
          $scope.masters.loginUserName = authorizedResource.profile.loginUserName;
          groupApplication = 1; //default
          $scope.masters.groupApplication = groupApplication;       
        }
      }
    )();
  }

  return ng.module('atencionsiniestrosagricola.app')
    .controller('RegistrarAvisoController', RegistrarAvisoController);
});