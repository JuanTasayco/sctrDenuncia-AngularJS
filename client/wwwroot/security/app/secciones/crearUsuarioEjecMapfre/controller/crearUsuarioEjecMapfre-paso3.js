(function ($root, deps, action) {
  define(deps, action)
})(this, ['angular'
  , 'constants'
  , 'helper'
  , 'seguridadFactory']
  , function (ng
    , constants
    , helper
    , seguridadFactory) {

    var appSecurity = ng.module('appSecurity');

    appSecurity.controller('crearUsuarioEjecMapfrePaso3Controller',
      ['$scope'
        , '$window'
        , '$state'
        , '$timeout'
        , 'mainServices'
        , 'mModalAlert'
        , 'seguridadFactory'
        , function ($scope
          , $window
          , $state
          , $timeout
          , mainServices
          , mModalAlert
          , seguridadFactory) {

          (function onLoad() {

            if (!$scope.create.validStep1)
              $state.go('crearUsuarioEjecMapfre.steps', { step: 1 });
            else if (!$scope.create.validStep2)
              $state.go('crearUsuarioEjecMapfre.steps', { step: 2 });
            else {
              // $scope.user = $state.params.user;
              $scope.create = $scope.create || {};
              $scope.createS1 = $scope.createS1 || {};
              $scope.createS2 = $scope.createS2 || {};
              $scope.createS3 = $scope.createS3 || {};

              $scope.login = seguridadFactory.getVarLS("profile");

              //Variables de roles y accesos
              $scope.showRoleAccess = true;
              $scope.isCreate = $scope.createS3.isCreate;
              $scope.typeGroup = $scope.createS2.user.codeTipoGrupo;
              $scope.typeUser = 2; //Ejecutivo Mapfre : Administrador
              $scope.numUser = $scope.createS3.numUser;
              $scope.codeUser = $scope.login.username;
              $scope.existRole = false;
              $scope.isFinalizar = true;
              if ($scope.typeUser == 2)
                $scope.isUserAdmin = true;
              else
                $scope.isUserAdmin = false;

              $scope.email = $scope.createS2.user.email;
              $scope.person = $scope.createS2.user.nombrePersona;
              $scope.successUser = {
                successUser: false
              };

            }

          })();

        }])
  });  