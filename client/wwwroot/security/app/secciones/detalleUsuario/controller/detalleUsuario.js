(function ($root, deps, action) {
  define(deps, action)
})(this, ['angular'
  , 'constants'
  , 'helper'
  , 'messagesSeguridad'
  , 'seguridadFactory'],
  function (ng
    , constants
    , helper
    , messagesSeguridad) {

    var appSecurity = angular.module('appSecurity');

    appSecurity.controller('detalleUsuarioController',
      ['$scope'
        , '$window'
        , '$state'
        , '$timeout'
        , 'mainServices'
        , 'mModalAlert'
        , 'mModalConfirm'
        , 'seguridadFactory'
        , function ($scope
          , $window
          , $state
          , $timeout
          , mainServices
          , mModalAlert
          , mModalConfirm
          , seguridadFactory) {
            
          $scope.usuariosData = [messagesSeguridad.USER_TYPES_DESCRIPTION.REGULAR, messagesSeguridad.USER_TYPES_DESCRIPTION.ADMINISTRADOR] ;
          $scope.doubleSpace = '^(?!.*  ).+';

          (function onLoad() {
            //$scope.etiqueta = 'Activo';

            $scope.frmPersonales = {};
            $scope.frmContacto = {};
            $scope.frmCaracteristicas = {};

            $scope.data = $scope.data || {};

            $scope.id = $state.params.id;

            $timeout(function () {
              getDataViewDetails();
            }, 1000)

          })();

          function getDataViewDetails() {
            var promise = seguridadFactory.getDismaViewDetails($scope.id);
            promise.then(function (response) {
              $scope.data = response.data || response.Data;

              //tipo de grupo para filtrar roles
              $scope.typeGroup = $scope.data.numTipoGrupo;
              $scope.numUser = $scope.data.numUsuario;
              $scope.codeUser = $scope.data.codUsuario;
              $scope.usuariosData = $scope.usuariosData.filter(codUsuario);

            });
          }
          
          function codUsuario(usuario) {
            return usuario.codigo !== $scope.data.numTipoUsuario;
          }

          $scope.userTypeChange = function (numUsuario) {
            seguridadFactory.userTypeChange(numUsuario)
          }

        }])
  });
