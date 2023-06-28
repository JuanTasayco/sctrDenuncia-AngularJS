(function ($root, deps, action) {
  define(deps, action)
})(this, ['angular'
  , 'constants'
  , 'helper'],
  function (ng
    , constants
    , helper) {

    var appSecurity = ng.module('appSecurity');

    appSecurity.controller('crearUsuarioProveedor03Controller',
      ['$scope'
        , '$state'
        , '$timeout'
        , 'seguridadFactory'
        , 'mModalAlert'
        , function ($scope
          , $state
          , $timeout
          , seguridadFactory
          , mModalAlert) {

          (function onLoad() {

            if (!$scope.create.validStep1)
              $state.go('crearUsuarioProveedor.steps', { step: 1 });
            else if (!$scope.create.validStep2)
              $state.go('crearUsuarioProveedor.steps', { step: 2 });
            else {
              $scope.create = $scope.create || {};
              $scope.createS1 = $scope.createS1 || {};
              $scope.createS2 = ($scope.create.validStep1) ? $scope.createS2 : {};
              $scope.createS3 = ($scope.create.validStep2) ? $scope.createS3 : {};

              $scope.create.disabled = true;
              $scope.createS2.isEdit = true;

              $scope.created = {};
              $scope.created.step1 = $scope.createS1;
              $scope.created.step2 = $scope.createS2;
              $scope.created.step3 = $scope.createS3;

              $scope.login = seguridadFactory.getVarLS("profile");

              //Variables de roles y accesos
              $scope.showRoleAccess = true;
              $scope.isCreate = $scope.createS3.isCreate;
              $scope.typeGroup = $scope.createS3.user.details.numTipoGrupo;
              $scope.typeUser = parseInt($scope.createS2.provider.mTipoUsuario); //Ejecutivo Mapfre : Administrador
              $scope.numUser = parseInt($scope.createS3.user.numUsuario);
              $scope.codeUser = $scope.login.username;
              $scope.existRole = false;
              $scope.isFinalizar = true;
              if ($scope.typeUser == 2)
                $scope.isUserAdmin = true;
              else
                $scope.isUserAdmin = false;
              $scope.email = $scope.createS3.user.details.correo;
              $scope.person = $scope.createS3.user.details.nombres + " " + $scope.createS3.user.details.apellidoPaterno + " " + $scope.createS3.user.details.apellidoMaterno;
              $scope.successUser = {
                successUser: false
              };
            }

          })();

        }])
  });
